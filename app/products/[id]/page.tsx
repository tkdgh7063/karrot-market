import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import { Metadata } from "next";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getIsOwner(userId: number) {
  // const session = await getSession();
  // if (session.id) return Boolean(session.id === userId);
  return false;
}

async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    select: {
      title: true,
    },
  });
  return product;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

const getCachedProductTitle = nextCache(
  getProductTitle,
  ["karrot-product-title"],
  { tags: ["product-title"] },
);

const getCachedProduct = nextCache(getProduct, ["karrot-product-detail"], {
  tags: ["product-title", "product-detail"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = Number((await params).id);
  const product = await getCachedProductTitle(id);

  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);
  const revalidate = async () => {
    "use server";
    revalidateTag("product-title");
  };

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          src={product.photo ?? ""}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-3 border-b border-neutral-700 p-5">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed bottom-0 left-0 flex w-full items-center justify-between bg-neutral-800 p-5 pb-10">
        <span className="text-xl font-semibold">
          {formatToWon(product.price)} Won
        </span>
        <form action={revalidate}>
          <button className="rounded-md bg-red-500 px-4 py-2.5 font-semibold text-white">
            Revalidate
          </button>
        </form>
        {isOwner ? (
          <Link
            className="rounded-md bg-red-500 px-4 py-2.5 font-semibold text-white"
            href={``}
          >
            Delete Product
          </Link>
        ) : (
          <Link
            className="rounded-md bg-orange-500 px-4 py-2.5 font-semibold text-white"
            href={``}
          >
            Chat with seller
          </Link>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { id: true } });
  return products.map((product) => ({ id: product.id + "" }));
}

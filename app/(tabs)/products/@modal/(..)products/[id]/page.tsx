import ExitButton from "@/components/exit-btn";
import FormattedDate from "@/components/formatted-date";
import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { redirect } from "next/navigation";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default async function ProductModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await sleep(3000);

  const id = Number((await params).id);
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      description: true,
      price: true,
      photo: true,
      user: true,
      created_at: true,
      edited: true,
    },
  });
  if (!product) {
    return redirect("/products");
  }

  return (
    <div className="absolute top-0 left-0 z-50 flex size-full items-center justify-center bg-black/70">
      <ExitButton />
      <div className="flex h-1/2 w-full max-w-screen-sm flex-col items-center justify-center gap-4">
        <div className="relative flex aspect-square w-2/3 items-center justify-center rounded-md bg-red-700 text-neutral-200">
          <Image
            src={product.photo ?? ""}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex w-2/3 items-center gap-2">
          <div className="size-10 overflow-hidden rounded-full">
            {product.user.avatar !== null ? (
              <Image
                src={product.user.avatar}
                height={40}
                width={40}
                alt={product.user.username}
              />
            ) : (
              <UserIcon />
            )}
          </div>
          <div>
            <h3>{product.user.username}</h3>
            <FormattedDate
              date={product.created_at}
              className="text-sm"
              edited={product.edited}
            />
          </div>
        </div>
        <div className="flex w-2/3 flex-col gap-3">
          <div className="flex items-end gap-2">
            <span className="text-2xl font-semibold">{product.title}</span>
          </div>
          <div className="text-xl font-semibold">
            <span>{formatToWon(product.price)}</span>
            <span> Won</span>
          </div>
          <span className="text-md">{product.description}</span>
        </div>
      </div>
    </div>
  );
}

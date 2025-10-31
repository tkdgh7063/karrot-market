import { deleteProduct } from "@/app/(products)/products/[id]/actions";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

interface ProductDetailProps {
  product: {
    id: number;
    title: string;
    description: string;
    price: number;
    photo: string;
    userId: number;
    user: {
      username: string;
      avatar: string | null;
    };
  };
  isOwner: boolean;
}

export default function ProductDetail({
  product,
  isOwner,
}: ProductDetailProps) {
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
        <Link
          className="rounded-md bg-orange-500 px-4 py-2.5 font-semibold text-white"
          href={`/products/${product.id}/edit`}
        >
          Edit Product
        </Link>
        {isOwner ? (
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />
            <button className="rounded-md bg-red-500 px-4 py-2.5 font-semibold text-white">
              Delete Product
            </button>
          </form>
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

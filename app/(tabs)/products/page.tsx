import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { PromiseReturnType } from "@prisma/client";
import Link from "next/link";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      photo: true,
      price: true,
      created_at: true,
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = PromiseReturnType<typeof getInitialProducts>;

export default async function Products() {
  const initialProducts = await getInitialProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/new"
        className="fixed right-4 bottom-25 flex size-14 items-center justify-center rounded-2xl bg-orange-500 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-12" />
      </Link>
    </div>
  );
}

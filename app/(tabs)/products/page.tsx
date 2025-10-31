import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { PromiseReturnType } from "@prisma/client";
import type { Metadata } from "next";
import { unstable_cache as nextCache } from "next/cache";
import Link from "next/link";

const getCachedproducts = nextCache(getInitialProducts, ["karrot", "products"]);

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      photo: true,
      price: true,
      created_at: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = PromiseReturnType<typeof getInitialProducts>;

export const metadata: Metadata = {
  title: "Products",
};

export const dynamic = "force-static";
// export const revalidate = 60;

export default async function Products() {
  const initialProducts = await getCachedproducts();

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

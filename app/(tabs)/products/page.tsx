import AddIconBtn from "@/components/add-icon-btn";
import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PromiseReturnType } from "@prisma/client";
import type { Metadata } from "next";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";

const getCachedproducts = nextCache(getInitialProducts, ["karrot", "products"]);

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      photo: true,
      price: true,
      created_at: true,
      edited: true,
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
  const revalidate = async () => {
    "use server";
    revalidatePath("/products");
  };
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      {/* database revalidation, just for convenience */}
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <AddIconBtn href={`/add-products`} />
    </div>
  );
}

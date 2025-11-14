import ProductDetail from "@/components/product-detail";
import db from "@/lib/db";
import { getIsOwner } from "@/lib/session";
import { Metadata } from "next";
import { unstable_cache as nextCache } from "next/cache";
import { notFound } from "next/navigation";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = Number((await params).id);

  const getCachedProductTitle = nextCache(getProductTitle, [
    "karrot",
    "product",
    "title",
    id.toString(),
  ]);

  const product = await getCachedProductTitle(id);

  return {
    title: product?.title,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (isNaN(id)) {
    return notFound();
  }

  const getCachedProduct = nextCache(getProduct, [
    "karrot",
    "product",
    "detail",
    id.toString(),
  ]);

  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  return <ProductDetail product={product} isOwner={isOwner} />;
}

export const dynamicParams = true; // Dynamic segments not included in `generateStaticParams` are generated on demand. (default)
// export const dynamicParams = false; // Dynamic segments not included in `generateStaticParams` will return a 404.

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { id: true } });
  return products.map((product) => ({ id: product.id + "" }));
}

import EditProductForm from "@/components/edit-product-form";
import db from "@/lib/db";
import { PromiseReturnType } from "@prisma/client";
import { notFound } from "next/navigation";

async function getProduct(id: number) {
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return null;
  return product;
}

export type Product = PromiseReturnType<typeof getProduct>;

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (isNaN(id)) return notFound();

  const product = await getProduct(id);
  if (!product) return notFound();

  return <EditProductForm key={product.id} product={product} />;
}

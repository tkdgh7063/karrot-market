"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export async function deleteProduct(formData: FormData) {
  const session = await getSession();
  if (!session.id) redirect("/login");

  const id = Number(formData.get("id"));
  if (Number.isNaN(id)) return redirect("/products");

  const product = await db.product.findUnique({ where: { id } });
  if (!product) return redirect("/products");

  if (product.userId !== session.id) return redirect("/products");

  await db.product.delete({ where: { id } });
  return redirect("/products");
}

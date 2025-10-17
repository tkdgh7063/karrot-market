"use server";

import db from "@/lib/db";

export async function fetchMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      photo: true,
      price: true,
      created_at: true,
      id: true,
    },
    take: 1,
    skip: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

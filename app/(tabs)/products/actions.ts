"use server";

import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import db from "@/lib/db";

export async function fetchMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      photo: true,
      price: true,
      created_at: true,
      edited: true,
      id: true,
    },
    take: PRODUCTS_PER_PAGE,
    skip: page * PRODUCTS_PER_PAGE,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

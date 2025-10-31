"use server";

import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  ERROR_MESSAGES,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const productSchema = z.object({
  title: z
    .string()
    .nonempty(ERROR_MESSAGES.TITLE_REQUIRED)
    .min(TITLE_MIN_LENGTH, ERROR_MESSAGES.TITLE_TOO_SHORT)
    .max(TITLE_MAX_LENGTH, ERROR_MESSAGES.TITLE_TOO_LONG),
  price: z.coerce
    .number({
      error: (issue) => {
        if (issue.input === undefined) {
          return ERROR_MESSAGES.PRICE_REQUIRED;
        } else {
          return ERROR_MESSAGES.PRICE_INVALID;
        }
      },
    })
    .min(0, ERROR_MESSAGES.PRICE_NEGATIVE),
  description: z
    .string()
    .nonempty(ERROR_MESSAGES.DESCRIPTION_REQUIRED)
    .min(DESCRIPTION_MIN_LENGTH, ERROR_MESSAGES.DESCRIPTION_TOO_SHORT)
    .max(DESCRIPTION_MAX_LENGTH, ERROR_MESSAGES.DESCRIPTION_TOO_LONG),
  photo: z.string().optional(),
});

export async function updateProduct(_: any, formData: FormData) {
  const session = await getSession();
  if (!session.id) return redirect("/login");

  const id = Number(formData.get("id"));
  if (!id) return redirect("/products");

  const product = await db.product.findUnique({ where: { id } });
  if (!product) return redirect("/products");
  if (product.userId !== session.id) return redirect("/products");

  let photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0 && photo.name) {
    // temporary way to save the photo
    const buffer = Buffer.from(await photo.arrayBuffer());
    await fs.writeFile(`./public/${Date.now()}-${photo.name}`, buffer);
    photo = `/${photo.name}`;
  } else {
    photo = product.photo;
  }

  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
    photo,
  };

  const results = productSchema.safeParse(data);
  if (!results.success) {
    return z.flattenError(results.error);
  } else {
    const updatedProduct = await db.product.update({
      where: { id: Number(formData.get("id")) },
      data: results.data,
    });

    revalidatePath("/products");
    revalidatePath(`/products/${updatedProduct.id}`);

    redirect(`/products/${updatedProduct.id}`);
  }
}

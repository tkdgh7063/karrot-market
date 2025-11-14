"use server";

import {
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_DESCRIPTION_MIN_LENGTH,
  ERROR_MESSAGES,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "@/lib/constants";
import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
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
    .min(
      PRODUCT_DESCRIPTION_MIN_LENGTH,
      ERROR_MESSAGES.PRODUCT_DESCRIPTION_TOO_SHORT,
    )
    .max(
      PRODUCT_DESCRIPTION_MAX_LENGTH,
      ERROR_MESSAGES.PRODUCT_DESCRIPTION_TOO_LONG,
    ),
  photo: z.string().optional(),
});

export async function updateProduct(_: any, formData: FormData) {
  const loggedInUserId = await getLoggedInUserId();
  if (!loggedInUserId) return redirect("/login");

  const id = Number(formData.get("id"));
  if (!id) return redirect("/products");

  const product = await db.product.findUnique({ where: { id } });
  if (!product) return redirect("/products");
  if (product.userId !== loggedInUserId) return redirect("/products");

  let photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0 && photo.name) {
    // temporary way to save the photo
    const buffer = Buffer.from(await photo.arrayBuffer());
    const photoName = Date.now() + "-" + photo.name;
    await fs.unlink(`./public/${product.photo}`);
    await fs.writeFile(`./public/uploads/${photoName}`, buffer);
    photo = "/uploads/" + photoName;
  } else {
    // keep the old photo
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
      data: {
        title: results.data.title,
        price: results.data.price,
        description: results.data.description,
        photo: results.data.photo,
        edited: true,
      },
    });

    revalidatePath("/products");
    revalidatePath(`/products/${updatedProduct.id}`);

    return redirect(`/products/${updatedProduct.id}`);
  }
}

export async function deleteProduct(formData: FormData) {
  const loggedInUserId = await getLoggedInUserId();
  if (!loggedInUserId) return redirect("/login");

  const id = Number(formData.get("id"));
  if (Number.isNaN(id)) return redirect("/products");

  const product = await db.product.findUnique({ where: { id } });
  if (!product) return redirect("/products");

  if (product.userId !== loggedInUserId) return redirect("/products");

  await fs.unlink(`./public/${product.photo}`);
  await db.product.delete({ where: { id } });

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);

  return redirect("/products");
}

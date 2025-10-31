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
  photo: z.string().nonempty(ERROR_MESSAGES.PHOTO_REQUIRED),
});

export async function uploadNewProduct(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
    photo: formData.get("photo"),
  };
  if (data.photo instanceof File) {
    // temporary way to save the photo
    const photoData = await data.photo.arrayBuffer();
    const photoName = Date.now() + "-" + data.photo.name;
    await fs.writeFile(`./public/uploads/${photoName}`, Buffer.from(photoData));
    data.photo = "/uploads/" + photoName;
  }

  const results = productSchema.safeParse(data);
  if (!results.success) {
    return z.flattenError(results.error);
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: results.data.title,
          price: results.data.price,
          description: results.data.description,
          photo: results.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      // redirect("/products");
      revalidatePath("/products");
      redirect(`/products/${product.id}`);
    } else {
      redirect("/login");
    }
  }
}

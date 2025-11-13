"use server";

import {
  ERROR_MESSAGES,
  POST_DESCRIPTION_MAX_LENGTH,
  POST_DESCRIPTION_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "@/lib/constants";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import z from "zod";

const postSchema = z.object({
  title: z
    .string()
    .nonempty(ERROR_MESSAGES.TITLE_REQUIRED)
    .min(TITLE_MIN_LENGTH, ERROR_MESSAGES.TITLE_TOO_SHORT)
    .max(TITLE_MAX_LENGTH, ERROR_MESSAGES.TITLE_TOO_LONG),
  description: z
    .string()
    .nonempty(ERROR_MESSAGES.DESCRIPTION_REQUIRED)
    .min(POST_DESCRIPTION_MIN_LENGTH, ERROR_MESSAGES.POST_DESCRIPTION_TOO_SHORT)
    .max(POST_DESCRIPTION_MAX_LENGTH, ERROR_MESSAGES.POST_DESCRIPTION_TOO_LONG),
});

export async function uploadNewPost(_: any, formData: FormData) {
  //   await new Promise((resolve) => setTimeout(resolve, 5000));
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const results = postSchema.safeParse(data);
  if (!results.success) {
    return z.flattenError(results.error);
  } else {
    const session = await getSession();
    const post = await db.post.create({
      data: {
        title: results.data.title,
        description: results.data.description,
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

    if (post) {
      // revalidate when post is cached data
      // revalidatePath("/posts");
      return redirect("/life");
    }
  }
}

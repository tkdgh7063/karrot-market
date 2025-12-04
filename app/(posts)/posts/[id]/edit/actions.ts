"use server";

import {
  ERROR_MESSAGES,
  POST_DESCRIPTION_MAX_LENGTH,
  POST_DESCRIPTION_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "@/lib/constants";
import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { revalidatePath, revalidateTag } from "next/cache";
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

export async function updatePost(_: any, formData: FormData) {
  const loggedInUserId = await getLoggedInUserId();
  if (!loggedInUserId) return redirect("/login");

  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) return redirect("/posts");

  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const results = postSchema.safeParse(data);
  if (!results.success) {
    return z.flattenError(results.error);
  } else {
    const prevPost = await db.post.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        description: true,
      },
    });

    let edited = false;
    if (prevPost) {
      const fields: (keyof typeof prevPost)[] = ["title", "description"];

      for (const field of fields) {
        if (prevPost[field] !== results.data[field]) {
          edited = true;
          break;
        }
      }
    }

    if (edited) {
      const updatedPost = await db.post.update({
        where: {
          id,
        },
        data: {
          title: results.data.title,
          description: results.data.description,
          edited,
        },
        select: {
          id: true,
        },
      });

      if (updatedPost) {
        // revalidatePath("/life");
        revalidateTag(`post-detail-${id}`);
      }
    }

    return redirect(`/posts/${id}`);
  }
}

export async function deletePost(formData: FormData) {
  const loggedInUserId = await getLoggedInUserId();
  if (!loggedInUserId) return redirect("/login");

  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) return redirect("/life");

  const post = await db.post.findUnique({
    where: {
      id,
    },
  });
  if (!post) return redirect("/life");

  if (post.userId !== loggedInUserId) return redirect("/life");

  await db.post.delete({ where: { id } });

  revalidateTag(`post-${id}`);
  revalidatePath("/life");

  return redirect("/life");
}

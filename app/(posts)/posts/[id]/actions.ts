"use server";

import { COMMENT_MAX_LENGTH, ERROR_MESSAGES } from "@/lib/constants";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { Console } from "console";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

export async function likePost(postId: number) {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    const userId = (await getSession()).id!;
    await db.like.create({
      data: {
        userId,
        postId,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

export async function dislikePost(postId: number) {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    const userId = (await getSession()).id!;
    await db.like.delete({
      where: {
        id: {
          userId,
          postId,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

const commentSchema = z.object({
  postId: z.coerce.number(),
  payload: z
    .string()
    .nonempty(ERROR_MESSAGES.COMMENT_REQUIRED)
    .max(COMMENT_MAX_LENGTH, ERROR_MESSAGES.COMMENT_TOO_LONG),
});

export async function addComment(_: any, formData: FormData) {
  const data = {
    postId: formData.get("postId"),
    payload: formData.get("payload"),
  };

  const results = commentSchema.safeParse(data);
  if (!results.success) {
    return z.flattenError(results.error);
  } else {
    await db.comment.create({
      data: {
        postId: results.data.postId,
        userId: (await getSession()).id!,
        payload: results.data.payload,
      },
    });

    revalidateTag(`post-comments-${results.data.postId}`);
  }
}

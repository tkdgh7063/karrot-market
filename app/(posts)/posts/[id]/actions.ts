"use server";

import { COMMENT_MAX_LENGTH, ERROR_MESSAGES } from "@/lib/constants";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";

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

export async function addComment(postId: number, payload: string) {
  if (payload.length > COMMENT_MAX_LENGTH) {
    throw new Error(ERROR_MESSAGES.COMMENT_TOO_LONG);
  } else if (payload.length < 1) {
    throw new Error(ERROR_MESSAGES.COMMENT_REQUIRED);
  }

  const comment = await db.comment.create({
    data: {
      postId,
      userId: (await getSession()).id!,
      payload,
    },
    select: {
      id: true,
      created_at: true,
      payload: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  revalidateTag(`post-comments-${postId}`);

  return comment;
}

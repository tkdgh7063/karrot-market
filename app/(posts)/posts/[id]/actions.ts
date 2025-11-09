"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function likePost(postId: number) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
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
  await new Promise((resolve) => setTimeout(resolve, 5000));
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

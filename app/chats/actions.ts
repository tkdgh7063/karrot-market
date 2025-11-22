"use server";

import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";

export async function saveMessage(payload: string, chatRoomId: string) {
  const userId = await getLoggedInUserId();
  const message = await db.message.create({
    data: {
      chatRoomId,
      payload,
      userId,
    },
    select: {
      id: true,
    },
  });
}

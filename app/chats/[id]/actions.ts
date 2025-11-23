"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function leaveChatRoom(formData: FormData) {
  const chatRoomId = formData.get("chatRoomId") as string;
  if (!chatRoomId) {
    return;
  }

  const chatRoom = await db.chatRoom.delete({
    where: {
      id: chatRoomId,
    },
    select: {
      id: true,
    },
  });
  if (chatRoom) {
    return redirect("/chat");
  }
}

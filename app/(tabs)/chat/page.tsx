import ChatRoomList from "@/components/chatroom-list";
import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { PromiseReturnType } from "@prisma/client";

async function getChatRooms(userId: number) {
  const chatRooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: { id: userId },
      },
    },
    select: {
      id: true,
      messages: {
        take: 1,
        orderBy: {
          created_at: "desc",
        },
        select: {
          created_at: true,
          payload: true,
        },
      },
      users: {
        where: {
          NOT: {
            id: userId,
          },
        },
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  if (chatRooms.length === 0) {
    return null;
  } else {
    return chatRooms;
  }
}

export type ChatRoom = PromiseReturnType<typeof getChatRooms>;

export default async function Chat() {
  const loggedInUserId = await getLoggedInUserId();
  const chatRooms = await getChatRooms(loggedInUserId);

  return <ChatRoomList chatRooms={chatRooms} />;
}

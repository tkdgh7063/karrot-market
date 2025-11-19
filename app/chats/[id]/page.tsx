import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { notFound } from "next/navigation";

async function getRoom(id: string, userId: number) {
  const room = await db.chatRoom.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true },
      },
    },
  });
  if (room && Boolean(room.users.find((user) => user.id === userId))) {
    return room;
  } else {
    return null;
  }
}

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return messages;
}

export type InitialMessages = Awaited<ReturnType<typeof getMessages>>;

export default async function ChatRoom({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const loggedInUserId = await getLoggedInUserId();

  const room = await getRoom(id, loggedInUserId);
  if (!room) {
    return notFound();
  }

  const initialMessages = await getMessages(room.id);
  return (
    <ChatMessagesList
      userId={loggedInUserId}
      initialMessages={initialMessages}
    />
  );
}

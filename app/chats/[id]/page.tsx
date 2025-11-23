import ChatMessagesList from "@/components/chat-messages-list";
import { getUnreadMessageCount } from "@/components/chatroom-list";
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
    orderBy: {
      created_at: "asc",
    },
  });

  return messages;
}

async function getUserProfile(loggedInUserId: number) {
  const user = await db.user.findUnique({
    where: {
      id: loggedInUserId,
    },
    select: {
      username: true,
      avatar: true,
    },
  });

  return user;
}

export type InitialMessages = Awaited<ReturnType<typeof getMessages>>;

export default async function ChatRoom({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const loggedInUserId = await getLoggedInUserId();

  const user = await getUserProfile(loggedInUserId);
  if (!user) {
    return notFound();
  }

  const room = await getRoom(id, loggedInUserId);
  if (!room) {
    return notFound();
  }

  const initialMessages = await getMessages(room.id);
  const unreadMessageCount = await getUnreadMessageCount(
    room.id,
    loggedInUserId,
  );

  return (
    <ChatMessagesList
      chatRoomId={id}
      userId={loggedInUserId}
      user={user}
      initialMessages={initialMessages}
      unreadMessageCount={unreadMessageCount}
    />
  );
}

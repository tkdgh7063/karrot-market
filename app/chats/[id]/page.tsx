import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true },
      },
      messages: {
        select: {
          payload: true,
        },
      },
    },
  });

  const loggedInuserId = await getLoggedInUserId();
  if (room && Boolean(room.users.find((user) => user.id === loggedInuserId))) {
    return room;
  } else {
    return null;
  }
}

export default async function ChatRoom({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const room = await getRoom(id);
  if (!room) {
    return notFound();
  }
  return (
    <div>
      <span>ChatRoom id: {id}</span>
      {room.messages.map((message) => (
        <div>Message: {message.payload}</div>
      ))}
    </div>
  );
}

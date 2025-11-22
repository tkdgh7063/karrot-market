import { ChatRoom } from "@/app/(tabs)/chat/page";
import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { formatMessageDate } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

async function getUnreadMessageCount(chatRoomId: string, userId: number) {
  const lastRead = await db.chatRoomReadStatus.findUnique({
    where: { id: { chatRoomId, userId } },
    select: { last_read_time: true },
  });

  if (!lastRead?.last_read_time) {
    const messages = await db.chatRoom.findUnique({
      where: { id: chatRoomId },
      select: {
        messages: {
          where: { NOT: { userId } },
          select: { id: true },
        },
      },
    });
    return messages?.messages.length ?? 0;
  }

  const unread = await db.chatRoom.findUnique({
    where: { id: chatRoomId },
    select: {
      messages: {
        where: {
          created_at: { gt: lastRead.last_read_time },
          NOT: { userId },
        },
        select: { id: true },
      },
    },
  });

  return unread?.messages.length ?? 0;
}

export default async function ChatRoomList({
  chatRooms,
}: {
  chatRooms: ChatRoom;
}) {
  const loggedInUserId = await getLoggedInUserId();

  if (!chatRooms) {
    return (
      <div className="flex h-[100vh] flex-col items-center justify-center gap-2 *:text-xl">
        <span>It's quiet here 😅</span>
        <span>Why not start a conversation?</span>
      </div>
    );
  }

  const chatRoomsWithUnread = await Promise.all(
    chatRooms.map(async (chatRoom) => ({
      ...chatRoom,
      unreadCount: await getUnreadMessageCount(chatRoom.id, loggedInUserId),
    })),
  );

  return (
    <div className="flex flex-col gap-3 px-5 pt-8">
      <div className="text-center text-xl font-semibold">Chat Rooms</div>
      <div className="flex flex-col gap-2">
        {chatRoomsWithUnread.map((chatRoom) => {
          const otherUser = chatRoom.users[0];
          const lastMessage = chatRoom.messages[0];
          return (
            <Link
              href={`/chats/${chatRoom.id}`}
              key={chatRoom.id}
              className="rounded-md bg-white px-5 py-2.5 transition-colors hover:bg-orange-400"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {otherUser.avatar !== null ? (
                    <Image
                      src={otherUser.avatar}
                      width={40}
                      height={40}
                      alt={otherUser.username}
                      className="size-10 overflow-hidden rounded-full bg-neutral-500 text-white"
                    />
                  ) : (
                    <UserIcon className="size-10 overflow-hidden rounded-full bg-neutral-500 text-white" />
                  )}
                  <div className="flex flex-col">
                    <div className="text-lg text-black">
                      {otherUser.username}
                    </div>
                    <div className="text-md text-gray-600">
                      {lastMessage === undefined
                        ? "Be the first to chat!"
                        : lastMessage.payload}
                    </div>
                  </div>
                </div>
                <div className="flex h-[52px] flex-col-reverse items-end justify-between gap-2 p-0.5">
                  <span className="text-xs text-gray-600">
                    {lastMessage === undefined
                      ? null
                      : formatMessageDate(lastMessage.created_at)}
                  </span>
                  {chatRoom.unreadCount > 0 && (
                    <div className="flex size-6 items-center justify-center rounded-full bg-red-500">
                      <span className="text-xs text-white">
                        {chatRoom.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

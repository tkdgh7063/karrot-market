import { ChatRoom } from "@/app/(tabs)/chat/page";
import { formatMessageDate } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

export default function ChatRoomList({ chatRooms }: { chatRooms: ChatRoom }) {
  if (!chatRooms) {
    return (
      <div className="flex h-[100vh] flex-col items-center justify-center gap-2 *:text-xl">
        <span>It's quiet here 😅</span>
        <span>Why not start a conversation?</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-5 pt-8">
      <div className="text-center text-xl font-semibold">Chat Rooms</div>
      <div className="flex flex-col gap-2">
        {chatRooms.map((chatRoom) => {
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
                        ? "No conversation has started"
                        : lastMessage.payload}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-600">
                    {lastMessage === undefined
                      ? null
                      : formatMessageDate(lastMessage.created_at)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

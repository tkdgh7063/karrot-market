import { leaveChatRoom } from "@/app/chats/[id]/actions";
import { User } from "@/lib/types";
import {
  ArrowLeftIcon,
  ArrowRightStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

interface ChatRoomHeaderProps {
  user: User;
  chatRoomId: string;
}

export default function ChatRoomHeader({
  user,
  chatRoomId,
}: ChatRoomHeaderProps) {
  return (
    <div className="fixed top-0 z-10 flex h-10 w-full items-center justify-between bg-orange-500 px-5 py-7">
      <Link href={`/chat`}>
        <ArrowLeftIcon className="size-7 text-white" />
      </Link>
      <div className="flex items-center gap-2">
        {user.avatar !== null ? (
          <Image
            src={user.avatar}
            alt={user.username}
            className="size-7 overflow-hidden rounded-full bg-neutral-700"
          />
        ) : (
          <UserIcon className="size-7 overflow-hidden rounded-full bg-neutral-700" />
        )}
        <span className="text-lg font-semibold">{user.username}</span>
      </div>
      <form action={leaveChatRoom}>
        <input type="hidden" name="chatRoomId" value={chatRoomId} />
        <button type="submit" className="hover:cursor-pointer">
          <ArrowRightStartOnRectangleIcon className="size-7 text-white" />
        </button>
      </form>
    </div>
  );
}

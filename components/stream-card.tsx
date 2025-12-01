"use client";

import { formatStreamDate } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface StreamCardProps {
  stream: {
    user: {
      username: string;
      avatar: string | null;
    };
  } & {
    id: number;
    title: string;
    streamKey: string;
    streamId: string;
    created_at: Date;
    userId: number;
  };
}

export default function StreamCard({ stream }: StreamCardProps) {
  const [isParentHover, setIsParentHover] = useState(false);
  const [isChildHover, setIsChildHover] = useState(false);

  return (
    <Link
      key={stream.id}
      href={`/streams/${stream.streamId}`}
      className={`flex flex-col gap-2 rounded-md pb-3 text-white *:select-none ${isParentHover && !isChildHover ? "bg-orange-400" : "bg-orange-500"}`}
      onMouseEnter={() => setIsParentHover(true)}
      onMouseLeave={() => setIsParentHover(false)}
    >
      <div
        className="relative aspect-video *:rounded-t-md"
        onMouseEnter={() => setIsChildHover(true)}
        onMouseLeave={() => setIsChildHover(false)}
      >
        {stream.user.avatar !== null ? (
          <Image
            src={stream.user.avatar}
            alt={stream.user.username}
            fill
            className="brightness-90 hover:brightness-100"
          />
        ) : (
          <UserIcon className="size-full bg-neutral-600 hover:bg-neutral-500" />
        )}
      </div>
      <div className="px-3">
        <div>{stream.title}</div>
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm">{formatStreamDate(stream.created_at)}</div>
          <div className="flex items-center gap-1.5">
            {stream.user.avatar !== null ? (
              <Image
                src={stream.user.avatar}
                width={28}
                height={28}
                alt={stream.user.username}
                className="size-5 overflow-hidden rounded-full"
              />
            ) : (
              <UserIcon className="size-5 overflow-hidden rounded-full" />
            )}
            <div>{stream.user.username}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

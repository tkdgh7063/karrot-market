"use client";

import { InitialMessages } from "@/app/chats/[id]/page";
import { formatDate } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";

interface ChatMessagesListProps {
  initialMessages: InitialMessages;
  userId: number;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);

  return (
    <div className="flex min-h-screen flex-col justify-end gap-5 p-5">
      {messages.map((message) => {
        const isMyMessage = Boolean(message.userId === userId);
        return (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${isMyMessage ? "justify-end" : "justify-start"}`}
          >
            {message.userId !== userId ? (
              message.user.avatar ? (
                <Image
                  src={message.user.avatar}
                  width={50}
                  height={50}
                  alt={message.user.username}
                  className="size-10 rounded-full"
                />
              ) : (
                <UserIcon className="size-10 rounded-full" />
              )
            ) : null}
            <div
              className={`flex flex-col gap-1 ${isMyMessage ? "items-end" : null}`}
            >
              <span
                className={`rounded-md ${isMyMessage ? "bg-neutral-500" : "bg-orange-500"} p-2.5`}
              >
                {message.payload}
              </span>
              <span className="text-xs">{formatDate(message.created_at)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

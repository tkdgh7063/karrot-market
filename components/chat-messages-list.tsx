"use client";

import { InitialMessages } from "@/app/chats/[id]/page";
import { saveMessage } from "@/app/chats/actions";
import { User } from "@/lib/types";
import { formatMessageDate } from "@/lib/utils";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ChatRoomHeader from "./chatroom-header";

interface ChatMessagesListProps {
  chatRoomId: string;
  initialMessages: InitialMessages;
  unreadMessageCount: number;
  user: User;
  otherUser: User;
  userId: number;
}

export default function ChatMessagesList({
  chatRoomId,
  initialMessages,
  unreadMessageCount,
  user,
  otherUser,
  userId,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const [unreadMessageIndex, setUnreadMessageIndex] = useState(
    messages.length - unreadMessageCount,
  );

  const channel = useRef<RealtimeChannel>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: Date.now(),
      payload: message,
      created_at: new Date(),
      userId,
      user: {
        username: "You",
        avatar: null,
      },
    };
    setMessages((prevMsgs) => [...prevMsgs, payload]);

    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: user.username,
          avatar: user.avatar,
        },
      },
    });
    saveMessage(message, chatRoomId);

    setMessage("");
    setUnreadMessageIndex(messages.length + 1);
  };

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
    );

    channel.current = supabase.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
        setUnreadMessageIndex(messages.length + 1);
      })
      .subscribe();

    return () => {
      fetch("/api/chat/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatRoomId,
          userId,
          last_read_time: new Date(),
        }),
      });

      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <ChatRoomHeader chatRoomId={chatRoomId} user={otherUser} />
      <div className="flex min-h-screen flex-col justify-end gap-5 p-5">
        {messages.length === 0 ? (
          <div className="text-center">
            No messages yet. Start the conversation!
          </div>
        ) : null}
        {messages.slice(0, unreadMessageIndex).map((message) => {
          const isMyMessage = Boolean(message.userId === userId);
          return (
            <div
              key={message.id}
              className={`flex h-full items-start gap-2 overflow-y-auto ${isMyMessage ? "justify-end" : "justify-start"}`}
            >
              {message.userId !== userId ? (
                message.user.avatar ? (
                  <Image
                    src={message.user.avatar}
                    width={40}
                    height={40}
                    alt={message.user.username}
                    className="size-10 rounded-full"
                  />
                ) : (
                  <UserIcon className="size-10 rounded-full" />
                )
              ) : null}
              <div ref={bottomRef} />
              <div
                className={`flex w-full flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}
              >
                <span
                  className={`rounded-md ${isMyMessage ? "bg-neutral-500" : "bg-orange-500"} px-2.5 py-2`}
                >
                  {message.payload}
                </span>
                <span className="text-xs">
                  {formatMessageDate(message.created_at)}
                </span>
              </div>
            </div>
          );
        })}
        {unreadMessageIndex < messages.length ? (
          <div className="my-4 flex items-center gap-3">
            <div className="flex-grow border-t border-gray-300" />
            <span className="text-sm font-semibold text-gray-500">
              New messages
            </span>
            <div className="flex-grow border-t border-gray-300" />
          </div>
        ) : null}
        {messages.slice(unreadMessageIndex).map((message) => {
          const isMyMessage = Boolean(message.userId === userId);
          return (
            <div
              key={message.id}
              className={`flex h-full items-start gap-2 overflow-y-auto ${isMyMessage ? "justify-end" : "justify-start"}`}
            >
              {message.userId !== userId ? (
                message.user.avatar ? (
                  <Image
                    src={message.user.avatar}
                    width={40}
                    height={40}
                    alt={message.user.username}
                    className="size-10 rounded-full"
                  />
                ) : (
                  <UserIcon className="size-10 rounded-full" />
                )
              ) : null}
              <div ref={bottomRef} />
              <div
                className={`flex w-full flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}
              >
                <span
                  className={`rounded-md ${isMyMessage ? "bg-neutral-500" : "bg-orange-500"} px-2.5 py-2`}
                >
                  {message.payload}
                </span>
                <span className="text-xs">
                  {formatMessageDate(message.created_at)}
                </span>
              </div>
            </div>
          );
        })}
        <form className="relative flex" onSubmit={onSubmit}>
          <input
            className="h-10 w-full rounded-full border-none bg-transparent px-5 ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:ring-4 focus:ring-neutral-50 focus:outline-none"
            value={message}
            onChange={onChange}
            type="text"
            placeholder="Type a message..."
            name="message"
            autoComplete="off"
            required
          />
          <button
            type="submit"
            className="absolute top-1 right-1 z-10 flex size-8 items-center justify-center rounded-full bg-orange-500 pl-0.5 hover:cursor-pointer hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-neutral-400"
            disabled={loading}
          >
            <PaperAirplaneIcon className="size-6" />
          </button>
        </form>
      </div>
    </>
  );
}

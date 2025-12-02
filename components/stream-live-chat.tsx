"use client";

import { formatStreamChatDate } from "@/lib/utils";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";

interface StreamLiveChatProps {
  streamId: string;
  userId: number;
  username: string;
  streamerId: number;
  isStreamOwner: boolean;
}

interface ChatMessage {
  id: number;
  payload: string;
  created_at: Date;
  userId: number;
  user: {
    username: string;
  };
}

export default function StreamLiveChatClient({
  streamId,
  userId,
  username,
  streamerId,
  isStreamOwner,
}: StreamLiveChatProps) {
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [finish, setFinish] = useState(false);

  const channel = useRef<RealtimeChannel>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage) return;

    const payload = {
      id: Date.now(),
      payload: chatMessage,
      created_at: new Date(),
      userId,
      user: {
        username: isStreamOwner ? "STREAMER" : username,
      },
    };
    setChatMessages((prev) => [...prev, payload]);

    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload,
    });
    setChatMessage("");
  };

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
    );

    channel.current = supabase.channel(`live-${streamId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setChatMessages((prev) => [...prev, payload.payload]);
      })
      .on("broadcast", { event: "end" }, (payload) => {
        setChatMessages((prev) => [...prev, payload.payload]);
        setFinish(true);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [streamId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [chatMessages]);

  return (
    <div className="flex w-full flex-col gap-2 rounded-md bg-neutral-700 px-5 pt-3 pb-2.5">
      <div className="text-lg">Live Chats</div>
      <div className="mb-1 max-h-[240px] min-h-[240px] flex-1 overflow-x-hidden overflow-y-auto *:select-none">
        {chatMessages.map((chatMessage, index) => (
          <div
            key={chatMessage.id}
            ref={index === chatMessages.length - 1 ? bottomRef : null}
            className="flex gap-2"
          >
            <span
              className={`font-semibold ${chatMessage.userId === streamerId ? "text-orange-500" : "text-neutral-400"}`}
            >
              {chatMessage.user.username}
            </span>
            <span className="text-sm">{chatMessage.payload}</span>
            <span className="text-xs text-gray-400">
              {formatStreamChatDate(new Date(chatMessage.created_at))}
            </span>
          </div>
        ))}
      </div>
      <form className="relative flex" onSubmit={onSubmit}>
        <input
          className="h-10 w-full rounded-full border-none bg-transparent px-5 ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:ring-4 focus:ring-neutral-50 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:ring-2 disabled:ring-neutral-600"
          value={chatMessage}
          onChange={onChange}
          disabled={finish}
          type="text"
          placeholder={finish ? "Livestream ended" : "Type a chat..."}
          name="chatMessage"
          autoComplete="off"
          required
        />
        <button
          type="submit"
          className="absolute top-1 right-1 z-10 flex size-8 items-center justify-center rounded-full bg-orange-500 pl-0.5 hover:cursor-pointer hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-neutral-400"
          disabled={finish}
        >
          <PaperAirplaneIcon className="size-6" />
        </button>
      </form>
    </div>
  );
}

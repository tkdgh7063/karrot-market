"use client";

import { formatStreamChatDate } from "@/lib/utils";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";

interface StreamLiveChatProps {
  streamId: string;
  userId: number;
  username: string;
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
}: StreamLiveChatProps) {
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const channel = useRef<RealtimeChannel>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: Date.now(),
      payload: chatMessage,
      created_at: new Date(),
      userId,
      user: {
        username,
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
        console.log(payload.payload);
        setChatMessages((prev) => [...prev, payload.payload]);
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
    <div className="flex w-full flex-col gap-2 rounded-md bg-neutral-500 px-5 pt-3 pb-2.5">
      <div className="text-lg">Live Chats</div>
      <div className="max-h-[240px] min-h-[240px] flex-1 overflow-x-hidden overflow-y-auto *:select-none">
        {chatMessages.map((chatMessage, index) => (
          <div
            key={chatMessage.id}
            ref={index === chatMessages.length - 1 ? bottomRef : null}
            className="flex items-center gap-2"
          >
            <span className="font-semibold">{chatMessage.user.username}</span>
            <span className="text-sm">{chatMessage.payload}</span>
            <span className="text-xs text-neutral-400">
              {formatStreamChatDate(new Date(chatMessage.created_at))}
            </span>
          </div>
        ))}
      </div>
      <form className="relative flex" onSubmit={onSubmit}>
        <input
          className="h-10 w-full rounded-full border-none bg-transparent px-5 ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:ring-4 focus:ring-neutral-50 focus:outline-none"
          value={chatMessage}
          onChange={onChange}
          type="text"
          placeholder="Type a chat..."
          name="chatMessage"
          autoComplete="off"
          required
        />
        <button
          type="submit"
          className="absolute top-1 right-1 z-10 flex size-8 items-center justify-center rounded-full bg-orange-500 pl-0.5 hover:cursor-pointer hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-neutral-400"
          // disabled={loading}
        >
          <PaperAirplaneIcon className="size-6" />
        </button>
      </form>
    </div>
  );
}

"use client";

import { InitialMessages } from "@/app/chats/[id]/page";
import { User } from "@/lib/types";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import ChatMessagesList from "./chat-messages-list";
import ChatRoomHeader from "./chatroom-header";

interface ChatRoomClientProps {
  chatRoomId: string;
  user: User;
  loggedInUserId: number;
  initialMessages: InitialMessages;
  unreadMessageCount: number;
  otherUser: User;
}

export default function ChatRoomClient({
  chatRoomId,
  user,
  loggedInUserId,
  initialMessages,
  unreadMessageCount,
  otherUser,
}: ChatRoomClientProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [unreadMessageIndex, setUnreadMessageIndex] = useState(
    messages.length - unreadMessageCount,
  );
  const channel = useRef<RealtimeChannel>(null);
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
          loggedInUserId,
          last_read_time: new Date(),
        }),
      });

      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <>
      <ChatRoomHeader chatRoomId={chatRoomId} otherUser={otherUser} />
      <ChatMessagesList
        chatRoomId={chatRoomId}
        userId={loggedInUserId}
        user={user}
        messages={messages}
        setMessages={setMessages}
        unreadMessageIndex={unreadMessageIndex}
        setUnreadMessageIndex={setUnreadMessageIndex}
        channel={channel}
      />
    </>
  );
}

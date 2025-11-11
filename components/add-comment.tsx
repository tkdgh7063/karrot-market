"use client";

import { addComment } from "@/app/(posts)/posts/[id]/actions";
import { COMMENT_MAX_LENGTH } from "@/lib/constants";
import { Comment } from "@/lib/types";
import React, { startTransition, useState } from "react";

export default function AddComment({
  postId,
  action,
}: {
  postId: number;
  action: (comment: Comment) => void;
}) {
  const [payload, setPayload] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tempComment: Comment = {
      id: Date.now(),
      payload,
      created_at: new Date(),
      user: { username: "You", avatar: null },
    };

    action(tempComment);
    setPayload("");

    startTransition(async () => {
      const createdComment = await addComment(postId, payload);
      action(createdComment);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        minLength={1}
        maxLength={COMMENT_MAX_LENGTH}
        className="h-10 w-full rounded-md border-none bg-transparent ring-1 ring-neutral-200 transition placeholder:text-neutral-300 focus:ring-3 focus:ring-orange-500 focus:outline-none"
        placeholder="Add a comment..."
        autoComplete="off"
      />
      <input type="submit" className="hidden" />
    </form>
  );
}

"use client";

import { addComment } from "@/app/(posts)/posts/[id]/actions";
import {
  COMMENT_MAX_LENGTH,
  COMMENT_MIN_LENGTH,
  ERROR_MESSAGES,
} from "@/lib/constants";
import { Comment } from "@/lib/types";
import React, { useState } from "react";
import Input from "./input";

interface User {
  username: string;
  avatar: string | null;
}

export default function AddComment({
  postId,
  user,
  action,
}: {
  postId: number;
  user: User;
  action: (comment: Comment) => void;
}) {
  const [payload, setPayload] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (payload.length < COMMENT_MIN_LENGTH) {
      setErrors([ERROR_MESSAGES.COMMENT_REQUIRED]);
      return;
    } else if (payload.length > COMMENT_MAX_LENGTH) {
      setErrors([ERROR_MESSAGES.COMMENT_TOO_LONG]);
      return;
    }

    const tempComment: Comment = {
      id: Date.now(),
      payload,
      created_at: new Date(),
      user,
    };

    action(tempComment);
    setPayload("");
    setErrors([]);

    addComment(postId, payload);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Input
        type="text"
        value={payload}
        name="payload"
        onChange={(e) => setPayload(e.target.value)}
        minLength={1}
        maxLength={COMMENT_MAX_LENGTH}
        errors={errors}
        className="h-10 w-full rounded-md border-none bg-transparent ring-1 ring-neutral-200 transition placeholder:text-neutral-300 focus:ring-3 focus:ring-orange-500 focus:outline-none"
        placeholder="Add a comment..."
        autoComplete="off"
      />
      <input type="submit" className="hidden" />
    </form>
  );
}

"use client";

import { addComment } from "@/app/(posts)/posts/[id]/actions";
import {
  COMMENT_LIMIT_COUNT,
  COMMENT_LIMIT_TIME,
  COMMENT_MAX_LENGTH,
  COMMENT_MIN_LENGTH,
  ERROR_MESSAGES,
} from "@/lib/constants";
import { Comment, User } from "@/lib/types";
import React, { useRef, useState } from "react";
import Input from "./input";

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

  const countRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (countRef.current >= COMMENT_LIMIT_COUNT) {
      setPayload("");
      setErrors([ERROR_MESSAGES.COMMENT_LIMIT_REACHED]);
      console.log("REFUSED");
      return;
    }

    if (payload.length < COMMENT_MIN_LENGTH) {
      setErrors([ERROR_MESSAGES.COMMENT_REQUIRED]);
      return;
    }

    if (payload.length > COMMENT_MAX_LENGTH) {
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

    countRef.current++;
    resetCountAfterDelay();

    setPayload("");
    setErrors([]);

    try {
      await addComment(postId, user.username, payload);
    } catch (e: any) {
      console.error(e);
      setErrors([e.message]);
    }
  };

  const resetCountAfterDelay = () => {
    if (timerRef.current) return;

    timerRef.current = setTimeout(() => {
      countRef.current = 0;
      timerRef.current = null;
    }, COMMENT_LIMIT_TIME);
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

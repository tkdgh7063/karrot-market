"use client";

import { addComment } from "@/app/(posts)/posts/[id]/actions";
import { useActionState } from "react";

export default function AddComment({ postId }: { postId: number }) {
  const [state, action] = useActionState(addComment, null);

  return (
    <form action={action} className="w-full">
      <input defaultValue={postId} className="hidden" name="postId" />
      <input
        type="text"
        name="payload"
        minLength={1}
        className="h-10 w-full rounded-md border-none bg-transparent ring-1 ring-neutral-200 transition placeholder:text-neutral-300 focus:ring-3 focus:ring-orange-500 focus:outline-none"
        placeholder="Add a comment..."
        autoComplete="off"
      />
      <input type="submit" className="hidden" />
    </form>
  );
}

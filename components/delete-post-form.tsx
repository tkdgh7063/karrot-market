"use client";

import { deletePost } from "@/app/(posts)/posts/[id]/actions";
import { useActionState } from "react";
import DeletePostBtn from "./delete-post-btn";

export default function DeletePostForm({ postId }: { postId: number }) {
  const [_, action] = useActionState(deletePost, null);
  return (
    <form action={action}>
      <input type="hidden" name="postId" value={postId} />
      <DeletePostBtn />
    </form>
  );
}

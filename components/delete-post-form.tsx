"use client";

import { deletePost } from "@/app/(posts)/posts/[id]/edit/actions";
import DeletePostBtn from "./delete-post-btn";

export default function DeletePostForm({ postId }: { postId: number }) {
  return (
    <form className="flex px-5" action={deletePost}>
      <input type="hidden" name="postId" value={postId} />
      <DeletePostBtn />
    </form>
  );
}

"use client";

import { deletePost, updatePost } from "@/app/(posts)/posts/[id]/edit/actions";
import { Post } from "@/app/(posts)/posts/[id]/edit/page";
import {
  POST_DESCRIPTION_MAX_LENGTH,
  POST_DESCRIPTION_MIN_LENGTH,
} from "@/lib/constants";
import { useActionState } from "react";
import BoxInput from "./box-input";
import Button from "./button";
import Input from "./input";

export default function EditPostForm({ post }: { post: Post }) {
  if (!post) return;

  const [state, action] = useActionState(updatePost, null);
  return (
    <>
      <form action={action} className="flex flex-col gap-5 p-5">
        <h1>Edit Post</h1>
        <input type="hidden" name="id" value={post.id} />
        <Input
          name="title"
          placeholder="Title"
          defaultValue={post.title}
          errors={state?.fieldErrors.title}
          required
        />
        <BoxInput
          name="description"
          placeholder="Write your post..."
          defaultValue={post.description}
          errors={state?.fieldErrors.description}
          minLength={POST_DESCRIPTION_MIN_LENGTH}
          maxLength={POST_DESCRIPTION_MAX_LENGTH}
          required
        />
        <Button text="Edit Post" />
      </form>
      <form action={deletePost} className="flex flex-col px-5">
        <input type="hidden" name="id" value={post.id} />
        <button className="h-10 w-full self-center rounded-lg bg-red-500 text-center font-semibold text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300 disabled:hover:bg-neutral-400">
          Delete Post
        </button>
      </form>
    </>
  );
}

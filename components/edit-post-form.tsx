"use client";

import { useActionState } from "react";
import BoxInput from "./box-input";
import Input from "./input";
import { updatePost } from "@/app/(posts)/posts/[id]/edit/actions";
import {
  POST_DESCRIPTION_MIN_LENGTH,
  POST_DESCRIPTION_MAX_LENGTH,
} from "@/lib/constants";
import Button from "./button";
import { Post } from "@/app/(posts)/posts/[id]/edit/page";

export default function EditPostForm({ post }: { post: Post }) {
  if (!post) return;

  const [state, action] = useActionState(updatePost, null);
  return (
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
  );
}

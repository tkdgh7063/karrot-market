"use client";

import BoxInput from "@/components/box-input";
import Button from "@/components/button";
import Input from "@/components/input";
import {
  POST_DESCRIPTION_MAX_LENGTH,
  POST_DESCRIPTION_MIN_LENGTH,
} from "@/lib/constants";
import { useActionState } from "react";
import { uploadNewPost } from "./actions";

export default function AddPostPage() {
  const [state, action] = useActionState(uploadNewPost, null);
  return (
    <form action={action} className="flex flex-col gap-5 p-5">
      <h1>New Post</h1>
      <Input
        name="title"
        placeholder="Title"
        errors={state?.fieldErrors.title}
        required
      />
      <BoxInput
        name="description"
        placeholder="Write your post..."
        errors={state?.fieldErrors.description}
        minLength={POST_DESCRIPTION_MIN_LENGTH}
        maxLength={POST_DESCRIPTION_MAX_LENGTH}
        required
      />
      <Button text="Upload Post" />
    </form>
  );
}

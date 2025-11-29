"use client";

import { startStream } from "@/app/streams/add/actions";
import { STREAM_TITLE_MAX_LENGTH } from "@/lib/constants";
import { useActionState } from "react";
import Button from "./button";
import Input from "./input";

export default function CreateStreamForm() {
  const [state, action] = useActionState(startStream, null);

  let errors: string[] = [];
  if (state) {
    if ("ok" in state) errors = [state.error];
    if ("formErrors" in state) errors = state.formErrors;
  }
  return (
    <form action={action} className="flex flex-col gap-5 p-5">
      <h1 className="text-2xl">Start a new stream</h1>
      <Input
        name="title"
        type="text"
        placeholder="Title of your stream"
        errors={errors}
        maxLength={STREAM_TITLE_MAX_LENGTH}
        required
      />
      <Button text="Start streaming" />
    </form>
  );
}

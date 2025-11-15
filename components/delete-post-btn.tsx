"use client";

import { useFormStatus } from "react-dom";

export default function DeletePostBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-red-500 px-2 py-1.5 text-center transition-colors hover:cursor-pointer hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300"
    >
      {pending ? "Deleting..." : "Delete Post"}
    </button>
  );
}

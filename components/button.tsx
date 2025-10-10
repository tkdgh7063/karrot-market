"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      className="primary-btn h-10 w-full self-center font-semibold disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300 disabled:hover:bg-neutral-400"
      disabled={pending}
    >
      {pending ? "Loading..." : text}
    </button>
  );
}

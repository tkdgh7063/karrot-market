"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function ExitButton() {
  const router = useRouter();
  const onClose = () => {
    router.back();
  };
  return (
    <button
      onClick={onClose}
      className="absolute top-5 right-5 cursor-pointer text-neutral-200"
    >
      <XMarkIcon className="size-10" />
    </button>
  );
}

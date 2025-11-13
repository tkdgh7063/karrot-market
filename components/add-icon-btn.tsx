import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function AddIconBtn({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="fixed right-4 bottom-25 flex size-14 items-center justify-center rounded-2xl bg-orange-500 text-white transition-colors hover:bg-orange-400"
    >
      <PlusIcon className="size-12" />
    </Link>
  );
}

import Link from "next/link";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <input
            className="h-10 w-full rounded-md border-none bg-transparent ring-1 ring-neutral-200 placeholder:text-neutral-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            type="text"
            placeholder="Username"
            required
          />
          <span className="font-medium text-red-500">Input error</span>
        </div>
        <button className="primary-btn h-10 w-full self-center font-semibold">
          Create Account
        </button>
      </form>
      <div className="h-px w-[98%] self-center bg-neutral-500" />
      <div>
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-2"
          href="create-account/sms"
        >
          <span>
            <ChatBubbleLeftEllipsisIcon className="size-6" />
          </span>
          <span>Sign up with SMS</span>
        </Link>
      </div>
    </div>
  );
}

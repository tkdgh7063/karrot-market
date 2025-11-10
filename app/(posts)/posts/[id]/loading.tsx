import { EyeIcon } from "@heroicons/react/24/solid";

export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col gap-3 p-5">
      <div className="mb-2 flex items-center gap-2">
        <div className="size-7 rounded-full bg-neutral-700" />
        <div className="flex flex-col gap-1">
          <div className="h-5 w-20 rounded-md bg-neutral-700" />
          <div className="h-4 w-25 rounded-md bg-neutral-700" />
        </div>
      </div>
      <div className="mb-3 h-6 w-25 rounded-md bg-neutral-700" />
      <div className="mb-5 flex flex-col gap-1.5">
        <div className="h-5 w-42 rounded-md bg-neutral-700" />
        <div className="h-5 w-42 rounded-md bg-neutral-700" />
        <div className="h-5 w-42 rounded-md bg-neutral-700" />
      </div>
      <div className="flex items-center gap-1.5 text-sm text-neutral-700">
        <EyeIcon className="size-5" />
        <div className="h-5 w-20 rounded-md bg-neutral-700" />
      </div>
    </div>
  );
}

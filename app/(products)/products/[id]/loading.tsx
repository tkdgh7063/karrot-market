import { PhotoIcon } from "@heroicons/react/24/solid";

export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col gap-5 p-5">
      <div className="flex aspect-square items-center justify-center rounded-md border-4 border-dashed border-neutral-700 text-neutral-700">
        <PhotoIcon className="h-32" />
      </div>
      <div className="flex items-center gap-2">
        <div className="size-14 rounded-full bg-neutral-700" />
        <div className="flex flex-col gap-1">
          <div className="h-5 w-40 rounded-md bg-neutral-700" />
          <div className="h-5 w-20 rounded-md bg-neutral-700" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-5 w-md rounded-md bg-neutral-700" />
        <div className="h-5 w-md rounded-md bg-neutral-700" />
        <div className="h-5 w-md rounded-md bg-neutral-700" />
      </div>
    </div>
  );
}

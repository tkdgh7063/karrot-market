import ExitButton from "@/components/exit-btn";
import { PhotoIcon, UserIcon } from "@heroicons/react/24/solid";

export default function ModalLoading() {
  return (
    <div className="absolute top-0 left-0 z-50 flex size-full items-center justify-center bg-black/70">
      <ExitButton />
      <div className="flex h-1/2 w-full max-w-screen-sm flex-col items-center justify-center gap-4">
        <div className="relative flex aspect-square w-2/3 animate-pulse items-center justify-center bg-neutral-700 text-neutral-200">
          <PhotoIcon className="h-28" />
        </div>
        <div className="flex w-2/3 items-center gap-2 *:animate-pulse">
          <div className="size-10 overflow-hidden rounded-full">
            <UserIcon />
          </div>
          <div className="h-5 w-30 rounded-md bg-neutral-700" />
        </div>
        <div className="flex w-2/3 flex-col gap-3 *:animate-pulse">
          <div className="h-5 w-40 rounded-md bg-neutral-700" />
          <div className="h-5 w-20 rounded-md bg-neutral-700" />
        </div>
        <div className="flex w-2/3 flex-col gap-2 *:animate-pulse">
          <div className="h-5 w-full rounded-md bg-neutral-700" />
          <div className="h-5 w-full rounded-md bg-neutral-700" />
          <div className="h-5 w-full rounded-md bg-neutral-700" />
        </div>
      </div>
    </div>
  );
}

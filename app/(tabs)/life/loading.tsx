export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col p-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="mb-5 flex gap-2 pb-5 *:rounded-md">
          <div className="flex w-full flex-col gap-2 *:rounded-md">
            <div className="h-5 w-25 bg-neutral-700" />
            <div className="h-5 w-50 bg-neutral-700" />
            <div className="flex items-center justify-between">
              <div className="flex gap-2 *:rounded-md">
                <div className="h-5 w-30 bg-neutral-700" />
                <div className="h-5 w-18 bg-neutral-700" />
              </div>
              <div className="flex gap-2 *:rounded-md">
                <div className="h-5 w-10 bg-neutral-700" />
                <div className="h-5 w-10 bg-neutral-700" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

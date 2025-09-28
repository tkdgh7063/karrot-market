export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100 p-5 sm:bg-red-300 md:bg-yellow-300 lg:bg-green-300 xl:bg-cyan-300 2xl:bg-violet-300">
      <div className="flex w-full max-w-screen-sm flex-col gap-4 rounded-3xl bg-white p-5 shadow-lg">
        {["Alex", "Mike", "Alice", "Max"].map((person, index) => (
          <div
            key={index}
            className="flex items-center gap-5 rounded-t-xl border-b-2 p-2.5 pb-6 last:border-0 last:pb-0 odd:bg-gray-400"
          >
            <div className="size-10 rounded-full bg-cyan-500" />
            <span className="text-lg font-medium">{person}</span>
            <div className="flex size-6 items-center justify-center rounded-full bg-red-500 text-white">
              <span className="text-base font-light">{index}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

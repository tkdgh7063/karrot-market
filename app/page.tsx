export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100 p-5 sm:bg-red-300 md:bg-yellow-300 lg:bg-green-300 xl:bg-cyan-300 2xl:bg-violet-300">
      <div className="flex w-full max-w-screen-sm flex-col gap-3 rounded-3xl bg-white p-5 shadow-lg">
        {["Alex", "Mike", "Alice", "Max", ""].map((person, index) => (
          <div key={index} className="group flex items-center gap-5">
            <div className="size-10 rounded-full bg-cyan-500" />
            <span className="text-lg font-medium group-hover:font-semibold group-hover:text-red-400 empty:h-5 empty:w-12 empty:animate-pulse empty:rounded-full empty:bg-gray-300 empty:group-hover:animate-none empty:group-hover:bg-gray-500">
              {person}
            </span>
            <div className="relative flex size-6 items-center justify-center rounded-full bg-red-500 text-white">
              <span className="z-10 text-base font-light">{index}</span>
              <div className="absolute size-6 animate-ping rounded-full bg-red-500" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

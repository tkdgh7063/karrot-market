export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100 p-5 sm:bg-red-300 md:bg-yellow-300 lg:bg-green-300 xl:bg-cyan-300 2xl:bg-violet-300">
      <div className="flex w-full max-w-screen-sm flex-col gap-2.5 rounded-3xl bg-white p-5 shadow-lg md:flex-row">
        <input
          className="h-12 w-full rounded-full bg-gray-200 pl-4 ring-2 ring-transparent transition-shadow outline-none placeholder:drop-shadow focus:ring-orange-500 focus:ring-offset-2"
          type="text"
          placeholder="Search..."
        />
        <button className="rounded-full bg-black py-2 font-medium text-white transition-transform outline-none active:scale-95 md:px-8">
          Search
        </button>
      </div>
    </main>
  );
}

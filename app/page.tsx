export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100 p-5 sm:bg-red-300 md:bg-yellow-300 lg:bg-green-300 xl:bg-cyan-300 2xl:bg-violet-300">
      <div className="flex w-full max-w-screen-sm flex-col gap-2.5 rounded-3xl bg-white p-5 shadow-lg ring-2 ring-transparent transition-shadow *:outline-none has-[:invalid]:bg-red-100 has-[:invalid]:ring-red-400 md:flex-row">
        <input
          className="peer h-12 w-full rounded-full bg-gray-200 pl-4 ring-2 ring-transparent transition-shadow placeholder:drop-shadow valid:ring-green-500 invalid:ring-red-500 focus:ring-offset-2 invalid:focus:ring-red-500"
          type="text"
          required
          placeholder="Email address"
        />
        <span className="ml-4 hidden font-medium text-red-400 peer-invalid:block">
          Email is Required.
        </span>
        <button className="rounded-full bg-gradient-to-tr from-cyan-500 via-violet-400 to-purple-300 py-2 font-medium text-white transition-transform peer-invalid:bg-red-300 peer-invalid:bg-none active:scale-95 md:px-8">
          Log In
        </button>
      </div>
    </main>
  );
}

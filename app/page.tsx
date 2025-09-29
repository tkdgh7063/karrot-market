export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100 p-5 sm:bg-red-300 md:bg-yellow-300 lg:bg-green-300 xl:bg-cyan-300 2xl:bg-violet-300">
      <div className="flex w-full max-w-screen-sm flex-col gap-3 rounded-3xl bg-white p-5 shadow-lg">
        <div className="group flex flex-col">
          <input
            className="w-full bg-gray-100"
            placeholder="Write Email.."
            type="email"
          />
          <span className="hidden group-focus-within:block">
            Check if email is vaild
          </span>
          <button
            type="Submit"
            className="text-avocado-400 h-[30px] rounded-[20px] bg-[#543cb8]"
          >
            Submit
          </button>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-5">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <span className="mb-3 ml-5 text-9xl">🥕</span>
        <h1 className="text-4xl">Karrot</h1>
        <h2 className="text-2xl">Welcome to Karrot Market</h2>
      </div>
      <div className="flex w-full flex-col items-center gap-1">
        <Link
          href="/create-account"
          className="primary-btn w-[80%] py-2.5 text-lg"
        >
          Get Started
        </Link>
        <div className="flex gap-2">
          <span>Already have an account?</span>
          <Link href="/login" className="underline-offset-4 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

import { UserProps } from "@/app/(tabs)/profile/page";
import { getLoggedInUserId, logoutUser } from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function UserProfileCard({ user }: { user: UserProps }) {
  const logout = async () => {
    "use server";
    await logoutUser();
    return redirect("/");
  };

  if (!user) return notFound();

  const userId = await getLoggedInUserId();
  if (!userId) return redirect("/");

  return (
    <div className="flex h-[100vh] flex-col gap-5 bg-red-400 text-white">
      <div className="flex flex-col items-center gap-2 pt-5">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.username}
            width={100}
            height={100}
            className="size-24 overflow-hidden rounded-full"
          />
        ) : (
          <UserIcon className="size-24 overflow-hidden rounded-full bg-neutral-500" />
        )}
        <div>{user.username}</div>
        <div>{user.email ? user.email : "No Email"}</div>
        {userId === user.id ? (
          <form action={logout}>
            <button className="rounded-md bg-orange-500 px-3 py-1 hover:cursor-pointer hover:bg-orange-400">
              Logout
            </button>
          </form>
        ) : null}
      </div>
      <div className="grid grid-flow-row grid-cols-3">
        {user.products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="relative size-40"
          >
            <Image src={product.photo} alt={product.title} fill />
          </Link>
        ))}
      </div>
    </div>
  );
}

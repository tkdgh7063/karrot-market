import db from "@/lib/db";
import { getLoggedInUserId, logoutUser } from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const loggedInUserId = await getLoggedInUserId();
  if (loggedInUserId) {
    const user = await db.user.findUnique({
      where: {
        id: loggedInUserId,
      },
    });
    if (user) {
      return user;
    }
  } else {
    notFound();
  }
}

export default async function Profile() {
  const logout = async () => {
    "use server";
    await logoutUser();
    return redirect("/");
  };
  const user = await getUser();
  return (
    <div>
      <h1>Welcome {user?.username}!</h1>
      <form action={logout}>
        <button>Logout</button>
      </form>
    </div>
  );
}

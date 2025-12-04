import UserProfileCard from "@/components/user-profile-card";
import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser(userId: number) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      products: {
        select: {
          id: true,
          photo: true,
          title: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
      email: true,
      avatar: true,
      username: true,
      created_at: true,
      id: true,
    },
  });

  if (!user) return null;
  return user;
}

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (isNaN(id)) return notFound();

  const loggedInUserId = await getLoggedInUserId();
  if (id === loggedInUserId) return redirect("/profile");

  const user = await getUser(id);
  if (!user) return notFound();

  return <UserProfileCard user={user} />;
}

import UserProfileCard from "@/components/user-profile-card";
import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { PromiseReturnType } from "@prisma/client";
import { notFound } from "next/navigation";

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

export type UserProps = PromiseReturnType<typeof getUser>;

export default async function Profile() {
  const loggedInUserId = await getLoggedInUserId();

  const user = await getUser(loggedInUserId);
  if (!user) return notFound();

  return <UserProfileCard user={user} />;
}

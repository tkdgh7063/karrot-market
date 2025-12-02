import UserProfileCard from "@/components/user-profile-card";
import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { PromiseReturnType } from "@prisma/client";
import { notFound } from "next/navigation";

async function getUser() {
  const loggedInUserId = await getLoggedInUserId();
  if (loggedInUserId) {
    const user = await db.user.findUnique({
      where: {
        id: loggedInUserId,
      },
      select: {
        products: {
          select: {
            id: true,
            photo: true,
            title: true,
          },
        },
        email: true,
        avatar: true,
        username: true,
        created_at: true,
      },
    });
    if (user) {
      return user;
    }
  }
  return null;
}

export type UserProps = PromiseReturnType<typeof getUser>;

export default async function Profile() {
  const user = await getUser();
  if (!user) return notFound();

  return <UserProfileCard user={user} />;
}

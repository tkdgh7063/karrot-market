import EditProfileForm from "@/components/edit-profile-form";
import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { notFound } from "next/navigation";

async function getUserProfile(userId: number) {
  const userProfile = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      avatar: true,
      username: true,
    },
  });

  return userProfile;
}

export default async function ProfileEdit() {
  const loggedInUserId = await getLoggedInUserId();
  const profile = await getUserProfile(loggedInUserId);

  if (!profile) notFound();

  return <EditProfileForm profile={profile} />;
}

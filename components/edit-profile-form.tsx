"use client";

import { editProfile } from "@/app/(tabs)/profile/edit/actions";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useActionState } from "react";
import Button from "./button";
import Input from "./input";

interface EditProfileProps {
  profile: {
    id: number;
    avatar: string | null;
    username: string;
  };
}

export default function EditProfileForm({ profile }: EditProfileProps) {
  const [state, action] = useActionState(editProfile, null);

  return (
    <form action={action} className="flex flex-col gap-5 p-5">
      <h1 className="text-2xl">Edit Profile</h1>
      <div className="flex w-full items-center justify-center">
        {profile.avatar ? (
          <Image
            src={profile.avatar}
            alt={profile.username}
            width={100}
            height={100}
            className="size-25 overflow-hidden rounded-full"
          />
        ) : (
          <UserIcon className="size-25 overflow-hidden rounded-full bg-neutral-500" />
        )}
      </div>
      <Input
        type="text"
        name="username"
        placeholder="Username"
        defaultValue={profile.username}
        errors={state?.fieldErrors.username}
        required
      />
      <Button text="Edit Profile" />
    </form>
  );
}

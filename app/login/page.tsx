"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { handleForm } from "./actions";

export default function Login() {
  const [state, action] = useActionState(handleForm, null);
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello!</h1>
        <h2 className="text-xl">Login with Email</h2>
      </div>
      <form className="flex flex-col gap-3" action={action}>
        <Input type="email" placeholder="Email" name="email" required />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          minLength={PASSWORD_MIN_LENGTH}
          maxLength={PASSWORD_MAX_LENGTH}
          required
        />
        <Button text="Login" />
        <div className="flex gap-1 self-center">
          <span>Don’t have an account?</span>
          <Link
            href="/create-account"
            className="underline-offset-4 hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </form>
      <SocialLogin />
    </div>
  );
}

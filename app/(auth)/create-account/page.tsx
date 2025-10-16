"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { createAccount } from "./actions";

export default function CreateAccount() {
  const [state, action] = useActionState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="Email"
          name="email"
          errors={state?.fieldErrors?.email}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          errors={state?.fieldErrors?.password}
          minLength={PASSWORD_MIN_LENGTH}
          maxLength={PASSWORD_MAX_LENGTH}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          name="confirm_password"
          errors={state?.fieldErrors?.confirm_password}
          required
        />
        <Input
          type="text"
          placeholder="Username"
          name="username"
          errors={state?.fieldErrors?.username}
          minLength={USERNAME_MIN_LENGTH}
          maxLength={USERNAME_MAX_LENGTH}
          required
        />
        <Button text="Create Account" />
        <div className="flex items-center justify-center gap-2">
          <span>Already have an account?</span>
          <Link href="/login" className="underline-offset-4 hover:underline">
            Login
          </Link>
        </div>
      </form>
      <SocialLogin />
    </div>
  );
}

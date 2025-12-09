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

const initialState = {
  code: false,
  error: undefined,
};

export default function CreateAccount() {
  const [state, action] = useActionState(createAccount, initialState);

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        {state.code === true ? (
          <Input
            type="text"
            placeholder="Verification code"
            name="code"
            errors={[]}
            minLength={6}
            maxLength={6}
            required
          />
        ) : (
          <>
            <Input
              type="email"
              placeholder="Email"
              name="email"
              errors={[]}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              name="password"
              errors={[]}
              minLength={PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
              required
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              name="confirm_password"
              errors={[]}
              required
            />
            <Input
              type="text"
              placeholder="Username"
              name="username"
              errors={[]}
              minLength={USERNAME_MIN_LENGTH}
              maxLength={USERNAME_MAX_LENGTH}
              required
            />
          </>
        )}
        <Button text={state.code ? "Verify Email" : "Create Account"} />
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

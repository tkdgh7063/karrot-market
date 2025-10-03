"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
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
        <FormInput
          type="email"
          placeholder="Email"
          name="email"
          errors={state?.fieldErrors?.email}
          required
        />
        <FormInput
          type="password"
          placeholder="Password"
          name="password"
          errors={state?.fieldErrors?.password}
          required
        />
        <FormInput
          type="password"
          placeholder="Confirm Password"
          name="confirm_password"
          errors={state?.fieldErrors?.confirm_password}
          required
        />
        <FormInput
          type="text"
          placeholder="Username"
          name="username"
          errors={state?.fieldErrors?.username}
          required
        />
        <FormButton text="Create Account" />
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

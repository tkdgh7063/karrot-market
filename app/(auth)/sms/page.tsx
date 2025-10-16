"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useActionState } from "react";
import smsLogin from "./actions";

const initialState = {
  code: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, action] = useActionState(smsLogin, initialState);
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        {state.code ? (
          <Input
            name="code"
            type="number"
            placeholder="Verification code"
            errors={[]}
            min={100000}
            max={999999}
            required
          />
        ) : (
          <Input
            name="phone"
            type="text"
            placeholder="Phone number"
            errors={state.error?.formErrors}
            required
          />
        )}
        <Button text={state.code ? "Verify Code" : "Send Verification Code"} />
      </form>
    </div>
  );
}

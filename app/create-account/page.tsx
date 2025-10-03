import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import Link from "next/link";

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput type="email" placeholder="Email" name="email" required />
        <FormInput
          type="password"
          placeholder="Password"
          name="password1"
          required
        />
        <FormInput
          type="password"
          placeholder="Confirm Password"
          name="password2"
          required
        />
        <FormInput
          type="text"
          placeholder="Username"
          name="username"
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

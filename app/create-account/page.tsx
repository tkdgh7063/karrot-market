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
        <FormInput type="email" placeholder="Email" errors={[]} required />
        <FormInput
          type="password"
          placeholder="Password"
          errors={[]}
          required
        />
        <FormInput
          type="password"
          placeholder="Confirm Password"
          errors={[]}
          required
        />
        <FormInput type="text" placeholder="Username" errors={[]} required />
        <FormButton text="Create Account" loading={false} />
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

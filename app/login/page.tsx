import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function Login() {
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello!</h1>
        <h2 className="text-xl">Login with Email</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput type="email" placeholder="Email" errors={[]} required />
        <FormInput
          type="password"
          placeholder="Password"
          errors={[]}
          required
        />
        <FormButton text="Login" loading={false} />
      </form>
      <SocialLogin />
    </div>
  );
}

import { redirect } from "next/navigation";

export function GET() {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email",
    allow_signup: "false",
  }).toString();

  const url = `${baseUrl}?${params}`;

  return redirect(url);
}

import { getAuthorizationURL } from "@/lib/github";
import { redirect } from "next/navigation";

export function GET() {
  const authorizationURL = getAuthorizationURL();
  return redirect(authorizationURL);
}

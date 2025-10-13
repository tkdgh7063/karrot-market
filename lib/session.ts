import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionCookie {
  id?: number;
}

export default async function getSession() {
  return await getIronSession<SessionCookie>(await cookies(), {
    cookieName: "karrot-user",
    password: process.env.COOKIE_PASSWORD!,
  });
}

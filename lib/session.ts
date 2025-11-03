import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionCookie {
  id?: number;
}

export async function getSession() {
  return await getIronSession<SessionCookie>(await cookies(), {
    cookieName: "karrot-user",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function loginUser(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionCookie {
  id?: number;
}

async function getSession() {
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

export async function logoutUser() {
  const session = await getSession();
  return session.destroy();
}

export async function getLoggedInUserId() {
  const session = await getSession();
  return session.id!;
}

export async function getIsOwner(userId: number): Promise<boolean> {
  const session = await getSession();
  return session.id ? session.id === userId : false;
}

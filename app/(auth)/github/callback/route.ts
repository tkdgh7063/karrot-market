import db from "@/lib/db";
import { getAccessToken, getProfile } from "@/lib/github";
import { loginUser } from "@/lib/session";
import { randomUUID } from "crypto";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return notFound();

  const access_token = await getAccessToken(code);
  if (!access_token) {
    return new Response(
      // JSON.stringify(error)
      null,
      { status: 400 },
    );
  }

  const { login, id, avatar_url, email } = await getProfile(access_token);

  const user = await db.user.findUnique({
    where: {
      github_id: id.toString(),
    },
    select: {
      id: true,
    },
  });

  if (user) {
    await loginUser(user.id);
    return redirect("/profile");
  } else {
    const isUsernameExists = await db.user.findUnique({
      where: {
        username: login,
      },
      select: {
        id: true,
      },
    });

    let username;
    if (isUsernameExists) {
      const uuid = randomUUID().slice(4);
      username = login + uuid;
    } else {
      username = login;
    }

    const newUser = await db.user.create({
      data: {
        username,
        github_id: id.toString(),
        avatar: avatar_url,
        email,
      },
      select: {
        id: true,
      },
    });

    await loginUser(newUser.id);
    return redirect("/profile");
  }
}

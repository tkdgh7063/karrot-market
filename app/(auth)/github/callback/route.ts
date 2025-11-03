import db from "@/lib/db";
import { loginUser } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return notFound();

  const baseUrl = "https://github.com/login/oauth/access_token";
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const url = `${baseUrl}?${params}`;

  const { error, access_token } = await (
    await fetch(url, {
      headers: { Accept: "application/json" },
      method: "POST",
    })
  ).json();
  if (error) {
    return new Response(
      // JSON.stringify(error)
      null,
      { status: 400 },
    );
  }

  const { login, id, avatar_url, email } = await (
    await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
      method: "GET",
    })
  ).json();

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
    const newUser = await db.user.create({
      data: {
        username: login, // this can be duplicated, so need to work out a better way to handle this, like add a unique constraint
        github_id: id.toString(),
        avatar: avatar_url,
        email: email ?? null,
      },
      select: {
        id: true,
      },
    });

    await loginUser(newUser.id);
    return redirect("/profile");
  }
}

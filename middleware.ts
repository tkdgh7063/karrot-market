import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUserId } from "./lib/session";

const publicOnlyURLs = new Set([
  "/",
  "/create-account",
  "/login",
  "/sms",
  "/github/auth",
  "/github/callback",
]);

export async function middleware(request: NextRequest) {
  const isLoggedIn = Boolean(getLoggedInUserId);
  const isPublic = publicOnlyURLs.has(request.nextUrl.pathname);
  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

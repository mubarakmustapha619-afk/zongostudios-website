import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAuthenticated } from "@/lib/auth";
import { getGoogleAuthUrl } from "@/lib/youtube";

export const YOUTUBE_OAUTH_STATE_COOKIE = "yt_oauth_state";

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/admin/youtube/callback`;
  const state = randomBytes(16).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set(YOUTUBE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(getGoogleAuthUrl(redirectUri, state));
}

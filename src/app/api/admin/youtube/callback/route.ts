import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAuthenticated } from "@/lib/auth";
import { exchangeCodeForTokens } from "@/lib/youtube";
import { YOUTUBE_OAUTH_STATE_COOKIE } from "@/app/api/admin/youtube/connect/route";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTarget = new URL("/admin", url.origin);

  if (!(await isAuthenticated())) {
    redirectTarget.searchParams.set("youtube", "error");
    return NextResponse.redirect(redirectTarget);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(YOUTUBE_OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(YOUTUBE_OAUTH_STATE_COOKIE);

  if (oauthError || !code || !state || !expectedState || state !== expectedState) {
    redirectTarget.searchParams.set("youtube", "error");
    return NextResponse.redirect(redirectTarget);
  }

  try {
    const redirectUri = `${url.origin}/api/admin/youtube/callback`;
    await exchangeCodeForTokens(code, redirectUri);
    redirectTarget.searchParams.set("youtube", "connected");
  } catch (error) {
    console.error("YouTube OAuth callback failed:", error);
    redirectTarget.searchParams.set("youtube", "error");
  }

  return NextResponse.redirect(redirectTarget);
}

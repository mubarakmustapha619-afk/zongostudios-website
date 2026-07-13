import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { isYouTubeConnected } from "@/lib/youtube";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connected = await isYouTubeConnected();
  return NextResponse.json({ connected });
}

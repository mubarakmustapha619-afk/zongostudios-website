import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createResumableUploadSession } from "@/lib/youtube";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.title !== "string" ||
    typeof body.fileSizeBytes !== "number" ||
    typeof body.mimeType !== "string"
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const uploadUrl = await createResumableUploadSession({
      title: body.title.trim() || "Untitled upload",
      privacyStatus: "unlisted",
      fileSizeBytes: body.fileSizeBytes,
      mimeType: body.mimeType,
    });
    return NextResponse.json({ uploadUrl });
  } catch (error) {
    console.error("Failed to create YouTube upload session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start upload" },
      { status: 502 }
    );
  }
}

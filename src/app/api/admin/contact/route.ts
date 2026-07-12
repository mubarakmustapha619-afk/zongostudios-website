import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSiteData, saveSiteData } from "@/lib/blob-store";
import type { ContactSocialLink } from "@/types/site-data";

const VALID_ICONS = new Set(["linkedin", "vimeo", "instagram"]);

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.email !== "string" ||
    typeof body.phone !== "string" ||
    !Array.isArray(body.socialLinks)
  ) {
    return NextResponse.json({ error: "Invalid contact payload" }, { status: 400 });
  }

  const rawLinks: unknown[] = body.socialLinks;
  const socialLinks: ContactSocialLink[] = rawLinks
    .filter(
      (link): link is Record<string, unknown> =>
        !!link &&
        typeof link === "object" &&
        typeof (link as Record<string, unknown>).href === "string" &&
        (link as Record<string, unknown>).href !== ""
    )
    .map((link) => ({
      label: String(link.label || "").trim() || "Link",
      href: String(link.href).trim(),
      icon: VALID_ICONS.has(String(link.icon))
        ? (link.icon as ContactSocialLink["icon"])
        : "linkedin",
    }));

  const data = await getSiteData();
  data.contact = {
    email: body.email.trim(),
    phone: body.phone.trim(),
    socialLinks,
  };
  await saveSiteData(data);

  return NextResponse.json({ contact: data.contact });
}

import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  deleteImageIfManaged,
  getSiteData,
  saveSiteData,
  uploadImage,
} from "@/lib/blob-store";

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const data = await getSiteData();

  const name = formData.get("name");
  if (typeof name === "string" && name.trim()) {
    data.site.name = name.trim();
  }

  const tagline = formData.get("tagline");
  if (typeof tagline === "string") {
    data.site.tagline = tagline.trim();
  }

  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    const newLogoUrl = await uploadImage(logo, "logo");
    await deleteImageIfManaged(data.site.logoUrl);
    data.site.logoUrl = newLogoUrl;
  }

  await saveSiteData(data);
  return NextResponse.json({ site: data.site });
}

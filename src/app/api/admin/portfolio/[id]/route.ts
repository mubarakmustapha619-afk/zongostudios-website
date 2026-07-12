import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  deleteImageIfManaged,
  getSiteData,
  saveSiteData,
  uploadImage,
} from "@/lib/blob-store";
import { ALL_CATEGORIES } from "@/types/portfolio";
import type { PortfolioCategory } from "@/types/portfolio";

function parseCategories(formData: FormData): PortfolioCategory[] {
  return formData
    .getAll("categories")
    .map(String)
    .filter((value): value is PortfolioCategory =>
      ALL_CATEGORIES.includes(value as PortfolioCategory)
    );
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await getSiteData();
  const item = data.portfolioItems.find((candidate) => candidate.id === id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();

  const title = formData.get("title");
  if (typeof title === "string" && title.trim()) {
    item.title = title.trim();
  }

  if (formData.has("categories")) {
    const categories = parseCategories(formData);
    if (categories.length > 0) {
      item.categories = categories;
    }
  }

  if (formData.has("videoUrl")) {
    const videoUrl = String(formData.get("videoUrl") || "").trim();
    item.videoUrl = videoUrl || null;
  }

  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    const newImage = await uploadImage(imageFile, "portfolio");
    await deleteImageIfManaged(item.image);
    item.image = newImage;
  }

  await saveSiteData(data);
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await getSiteData();
  const item = data.portfolioItems.find((candidate) => candidate.id === id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  data.portfolioItems = data.portfolioItems.filter(
    (candidate) => candidate.id !== id
  );
  await saveSiteData(data);
  await deleteImageIfManaged(item.image);

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSiteData, saveSiteData, uploadImage } from "@/lib/blob-store";
import { ALL_CATEGORIES } from "@/types/portfolio";
import type { PortfolioCategory, PortfolioItem } from "@/types/portfolio";

function parseCategories(formData: FormData): PortfolioCategory[] {
  return formData
    .getAll("categories")
    .map(String)
    .filter((value): value is PortfolioCategory =>
      ALL_CATEGORIES.includes(value as PortfolioCategory)
    );
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const title = String(formData.get("title") || "").trim();
  const videoUrl = String(formData.get("videoUrl") || "").trim();
  const categories = parseCategories(formData);
  const imageFile = formData.get("image");

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (categories.length === 0) {
    return NextResponse.json(
      { error: "At least one category is required" },
      { status: 400 }
    );
  }
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return NextResponse.json(
      { error: "A thumbnail image is required" },
      { status: 400 }
    );
  }

  const image = await uploadImage(imageFile, "portfolio");

  const stillFiles = formData
    .getAll("stills")
    .filter((value): value is File => value instanceof File && value.size > 0);
  const stills = await Promise.all(stillFiles.map((file) => uploadImage(file, "stills")));

  const data = await getSiteData();
  const newItem: PortfolioItem = {
    id: crypto.randomUUID(),
    title,
    categories,
    image,
    videoUrl: videoUrl || null,
    stills,
  };
  data.portfolioItems = [newItem, ...data.portfolioItems];
  await saveSiteData(data);

  return NextResponse.json({ item: newItem }, { status: 201 });
}

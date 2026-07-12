import { cache } from "react";
import { del, list, put } from "@vercel/blob";
import type { SiteData } from "@/types/site-data";
import { portfolioItems as defaultPortfolioItems } from "@/types/portfolio-data";
import { socialLinks as defaultSocialLinks } from "@/types/site-content";

const SITE_DATA_PATHNAME = "data/site-data.json";
const BLOB_HOST_MARKER = ".public.blob.vercel-storage.com";

function defaultSiteData(): SiteData {
  return {
    portfolioItems: defaultPortfolioItems,
    contact: {
      email: "",
      phone: "",
      socialLinks: defaultSocialLinks.map((link) => ({ ...link })),
    },
    site: {
      name: "Marina Starke – Colorist",
      tagline:
        "Marina Starke is a colorist based in Berlin working across feature film, episodic, commercial, and music video.",
      logoUrl: "/images/logo/logo@1x.png",
    },
  };
}

async function findSiteDataUrl(): Promise<string | null> {
  const { blobs } = await list({ prefix: SITE_DATA_PATHNAME, limit: 1 });
  return blobs.find((blob) => blob.pathname === SITE_DATA_PATHNAME)?.url ?? null;
}

export const getSiteData = cache(async (): Promise<SiteData> => {
  const url = await findSiteDataUrl();
  if (!url) {
    const initial = defaultSiteData();
    await saveSiteData(initial);
    return initial;
  }

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load site data (${response.status})`);
  }
  return (await response.json()) as SiteData;
});

export async function saveSiteData(data: SiteData): Promise<void> {
  await put(SITE_DATA_PATHNAME, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function uploadImage(
  file: File,
  folder: "portfolio" | "logo"
): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const pathname = `images/${folder}/${crypto.randomUUID()}.${extension}`;
  const blob = await put(pathname, file, { access: "public" });
  return blob.url;
}

export async function deleteImageIfManaged(
  url: string | null | undefined
): Promise<void> {
  if (!url || !url.includes(BLOB_HOST_MARKER)) return;
  try {
    await del(url);
  } catch {
    // Best-effort cleanup — an orphaned blob is not worth failing the request over.
  }
}

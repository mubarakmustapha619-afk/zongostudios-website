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

async function findSiteDataBlob(): Promise<{ url: string; uploadedAt: Date } | null> {
  const { blobs } = await list({ prefix: SITE_DATA_PATHNAME, limit: 1 });
  const match = blobs.find((blob) => blob.pathname === SITE_DATA_PATHNAME);
  return match ? { url: match.url, uploadedAt: match.uploadedAt } : null;
}

export const getSiteData = cache(async (): Promise<SiteData> => {
  const blob = await findSiteDataBlob();
  if (!blob) {
    const initial = defaultSiteData();
    await saveSiteData(initial);
    return initial;
  }

  // Vercel Blob serves this URL through a CDN with a cache floor of 60s
  // (see cacheControlMaxAge below), so overwriting the blob in place doesn't
  // purge already-cached edges. Busting with the blob's own uploadedAt
  // guarantees a fresh fetch exactly when the content actually changes,
  // while still allowing the CDN to serve repeat reads of the same version.
  const bustedUrl = `${blob.url}?v=${blob.uploadedAt.getTime()}`;
  const response = await fetch(bustedUrl, { cache: "no-store" });
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
    // 60 seconds is the minimum Vercel Blob allows; kept low (rather than the
    // one-month default) since this file is overwritten on every admin edit.
    cacheControlMaxAge: 60,
  });
}

export async function uploadImage(
  file: File,
  folder: "portfolio" | "logo" | "stills"
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

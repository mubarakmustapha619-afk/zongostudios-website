import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSiteData } from "@/lib/blob-store";
import { HeaderNav } from "@/components/HeaderNav";
import { Footer } from "@/components/Footer";
import { getVideoEmbedUrl } from "@/lib/video-embed";
import { CATEGORY_LABELS } from "@/types/portfolio";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const { portfolioItems, site } = await getSiteData();
  const item = portfolioItems.find((candidate) => candidate.id === id);
  if (!item) return {};
  return { title: `${item.title} — ${site.name}` };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const { portfolioItems, contact, site } = await getSiteData();
  const item = portfolioItems.find((candidate) => candidate.id === id);

  if (!item) notFound();

  const embedUrl = item.videoUrl ? getVideoEmbedUrl(item.videoUrl) : null;
  const stills = item.stills ?? [];

  return (
    <>
      <HeaderNav logoUrl={site.logoUrl} siteName={site.name} />
      <main className="pt-[114px]">
        <div className="mx-auto max-w-6xl px-6 pb-20">
          <Link
            href="/#work"
            className="text-xs tracking-[2px] uppercase text-muted-foreground transition-opacity hover:opacity-75"
          >
            ← Back to Work
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-foreground">{item.title}</h1>
          <p className="mt-2 text-xs tracking-[3px] uppercase text-muted-foreground">
            {item.categories.map((category) => CATEGORY_LABELS[category]).join(" · ")}
          </p>

          {embedUrl && (
            <div className="mt-8 aspect-video w-full overflow-hidden">
              <iframe
                src={embedUrl}
                className="h-full w-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          )}

          {stills.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4">
              {stills.map((src) => (
                <div key={src} className="relative aspect-[3/2] overflow-hidden">
                  <Image src={src} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer socialLinks={contact.socialLinks} />
    </>
  );
}

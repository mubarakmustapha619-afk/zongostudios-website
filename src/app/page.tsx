import type { Metadata } from "next";
import { Suspense } from "react";
import { HeaderNav } from "@/components/HeaderNav";
import { PortfolioSection } from "@/components/PortfolioSection";
import { ContactSection } from "@/components/ContactSection";
import { InstagramSection } from "@/components/InstagramSection";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { getSiteData } from "@/lib/blob-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteData();
  return { title: site.name, description: site.tagline };
}

export default async function Home() {
  const { portfolioItems, contact, site } = await getSiteData();

  return (
    <>
      <HeaderNav logoUrl={site.logoUrl} siteName={site.name} />
      <main>
        <Suspense fallback={null}>
          <PortfolioSection items={portfolioItems} />
        </Suspense>
        <ContactSection email={contact.email} phone={contact.phone} />
        <InstagramSection />
      </main>
      <Footer socialLinks={contact.socialLinks} />
      <BackToTop />
    </>
  );
}

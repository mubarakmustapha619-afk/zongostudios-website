"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PortfolioAdmin } from "@/components/admin/PortfolioAdmin";
import { ContactAdmin } from "@/components/admin/ContactAdmin";
import { SiteSettingsAdmin } from "@/components/admin/SiteSettingsAdmin";
import type { SiteData } from "@/types/site-data";

type Tab = "portfolio" | "contact" | "site";

const TABS: { id: Tab; label: string }[] = [
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact Info" },
  { id: "site", label: "Site Settings" },
];

export function AdminDashboard({ initialData }: { initialData: SiteData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const youtubeStatus = searchParams.get("youtube");
  const [tab, setTab] = useState<Tab>(youtubeStatus ? "site" : "portfolio");
  const [portfolioItems, setPortfolioItems] = useState(initialData.portfolioItems);
  const [contact, setContact] = useState(initialData.contact);
  const [site, setSite] = useState(initialData.site);

  useEffect(() => {
    if (!youtubeStatus) return;
    const timeout = setTimeout(() => router.replace("/admin"), 4000);
    return () => clearTimeout(timeout);
  }, [youtubeStatus, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Site Admin</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </div>

      {youtubeStatus === "connected" && (
        <p className="mt-4 rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground">
          YouTube connected successfully.
        </p>
      )}
      {youtubeStatus === "error" && (
        <p className="mt-4 rounded-md border border-border bg-card px-4 py-2 text-sm text-destructive">
          Failed to connect YouTube. Please try again.
        </p>
      )}

      <nav className="mt-8 flex gap-2 border-b border-border">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              tab === id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "portfolio" && (
          <PortfolioAdmin items={portfolioItems} onItemsChange={setPortfolioItems} />
        )}
        {tab === "contact" && (
          <ContactAdmin contact={contact} onContactChange={setContact} />
        )}
        {tab === "site" && <SiteSettingsAdmin site={site} onSiteChange={setSite} />}
      </div>
    </div>
  );
}

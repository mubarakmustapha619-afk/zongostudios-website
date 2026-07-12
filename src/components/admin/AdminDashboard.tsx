"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [tab, setTab] = useState<Tab>("portfolio");
  const [portfolioItems, setPortfolioItems] = useState(initialData.portfolioItems);
  const [contact, setContact] = useState(initialData.contact);
  const [site, setSite] = useState(initialData.site);

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

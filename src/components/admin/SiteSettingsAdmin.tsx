"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { YouTubeConnectionCard } from "@/components/admin/YouTubeConnectionCard";
import type { SiteSettings } from "@/types/site-data";

interface SiteSettingsAdminProps {
  site: SiteSettings;
  onSiteChange: (site: SiteSettings) => void;
}

export function SiteSettingsAdmin({ site, onSiteChange }: SiteSettingsAdminProps) {
  const [name, setName] = useState(site.name);
  const [tagline, setTagline] = useState(site.tagline);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(site.logoUrl);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!logoFile) return;
    const objectUrl = URL.createObjectURL(logoFile);
    setLogoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("tagline", tagline);
      if (logoFile) formData.set("logo", logoFile);

      const response = await fetch("/api/admin/site", { method: "PUT", body: formData });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error || "Failed to save site settings.");
        return;
      }

      const data = await response.json();
      onSiteChange(data.site as SiteSettings);
      setLogoPreview(data.site.logoUrl);
      setLogoFile(null);
      setSaved(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl rounded-lg border border-border bg-card p-6"
      >
      <div>
        <label htmlFor="siteName" className="text-sm font-medium text-foreground">
          Site name
        </label>
        <input
          id="siteName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
          required
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Used as the browser tab title and the logo&apos;s alt text.
        </p>
      </div>

      <div className="mt-4">
        <label htmlFor="tagline" className="text-sm font-medium text-foreground">
          Tagline
        </label>
        <textarea
          id="tagline"
          value={tagline}
          onChange={(event) => setTagline(event.target.value)}
          rows={3}
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Used as the page description for search engines and link previews.
        </p>
      </div>

      <div className="mt-6">
        <span className="text-sm font-medium text-foreground">Logo</span>
        <div className="mt-2 flex items-center gap-4">
          <div className="relative flex h-14 w-32 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
            <Image
              src={logoPreview}
              alt="Logo preview"
              width={100}
              height={40}
              className="h-auto max-h-12 w-auto object-contain"
              unoptimized
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
            className="text-sm text-muted-foreground"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {saved && !error && <p className="mt-4 text-sm text-foreground">Saved.</p>}

      <Button type="submit" className="mt-6" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save site settings"}
      </Button>
      </form>

      <YouTubeConnectionCard />
    </>
  );
}

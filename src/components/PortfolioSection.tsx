"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/FilterBar";
import { PortfolioCard } from "@/components/PortfolioCard";
import { VideoLightbox } from "@/components/VideoLightbox";
import { ALL_CATEGORIES } from "@/types/portfolio";
import type { PortfolioCategory, PortfolioItem } from "@/types/portfolio";

interface PortfolioSectionProps {
  items: PortfolioItem[];
}

function parseFilter(value: string | null): PortfolioCategory | "all" {
  if (value && ALL_CATEGORIES.includes(value as PortfolioCategory)) {
    return value as PortfolioCategory;
  }
  return "all";
}

export function PortfolioSection({ items: portfolioItems }: PortfolioSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory | "all">(() =>
    parseFilter(searchParams.get("filter"))
  );
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleFilterChange = useCallback(
    (value: PortfolioCategory | "all") => {
      setActiveFilter(value);
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete("filter");
      } else {
        params.set("filter", value);
      }
      const query = params.toString();
      // Persist the selection in the URL so a reload (or a background tab
      // Chrome discards and reloads later) restores the same filter instead
      // of silently resetting to "All".
      router.replace(query ? `/?${query}` : "/", { scroll: false });
    },
    [router, searchParams]
  );

  const visibleItems = useMemo(() => {
    if (activeFilter === "all") return portfolioItems;
    return portfolioItems.filter((item) => item.categories.includes(activeFilter));
  }, [activeFilter, portfolioItems]);

  const handlePlay = (item: PortfolioItem) => {
    if (item.videoUrl) setActiveVideo(item.videoUrl);
  };

  return (
    <section id="work" className="pt-[114px]">
      <FilterBar active={activeFilter} onChange={handleFilterChange} />
      <div className="columns-1 sm:columns-2 lg:columns-4 gap-0">
        {visibleItems.map((item) => (
          <div key={item.id} className="break-inside-avoid">
            <PortfolioCard item={item} onPlay={handlePlay} />
          </div>
        ))}
      </div>
      <VideoLightbox videoUrl={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
}

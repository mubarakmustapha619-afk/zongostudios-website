"use client";

import { useMemo, useState } from "react";
import { FilterBar } from "@/components/FilterBar";
import { PortfolioCard } from "@/components/PortfolioCard";
import { VideoLightbox } from "@/components/VideoLightbox";
import type { PortfolioCategory, PortfolioItem } from "@/types/portfolio";

interface PortfolioSectionProps {
  items: PortfolioItem[];
}

export function PortfolioSection({ items: portfolioItems }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory | "all">("all");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const visibleItems = useMemo(() => {
    if (activeFilter === "all") return portfolioItems;
    return portfolioItems.filter((item) => item.categories.includes(activeFilter));
  }, [activeFilter, portfolioItems]);

  const handlePlay = (item: PortfolioItem) => {
    if (item.videoUrl) setActiveVideo(item.videoUrl);
  };

  return (
    <section id="work" className="pt-[114px]">
      <FilterBar active={activeFilter} onChange={setActiveFilter} />
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

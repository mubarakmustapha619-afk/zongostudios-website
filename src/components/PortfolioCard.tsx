import Image from "next/image";
import Link from "next/link";
import type { PortfolioItem } from "@/types/portfolio";
import { CATEGORY_LABELS } from "@/types/portfolio";
import { EyeIcon, VideoBadgeIcon } from "@/components/icons";

interface PortfolioCardProps {
  item: PortfolioItem;
  onPlay: (item: PortfolioItem) => void;
}

export function PortfolioCard({ item, onPlay }: PortfolioCardProps) {
  const primaryCategory = item.categories[0];
  const categoryLabel = primaryCategory ? CATEGORY_LABELS[primaryCategory] : null;

  return (
    <div className="group relative overflow-hidden">
      <button
        type="button"
        onClick={() => onPlay(item)}
        aria-label={`Play ${item.title}`}
        className="absolute inset-0 z-10"
      />
      <Image
        src={item.image}
        alt={item.title}
        width={900}
        height={540}
        className="h-auto w-full object-cover"
      />
      <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white">
        <VideoBadgeIcon className="h-4 w-4 text-[#3d3d3d]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-white/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="flex h-full items-center justify-center">
          <EyeIcon className="h-6 w-6 text-foreground" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="text-[11px] tracking-[3px] text-black uppercase">
          {item.title}
        </span>
        {categoryLabel && (
          <span className="mt-2 text-[12px] tracking-[3px] text-muted-foreground uppercase">
            {categoryLabel}
          </span>
        )}
        <Link
          href={`/work/${item.id}`}
          className="pointer-events-auto mt-3 text-[11px] tracking-[3px] uppercase text-accent-gold underline-offset-4 hover:underline"
        >
          View Project
        </Link>
      </div>
    </div>
  );
}

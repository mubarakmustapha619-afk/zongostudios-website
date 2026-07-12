export type PortfolioCategory =
  | "feature-episodic"
  | "commercial"
  | "music-video"
  | "narrative"
  | "short";

export const CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  "feature-episodic": "FEATURE & EPISODIC",
  commercial: "COMMERCIAL",
  "music-video": "MUSIC VIDEO",
  narrative: "NARRATIVE",
  short: "SHORT",
};

export const ALL_CATEGORIES: PortfolioCategory[] = [
  "feature-episodic",
  "commercial",
  "music-video",
  "narrative",
  "short",
];

export interface PortfolioItem {
  id: string;
  title: string;
  categories: PortfolioCategory[];
  image: string;
  videoUrl: string | null;
}

export interface FilterOption {
  label: string;
  value: PortfolioCategory | "all";
}

export interface InstagramPost {
  id: string;
  image: string;
  href: string;
  isCarousel: boolean;
}

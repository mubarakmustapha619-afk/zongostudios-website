export type PortfolioCategory = "film" | "documentary" | "corporate" | "commercials";

export const CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  film: "FILM",
  documentary: "DOCUMENTARY",
  corporate: "CORPORATE",
  commercials: "COMMERCIALS",
};

export const ALL_CATEGORIES: PortfolioCategory[] = [
  "film",
  "documentary",
  "corporate",
  "commercials",
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

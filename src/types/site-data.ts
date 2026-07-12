import type { PortfolioItem } from "./portfolio";

export interface ContactSocialLink {
  label: string;
  href: string;
  icon: "linkedin" | "vimeo" | "instagram";
}

export interface ContactInfo {
  email: string;
  phone: string;
  socialLinks: ContactSocialLink[];
}

export interface SiteSettings {
  name: string;
  tagline: string;
  logoUrl: string;
}

export interface SiteData {
  portfolioItems: PortfolioItem[];
  contact: ContactInfo;
  site: SiteSettings;
}

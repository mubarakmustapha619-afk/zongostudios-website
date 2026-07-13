export const filterOptions = [
  { label: "All", value: "all" },
  { label: "Film", value: "film" },
  { label: "Documentary", value: "documentary" },
  { label: "Corporate", value: "corporate" },
  { label: "Commercials", value: "commercials" },
] as const;

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
  { label: "Instagram", href: "#instagram" },
] as const;

export const instagramBio = {
  handle: "zongostudios",
  lines: ["Reel creator", "Colorist 🎨", "Cinematographer 🎥", "🧵 zongostudios"],
  profileUrl: "https://www.instagram.com/zongostudios/",
};

export const socialLinks = [
  { label: "LinkedIn", href: "http://www.linkedin.com/in/marinastarkecolorist", icon: "linkedin" },
  { label: "Vimeo", href: "https://vimeo.com/marinastarke", icon: "vimeo" },
  { label: "Instagram", href: "https://www.instagram.com/marinastarke.color", icon: "instagram" },
] as const;

export const copyright = "Zongostudios © 2026 | Imprint";

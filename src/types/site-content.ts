export const filterOptions = [
  { label: "All", value: "all" },
  { label: "Feature & Episodic", value: "feature-episodic" },
  { label: "Commercial", value: "commercial" },
  { label: "Music Video", value: "music-video" },
  { label: "Narrative", value: "narrative" },
  { label: "Short", value: "short" },
] as const;

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
  { label: "Instagram", href: "#instagram" },
] as const;

export const representation = [
  {
    flag: "🇬🇧🇪🇺",
    name: "Okay Studio",
    href: "https://www.okaystudio.co.uk/",
    emails: [{ label: "production@okaystudio.co.uk", href: "mailto:production@okaystudio.co.uk" }],
  },
  {
    flag: "🇺🇸🇲🇽🇨🇦",
    name: "Ethos Studio",
    href: "https://ethos.studio/",
    emails: [
      { label: "eps@ethos.studio", href: "mailto:eps@ethos.studio" },
      { label: "color@ethos.studio", href: "mailto:color@ethos.studio" },
    ],
  },
  {
    flag: "🌍",
    prefix: "Feature & Episodic",
    name: "MAP Berlin",
    href: "https://m-a-p.berlin/",
    contactName: "Doro Becker-Vogt",
    emails: [{ label: "doro@m-a-p.berlin", href: "mailto:doro@m-a-p.berlin" }],
  },
];

export const instagramBio = {
  handle: "marinastarke.color",
  lines: [
    "🌙 colorist based in berlin (on a break from DMs)",
    "🇬🇧🇪🇺• @okaystudio",
    "🇺🇸🇲🇽🇨🇦• @ethos_studio",
    "🌍 feature & episodic • @mapberlin",
  ],
  profileUrl: "https://www.instagram.com/marinastarke.color",
};

export const socialLinks = [
  { label: "LinkedIn", href: "http://www.linkedin.com/in/marinastarkecolorist", icon: "linkedin" },
  { label: "Vimeo", href: "https://vimeo.com/marinastarke", icon: "vimeo" },
  { label: "Instagram", href: "https://www.instagram.com/marinastarke.color", icon: "instagram" },
] as const;

export const copyright = "Marina Starke © 2021 | Imprint";

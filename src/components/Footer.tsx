import { LinkedinIcon, VimeoIcon, InstagramIcon } from "@/components/icons";
import { socialLinks, copyright } from "@/types/site-content";

const iconMap = {
  linkedin: LinkedinIcon,
  vimeo: VimeoIcon,
  instagram: InstagramIcon,
};

export function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        {socialLinks.map((social) => {
          const Icon = iconMap[social.icon];
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border text-foreground hover:opacity-75 transition-opacity"
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
      </div>
      <p className="text-[11px] tracking-[2px] uppercase text-muted-foreground">
        {copyright}
      </p>
    </footer>
  );
}

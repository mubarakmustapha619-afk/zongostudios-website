"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/icons";
import { navLinks } from "@/types/site-content";

function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("relative block h-7 w-[79px]", className)}>
      <Image
        src="/images/logo/logo@1x.png"
        alt="Marina Starke"
        width={79}
        height={28}
        className="h-7 w-auto object-contain"
      />
    </span>
  );
}

export function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className="fixed inset-x-0 top-0 z-[310] bg-background">
      <div className="flex flex-col items-center justify-between gap-2 px-6 py-4 md:px-10 lg:px-16 min-[951px]:flex-row min-[951px]:gap-0 min-[951px]:py-8">
        <a href="#" className="order-2 min-[951px]:order-1">
          <Logo />
        </a>

        <nav className="hidden min-[951px]:order-2 min-[951px]:flex">
          <ul className="flex items-center gap-6">
            {navLinks.map((link, index) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "font-sans text-[15px] font-normal normal-case tracking-normal text-foreground transition-opacity duration-150 ease-in-out hover:opacity-60",
                    index === 0 && "text-text-muted-light"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="order-1 flex items-center justify-center p-2 min-[951px]:hidden"
        >
          {isOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-foreground" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 border-b border-border bg-background duration-200 min-[951px]:hidden">
          <ul className="flex flex-col items-center gap-6 py-6">
            {navLinks.map((link, index) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    "block px-4 py-2 font-sans text-[15px] font-normal normal-case tracking-normal text-foreground transition-opacity duration-150 ease-in-out hover:opacity-60",
                    index === 0 && "text-text-muted-light"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex justify-center pb-6">
            <Logo />
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { filterOptions } from "@/types/site-content";
import type { PortfolioCategory } from "@/types/portfolio";

interface FilterBarProps {
  active: PortfolioCategory | "all";
  onChange: (value: PortfolioCategory | "all") => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-1 px-6 py-6 bg-background">
      {filterOptions.map((option) => {
        const isActive = option.value === active;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "px-[15px] py-[6px] text-xs tracking-[3px] uppercase transition-colors",
              isActive
                ? "bg-filter-active-bg text-foreground line-through"
                : "bg-background text-foreground hover:bg-filter-active-bg"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </nav>
  );
}

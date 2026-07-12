"use client";

import { useEffect, useState } from "react";
import { ChevronUpIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed z-[300] bottom-[70px] right-[59px] flex items-center justify-center w-[45px] h-[44px] rounded-full bg-background border border-border text-foreground shadow-sm transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <ChevronUpIcon className="w-5 h-5" />
    </button>
  );
}

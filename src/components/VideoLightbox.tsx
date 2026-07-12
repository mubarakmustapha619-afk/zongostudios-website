"use client";

import { useEffect } from "react";
import { CloseIcon } from "@/components/icons";

interface VideoLightboxProps {
  videoUrl: string | null;
  onClose: () => void;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  let videoId: string | null = null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1).split("/")[0] || null;
    } else if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.replace("/embed/", "").split("/")[0] || null;
      }
    }
  } catch {
    return null;
  }

  if (!videoId) return null;

  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
}

export function getVimeoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("vimeo.com")) return null;
    const videoId = parsed.pathname.split("/").filter(Boolean)[0];
    if (!videoId || !/^\d+$/.test(videoId)) return null;
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  } catch {
    return null;
  }
}

export function getVideoEmbedUrl(url: string): string | null {
  return getYouTubeEmbedUrl(url) ?? getVimeoEmbedUrl(url);
}

export function VideoLightbox({ videoUrl, onClose }: VideoLightboxProps) {
  useEffect(() => {
    if (!videoUrl) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoUrl, onClose]);

  if (!videoUrl) return null;

  const embedUrl = getVideoEmbedUrl(videoUrl);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />
      <button
        type="button"
        className="absolute top-6 right-6 z-10 text-white"
        onClick={onClose}
        aria-label="Close video"
      >
        <CloseIcon className="w-6 h-6" />
      </button>
      <div
        className="relative w-full max-w-5xl aspect-video mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <p className="flex h-full w-full items-center justify-center text-white">
            Unable to load video.
          </p>
        )}
      </div>
    </div>
  );
}

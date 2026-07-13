"use client";

import { useEffect } from "react";
import { CloseIcon } from "@/components/icons";
import { getVideoEmbedUrl } from "@/lib/video-embed";

interface VideoLightboxProps {
  videoUrl: string | null;
  onClose: () => void;
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

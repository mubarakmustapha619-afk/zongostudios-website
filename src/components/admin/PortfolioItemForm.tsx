"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getVideoEmbedUrl } from "@/components/VideoLightbox";
import { cn } from "@/lib/utils";
import { ALL_CATEGORIES, CATEGORY_LABELS } from "@/types/portfolio";
import type { PortfolioCategory, PortfolioItem } from "@/types/portfolio";

interface PortfolioItemFormProps {
  item?: PortfolioItem;
  onSaved: (item: PortfolioItem) => void;
  onCancel?: () => void;
}

async function uploadVideoToYouTube(
  file: File,
  title: string,
  onProgress: (percent: number) => void
): Promise<string> {
  const sessionResponse = await fetch("/api/admin/youtube/upload-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      fileSizeBytes: file.size,
      mimeType: file.type || "video/mp4",
    }),
  });

  if (!sessionResponse.ok) {
    const data = await sessionResponse.json().catch(() => null);
    throw new Error(data?.error || "Failed to start YouTube upload session.");
  }

  const { uploadUrl } = await sessionResponse.json();

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(`https://youtu.be/${data.id}`);
        } catch {
          reject(new Error("Failed to parse YouTube's response."));
        }
      } else {
        reject(new Error(`YouTube upload failed (${xhr.status}).`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(file);
  });
}

export function PortfolioItemForm({ item, onSaved, onCancel }: PortfolioItemFormProps) {
  const isEditing = !!item;

  const [title, setTitle] = useState(item?.title ?? "");
  const [categories, setCategories] = useState<Set<PortfolioCategory>>(
    new Set(item?.categories ?? [])
  );
  const [videoUrl, setVideoUrl] = useState(item?.videoUrl ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [videoMode, setVideoMode] = useState<"link" | "upload">("link");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [youtubeConnected, setYoutubeConnected] = useState<boolean | null>(null);

  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/youtube/status")
      .then((res) => (res.ok ? res.json() : { connected: false }))
      .then((data) => {
        if (!cancelled) setYoutubeConnected(Boolean(data.connected));
      })
      .catch(() => {
        if (!cancelled) setYoutubeConnected(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleUploadVideo = async () => {
    if (!videoFile) return;
    setError(null);
    setIsUploadingVideo(true);
    setUploadProgress(0);
    try {
      const url = await uploadVideoToYouTube(
        videoFile,
        title.trim() || "Untitled upload",
        setUploadProgress
      );
      setVideoUrl(url);
      setVideoMode("link");
      setVideoFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload video.");
    } finally {
      setIsUploadingVideo(false);
      setUploadProgress(null);
    }
  };

  const toggleCategory = (category: PortfolioCategory) => {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const embedPreview = videoUrl.trim() ? getVideoEmbedUrl(videoUrl.trim()) : null;
  const videoUrlError = videoUrl.trim() && !embedPreview;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (categories.size === 0) {
      setError("Select at least one category.");
      return;
    }
    if (!isEditing && !imageFile) {
      setError("A thumbnail image is required.");
      return;
    }
    if (videoUrlError) {
      setError("Video URL must be a valid YouTube or Vimeo link.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("title", title.trim());
      categories.forEach((category) => formData.append("categories", category));
      formData.set("videoUrl", videoUrl.trim());
      if (imageFile) formData.set("image", imageFile);

      const response = await fetch(
        isEditing ? `/api/admin/portfolio/${item!.id}` : "/api/admin/portfolio",
        { method: isEditing ? "PATCH" : "POST", body: formData }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error || "Failed to save portfolio item.");
        return;
      }

      const data = await response.json();
      onSaved(data.item as PortfolioItem);

      if (!isEditing) {
        setTitle("");
        setCategories(new Set());
        setVideoUrl("");
        setImageFile(null);
        setImagePreview(null);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-card p-6"
    >
      <div>
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
          required
        />
      </div>

      <div className="mt-4">
        <span className="text-sm font-medium text-foreground">Categories</span>
        <div className="mt-2 flex flex-wrap gap-3">
          {ALL_CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <input
                type="checkbox"
                checked={categories.has(category)}
                onChange={() => toggleCategory(category)}
                className="h-4 w-4 rounded border-border"
              />
              {CATEGORY_LABELS[category]}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <span className="text-sm font-medium text-foreground">Video</span>
        <div className="mt-2 flex gap-4 border-b border-border text-xs">
          <button
            type="button"
            onClick={() => setVideoMode("link")}
            className={cn(
              "-mb-px border-b-2 pb-1.5 font-medium uppercase tracking-wide",
              videoMode === "link"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Paste a link
          </button>
          <button
            type="button"
            onClick={() => setVideoMode("upload")}
            className={cn(
              "-mb-px border-b-2 pb-1.5 font-medium uppercase tracking-wide",
              videoMode === "upload"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Upload a file
          </button>
        </div>

        {videoMode === "link" && (
          <div className="mt-3">
            <label htmlFor="videoUrl" className="sr-only">
              Video URL (YouTube or Vimeo)
            </label>
            <input
              id="videoUrl"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://youtu.be/… or https://vimeo.com/…"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
            />
            {videoUrlError && (
              <p className="mt-1 text-xs text-destructive">
                This doesn&apos;t look like a valid YouTube or Vimeo link.
              </p>
            )}
            {embedPreview && (
              <div className="mt-3 aspect-video w-full max-w-xs overflow-hidden rounded-md">
                <iframe src={embedPreview} className="h-full w-full" allow="fullscreen" />
              </div>
            )}
          </div>
        )}

        {videoMode === "upload" && (
          <div className="mt-3">
            {youtubeConnected === false && (
              <p className="text-xs text-muted-foreground">
                YouTube isn&apos;t connected yet. Connect it under Site Settings first.
              </p>
            )}
            {youtubeConnected !== false && (
              <>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)}
                  disabled={isUploadingVideo}
                  className="text-sm text-muted-foreground"
                />
                <div className="mt-2 flex items-center gap-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!videoFile || isUploadingVideo}
                    onClick={handleUploadVideo}
                  >
                    {isUploadingVideo
                      ? `Uploading… ${uploadProgress ?? 0}%`
                      : "Upload to YouTube"}
                  </Button>
                  {videoUrl && !isUploadingVideo && (
                    <span className="text-xs text-muted-foreground">
                      Uploaded: {videoUrl}
                    </span>
                  )}
                </div>
                {isUploadingVideo && (
                  <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-foreground transition-all"
                      style={{ width: `${uploadProgress ?? 0}%` }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        <span className="text-sm font-medium text-foreground">Thumbnail</span>
        <div className="mt-2 flex items-center gap-4">
          {imagePreview && (
            <div className="relative h-20 w-32 overflow-hidden rounded-md border border-border">
              <Image src={imagePreview} alt="" fill className="object-cover" unoptimized />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            className="text-sm text-muted-foreground"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Add item"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

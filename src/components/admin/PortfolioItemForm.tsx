"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getVideoEmbedUrl } from "@/components/VideoLightbox";
import { ALL_CATEGORIES, CATEGORY_LABELS } from "@/types/portfolio";
import type { PortfolioCategory, PortfolioItem } from "@/types/portfolio";

interface PortfolioItemFormProps {
  item?: PortfolioItem;
  onSaved: (item: PortfolioItem) => void;
  onCancel?: () => void;
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

  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

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
        <label htmlFor="videoUrl" className="text-sm font-medium text-foreground">
          Video URL (YouTube or Vimeo)
        </label>
        <input
          id="videoUrl"
          value={videoUrl}
          onChange={(event) => setVideoUrl(event.target.value)}
          placeholder="https://youtu.be/… or https://vimeo.com/…"
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
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

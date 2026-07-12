"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PortfolioItemForm } from "@/components/admin/PortfolioItemForm";
import { CATEGORY_LABELS } from "@/types/portfolio";
import type { PortfolioItem } from "@/types/portfolio";

interface PortfolioAdminProps {
  items: PortfolioItem[];
  onItemsChange: (items: PortfolioItem[]) => void;
}

export function PortfolioAdmin({ items, onItemsChange }: PortfolioAdminProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreated = (item: PortfolioItem) => {
    onItemsChange([item, ...items]);
  };

  const handleUpdated = (item: PortfolioItem) => {
    onItemsChange(items.map((existing) => (existing.id === item.id ? item : existing)));
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this portfolio item? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      if (response.ok) {
        onItemsChange(items.filter((item) => item.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-sm font-semibold text-foreground">Add portfolio item</h2>
        <div className="mt-3">
          <PortfolioItemForm onSaved={handleCreated} />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-foreground">
          Existing items ({items.length})
        </h2>
        <ul className="mt-3 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-border bg-card p-4">
              {editingId === item.id ? (
                <PortfolioItemForm
                  item={item}
                  onSaved={handleUpdated}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md border border-border">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized={item.image.startsWith("http")}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.categories.map((c) => CATEGORY_LABELS[c]).join(", ")}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(item.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === item.id}
                      onClick={() => handleDelete(item.id)}
                    >
                      {deletingId === item.id ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">No portfolio items yet.</p>
          )}
        </ul>
      </section>
    </div>
  );
}

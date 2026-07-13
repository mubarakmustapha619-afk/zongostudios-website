"use client";

import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";

export function YouTubeConnectionCard() {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/youtube/status")
      .then((res) => (res.ok ? res.json() : { connected: false }))
      .then((data) => {
        if (!cancelled) setConnected(Boolean(data.connected));
      })
      .catch(() => {
        if (!cancelled) setConnected(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-8 max-w-xl rounded-lg border border-border bg-card p-6">
      <h2 className="text-sm font-semibold text-foreground">Video Hosting (YouTube)</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Connect a YouTube account to upload portfolio videos directly from the admin
        panel. Uploads are set to Unlisted automatically.
      </p>

      <div className="mt-4 flex items-center gap-3">
        {connected === null && (
          <span className="text-sm text-muted-foreground">Checking connection…</span>
        )}
        {connected === true && (
          <>
            <span className="text-sm text-foreground">✓ Connected</span>
            <a
              href="/api/admin/youtube/connect"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Reconnect
            </a>
          </>
        )}
        {connected === false && (
          <a href="/api/admin/youtube/connect" className={buttonVariants({ size: "sm" })}>
            Connect YouTube
          </a>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Note: because this app isn&apos;t Google-verified, the connection expires after
        about 7 days — just click Reconnect when uploads start failing.
      </p>
    </div>
  );
}

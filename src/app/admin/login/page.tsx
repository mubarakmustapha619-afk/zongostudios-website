"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!password) {
      setError("Password is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error || "Incorrect password");
        setIsSubmitting(false);
        return;
      }

      // Leave isSubmitting true — the page is navigating away, so the
      // spinner should stay put rather than flicker back before that lands.
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-sm"
      >
        <h1 className="text-lg font-semibold text-foreground">Admin Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the admin password to manage site content.
        </p>

        <div className="mt-6">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
          />
        </div>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Signing in…" : "Sign In"}
        </Button>
      </form>
    </div>
  );
}

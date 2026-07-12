"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ContactInfo, ContactSocialLink } from "@/types/site-data";

interface ContactAdminProps {
  contact: ContactInfo;
  onContactChange: (contact: ContactInfo) => void;
}

const ICON_OPTIONS: ContactSocialLink["icon"][] = ["linkedin", "vimeo", "instagram"];

export function ContactAdmin({ contact, onContactChange }: ContactAdminProps) {
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState(contact.phone);
  const [socialLinks, setSocialLinks] = useState<ContactSocialLink[]>(contact.socialLinks);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateLink = (index: number, patch: Partial<ContactSocialLink>) => {
    setSocialLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, ...patch } : link))
    );
  };

  const addLink = () => {
    setSocialLinks((prev) => [...prev, { label: "", href: "", icon: "linkedin" }]);
  };

  const removeLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, socialLinks }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error || "Failed to save contact info.");
        return;
      }

      const data = await response.json();
      onContactChange(data.contact as ContactInfo);
      setSocialLinks(data.contact.socialLinks);
      setSaved(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl rounded-lg border border-border bg-card p-6"
    >
      <div>
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
          placeholder="you@example.com"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="phone" className="text-sm font-medium text-foreground">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
          placeholder="+49 30 1234567"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Leave email or phone blank to hide it from the public site.
        </p>
      </div>

      <div className="mt-6">
        <span className="text-sm font-medium text-foreground">Social links</span>
        <div className="mt-2 space-y-3">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                value={link.icon}
                onChange={(event) =>
                  updateLink(index, {
                    icon: event.target.value as ContactSocialLink["icon"],
                  })
                }
                className="rounded-md border border-border bg-background px-2 py-2 text-sm capitalize outline-none"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <input
                value={link.label}
                onChange={(event) => updateLink(index, { label: event.target.value })}
                placeholder="Label"
                className="w-32 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
              <input
                value={link.href}
                onChange={(event) => updateLink(index, { href: event.target.value })}
                placeholder="https://…"
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeLink(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addLink}>
          Add social link
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {saved && !error && <p className="mt-4 text-sm text-foreground">Saved.</p>}

      <Button type="submit" className="mt-6" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save contact info"}
      </Button>
    </form>
  );
}

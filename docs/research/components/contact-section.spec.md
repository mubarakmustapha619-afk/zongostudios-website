# ContactSection Specification

## Overview
- **Target file:** `src/components/ContactSection.tsx`
- **Screenshot:** `docs/design-references/marinastarke.com/contact-section.png` (note: screenshot is dark-inverted due to a browser rendering artifact during inspection — the real site is light-themed; use the computed-style colors below, not the screenshot's colors)
- **Interaction model:** static (no hover/scroll/click behaviors beyond standard link hovers)

## Content
Import from `src/types/site-content.ts` → `representation` array. Each entry:
```ts
{ flag: string; name: string; href: string; prefix?: string; contactName?: string; emails: { label: string; href: string }[] }
```

Render exactly (verbatim real copy, three lines):
1. 🇬🇧🇪🇺 • **OKAY STUDIO** | production@okaystudio.co.uk
2. 🇺🇸🇲🇽🇨🇦 • **ETHOS STUDIO** | eps@ethos.studio color@ethos.studio
3. 🌍 • **FEATURE & EPISODIC** | **MAP BERLIN** | Doro Becker-Vogt | doro@m-a-p.berlin

Heading above the list: "Represented By" (rendered uppercase via CSS `text-transform: uppercase`, not by hardcoding caps in the string).

## DOM Structure
```
<section id="contact" class="py-24 px-6 text-center border-t border-border">
  <h2>Represented By</h2>
  <div class="flex flex-col gap-4 mt-8">
    {representation.map(rep => (
      <p>
        {rep.flag} • {rep.prefix && <>{rep.prefix} | </>}
        <a href={rep.href}>{rep.name}</a>
        {rep.contactName && <> | {rep.contactName}</>}
        {" | "}
        {rep.emails.map(e => <a href={e.href}>{e.label}</a>)}
      </p>
    ))}
  </div>
</section>
```

## Computed Styles (exact values from getComputedStyle)

### Section
- Sits directly on the page background (`background-color: #ffffff`), no distinct bg of its own
- Has a top border/divider separating it from the portfolio grid above (a thin horizontal rule) — `border-top: 1px solid #e5e5e5` (approx, use the existing `--border` token)
- Generous vertical padding (section reads as a spacious, centered block — use `py-20 md:py-28`)
- Text is center-aligned

### Heading ("Represented By")
- Bold, letter-spaced, uppercase — approximate as `font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #3a3a3a` (`rgb(58,58,58)` region — this heading reads visually bolder/larger than the body lines, distinguish it from the link/body styling below)

### Body text / lines
- `color: rgb(122,122,122)` (`#7a7a7a`, muted gray) for the plain text portions (flag, "•", pipe separators, prefix labels, contact names)
- `font-size: 16px` base (Lato)
- Line height generous (`leading-loose` / ~28-32px) for breathing room between the 3 lines

### Links (studio names + emails)
- `color: rgb(229,174,71)` — **gold/amber accent** (`#e5ae47`, already added as `--accent-gold` in `src/app/globals.css`, use `text-accent-gold`)
- `font-size: 14px; letter-spacing: 2px; text-transform: uppercase; font-weight: 400`
- Hover: no specific value captured — apply a safe default `hover:opacity-75 transition-opacity`

## States & Behaviors
- Static section, no scroll/hover-triggered layout changes. Standard link hover only (opacity dim, per above).

## Assets
- None (emoji flags are rendered as literal Unicode characters, no image assets needed)

## Text Content (verbatim)
Already encoded in `src/types/site-content.ts` → `representation`. Do not alter the copy.

## Responsive Behavior
- **Desktop:** as described, comfortably centered with a max content width (`max-w-2xl mx-auto` on the text block is reasonable to prevent overly long line lengths).
- **Mobile:** same centered layout, text remains centered; ensure long email addresses wrap gracefully (`break-words`) rather than overflowing on narrow viewports.

## Build notes
- Verify with `npx tsc --noEmit` before finishing.

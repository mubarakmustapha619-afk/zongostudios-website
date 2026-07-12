# HeaderNav Specification

## Overview
- **Target file:** `src/components/HeaderNav.tsx`
- **Screenshot:** `docs/design-references/marinastarke.com/desktop-full.png` (top ~120px), `docs/design-references/marinastarke.com/mobile-full.png` (top ~90px)
- **Interaction model:** click-driven (mobile dropdown toggle) + responsive (breakpoint switch)
- **IMPORTANT — colors:** reference screenshots may look dark-inverted (a browser rendering artifact during inspection). The REAL site is light-themed: white background, dark charcoal text. Use the color values below (from `getComputedStyle`), NOT what you might guess from a screenshot. Site's actual CSS custom properties already exist in `src/app/globals.css`: `--background` (#ffffff), `--foreground` (#3a3a3a), `--muted-foreground` (#7a7a7a), `--border` (#e5e5e5).

## Content
- Logo: two-line wordmark "MARINA / STARKE" — but rendered as a single logo IMAGE (not text), located at `/images/logo/logo@1x.png` (200x64 natural size, use `srcSet` with `/images/logo/logo@2x.png` for retina). Displayed at 79x28px in the header. Use Next.js `<Image>` with `width={79} height={28}`.
- Nav links (in order): "Work" → `#work`, "Contact" → `#contact`, "Instagram" → `#instagram`. Import from `src/types/site-content.ts` → `navLinks`.
- All anchor links should smooth-scroll to their target section (use `scroll-behavior: smooth` globally, already fine to add to `html` in globals.css if not present — check first).

## DOM Structure
```
<header> (fixed, top-0, full width, z-index above content, bg-background)
  <div> (flex row, justify-between, align-center, container padding)
    <a href="#"> logo image </a>
    <nav> (desktop only, ≥950px)
      <ul> WORK · CONTACT · INSTAGRAM </ul>
    </nav>
    <button> (mobile only, <950px) chevron toggle </button>
  </div>
  <div> (mobile dropdown panel, only rendered when open, <950px)
    <ul> WORK / CONTACT / INSTAGRAM stacked, centered </ul>
    <logo image repeated below links>
  </div>
</header>
```

## Computed Styles (exact values from getComputedStyle / getBoundingClientRect)

### Header container
- `position: fixed; top: 0; left: 0; right: 0; z-index: 310`
- `background-color: #ffffff` (real value — screenshot artifacts aside)
- `height: 114px` on desktop (auto/content-driven is fine — don't hardcode, just match the padding below)
- Horizontal padding: roughly 154px logo-left-inset at 1440px viewport — simplest correct approach: use a responsive horizontal padding (`px-6 md:px-10 lg:px-16`, roughly landing near the observed 154px left-inset at 1440px is generous — a `max-w-full px-6 sm:px-10 lg:px-16` container is acceptable, exact px isn't load-bearing here since it's whitespace)
- Vertical: nav row sits with logo top-offset `48px`, logo height `28px` → header effectively ~`py-8` on desktop (approximate 32px top padding, adjust to visually match: logo vertically centered in a ~114px-tall bar)

### Logo
- Rendered size: `79px × 28px` (2.82:1 aspect ratio ≈ source 200:64 = 3.125:1 — use `object-contain` to avoid distortion, wrap in a fixed-height container `h-7` and let width auto-scale)
- `next/image` with `src="/images/logo/logo@1x.png"`, `alt="Marina Starke"`

### Desktop nav links (`.top-nav-wrap a`)
- `font-family: var(--font-sans)` (Lato)
- `font-size: 15px`
- `font-weight: 400`
- `letter-spacing: normal`
- `text-transform: none` (already capitalized as "Work", "Contact", "Instagram" — NOT uppercase, unlike the filter pills)
- Gap between nav items: `24px` (measured via getBoundingClientRect)
- Color: default `#3a3a3a` (`rgb(58,58,58)`); the current/first item ("Work") is slightly muted `#8d8d8d` (`rgb(141,141,141)`) — apply this muted color only to the first nav link as a static style (there's no active-section-tracking observed, just a fixed subtle de-emphasis on "Work")
- Hover state: not explicitly captured — apply a simple `opacity: 0.6` transition on hover as a safe default (150ms ease)

### Mobile toggle button (<950px)
- Centered chevron-down icon (use `ChevronDownIcon` from `src/components/icons.tsx`), toggles to `ChevronUpIcon` (or rotate 180deg) when panel is open
- Sits centered horizontally, ~30px tall tap target, roughly `py-4` from top
- Logo centered below the toggle row when collapsed

### Mobile dropdown panel (<950px, open state)
- Full-width panel below the toggle row, `background-color: #ffffff`, subtle bottom border (`border-b border-border`)
- Vertical stack of nav links, centered, `gap-6` (24px), `padding: 24px 0`
- Each link: same font styling as desktop (15px Lato) but slightly larger tap-friendly padding (`py-2`)
- Logo repeated centered below the links, same 79×28 size
- Closed → open transition: simple slide/fade, `max-height` transition or Tailwind `animate-in fade-in slide-in-from-top-2 duration-200` (use Tailwind's built-in animate utilities, already available via `tw-animate-css` import in globals.css)

## States & Behaviors

### Responsive breakpoint (exact, verified in theme CSS)
- **Breakpoint:** `950px` — use `min-[951px]:flex` / `max-[950px]:hidden` Tailwind arbitrary breakpoints, or add a custom `sm-nav: 950px` value — simplest: use Tailwind's default and treat `lg:` (1024px) as close enough is WRONG, must be 950px exactly. Use arbitrary variants: `hidden min-[951px]:flex` for desktop nav, `min-[951px]:hidden` for mobile toggle + panel.
- **≥951px:** horizontal row — logo left, nav links right, both vertically centered, single line, no toggle button rendered.
- **≤950px:** centered column — toggle button top-center, logo centered below it (when closed). Clicking toggle reveals the dropdown panel.

### Mobile menu toggle (click-driven)
- **Trigger:** click on chevron button
- **State A (closed):** panel not rendered / height 0, chevron pointing down
- **State B (open):** panel expands showing WORK/CONTACT/INSTAGRAM stacked + logo, chevron flips to X or points up
- **Transition:** ~200ms ease fade/slide (Tailwind `animate-in`/`animate-out` or a simple CSS max-height transition)
- Clicking a link in the open panel should close the panel (in addition to scrolling to the section)

## Assets
- Logo: `/images/logo/logo@1x.png`, `/images/logo/logo@2x.png`
- Icons: `ChevronDownIcon`, `ChevronUpIcon` (or `CloseIcon`) from `src/components/icons.tsx`

## Text Content (verbatim)
- Nav: "Work", "Contact", "Instagram" (Title Case, not uppercase — this differs from the filter bar which IS uppercase)
- Logo alt text: "Marina Starke"

## Responsive Behavior
- **Desktop (≥951px):** horizontal header, logo left / nav right, as described above.
- **Mobile/Tablet (≤950px):** centered stacked header with dropdown toggle, as described above. Verified visually identical at both 768px and 390px viewports (no separate tablet layout — mobile pattern applies to both).
- **Breakpoint:** `950px` exactly (from live theme CSS `@media screen and (max-width: 950px)`).

## Build notes
- This component owns no portfolio/filter state — it's presentational plus its own open/closed toggle state (`useState`).
- Verify with `npx tsc --noEmit` before finishing.

# PortfolioCard Specification

## Overview
- **Target file:** `src/components/PortfolioCard.tsx`
- **Screenshot:** `docs/design-references/marinastarke.com/desktop-full.png` (grid area, rows starting ~y=220)
- **Interaction model:** hover-driven overlay + click-driven (opens a lightbox — but the lightbox itself is a SEPARATE component; this card just needs an `onPlay` callback prop, do not implement the modal here)
- **IMPORTANT — colors:** ignore any dark-inverted appearance in reference screenshots (browser rendering artifact from inspection, not the real site). Real values from `getComputedStyle`, given below, are ground truth. The real site is light-themed.

## Props
```ts
interface PortfolioCardProps {
  item: PortfolioItem; // from src/types/portfolio.ts — { id, title, categories, image, videoUrl }
  onPlay: (item: PortfolioItem) => void;
}
```

## DOM Structure
```
<div class="group relative overflow-hidden"> (the card, aspect ratio driven by the image's natural size — use next/image with fill or intrinsic sizing; do NOT force a fixed square aspect ratio, the original grid is a true masonry with varied image aspect ratios)
  <button onClick={() => onPlay(item)} class="absolute inset-0 z-10"> (the whole-image click target, opens lightbox)
  <Image src={item.image} alt={item.title} /> (fills the card)
  <div class="badge"> small video-camera icon badge, always visible, top-right-ish corner (see badge spec below — actually verify exact corner from screenshot; in the reference it reads as roughly top-right of each tile) </div>
  <div class="hover-overlay"> (opacity 0 → 1 on group-hover) white 50%-opacity scrim + centered eye icon </div>
  <div class="hover-title"> (opacity 0 → 1 on group-hover) centered title + category label, black text </div>
</div>
```

## Computed Styles (exact values from getComputedStyle)

### Card / grid tile
- No gap between adjacent tiles: `gap: 0` at the grid level (tiles are edge-to-edge, confirmed via `getBoundingClientRect` — adjacent tile edges touch exactly, 0px gap)
- `overflow: hidden`
- `position: relative`
- Image: `object-fit: cover`, fills tile, `width: 100%`

### Format badge (always visible, small icon top-right of each tile)
- White circular background: `background-color: #ffffff`
- Icon: video-camera glyph, `color: rgb(61,61,61)` (`#3d3d3d`), roughly `16px` icon size inside a `~28px` circle
- Position: absolute, small inset from top-right corner (approx `8px` from top/right — exact px wasn't pinned down during extraction, use `top-2 right-2` as a safe default)
- Use `VideoBadgeIcon` from `src/components/icons.tsx`

### Hover scrim (`.image-overlay` equivalent)
- Base: `opacity: 0`
- Hover: `opacity: 1`
- `background-color: rgba(255,255,255,0.5)` — a WHITE 50%-opacity scrim (NOT dark — this was verified via computed style; do not use a dark/black overlay here)
- `transition: opacity 500ms, background-color 500ms`
- Contains a centered eye icon (`EyeIcon` from icons.tsx), `color: rgb(252,252,252)` (near-white), also opacity 0→1 on hover, layer this ABOVE the scrim (higher z-index) so it's visible against the light scrim — actually since the scrim is white/light and the icon is near-white it will have low contrast; for practical visibility in the clone, render the eye icon in `text-foreground` (dark) instead so it's visible against the light scrim — deviate from the literal near-white value here in favor of visible contrast, since the literal source may rely on the underlying photo showing through partially.

### Hover title block (`.media-hovers` equivalent)
- Base: `opacity: 0`, not interactive (`pointer-events: none`) when hidden
- Hover: `opacity: 1`
- Centered horizontally and vertically over the tile
- Title text (`h3.post-title a`): `font-family: Lato; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: rgb(0,0,0)` — BLACK text (verified, not white — the dark-looking overlay text in inspection screenshots was a rendering artifact)
- Text should wrap and center within the tile with some horizontal padding (`px-6`) so long titles don't touch the edges
- Category label appears below the title in the original (smaller, muted) — optional secondary line, can reuse category label styling from the filter pills (12px, uppercase, letter-spacing 3px, muted gray `#7a7a7a`)
- Background behind text: none needed beyond the scrim already covering the tile

## States & Behaviors

### Hover (hover-driven, NOT scroll or click)
- **Trigger:** CSS `:hover`/`group-hover` on the card container (use Tailwind `group` / `group-hover:opacity-100`)
- **State A (default):** scrim + eye icon + title block all `opacity-0`
- **State B (hover):** all fade to `opacity-100`
- **Transition:** `duration-500` (500ms, matches verified theme value), ease default

### Click (click-driven)
- **Trigger:** click anywhere on the tile
- **Behavior:** call `onPlay(item)` — the parent (`PortfolioSection`) will open the shared `VideoLightbox` with `item.videoUrl`. Do not implement any modal/video logic in this component.

## Assets
- Images: `item.image` (already a local path like `/images/portfolio/2455.png`), loaded via `next/image`
- Icons: `VideoBadgeIcon`, `EyeIcon` from `src/components/icons.tsx`

## Text Content (verbatim)
- Titles come from `item.title` (real data, e.g. "Converse x Daily Paper (Fabio de Frel / Jake Gabbay)") — already populated in `src/types/portfolio-data.ts`, no need to hardcode anything.

## Responsive Behavior
- Card itself has no internal responsive logic — it just fills whatever grid cell the parent grid places it in (parent handles 1/2/4-column responsive layout via CSS columns or grid). On touch devices there's no hover, so consider making the title/scrim always-visible-on-tap is NOT required for this clone (out of scope, desktop-hover-only is acceptable per "no personal aesthetic changes" — keep faithful to hover-only behavior; touch users click straight through to the lightbox).

## Build notes
- Use Tailwind `group`/`group-hover:` utilities, no JS-driven hover state needed.
- Verify with `npx tsc --noEmit` before finishing.

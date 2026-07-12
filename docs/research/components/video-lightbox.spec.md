# VideoLightbox Specification

## Overview
- **Target file:** `src/components/VideoLightbox.tsx`
- **Screenshot:** `docs/design-references/marinastarke.com/lightbox-open.png` (dark overlay with loading spinner + X close button, captured mid-load)
- **Interaction model:** click-driven (opened by a click on a `PortfolioCard`; closed by clicking the X, clicking outside the video, or pressing Escape)

## Props
```ts
interface VideoLightboxProps {
  videoUrl: string | null; // e.g. "https://youtu.be/9tBBtuLlzkY?si=..." — null/undefined means closed
  onClose: () => void;
}
```

## Behavior summary (verified live on the real site)
Clicking a portfolio thumbnail does NOT navigate away — it opens a full-viewport modal (the original site uses the jQuery "prettyPhoto" lightbox plugin) that shows a dark overlay, a centered loading spinner while the embed loads, and an X close button in the top-right. The video itself is a YouTube link (`https://youtu.be/<id>?...`) — for the Next.js clone, convert this to a YouTube **embed** iframe (`https://www.youtube-nocookie.com/embed/<id>?autoplay=1`) rather than trying to replicate prettyPhoto's YouTube-oEmbed-scraping approach.

## DOM Structure
```
<div class="fixed inset-0 z-[1000] flex items-center justify-center"> (overlay, only rendered when videoUrl is set)
  <div class="absolute inset-0 bg-black/90" onClick={onClose} /> (backdrop, click to close)
  <button class="absolute top-6 right-6 z-10" onClick={onClose}> <CloseIcon /> </button>
  <div class="relative w-full max-w-5xl aspect-video mx-4"> (video container, stops click propagation)
    <iframe src={embedUrl} allow="autoplay; fullscreen" allowFullScreen class="w-full h-full" />
  </div>
</div>
```

## Computed Styles
- Overlay backdrop: near-black translucent, `background-color: rgba(0,0,0,0.9)` (matches the dark full-viewport scrim observed on click)
- Close button (`X`): white/light icon, top-right of viewport, roughly `24px` icon at `24px` inset from edges (`top-6 right-6` in Tailwind ≈ 24px)
- Video container: centered, constrained to a reasonable max width (`max-w-5xl` ≈ 1024px) preserving 16:9 aspect ratio (`aspect-video`), with horizontal margin on small viewports so it never touches the screen edges
- z-index must be above the fixed header (`header` uses `z-[310]`) — use something like `z-[1000]` here

## States & Behaviors

### Open (click-driven)
- **Trigger:** `videoUrl` prop becomes non-null (parent sets it from a `PortfolioCard` click)
- **Entrance:** simple fade-in, `animate-in fade-in duration-200` (Tailwind, via the already-imported `tw-animate-css`)
- Extract the YouTube video ID from `videoUrl` (handles both `youtu.be/<id>?si=...` and `youtube.com/watch?v=<id>` forms — the real data only uses the `youtu.be/<id>?si=...` short form, but handle both defensively) and build `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0`
- While the iframe is loading there's no need to hand-roll a spinner — browsers/YouTube handle their own loading state inside the iframe; keep the implementation simple (no artificial spinner needed, unlike the original site's prettyPhoto loading state, since a real iframe loads its own content directly).

### Close (click-driven)
- **Triggers:** click on the backdrop, click the X button, or `Escape` keydown (add a `useEffect` with a `keydown` listener while open)
- **Behavior:** call `onClose()`, which the parent uses to reset the active video to `null`, unmounting the iframe (important: unmount rather than just hide, so playback actually stops)
- Also lock body scroll while open (`document.body.style.overflow = 'hidden'` on open, restore on close/unmount) — the original site does this implicitly via the lightbox plugin.

## Assets
- `CloseIcon` from `src/components/icons.tsx`

## Text Content
- No visible text content in this component beyond the close affordance.

## Responsive Behavior
- Mobile: video container shrinks to fill available width minus small margin (`mx-4`), aspect ratio preserved via `aspect-video`, close button stays fixed top-right at a slightly smaller inset if needed (`top-4 right-4` on small screens is acceptable).

## Build notes
- This is a self-contained, controlled component (open/closed driven entirely by the `videoUrl` prop, no internal open state).
- Verify with `npx tsc --noEmit` before finishing.

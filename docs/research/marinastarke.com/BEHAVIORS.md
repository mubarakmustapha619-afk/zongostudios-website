# Behaviors — marinastarke.com

## Filter bar (click-driven, NOT scroll-driven)
- **Trigger:** click on a filter pill (`.filters li a`)
- **Mechanism:** Isotope.js `.isotope({ filter: ... })`, updates URL hash to `#filter:<category>` (deeplinking)
- **Active state:** `text-decoration: line-through`, `color: rgb(63,63,63)`, `background: rgb(247,247,247)` (vs inactive `background: rgb(255,255,255)`, `color: rgb(58,58,58)`)
- **Grid reflow:** items animate/reposition via Isotope's default transition (~0.4s ease) when filter changes; non-matching items are hidden, matching items reflow to fill gaps (masonry-style)
- Pill text: `font-size: 12px; letter-spacing: 3px; text-transform: uppercase; padding: 6px 15px 7px`

## Portfolio card hover (hover-driven)
- **Trigger:** `:hover` on `.post-media-in-wrap`
- **Base state:** `.media-hovers.media-hover-fade` overlay `opacity: 0` (hidden)
- **Hover state:** overlay fades to `opacity: 1`, reveals `h3.post-title` (text: e.g. "Converse x Daily Paper (Fabio de Frel / Jake Gabbay)"; `font: 11px Lato, uppercase, letter-spacing: 3px, color: rgb(0,0,0)` — black) plus category label (`post-categories`)
- Separately, `.image-overlay` (white `rgba(255,255,255,0.5)` scrim) and its `.fa-eye` icon (`color: rgb(252,252,252)`, opacity 0→1) fade in on `.post-media:hover`
- **Transition:** opacity fade (theme default `transition: opacity 0.3s` — verify exact duration per theme CSS if needed; treat 300ms ease as safe default)
- Always-visible badge: `.post-format-icon` — white circle bg (`rgb(255,255,255)`), dark video-camera icon (`fa-file-video-o`, `color: rgb(61,61,61)`) — sits top-right/corner of each thumbnail regardless of hover.

## Portfolio card click → lightbox (click-driven)
- **Trigger:** click on the `.image-overlay a` (eye icon region — the whole clickable image essentially), `rel="prettyPhoto[<id>]"`, `href` = YouTube URL
- **Behavior:** jQuery prettyPhoto lightbox opens: full-viewport dark overlay, centered loading spinner while iframe loads, X close button top-right of viewport. Loads the YouTube video as an embedded iframe player once ready.
- Clicking the (hover-revealed) title text instead navigates to a standalone project page — out of scope for this clone (homepage-only per scope defaults).

## Header / nav (responsive, NOT scroll-triggered)
- Header is `position: fixed; top: 0; z-index: 310` at all scroll positions — no observed shrink/shadow-on-scroll behavior (stays constant).
- **Responsive breakpoint:** somewhere between 768px and 1024px, nav switches from horizontal (logo left, links right) to a centered-logo + chevron-toggle dropdown menu.
  - Mobile/tablet (<~1024px): centered stacked logo, chevron-down (▾) toggle button top-center. Click toggles a dropdown panel: WORK / CONTACT / INSTAGRAM stacked vertically, centered, logo repeated below the links. Chevron flips to X while open.
  - Desktop (≥~1024px): logo top-left (2-line wordmark), nav links top-right in a row (WORK · CONTACT · INSTAGRAM), 15px Lato, `letter-spacing: normal`. Non-current-section links `color: rgb(58,58,58)`; "WORK" (current/first) appears slightly muted `rgb(141,141,141)`.

## Smooth scroll (page-wide)
- Body class `smoothscroll` — nav anchor clicks (`#work`, `#contact`, `#instagram`) smooth-scroll to the target section rather than jumping instantly.

## Back-to-top button
- Fixed `bottom: 70px; right: 59px`, `45x44px` hit area, chevron-up icon (`fa-angle-up`). Appears/visible once page is scrolled (verify exact show/hide threshold — likely always rendered, simplest to just always show it once scrolled past header height, ~100px).

## Instagram "More" pagination (click-driven)
- `.sbi_load_btn` — dark button (`background: rgb(51,51,51); color: white; padding: 7px 14px; font-size: 13px`) at the bottom of the initial IG post grid. Click loads additional posts via the Instagram Feed plugin's AJAX pagination. For the clone, mock with a static "MORE" button that reveals additional pre-downloaded posts (no live IG API).

## Responsive grid columns (portfolio grid)
- Mobile (<~600px): 1 column, full-width stacked
- Tablet (~768px): 2 columns
- Desktop (≥~1024px): 4 columns
- Masonry-style packing (Isotope) — row heights vary per item's natural aspect ratio, items pack to avoid gaps.

## Responsive sweep results
| Width | Nav | Grid columns |
|---|---|---|
| 1440px | horizontal, logo left / links right | 4 |
| 1024px | horizontal, logo left / links right | 4 |
| 768px | centered logo + chevron dropdown | 2 |
| 390px | centered logo + chevron dropdown | 1 |

# Page Topology — marinastarke.com

Site type: WordPress (Hyperx theme / WPBakery / "Royal Portfolio" plugin), single-page ("onepage-menu") portfolio site for a film colorist. `smoothscroll` + `deeplinking` body classes — anchor nav scrolls smoothly and updates the URL hash.

**IMPORTANT — color scheme note:** The browser used for inspection has OS/Chrome-level forced-dark-mode active, which repaints the page (white→black, dark-text→white-text) at the paint layer WITHOUT altering `getComputedStyle()` values or the DOM. All screenshots taken during recon are therefore colour-INVERTED from the real site. Verified via computed styles: body bg `rgb(255,255,255)`, nav/filter text `rgb(58,58,58)`–`rgb(63,63,63)`, hover-title text `rgb(0,0,0)`. **The real site is light-themed**: white/off-white background, dark charcoal text, gold/amber accent links (`rgb(229,174,71)`). Build against computed-style values, not screenshot colors. Screenshots are still valid for layout/spacing/structure.

## Sections (top to bottom)

1. **Header/Nav** — fixed, full-width, `z-index: 310`. Logo left ("MARINA STARKE" stacked 2-line wordmark, styled with unusual letter glyphs via a custom font/spacing hack), nav right (WORK / CONTACT / INSTAGRAM — anchor links `#work` `#contact` `#instagram`). Desktop layout (horizontal) kicks in between 768–1024px; below that, logo centers and a chevron-down toggle opens a stacked dropdown menu (WORK/CONTACT/INSTAGRAM/logo).
2. **Filter bar** (`#work`) — sticky-in-flow row of category pills: ALL / FEATURE & EPISODIC / COMMERCIAL / MUSIC VIDEO / NARRATIVE / SHORT. Click-driven Isotope.js filter (NOT scroll-driven). Active pill gets `text-decoration: line-through`. Updates URL hash (`#filter:commercial`) — deep-linkable.
3. **Portfolio grid** — Isotope.js masonry grid, 96 items total (some belong to multiple categories). 4 columns desktop (≥~1024px), 2 columns tablet (~768px), 1 column mobile (<~600px). Each item: thumbnail image, hidden-by-default hover overlay (white 50%-opacity scrim + eye icon + title/category revealed), small always-visible format-icon badge (video camera icon, white circle). Click on thumbnail → opens a prettyPhoto jQuery lightbox modal loading the item's YouTube video inline (dark overlay, spinner, X close button). Click on the (hover-revealed) title text → navigates to a separate WordPress project detail page (`/portfolio/items/<slug>/`) — OUT OF SCOPE per clone defaults (homepage only).
4. **Contact section** (`#contact`) — "Represented By" heading + 3 lines of representation info (Okay Studio / Ethos Studio / MAP Berlin), each with a flag emoji, name, and gold-accent email link(s).
5. **Instagram section** (`#instagram`) — Instagram Feed plugin: profile header (avatar, handle "marinastarke.color", bio text with emoji + agency handles), then a grid of recent IG posts (image tiles with a "multi-image" icon badge on carousel posts), then a dark "More" load-more button (`sbi_load_btn`, bg `rgb(51,51,51)`, white text) that paginates in more posts.
6. **Footer** — horizontal rule divider, centered row of social icons (LinkedIn, Vimeo, Instagram — each a dark icon in a white circle button; several other icon slots present in DOM but empty/unused: Facebook, Pinterest, VK, Reddit, Dribbble), centered copyright line "Marina Starke © 2021 | Imprint" (light gray, letter-spaced, uppercase-ish small caps styling).
7. **Back-to-top button** — fixed, bottom-right (`bottom: 70px; right: 59px`), circular chevron-up icon, appears after scrolling.

## Layout notes
- Max content width appears to be full-bleed (grid stretches edge-to-edge, no centered max-width container observed on the grid itself).
- No visible page-level scroll-snap.
- Header is `position: fixed` at `top: 0`, white/transparent per computed style but sits above grid content (z-index 310); grid content scrolls underneath it.
- Grid uses Isotope.js absolute-positioning reflow animation when filtering (default ~0.4s reposition transition).

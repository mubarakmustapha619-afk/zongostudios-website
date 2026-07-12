# InstagramSection Specification

## Overview
- **Target file:** `src/components/InstagramSection.tsx`
- **Screenshot:** `docs/design-references/marinastarke.com/instagram-section.png` (dark-inverted rendering artifact from inspection — real site is light-themed, use computed-style colors below not the screenshot's colors)
- **Interaction model:** click-driven "load more" pagination (mocked — no live Instagram API)

## Content
- Import `instagramPosts` from `src/types/instagram-data.ts` (17 real posts: `{ id, image, href, isCarousel }`)
- Import `instagramBio` from `src/types/site-content.ts`: `{ handle, lines: string[], profileUrl }`
- Avatar image: `/images/instagram/avatar.webp`

## DOM Structure
```
<section id="instagram" class="py-16">
  <a href={instagramBio.profileUrl} class="flex flex-col items-center gap-3 text-center mb-10">
    <Image src="/images/instagram/avatar.webp" class="rounded-full" width={56} height={56} />
    <div>
      <h3>{instagramBio.handle}</h3>
      {instagramBio.lines.map(line => <p>{line}</p>)}
    </div>
  </a>
  <div class="grid grid-cols-3 md:grid-cols-6"> (initially show first 6 posts, "More" reveals the rest)
    {visiblePosts.map(post => (
      <a href={post.href} target="_blank" class="relative aspect-square block">
        <Image src={post.image} fill class="object-cover" />
        {post.isCarousel && <CarouselBadgeIcon class="absolute top-2 right-2 text-white" />}
      </a>
    ))}
  </div>
  {hasMore && <button onClick={showMore} class="sbi-load-btn">More</button>}
</section>
```

## Computed Styles (exact values from getComputedStyle)

### Bio header
- Avatar: circular, ~56px diameter (`rounded-full`, `w-14 h-14`)
- Handle (`h3`, e.g. "marinastarke.color"): bold, `~16px`, `color: #3a3a3a`
- Bio lines: `color: rgb(122,122,122)` (muted gray), `font-size: 14px`, centered, one line per array entry (there are 4 lines in the real bio — render each on its own line, don't concatenate)

### Post grid
- No gap between tiles (`gap-0` / `gap-px` at most — the reference shows tiles touching or near-touching), square aspect ratio per tile (`aspect-square`), `object-cover`
- Grid columns: `grid-cols-3` on mobile, `grid-cols-6` on desktop (matches the reference screenshot showing 6 across on desktop)
- Carousel badge icon: small, white/light, top-right corner of tile (`top-2 right-2`), only rendered when `post.isCarousel` is true — use `CarouselBadgeIcon` from `src/components/icons.tsx`

### "More" button (`sbi_load_btn` equivalent)
- `background-color: rgb(51,51,51)` (`#333333`, dark gray — this is a real, intentional dark button even though the surrounding page is light-themed)
- `color: #ffffff`
- `font-size: 13px`
- `padding: 7px 14px`
- No border, slightly rounded corners are acceptable (`rounded-sm`) though not explicitly measured — small pill-ish button, centered below the grid, with vertical margin (`mt-8`)

## States & Behaviors

### "More" button (click-driven, mocked pagination)
- **Trigger:** click on the "More" button
- **Behavior:** since there's no live Instagram API in this clone, implement this as local state: show first 6 posts initially (`useState(6)`), clicking "More" increases the visible count by 6 (or reveals all remaining `instagramPosts`), hide the button once all posts are shown (`hasMore = visibleCount < instagramPosts.length`)
- No specific transition captured for the grid reflow — a simple appearance of new tiles (no special animation needed) is acceptable.

## Assets
- Avatar: `/images/instagram/avatar.webp`
- Post images: `post.image` for each entry in `instagramPosts` (already local paths like `/images/instagram/post-3.jpg`)
- Icon: `CarouselBadgeIcon` from `src/components/icons.tsx`

## Text Content (verbatim)
- Handle: "marinastarke.color"
- Bio lines (render exactly, each on own line):
  1. "🌙 colorist based in berlin (on a break from DMs)"
  2. "🇬🇧🇪🇺• @okaystudio"
  3. "🇺🇸🇲🇽🇨🇦• @ethos_studio"
  4. "🌍 feature & episodic • @mapberlin"
- Button label: "More"

## Responsive Behavior
- **Desktop:** 6-column post grid, bio header sized as above.
- **Mobile:** 3-column post grid (`grid-cols-3`), bio header content unchanged (already centered/stacked, scales naturally).
- **Breakpoint:** use Tailwind `md:` (768px) for the 3→6 column switch.

## Build notes
- Note the intentional light/dark contrast: the whole section is light-themed EXCEPT the "More" button, which is a deliberately dark pill button — don't "fix" this to match the light theme, it's a verified real design choice (Instagram Feed plugin's default button style, left as-is by the site).
- Verify with `npx tsc --noEmit` before finishing.

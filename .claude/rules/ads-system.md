---
paths:
  - src/lib/ads/**
  - src/components/ads/**
  - src/app/layout.tsx
  - src/components/layout/ClientRuntimeMounts.client.jsx
---

# Ads System — Complete Map

## Runtime state (production)
- `ADSENSE_CLIENT_ID=ca-pub-5421885011942418` — set in production env
- `GOOGLE_CERTIFIED_CMP_ENABLED=true` — ads ARE live and earning
- Slot IDs in `src/lib/ads/manual-config.js` — edit here to change/add placements

## AdSense unit IDs (from AdSense dashboard)
| Unit name | Slot ID | Format |
|---|---|---|
| Events_Detail_Top_Horizontal_01 | 8090183510 | Display |
| Events_Detail_InArticle_01 | 1176301123 | In-article |
| Events_Feed_Horizontal_01 | 4296454334 | Display |
| Date_InArticle_01 | 2723286705 | In-article |
| Date_Top_Horizontal_01 | 7427984329 | Display |
| Blog_Top_Horizontal_01 | 5906753168 | Display |
| Native_Blog_List_InFeed_01 | 1390179264 | In-feed |
| Desktop_Sidebar_Left_01 | 5183828891 | Display |
| Desktop_Sidebar_Right_01 | 4134471107 | Display |
| Native_Content_End_Multiplex_01 | 3132380621 | Multiplex |
| Native_Events_List_InFeed_01 | 1947291465 | In-feed |
| Calculators_InSection_Mid_01 | 1236962564 | In-article |
| Prayer_Top_Horizontal_01 | 5557556347 | Display (created 2026-07-05, dedicated prayer-section top banner) |
| Time_Top_Horizontal_01 | 5425659014 | Display (created 2026-07-05, time-now + time-difference top banner) |
| Calculators_Top_Horizontal_01 | 3292274096 | Display (created 2026-07-05, dedicated calculators top banner) |

Note (2026-07-05): before these three existed, time/prayer/calculators top banners all reused the
Events unit ID (8090183510), so per-section revenue was invisible in AdSense reports. Now each major
section reports separately — expect "Events_Detail_Top_Horizontal_01" impressions to drop and the new
units to absorb them after deploy.

## Ad components (all in src/components/ads/)
- `AdTopBanner` — horizontal leaderboard, placed AFTER `<h1>`, before first content block
- `AdInArticle` — fluid native unit, placed BETWEEN major content sections. Max 2 per page.
- `AdMultiplex` — content-recommendation grid, placed at end of page
- `AdInFeed` — native in-feed unit for list/feed layouts
- `AdEventsFeedHorizontal` — horizontal display for events feed
- `AdSidebarSticky` — desktop-only sidebar (requires ≥1440px). Active on blog articles and holiday detail pages via `AdLayoutWrapper sidebarMode="dual"`
- `AdStickyAnchor` — mobile sticky bottom banner. Mounted globally in `ClientRuntimeMounts.client.jsx` but **DISABLED since 2026-07-05** (`stickyAnchor: ''` in manual-config.js): it had reused the topBanner slot ID (forbidden by its own header — impression conflicts) and competed with Google's Auto anchor, which the 2026-07 format report showed is the site's best earner (RPM 5.56 MAD / AV 0.85 vs manual display 1.31 / 0.28). The Auto anchor now owns the bottom position. Re-enabling requires a DEDICATED anchor unit from AdSense — never a display slot ID.

## Slot resolution fallback chain
Each component reads route prefix → looks up section-specific slot key → falls back to generic key.
Example for `/mwaqit-al-salat`: tries `topPrayerBanner` → falls back to `topBanner`.
Fallback is handled by `resolveManualAdSlot()` in `src/lib/ads/slot-resolution.ts`.

## Ad coverage per section (current state after 2026-07-03 fixes)
| Route | Top | InArticle | Multiplex |
|---|---|---|---|
| /holidays/[slug] | ✅ | ✅ ×1 | ✅ |
| /holidays (hub) | ✅ | ✅ | ✅ |
| /date/* | ✅ (layout) | ✅ | ✅ (layout) |
| /blog/[slug] | ✅ | ✅ | ✅ |
| /blog (hub) | ✅ | — | ✅ |
| /time-now (hub) | ✅ | ✅ (added 2026-07-03, between clock and country directory) | ✅ |
| /time-now/[country] | ✅ | ✅ | ✅ |
| /time-now/[country]/[city] | ✅ | ✅ | ✅ |
| /time-difference/[from]/[to] | ✅ | ✅ | ✅ |
| /mwaqit-al-salat (hub) | ✅ | ✅ | ✅ |
| /mwaqit-al-salat/[country] | ✅ | ✅ | ✅ |
| /mwaqit-al-salat/[country]/[city] | ✅ | ✅ ×1 | ✅ |
| /calculators/* (common.jsx) | ✅ (between hero and tool, added to 15 more pages) | ✅ (after FAQ accordion) + ✅ (mid-section divider on long pages, activates when inArticleCalculatorMid slot filled) | ✅ (in RelatedCalculators) |

## Placement rules (updated 2026-06-23)
- **Max 1 AdInArticle** per page for short/medium pages. Long-form pages (blog articles) may use 2 if separated by 2+ major sections
- AdTopBanner: after `<h1>` and **outside** the hero section wrapper — not the last child inside it
- AdInArticle in calculators: **after** the FAQ accordion, not before it — users see FAQs first
- AdMultiplex: add `data-full-width-responsive="true"` to prevent overflow on RTL mobile
- **AdTopBanner must render inside the first mobile viewport, not just "after the H1."** A tall hero
  (nav grids, multi-line intros, a whole interactive tool + supplementary sections) can push the ad
  hundreds of pixels below what 96% of the site's traffic (mobile) actually sees before bouncing.
  Fixed 2026-07-05 on `/calculators` (ad moved from after the whole hero+nav grid to between the intro
  copy and the intent-nav — see `.calc-hub-v8-hero-ad` in `calculators.css`, pinned via explicit
  `grid-column`/`grid-row` so it doesn't disrupt the 2-column desktop layout) and `/time-difference`
  (ad moved from after several supplementary sections to right after the calculator tool itself — still
  satisfies "primary tool before ad", just cuts ~300 lines of content the ad used to sit behind).
  `/holidays` and `/time-now` already place the ad right after their intro/primary-tool block — use
  those as the reference pattern for any future hub page.

## Ad-free routes (intentional, from route-policy.js)
/about, /contact, /disclaimer, /editorial-policy, /fahras, /offline, /privacy, /search, /terms, /api/*

## Placement rules (from AdTopBanner.tsx JSDoc)
- AdTopBanner: after `<h1>`, before first content block — NOT before H1
- AdInArticle: between sections, never two back-to-back, never as first element
- AdMultiplex: at end of page, after all content
- Never inside a `.card` — between cards only

## Calculator page structure (common.jsx)
All calculator pages use these exported components in order:
1. `<CalculatorHero>` — contains AdTopBanner inside
2. `<CalculatorSection>` — tool form (the actual calculator)
3. `<CalculatorSection>` — content sections (1-4 per page)
4. `<CalculatorSection>` wrapping `<CalculatorFaqSection>` — contains AdInArticle before FAQ accordion
5. `<CalculatorSection>` wrapping `<RelatedCalculators>` — contains AdMultiplex at end

## Sidebar ads (active)
`AdSidebarSticky` is active on blog articles (`BlogArticlePage.jsx`) and holiday detail pages (`/holidays/[slug]/page.jsx`) via `AdLayoutWrapper sidebarMode="dual"`. Only shows at ≥1440px. Slot IDs: right: 4134471107, left: 5183828891.
Next candidates: prayer city pages (long-form, high-traffic).

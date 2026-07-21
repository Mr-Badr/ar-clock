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
- `AdTopBanner` — horizontal leaderboard. **v3 (2026-07-21): placed BEFORE the breadcrumb/`<h1>`,
  as the first child inside `<main>`, right below the fixed navbar** — reversed from the earlier
  "after H1" rule. Reason: most sessions on this site are quick-glance lookups (~96% mobile) that
  generate at most one viewable ad impression before leaving; putting the ad first guarantees it
  renders in the same viewport as the navbar regardless of hero height. Full history in
  `AdTopBanner.tsx`'s file-header JSDoc — don't re-litigate without reading that first.
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
Coverage (which sections have a top banner) is unchanged by the 2026-07-21 v3 repositioning — only
WHERE the top banner sits on each page changed (now before breadcrumb/H1, see above). This table also
doesn't yet list `/imsakiya/*` and `/countdown`, which do have a top banner (added later, pre-existing
gap in this table, not introduced by this change).

| Route | Top | InArticle | Multiplex |
|---|---|---|---|
| /holidays/[slug] | ✅ | ✅ ×1 | ✅ |
| /holidays (hub) | ✅ | ✅ | ✅ |
| /date/* | ✅ (layout) | ✅ | ✅ (layout) |
| /blog/[slug] | ✅ | ✅ | ✅ |
| /blog (hub) | ✅ | — | ✅ |
| /time-now (hub) | ✅ | ✅ (added 2026-07-03, between clock and country directory) | ✅ |
| /time-now/[country] | ✅ | ✅ ×2 (2nd after FAQ, added 2026-07-07) | ✅ |
| /time-now/[country]/[city] | ✅ | ✅ ×2 (2nd after FAQ, added 2026-07-07) | ✅ |
| /time-difference/[from]/[to] | ✅ | ✅ | ✅ |
| /mwaqit-al-salat (hub) | ✅ | ✅ | ✅ |
| /mwaqit-al-salat/[country] | ✅ | ✅ | ✅ |
| /mwaqit-al-salat/[country]/[city] | ✅ | ✅ ×1 | ✅ |
| /calculators/* (common.jsx) | ✅ (between hero and tool, added to 15 more pages) | ✅ (after FAQ accordion) + ✅ (mid-section divider on long pages, activates when inArticleCalculatorMid slot filled) | ✅ (in RelatedCalculators) |

## Format + centering rules (added 2026-07-07)
- **Horizontal banner units (AdTopBanner, AdEventsFeedHorizontal) use `data-ad-format="horizontal"`,
  NOT `"auto"`.** The slots reserve a 50–100px banner box with `overflow:hidden`; format "auto" let
  Google return 250px+ tall rectangles that rendered clipped mid-creative (broken-looking ads +
  policy risk). Never revert these to "auto" without also removing the height clamp.
- **RTL centering:** when Google downgrades a responsive unit to a fixed-width creative it sets an
  inline `width` on the `<ins>`; in RTL the block then hugs the visual RIGHT edge. `ads.css` fixes
  this globally: `margin-inline:auto` + `text-align:center` on `.ad-slot > .adsbygoogle` and
  `margin-inline:auto` on its direct child div. Don't remove these rules.
- **Large-desktop rails:** at ≥1800px the `.layout-with-ads` rails widen from 240px to 300px so
  Google can serve 300×600/300×250 (strongest desktop RPM sizes). Slot max-height becomes 620px.

## Placement rules (updated 2026-07-21)
- **Max 1 AdInArticle** per page for short/medium pages. Long-form pages (blog articles) may use 2 if separated by 2+ major sections
- AdTopBanner: first child inside `<main>`, before the breadcrumb nav and before `<h1>` (v3 — see
  `AdTopBanner.tsx` JSDoc). This supersedes the older "after H1, must render in first mobile viewport"
  rule below — placing it first makes that viewport concern moot by construction, since it no longer
  depends on hero height at all.
- AdInArticle in calculators: **after** the FAQ accordion, not before it — users see FAQs first
- AdMultiplex: add `data-full-width-responsive="true"` to prevent overflow on RTL mobile
- **Historical note (pre-2026-07-21):** AdTopBanner used to sit after `<h1>`, with a hard rule that it
  must still land inside the first mobile viewport — this required auditing hero height per page type
  (fixed on `/calculators` via `.calc-hub-v8-hero-ad` grid placement, `/time-difference`, and compact-hero
  converter pages). That whole class of bug is eliminated now that the ad renders before any hero
  content, first thing inside `<main>` on every page.

## Ad-free routes (intentional, from route-policy.js)
/about, /contact, /disclaimer, /editorial-policy, /fahras, /offline, /privacy, /search, /terms, /api/*

## Placement rules (from AdTopBanner.tsx JSDoc)
- AdTopBanner: first child inside `<main>`, before the breadcrumb and `<h1>` (v3, 2026-07-21)
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

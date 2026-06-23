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

## Ad components (all in src/components/ads/)
- `AdTopBanner` — horizontal leaderboard, placed AFTER `<h1>`, before first content block
- `AdInArticle` — fluid native unit, placed BETWEEN major content sections. Max 2 per page.
- `AdMultiplex` — content-recommendation grid, placed at end of page
- `AdInFeed` — native in-feed unit for list/feed layouts
- `AdEventsFeedHorizontal` — horizontal display for events feed
- `AdSidebarSticky` — desktop-only sidebar (requires ≥1440px), slots configured but NOT placed in any page yet
- `AdStickyAnchor` — mobile sticky bottom banner. ALREADY mounted globally in `ClientRuntimeMounts.client.jsx`. Requires `body.has-css-fullscreen` class to show. Activates on: homepage, /holidays/*, /date/*, /time-now/*, /time-difference/*.

## Slot resolution fallback chain
Each component reads route prefix → looks up section-specific slot key → falls back to generic key.
Example for `/mwaqit-al-salat`: tries `topPrayerBanner` → falls back to `topBanner`.
Fallback is handled by `resolveManualAdSlot()` in `src/lib/ads/slot-resolution.ts`.

## Ad coverage per section (current state after 2026-06-22 changes)
| Route | Top | InArticle | Multiplex |
|---|---|---|---|
| /holidays/[slug] | ✅ | ✅ ×2 | ✅ |
| /holidays (hub) | ✅ | ✅ | ✅ |
| /date/* | ✅ (layout) | ✅ | ✅ (layout) |
| /blog/[slug] | ✅ | ✅ | ✅ |
| /blog (hub) | ✅ | — | ✅ |
| /time-now/[country] | ✅ | ✅ | ✅ |
| /time-now/[country]/[city] | ✅ | ✅ | ✅ |
| /time-difference/[from]/[to] | ✅ | ✅ | ✅ |
| /mwaqit-al-salat (hub) | ✅ | ✅ | ✅ |
| /mwaqit-al-salat/[country] | ✅ | ✅ | ✅ (added 2026-06-22) |
| /mwaqit-al-salat/[country]/[city] | ✅ | ✅ ×2 | ✅ (added 2026-06-22) |
| /calculators/* (common.jsx) | ✅ | ✅ (in FAQ, added 2026-06-22) | ✅ (in RelatedCalculators, added 2026-06-22) |

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

## Sidebar ads (next opportunity)
`AdSidebarSticky` component is complete and slot IDs are set (right: 4134471107, left: 5183828891).
Only shows at ≥1440px wide screens. NOT placed in any page yet — needs layout wrapper with CSS positioning.
Best candidates: holiday detail pages, prayer city pages (long-form content).

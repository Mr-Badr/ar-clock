# Session notes — ar-clock / miqatona.com
Last updated: 2026-06-23

## What was done
- Setup session: CLAUDE.md, .claudeignore, .claude/settings.json, 7 path-scoped rules, memory system
- Ads expansion: filled manual-config.js slots, activated stickyAnchor, added Multiplex to prayer/calculator pages
- Growth plan: docs/growth-roadmap.md (tracks A–I, milestones M0–M5)
- **Previous features shipped:**
  - B1: new AdBlogSidebar component → blog article aside; holiday detail → sidebarMode="dual"
  - B2: AdStickyAnchor routes expanded to /blog/* and /mwaqit-al-salat/* (route-policy.js)
  - RelatedCalculators redesigned — card wall → 1 featured row + compact ranked rows w/ reason chips
  - Calculators hub title/desc rewritten with concrete tool names
  - `PrayerTimeline.client.jsx` — visual day-arc; added to all prayer city pages
  - `EndOfServiceChart.client.jsx` — Recharts donut + breakdown bars
  - VatSplitBar inline in `VatCalculator.client.jsx`
  - Ads B4 — in-feed on calculator hub (AdTopBanner, AdInFeed, AdMultiplex)
  - `bac-results-tunisia/` event — new event, validated clean via events:sync
  - 89 events live
  - `HolidayInternalLinks.jsx` — complete rewrite with prayer times link, calculator links

- **Growth roadmap M0+M1 shipped (2026-06-23, commit 689d04b):**
  - A1: `WebVitalsReporter.client.jsx` — LCP/INP/CLS → GA4/GTM, tagged by route family
  - C1+C2: 8 Islamic event titleTags rewritten: `{eventName} {{year}} - {{hijriYear}} هـ | {{formattedDate}}`
    (islamic-new-year, ashura, mawlid, eid-al-adha, eid-al-fitr, hajj-season, day-of-arafa, first-dhul-hijjah)
  - C3: Hub titles rewritten — time-now "100+ مدينة توقيت حي", time-difference "مباشر مع DST", prayer hub "أي مدينة"
  - C5: City time-now title → "ساعة حية وتاريخ اليوم"
  - B4: Prayer city generateMetadata calls calculatePrayerTimes → embeds Fajr+Maghrib in title+description
  - D1: 56 event package.json files updated with reciprocal relatedSlugs
  - F3: Reverted holiday sitemap alias regression (aliases excluded, canonicals only)
  - All 116 CI tests pass

## Key decisions / corrections
- Ads ARE live in production (GOOGLE_CERTIFIED_CMP_ENABLED=true) — not CMP-blocked
- Prayer times from calculatePrayerTimes() are already ISO strings — never call .toISOString() on them
- PrayerTimeline uses mounted gate (useState(false), setMounted(true) in useEffect) to prevent SSR/client mismatch
- Holiday sitemap must ONLY include canonical slugs — alias slugs would compete with canonicals (test 87-89)
- validate:holidays titleTag templates limited to 35-70 chars (checks raw template, not rendered string)
- `islamic_year_pair_missing` is a LIVE ERROR — Hijri event titles need `{{year}} - {{hijriYear}} هـ`
- `related_not_reciprocal` is a WARNING (non-blocking)
- WebSite+SearchAction schema already in SiteWideSchemas.jsx (H1 pre-done)
- Article schema already in BlogArticleView.jsx (H2 pre-done)

## Current task / next steps
- **Growth roadmap remaining tracks:**
  - B1-B3: Prayer city page content depth (first-answer block, monthly table, 6 FAQs per city)
  - B2: Internal link mesh (hub + country → all cities with descriptive RTL anchors)
  - D2: "المناسبة القادمة" next-event card at bottom of holiday pages
  - D4: Blog ↔ calculator bidirectional links
  - E1: Building calculators expansion (GCC+Levant+Egypt, material variants)
  - E2: Exam-results cluster (Maghreb + Levant + brevet/thanaweya)
  - E4: Time-difference programmatic for high-demand city pairs
  - G4: Sidebar ads on desktop (≥1440px), wrap blog + holiday in AdLayoutWrapper sidebarMode="dual"
  - G5: Second in-article ad on long pages (≥3 sections)
  - I1-I5: Calculator UX overhaul (spacing, RTL polish, charts)

## Blocked on
- GSC CTR triage: owner must export Search Console Performance CSV
- Live route health: needs production deploy access
- Growth roadmap A2: weekly CTR triage requires GSC CSV export

## Ad coverage (current state)
| Route | Top | InArticle | InFeed | Multiplex |
|---|---|---|---|---|
| /calculators (hub) | ✅ | — | ✅ | ✅ |
| /calculators/* | ✅ (in Hero) | ✅ (in FAQ) | — | ✅ (in Related) |
| /holidays/[slug] | ✅ | ✅ ×2 | — | ✅ |
| /blog/[slug] | ✅ | ✅ ×2 | — | ✅ |
| /mwaqit-al-salat/[country]/[city] | ✅ | ✅ ×2 | — | ✅ |
| /mwaqit-al-salat/[country] | ✅ | ✅ | — | ✅ |
| /time-now/* | ✅ | ✅ | — | ✅ |
| /date/* | ✅ | ✅ | — | ✅ |

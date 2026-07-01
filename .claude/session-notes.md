# Session notes — ar-clock / miqatona.com
Last updated: 2026-07-01

## What was done

### Shipped (commit 9e99be0, deployed 2026-07-01)
- **EOS franchise complete:** eos-kuwait · eos-qatar · eos-bahrain — all with mobile-first layout, country badges, entitlement progress bars, wait comparison sliders, milestone timelines
- **New calculators:** car-loan · gosi-retirement
- **UI/UX redesign (EOS):** removed gradients, fixed Arabic letter-spacing, replaced hardcoded hex colors, added country identity badges (🇰🇼🇶🇦🇧🇭) with pulsing live dots, sidebar facts mobile-visible
- **Bug fix:** CalculatorHero highlights — `{ label, desc }` objects were rendering as `[object Object]`; fixed with type detection in `common.jsx`
- **Keywords:** Kuwait/Qatar/Bahrain EOS keywords updated with action verbs, specific scenarios, year tokens
- **Holiday events:** 15+ new events live (BAC results BH/KW/UAE; pension days BH/KW/OM/Algeria/Jordan; salary days BH/JO/OM; school starts BH/JO/OM; qatar-national-sport-day; social-security-qatar; uae-founding-day + more national days)
- **Rules:** `.claude/rules/calculator-ui-standards.md` added — permanent UI standards for all future calculators

### Previous sessions (summary)
- Ads expansion: filled manual-config.js slots, activated stickyAnchor, AdBlogSidebar, B4 hub ads
- Growth roadmap M0+M1: WebVitals reporter, Islamic event titleTag rewrites (hijriYear pair), hub title rewrites, prayer city SEO
- 89+ events live total; holiday internal links complete rewrite
- RelatedCalculators redesigned (featured row + compact ranked rows)
- HolidayDetailsSections: EOS links for all 5 GCC countries

## Key decisions / corrections

- Gradients on calc form/result cards → FORBIDDEN. Use flat bg-surface-1 + border-top colored accent.
- `letter-spacing` on Arabic text → FORBIDDEN (DESIGN.md §9.2). Always 0.
- Hardcoded hex colors → FORBIDDEN. Always `var(--green-text)`, `var(--green-border)` etc.
- Prayer times from calculatePrayerTimes() are already ISO strings — never call .toISOString() on them
- Holiday sitemap must ONLY include canonical slugs — alias slugs would compete with canonicals
- `related_not_reciprocal` is a WARNING (non-blocking) — do not let it block events:sync
- `islamic_year_pair_missing` is a LIVE ERROR — Hijri event titles need `{{year}} - {{hijriYear}} هـ`
- WebSite+SearchAction schema already in SiteWideSchemas.jsx (pre-done)
- Article schema already in BlogArticleView.jsx (pre-done)
- **Search volume gate:** nothing enters Build Queue without 3 named Arabic keyword phrases with real volume

## Current build queue (priority order)

See `docs/holiday-event-opportunity-backlog.md` for full details.

| Priority | Item | Status |
|---|---|---|
| P1 | مخطط ختم القرآن في رمضان (`/calculators/ramadan-planner`) | Not started |
| P2 | تحسين صفحات أوقات الصلاة (monthly table, Qibla, FAQs) | Not started |
| P3 | حاسبة ضريبة الدخل المصرية (`/calculators/egypt-income-tax`) | Not started |
| P4 | تحسين صفحات الإسلاميات الموجودة (content depth on existing events) | Not started |
| P5 | مقيم الصحة المالية الخليجية (validate GSC first) | Parked |
| P6 | محسن الإجازات (validate GSC first) | Parked |

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

## Blocked on

- GSC CTR triage: owner must export Search Console Performance CSV — needed to validate P5/P6 and unblock A2
- Live route health: `npm run health:routes --base=https://miqatona.com`
- Google Search Console: manually request indexing for eos-kuwait, eos-qatar, eos-bahrain (user action)

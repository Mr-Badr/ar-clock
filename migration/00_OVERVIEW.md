# 🔍 00 — Migration Overview & Audit

**Status:** Version 3.1 — Modularized  
**Goal:** Zero breaking changes · 100% dynamic dates · #1 Arabic SEO  

---

## 1. Complete Codebase Audit

### File mapping
| File | Role |
|---|---|
| `src/lib/holidays-engine.js` | Logic-only re-exporting `ALL_EVENTS` |
| `src/lib/events/` | New database of 57 event definitions |
| `src/lib/event-content/` | Rich content, organized by country |
| `src/lib/hijri-resolver.js` | AlAdhan API + Fallback logic |
| `src/app/holidays/[slug]/page.jsx` | Dynamic detail page |

### Contracts that must NOT break
- Import paths to `@/lib/holidays-engine` and `@/lib/event-content` are permanent.
- All 57 slugs must produce the same URLs.

---

## 2. All Bugs Found (Summary)

- **Bug 1**: `quickFacts` Month/Day never update.
- **Bug 2**: `replaceYears` hardcoded range (2024–2030).
- **Bug 3**: `timeRange` filter is non-functional.
- **Bug 4**: `COUNTRIES` list is a hardcoded duplicate.
- **Bug 5**: Redundant AlAdhan API call.
- **Bug 6**: Monolithic script files.

---

## 3. Migration Roadmap

1. [Phase 1: Data Split](./01_DATA_SPLIT.md) — Extract events to `src/lib/events/`.
2. [Phase 2: Date System](./02_DATE_SYSTEM.md) — Overhaul `replaceYears` with `replaceTokens`.
3. [Phase 3: Rich Content](./03_RICH_CONTENT.md) — Reorganize content by country.
4. [Phase 4: Hijri Engine](./04_HIJRI_ENGINE.md) — Accuracy and resolver optimization.
5. [Phase 5: Filtering](./05_FILTERING.md) — Fix categories and country filters.
6. [Phase 6: SEO](./06_SEO.md) — Production-grade Arabic SEO.

---

## 4. Troubleshooting
- [Appendix: Slug Inventory](./APPENDIX_SLUGS.md)
- [How to add a new country](./00_OVERVIEW.md#adding-a-new-country)

---

### Adding a New Country (5 steps)
1. **`src/lib/events/jo.js`**: Define events with `_countryCode: 'jo'`.
2. **`src/lib/events/index.js`**: Import and add to `ALL_RAW_EVENTS`.
3. **`src/lib/event-content/countries/jo.js`**: Define rich content with `{{year}}` tokens.
4. **`src/lib/event-content/index.js`**: Import and spread into `ALL_RICH_CONTENT`.
5. **`src/lib/calendar-config.js`**: Add configuration and metadata for `jo`.

# Holidays + Fahras Premium Search/Filter UX — Redesign Plan

Status: **FULLY SHIPPED 2026-07-15.** Created 2026-07-14 from a full codebase audit (background Explore
agent, 63 tool calls) of the current `/holidays` and `/fahras` implementations. All 5 phases built,
visually verified in-browser at every step, and confirmed green on `lint`/`typecheck`/`test:unit`/
`seo:validate`/full production `build`. This doc is the durable record of what existed before, what
changed, and why — see §4 for the phase-by-phase completion log and the two deliberate deviations from
the original plan (breakpoint normalization skipped as unnecessary; typeahead delivered as recent-searches
instead of a live-suggestion dropdown).

Owner request (verbatim, 2026-07-14): give the user "perfect answers" when searching/filtering on
`/holidays`, better filters, live badges/colors, better related-items display, matching filter
improvements on `/fahras`, best UI/UX across all devices, competing with top websites, "super smart,"
"easy to use," "super clean."

---

## 1. Current State (verified by audit, file-accurate as of 2026-07-14)

### `/holidays` listing page — file map
| File | Role |
|---|---|
| `src/app/holidays/page.jsx` | Server: metadata, JSON-LD, hero, renders `HolidaysClient` + static quick-paths grid + trust section + `GeoInternalLinks` + `HolidaysSections` |
| `HolidaysClient.jsx` → `HolidaysClientShell.jsx` → `HolidaysClientInteractive.jsx` | Client state machine: `category`/`country`/`search`/`timeRange`/`sortMode`, 180ms debounce via `useDeferredValue`, URL query sync (`?category=&country=&q=&range=`) |
| `HolidaysFiltersPanel.jsx` | Filter UI: search input, category tab grid, horizontal-scroll country flag-pill row, sort `Select` + time-range pill group |
| `HolidaysResultsSummary.jsx` | Active-filter chips (`waqt-filter-tag`, removable) + live-region result count + "مسح الكل" |
| `HolidaysEventsGrid.jsx` | `EventCard` grid, in-feed ads every ~6/18 cards, empty state, manual "load more" button (cursor pagination, `PAGE_SIZE=12`, not infinite scroll) |
| `holidays-client-model.js` / `holidays-filter-utils.js` / `search-utils.js` | Static option lists; URL query builder/parser; Arabic-normalizing fuzzy search scorer |
| `data.js` / `actions.js` / `constants.js` | `getInitialEvents` (`'use cache'`, `cacheTag`/`cacheLife('hours')`), `loadEventsPage`/`loadMoreEvents` (country → category → time-range → search → paginate) |
| `src/app/waqt-ui.css` (1037 lines) | Canonical design system: `.waqt-panel`, `.waqt-cat-cell/-grid`, `.waqt-pill`, `.waqt-filter-tag`, `.waqt-badge-*`, `.waqt-select-trigger`, `.waqt-country-cell`, `.waqt-ev*` (card), `.waqt-grid`, `.waqt-empty`, `.waqt-btn*` |
| `src/components/events/EventCard.jsx` | Card: `data-urgency` (`urgent` ≤3d / `soon` ≤14d / `normal`) drives color purely via CSS on the day-count number + a 28×2px accent bar (explicitly not a progress bar); category icon+label pill, country flag, huge LTR day count, Gregorian/Hijri date footer, calendar-method sighting-variance icon |

### Holiday detail page cross-linking (relevant since redesign touches related-content display)
- `RelatedEventsBubbles.jsx` — horizontal scroll strip, `urgencyColor(days)` tinting, "اليوم"/"غداً"/"N أيام" labels
- `RelatedEvents.jsx` — 3-card grid, first card highlighted
- `NextEventCard.jsx` — single site-wide "nearest upcoming event" card
- `HolidayInternalLinks.jsx` — up to 4 contextual links (prayer times, date converter, category calculator, country hub)

### `/fahras` directory page — file map
- `src/app/fahras/page.jsx` — server: FAQ JSON-LD, `Suspense`-wrapped `FahrasContent`, static `DiscoveryFallback` for SEO/no-JS
- `DiscoveryWorkspace.jsx` — server: JSON-LD, `FahraCategoryHub` (6 static category cards), renders `DiscoveryWorkspaceClient`
- `DiscoveryWorkspaceClient.jsx` — client engine: 5 tabs (الكل/أدوات/مقالات/أقسام/الأكثر) on shadcn `Tabs`, accordion sections with sticky `IntersectionObserver` TOC, `⌘K` command palette (`cmdk`) with localStorage history, tooltip-wrapped result cards
- `src/lib/site/discovery.js` — builds `viewModel` (sectionMap, allItems, featuredItems, searchModel, popular searches, related queries)
- `GlobalDiscoverySearch.client.jsx` — header search trigger, same palette pattern

### Reusable primitives already in the codebase (build on these, don't duplicate)
- `src/components/ui/badge.tsx` — variants `default/blue/green/amber/red/solidBlue/solidGreen/solidRed/outline/ghost/link` + `data-dot` pseudo-element for status dots — **use this for any new "live" badge**
- `.badge`/`.chip` system in `src/app/styles/components.css` — global, already used on detail pages
- `EventCard`'s `data-urgency` CSS convention — base for any new urgency/live coloring
- `RelatedEventsBubbles`'s `urgencyColor()`/`daysLabel()` helpers — extract instead of reinventing
- `calc-esb-live-dot` pulsing green dot pattern (`.claude/rules/calculator-ui-standards.md` §5) — the **only** sanctioned true pulsing-live-indicator precedent in the codebase
- `DiscoveryWorkspaceClient`'s tabs+accordion+command-palette stack — a distinct pattern from the holidays inline-filter-panel; redesign must decide whether to converge or keep both

---

## 2. Gaps / weaknesses identified (what's actually wrong today)

1. **No "live now" / happening-today visual signal on the listing grid.** `EventCard` colors the day-count number and a thin accent bar by urgency, but there's no badge, no pulsing dot, no distinct "اليوم!" treatment a user's eye catches while scanning a 12-card grid. `RelatedEventsBubbles` has richer urgency tinting but only lives on detail pages, not the listing.
2. **Filter panel is functional but not delightful.** Category grid + country pill row + sort dropdown + time-range pills are four visually disconnected control types stacked vertically on mobile — no unifying visual language, no indication of *how many results* each filter option would yield before you tap it (no result-count-per-option affordance, which top directory sites use to prevent dead-end filtering).
3. **Search has no autosuggest/typeahead.** It's a plain debounced text input with fuzzy scoring server-side — no inline suggestions, no "did you mean," no recent-search memory (unlike `/fahras`, which already has a full command-palette with localStorage history — an inconsistency between the two surfaces).
4. **Related-content display is fragmented across four separate components** (`RelatedEventsBubbles`, `RelatedEvents`, `NextEventCard`, `HolidayInternalLinks`) with no shared visual identity — a user hitting all four in sequence sees four different card styles for "things related to this."
5. **Breakpoint inconsistency**: holidays grid breaks at 640px/480px; calculators convention (site-wide standard per `.claude/rules/calculator-ui-standards.md`) is 1024px for the 1↔2-column switch. Worth normalizing so `/holidays` doesn't feel like a different product on tablet widths.
6. **No visible count-per-filter or "N events match" preview before committing to a filter combination** — user can filter into an empty state without warning.
7. **`/fahras` and `/holidays` use entirely different filter interaction models** (tabs+palette vs. inline panel+chips) — not necessarily wrong (different content shapes), but the *visual polish gap* between them should be closed: `/fahras`'s command palette is the more modern pattern; `/holidays` should borrow its keyboard-accessible affordance and recent-search memory without abandoning its category/country/date-specific controls (which `/fahras` doesn't need).
8. **Empty state and loading state exist (`EventCardSkeleton`/`EventGridSkeleton`, `.waqt-empty`) but haven't been audited for polish** — need a pass to confirm they feel premium, not default/placeholder-looking.

---

## 3. Design constraints that apply to every change (from `.claude/rules/*`, non-negotiable)

- **No gradient backgrounds, no decorative colored border-stripes** on cards/panels. Carry color via: icon chip (circular, `var(--{color}-subtle)` bg + `var(--{color}-text)` icon), a tinted surface on one hero element only, or an inline semantic badge/pill. Never a border-top/bottom/inline-start/inline-end stripe.
- Logical properties only (`start`/`end`, not `left`/`right`); root is already `dir="rtl"`.
- Numbers: Latin digits only, `ar-XX-u-nu-latn` locale — never bare `ar-XX`.
- No `letter-spacing` on Arabic text.
- No hardcoded hex colors — CSS variables only.
- Ad slots must never precede primary content in DOM order; ads are client-rendered/consent-gated.
- All SEO content (H1, meta, JSON-LD, first-100-words answer, the existing `SearchAction` JSON-LD tied to `?q=`) must stay server-rendered regardless of client filter-UI changes; `getInitialEvents` SSR list must remain intact for crawlers.
- Mobile-first; sidebar/quick-facts stay visible as a horizontal strip on mobile, never hidden.
- `await params`/`await searchParams` before use.

---

## 4. Build list — ALL 5 PHASES SHIPPED 2026-07-15

### Phase 1 — Live status system ✅ shipped
- [x] Shared status helper `src/lib/holidays/urgency.js` (`daysLabel`/`urgencyTier`/`liveStatusLabel`), extracted from `RelatedEventsBubbles`'s previously-duplicated local functions.
- [x] `EventCard.jsx` shows a badge in the header row (اليوم with pulsing dot / قريب جداً / قريباً), reusing `.waqt-badge` colors + the `.calc-esb-live-dot` pulse precedent. New CSS: `.waqt-ev__header-end`, `.waqt-ev__live-badge(--urgent|--soon)`, `.waqt-ev__live-dot` + `@keyframes waqt-live-pulse` in `waqt-ui.css`.
- [x] `NextEventCard.jsx` now imports the same shared `daysLabel()` instead of its own inline day-label logic (previously used "يوم واحد" instead of "غداً" — now consistent, with a small local override so "باقي غداً" doesn't read awkwardly).

### Phase 2 — Filter panel upgrade ✅ shipped
- [x] Facet counts: `getFacetCounts()` in `data.js` (new, cached via `'use cache'`) computes per-category and per-country result counts respecting the OTHER active filters (search + the opposite dimension), deliberately ignoring `timeRange` to stay a cheap synchronous pass with no Hijri-date resolution. Exposed via `loadFacetCounts` server action, fetched on every filter change alongside the existing `loadMoreEvents` call, rendered as a muted `· N` count next to every category-cell and country-pill label. Options whose count would be 0 (given current filters) get dimmed via `.waqt-cat-cell--empty`/`.waqt-pill--empty` — never disabled, still clickable.
- [x] Sticky, more prominent results-summary: `.waqt-results-summary` (`position: sticky; top: calc(var(--app-header-height) + var(--space-2))`), bold accent-colored count number (`.waqt-results-summary__count`). Verified by scrolling to the bottom of a 300+ card grid — stays pinned under the fixed header the whole time.
- [x] Recent-searches quick-access: reused the existing `src/lib/site/discovery-history.js` localStorage helpers (already powering `/fahras`'s command palette) with a holidays-specific key (`miqatona:holidays:recent-searches`). Shows up to 6 recent search terms as clickable chips under the input when it's focused and empty.
- [~] Breakpoint "normalization" to 1024px — **deliberately NOT done**. On inspection the holidays grid already uses a graceful `auto-fit`/`minmax()` responsive grid (not a hard 1-vs-2-column calculator-style breakpoint) that reflows cleanly at every width tested (375/768/1024/1440, zero horizontal overflow at any). Forcing the calculator convention's 1024px cutoff onto this different card-grid pattern would have been a mechanical, unjustified change — likely a regression on tablet widths where ad-sidebar space already narrows the effective grid to 2 columns. Left as-is; verified in Phase 5.
- [~] "Typeahead" — implemented as the recent-searches feature above instead of a live-suggestion dropdown. A live-suggestions list would need a new data-fetching round-trip that duplicates what the existing 180ms-debounced full-grid re-filter already does well; recent-searches (which also serves Phase 4's ask) was judged higher value for the complexity cost.

### Phase 3 — Related-content visual unification ✅ shipped
- [x] New shared CSS system in `waqt-ui.css`: `.waqt-related-card`, `.waqt-related-card--featured` (single-card tint only, never applied to a whole grid), `.waqt-related-grid`, `.waqt-icon-chip` (+ `--green`/`--amber`/`--red` variants, 4-color `:nth-child` rotation) — directly modeled on the already-approved `.date-stat-icon` reference pattern from `calculator-ui-standards.md`.
- [x] `RelatedEvents.jsx`, `NextEventCard.jsx`, `HolidayInternalLinks.jsx` all rewritten to use these shared classes — every card in all three components now carries color via the same circular icon-chip language instead of three different bespoke inline-style treatments. `HolidayInternalLinks.jsx` previously had no icon at all; added a `kind`-based icon map (prayer-times/date-convert/calculator/calendar/hub).
- [x] `RelatedEventsBubbles.jsx` (the horizontal-scroll strip) deliberately kept in its distinct compact pill format — a genuinely different job (quick scan of many events) from the three grid-card components (deeper single-item comparison), not an oversight.

### Phase 4 — `/fahras` alignment ✅ shipped
- [x] Recent-searches polish delivered as part of Phase 2 (shared `discovery-history.js` helper, same pattern `/fahras` already used).
- [x] Audited `/fahras` mobile tap targets and category-card grid — found and fixed a **genuine pre-existing violation** of the site's own anti-AI-template rule: `FahraCategoryHub`'s `.catCard` in `DiscoveryWorkspace.module.css` had `border-top: 3px solid var(--cat-accent)` — exactly the banned "decorative colored border stripe" pattern. Removed it; strengthened `.catIcon` to a proper circular icon-chip (`border-radius: var(--radius-full)`, stronger tint) so the category color still carries visual weight, just correctly (icon chip, not a stripe).
- [x] Confirmed `/fahras`'s 5-tab + accordion + command-palette UX was already solid at all tested widths — no structural changes needed there, only the border-stripe fix above.

### Phase 5 — Cross-device verification ✅ done
- [x] `npm run lint`, `npm run typecheck`, `npm run test:unit` (116/116 pass), `npm run seo:validate`, full `npm run build` (includes `seo:audit:rendered` — passed) — all green on the complete changeset.
- [x] Puppeteer-driven check across `/holidays`, `/holidays/ramadan`, `/fahras` × [375, 768, 1024, 1440]px — 12/12 combinations: `dir="rtl"` correct, zero horizontal overflow, zero console/page errors.
- [x] Visual screenshot verification at each phase (not just the final pass) — facet counts, sticky summary, recent-searches dropdown, icon-chip color rotation, and the fahras border-stripe fix were each screenshotted and inspected before moving to the next phase.
- [x] No SEO regression: `seo:audit:rendered` passed post-build; all pre-existing metadata-length warnings are on calculator pages untouched this round, not holidays/fahras.

---

## 5. Explicitly out of scope for this pass (don't rabbit-hole into these)
- Rebuilding `/fahras`'s command palette from scratch — it's already a solid modern pattern, this pass only polishes/aligns visual language, not architecture.
- Infinite scroll replacing the manual "load more" button — not requested, current cursor-pagination works and manual load-more is a defensible UX choice (avoids layout-shift/ad-density issues); revisit only if the user asks.
- New country/category taxonomy changes — filters work on existing `CATEGORIES`/`COUNTRY_META`, this pass is presentation-layer only.

---

## 6. Progress log
- 2026-07-14: Audit completed (background Explore agent), this doc created, build list drafted. Event-building work stream (Wave 12 Track A/C/E) continues in parallel — see `docs/holiday-event-opportunity-backlog.md`. UX implementation not yet started.
- 2026-07-15 (first session): Phase 1 shipped and browser-verified (desktop + mobile screenshots). Paused due to a transient ~20-minute Bash-tool classifier outage.
- 2026-07-15 (second session, same day): Phases 2, 3, 4, and 5 all shipped in sequence, each verified in-browser before moving to the next. Full changeset confirmed green on `lint`/`typecheck`/`test:unit` (116/116)/`seo:validate`/production `build`/`seo:audit:rendered`, plus a 12-combination cross-device Puppeteer sweep (3 routes × 4 widths) with zero console errors and zero horizontal overflow. **This UX redesign effort is now complete** — see `project-holidays-fahras-ux-redesign` in memory for the durable summary; any further work here (e.g. revisiting the explicitly-skipped breakpoint normalization, or the out-of-scope items in §5) should be treated as a new, separately-scoped follow-up, not a continuation of this plan.

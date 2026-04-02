# Next Updates Roadmap

## Purpose

This document tracks the next improvements to execute after the current launch-ready baseline.
It covers two tracks:

- holiday event content upgrades
- production hardening and SEO upgrades for other pages across the app

Use this file as the main post-launch roadmap for product, content, and technical quality.

## Current Baseline

What is already in place:

- JSON-first holiday architecture
- generated event indexes and aliases
- `countryScope: "all"` expansion for country pages, sitemap entries, and `/holidays` filtering
- published holiday set reduced to validated pages only
- working SEO metadata, robots, and sitemap coverage
- green `ci:check`

What remains is mostly quality expansion, content depth, and cross-page polish.

## Track 1: Holiday Content Expansion

### Priority 1

Upgrade drafted and weak events in `tier2` first.

Main tasks:

- remove hardcoded years from remaining events
- strengthen `answerSummary` for weak pages
- raise FAQ depth to category minimum
- improve `seoMeta.metaDescription`
- improve `relatedSlugs` quality and reciprocity
- review `aboutEvent` sections for stronger direct-answer structure

Target families:

- Islamic `tier2` events
- national `tier2` events
- school and support pages
- seasonal pages

Acceptance criteria:

- no weak published pages
- no missing direct-answer FAQ items
- no weak metadata in promoted events
- no partial country coverage for `countryScope: "all"` events

### Priority 2

Normalize similar event families to reduce content similarity.

Main tasks:

- review `school-start-*`
- review `bac-results-*`
- review `season-*`
- review `vacation-*`

Goal:

- keep shared structure
- avoid near-duplicate copy
- preserve country-specific and audience-specific intent

## Track 2: Holidays UX and Data Consistency

### Priority 1

Finish the architecture cleanup around country-aware data.

Main tasks:

- migrate remaining hand-authored `countryDates` rows to override-only usage
- document country row generation rules in developer docs
- add validator coverage for partial manual country rows
- ensure all overview sections use shared country-date resolver logic

### Priority 2

Improve authoring safeguards.

Main tasks:

- add validator rule for `countryScope: "all"` events missing useful `keywordTemplateSet.country`
- add validator rule for weak `countryOverrides`
- add scaffolding presets by category and scope
- add a canonical example package for a non-Islamic all-country event

## Track 3: Other Pages SEO

Pages to review next:

- `src/app/page.jsx`
- `src/app/map/page.jsx`
- `src/app/time-now/page.jsx`
- `src/app/time-difference/page.jsx`
- `src/app/date/page.tsx`
- `src/app/mwaqit-al-salat/page.jsx`
- `src/app/about/page.jsx`
- `src/app/privacy/page.jsx`
- `src/app/contact/page.jsx`

Main tasks:

- review title and meta-description uniqueness
- verify canonical URLs and Open Graph consistency
- add or refine JSON-LD where useful
- improve internal linking between key tools and holiday pages
- improve H1/H2 structure for crawl clarity
- check SSR visibility for primary content
- review Arabic copy quality and intent alignment

Special focus:

- `map`: location intent, structured copy, and better internal linking
- `time-now`: stronger city/country discovery links
- `time-difference`: improve pair-page clustering and navigation
- `mwaqit-al-salat`: local intent, authority wording, and sitemap/canonical review
- legal pages: ensure clean metadata and trust signals

## Track 4: Sitemap and Indexing Review

### Priority 1

Run a second indexing audit after launch.

Main tasks:

- confirm all intended public pages exist in root sitemap or feature sitemap
- confirm drafted holiday pages stay out of sitemap
- confirm country aliases appear only for published canonical events
- review `lastModified` freshness
- review Search Console coverage and excluded-page reasons

## Track 5: Production Hardening

Main tasks:

- confirm clean `next build` in production environment
- review any long-running or cache-sensitive routes
- verify env setup on hosting
- review analytics, observability, and error logging coverage
- verify social share images and metadata on key public pages

## Suggested Execution Order

### Phase 1

- finish `tier2` holiday cleanup
- review `map`, `time-now`, and `time-difference`
- add validator rules for `countryScope: "all"`

### Phase 2

- normalize similar event families
- improve prayer times and date pages
- run second sitemap/indexing audit

### Phase 3

- expand drafted events back to published in controlled batches
- add stronger content templates and authoring presets
- review long-tail landing page opportunities

## Definition Of Done

This roadmap is complete when:

- all published holiday pages are content-strong and SEO-clean
- all `countryScope: "all"` events behave consistently across page, filter, and sitemap
- core public pages outside `holidays` have production-grade metadata and structure
- Search Console shows healthy indexing without major preventable exclusions

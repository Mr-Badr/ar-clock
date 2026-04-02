# Post-Launch SEO Backlog

## Purpose

This document defines the first content and SEO workstreams to execute after the website is live.
It assumes the current launch goal is:

- technical stability
- correct indexing signals
- valid canonical routing and sitemap behavior
- no `tier1` blockers

The items below are intentionally separated from launch blockers so Google can start indexing the site while content quality continues improving in controlled batches.

## Current Baseline

Based on the latest validation report in `reports/holiday-content-validation.json`:

- checked events: `50`
- events with warnings: `34`
- total warnings: `106`
- `tier1` events with issues: `0`

The remaining work is concentrated in `tier2` and `tier3`.

## Workstream 1: Tier2 Batch Cleanup

### Goal

Reduce the highest-impact SEO warnings across `tier2` events first, because these pages are closer to ranking value than `tier3` pages and should be upgraded before long-tail cleanup.

### Priority

`P0`

### Scope

Clean `tier2` events with the following warning types:

- `faq_below_minimum`
- `seo_meta_description_length_out_of_range`
- `related_not_reciprocal`
- `direct_answer_missing`

### Execution Order

Work in this order:

1. Islamic `tier2` events
2. National `tier2` events
3. School/business/support `tier2` events
4. Seasonal `tier2` pages if any remain

### Acceptance Criteria

- every `tier2` page has category-minimum FAQ count
- every `tier2` FAQ answer starts with a direct answer sentence
- every `tier2` page has a meta description in the accepted length range
- every `tier2` page has reciprocal related links where appropriate
- validation report shows no `tier2` warnings for the four target codes above

## Workstream 2: Autofix for SEO Meta Description Length

### Goal

Automate baseline correction for underlength or overlength descriptions without overwriting strong custom copy.

### Priority

`P0`

### Required Behavior

Create an autofix command that:

- updates only pages whose `seoMeta.metaDescription` is outside the accepted range
- preserves handcrafted copy when already valid
- builds category-aware descriptions from:
  - event name
  - year token
  - countdown intent
  - exact date intent
  - one differentiator phrase

### Rules

- target length: validator-approved range
- no duplicate phrasing across similar event families
- no generic filler such as "تعرف على التفاصيل"
- respect country specificity when the event is country-scoped

### Acceptance Criteria

- all warnings of type `seo_meta_description_length_out_of_range` are removed
- generated descriptions remain readable and natural in Arabic
- no regression in canonical path or metadata structure

## Workstream 3: Autofix for FAQ Minimum Count

### Goal

Automatically raise weak pages to the minimum acceptable FAQ depth while keeping each category semantically correct.

### Priority

`P0`

### Required Behavior

Create an autofix command that:

- appends only missing FAQ items
- uses direct-answer-first formatting
- respects category templates:
  - Islamic
  - national
  - school
  - business
  - support
  - astronomy/seasonal

### Rules

- keep existing strong questions
- avoid duplicates in wording or intent
- include next-year intent where relevant
- include preparation or significance intent where relevant

### Acceptance Criteria

- all warnings of type `faq_below_minimum` are removed
- every generated answer starts with a direct answer sentence
- FAQ sections remain distinct across highly similar event variants

## Workstream 4: Second Pass for Related Links

### Goal

Improve internal linking quality beyond the first reciprocity fixer by using smarter ranking rules.

### Priority

`P1`

### Required Behavior

Create a second-generation related-link pass that prioritizes:

1. same category and same audience
2. same country when applicable
3. nearest event timing
4. canonical pages over generic weak matches

### Rules

- keep related lists between 4 and 6 slugs
- avoid low-signal cross-category links unless they add real user value
- prefer canonical Islamic clusters for shared Hijri intent
- prefer country-local educational/event clusters for school pages

### Acceptance Criteria

- `related_not_reciprocal` warnings are removed or reduced to intentional exceptions
- related blocks feel topically coherent, not mechanically linked
- no page links to weak or irrelevant targets only to satisfy count requirements

## Workstream 5: SEO Copy Normalization for Similar Variants

### Goal

Reduce near-duplicate content across families such as school-start and seasonal pages while preserving reusable structure.

### Priority

`P1`

### Target Families

- `school-start-*`
- `bac-results-*`
- `season-*`
- `vacation-*`

### Required Behavior

Normalize these families by separating:

- reusable structural scaffold
- country- or event-specific facts
- differentiated SEO angles

### Rules

- each variant must keep a unique intro, value proposition, and FAQ nuance
- no two pages in the same family should have materially similar answer blocks or about sections
- country-specific pages must mention the local authority or local education context where relevant

### Acceptance Criteria

- `content_similarity_high` warnings are removed
- similar families still feel consistent in quality and structure
- no family relies on copy-paste with only names swapped

## Suggested Rollout Sequence

### Phase 1

- finish `tier2` cleanup
- ship the two autofix commands
- rerun `validate:holidays`

### Phase 2

- run second related-link pass
- rerun build and validation
- manually review top traffic holiday pages

### Phase 3

- normalize similar content families
- review internal linking distribution
- prepare second indexing review in Search Console

## Operating Rules

- keep JSON packages as the only authored content source
- do not reintroduce content in legacy JS maps
- prefer scripts that are additive and idempotent
- always rerun:
  - `npm run events:build`
  - `npm run validate:holidays`
  - `npm run test:unit`
  - `npm run ci:check`

## Definition of Done

This backlog is complete when:

- `tier2` warnings for baseline SEO quality are cleared
- related links are coherent and reciprocal
- similar event families no longer trigger similarity warnings
- the validation report is reduced to intentional, low-priority editorial warnings only

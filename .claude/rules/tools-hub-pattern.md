# Tools Hub Pattern — Dot-List Standard

Owner directive, 2026-08-01: every `/tools/<category>` hub index page uses the same dot-list
layout. Reference implementation: `src/app/tools/construction/page.jsx`. Do not use the older
`guide-v2-hub-grid` card-grid pattern for any hub index going forward — it's been fully replaced.

## Required structure (in this exact order)

1. `tool-v2-cat-hero` — icon chip + `<h1>` + one-paragraph description + `tool-v2-cat-meta` count.
2. `tool-v2-featured-row` — 2-3 spotlighted items (`tool-v2-featured-tool`), one per major group
   where possible, using the shared bolt-icon SVG (`M13 2 3 14h7l-1 8 10-12h-7l1-8Z`) already used
   in `tool-v2-ft-ic` sitewide — it's a generic "featured" glyph, not category-specific art.
3. `tool-v2-type-groups` — one `tool-v2-type-group` per group, each a `<h2>` + optional
   `tool-v2-type-group-note` + `<ul className="tool-v2-tool-link-list">` of `ToolLink` items
   (`tool-v2-dot` bullet + `tool-v2-link-text`, wrapped in a Radix `Tooltip` showing
   `route.description` on hover — see `@/components/ui/tooltip`).

## Group ordering — hard rule

**Tool/calculator groups always come first. The editorial/guide group always comes last, and is
always labeled "المقالات" — never "الأدلة".** This applies even when a hub has only one guide
group and one tool group (see `/tools/electrical`: "الأدوات والحاسبات" group first, "المقالات"
group last). A hub with zero guide content (e.g. `/tools/construction`) simply omits the group —
don't invent a guides section that doesn't exist.

Rationale (owner's words): "everything inside a category should be lists" — meaning every group,
tools and articles alike, renders as a `tool-v2-tool-link-list`, not a card grid — and articles are
support content for the tools, not the headline of the category, so they sit last.

## What NOT to do

- Don't reintroduce `guide-v2-hub-grid`/`guide-v2-hub-card` on any hub INDEX page. That pattern is
  still fine for other guide-v2 uses (e.g. related-guides blocks inside an individual guide page),
  just not for the top-level category hub.
- Don't label the guide/editorial group "الأدلة" anywhere in a hub index.
- Don't put the editorial group first, even if it currently has more pages than the tools group.

## Applying to existing hubs

`/tools/electrical` was migrated to this pattern 2026-08-01. `/tools/plumbing` still needs the same
migration (it's currently 4 guide-v2 cards, no calculators yet — once it gets its own dot-list
rebuild, keep the guide group as the only group until real calculator-shaped keyword demand is
found for it, per the research-first rule in `docs/PLAN.md`).

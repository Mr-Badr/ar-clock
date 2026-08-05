# v2 Workflow — Keyword-Driven Build Rule

> **ARCHIVED 2026-07-31.** Superseded by `docs/PLAN.md` §5, which formalizes and extends this same
> pipeline (keyword-first, CSV handoff, per-country Keyword Planner runs) for profession/domain Hubs
> instead of migrating old calculators. Read PLAN.md for the current version of this rule.

**Status: STANDING RULE, confirmed by owner 2026-07-30.** This is not a one-time process for the first
category — it is how EVERY category gets rebuilt for v2, from now until the migration is done. Read
`docs/ideas` (the source brainstorm) alongside this if the reasoning behind any step is unclear; this
doc is the operational distillation of it.

## The core principle (from `docs/ideas`, now a hard rule)

> The keyword drives everything, not the tool.

Never start from "what should I build." Always start from "what are people actually typing into
Google." Concretely, that means: **I never write a single line of new v2 content or code for a category
until the owner has handed back real Keyword Planner data for it.** Not a shortcut, not "I'll use my own
judgment this once" — every category goes through every step below, in order.

---

## The pipeline (one category at a time — never batch multiple categories together)

```
Pick ONE category/niche
        ↓
Claude: generate the FULL exhaustive keyword list for that CATEGORY — no building, no code
        ↓
Owner: runs the list through Google Keyword Planner, once per GCC country (not language-only)
        ↓
Owner: uploads the CSV export back
        ↓
Claude: cluster + score + reject — produces winning keyword clusters, NOT tools yet
        ↓
Claude: writes a Tool Spec per winning cluster + runs it through the Search Intent Gate,
        then builds directly in the same pass — no separate sign-off pause (see Step 6)
        ↓
Direct cutover per tool: new /tools page live, old /calculators page deleted, no redirect
        ↓
Measure (GSC/CTR) → feeds the NEXT category's keyword pass
```

Only one category is "in flight" through this pipeline at a time — finishing Gulf finance's whole loop
before starting personal-finance's keyword pass, not running five categories through step 2
simultaneously. This keeps the CSV batches a manageable size for Keyword Planner.

## The research scope is the CATEGORY, not the existing tool list (confirmed 2026-07-30)

**Do not treat this as "find the keywords to rewrite the calculators we already have."** When
researching a category, the job is to surface every genuinely-searched micro-niche that category
should own — whether or not a tool for it already exists in the current 105-calculator catalog — and
build all of them under that category's `/tools` hub. `docs/tools-migration-queue.md` lists what
already exists (useful as a known starting set), but a category's keyword research routinely turns up
real, winnable clusters with no existing page at all — those get built too, as new additions to that
category, not filed away as "Phase 5, later." The goal per category: become the real hub/repo for
everything Gulf users search for in that domain — as many winnable micro-niches as the data supports,
not a fixed 1:1 port of what already exists.

---

## Hard constraint: 10 keywords per batch, max (corrected 2026-07-30)

Google Keyword Planner's "Discover new keywords" / "Get search volume" tools accept a **maximum of 10
seed keywords per query.** Every batch handed over from here forward is ≤10 keywords, delivered one
batch at a time — never a 15-20 item list dumped at once. This changes how Step 1 works in practice:
instead of manually enumerating hundreds of literal phrase permutations myself, each batch of ≤10 should
be a set of **diverse, high-coverage seeds** (different intents: tool, question-form, country, legal/
source, comparison, table/reference) that lets Keyword Planner's own discovery engine do the expansion
— that's literally what the tool is built to do. Manually pre-combining every prefix word from the
standard checklist below into full phrases myself defeats the purpose of handing Planner good seeds.

**Standard prefix/pattern checklist** — run through this list for every entity, but only pull in the
ones that actually fit that entity semantically (note when one doesn't, rather than forcing it in just
to tick the box): كم، كيف، حاسبة، حساب، تحويل، جدول، قياس، مقارنة، تكلفة، مدة، عدد، كم يحتاج، كم يكلف،
كم يستهلك. (تحويل/قياس/كم يستهلك fit unit-conversion or consumption topics like AC/electricity far
better than a payout-calculation entity like end-of-service — don't force them in.)

## Step 1 (Claude) — Generate the full keyword list for ONE category

Requirements, straight from `docs/ideas`' own "keyword generation prompt" — apply ALL of these, not a
subset:

- Arabic only.
- Saudi Arabia first, then UAE, Kuwait, Qatar, Bahrain, Oman.
- Cover every search intent: informational, commercial, transactional, comparison, problem-based.
- Cover short-tail, medium-tail, AND long-tail for every seed — not just the short version.
- Cover question forms: كيف، كم، لماذا، هل، متى، ما هو، كيف أعرف.
- Include Gulf dialect variants, not just MSA: وش / كم يطلع / كم يكلفني / شلون (Saudi), شلون / جم / جم
  يكلف (Kuwait), شو / شو أفضل (UAE).
- Include plural and singular forms, common misspellings, and alternative phrasing/synonyms.
- **Think in entities + intents, not flat keywords** — per `docs/ideas`' explicit reframe: pick the
  entity (e.g. مكيف، راتب، معدل) and generate the full spread of intents around it (كم يستهلك، كم يكلف
  تشغيل، أفضل، مقارنة، جدول، كم يحتاج...) rather than one keyword per idea. A single entity should
  produce a small cluster of 6-10 distinct intent-pages, all destined to interlink.
- Output as a clean, CSV-ready table/list — nothing else. **Do not propose tools, specs, or code at this
  step.** That discipline is the entire point of the rule: no idea gets a head start just because it
  sounds good to me before the data exists.

## Step 2 (Owner) — Keyword Planner, per country

- Location targeting, not language-only targeting — Arabic-language-only blends all 6 dialects together
  and hides real per-country volume (confirmed in the senior-SEO research pass, `docs/
  keyword-research-seed-list.md`'s "Advanced discovery methods" section).
- Also worth doing while there anyway (optional but cheap): the free techniques from that same section —
  autocomplete alphabet-soup, AlsoAsked's 3 free PAA pulls/day, a GSC export for any page already live in
  that category. These strengthen the CSV before it comes back, but are not a blocker — Keyword Planner
  data alone is enough to proceed.

## Step 3 (Owner → Claude) — Upload the CSV

One CSV per category (combined across countries with a country column, or one file per country — either
works). This is the hard gate: nothing in step 4 starts without it.

## Step 4 (Claude) — Analyze, cluster, score, reject

From the CSV:
1. Cluster keywords by real intent (not just by shared words — "كم يستهلك مكيف" and "أفضل مكيف" are
   different intents even though both mention مكيف).
2. Detect and merge duplicate-intent keywords.
3. Compute an Opportunity Score per cluster: `search volume × commercial intent × interactive potential
   × internal-linking fit × evergreen-ness × AI-resistance ÷ competition`.
   - **AI-resistance** matters and is easy to skip: reject/deprioritize clusters an AI answer engine can
     already fully resolve in one sentence ("what is VAT") in favor of clusters that need genuine
     interaction to answer ("VAT simulator for my specific invoice").
4. Reject clusters that:
   - Show no real search volume.
   - Can't become an interactive tool (pure definitional content — that belongs on `/blog`, not here).
   - Are dominated by government sites for that exact query.
   - Are dominated by large existing brands with no realistic path to outrank.
   - Require constantly-changing official data we can't commit to maintaining (a rate/threshold that
     changes yearly with no update owner).
5. Rejected clusters go to a backlog note in the category's section of this doc (or the growth roadmap),
   not silently discarded — a cluster that fails today may pass in a future country/season pass.

## Step 5 (Claude) — Tool Spec per winning cluster (still not code)

For every surviving cluster, produce:

| Field | What goes here |
|---|---|
| Hub/category | Which `/tools/<category>` this belongs to |
| Tool | The specific tool name |
| URL | `/tools/<category>/<slug>` |
| Arabic H1 | The direct-address answer-first heading (per `.claude/rules/event-creation-lessons.md`'s "write TO the reader" rule — applies here too) |
| Meta title / description | SEO-ready, within the length gates already enforced elsewhere in this codebase |
| Search intent | informational / transactional / comparison / etc. |
| Tool type | calculator / generator / converter / comparison / checklist (per the mockup's archetypes) |
| Inputs / outputs | What the interactive tool actually takes and returns |
| FAQ ideas | 6-8 minimum, matching the keyword phrases literally (see the `{{year}}`-normalization trap already documented for holiday content — the same trap applies to tool FAQ copy) |
| Internal links | 5-10 closely related keywords/tools this should link to |
| Old URL to redirect | The existing `/calculators/...` URL this replaces, if any (301 target) |

Then run every spec through the **Search Intent Gate** before it's allowed to proceed — all 10 must be
true, or it goes to backlog instead of being built:

- [ ] Real search demand confirmed in the Keyword Planner CSV
- [ ] Targeted to one or more GCC countries specifically
- [ ] Arabic-first
- [ ] Solves one specific, nameable user task
- [ ] Can be built genuinely better than what currently ranks for it
- [ ] Fits into an existing (or clearly justified new) `/tools` category
- [ ] Has 5-10 closely related keywords available for internal linking
- [ ] Can reuse the existing v2 component library (mockup) — not a one-off UI
- [ ] Evergreen, or has an explicit content-update owner/strategy if not
- [ ] Produces a genuinely interactive result — not a page that just restates the keyword in prose

## Step 6 — Build directly after analysis (no separate sign-off pause — confirmed 2026-07-30)

The owner's confirmed working method: hand over keyword batches → owner runs them through Planner →
owner uploads the CSV → Claude analyzes, clusters, scores, writes specs → **Claude proceeds straight to
building in the same pass**, no separate approval checkpoint in between. The CSV upload itself is the
approval gate — once real data is in hand, build. (Exception: a spec that fails the Search Intent Gate,
or one that needs a real fact/source verified first — e.g. a legal or medical claim — still gets flagged
and held rather than built on a guess. That's a content-accuracy hold, not a strategy sign-off.)

## Step 7 (Claude) — Build: direct cutover, NO redirects (corrected 2026-07-30)

Real `/tools/<category>/<slug>` page, full v2 design system (not the old `.calc-esb-*` look),
migrated calculation logic (kept and improved, per the owner's standing instruction — never
stripped). **The visual bar is Omni Calculator, not the original boxed mockup** — see
`docs/tools-platform-v2-plan.md` §10a for the binding specifics (smaller type scale everywhere,
whitespace instead of boxes around plain prose, plain-surface result panel, one cohesive FAQ module,
one reference card for related tools instead of a grid of boxed cards), §10b for the layout-structure
round (even section spacing via flex/grid gap, title/lead/TOC sharing column 1's grid cell instead of
spanning above both lanes — watch the mobile-ordering trap documented there, plain inline-text
resource links instead of card+button rows, a livelier sidebar related-tools card with one featured
item, column 1 deliberately narrower than the tool column), and §10c for content-distinctness +
embed-code-quality rules (sidebar vs. end-of-article related-tools lists must show DIFFERENT tools,
multi-line embed snippet formatting). **§11 (Ads System v2) is now IMPLEMENTED, not deferred** — every
`/tools` page needs `ToolTopAdSlot`, two `ToolInArticleAd` instances (mid-article + mobile-only, fixed
mobile order tool→ad→title→content via CSS Grid `order`), and `CalculatorAdLayout sidebarMode="dual"`
for real ad rails on both sides — read §11 in full before building a new tool page, it also documents
two real pre-existing bugs (shared ad-rail breakpoint gap, fixed-px inner column width) found and
fixed while wiring this up. §10a/§10b/§10c supersede §10 wherever they disagree; read all of §10a
through §11 before building the next tool.

**No 301 redirects.** Owner's explicit call: the existing `/calculators` pages already get ~0
organic impressions, so there's no real SEO equity a redirect would be protecting — a straight
cutover is simpler and just as safe here. For every tool migrated:
1. Build the new `/tools/<category>/<slug>` page.
2. Update that tool's `href` field directly in `CALCULATOR_ROUTES` (`src/lib/calculators/data.js`) to
   the new path — this is the single source of truth every other page links through.
3. **Grep the whole `src/` tree for the literal old path string** (not just the data-driven
   references) before deleting anything — this codebase has real hardcoded links scattered outside
   `data.js` (nav, homepage sections, sibling calculators' "related tool" links, holiday
   internal-links maps, the embed-page config, SEO route manifests, discovery/sitemap link lists).
   The first migration (end-of-service-benefits) turned up 16 separate files with a hardcoded literal
   URL — missing even one leaves a real dead link live on the site. Fix every one before deleting.
4. Delete the old `/calculators/<slug>/page.jsx` (and its folder) entirely — old path returns a plain
   404, not a redirect. This is intentional, not an oversight.
5. Verify: old URL 404s, new URL 200s, every page that used to link to the old tool now links to the
   new one (check via the grep, then confirm live), calculator logic still genuinely computes
   (re-test an actual input change), zero console errors.

### Step 7 is a FULL redesign, not a reskin (hard rule, confirmed 2026-07-30)

The owner's exact words, after the first migration (`end-of-service-benefits`) initially only
restyled the page shell while leaving the calculator's own inputs/results and all article content
(tabs, tables, FAQ, info-cards) on old markup: *"this is a rule, every calculator we should redesign
it from scratch, redesign the content, redesign the calculator... we do not want old design, just
the new one, this is full recreate and redesign do not keep any old design and old components use
just the components and rules of v2."* This is not optional polish — it is the actual deliverable.
Concretely, for every tool migrated:

- The interactive calculator's own JSX (inputs, radios, result panel, action buttons) must be
  rewritten with `.tool-v2-*` classes only — not just the page wrapper around it.
- Every article content block on the page (tabs, comparison tables, info-grids, FAQ, sources,
  related-tools) must be rebuilt with `.tool-v2-*` markup — not old shadcn-styled-via-old-classes
  components (`CalculatorInfoGrid`, `CalculatorFaqSection`, `CalculatorSources`, `Table`/`TableRow`
  from shadcn used with old classNames, etc.).
- Calculation LOGIC is preserved and never simplified — same standing rule as always, this is purely
  a UI/content rebuild, not a functional rewrite.
- **Verification is not "it looks right at a glance."** Confirm with real browser automation before
  calling a tool done:
  - `main.querySelectorAll('[class*="calc-"]')` (scoped to `<main>`, not the whole document — the
    site header's own mega-menu legitimately uses unrelated `nav-calc-*` classes) returns zero
    matches.
  - Exercise every interactive control end-to-end (clear/reset/reload buttons, tab switches, FAQ
    disclosures) via `page.evaluate()` + text-content matching, not fragile position-based
    `nth-child` clicks — a control that gets removed/re-rendered between clicks will hang a
    position-based click chain. This is exactly how the `end-of-service-benefits` rebuild caught a
    real bug: the action row was originally rendered inside the `result.isValid` conditional, so
    clicking مسح (clear) also hid إعادة تحميل (reload), leaving no way back into the tool.
  - **Check `document.documentElement.scrollWidth === document.documentElement.clientWidth` at a
    narrow mobile viewport (390px).** A shadcn primitive can ship a Tailwind utility that silently
    breaks a v2 container's width constraint — e.g. `TabsList`'s built-in `w-fit` let the 4-tab strip
    grow to its full unwrapped content width (464px) inside a 350px column, blowing out the entire
    page's scroll width even though `.tool-v2-tabs-list` already had `overflow-x: auto`. The fix is
    forcing `width: 100%; max-width: 100%` on the wrapping `.tool-v2-*` class so the auto-overflow has
    a bounded box to scroll within. When auditing a suspicious element for this, don't trust a flat
    `getBoundingClientRect()` scan alone — an element genuinely inside a working horizontal-scroll
    container (e.g. the embed-snippet's `<code>` block) will also report a rect wider than the
    viewport and is a false positive; confirm the real culprit by toggling `display: none` on
    candidates one at a time and watching which one drops `document.documentElement.scrollWidth`
    back down.
- After shipping the new page, remove any remaining reachable path to the old design — delete the
  old page (Step 7 above already covers this) and remove/update any nav or menu entry that still
  pointed at it. No old-design page should stay reachable from anywhere on the site.

## Step 8 (ongoing) — Measure and feed forward

GSC queries, CTR, and position for the newly-shipped category feed directly into the NEXT category's
keyword pass — real performance data is also "keyword data," not just the Planner export.

---

## What this replaces

The keyword seed list already written (`docs/keyword-research-seed-list.md`) covered every existing
category in one combined pass — useful as raw reference material, but it doesn't reflect this rule's
actual discipline of "one category fully through the pipeline before starting the next." Treat that
document as a pre-computed starting point per category (skip re-deriving the seed list from scratch when
a category's section already exists there), but the CSV-gate discipline above governs from here forward,
not the "hand over everything at once" pattern that doc was written in.

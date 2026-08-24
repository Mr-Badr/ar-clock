> **ARCHIVED 2026-08-23.** The v2 migration this plan describes is complete: `/tools` is the live
> architecture (24 categories, 169 tool pages, verified in perfect sync with
> `src/lib/seo/calculator-route-manifest.js`), `/calculators` is fully retired (redirects live in
> `next.config.js`), and the hand-maintained mega-menu this doc's progress log flags as unfinished
> was itself removed 2026-08-09. Durable rules extracted into `.claude/rules/tools-hub-pattern.md`
> and `.claude/rules/calculator-ui-standards.md`. Kept for history only; do not resume from here —
> `docs/PLAN.md` is the current living build-methodology reference.

# Tools Platform v2 — Full Strategic Plan

Status: **IN PROGRESS — Phase 1 started 2026-07-30.** Written 2026-07-29 from `docs/ideas` (the owner's
Claude conversation transcript) + a full codebase audit of the current calculator system. See "Progress
log" (bottom of file) for what has actually shipped vs. what's still planned.

**Owner confirmation (2026-07-30):** the real 105 calculators currently get ~0 visitors because they
target generic, high-competition keywords, not micro-niches. Confirmed sequencing: (1) categorize the
existing catalog first — no URL changes, additive only [in progress], (2) THEN go tool-by-tool through
real Google Keyword Planner research to find the actual low-competition micro-niche angle each
calculator should own, rewriting its title/meta description/on-page content around that keyword — not
inventing new tools, rewriting existing ones. Functionality is kept and improved, never stripped, per
the original north star below. This whole initiative is "v2" — a full update, not incremental. The v2
visual/component system is no longer speculative — see "§10 Mockup — validated v2 design system" below.

**This is v2 of the product, not an incremental improvement pass.** Owner directive (2026-07-29): don't
treat the current design system (`DESIGN.md`, `calc-esb-*` visual patterns, current ad placement rules)
as a constraint — those get reimagined based on `docs/ideas` + fresh competitor research. What's kept
unchanged is the underlying **data and calculation logic** (the 105 calculators' formulas/content in
`lib/calculators/*.js`, `data.js`, `finance-page-content.js`) — every existing tool survives, just
rebuilt with a new visual product on top. Ad placement/strategy is explicitly in scope for redesign too,
not just "fit ads into the new grid." Initial rollout — both redesigned pages and any new tools — is
prioritized for the **Saudi + Gulf market first**, to get real performance data before wider expansion.

## 0. What this replaces

`docs/ideas` is a long brainstorm (Arabic + English) about turning miqatona's calculator section into
a keyword-driven, Omni-Calculator-inspired "interactive tools platform." This doc translates that
brainstorm into a concrete plan against the ACTUAL current codebase — what already exists, what's
half-built, what's genuinely missing — so we don't rebuild things that already work. It also treats
`DESIGN.md` and the current calculator visual system as **prior art to learn from, not a spec to stay
inside** — v2 is free to introduce new tokens, new components, and a new page language where research
supports it.

**Core instruction from the owner (verbatim, kept as the north star):** keep every existing calculator;
add a new "Tools" entry point where the user sees category cards first, clicks a category, and sees all
tools under it; redesign the individual tool page as two columns on desktop (RTL: text/explanation on
the right, calculator on the left, ad banner on top), collapsing to tool-first-then-text on tablet/mobile
with no sidebar ads; get inspired by Omni Calculator's visual system but adapt it to Arabic RTL and this
site's design language (`DESIGN.md`).

---

## 1. Current state — audit findings (2026-07-29)

### 1.1 Data layer — mostly solid, but drifted

- **`src/lib/calculators/data.js`** is the real source of truth: `CALCULATOR_ROUTES` (105 calculators,
  uniform shape: `slug/href/cluster/shortLabel/title/heroTitle/description/accent/accentSoft/badge/keywords[]`)
  and `CALCULATOR_HUBS` (7 hubs: `finance` 66, `age` 11, `sleep` 7, `health` 7, `education` 5,
  `building` 5, `personal-finance` 4).
- **Nav is out of sync**: `CALC_CATEGORIES` in `NavLinks.tsx` only lists 62 of 105 tools — **43
  calculators (41%) are live, sitemapped, and indexed but unreachable from the header nav.**
- **`health` and `education` have no real hub page** — their `CALCULATOR_HUBS.href` just points at one
  member calculator's own page.
- **`finance` (66 tools) is one giant undifferentiated bucket** — no sub-grouping, unlike Omni's tighter
  categories (~30-160 tools but always sub-sectioned by type, e.g. "Construction converters / materials
  / home & garden").
- **Duplicate parallel data sources**: `personal-finance-data.js` and `lib/sleep/content.js`
  re-author metadata that already exists for the same slugs in `data.js` — a maintenance trap.
- `header.jsx` still carries a dead flat 11-item sublinks array for `/calculators` (superseded, never
  deleted).

### 1.2 Category/hub pages — the top-level hub is closer than expected; sub-hubs are the real gap

- **`/calculators` (top-level hub, `page.jsx`, "calc-hub-v8")** already renders category-grouped cards
  for all 7 hubs, each expanding to its full tool list — this is structurally very close to the Omni
  homepage screenshot already. It needs completeness fixes (43 orphaned tools, per-hub card copy) more
  than a rebuild.
- **Sub-hub (category) pages have 3 divergent, none reusable**:
  - `finance/page.jsx` hand-picks 4 of its 66 tools via a capped launcher component (`.slice(0, 8)` max)
    — the rest only exist in an invisible JSON-LD list.
  - `personal-finance`/`sleep` run off separate data files into one dynamic `[tool]/page.jsx`.
  - `health`/`education` don't have a folder at all.
  - A generic `CalculatorHubGrid` component exists in `common.jsx` but is unused by any page.
- **Conclusion**: there is no single "category page" template to reuse — one needs to be built, closer
  to the Omni Construction-category screenshot (hero + short description + sub-sectioned link lists by
  tool type, not giant cards).

### 1.3 Individual tool page — the real gap vs. what's being asked for

- Every tool page already has a two-column split, but it's the **wrong** one: `.calc-esb-layout` splits
  the calculator's own **inputs vs. live result** (420px form | flex result, ≥1024px), entirely inside
  the hero. All explanatory content (decision tables, FAQ, sources, related tools) is separate, stacked
  full-width **below** the hero — never beside it.
- There is **no existing "article column runs alongside the tool" layout anywhere in the codebase.**
  This is the single biggest gap between current state and the requested redesign.
- `calculators.css` is 14,051 lines with old (`calc-app-grid`, `calc-results-panel` × 5 redefinitions)
  and new (`calc-esb-*`) systems layered via specificity rather than the old one being removed.
- `DESIGN.md` already has rules that agree with the requested direction: §5.5 (two columns only when
  they do different jobs — text vs. tool qualifies), §22.2 tool blueprint ("calculator never below
  generic content," "ads never inside the calculator/result panel").
- Ads today: `AdLayoutWrapper` only shows a single sticky right rail at ≥1440px — a *third*,
  independent mechanism that will compete for the same screen real estate as a new right-side text
  column and needs a decision (see §5).

### 1.4 SEO/keyword tooling — good news: most of the infrastructure the ideas-doc asks for already exists

- **`scripts/research/`** (`keyword-suggest.ts`, `serp-research.ts`, `competitor-reader.ts`,
  `topic-research.ts`) is fully generic — Arabic autosuggest across 12 MENA countries, SERP/PAA
  scraping, competitor content extraction, all chained by `npm run research:topic -- --seed "..."
  --countries sa,ae,kw`. It works unchanged for calculator keyword research today.
- **The holiday content pipeline is the exact blueprint the ideas-doc is asking us to invent** —
  3-file JSON authoring (`package.json`/`research.json`/`qa.json`) → `events:build` → a real validator
  with ~25 gated checks (keyword-integration minimums, research-coverage minimums, FAQ minimums,
  hardcoded-year detection, etc.) → `events:sync`. Nothing calculator-shaped like this exists yet —
  calculators are hand-written JS objects with no schema, scaffold script, or validator.
- **`docs/holiday-event-opportunity-backlog.md` already contains a "CALCULATORS & COMPETITIVE FEATURES
  BACKLOG" section** (added 2026-07-17) with standing rules, a `khaleejcalculators.com` competitive
  dossier, and a ranked candidate table — the "research before building" discipline the ideas-doc wants
  is already the house standard here, just not yet formalized into a schema+validator.

---

## 2. Decisions needed before implementation

These are genuine forks — each has real, largely irreversible SEO/traffic consequences at this site's
scale (105 indexed calculator pages, live AdSense revenue). Flagging before writing code.

1. **URL structure — DECIDED 2026-07-30, supersedes the recommendation below.** Owner confirmed twice:
   every calculator moves under `/tools/<category>/<tool>`, the mockup's IA becomes the real IA, and
   the old `/calculators` design is retired — not left running in parallel forever. This is a full v2
   relaunch, not an incremental pass. **Non-negotiable safety mechanic regardless of that decision**:
   "retired" means every old `/calculators/...` URL gets a permanent 301 to its new `/tools/...` home
   the moment that tool's new page ships — never delete-then-rebuild, never let an old indexed URL
   404. Migrate category-by-category (start with Gulf finance, highest RPM) so each old URL redirects
   the same day its replacement goes live, not in one big-bang cutover at the end. Original
   recommendation, kept for context on why this was a real tradeoff: keeping `/calculators` as the
   canonical root would have avoided 105+ redirects and any re-crawl volatility. The owner's call is
   that since content/design are being fully rewritten anyway, bundling the URL move into the same
   migration avoids doing the redirect work twice — a reasonable trade, but it does mean the redirect
   step is mandatory, not optional, for every single page as it migrates.
2. **Rollout scope for the new tool-page layout**: pilot on a handful of flagship calculators first
   (recommended), then roll out cluster-by-cluster. Given the Saudi/Gulf-first directive, **the pilot
   set should specifically be Saudi/Gulf finance calculators** (highest existing RPM, and the market
   we're prioritizing for data), not an arbitrary sample.
3. **Keyword-pipeline automation**: build the full scaffold/schema/validator system now (parallel
   track), or ship the new design/IA work first and add pipeline automation once there's a template
   worth automating into? Recommendation: new page template + IA first (it's what all 105 existing pages
   need immediately, and it's the thing new tools will also be built on), pipeline automation second.
4. **Finance cluster split**: split the 66-tool `finance` hub into tighter sub-categories (e.g. Gulf
   government/salary, loans & mortgages, insurance, business/VAT) to match Omni's tighter-grouping
   pattern? Recommendation: yes — a 66-item single bucket undermines the whole "category feels
   specialized" goal, and Gulf-market focus makes this split higher-value, not lower.
5. **Ads v2 scope**: redesign ad placement/strategy is explicitly in scope now, not just adapting
   current slots to a new grid. Needs owner input on how far to go — e.g. new unit types/formats,
   revisiting the sidebar-rail-at-1440px approach entirely, testing placements the current AdSense
   readiness rules haven't tried — vs. keeping today's AdSense unit inventory but re-placing it inside
   the new layout. See Phase "Ads System v2" below.

*(Will confirm these with the owner via a short question round before starting Phase 1 code.)*

---

## 3. Vision — what "done" looks like

```
/calculators (kept as URL root, "الأدوات" branding)
  → Category directory: cards (icon, name, tool count, 2-3 featured tools) — like Omni's homepage
  → Category page: hero + short description, tools sub-grouped by type
    (حاسبات / مولدات / محولات / قوائم فحص) as clean compact link lists — like Omni's Construction page
    → Tool page: AdTopBanner (desktop only, full width) →
        RTL two columns ≥1024px: [right: article/explanation column, scrolling] [left: sticky calculator]
        <1024px: single column, tool first, then explanation stacked, no sidebar ads
```

Every existing calculator is kept, re-skinned into this template, and re-grouped into a cleaner
taxonomy. New tools get added through a keyword-validated pipeline modeled on the holiday content
system, reusing `scripts/research/` as-is.

---

## 4. Phase 1 — Taxonomy consolidation (data layer)

Goal: one source of truth, zero orphaned calculators, tighter categories.

- Make `data.js` (`CALCULATOR_ROUTES` + `CALCULATOR_HUBS`) the single canonical source. Fold
  `personal-finance-data.js` and `lib/sleep/content.js` content back into it — delete the duplicates.
- Regenerate `NavLinks.tsx`'s `CALC_CATEGORIES` **from** `CALCULATOR_HUBS`/`CALCULATOR_ROUTES`
  (derived, not hand-maintained) so the 43-tool nav gap structurally can't recur. Remove the dead flat
  sublinks array in `header.jsx`.
- Split `finance` (66) into narrower sub-categories (see §2.4). Give `health` and `education` real hub
  folders instead of pointing at a member tool's page.
- Add each calculator's "type" (calculator / generator / converter / checklist / comparison) as a new
  field on `CALCULATOR_ROUTES` entries — needed for the category-page type-grouping in Phase 3, and for
  future tool-type-diverse pages (generators/checklists) per the ideas-doc's tool-type taxonomy.

## 5. Phase 2 — New tool-page template (the core visual redesign, v2 design language)

Goal: build the actual thing that's missing — a page-level layout primitive with a real article column
beside a sticky calculator, replacing "everything stacked full-width." **This is where the "new
product" directive matters most: the visual language (cards, result panels, typography rhythm,
micro-interactions, color system) is being designed fresh from `docs/ideas` + competitor research
(Omni, Calculator.net, NerdWallet-style sticky-calculator sites), not ported from the current
`calc-esb-*` aesthetic.** `DESIGN.md` is read as prior art, not a spec to stay inside — expect it to be
substantially rewritten or replaced once the new page language is validated, not treated as a gate.

- New layout primitive (name TBD, e.g. `ToolPageShell`):
  - Desktop ≥1024px: `AdTopBanner` full-width → CSS grid, RTL two columns — **right column** = article
    content (intro/explanation/examples/FAQ/related, i.e. what's currently the stacked
    `CalculatorSection`s), **left column** = calculator widget, `position: sticky` under the navbar.
  - <1024px: single column, calculator first (inputs+result), explanation sections below, no sidebar
    ad rail.
  - Resolve the ad-rail conflict from §1.3 as part of Ads System v2 (§7a) — the current ≥1440px sticky
    sidebar rail and the new right-side article column can't both own that space; decide together with
    the ads redesign, not as an afterthought.
  - The calculator widget itself (inputs vs. live result) is redesigned as part of the same v2 pass —
    not a forced reuse of `.calc-esb-layout`, though its proven mechanics (sticky positioning, mobile
    stacking) are reasonable inputs to the new design.
- New component library + new scoped stylesheet for the v2 shell, replacing (not layering onto) the
  already-duplicated 14k-line `calculators.css` as pages migrate — old pattern retired page-by-page, not
  kept running in parallel forever.
- Keep every existing SEO field, JSON-LD block, and metadata untouched — content/data layer is stable;
  only the presentation layer is new.
- **Pilot set: Saudi + Gulf finance calculators specifically** (e.g. salary/EOS/GOSI-style tools,
  zakat, VAT — highest existing RPM and the priority market for gathering v2 performance data), verified
  with Puppeteer screenshots at 375/768/1024/1440px before wider rollout (per house rule: verify UI in a
  real browser, not just lint/typecheck).

## 6. Phase 3 — Category (hub) page template

Goal: one reusable template replacing the 3 divergent sub-hub implementations, modeled on the Omni
Construction-category screenshot: hero, short description with "Read more," tools sub-grouped by type
as compact 2-column link lists (not big cards), featured/popular row at top.

- Build a real `CategoryHubPage` component consuming `CALCULATOR_HUBS` + the new per-tool `type` field
  from Phase 1 — replaces `finance/page.jsx`'s hardcoded 4-tool picker, the `personal-finance`/`sleep`
  duplicate-data pattern, and gives `health`/`education` their first real hub page.
- Top-level `/calculators` directory page: fix completeness (surface all 105, not 62), keep the
  existing card-grid structure since it already matches the Omni homepage pattern reasonably well —
  this is a completeness/polish pass, not a rebuild.

## 7a. Phase — Ads System v2 (runs alongside Phase 2, not deferred)

Goal: redesign ad placement/strategy for the new layout, not just relocate today's slots into the new
grid. In scope, pending the owner's answer to decision §2.5:

- Re-evaluate the ≥1440px single-sidebar-rail approach (`AdLayoutWrapper`) now that the tool page has a
  genuine right-side content column — does a sidebar rail still make sense at very wide breakpoints
  (e.g. ≥1800px, beside the two-column layout), or does the new layout replace its function?
- Re-derive where `AdTopBanner`/`AdInArticle`/`AdMultiplex`-equivalents sit inside the new two-column
  shell — the current rule set (top banner before H1, in-article after FAQ, multiplex at end) was tuned
  for a single stacked column; a sticky left calculator + scrolling right article changes what "between
  sections" even means.
- Audit current per-unit RPM/format performance (memory already has 2026-07 format data: Auto anchor >
  manual display) as an input to which formats get kept vs. replaced in v2.
- Keep Google Ads/AdSense policy constraints (no ads inside the calculator/result panel, no ads
  adjacent to submit controls, viewable-inventory requirements) as hard constraints regardless of new
  placement ideas — these are platform policy, not house style, so they don't get relaxed by the "new
  design system" directive.
- Saudi/Gulf-first applies here too: prioritize verifying ad performance on the Gulf finance pilot pages
  before rolling the new ad strategy out site-wide.

## 7. Phase 4 — Keyword-driven pipeline: rewrite existing calculators AND build new ones

**The exact step-by-step process for this phase is now a standing rule — see
`docs/v2-keyword-driven-workflow.md`. Read that doc, not just this summary, before starting any
category.** One-line version: pick one category → Claude generates its full exhaustive keyword list
(no building) → owner runs it through Keyword Planner per GCC country → owner uploads the CSV → Claude
clusters/scores/rejects → Claude writes a Tool Spec per winning cluster and gates it through the 10-point
Search Intent Gate → owner signs off → only then does Claude build, in the v2 design system, with a 301
from the old URL. This governs every category, one at a time, not a batch of categories at once.

**Scope confirmed/expanded by owner 2026-07-30**: this phase is not just about new tools. The 105
existing calculators get ~0 traffic because they were built around generic, high-competition keywords
(e.g. "حاسبة القسط الشهري") instead of the specific, low-competition micro-niche phrases people actually
search. The fix is the same pipeline the ideas-doc describes, applied backwards onto the existing
catalog:

1. **Per calculator (or per tight cluster of related calculators)**: run real keyword research —
   Google Keyword Planner CSV export (owner-supplied, this isn't API-automatable) → `scripts/research/`
   tooling → cluster → find the actual winnable micro-niche angle this specific tool should own (e.g.
   not "قسط شهري" broadly, but the exact long-tail variant with real volume and low competition).
2. **Rewrite, don't rebuild the math**: title, meta description, on-page copy, H1, FAQ all get rewritten
   around the validated keyword. The calculation logic/formula is kept and improved (more accurate,
   more inputs where it adds real value) — never stripped or replaced with something shallower.
3. **Re-skin with the v2 design system**: every rewritten calculator also gets migrated onto the new
   component library validated in the mockup (§10) — this is the same visual work Phase 2 already
   describes, just now explicitly bundled with the content rewrite pass rather than a separate step.
4. Sequenced **after** Phase 1 (categorization, in progress) — the owner's own ordering: organize first,
   then go tool-by-tool on real research, not the reverse.

Goal (unchanged from original draft below): clone the holiday pipeline's discipline for calculators —
also matters for the ideas-doc's "micro-niche professions" growth strategy (electrician toolkit,
cleaning-company toolkit, etc.) once the platform foundation is solid.

- New Zod schema (parallel to `src/lib/events/package-schema.js` + `event-content/schema.js`) for a
  calculator "tool spec": inputs, outputs/formula metadata, `type`, category, SEO fields, FAQ, sources —
  reusing the loose/passthrough pattern already proven for holidays.
- New scripts mirroring the holiday ones: `calculators:new` (scaffold), `validate:calculators`
  (coverage/keyword-integration gates, same debugging-script pattern documented in
  `.claude/rules/event-creation-lessons.md`), `calculators:sync`.
- Reuse `scripts/research/topic-research.ts` unchanged for keyword/competitor research — only its
  hardcoded "copy into holiday research.json" next-steps message needs generalizing to point at the new
  calculator research file path.
- Formalize the Google Ads Keyword Planner CSV → cluster → Opportunity Score step (formula from the
  ideas-doc: volume × commercial intent × interactivity potential × internal-linking fit × evergreen ×
  AI-resistance ÷ competition) as a script that appends ranked candidates into the existing "CALCULATORS
  & COMPETITIVE FEATURES BACKLOG" section of `docs/holiday-event-opportunity-backlog.md` (or a split-out
  dedicated doc if that file gets too large) — not a new doc from scratch, since the backlog structure
  and standing rules already exist there.
- Apply the ideas-doc's "Search Intent Gate" (10 checkboxes: real demand, GCC-targeted, Arabic-first,
  solves a specific task, beats current SERP, fits an existing hub, ≥5-10 related keywords, reuses
  existing UI components, evergreen, produces an interactive result) as the formal bar before any new
  tool enters the build queue — consistent with the standing rules already in the backlog doc.

## 8. Phase 5 — Micro-niche category expansion

**Merged into Phase 4's per-category research, not a separate later phase (confirmed 2026-07-30).**
When a category's keyword research turns up a genuine, winnable micro-niche with no existing page —
whether that's a brand-new sub-topic inside gulf-finance or a wholly new profession-toolkit category
(electrician, cleaning company, construction contractor, restaurant owner, real estate, e-commerce
seller, freelancer, per the ideas-doc) — it gets built in the SAME pass as the existing-tool rewrites
for that category, not deferred to "later." See `docs/v2-keyword-driven-workflow.md`'s "research scope
is the category" section. Saudi/Gulf-first still applies: research and launch for Saudi/Gulf before
wider MENA expansion.

---

## 9. Suggested execution order

1. Confirm the decisions in §2 with the owner.
2. Phase 1 (taxonomy) — low visual risk, fixes real bugs (43 orphaned calculators is a live indexing
   gap independent of this redesign).
3. Phase 2 (new v2 tool-page template) — pilot on Saudi/Gulf finance calculators, verify, then get
   sign-off on the new visual direction before mass rollout.
4. Phase 7a (Ads System v2) — designed together with Phase 2, verified on the same Gulf pilot set.
5. Phase 2 rollout — remaining ~100 calculators, cluster by cluster, Gulf/finance first (already highest
   RPM, now also the strategic-priority market).
6. Phase 3 (category hub template) — can start in parallel with Phase 2 rollout once the tool-type field
   from Phase 1 exists.
7. Phase 4 (pipeline automation) — after Phase 2/3 templates are stable enough to be worth automating
   into.
8. Phase 5 (new niches) — Saudi/Gulf professions first, ongoing, backlog-driven.

---

## 10. Mockup — validated v2 design system (2026-07-30)

The visual language Phase 2 calls for is no longer speculative. A full interactive HTML mockup was
built and iterated through ~15 owner feedback rounds, covering every archetype this platform needs
(calculator, converter, comparison, checklist, document generator, category/profession hub). It is the
reference implementation for every future v2 page — read it before designing any new component rather
than re-deriving patterns from scratch.

**Live artifact**: https://claude.ai/code/artifact/ff2326ea-63e8-410e-8044-25327f4c3966

Validated components, ready to port into real code:
- **Single-owning-border input system**: every control (`.field` input, `.select-wrap`, the merged
  `.unit-input-group` value+unit control) is exactly ONE bordered box, height 44px, shadcn-style focus
  ring (`box-shadow: 0 0 0 3px` glow). Root bug fixed and worth remembering: wrapper components must use
  **child combinators** (`.field > input`) not descendant selectors, or a nested control's own `:focus`
  rule double-paints a ring on top of the wrapper's `:focus-within` ring.
- **`.compare-row` component** (bars for numeric metrics, badges for qualitative ones) — replaces a
  cramped 3-column comparison table. Different data shape gets a different component; not everything is
  a table.
- **Category/profession hub pattern**: hero + featured-row (top picks) + type-grouped full link lists
  (`.type-groups`) — this is the real-code pattern Phase 3's `CategoryHubPage` should follow, and is
  already partially ported (see Progress log).
- **Document generator system**: Notion-style draggable blocks (SortableJS), 5 real templates, live
  discount/tax modals, real PDF export (html2pdf.js), true-A4 editing canvas. Relevant once Phase 5/
  micro-niche tools need quote/invoice generators (per `docs/ideas`, every profession needs one).
- **`table-layout:fixed` + explicit column widths** for any comparison-style table, and the reminder that
  a utility class setting `display:inline-block` (like `.num`) must never land directly on a `<td>` — it
  breaks fixed-layout column sizing. Put utility classes on an inner `<span>` instead.
- Mobile-first ordering confirmed: tool panel renders before the article column below the tablet
  breakpoint, everywhere.

## 10a. Correction — Omni Calculator is the actual visual bar, not a boxed-everything look (2026-07-30)

After the first real build against the mockup above (`end-of-service-benefits`), the owner pointed
directly at a live Omni Calculator page as the concrete reference for what "clean" means —
https://www.omnicalculator.com/conversion/mesh-to-micron-converter — and rejected the box-heavy result
the mockup had produced, in his own words: *"super eazy to use no boxes just clean and a lot of white
space with smaller font not everything super big... forgot old design we are creating new system now."*
This is not a contradiction of §0's original north star (§0 already named Omni Calculator as the
inspiration) — it's a correction of drift that crept in while building the mockup, which over time
became boxier and larger-type than that original brief. **This section supersedes §10 wherever the two
disagree** (type scale, box usage); it does not invalidate §10's still-correct parts (the single-owning-
border input system, mobile-first tool-before-article ordering, `.compare-row` for numeric comparisons).

Concrete, binding rules for every `/tools` page from here forward:

- **Type scale is smaller across the board.** H1 clamps to a max of ~1.8rem (was 2.2rem), article H2 to
  ~1.15rem (was 1.3rem), the calculator's result value to ~1.95rem (was 2.7rem). Body/article copy runs
  ~0.9rem at 1.8+ line-height — err small and readable, never large and "hero-sized," anywhere outside
  the H1 itself.
- **Whitespace separates content, not borders.** A plain paragraph of explanation does NOT get a
  `.tool-v2-info-card` background box around it — stacked plain text with real margin between blocks
  (`.tool-v2-plain-block` in `tools-v2.css`) is the default. Reserve an actual bordered/background box
  for content that is a genuinely distinct module: the TOC, a tip/callout aside, the related-tools
  reference card, a real comparison table — not for ordinary prose.
- **The result panel is a plain surface, not a tinted hero.** `.tool-v2-result-hero` is a bordered
  `--bg-surface-2` card now, not a full `--green-subtle` wash — only the number itself carries the accent
  color, matching how Omni's own result card treats its answer.
- **FAQ is plain typography with hairline dividers, not per-item cards.** `.tool-v2-faq` no longer gives
  each `<details>` a background/tint — a bold question, a plain answer paragraph, and a `border-bottom`
  divider between entries is the whole treatment. This directly answers the owner's separate complaint
  that the FAQ "was not readable" — heavy tinting on the open state was flattening the visual hierarchy
  between question and answer.
- **One reference box for related tools, not a grid of boxed cards.** New reusable pattern:
  `.tool-v2-related-card` (see `tools-v2.css`) — ONE outer bordered card (styled after Omni's "Check out
  N similar converters" sidebar module), holding a plain vertical link list with a small leading chevron
  per row. Individual links are NOT their own card — that per-item-boxing is exactly the pattern being
  removed. Place it in the sticky tool lane just under the calculator panel (Omni's own placement),
  reusable verbatim on every future `/tools` page — this is a shared pattern, not a one-off for this
  tool. A lighter, inline version (plain sentence with inlined links, no box at all) is still fine for a
  related-tools mention inside the article body itself, where the sidebar card is off-screen.
- **Tables stay tables** — Omni itself uses plain reference tables (its mesh-to-micron chart) for
  genuinely tabular data. Converting a comparison table into prose would be the wrong lesson to take from
  this; the correction is about prose-that-got-boxed, not about tables.
- Verify any of the above visually against the actual Omni page when in doubt, not from memory — Omni's
  own component choices vary by tool archetype (converter vs. calculator vs. statistics tool).

## 10b. Second correction round — layout structure + liveliness details (2026-07-30)

Same session, after §10a shipped: the owner gave a second, more granular pass of feedback on the built
page. Concrete, binding additions (on top of §10a, not replacing it):

- **Generous, EVEN spacing between every top-level block in column 1.** Don't space headings only
  (the old per-`h2` `margin-top` approach) — give `.tool-v2-lane-article` itself `display:flex;
  flex-direction:column; gap:64px` (or the `--space-8` token) so the hero, every `<section>`, and any
  `<details>` block all get the same generous breathing room, consistently.
- **Title/lead/TOC belong to column 1, not a full-width band above both lanes.** The owner's words:
  *"the title and intro and everything is belong to first column, not title above the calculator or
  tool."* Fix: `.tool-v2-lanes` is CSS Grid (not flex) with the hero, tool, and article as three
  independent grid items — `grid-template-columns: minmax(0,620px) 440px; grid-template-rows: auto
  1fr;` with the hero in row 1/col 1, the article in row 2/col 1, and the tool spanning both rows in
  col 2. **Trap found while doing this:** nesting the hero inside `<article>` (which has `order:2` on
  mobile, after the tool panel) also pushed the H1 below the entire calculator on mobile — a real SEO/UX
  regression (the H1 must stay visible early). Fix: keep the hero as a SEPARATE grid item
  (`.tool-v2-lane-hero`) from `<article>`, with its own `order` that stays first on mobile
  (`order:1`, tool `order:2`, article `order:3`) while `grid-column`/`grid-row` regroups it beside
  the article only at the ≥1024px breakpoint. Grid `order` can express "grouped on desktop, split on
  mobile" in a way flex `flex-direction:column` + shared reordering cannot — reach for grid whenever a
  breakpoint needs to regroup elements differently, not just stack/unstack them.
- **The 3-column ad-rail system already exists — this is not new infrastructure.** `AdLayoutWrapper`
  (`src/components/ads/AdLayoutWrapper.tsx`) already renders `[ad rail] [content]` (or `[rail][content]
  [rail]` in `sidebarMode="dual"`) and every `/tools` page already gets it via `CalculatorAdLayout` in
  `src/app/tools/layout.jsx` — combined with our own inner 2-lane split, that's the 3 visible columns
  the owner asked for (rail · article · tool). It renders NOTHING locally (not even a placeholder) when
  ads aren't configured (`getServerAdsConfig()` returns disabled) — this matches every other page on the
  site (ads are production-only, see root `CLAUDE.md`) and is not a bug specific to this page. The
  sidebar rail is also gated to ≥1440px width regardless of ad config (`AdSidebarSticky` CSS) — verify
  at a genuinely wide viewport, not 1280px, before concluding it's missing.
- **Resources/official-source links: plain inline text, not cards or button rows.** Replaced
  `.tool-v2-source-card` (a bordered box) + `.tool-v2-action-row` of pill-buttons with a single plain
  paragraph containing inline underlined links (`.tool-v2-lane-article p a` in `tools-v2.css`) —
  weaving a tool/source reference into a sentence reads as editorial content, not a CTA widget. Removed
  `.tool-v2-source-card` from `tools-v2.css` entirely once nothing referenced it — don't leave a
  box-pattern component in the shared stylesheet once its last usage is gone, or the next migration will
  reach for it out of habit.
- **Two distinct "related calculators" treatments, not one reused everywhere:** (1)
  `.tool-v2-related-grid` — a plain two-column link grid with a small icon chip per row (icon carries
  color, per the site's anti-border-stripe rule in `.claude/rules/arabic-rtl.md` — no per-item card
  background), placed at the END of column 1's article flow; (2) `.tool-v2-related-card` (already in
  §10a) — the ONE outer-boxed sidebar reference module under the calculator panel. Keep both — they
  serve different reading contexts (end-of-article vs. beside-the-tool) and look intentionally
  different, not redundant.
- **The sidebar related-tools card needs ONE lively accent, not uniform grey rows.** Mark exactly one
  entry (the most likely genuine follow-up — first in the list) `.is-featured`: a small icon chip plus
  `var(--amber-subtle)`/`var(--amber-text)` tint. Reserve this for ONE item only — tinting the whole list
  would just recreate the "everything boxed/tinted" problem one level down.
- **FAQ needs to read as ONE cohesive module, not "just lines under every question."** Wrap the whole
  `.tool-v2-faq` list in a single bordered/rounded container (`border` + `border-radius` +
  `background: var(--bg-surface-1)`) with faint internal dividers (`color-mix(...border-subtle 60%...)`,
  not the full-strength border used for real component boundaries) between entries — each question still
  toggles independently (`<details>` per item, unchanged), but the group now presents as one framed
  "FAQ block" rather than N floating text fragments with a hairline under each.

## 10c. Third correction round — content distinctness + embed code quality (2026-07-30)

- **The sidebar related-tools card and the end-of-article related-calculators grid must show
  DIFFERENT tools, never the same set twice.** Caught on `end-of-service-benefits`: both were built
  from the identical `RELATED_TOOLS` array (finance cluster, sliced to 4), so a reader saw the exact
  same 4 links in two different-looking widgets — confusing, and a wasted internal-linking
  opportunity. Fixed pattern going forward: build TWO curated slug lists per page —
  - **Sidebar card** (`.tool-v2-related-card`, under the calculator): same-niche tools — literally
    "the same thing for a different country/variant" (Omni Calculator's own "check out N similar
    converters" is genuinely other unit converters, not just any tool). For an end-of-service page,
    that means OTHER countries' end-of-service calculators.
  - **End-of-article grid** (`.tool-v2-related-grid`, end of column 1): complementary tools for what
    the reader does NEXT with the answer they just got — for end-of-service, that's general financial
    planning tools (loan/installment, net salary, VAT, investment growth), not more severance
    calculators.
  - Pick both lists by explicit slug array + `.find()`, not by cluster-filter-and-slice — a curated,
    intentional list beats "whatever happens to be first in `data.js`" and makes the distinctness
    obvious and reviewable at the page-authoring level.
- **The embed `<iframe>` snippet must render as a real, readable multi-line code block, not one
  150+ character line.** Fixed in the SHARED `EmbedCodeSnippet.client.jsx` (used by percentage, bmi,
  monthly-installment, age, holidays, and prayer pages too, not just `/tools`) — the generated
  snippet string is now genuinely multi-line with one attribute per line:
  ```
  <iframe
    src="..."
    width="..."
    height="..."
    style="border:0;"
    loading="lazy"
    title="..."
  ></iframe>
  ```
  The `<pre>` wrapper already preserves literal newlines (no CSS change needed) — this was purely a
  JS template-string formatting fix. Benefits every existing caller of this component, not just
  `/tools` pages.
- **The embeddable widget already carries our attribution** (`src/app/embed/calculators/[slug]/
  page.jsx`: a "[tool name] من ميقاتنا" link back to the real canonical page, rendered inside every
  embedded iframe) — this was already built before this session and satisfies "the embed should
  benefit us when used on other sites." No ad was added inside the embed iframe itself; the
  attribution link is the monetization/SEO mechanism here (referral traffic + a real backlink from
  every site that embeds a tool), which is simpler and lower-risk than serving ads inside a
  third-party page's iframe. Revisit only if the owner explicitly asks for an in-embed ad slot.

## 10d. Three-column layout — SETTLED, do not revisit (2026-07-30)

Owner's own words: *"this system of spacing should be respected in all future calculators, and
this is the most important part — we should not talk about this in future."* Final, binding
spec for the `.tool-v2-lanes` desktop grid (≥1200px):

- **Breakpoints are decoupled on purpose**: tablets (<1200px) stay on the mobile stacked layout
  (tool → mobile-ad → title → content). The 2-column article/tool split activates at 1200px —
  NOT 1440px — because a real laptop's browser viewport is very often narrower than its screen
  resolution (unmaximized windows, devtools open), and gating the split on the same threshold the
  ad rails need hid it for genuine laptop users. Ad rails still activate separately at 1440px
  (unchanged, shared sitewide with blog/holiday/prayer/time-now — do not lower this without
  reworking those pages' fixed-width content columns first).
- **`grid-template-columns: minmax(320px, 560px) minmax(360px, 460px);`** — fixed-max tracks, NOT
  `fr`. An earlier `fr`-based attempt combined with a `max-width` + `margin-inline:auto` centering
  hack produced a visible dead gap beside column 1 on ordinary laptop widths — flagged directly:
  *"i see some space in right of first column... this is wrong."* Fixed-max tracks plus the grid's
  default `justify-content:start` make columns flush against the container's start edge with
  nothing extra needed; the true 3-column look (visible rails on both sides) only appears once a
  screen is wide enough for the ad-rail system to add real columns outside this block — which is
  correctly restricted to big/27"+ monitors, not normal laptops, per: *"we should not see two
  columns in center [with dead space]... this is only in big devices like 27", not normal laptop."*
- **`"wide"` layout's outer cap raised from 1680px to 1900px** (`ads.css`) — at 1680px, a
  dual-rail `wide` page couldn't fit content at its full target size (560+460px) alongside
  full-width 340px rails even at a genuine 1920px viewport. This is a `data-layout="wide"`-level
  change (shared with `mwaqit-al-salat`/`time-now`/holidays hub, all of which want more room by
  the same "wide = hubs/rich-grids" logic already documented in §2.1), not a one-off for `/tools`.
- **Columns 1+2 combined must clearly outweigh column 3**: 560+460=1020px vs. a single rail's
  280–340px — satisfies the owner's explicit ratio call. Rails stay wide enough (280px at
  1440–1799px, 340px at ≥1800px) for both vertical (160–300×600) and box (300×250) ad formats,
  per: *"we should have enaugh space for all types of ads... vertical and box ads."*
- Before touching ANY of this again for a new calculator, re-read this section instead of
  re-deriving the breakpoints from scratch — the owner has explicitly closed this topic.

## 10e. Functional testing is mandatory before shipping — and how to test correctly (2026-07-30)

Owner's standing rule going forward: *"every calculator we create it should work fully and be
tested before shipping."* This session's own testing produced a real false-positive worth
remembering so the next session doesn't repeat it: a from-scratch Puppeteer script simulating
"clear form, then retype values" reported the result/share button staying broken — investigated
at length before concluding the app was fine and the TEST was flawed. Two real lessons:

1. **`elementHandle.type(fullString)` on a native `<input type="date">` is unreliable** — it can
   land keystrokes in the wrong internal segment (month/day/year), especially right after the
   field was programmatically cleared to `""` (confirmed: old day/month digits bled through from
   before the clear while a new value was typed). This is NOT necessarily how a real mouse-clicking
   human would experience it (they see which segment highlights and self-correct), so a script
   failure here isn't automatically a real bug — verify with `page.mouse.click()` at a specific
   coordinate (near the field's start edge, since date inputs are forced `dir:ltr`) or
   `page.keyboard.type()` after an explicit `.click()`/`.focus()`, not a blind `elementHandle.type()`
   call, before concluding a date-input flow is broken.
2. **A defensive fix was still worth making despite the false alarm**: `EndOfServiceCalculator
   .client.jsx` now bumps a `formKey` state on مسح (clear) and applies it as `key={`start-
   ${formKey}`}`/`key={`end-${formKey}`}` on the two date inputs — forcing React to fully remount
   fresh native DOM nodes instead of just changing the existing node's `value` prop, which
   guarantees no stale browser-internal segment memory survives a clear. Apply this same pattern
   to any future calculator with date inputs and a "clear" action.

**The actual required test before shipping any calculator**: clear → refill every field via a
real click+keyboard sequence (correct coordinates, not blind whole-string typing into segmented
inputs) → confirm the result panel reappears and the share button re-enables. Confirmed working
end-to-end for `end-of-service-benefits` via this exact sequence (see the session transcript for
the working script) — result value and share-button state matched a fresh, valid calculation.

**Tooltip rule**: use the site's real `Tooltip`/`TooltipTrigger`/`TooltipContent`/`TooltipProvider`
components (`@/components/ui/tooltip`, Radix-based) for ANY tooltip, app-wide — never the native
HTML `title` attribute, which can't be styled at all. The dark-pill/white-text look the owner asked
for (*"black bg and white text in all app"*) is already this component's existing, sitewide
default (`--tooltip-surface`/`--tooltip-text` in `components.css`) — this was a bug of using the
wrong mechanism, not a missing style. Wrap a whole list/grid of tooltipped items in ONE shared
`<TooltipProvider>` (not one per item) for efficiency. Note: verifying a Radix tooltip's hover-open
behavior via Puppeteer is unreliable in this environment even for already-shipped, unrelated
tooltip usages (confirmed by testing `EventDayLink`, a pre-existing feature, which shows the same
non-reproducing hover in both headless AND headed Puppeteer) — don't spend time chasing that in
future sessions; verifying the DOM wiring (`data-slot="tooltip-trigger"` present, `asChild`
correctly merged onto the real element) is the reliable signal that the integration is correct.

## 10f. Legal/factual accuracy is a hard gate — verify BEFORE build/redesign, not after (2026-07-30)

Owner's standing rule, triggered by a real incident this session: *"all calculators and tools
should be deeply verified before creation... in future every calculator should be verified before
redesign and rebuild."* This is now mandatory for every calculator, not just the two below.

**What actually happened**: `uae-end-of-service` was migrated into v2 (page.jsx, engine.js,
`UaeEndOfServiceCalculator.client.jsx`, `finance-page-content.js`) while faithfully preserving the
OLD calculation logic — resignation reduced to 1/3 at 1–3yrs, 2/3 at 3–5yrs, full at 5yr+. That
rule was REPEALED by Federal Decree-Law No. 33 of 2021 (effective Feb 2022; the narrow transitional
exception for un-converted legacy contracts expired Feb 2023). Current law: full gratuity after
just 1 year of service, identical for every termination reason, capped at 2 years' basic wage
(Article 51(6) — also not previously implemented). Preserving old logic faithfully during a
redesign is not the same as preserving CORRECT logic — nobody had fact-checked the original build.
Both facts were independently re-confirmed via fresh WebSearch against u.ae and multiple
2026-dated legal sources before shipping the fix (engine.js, page.jsx tabs/tables, and every
affected FAQ item across `finance-page-content.js` — including two comparison-FAQ mentions of UAE
law embedded in the unrelated `eos-qatar` and `eos-jordan` entries, which would otherwise have
shipped self-contradictory info about a country they weren't even about).

**Standing rule going forward**: before building OR redesigning any calculator that encodes a
legal/statutory rule (labor law brackets, tax thresholds, benefit formulas, eligibility cutoffs),
run a fresh WebSearch verification pass against official/government sources — do not assume
existing code is correct just because it already shipped, and do not assume a rule is unchanged
just because the formula "looks stable." Laws get amended; a build from months ago may be
describing a repealed rule. This applies even when only doing a visual/UI redesign with no
intended logic change — check the underlying facts anyway, since redesign sessions are often the
first time anyone re-reads the content closely enough to notice something's wrong.

**Follow-up — also fixed same session, once flagged and owner said "fix now"**: the identical
`getXxxEndOfServiceBracket(service.decimalYears)` pattern was found unchanged in
`getKuwaitEndOfServiceBracket`, `getBahrainEndOfServiceBracket`, `getEgyptEndOfServiceBracket`, and
`getJordanEndOfServiceBracket` — same exact-anniversary bug, now fixed identically (pass
`service.years` instead). Confirmed via live Puppeteer runs through each calculator's real UI
(Select dropdown + `role="option"` clicks, not just code review) — the Kuwait case was the most
dramatic: resigning at exactly 3 years was showing **0% entitlement** (wrongly bucketed one tier
down) before the fix, **50%** (correct tier) after. Also: `calculateQatarEndOfServiceBenefit` had
NO minimum-service eligibility gate at all (paid a prorated amount from day one), contradicting the
site's own `eos-qatar` FAQ content which correctly states Qatar requires 1 full year (Law art. 54).
Fixed by adding an `isIneligible = service.years < 1` gate (zeroes `gratuity`/`entitlementPercent`
when true) plus a new "لا يوجد استحقاق بعد" notice in `QatarEndOfServiceCalculator.client.jsx`,
mirroring the existing `isForfeited` (art. 61 misconduct) notice pattern. All 5 fixes verified via
`npm run lint` + `tsc --noEmit` (clean) and live browser interaction at exact bracket boundaries.

### The `decimalYears` exact-anniversary bug (engine.js) — a second, independent real bug found via testing

Separate from the legal-fact error above: `diffDates()` in `engine.js` computes
`decimalYears: totalDays / 365.2425`. For an exact N-calendar-year span (e.g. exactly 12 months),
`totalDays` can be 365 (a non-leap-crossing year), giving `365 / 365.2425 = 0.99934` — just UNDER
the "1 year" bracket threshold. `getUaeEndOfServiceBracket()`/`getEndOfServiceBracket()` compared
this approximate value directly against integer thresholds (`< 1`, `< 2`, `< 5`, `< 10`), so anyone
leaving on their EXACT service anniversary got silently bumped down one bracket — e.g. a UAE
employee resigning at exactly 1 year got shown a ZERO gratuity instead of the full first-year
amount. Caught via Puppeteer while checking the redesigned milestones timeline (the 1-year
milestone showed `0.00 AED` instead of a real number) — a good example of why the
functional-testing rule in §10e catches more than UI regressions.

**Fix applied (Saudi + UAE only, this session)**: pass `service.years` (the calendar-exact whole
years, computed via UTC year/month/day subtraction with borrow-fixing — no floating-point
approximation) into the bracket functions instead of `service.decimalYears`. `service.years` is
exactly the right value for a "has completed at least N whole years" threshold check; the
`decimalYears` approximation stays correct to use for the smooth pro-rated first-five/remaining
split inside `calculateEndOfServiceBenefit`/`calculateUaeEndOfServiceBenefit`, since that's a
continuous formula, not a discrete bracket boundary. **Same fix is very likely needed** in
Kuwait/Bahrain/Egypt/Jordan's bracket functions (see follow-up note above) — same file, same
pattern, same class of bug, not yet applied there.

## 11. Ads System v2 — IMPLEMENTED 2026-07-30 (this section used to say "deferred")

Owner reversed the "don't implement yet" directive same-day and asked for the real ad layout on
`end-of-service-benefits` directly. What actually shipped, and how it maps onto the design below
(mostly matches; a few things were built differently once real constraints showed up):

**What shipped:**
- `src/components/ads/DevAdPlaceholder.tsx` — confirms the "no dashed/bordered placeholder box"
  rule below, but goes further: NO visible design at all, not even a soft fill — just reserved
  height, fully transparent, `aria-hidden`. Owner's exact words: *"the ad box should have no design
  at all, no borders not bg nothing, just give ad a space and put it there... we should not have
  design boxes for everything and every ad."* Gated on `getServerAdsConfig().enabled` (server-side,
  not `NODE_ENV`) so it can never show up alongside a real ad even in a non-production environment
  that happens to have real AdSense credentials — and it never renders in actual production, so it
  carries zero revenue/CLS/policy risk.
- `src/components/tools-v2/ToolTopAdSlot.jsx` — wraps `AdTopBanner`, adds the dev placeholder
  fallback. Fixed rule: every `/tools` page's top ad slot gets a reserved gutter directly under the
  navbar, before breadcrumb/H1 — never zero space between navbar and title.
- `src/components/tools-v2/ToolInArticleAd.jsx` — wraps `AdInArticle`, same dev-placeholder
  pattern. Used twice per page: once literally in the middle of column 1's sections (roughly half
  the sections before it, half after — not "mid-article" loosely, actually counted), and once as a
  **mobile-only** slot (see below).
- **Three columns confirmed as the real target, not just "nice to have":** `CalculatorAdLayout` (used
  by both `/tools` and the old `/calculators`) got a new `sidebarMode` prop, defaulting to `"single"`
  (unchanged behavior for old `/calculators` pages) — `/tools/layout.jsx` explicitly passes
  `sidebarMode="dual"`, giving `/tools` pages fixed ad rails on BOTH sides with the 2-lane content
  centered between them, reusing the SAME `AdLayoutWrapper`/`AdSidebarSticky` grid infra already
  live on blog/holiday/prayer/time-now pages — not a new bespoke rail system.
- **Real pre-existing bug found and fixed in that shared infra:** the dual-mode LEFT rail didn't get
  a grid column, a visibility rule, or its own ad-load breakpoint until ≥1680px, while the RIGHT rail
  activated at ≥1440px — meaning any page already using `sidebarMode="dual"` (blog articles, holiday
  details, several `mwaqit-al-salat`/`time-now` pages — a lot of already-shipped, live pages) showed
  only one rail, or a rail with no assigned column, across the entire 1440–1679px range, which covers
  extremely common laptop widths (1366/1440/1536/1600px are among the most common real laptop
  resolutions). Fixed in `src/app/styles/ads.css` (both rails now activate together at 1440px) and
  `AdSidebarSticky.tsx` (the static/left rail's own `isDesktop` breakpoint check now matches, so its
  ad actually attempts to load as soon as the column shows, instead of reserving dead space).
- **A second, related layout bug found while fixing the above:** the /tools page's own inner 2-column
  split (article + tool) used a FIXED px width for the tool column (`460px`) alongside a
  `minmax(0, 560px)` article column — this assumed ~1044px would always be available, which is true
  with no ad rails but false once dual rails are active (real available content width measured via
  `getBoundingClientRect()`: as low as 832px at 1440px viewport, never exceeding ~992px even at
  1920px because the "wide" layout caps `.layout-with-ads` at 1680px total width). The article column
  was measured shrinking to ~300px — a real, confirmed regression. Fixed by making BOTH tracks
  `minmax(min, Nfr)` (`minmax(320px, 1.15fr) minmax(360px, 1fr)`) so space distributes
  proportionally above sensible minimums instead of one fixed track starving the other. **Lesson:
  any inner content-column split inside an ad-railed layout must be tested at realistic rail-active
  widths (1440–1680px), not just a rail-free viewport — a layout that looks perfect without ads can
  still break once the shared ad system reserves real width around it.**
- **Fixed mobile order (owner's explicit spec):** tool/calculator first, then one ad
  (`ToolInArticleAd` mobile instance, `.tool-v2-lane-mobile-ad`, `display:none` ≥1024px), then the
  title/hero, then the rest of the article content. Implemented via CSS Grid `order` on 4 sibling
  grid items (hero/tool/mobile-ad/article) — plain flex can't express "grouped on desktop, split
  apart around an inserted ad on mobile" the way grid `order` + explicit `grid-column`/`grid-row`
  can.
- **Column 1 (article) is deliberately narrower than the tool column** — owner's explicit call: "the
  calculator is important... clean and modern design." `max-width: 560px` (was 620px) for the article
  track's cap; tool column's fr-share is proportionally larger (see the fr fix above).

**Not built** (still deferred, no owner ask yet): the ≥1900px "fixed rail fills the outer margin"
approach described below as an alternative design — the existing grid-column rail system already
covers this need well enough once its bugs were fixed, so there was no reason to build a second,
parallel rail mechanism. Revisit only if the grid-based rails prove insufficient at some future
point.

Original design notes (kept for history, superseded above where they conflict):
- **≥1900px (27"+/ultra-wide) viewports**: article+tool content stays centered at its normal width; two
  new ad rails fill the open outer margins on both sides (`position:fixed`, ~200px wide, ~20px gap from
  the centered container: `right/left: calc(50vw - 940px)`). The existing single in-flow side rail
  (`.lane-ads`) hides itself at this breakpoint so it's never 3 rails at once.
  breakpoint math: rail-width(200) + gap(20) + half-container(720) = 940.
- **Mobile fixed ads**: a small ad pinned right under the navbar and another pinned to the bottom, both
  staying put through scroll (`position:fixed`), content gets bottom padding so nothing hides behind it.
  **Not yet built** — owner's most recent mobile spec (implemented above) is tool→ad→content ordering
  in normal flow, not fixed/pinned positioning; revisit fixed positioning only if asked.
- **Before doing more here**: audit and likely disable overlapping Google Auto ads units in the
  AdSense dashboard (not code-controllable) so they don't double up with these manual placements —
  the real ads-system.md memory already flags Auto anchor as the current best-performing bottom unit,
  so this needs a careful before/after RPM comparison, not a blind toggle-off. Still not done.

## 11a. Category hub pages (`/tools` and `/tools/<category>`) — IMPLEMENTED 2026-07-30

Two new page types, both now built and both the required pattern for every future category:

- **`/tools`** (`src/app/tools/page.jsx`) — top-level category picker. A `CATEGORIES` array, one
  entry per category, each linking to `/tools/<slug>`. Only `gulf-finance` exists so far; add a
  new entry here the same day a new category hub ships, never before (a category card linking to
  a hub that doesn't exist yet is a dead link).
- **`/tools/<category>`** (e.g. `src/app/tools/gulf-finance/page.jsx`) — the category hub itself.
  Lists EVERY relevant existing tool for that category, not just the ones already migrated to
  `/tools/<category>/<slug>` — a tool still living at its old `/calculators/<slug>` URL still gets
  listed and linked to from here (its `href` in `CALCULATOR_ROUTES` just points at the old path
  until it's migrated; the hub doesn't care which system a tool's page currently uses).

**Country-grouping rule (owner's explicit spec, 2026-07-30):** every tool in a hub must be grouped
by which country's law/system actually governs it, with country groups shown as their own
sections (flag + heading + a one-line "built specifically for law/system", per
`src/components/shared/CountryFlag.jsx` — never a Unicode emoji flag, see the pre-existing
sitewide SVG-flag migration). Multi-country tools get their own section with an explicit
`coverage` string per tool ("يدعم: السعودية، الإمارات...") — never leave a multi-country tool's
actual country list unstated. A `badge` field on `CALCULATOR_ROUTES` is NOT a reliable country
signal (confirmed via a full audit of the finance cluster: `badge` mixes real country names with
topical/marketing tags like `"4 في 1"` or `"مجاني"`) — build a hand-authored slug→country map per
hub instead, the same pattern the pre-existing `/calculators/finance/page.jsx` already used for
the same reason. Tools with no country tie at all (pure fiqh rulings, generic math like a
percentage calculator) get their own non-country sections instead of being forced into a country
bucket — `gulf-finance`'s hub uses "أدوات متعددة الدول" / "حاسبات عامة" / "أدوات شرعية عامة" for
this, adapt the exact section names per category.

**Metadata for a hub page** should honestly describe what's actually listed (tool count, countries
covered) rather than target a specific new keyword cluster the way an individual tool page does —
a hub is navigation/information-architecture, not a page competing for new search intent, so it
doesn't need a fresh Keyword Planner pass the way Step 1-8 of the workflow doc do for an actual
tool. Still keep the title/description accurate and specific, never generic ("أدوات ماركة X").

**Migration-completion rule reaffirmed** (already in `docs/v2-keyword-driven-workflow.md` Step 7,
restated here because the hub pages make it easy to forget): a tool only gets its old
`/calculators/<slug>` page deleted and its nav/menu references removed AFTER its new
`/tools/<category>/<slug>` page is built, verified working, and the hub/nav links have been
updated to point at the new path — never delete-then-verify. Until a tool is migrated, the hub
simply links to its current (old) URL; that's expected, not a bug to "fix" by deleting old pages
early.

---

## 12. Progress log

**2026-07-30 — First real Phase 4 migration shipped: `end-of-service-benefits` → `/tools/gulf-finance/end-of-service-benefits`.**
Built via the full keyword-driven pipeline in `docs/v2-keyword-driven-workflow.md`: real Keyword
Planner data (two rounds) → clustering/scoring → Tool Spec → build, same session, no separate
sign-off gate (per owner's confirmed method). New page: `src/app/tools/gulf-finance/
end-of-service-benefits/page.jsx`, new scoped CSS (`src/app/tools/tools-v2.css`), real 3-lane
article/tool/ads shell with a working TOC (including a `TocDetailsReveal.client.jsx` island so
TOC clicks auto-expand a collapsed section instead of just scrolling to its visible summary).
100% of the existing calculator logic preserved (date-based service calc, resignation-percentage
tiers, milestone timeline, wait-comparison slider, chart, share/copy) — only the container was
re-skinned. Content additions from keyword research: two new FAQ entries (colloquial ة/ه spelling
parity, and an honest scope note excluding domestic workers/government employees rather than
guessing an unverified formula for the "حاسبة مكافأة نهاية الخدمة للموظف الحكومي" cluster that
came back with real, rising volume). **Owner corrected the URL strategy mid-build: no 301
redirects** — old `/calculators/end-of-service-benefits` was deleted outright (plain 404), not
redirected, since the existing pages already get ~0 organic impressions. 16 hardcoded references
to the old URL across the codebase (nav, homepage, sibling calculators' related-tool links, holiday
internal-links, embed config, SEO manifests) were found via a full `src/` grep and fixed — this
is now a mandatory step in the workflow doc for every future migration, not just this one.

**2026-07-30 — Phase 1 started (categorization, no URL changes):**
- `CalculatorHubGrid` (in `src/components/calculators/common.jsx`) was dead code — built, styled
  (`.calc-hub-grid`/`.calc-hub-link` in `calculators.css`), but wired into no page. Parameterized it to
  accept a `routes` prop (previously hardcoded to the full, unscoped `CALCULATOR_ROUTES`) plus
  `ariaLabel`/`emptyTitle`/`emptyDescription` overrides — now reusable per-category.
- Wired it into `/calculators/finance` as a new "كل حاسبات المال والعمل" section: previously
  `CalculatorToolLauncher` capped the visible list at 8 of 66 tools (`.slice(0, 8)` inside the shared
  launcher component) — the other 58 existed only in an invisible JSON-LD `ItemList`, unreachable by a
  real visitor. Deliberately did NOT touch `CalculatorToolLauncher`'s cap (it's shared by other pages as
  a legitimate "featured picks" widget) — added the full list as an additional, separate section instead.
  Verified in a real browser: all 66 tools now render as real clickable links, 0 console errors.
- **Not yet done** (queued next, still Phase 1): give `health` (7 tools) and `education` (5 tools) real
  hub pages — right now `CALCULATOR_HUBS.href` for both just points at one member tool's page, there is
  no dedicated hub page at all. Regenerate the header mega-menu (`NavLinks.tsx`'s `CALC_CATEGORIES`,
  hand-maintained, only lists 62/105 tools) from `data.js` instead of by hand. Fold
  `personal-finance-data.js` and `lib/sleep/content.js` back into `data.js`. Add the `type` field to
  `CALCULATOR_ROUTES` — audited all 105 slugs: every existing calculator is uniformly `type: calculator`
  today (no generators/converters/checklists/comparisons exist yet in the real catalog), so this field
  won't produce meaningful sub-grouping until Phase 4/5 add non-calculator tool types — still worth
  adding for schema completeness, just flagging it won't visibly change any page yet.

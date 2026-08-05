---
paths:
  - src/components/calculators/**
  - src/app/calculators/**
  - src/app/tools/**
---

# Calculator UI/UX Standards

## 0. Premium product bar (owner directive, 2026-07-31 — standing rule, do not wait to be told again)

Every calculator ships as a genuinely premium product, not a bare input→output box. This is not
about sprinkling icons on — it's the whole experience. Concretely, for every calculator:

- **Choice lists must be scannable, not identical rows.** If a user has to read every option's fine
  print to know what to pick, the design failed. Use `.tool-v2-choice-card` (icon chip + bold title
  + one-line human description + a "الأكثر استخداماً"-style recommended badge on the sensible
  default) instead of plain `.tool-v2-option-row` for anything that's a *type/tier* choice (paint
  type, concrete grade, finish level) — reserve plain option-rows for genuinely simple binary/short
  choices where nothing needs explaining.
- **No jargon in badges or micro-copy.** A badge reading "شامل احتياط 12%" means nothing to a normal
  reader. State the *benefit* in plain language near the result instead ("النتيجة تشمل هامشاً إضافياً
  حتى لا تنقصك الكمية أثناء العمل"), not a bare percentage label.
- **Prefer steppers over raw number inputs for small counts** (doors, windows, rooms) — more
  tactile, harder to fat-finger a wrong value on mobile.
- **The content column needs real visual material, not just paragraphs**: a chart, a comparison bar,
  a diagram — something a competing site doesn't bother building. `recharts` is already a project
  dependency (used in the old `BuildingCostCalculator`) — use it (as a small client island inside a
  Server Component page) or plain CSS/SVG bars where a full chart library is overkill.
- **Use any component or library already in the project** to get there — shadcn primitives, recharts,
  Phosphor icons, whatever fits. Don't self-limit to only what a previous tool already used.
- **Explain the subject like a knowledgeable friend**, anticipating the actual questions a normal
  person has, not a spec sheet. This is the same register as `arabic-content-writing`/
  `content-quality` skills — apply it inside calculator copy too, not just editorial pages.
- **Comprehensive keyword coverage is a standing rule for every tool**, covering short, medium, and
  long-tail phrasing grounded in real search behavior — not something to re-request per tool. This
  is about on-page content Google actually crawls (headings, FAQ, body), not just title/meta.
- **Never invent a specific arbitrary number inside an FAQ question** (owner correction, 2026-07-31:
  flagged `"كم تكلفة بناء شقة 150 متر؟"` — "why the question has exactly 150... if a user wants 150m
  exactly he will calculate it... the FAQ should be answering questions that we find in google search
  keyword and should be for all types of people"). A specific number in a question is only valid if
  it's a real, commonly-searched round figure (e.g. an existing FAQ uses "فيلا 500 متر" — a genuinely
  common Saudi search size). When in doubt, write the general form of the question ("كم تكلفة بناء
  شقة؟" not "...150 متر؟") and point to the calculator for the exact figure — same pattern as
  "كم دهان أحتاج لشقة كاملة؟" already does ("لا يوجد رقم ثابت... احسب في الحاسبة أعلاه").
- **Panel-head badges must identify what the tool calculates, not state a generic marketing
  outcome** (owner correction, 2026-07-31: paint's badge "جاهزة للشراء مباشرة" — "has no meaning...
  should be related to the tool"). Match the sibling pattern: `rebar` → "حسب القطر", `cement` →
  "للصبات الخرسانية", `sqft-sqm-converter` → "تحويل دقيق 100%" — each names the calculation
  method/scope, not a benefit statement. (Benefit statements are fine inside `hero.highlights`
  full sentences — this rule is specifically about the short panel badge.)
- **Benchmark against major English-language tools in the same space** (Omni Calculator and similar)
  for interaction patterns worth adapting — not copying, adapting what makes them feel premium.
- **Mobile-first, but not monotonous** — avoid defaulting every section to a full-width stacked card;
  vary layout (inline stat rows, compact tables, side-by-side comparisons) where it reads better.
- **Never present an "N × S" result as one run-on phrase** ("2 علبة 5 لتر" — a normal reader can't
  tell what 2 and 5 each mean). Use the `.tool-v2-result-stat-row` dual-stat pattern (two labeled
  numbers side by side with a "×" separator) instead — see `PaintCalculator.client.jsx` for the
  reference implementation. Applies to any result shaped "N of size S": cans of a given liter size,
  bags of a given kg size, boxes of a given tile count, etc.
- **Bidi bugs in mixed Arabic/number result strings are real and invisible to `.textContent`
  checks** — a Puppeteer script reading `element.textContent` returns DOM/logical order, not the
  CSS-bidi-reordered *visual* order, so it cannot catch a scrambled display even when the check
  "passes." Always screenshot (not just read text) any new result string that mixes multiple
  Arabic words with multiple numbers before shipping. `direction:ltr` forced on a whole value only
  reliably works for a single "number + short unit" pair (`"34,995.93 د.إ."`) — it breaks down with
  more than one alternating number/Arabic-word segment. `.tool-v2-result-meta` now uses
  `unicode-bidi: plaintext` (lets the browser resolve direction per its own first strong
  character) specifically because it generalizes better across tools than a forced direction.
- **Every tool page needs a `المحتويات` (table of contents) nav block** (owner directive,
  2026-07-31) right under the hero description, before the mobile ad slot. Build a `TOC_ITEMS`
  array of `[sectionId, label]` pairs (one entry per real `<section id="...">` in the article —
  typically guide/table/faq, skip the embed section) and render:
  `<nav className="tool-v2-toc" aria-label="محتويات الصفحة"><div className="tool-v2-toc-head">المحتويات</div><ol>{TOC_ITEMS.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ol></nav>`
  — see `build-cost/page.jsx` or `rebar-weight/page.jsx` for the reference implementation. This
  applies to every tool that exists now and every one built in the future, no exceptions.
  **This bullet is for single-column `tool-v2-*` calculator pages specifically.** Two-column
  `guide-v2-*` article pages (the `/tools/hvac`, `/tools/electrical`, `/tools/plumbing` guide
  pattern — hero + sticky sidebar TOC on desktop) use a different, now-shared component instead:
  `src/components/tools-v2/TocScrollSpy.client.jsx`, rendered twice per page —
  `<TocScrollSpy items={TOC_ITEMS} variant="mobile" />` right after the verdict box (an
  always-visible horizontal pill strip, never a click-to-expand `<details>` — owner correction,
  2026-08-01: "he should see the list without click") and
  `<TocScrollSpy items={TOC_ITEMS} variant="desktop" />` inside `<aside className="guide-v2-toc-
  rail">` (a numbered vertical list). Both variants highlight the current section as the reader
  scrolls (`IntersectionObserver`-based, `rootMargin: '-140px 0px -70% 0px'`) and are styled
  deliberately unlike article body text (pills / numbered circular badges) so the TOC reads as
  navigation chrome, not content — don't rebuild this from scratch for a new guide-v2 page, import
  the shared component. The desktop sidebar's sticky `top` must be
  `calc(var(--app-header-height) + var(--space-4))`, not a bare `var(--space-N)` — the fixed
  navbar's real height has to be accounted for or the sticky card slides up underneath it while
  scrolling (a real bug that shipped and was corrected the same session).
- **Every `<section>` needs a real, specific `<h2>` title and real visual content** — not a vague
  label, not bare paragraphs. A section heading should read like an answer to a question the user
  actually has ("لماذا تختلف نسبة الهدر حسب نمط التركيب؟"), and the section body should carry a
  table, chart, tip callout, or `PlainBlock` — plain prose alone is not enough for a guide section.
- **Sources (`مصادر`) `<ul>` lists need explicit `list-style: disc`** — Tailwind's preflight strips
  `list-style` from all `<ul>`/`<ol>` site-wide, so without an explicit override the bullets
  silently disappear (same root cause as the `.tool-v2-toc ol { list-style: decimal; }` fix below).
  The fix lives in `tools-v2.css` on `.tool-v2-lane-article > section > ul` and
  `.tool-v2-collapse-body ul` — any new list rendered inside a tool's article column must land
  inside one of those selectors (or get its own explicit `list-style` rule) to render bullets.

Derived from EOS Kuwait/Qatar/Bahrain redesign session (2026-07-01), revised 2026-07-08 after owner
feedback that decorative border accents read as templated/AI-generated just like gradients do.
Apply to every new calculator and whenever touching existing ones.

---

## 0a. Gulf-wide targeting, not single-country — rule for every new tool (owner directive, 2026-08-01)

Triggered by the HVAC hub shipping too Saudi-centric by default (hardcoded "ريال", a Saudi-only
SASO energy-label page) when the actual target market is all six GCC countries. Owner's words:
*"we are targeting all gulf countries not just saudi, and this is should be clear, the seo
keywoards that google see should target all countries, we do not want users to see that but
google should see it."* Two distinct requirements follow from that:

- **Money/currency must never be hardcoded to one country.** Any tool that shows a money amount
  (cost, savings, price) needs a country/currency selector, not a fixed "ريال". Reuse the pattern
  built for the HVAC hub: `src/lib/hvac/gulf-currencies.js`'s `GULF_CURRENCIES` list (code/country/
  currency-short-label) + `src/components/shared/CountryFlag` (real SVG flags, never emoji — see
  the pre-existing sitewide flag migration) rendered as `.guide-v2-checker-chip` buttons. The
  calculator math itself stays currency-agnostic — the user always types their own real local
  price, the selector only swaps the displayed label — so this never requires guessing or
  hardcoding a specific country's actual utility tariff (those are heavily subsidized and vary
  wildly between Gulf markets, and change often; stating one as a fixed default would be a real
  factual claim, not a UI nicety). Generalize this pattern (own currency list per domain) for any
  future non-HVAC tool that shows money too.
- **Government/regulatory content must not silently assume one country's system applies to all
  six**, even when one country (usually Saudi) has the best-documented source. Research each
  country's real equivalent body/standard before writing the content (in the HVAC case: Saudi's
  SASO star system and UAE's ESMA star system are both real and separately verifiable, and Oman/
  Bahrain/Qatar/Kuwait share the underlying GSO 2530 regional standard — a 10-minute WebSearch
  found all of this). Where a genuine country-by-country breakdown exists, show it as a real
  visual grid (`.guide-v2-type-grid` + `CountryFlag`, see `/tools/hvac/energy-label`'s "countries"
  section) — this is more useful to a human reader AND is exactly the kind of natural,
  non-keyword-stuffed multi-country content that ranks broadly, satisfying "invisible to the
  user, visible to Google" without literally listing keywords.
- Every route's `keywords[]` array (`src/lib/calculators/data.js`) should include natural
  phrasings for other Gulf countries alongside the Saudi-heavy terms Keyword Planner tends to
  surface most (Keyword Planner defaults skew Saudi/Egypt because of account geo settings, not
  because demand is actually concentrated there) — e.g. alongside "افضل انواع المكيفات" also
  include "انواع المكيفات في الامارات"/"...في الكويت". Don't force every keyword into every
  country name; a handful of natural variants per page is enough.
- This is a permanent rule for every future tool/Hub aimed at a Gulf-wide audience, not a one-off
  fix — check it explicitly during the research phase (PLAN.md §5), before writing any copy.

## 0b. Visual richness and plain language — rule for every new tool (owner directive, 2026-08-01)

Same feedback round, verbatim: *"a lot of pages are short, not having so much visuals, people
need to see more than read... the explination should be more human facing language... everyone
can follow with us."*

- **Every content section needs real visual material, not a wall of paragraphs** — this restates
  and hardens the existing §0 rule ("a chart, a comparison bar, a diagram") into a hard minimum:
  at least one genuinely visual element (icon-grid overview, horizontal bar comparison, gauge,
  country grid, table) near the TOP of the page, not just deep in the FAQ. Two proven, reusable
  patterns from the HVAC hub, both already defined in shared CSS (no new CSS needed most of the
  time):
  - `.guide-v2-type-grid` + `.guide-v2-type-card` (icon-chip + title + short fact list) — for any
    "here are the N options/symptoms/countries at a glance" overview. See `/tools/hvac/ac-types`'s
    type grid or `/tools/hvac/troubleshooting`'s 5-symptom overview (added specifically because
    the page opened straight into a text-heavy picker with nothing to look at first).
  - `.tool-v2-chart-card` + `.tool-v2-hbar-list`/`.tool-v2-hbar-row` (plain CSS horizontal bars,
    already used sitewide, e.g. `PaintCoverageChart`) — for any numeric comparison. **Do not reach
    for recharts for this** — it's a documented, real, already-fought bug in this codebase
    (renders as a single solid rect in RTL/dark mode instead of colored bars per PaintCoverageChart's
    own code comment) — plain CSS bars are the proven, reliable choice here.
  - MagicUI components (`NumberTicker`, `AnimatedCircularProgressBar`, etc.) are fine for extra
    polish but **always need an explicit color override** — their default Tailwind classes
    (`text-black dark:text-white`, or no color at all) don't read this project's `--text-*`/
    `--{color}-text` CSS-variable theme, and silently render near-black/invisible text on this
    site's dark background. Set color via inline `style={{ color: 'var(--...)' }}` where the
    component accepts a `style`/`className` prop on the actual text node, or a targeted CSS rule
    (`[data-current-value] { color: ... !important; }`) when it doesn't — verify visually
    afterward, don't assume a passed className took effect (a real bug shipped from assuming
    this: `AnimatedCircularProgressBar`'s center number rendered as unreadable near-black text
    until caught and fixed).
- **Explain technical terms with a plain-language analogy, not just the jargon.** If a section
  needs EER/SEER, a refrigerant name, or any spec-sheet term, follow it with an everyday
  comparison a non-technical reader already understands (the fix used on energy-label: "EER هو
  مثل كم كيلومتر تقطعه السيارة بلتر واحد — كلما زاد الرقم كان أفضل"). Never leave an acronym or
  technical term unexplained on first use.
- **Verify contrast/color bugs by scanning real rendered pixels, not just code review** — a
  hardcoded chip-index bug (`<StarRow count={1} />` inside a loop meant to render `count={s}`) and
  a black-on-dark text bug both shipped past lint/typecheck/manual code read in the same session
  because neither is a type error. The reliable catch is a small Puppeteer script that walks every
  leaf text node's computed `color` against its background luminance (or, more simply, scrolling
  every interactive element into view and screenshotting it) — add this as a standard step of the
  browser-verification pass for any new interactive tool, not just a visual skim of a full-page
  screenshot (a full-page capture can miss `useInView`-gated animations and anything below the
  fold that never got scrolled to).
- **A guessed/misremembered Phosphor icon name is another blind spot that passes lint and
  typecheck cleanly** (found on the carpenter hub, 2026-08-02: `CeilingLamp` doesn't exist in
  `@phosphor-icons/react/ssr`, real export is `LampPendant` — both `npm run lint` and `npx tsc
  --noEmit` were clean; it only surfaced as a Turbopack 500 during real browser verification).
  Before shipping any new Phosphor icon import, verify the name is real via
  `node --input-type=module -e "import('@phosphor-icons/react/ssr').then(mod => console.log(Object.keys(mod)))"`
  (dynamic `import()` only — `require()` on this ESM-only package silently returns `{}`) or an
  actual browser/Puppeteer render — never trust a remembered/guessed icon name on its own.

## 0c. Every tool page competes to be the #1 result for its micro-niche (owner directive, 2026-08-01)

*"the seo should be stronger, every page should be ranked as top one in the micro niche that we
are targeting... this is should be daly use tools."* Concretely: don't treat "passes the keyword-
integration check" as the bar — go back and add real depth (more FAQ entries grounded in actual
searched phrasings, a genuine country/option breakdown, sourced numbers) until the page is
honestly the most complete answer available for its target query, not just keyword-compliant.
Frame tools as something a reader would bookmark and return to (a tracker, a reusable calculator),
not a one-off answer — that's what "daily-use" means here, and it's a content/UX goal to design
for from the start of the research phase, not an afterthought.

## 0d. Standing rules for every future hub (owner directive, 2026-08-02 — applies to ALL hubs, not just the one being built when this was written)

*"we should be advance, giving the user a really premium content not just simple small page, this
is should be a premium hub, we can create things for different gulf countries to target every one,
we can create pages that user can use daily because they have advance functionalities, we should
also inspire from success non arabic websites that work on these specific things, and create hub
of micro niches in modern design mobile first and super powerful seo with language that every user
will understand and these are rules for any future hub."*

- **Premium hub, not a simple small page.** Every hub page needs real depth — comparison tools,
  visual data, decision-support content — not a thin answer-and-FAQ page. If a page could be fully
  read in 10 seconds, it's not done yet.
- **Daily-use advanced functionality.** Favor tools people would genuinely bookmark and return to
  (trackers, calculators with saved/reusable state, decision tools) over one-shot lookups — this is
  the same "daily-use, not one-off" ambition as §0c, restated as a hard requirement for every hub.
- **Gulf-country-specific targeting where the underlying facts actually differ by country** (not
  forced uniformly — only where real country-specific data exists, same nuance as §0a).
- **Inspire from successful non-Arabic (usually English) websites in the same niche** before
  building — what makes them work, what data/APIs they use, what interaction pattern they use —
  then build the Arabic-first, better-executed equivalent. Don't guess at what "advanced" looks
  like; go find the real bar in English markets first (WebSearch/WebFetch competitor research is
  mandatory before writing any tool, not optional — see the VIN-decoder and real-estate-hub
  research in this same session for the reference pattern: WebFetch a competitor's actual page
  before assuming a gap exists or a feature is out of reach).
- **Micro-niche hub structure**: many narrow, deeply-executed pages beating one broad page, per the
  existing site-wide micro-niche strategy — this rule doesn't change, just restated as a hub-wide
  requirement.
- **Modern, mobile-first design.** Always verify at 390px width first.
- **Powerful SEO**: every page still needs the full JSON-LD/metadata/keyword-integration discipline
  documented elsewhere in this file and in `.claude/rules/seo-metadata.md` — "premium" doesn't mean
  skipping the SEO mechanics, it means the content underneath them is genuinely deep.
- **Plain language everyone understands** — no unexplained jargon, technical terms get a plain-
  language analogy on first use (same rule as §0b, restated as permanent).
- **No tool-count ceiling, no format ceiling** — owner explicitly confirmed hubs can include maps,
  live data, or any other tool shape research supports; never self-limit to calculator/converter/
  checker/tracker/generator as an exhaustive list (this generalizes the PLAN.md §4 note that the
  Omni-Tool taxonomy is a floor, not a ceiling).
- **Never build a tool without a deep research + competitor-check pass first** — explicit standing
  rule, not just guidance: "do not write any tool until you did a deep research." Real Keyword
  Planner/search-volume data plus a real competitor check (WebFetch their actual site, not just
  generic search results — see [[feedback-tools-v2-navbar-migration]]'s sibling memory
  `project-car-maintenance-hub-shipped-2026-08-02` for the exact lesson) come before any code.
- **Note affiliate opportunities found during research, but don't build them yet** — log candidates
  (with what program, what it unlocks, why it fits) into `docs/affiliate-links-to-fill.md` as they're
  discovered; affiliate integration itself is a separate, later, explicitly-triggered task (owner:
  affiliate ties into future "best 10 X" blog content, not the hub tools directly).
- **Classify real search intent before building anything off a keyword cluster, not just its
  volume** (owner, 2026-08-02: "you should understand if people search because they want to buy
  oil or not... if they search for a specific keyword because they want to buy from a store, no,
  you should give the user what he expects"). A high-volume cluster dominated by named-business/
  local-lookup queries (e.g. "ورشة [برند]", "مركز خدمة [برند]", specific shop names) means the
  searcher wants a phone number or address, not an article — do not build content for it; that
  needs a real local-business data source, a different kind of project entirely. Only build
  content for genuine informational/decision-support intent. When that real intent is confirmed
  but the volume is modest, prefer enriching an existing relevant page with a right-sized new
  section over shipping a new, thin standalone page nobody would land on directly — reserve a full
  new page for clusters where both intent AND volume justify it (reference split from the
  car-maintenance hub: ~2,000+/mo real VIN-check intent got its own page; two ~500/mo genuinely
  informational clusters, TPMS troubleshooting and battery lifespan, were folded into existing
  pages instead of becoming two more thin pages).

---

## 1. No Gradient Backgrounds — Ever

Gradients on form cards and result panels look AI-generated and cheap. Always use flat surfaces.

```css
/* ❌ NEVER */
.calc-esb-form-card  { background: linear-gradient(180deg, ...); }
.calc-esb-result-panel { background: linear-gradient(160deg, ...); }

/* ✅ ALWAYS */
.calc-form-card    { background: var(--bg-surface-1); border: 1px solid var(--border-default); border-radius: 16px; }
.calc-result-panel { background: var(--bg-surface-1); border: 1px solid var(--border-default); border-radius: 18px; }
```

## 1b. No Decorative Colored Border Stripes — Ever (added 2026-07-08)

**Superseded rule, kept for history:** an earlier version of this doc recommended a colored
`border-top: 3px solid var(--green)` as "the AI-generated-proof alternative to gradients." Owner
feedback (2026-07-08) was direct: a colored line stamped on a box reads as its own kind of generic
AI-template pattern, not as intentional design. **Do not add colored border-top/bottom/inline-start/
inline-end accents to cards, panels, or result boxes as a substitute for real visual hierarchy.**

Carry color with meaning instead — pick ONE of these, not a border stripe:
- **Icon chip**: a small circular badge (`border-radius: var(--radius-full)`, ~2–2.25rem) with a
  tinted background (`var(--{color}-subtle)`) and matching icon color (`var(--{color}-text)`),
  placed above or beside the value/title. This is what a human designer reaches for — the icon
  carries the category, the chip carries the color, nothing needs a stripe.
- **Tinted surface**: `background: color-mix(in srgb, var(--{color}-subtle) 40–55%, var(--surface))`
  on the whole card for a single hero/featured element — used sparingly, not on every card in a grid.
- **Semantic badge/pill** (`badge-success`, `badge-warning`, etc. — already used site-wide) inline
  in the copy, when the color signals a real state (Ramadan, sacred month, error/success).

```css
/* ❌ NEVER (however it's oriented) */
.card { border-top: 3px solid var(--green); }
.card { border-inline-start: 3px solid var(--blue); }

/* ✅ Icon chip carries the color instead */
.card-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 2.25rem; height: 2.25rem; border-radius: var(--radius-full, 999px);
  background: var(--blue-subtle); color: var(--blue-text);
}
```

If a grid of cards needs visual variety (e.g. 4 stat tiles), rotate the icon-chip color per tile
(`:nth-child(4n+1..4)`) rather than rotating a border stripe color — same variety, no template look.

The colored `border-top` (3px) gives the result panel identity without decoration. Use `var(--green)` for finance tools, `var(--blue)` for info tools, `var(--amber)` for warnings.

---

## 2. No Letter-Spacing on Arabic Text

`letter-spacing` on Arabic text is explicitly forbidden in DESIGN.md §9.2. Check every label, badge, and caption.

```css
/* ❌ NEVER on Arabic labels */
.calc-amount-label { letter-spacing: 0.04em; }

/* ✅ Always 0 on Arabic */
.calc-amount-label { letter-spacing: 0; }

/* ✅ Negative letter-spacing IS allowed on the numeric amount value (Latin digits) */
.calc-amount-value { letter-spacing: -0.015em; direction: ltr; text-align: end; }
```

---

## 3. No Hardcoded Hex Colors — Use CSS Variables Only

```css
/* ❌ NEVER */
color: #10b981;
border-color: #0A6A2D;

/* ✅ ALWAYS */
color: var(--green-text);
border-color: var(--green-border);
```

**Full CSS variable map (dark mode values):**
| Intent | Variable | Value |
|---|---|---|
| Green primary | `var(--green)` | `#1DBB6A` |
| Green text | `var(--green-text)` | `#52E090` |
| Green border | `var(--green-border)` | `#0A6A2D` |
| Green subtle bg | `var(--green-subtle)` | `#031A0C` |
| Blue primary | `var(--blue)` | `#5AADFF` |
| Blue text | `var(--blue-text)` | `#99CEFF` |
| Red primary | `var(--red)` | `#FF4558` |
| Red text | `var(--red-text)` | `#FF8090` |
| Amber | `var(--amber)` | `#FBB63C` |

---

## 4. Mobile-First Layout: 1-Column → 2-Column at lg

Every calculator uses this layout pattern:

```css
/* Mobile: form above, result below (single column) */
.calc-esb-layout {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Desktop (≥1024px): form left, sticky result right */
@media (min-width: 1024px) {
  .calc-esb-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
    gap: var(--space-6);
  }
  .calc-esb-result-col {
    position: sticky;
    top: var(--space-4);
  }
}
```

Test at 375px first, then 768px, then 1280px.

---

## 5. Country/Tool Identity on Result Panel

Every result panel must have a header row identifying what the tool is calculating. Do not let result panels look generic.

```jsx
<div className="calc-esb-result-header">
  <span className="calc-esb-country-badge calc-esb-country-badge--kw">🇰🇼 الكويت</span>
  <span className="calc-esb-live-dot" aria-hidden="true" />
</div>
```

```css
.calc-esb-result-header { display: flex; align-items: center; justify-content: space-between; }
.calc-esb-country-badge { font-size: var(--text-xs); font-weight: 700; padding: 3px 10px; border-radius: 999px; border: 1px solid; }
.calc-esb-country-badge--kw { color: var(--green-text); border-color: var(--green-border); background: var(--green-subtle); }
.calc-esb-country-badge--qa { color: var(--red-text); border-color: color-mix(in srgb, var(--red) 40%, transparent); background: color-mix(in srgb, var(--red) 8%, transparent); }
.calc-esb-country-badge--bh { color: var(--blue-text); border-color: color-mix(in srgb, var(--blue) 40%, transparent); background: color-mix(in srgb, var(--blue) 8%, transparent); }

/* Pulsing live dot */
.calc-esb-live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: esb-pulse 2s ease-in-out infinite; }
@keyframes esb-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.75); } }
```

---

## 6. Sidebar Facts: Horizontal Strip on Mobile

Sidebar quick-facts must be visible on mobile as a compact horizontal strip, not hidden.

```css
/* Mobile: horizontal flex row */
.calc-esb-sidebar-facts {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: 10px;
  border: 1px solid var(--border-subtle);
  background: color-mix(in srgb, var(--bg-surface-2) 50%, transparent);
}

/* Desktop: back to vertical column */
@media (min-width: 1024px) {
  .calc-esb-sidebar-facts { flex-direction: column; gap: var(--space-3); padding: var(--space-3) var(--space-4); }
}
```

---

## 7. CalculatorHero Highlights: Support Both String and Object

`highlights` prop accepts both `string[]` and `{ label: string, desc?: string }[]`. Do not assume one format.

```jsx
// In common.jsx — always detect type before rendering
const isObj = item && typeof item === 'object';
return isObj ? (
  <span>
    <strong className="calc-highlight-label">{item.label}</strong>
    {item.desc ? <span className="calc-highlight-desc"> — {item.desc}</span> : null}
  </span>
) : (
  <span>{item}</span>
);
```

```css
.calc-highlight-list svg { color: var(--green); }
.calc-highlight-label { color: var(--text-primary); font-weight: 600; }
.calc-highlight-desc  { color: var(--text-secondary); }
```

---

## 8. Amount Display: LTR Direction, End Alignment

The numeric output must display in LTR (digits flow left-to-right) while aligning to the right in RTL context.

```css
.calc-amount-value {
  font-size: clamp(2.2rem, 7vw, 3.6rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.015em;
  color: var(--green-text);
  font-variant-numeric: tabular-nums;
  direction: ltr;       /* digits LTR */
  text-align: end;      /* aligns right in RTL parent */
}
```

---

## 9. Pre-Ship UI Checklist (every calculator)

Before marking a calculator ready to commit:

- [ ] Form card: flat background, `var(--bg-surface-1)`, no gradient
- [ ] Result panel: flat background + `border-top: 3px solid var(--green)`
- [ ] No `letter-spacing` on any Arabic text element
- [ ] No hardcoded hex colors — all `var(--...)` 
- [ ] Result panel has identity header (badge + live dot)
- [ ] Layout is 1-column at 375px, 2-column at 1024px
- [ ] Sidebar facts visible on mobile (horizontal strip)
- [ ] Amount value uses `direction: ltr; text-align: end`
- [ ] CalculatorHero highlights render correctly (string or object)
- [ ] Tested with RTL: no broken alignments, no mirrored icons

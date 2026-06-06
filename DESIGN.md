# DESIGN.md: Miqatona Design System
**Version 4.3 · Product UI, Arabic Content, SEO, Ads, Impeccable References, Content Writing, and Editorial UX Source of Truth**

Miqatona is an Arabic-first utility product for time, prayer, dates, calculators, holidays, and practical guides. The interface must feel calm, useful, trustworthy, and intentionally Arabic. It must never feel like a dense directory of boxes, a keyword page, or a generic AI-generated dashboard.

This document governs visual design, UX flow, Arabic copy, internal linking, page structure, and interaction behavior. When code and this file disagree, update one of them before shipping.

---

## 0. Research Basis

These rules synthesize the project skills plus current external guidance:

- NN/g visual design principles: scale, hierarchy, balance, contrast, and Gestalt grouping.
- NN/g information foraging and menu design: strong information scent, visible navigation, clear labels, current-location cues.
- Google Search Central: people-first content, concise unique titles, useful snippets, crawlable descriptive links.
- Google Search AI guidance: foundational SEO still matters for AI Overviews and AI Mode; useful, unique, non-commodity content wins over query-variation pages.
- Plain-language and web-writing research: users scan first, trust objective language, and need short, direct, user-focused copy.
- `.codex/skills/arabic-content-writing/SKILL.md`: reader-first Arabic writing, Feynman-style explanation, direct address, competitor-aware content, and anti-AI-pattern prose.
- Google Ads landing page guidance: relevance, mobile friendliness, simple navigation, useful original content, important information near the top.
- Google AdSense and Publisher Policies: unique publisher content, clear navigation, privacy disclosure, no low-value ad pages, no misleading ad placement, no accidental-click patterns.
- W3C WCAG 2.2: focus visibility, target size, keyboard access, language, and no color-only meaning.
- Google Android Accessibility and Apple HIG: large touch targets, clear hit regions, and visible press states.
- Baymard filtering research: search, filter, and sort are distinct; applied filters must be visible and removable.
- web.dev performance guidance: INP under 200ms, avoid long interaction tasks, animate only transform/opacity.

Reference links are listed at the end of this file.

---

## 0.1 Impeccable Reference Coverage

The project uses the product register from `.agents/skills/impeccable/reference/product.md`: design serves the user task. Familiar, predictable product patterns are a feature. Visual personality comes through clarity, rhythm, Arabic craft, and trustworthy content, not novelty for its own sake.

`PRODUCT.md` is not present in the repository, so this document is the active product and design source of truth until a formal product context file is added.

All work must account for the complete impeccable reference set below. Do not copy these files into components. Distill their rules into the page, component, and content decisions.

| Reference | How Miqatona Uses It |
|---|---|
| `product.md` | Product UI register: restrained color, fixed type scales, familiar controls, full interaction states. |
| `brand.md` | Used only when a surface is intentionally brand-led; product pages still avoid generic brand-showpiece reflexes. |
| `layout.md` | Space is a design material. Fix rhythm, grouping, hierarchy, and repeated card-grid monotony before visual decoration. |
| `spatial-design.md` | 4px spacing, earned cards, squint-test hierarchy, semantic depth, and component-aware layouts. |
| `responsive-design.md` | Content-driven breakpoints, touch-aware controls, no hover-only functionality, safe mobile composition. |
| `typography.md` and `typeset.md` | Fixed product type scale, Arabic line-height, no Arabic letter spacing, clear measure, tabular numerals. |
| `color-and-contrast.md` and `colorize.md` | Restrained palette, semantic color roles, accessible contrast, no reflexive blue/purple/beige domination. |
| `motion-design.md` and `animate.md` | Motion communicates state only; short durations, reduced-motion support, no decorative choreography. |
| `interaction-design.md` | Every control needs default, hover, focus, active, disabled, loading, error, and success states. |
| `ux-writing.md` and `clarify.md` | Specific labels, useful errors, no filler copy, no generic anchors, no redundant intros. |
| `cognitive-load.md` and `distill.md` | Keep each decision point to four visible choices when possible; remove, merge, or defer competing sections. |
| `heuristics-scoring.md`, `critique.md`, and `audit.md` | Review pages with usability heuristics, accessibility, responsive behavior, and production risk in mind. |
| `polish.md`, `quieter.md`, and `bolder.md` | Tune intensity after structure is correct: quieter for noisy pages, bolder only for earned emphasis. |
| `harden.md`, `optimize.md`, and `adapt.md` | Protect production states, performance, i18n, edge cases, and mobile ergonomics. |
| `onboard.md`, `delight.md`, and `overdrive.md` | Use sparingly for empty states, memorable moments, or exceptional experiences that still support the task. |
| `shape.md`, `craft.md`, `extract.md`, `document.md`, `teach.md`, `live.md`, and `codex.md` | Workflow references for planning, extracting, documenting, visual iteration, and asset direction. |
| `personas.md` | Test pages against impatient users, first-timers, accessibility-dependent users, stress testers, and distracted mobile users. |

### Impeccable Operating Rules

1. Start with page intent and cognitive load before styling.
2. Use the product register by default: fixed type, restrained color, predictable layout, standard controls.
3. Treat two-column layouts as a decision, not a default. If the side column does not help the current decision, remove it, move it lower, or turn it into a narrow support rail.
4. Run the squint test on every section: primary value, secondary explanation, and next action must be visible without reading every word.
5. Keep decision groups to four visible options when practical. If a grid has more, group, collapse, prioritize, or convert it into a guided list.
6. Every section needs one role: answer, control, explain, compare, prove, or route. Sections with two roles must be split; sections with no role must be deleted.
7. Every interactive control has visible focus and an accessible name. Hover states never carry information unavailable to touch or keyboard users.
8. Copy follows action-specific labels. Avoid `المزيد`, `اقرأ المزيد`, `تعرف على المزيد`, `روابط ذات صلة`, and any heading that repeats the same idea as its paragraph.
9. Motion is state feedback. Decorative page-load choreography, bounce, elastic easing, and layout-property animation are not allowed on product pages.
10. A page is not done until empty, loading, error, mobile, and long-Arabic-text states have a clear design.

## 0.2 Arabic Content Writing Coverage

`.codex/skills/arabic-content-writing/SKILL.md` is mandatory for every page that contains Arabic copy, not only blog articles. It applies to homepage sections, tool explanations, calculator method notes, prayer pages, date pages, holiday pages, FAQs, metadata, empty states, error states, and related-link labels.

Every content-bearing page must satisfy these rules:

1. The reader must feel directly addressed. Prefer `يمكنك`, `ستحتاج`, `اختر`, `راجع`, and `ستفهم` over detached phrases like `يمكن للمستخدمين`.
2. The first screen or first paragraph must answer the user's real question before expanding into explanation.
3. Every explanation must teach, not decorate. If a concept is abstract, use a simple example, analogy, table, or decision rule.
4. No paragraph may exist only for SEO length. If removing a paragraph would not reduce understanding, remove or rewrite it.
5. Headings must be useful when scanned alone. Avoid topic labels such as `معلومات عامة` when a question or outcome is clearer.
6. Each major editorial section needs at least one concrete detail: number, date, local example, method note, warning, exception, or next step.
7. Content must avoid AI-pattern phrasing: generic intros, repeated summary sentences, hollow benefits, and lists where every item is a vague one-liner.
8. For new or substantially rewritten indexable pages, complete the content brief and, when the topic competes in search, inspect real Arabic competitors before writing.
9. Metadata, H1, intro, FAQ, and related links must use the same search intent and promise. Do not let SEO metadata promise more than the page teaches.
10. The page is not ready until a reader could say: `فهمت الموضوع، وعرفت ماذا أفعل بعد ذلك`.

---

## 1. Product Diagnosis From Current UI

The current screenshot shows a repeated pattern that must be corrected across the app:

1. Too many sections are separated only by `border-top`; this creates a stacked, tired, low-craft page.
2. Many links are shown as equal boxes; users cannot tell what matters first.
3. The dark theme is too dense; there is not enough breathing room for Arabic reading.
4. Data is often represented as small stat boxes instead of a clear answer, context, and next action.
5. Section order feels SEO-driven rather than user-intent-driven.
6. Arabic copy is functional but weak. Example: `ميقاتنا | الوقت والصلاة والتاريخ والحاسبات والمناسبات` reads like a feature dump, not a promise.
7. Blog and guide pages need stronger filtering, better article hierarchy, and more useful related paths.
8. Some buttons feel generic and inconsistent; the app needs a controlled identity style, not random button styling per page.
9. The app needs an AdSense-safe information architecture before monetization: enough publisher content, clear navigation, clear privacy/cookie disclosure, and no ad-like content blocks.

Any redesign work should start by removing these issues before adding visual polish.

---

## 2. Brand Direction

**Design sentence:** An Arabic reader opens Miqatona on a phone or laptop to quickly know the time, prayer time, date, calculation, event date, or next step without confusion.

**Personality:** calm, precise, useful, modern, Arabic, warm, and quietly premium.

**The interface should feel like:**

- a reliable daily companion, not a content farm
- an Arabic product designed from the start for RTL, not translated after the fact
- a clean workspace with enough white space to read slowly and act quickly
- a product with a recognizable identity, but not decorative noise

**The interface must not feel like:**

- endless boxes with borders
- a link directory
- a generic SaaS dark dashboard
- a keyword-stuffed SEO page
- a page where every section fights for equal attention

---

## 3. Core Laws

### Law 1: Intent Comes First

Every page begins with the thing the user came for. If the page answers "what time is it?", the live time is first. If it answers "how much will I pay?", the calculator is first. If it answers "when is this holiday?", the date and meaning are first.

SEO content supports the page after the primary intent is satisfied. It never blocks the answer.

### Law 2: Arabic Is the Origin Language

Arabic content is written directly in Arabic. It is not translated English. Layout, copy, typography, filters, metadata, and navigation labels must all feel native to an Arabic reader.

### Law 3: White Space Is Structure

White space is not empty. It tells the user where one idea ends and another begins. Prefer open space, rhythm, and grouping over borders, boxes, and dividers.

### Law 4: Surfaces Must Be Earned

A card, panel, border, tint, or shadow is allowed only when it communicates grouping, comparison, interaction, or state. Text paragraphs, SEO content, and simple section introductions do not earn cards.

### Law 5: Data Must Explain Itself

A number is not enough. Every important data point needs label, context, timestamp or method when relevant, and the next likely action. Raw data appears after the answer, not before it.

### Law 6: Navigation Is Guidance, Not Link Volume

Internal links should help the user choose the next useful path. Do not solve navigation by placing every link on the page inside boxes.

### Law 7: Production Stability Is Design Quality

No blank pages. No inaccessible controls. No missing loading, empty, or error states. No UI improvement is worth a regression in SEO, performance, or reliability.

### Law 8: Monetization Must Never Harm Trust

Ads, affiliate blocks, sponsorship labels, and promotional modules are secondary to the user's task. They must never be confused with navigation, buttons, results, or editorial recommendations.

---

## 4. Page Section System

Every page is organized by a user-intent ladder. Do not create sections because content exists. Create sections because the user needs them at that point in the journey.

### 4.1 Default Section Order

1. **Immediate answer or primary tool**: the live value, calculator, converter, search, or date.
2. **Primary controls**: filters, city selector, date selector, calculator fields, or search refinement.
3. **Best next paths**: 3 to 5 curated links based on the current page intent.
4. **Main supporting content**: tables, charts, comparisons, explanations, or article body.
5. **Trust and method**: source, calculation method, last update, author, or review date.
6. **Related pathways**: contextual internal links grouped by why the user might need them.
7. **FAQ or edge cases**: only questions that real users would ask.
8. **Archive or full directory**: only after the main experience, and never as the first content block.

### 4.2 What The First Viewport Must Contain

The first viewport should include:

- a human H1 that states the page value
- one short supporting sentence
- the primary answer, form, search, or CTA
- at most one secondary action
- a subtle orientation cue: breadcrumb, country/city, date, or category

The first viewport must not include:

- a long grid of all site links
- generic SEO paragraphs
- multiple equal CTAs
- repeated badges and decorative labels
- a huge footer-like navigation cluster

### 4.3 Section Acceptance Test

Before adding a section, answer:

1. What user question does this answer?
2. Why should it appear here instead of later?
3. What action, decision, or understanding does it enable?
4. What happens if the data is empty, delayed, or unavailable?
5. Does it duplicate another section?

If the answer is unclear, the section is removed, merged, or moved lower.

### 4.4 Redesign From Scratch Triggers

Redesign a section from scratch when it has any of these patterns:

- top-only border as the main visual separator
- more than 6 link cards with equal weight
- a card containing only a heading and paragraph
- nested cards
- duplicate section heading and intro copy
- data shown without context or source
- empty state rendered as blank space
- SEO text above the user's primary task
- 3 or more adjacent sections with the same card-grid structure
- an Arabic title that reads like a list of keywords
- an ad slot visually competing with the main task
- a page where the footer, ads, or related links outweigh the publisher content

### 4.5 Page Quality Spine

Every indexable page uses the same quality spine:

1. **Promise:** title, H1, and first sentence state one clear user benefit.
2. **Answer:** the page gives the requested value, tool, date, table, or explanation immediately.
3. **Context:** the page explains method, source, assumptions, timezone, country, or calculation basis.
4. **Expansion:** the page covers related questions only when they help the same intent.
5. **Evidence:** content shows dates, sources, examples, author/review notes, or generated-data method where relevant.
6. **Next path:** links guide the user to 2 to 5 useful next pages.
7. **Trust:** footer and page chrome expose privacy, contact/about, policy, and site identity.

If a page cannot satisfy this spine, it should not be indexable or monetized.

---

## 5. Layout And White Space

### 5.1 Density Modes

Use density intentionally. The app needs both relaxed reading and compact tools.

| Mode | Use For | Section Gap Desktop | Section Gap Mobile | Internal Padding |
|---|---|---:|---:|---:|
| `airy` | homepage, blog, guides, holiday articles | 88-112px | 64-80px | 28-36px |
| `comfortable` | default tool pages and category pages | 72-88px | 56-72px | 24-32px |
| `compact` | tables, calendars, calculators, dashboards | 48-64px | 40-56px | 16-24px |

No page may use `compact` for every section. After two dense sections, add an open section, a text explanation, or a larger gap.

### 5.2 Page Widths

| Container | Max Width |
|---|---:|
| Main product page | 1180px |
| Wide data page | 1280px |
| Calculator/tool focus | 1040px |
| Editorial article | 720px |
| Narrow form | 640px |

Desktop pages need generous side gutters. Mobile pages need at least 20px inline padding, preferably 24px for Arabic prose.

### 5.3 Spacing Scale

All spacing uses the 4px grid.

| Token | Value | Use |
|---|---:|---|
| `--space-1` | 4px | tiny icon nudges |
| `--space-2` | 8px | icon-label gap, tight list gap |
| `--space-3` | 12px | compact component gap |
| `--space-4` | 16px | default element gap |
| `--space-5` | 20px | small group padding |
| `--space-6` | 24px | default Arabic component padding |
| `--space-8` | 32px | section header to content |
| `--space-10` | 40px | major group separation |
| `--space-12` | 48px | compact section gap |
| `--space-16` | 64px | mobile major section gap |
| `--space-20` | 80px | comfortable section gap |
| `--space-24` | 96px | airy section gap |
| `--space-28` | 112px | maximum editorial section gap |

### 5.4 Separator Rules

Top-only borders are banned as a default section separator.

Use this order instead:

1. whitespace
2. stronger heading hierarchy
3. full-width section band with subtle background, used rarely
4. full card/panel border, only when the content is a self-contained surface
5. divider line inside a surface, only between related rows or header/body

Never stack multiple sections separated only by `border-top`.

### 5.5 Two-Column Layout Rules

Two columns are one of the highest-risk patterns in Miqatona. Many old pages use them to place an explanatory card beside another explanatory card. That creates visual competition without helping the user.

Use two columns only when the columns have different jobs:

| Allowed Pattern | Example |
|---|---|
| primary workspace + narrow support rail | calculator form beside assumptions, method, or saved result context |
| comparison between two entities | city A vs city B, Gregorian vs Hijri, fixed vs variable cost |
| table/chart + explanation | calendar timeline beside what the colors mean |
| article body + navigation rail | long guide with a sticky table of contents |
| controls + live result | selector beside result when both must stay visible |

Do not use two columns for:

- two equal text cards
- two equal link grids
- heading/paragraph blocks beside heading/paragraph blocks
- a decorative aside that repeats the main content
- a sidebar that contains unrelated navigation, ads, and links at the same visual weight
- a page where the side column becomes taller or louder than the main task

Two-column acceptance test:

1. Can the user explain the different role of each column in one sentence?
2. Does the main column remain visually dominant?
3. Does the side column reduce memory load by keeping needed context nearby?
4. Does it collapse cleanly on mobile without changing the task order?
5. If the side column is removed, does the page lose real decision support?

If any answer fails, redesign the section as one of these:

- one-column editorial flow
- primary surface followed by compact rows
- comparison table
- accordion/disclosure group
- guided pathway list
- narrow metadata rail inside the same surface

### 5.6 Card Grid Replacement Patterns

When a page contains repeated equal boxes, replace the grid with a structure that expresses priority.

| Old Pattern | Better Pattern |
|---|---|
| 6 equal cards | 1 primary recommendation + 3 compact follow-up rows |
| 12 link boxes | grouped pathway list with reason labels |
| 3 adjacent icon/text cards | one short explanation + checklist or steps |
| two-column text cards | one narrative section with subheadings |
| repeated stats | one answer module with context, source, and next action |
| FAQ cards | native `details` with clear summaries |

Equal cards are acceptable only when users are comparing peer items and every item truly has equal importance.

---

## 6. Color System

Miqatona uses a restrained product palette with one action color and one warm identity color.

### 6.1 Semantic Tokens

| Token | Role |
|---|---|
| `--color-bg` | outer page background |
| `--color-surface` | default cards, forms, panels |
| `--color-surface-raised` | popovers, dropdowns, modals |
| `--color-surface-muted` | subtle bands, skeletons, table headers |
| `--color-text-primary` | headings and important values |
| `--color-text-secondary` | body and descriptions |
| `--color-text-muted` | metadata and helper text |
| `--color-border` | default border |
| `--color-border-strong` | hover/focus-adjacent border |
| `--color-action` | primary interactive color |
| `--color-action-hover` | primary hover |
| `--color-action-soft` | soft interactive background |
| `--color-identity-warm` | small brand mark, not a CTA |
| `--color-success` | confirmed success |
| `--color-warning` | caution |
| `--color-danger` | destructive or failed state |

### 6.2 Recommended Color Values

These values are the target v4 palette. Existing legacy tokens such as `--blue`, `--surface`, and `--text-1` may remain during migration, but new work should map them to the semantic tokens below.

Light mode:

| Token | Value |
|---|---:|
| `--color-bg` | `#F7F8F5` |
| `--color-surface` | `#FEFDF9` |
| `--color-surface-raised` | `#FFFFFC` |
| `--color-surface-muted` | `#EEF3F1` |
| `--color-text-primary` | `#111827` |
| `--color-text-secondary` | `#44515F` |
| `--color-text-muted` | `#697586` |
| `--color-border` | `#DDE5E2` |
| `--color-border-strong` | `#B8C7C2` |
| `--color-action` | `#006D9C` |
| `--color-action-hover` | `#00577D` |
| `--color-action-soft` | `#E4F5FB` |
| `--color-identity-warm` | `#B87522` |
| `--color-success` | `#087443` |
| `--color-warning` | `#B66A00` |
| `--color-danger` | `#C52536` |

Dark mode:

| Token | Value |
|---|---:|
| `--color-bg` | `#070B12` |
| `--color-surface` | `#101720` |
| `--color-surface-raised` | `#172231` |
| `--color-surface-muted` | `#121D29` |
| `--color-text-primary` | `#F2F6F4` |
| `--color-text-secondary` | `#B6C4C8` |
| `--color-text-muted` | `#8798A4` |
| `--color-border` | `#223041` |
| `--color-border-strong` | `#31445A` |
| `--color-action` | `#68C7F6` |
| `--color-action-hover` | `#8AD7FF` |
| `--color-action-soft` | `#0B2A3A` |
| `--color-identity-warm` | `#E3A653` |
| `--color-success` | `#3DDC91` |
| `--color-warning` | `#F8BE57` |
| `--color-danger` | `#FF6B7C` |

### 6.3 Color Rules

1. `--color-action` is for links, active states, primary buttons, focus rings, selected tabs, and progress.
2. `--color-identity-warm` is used sparingly for identity details: a small mark, timeline accent, calendar highlight, or illustration detail. It is never used as a competing CTA color.
3. Dark mode must not be a wall of navy boxes. It needs larger spacing, clearer surface contrast, and fewer visible borders.
4. Avoid pages dominated by one hue family. If the page reads as only dark blue, only beige, only purple, or only gray, revise it.
5. Color never carries meaning alone. Pair it with text, icon, pattern, or position.
6. Do not hardcode hex values in components. Token values live in root theme files.

---

## 7. Shape, Radius, And Surface Identity

Miqatona should have a softer, modern corner language without becoming cartoonish or pill-shaped.

| Token | Value | Use |
|---|---:|---|
| `--radius-xs` | 6px | tooltips, tiny chips |
| `--radius-sm` | 10px | small inline controls |
| `--radius-control` | 14px | buttons, inputs, selects |
| `--radius-card` | 18px | cards and compact panels |
| `--radius-panel` | 22px | major tool panels, result panels |
| `--radius-dialog` | 28px | sheets and dialogs |
| `--radius-pill` | 999px | badges, filter chips, segmented controls only |

Rules:

1. Buttons and inputs use `--radius-control`.
2. Cards use `--radius-card`; major result modules may use `--radius-panel`.
3. Pills are only for small chips and badges, not primary buttons.
4. Same component type uses the same radius on the same page.
5. Large page sections are not rounded unless they are a true interactive workspace.
6. No nested cards. Use spacing, rows, or a single surface.

---

## 8. Elevation And Focus

Elevation communicates layer, not decoration.

| Token | Value | Use |
|---|---|---|
| `--shadow-0` | `none` | flat surfaces |
| `--shadow-1` | `0 1px 2px rgba(17, 24, 39, .06)` | resting card on page background |
| `--shadow-2` | `0 6px 18px rgba(17, 24, 39, .08)` | hover card or sticky header |
| `--shadow-3` | `0 14px 36px rgba(17, 24, 39, .12)` | dropdown, popover, date picker |
| `--shadow-4` | `0 24px 64px rgba(17, 24, 39, .18)` | modal, sheet, command palette |

Dark mode multiplies shadow opacity by 1.4 and uses black as the shadow color.

Rules:

1. A resting card may use either a border or `--shadow-1`, not both strongly.
2. Hover lift must be subtle and must not shift surrounding layout.
3. Focus rings are not shadows and must never be removed.
4. Default focus ring: `0 0 0 3px rgba(0, 109, 156, .28)`.
5. Dark focus ring: `0 0 0 3px rgba(104, 199, 246, .32)`.

---

## 9. Typography And Arabic Reading

Arabic typography is a design pillar. It must be larger, more open, and never letter-spaced.

### 9.1 Arabic Type Scale

| Role | Size | Weight | Line Height |
|---|---:|---:|---:|
| Display | 48px | 700 | 1.15 |
| H1 | 40-44px | 700 | 1.18 |
| H2 | 28-32px | 700 | 1.28 |
| H3 | 21-24px | 600 | 1.42 |
| Body editorial | 18px | 400 | 1.9 |
| Body UI | 17px | 400 | 1.75 |
| Body small | 15px | 400 | 1.65 |
| Caption | 13-14px | 500 | 1.55 |
| Button | 15-16px | 600 | 1.2 |

### 9.2 Arabic Type Rules

1. `letter-spacing: 0` on all Arabic text. No exceptions.
2. Do not justify Arabic body text.
3. Do not use italic Arabic.
4. Arabic body text should not sit below 17px in product UI or 18px in long-form reading.
5. Arabic line length should be 55-65ch for articles and 35-55ch for dense product text.
6. Use `overflow-wrap: break-word` for Arabic text containers.
7. Use `font-variant-numeric: tabular-nums` for clocks, dates, prices, tables, and counters.
8. Phone numbers, URLs, emails, and code are explicitly `dir="ltr"`.

### 9.3 Copy Hierarchy

Each section uses at most three text levels:

1. heading
2. useful description or answer
3. metadata or helper text

If a section needs eyebrow, heading, subheading, description, caption, badge, and helper copy, the section is trying to say too much.

---

## 10. Arabic Voice And Metadata

Arabic copy must sound confident and useful, not translated or keyword-stuffed.

### 10.1 Voice Principles

1. Start with the user's goal, not the site's feature list.
2. Use clear Modern Standard Arabic.
3. Prefer concrete verbs: `اعرف`, `احسب`, `حوّل`, `قارن`, `اختر`, `تابع`.
4. Avoid filler openings: `في هذا المقال`, `من الجدير بالذكر`, `في الختام`.
5. Avoid generic praise: `أفضل`, `الأقوى`, `الأكثر تميزاً` unless there is proof.
6. Do not repeat the page title in the first sentence.
7. Every heading should help the user decide whether to keep reading.

### 10.2 Human Arabic Language Standard

Human Arabic in Miqatona is direct, specific, and light on ceremony.

Use:

- direct second-person phrasing when the page is helping a person choose, calculate, or decide
- short sentences whenever possible
- one idea per paragraph
- active verbs at the start of labels and headings
- everyday Modern Standard Arabic
- familiar search vocabulary from real Arabic users
- concrete context: country, city, date, method, timezone, example, or result
- the answer-first pattern: answer the query, explain the condition, then offer the next step

Avoid:

- inflated claims: `الأفضل على الإطلاق`, `الحل المثالي`, `منصة متكاملة`
- AI filler: `في عالمنا اليوم`, `من الجدير بالذكر`, `لا شك أن`
- keyword strings disguised as headings
- long abstract nouns when a verb is clearer
- repeating the same idea to make a page longer
- translating English idioms literally
- absent-user framing in helpful content: `الزائر يحتاج`, `المستخدم يريد`, `احتمال بقائه`, `نقرة عابرة`
- product-internal phrases that do not help the reader: `مسار واحد`, `هذه التجربة`, `بوابة تجمع` unless the sentence explains a concrete benefit

Sentence test:

If a sentence could appear on any website after replacing the product name, rewrite it.

Direct-reader test:

If the sentence talks about the reader as a third party, rewrite it so it speaks to them directly. Use `تحتاج`, `ابدأ`, `راجع`, `قارن`, `انتبه`, and `اختر` when the page is guiding a decision.

Bad:

`الزائر لا يفكر دائماً باسم الحاسبة، بل يفكر في القرار المالي الذي أمامه.`

Better:

`قد لا تعرف اسم الحاسبة التي تحتاجها. ابدأ من القرار نفسه: قسط قرض، ضريبة فاتورة، خصم، أو مكافأة نهاية خدمة.`

Content should make the reader feel understood, not observed. It must give useful context, examples, and next steps without becoming promotional or inflated.

### 10.3 Arabic Tone By Context

| Context | Tone | Example Direction |
|---|---|---|
| Live time, prayer, date | calm and precise | state the answer first |
| Calculator result | reassuring and practical | explain what the number means |
| Blog/guide | helpful and editorial | answer a real question, then explain |
| Empty state | encouraging | suggest one recovery path |
| Error | calm and specific | say what failed and what to do |
| Privacy/ads | transparent | describe cookies and ads plainly |

Never use humor for errors, finance-related warnings, prayer-time uncertainty, or privacy messages.

### 10.4 Title Formula

Use:

`[قيمة الصفحة أو المهمة] | ميقاتنا`

Avoid:

`[Brand] | [long list of features]`

Bad:

`ميقاتنا | الوقت والصلاة والتاريخ والحاسبات والمناسبات`

Better homepage options:

- `ميقاتنا | وقتك وصلاتك وتقويمك في مكان واحد`
- `ميقاتنا | الوقت ومواقيت الصلاة والتقويم العربي`
- `ميقاتنا | أدوات يومية للوقت والصلاة والتاريخ`

Tool title example:

- `احسب عمرك بالميلادي أو الهجري | ميقاتنا`
- `موعد أذان المغرب اليوم في الرياض | ميقاتنا`
- `الوقت الآن في الدار البيضاء | ميقاتنا`

### 10.5 Meta Description Formula

Use:

`[فعل مباشر] + [نتيجة ملموسة] + [سياق أو ميزة تهم القارئ]`

Example homepage description:

`اعرف الوقت الآن، مواقيت الصلاة، التاريخ الهجري والميلادي، وفروق التوقيت عبر أدوات عربية واضحة وسريعة.`

Rules:

1. Write every title and description in the same language and script as the page.
2. Keep title text concise and unique.
3. Do not duplicate boilerplate across pages.
4. Descriptions must summarize the page, not list keywords.
5. Metadata is written before the page layout because it defines the page promise.

### 10.6 UI Label Rules

Bad labels:

- `اقرأ المزيد`
- `عرض`
- `اضغط هنا`
- `إرسال`

Better labels:

- `اقرأ دليل حساب العمر`
- `اعرض مواقيت هذا الشهر`
- `انتقل إلى تحويل التاريخ`
- `احسب النتيجة`

Buttons use verb + object. Links describe the destination.

### 10.7 Keyword Use Without Keyword Stuffing

Keywords are intent clues, not decorations.

Rules:

1. Start from the user's real Arabic query, not an English translation.
2. Use one primary intent per page.
3. Add related phrases only when they naturally answer sub-questions.
4. Put the main phrase in the title, H1, opening answer, and one relevant H2 when natural.
5. Do not repeat the same phrase in every heading.
6. Do not create near-duplicate pages for tiny query variations.
7. Do not use meta keywords. Google does not use them.
8. Use Search Console, Google autocomplete, internal search logs, and regional language patterns to choose terms.
9. Include novice and expert vocabulary when both are genuinely used by readers.
10. If two terms mean the same thing, choose the user term first and mention the alternate term once.

Arabic keyword map per page:

| Layer | Rule |
|---|---|
| Primary query | appears naturally in title, H1, first answer |
| Secondary query | appears in a section that answers it |
| Regional variant | appears only when the page targets that region |
| Voice/search question | appears as a natural FAQ only if useful |
| Internal anchor | describes the destination, not the keyword we want to rank for |

### 10.8 SEO Content Strength Rules

Every indexable page must provide value beyond a database row or a generated template.

Minimum page strength:

- unique title and meta description
- one H1
- visible answer or tool above generic copy
- contextual explanation written for the page
- self-referencing canonical
- Open Graph metadata
- structured data that matches visible content
- 2 to 5 relevant internal links
- no duplicate boilerplate blocks that make pages indistinguishable
- no hidden text, invisible keyword blocks, or crawler-only content

For pages generated at scale, each page must include at least one of:

- unique city, country, date, timezone, method, or calendar context
- a calculation or table that changes meaningfully for that page
- a localized note
- a source or update explanation
- a practical next step specific to that page

### 10.9 Search Result Promise

The title, meta description, H1, first paragraph, and primary UI must all promise the same thing.

Bad pattern:

- title says prayer time
- H1 says city guide
- first viewport shows unrelated links
- body contains generic SEO copy

Good pattern:

- title says `موعد أذان المغرب اليوم في الرياض`
- H1 says the same intent in natural Arabic
- first viewport shows the time and remaining duration
- method/source appears nearby
- related links continue to monthly prayer table, nearby cities, or Hijri date

---

## 11. Buttons And Interaction Identity

Buttons should feel modern and recognizable without becoming decorative.

### 11.1 Variants

| Variant | Use |
|---|---|
| Primary | one main action in the view |
| Secondary | important alternative action |
| Soft | contextual action related to current surface |
| Ghost | low-emphasis toolbar or inline action |
| Danger | destructive action, always confirmed or undoable |
| Icon | compact tool actions, always with tooltip and `aria-label` |
| Identity | high-value branded CTA on homepage, feature entry, or major result reveal |
| Quiet Link Button | low-friction internal navigation inside prose or related pathways |

### 11.2 Button Dimensions

| Size | Height | Touch Target | Padding |
|---|---:|---:|---:|
| sm | 36px | 44px min | 12px inline |
| md | 44px | 44px min | 18px inline |
| lg | 52px | 52px min | 24px inline |

Arabic labels often need more room. Prefer wrapping or wider buttons over truncating.

### 11.3 Signature Hover

Primary and secondary buttons use the Miqatona signature interaction:

1. hover: `translateY(-1px)`, stronger border, and subtle shadow
2. press: `translateY(0) scale(0.985)`
3. focus: visible 3px focus ring
4. disabled: semantic disabled state, not only opacity
5. loading: spinner inside the button, width unchanged

Optional identity detail: a very subtle edge-light overlay may sweep once on hover for primary buttons only. It must use `transform` or `opacity`, last under 260ms, and respect `prefers-reduced-motion`.

### 11.4 Identity Button System

Miqatona may use a distinctive button style, but only from the approved set below.

| Style | Use | Visual Rules |
|---|---|---|
| `solid-action` | default primary action | action color, white text, `--radius-control`, subtle shadow |
| `warm-identity` | one branded hero or feature CTA | warm identity accent as border or tiny corner glow, not a full orange button |
| `result-action` | action attached to a computed result | surface background, action border, small live/result icon |
| `quiet-path` | internal path inside reading flow | text button with icon, no card wrapper |
| `toolbar-icon` | compact utility action | icon-only allowed only with `aria-label`, tooltip, and 44px hit area |

Rules:

1. Use only one `warm-identity` button per viewport.
2. `warm-identity` is for identity, not conversion pressure.
3. Never invent a new button style in a page component.
4. Buttons in the same action group must share height, radius, and icon style.
5. Primary and identity buttons must use action verbs in Arabic.
6. A button next to an ad slot must have extra spacing so it cannot cause accidental ad clicks.

Never use:

- gradient button fills
- hover effects that move surrounding layout
- two primary buttons side by side
- icon-only buttons without labels
- vague labels such as `إرسال` when the outcome can be named
- buttons styled to resemble ad units
- ad labels styled to resemble app buttons

### 11.5 Button Copy Formula

Use:

`[verb] + [object/result]`

Examples:

- `احسب العمر`
- `اعرض جدول الصلاة`
- `حوّل التاريخ`
- `قارن فرق التوقيت`
- `افتح دليل الحاسبة`
- `امسح الفلاتر`

Avoid:

- `اذهب`
- `ابدأ الآن` unless the next step is truly the start of a flow
- `المزيد`
- `تأكيد` when the action can be named
- `نعم` or `لا` in confirmations

---

## 12. Cards, Panels, And Link Blocks

### 12.1 When A Card Is Allowed

Use a card when the content is:

- a discrete object
- clickable or selectable
- compared side by side
- a result module
- a form/tool panel
- a self-contained data summary

Do not use a card for:

- simple paragraphs
- SEO text
- every internal link
- a section heading and description only
- content already inside another surface

### 12.2 Link Card Rules

Link cards are allowed only when they explain why the destination is useful.

Each link card needs:

- destination title
- one-line reason
- optional metadata: country, tool type, reading time, date, count
- clear clickable area

Never show 12 equal link cards as a default page section. If there are more than 6 links, use search, filters, tabs, or a compact list grouped by intent.

### 12.3 Surface Rhythm

A page should mix:

- open editorial sections
- one or two high-value panels
- compact lists when there are many items
- tables for structured data
- cards only for discrete choices

Do not build a page from card grids alone.

---

## 13. Internal Linking And Discovery

Internal links should create smooth movement between pages, not overwhelm the user.

### 13.1 Link Types

| Type | Placement | Max Count | Purpose |
|---|---|---:|---|
| Contextual inline link | inside article/tool explanation | as needed | answer a nearby question |
| Next best path | after primary task | 3 | continue the journey |
| Related cluster | near page end | 4-6 | explore similar pages |
| Footer taxonomy | footer only | broad | full site navigation |
| Directory/index | dedicated index pages | searchable | browse everything |

### 13.2 Internal Link Rules

1. Every important page must be linked from at least one relevant page.
2. Anchor text must describe the destination.
3. Do not use `اقرأ المزيد` alone.
4. Related links need a reason, not just a title.
5. Do not add all internal links to every page.
6. Link clusters are grouped by user intent, not by database category alone.
7. Internal links use Next.js `Link` and preserve smooth app navigation.
8. For filtered lists, URL state should be shareable when it represents a meaningful view.
9. Link placement must follow the page journey. Put the most useful next path near the task, not all paths at the bottom.
10. Avoid internal-link blocks directly adjacent to ads; they can confuse navigation with monetization.

### 13.3 Pathway Labels

Bad:

`روابط ذات صلة`

Better:

- `إذا كنت تريد ضبط وقت الصلاة`
- `إذا كنت تقارن بين مدينتين`
- `إذا كنت تبحث عن التاريخ الهجري`
- `إذا كنت تخطط قبل افتتاح السوق`

The label should say why the user might go there.

---

## 14. Search, Filters, And Sorting

Search, filters, and sorting are different tools:

- search finds by keyword
- filters narrow by attributes
- sorting changes order within the current results

### 14.1 Filter UX Rules

1. Show the result count near the results header.
2. Show applied filters as removable chips above the results.
3. Provide `مسح الكل` when more than one filter is active.
4. Never show a zero-result state without a recovery path.
5. Use category-specific filters, not the same filters everywhere.
6. For long filter groups, provide search inside the filter group.
7. On desktop, live filtering is allowed when results update in under 1 second.
8. On mobile, use an apply button when live updates would feel jumpy or slow. The button should include the expected count when available.
9. Filter labels use plain Arabic user language, not internal data names.
10. Active filters must remain visible after navigation back.

### 14.2 Blog Listing Pattern

Blog and guide indexes must include:

- prominent search
- topic chips
- applied filter chips
- result count
- sort by newest, most useful, or topic relevance
- article cards with title, clear excerpt, date, updated date when relevant, author, reading time, and topic

Do not start a blog index with a giant grid of equal cards. The first interaction should help the reader narrow the page quickly.

---

## 15. Data Presentation

Every data page should answer first, explain second, and provide raw detail third.

### 15.1 Data Module Anatomy

Important data modules include:

1. primary value
2. plain Arabic label
3. context sentence
4. source or calculation method when relevant
5. timestamp or freshness when relevant
6. next action

Example for prayer:

- value: `المغرب ٦:٤٢ مساءً`
- context: `يتبقى ٣٢ دقيقة حسب طريقة أم القرى`
- action: `اعرض جدول اليوم`

### 15.2 Tables

Tables are for comparison and scanning, not decoration.

Rules:

1. Use real table semantics.
2. Keep headers visible and descriptive.
3. Align numbers with tabular numerals.
4. In RTL, numeric columns align to the logical end.
5. Include empty, loading, and error states.
6. For mobile, use responsive tables or stacked rows only when column comparison is not essential.

### 15.3 Charts

Charts need:

- title that states the insight
- accessible text summary
- tooltip or tap details
- table alternative for important values
- no decorative gradients
- no red/green-only meaning
- reduced-motion support

---

## 16. Blog And Editorial System

### 16.1 Article Structure

Articles and guides use this order:

1. H1 with a useful promise written for the reader, not a keyword list.
2. Subtitle that adds context, audience, or outcome, not a repetition of the H1.
3. Author, publication date, updated date, and reading time.
4. Direct answer in the first 100 words. The reader should not scroll to understand the basic answer.
5. Table of contents for articles over 1000 words.
6. Body sections with question or outcome-based H2s.
7. Examples, tables, comparisons, decision rules, or steps where useful.
8. Trust notes, sources, method, and limitations when claims need support.
9. Related pathways with reasons, not generic `روابط ذات صلة`.

### 16.2 Editorial Layout

1. Article prose max width: 720px.
2. Paragraph gap in Arabic: 22-28px.
3. H2 appears after generous space: 56-72px from previous block.
4. Use callouts sparingly. Maximum 2 strong callouts per article.
5. Do not box every section.
6. Do not use alternating background bands.
7. Images must add information, not generic atmosphere.

### 16.3 Article Copy Rules

1. Apply `.codex/skills/arabic-content-writing/SKILL.md` before writing or rewriting any article, guide, FAQ, or long explanatory section.
2. Speak to the reader directly with `أنت` language. Avoid detached third-person copy unless there is a legal or policy reason.
3. No obvious definitions unless the reader likely needs one. Start with the problem, answer, or decision.
4. No generic intros, transition filler, or formal Arabic that performs authority without explaining.
5. Each H2 answers a real sub-question or promises an outcome the reader can use.
6. Every major section needs at least one concrete example, date, number, local context, method note, exception, or decision rule.
7. Use Feynman-style explanations for technical concepts: simple Arabic first, then the exact term, then an example.
8. Lists must teach. A list where every item is one vague line should become a paragraph, table, checklist, or be removed.
9. End with the next useful action, not a generic conclusion.

### 16.4 Content Brief Requirement

Before publishing a new article, pillar page, landing page, or major tool explanation, define:

1. topic and page type
2. target country or `عموم العالم العربي`
3. search intent
4. primary Arabic keyword and 3 to 5 secondary terms
5. reader's real problem in one sentence
6. CTA or next action
7. related internal tools or pages
8. examples, tables, or proof the page will include

For competitive SEO pages, inspect the top Arabic competitors and document what the page teaches better than them. Do not publish a page that merely restates the same headings in smoother language.

### 16.5 Human Editorial Quality Gate

Before publishing a blog or guide, ask:

1. Would an Arabic reader bookmark or share this because it helped them?
2. Does the first 100 words answer the main search intent?
3. Does the content teach something clearer, deeper, or more practical than the first search result?
4. Are claims sourced, explained, or clearly labeled as method/output from Miqatona tools?
5. Are examples regional or practical enough for Arabic users?
6. Are headings useful when scanned alone?
7. Is any paragraph just padding?
8. Does the copy avoid AI-pattern phrasing and empty helpfulness?
9. Could a native Arabic editor remove awkward phrasing, gender agreement issues, or broken plural errors?
10. Does the reader know what to do next?

If any answer fails, the article is not ready for indexation or AdSense monetization.

---

## 17. Navigation

### 17.1 Global Navigation

The navigation must stay predictable across pages.

Desktop:

- visible top navigation or right-side app navigation, not both at the same hierarchy level
- global search reachable from every page
- active state visible
- breadcrumbs on pages deeper than one level

Mobile:

- top bar for brand, search, and menu
- bottom navigation only for top-level destinations, max 5 items
- touch targets at least 44px, preferably 48px
- no hover-only menus

### 17.2 Arabic Navigation Labels

Use familiar, concise Arabic:

- `الوقت الآن`
- `مواقيت الصلاة`
- `التاريخ`
- `الحاسبات`
- `الأسواق`
- `العطل والمناسبات`
- `المدونة`

Avoid:

- internal labels
- clever labels
- labels that mix Arabic and English without need
- changing the same destination name between pages

---

## 18. Loading, Empty, Error, And Offline States

### 18.1 Loading

Use skeletons shaped like the final content. Do not use a full-page spinner.

Skeletons must:

- reserve the same space as final content
- avoid CLS
- use `aria-busy="true"`
- remove shimmer with reduced motion

### 18.2 Empty States

An empty state answers:

1. what is missing
2. why it may be missing
3. what the user can do next

Bad:

`لا توجد نتائج`

Better:

`لم نجد نتائج بهذه الفلاتر. جرّب إزالة المدينة أو توسيع نطاق التاريخ.`

### 18.3 Error States

Errors must be visible, specific, and recoverable.

Example:

`تعذر تحميل مواقيت الصلاة لهذه المدينة. تحقق من اسم المدينة أو أعد المحاولة.`

Error states must never expose stack traces or raw API messages.

---

## 19. AdSense And Ads Readiness

Miqatona must be built for AdSense approval before any ad code is added.

### 19.1 Site-Level Requirements

Before applying or enabling AdSense:

1. The site has substantial unique Arabic publisher content, not only generated utility pages.
2. Navigation is clear, aligned, readable, and functional on mobile and desktop.
3. Footer includes About, Contact, Privacy Policy, Terms if applicable, and clear site identity.
4. Privacy Policy explains Google advertising cookies and personalized ads choices.
5. No page is under construction, empty, thin, or primarily built to show ads.
6. No copied or embedded content appears without original commentary, curation, or added value.
7. Ads do not appear on error pages, loading pages, search-empty pages with no publisher content, or pure navigation screens.
8. `ads.txt` is planned and maintained once AdSense is approved.

### 19.2 Ad Placement Rules

Ads must never:

- be adjacent to navigation buttons, calculator submit buttons, download-like buttons, or pagination in a way that can cause accidental clicks
- appear under headings like `روابط مفيدة`, `مصادر`, or `اقتراحات`
- be labeled with anything except `إعلان` or `روابط إعلانية`
- mimic cards, internal links, tool results, or app buttons
- overlay content or push the main answer off screen
- appear in pop-ups, pop-unders, forced interstitials, or dead-end screens
- receive arrows, animation, glow, or visual treatment that draws unnatural attention
- outnumber or visually outweigh publisher content

### 19.3 Ad Layout Rules

1. Keep the primary task and first answer ad-free.
2. Place ads after a meaningful content break, not between a label and its answer.
3. Maintain at least 32px vertical space between ads and interactive controls on mobile.
4. Do not put ads inside result panels, calculators, forms, accordions, nav menus, or related-link clusters.
5. Use reserved dimensions to prevent CLS.
6. If an ad fails to load, collapse or reserve space according to the layout plan without leaving a broken box.
7. Ad density must be lower on tool pages than article pages.
8. Reading pages may show ads only after the reader has begun receiving value.

### 19.4 Google Ads Landing Page Readiness

For paid traffic pages:

1. The H1, first answer, CTA, and ad promise must match.
2. Important information appears near the top.
3. The page is fast, mobile-friendly, and easy to navigate.
4. The page provides useful, unique content.
5. The CTA says exactly what happens next.
6. No clutter, pop-ups, or ad-heavy first viewport.
7. Contact, privacy, and site identity are reachable.

---

## 20. Accessibility

Miqatona targets WCAG 2.2 AA as the minimum.

Rules:

1. Normal text contrast at least 4.5:1.
2. UI components and focus indicators at least 3:1 against adjacent colors.
3. All controls have accessible names.
4. Icon-only buttons require `aria-label` and a visible tooltip on hover/focus.
5. Use native buttons, links, inputs, and tables before ARIA.
6. Focus must never be removed.
7. Focus must not be hidden behind sticky headers or bottom bars.
8. Keyboard order follows RTL visual order.
9. All modals trap focus and restore focus on close.
10. All pages include a skip-to-main link: `تجاوز إلى المحتوى الرئيسي`.
11. Do not rely on color alone for status.
12. Do not disable browser zoom.

Touch targets:

- absolute minimum: 44px
- preferred: 48px
- minimum gap between nearby targets: 8px

---

## 21. Motion And Performance

Motion is feedback, not decoration.

### 21.1 Motion Rules

1. Animate only `transform` and `opacity` by default.
2. Avoid animating `width`, `height`, `top`, `left`, `margin`, or `padding`.
3. Respect `prefers-reduced-motion`.
4. Micro-interactions: 120-220ms.
5. Panel open/close: 180-260ms.
6. Exits are faster than entrances.
7. No auto-playing decorative animation in reading pages.

### 21.2 Performance Budgets

1. LCP under 2.5s.
2. CLS under 0.1.
3. INP under 200ms.
4. Visible feedback within 100ms of tap/click.
5. Keep client JS minimal. Do not add `"use client"` to page wrappers without reason.
6. Use Next.js `Image` with width/height for meaningful images.
7. Lazy-load below-fold heavy UI.
8. Do not ship large decorative assets that do not improve user understanding.

---

## 22. Page-Type Blueprints

### 22.1 Homepage

Order:

1. clear product promise and global search/tool entry
2. today's key live modules: time, prayer, date
3. start-here pathways, max 4
4. calculator and holiday highlights based on intent
5. trust and method notes
6. latest useful guides
7. footer taxonomy

Do not show every category as boxes in the first half of the homepage.

SEO/AdSense notes:

- homepage title communicates the site promise, not a keyword dump
- homepage has enough original publisher explanation to show what Miqatona is and why it exists
- no ad slot appears before the main promise and primary entry points

### 22.2 Tool Or Calculator Page

Order:

1. H1 with task promise
2. input/tool panel
3. result panel
4. method explanation
5. related tools based on next task
6. FAQ and edge cases

The calculator is never below generic content.

SEO/AdSense notes:

- include method, assumptions, examples, and related calculations
- do not place ads inside the calculator or result panel
- avoid near-duplicate calculator pages with only label changes

### 22.3 Time, Date, And Prayer Pages

Order:

1. live answer
2. city/country/date controls
3. today table or schedule
4. method/source and timezone context
5. related paths: nearby city, monthly view, converter, difference
6. FAQ

SEO/AdSense notes:

- include timezone, date, method, and freshness context
- city/country pages must contain unique local context
- no ads between a prayer/time label and its value

6. risk and timing explanation

SEO/AdSense notes:

- avoid financial advice claims
- mention data freshness and timezone
- separate informational tools from ads clearly

### 22.5 Holiday/Event Pages

Order:

1. date, countdown, and meaning
2. country/calendar context
3. practical details
4. historical or cultural explanation
5. related events by country or calendar
6. FAQ

SEO/AdSense notes:

- include event meaning, country relevance, calendar conversion, and update date
- avoid generic copied holiday descriptions
- distinguish official dates from expected or calculated dates

### 22.6 Blog And Guides

Index:

1. search and topic filters
2. featured useful guide
3. result list
4. topic pathways

Article:

1. direct answer
2. human explanation
3. examples and details
4. related pathways

SEO/AdSense notes:

- articles need author/reviewer, published date, updated date, sources, and original insight
- ads may appear only after the direct answer and opening value
- avoid articles that simply summarize generic advice

---

## 23. Anti-Patterns

Never ship:

- top-border-only section stacks
- nested cards
- card grids used as the only layout language
- all internal links in boxes on one page
- generic `روابط ذات صلة` without intent
- `اقرأ المزيد` as standalone anchor text
- Arabic keyword-list metadata
- meta keywords
- doorway pages for city/date/query variations that add no unique value
- pages made primarily to display ads
- ad units that look like navigation, result cards, or buttons
- ad labels other than `إعلان` or `روابط إعلانية`
- SEO text above the user's primary task
- decorative gradient text
- purple-blue SaaS gradients
- decorative orbs or bokeh backgrounds
- dark pages where every section is a bordered navy rectangle
- icon-only navigation without labels
- hover-only interaction
- disabled focus rings
- blank loading, empty, or error states
- Arabic letter spacing
- Arabic justified text
- raw hex values in components
- physical CSS properties where logical properties are needed
- AI-generated Arabic published without human editing
- page templates where only the city/date word changes

---

## 24. Design Review Checklist

Before shipping a page or redesign:

- The page was checked against the impeccable reference matrix in section 0.1.
- Arabic copy was checked against `.codex/skills/arabic-content-writing/SKILL.md`.
- The first viewport answers the user's main intent.
- The H1 and metadata are written in strong natural Arabic.
- The page has enough whitespace to read comfortably.
- Any two-column layout passes the section 5.5 acceptance test.
- No decision point forces the user to compare more than four visible choices without grouping or priority.
- No section is separated only by `border-top`.
- Cards are earned and not nested.
- No repeated equal-card grid is used where priority, sequence, or guidance would be clearer.
- Internal links are curated by intent.
- Search/filter/sort controls are clear where needed.
- Applied filters are visible and removable.
- Data modules include context and source/method when needed.
- Loading, empty, error, and offline states are designed.
- All touch targets are at least 44px.
- Focus is visible and not obscured.
- Dark mode has real hierarchy, not just borders.
- Mobile layout is tested at 375px width.
- No content overflows Arabic labels.
- INP-sensitive interactions do little work on click/tap.
- SEO metadata, canonical, Open Graph, and structured data are preserved or improved.
- The page has unique publisher value beyond generated data.
- The first 100 words or first screen teach the user something useful immediately.
- Major explanatory sections include concrete examples, method notes, tables, or decision rules.
- Keyword use sounds natural and does not repeat phrases mechanically.
- AdSense-sensitive pages have clear privacy/contact/about access.
- Ads, if present, cannot be mistaken for navigation, buttons, or related links.
- The page would still be useful if all ads were removed.

---

## 25. Reference Links

- NN/g visual design principles: https://media.nngroup.com/media/articles/attachments/Principles_Visual_Design-Letter.pdf
- NN/g information foraging: https://media.nngroup.com/media/articles/attachments/InformationForaging_SizeLetter.pdf
- NN/g menu design checklist: https://media.nngroup.com/media/articles/attachments/PDF_Menu-Design-Checklist.pdf
- Google helpful content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google SEO starter guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Google Search guidance on generative AI content: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Google guide to optimizing for generative AI search: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google link best practices: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google title link guidance: https://developers.google.com/search/docs/appearance/title-link
- Google snippet/meta description guidance: https://developers.google.com/search/docs/appearance/snippet
- Google Ads landing page guidance: https://support.google.com/google-ads/answer/6238826
- Google Ads Quality Score: https://support.google.com/google-ads/answer/6167118
- Google AdSense site readiness: https://support.google.com/adsense/answer/7299563
- Google AdSense Program policies: https://support.google.com/adsense/answer/48182
- Google AdSense ad placement policies: https://support.google.com/adsense/answer/1346295
- Google AdSense required privacy content: https://support.google.com/adsense/answer/1348695
- Google Publisher Policies: https://support.google.com/publisherpolicies/answer/10502938
- GOV.UK writing for the web: https://www.gov.uk/guidance/content-design/writing-for-gov-uk
- Digital.gov plain language guide: https://digital.gov/guides/plain-language
- NN/g how users read on the web: https://www.nngroup.com/articles/how-users-read-on-the-web/
- Google Android touch target guidance: https://support.google.com/accessibility/android/answer/7101858
- Apple HIG buttons: https://developer.apple.com/design/human-interface-guidelines/buttons
- W3C WCAG 2.2 changes: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- Baymard filter UI best practices: https://baymard.com/learn/ecommerce-filter-ui
- Baymard applied filters overview: https://baymard.com/blog/how-to-design-applied-filters
- web.dev INP optimization: https://web.dev/articles/optimize-inp
- web.dev animation performance: https://web.dev/animations-and-performance/

---

*End of DESIGN.md: Miqatona Design System v4.1*

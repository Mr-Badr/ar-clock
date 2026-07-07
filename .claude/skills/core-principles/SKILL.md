---
name: core-principles
description: "Master ruleset for this production Arabic Next.js SaaS. Use for every task. Enforces: never break production pages, never assume JSON keys, never remove SEO metadata, prefer stability over cleverness, Arabic-first mindset, progressive rendering. Always active — read before any code change."
---

# Core Principles

## 1. Production Safety First
- Never modify a file without reading it completely first
- Never delete a component, route, hook, or data key without tracing every file that imports or depends on it
- When adding a feature risks breaking an existing one, add first and remove old only after verification
- Prefer the boring, explicit solution — clever code fails in unexpected ways in production
- If a change touches a shared layout, a shared component, or a shared utility, treat it as high-risk and trace all consumers before touching it
- One production regression undoes days of progress — caution is always worth the time

## 2. Real Content Over AI-Pattern Text
- Every sentence must serve the reader — not fill space, not signal effort, not pad length
- Google rewards content that demonstrates real experience, genuine expertise, and original insight — it calls this E-E-A-T
- Human content is statistically 8x more likely to rank #1 than AI-generated content without human oversight
- Google's AI systems can identify low-quality AI patterns: vague generalities, repetitive structure, surface-level lists with no supporting depth
- Content that any competitor could have published is not an asset — it is noise
- The bar is not "readable" — the bar is "genuinely useful to the specific person who searched for this"

## 3. SEO Is a Core Product Feature
- A page that cannot be found is a page that does not exist for 90% of potential users
- No page launches without a unique title, meta description, Open Graph block, and canonical tag
- Metadata is written before layout — it defines what the page is, which guides how it should be built
- Never remove existing SEO metadata while refactoring — carry it forward explicitly, then improve it
- Every new route must appear in the sitemap and must be reviewed for indexability intent

## 4. Data Safety Is Non-Negotiable
- Every value from an API, JSON file, database, or URL parameter is untrusted until validated
- A missing key in a JSON response is not an edge case — it is a certainty that will happen in production
- Assume every external data source can return null, undefined, an empty array, an unexpected type, or a completely different shape than expected
- Validate before accessing, guard before rendering, fallback before crashing

## 5. Progressive Rendering — Never a Blank Page
- A blank white page is the worst possible user experience — worse than an error message, worse than a skeleton
- Every page must render something meaningful even when data is delayed, incomplete, or missing
- Section failures must be isolated — one broken component must never bring down the whole page
- Loading, empty, and error states are not optional extras — they are first-class UI requirements

## 6. Arabic-First Always
- This product is built for Arabic readers — every content and layout decision defaults to Arabic
- RTL is not a feature to add after building — it is the base architecture
- Arabic SEO, Arabic typography, Arabic cultural context, and Arabic writing quality are non-negotiable requirements
- Building in English and then translating is the wrong workflow — it creates structural problems that are expensive to fix

## 7. Stability Over Everything
- Experimental APIs, clever abstractions, and new patterns introduce risk — use the stable, documented, widely-adopted approach
- Consistency with what already exists in the codebase is more valuable than personal preference for a different pattern
- When you are unsure whether a change is safe, the answer is: make it smaller, make it more explicit, make it more reversible

## 8. Every Decision Must Be Traceable
- If you change something that affects other parts of the app, note what and why
- If you introduce a new data shape, validate and document the expected structure
- If a page, component, or route is removed, confirm where its traffic will go
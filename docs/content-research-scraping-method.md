# Content Research Scraping Method

This is the implementation checklist for upgrading every important page with SERP-informed Arabic content research.

Status: proposed rollout method, tested locally on 2026-05-25.

## Goal

For each page topic, collect the top visible competitors in Arabic and English, extract the full readable content for each usable competitor, understand their structure and gaps, then rewrite the full page so it is more useful, clearer, more current, and more trustworthy.

The goal is not to copy, lightly rewrite, or patch a few words into existing content. The goal is to use competitors as a research map, then publish original Arabic-first content with better answers, clearer examples, stronger source attribution, stronger user intent coverage, and updated SEO metadata.

## Decision

Use a hybrid research pipeline:

1. Discover top results through a SERP/search API.
2. Fetch competitor pages through a tiered scraper.
3. Extract full readable content, headings, dates, tables, FAQ blocks, schema hints, and metadata.
4. Score extraction quality before trusting the content.
5. Keep research in temporary working context unless a runtime data file already requires it.
6. Rewrite the full page from the research brief, not from copied source text.
7. Update title, meta description, Open Graph copy, schema-facing summary, keywords, internal links, and FAQ where the page model supports them.
8. Trace every changed JSON/data key into the renderer and confirm it appears in user-visible output, schema-visible output, or is removed.
9. Confirm SEO-critical content renders server-side in the initial HTML instead of only after client hydration.
10. Review the full rendered page together before moving to the next page.

## Tool Choice

### Recommended SERP Discovery

Use a SERP API for "top 3 Arabic and top 3 English" discovery. Do not scrape Google result pages directly.

Recommended order:

1. DataForSEO Google Organic SERP API when we need Google-like localized rankings by country, language, and device.
2. Brave Search API when we need lower-cost broad discovery from an independent web index.
3. SerpAPI as a paid alternative if DataForSEO is not available.

Why:

- We need stable ranking metadata, not fragile HTML parsing of search result pages.
- We need Arabic country targeting, English comparison, mobile/desktop selection, and repeatable output.
- Search result scraping creates avoidable blocking and policy risk.

### Recommended Page Fetching

Use a tiered fetcher, with the cheapest reliable layer first:

1. Node `fetch` plus `cheerio`
   - Already fits this repo.
   - Good for normal static pages.
   - Fast and cheap.
2. Scrapling `Fetcher`
   - Best tested fallback for protected static pages.
   - It bypassed a page where Node fetch returned `403`.
   - Keep it in an offline authoring environment, not in Next.js runtime.
3. Existing `puppeteer`
   - Use only when JavaScript rendering is necessary.
   - More expensive and still not always enough for protected pages.
4. Managed fallback such as Firecrawl
   - Use only for pages that repeatedly fail local extraction or when clean markdown is worth the API cost.
   - Do not make it the only path because it creates vendor lock-in and recurring cost.

### Recommended Text Extraction

Use multiple extractors and compare confidence:

1. `trafilatura` for main article text, dates, metadata, and tables.
2. `cheerio` or Scrapling selectors for headings, H1/H2/H3 outlines, tables, and exact visible facts.
3. Manual source review for official facts, dates, money, prayer/time rules, laws, policy, and health/finance claims.

Do not trust one extractor blindly. In the smoke test, `trafilatura` extracted clean text from PublicHolidays and Edarabia, but it picked noisy unrelated text from Timeanddate. That means each extraction must have quality gates.

## Smoke Test Results

The local smoke test used Kuwait National Day pages.

Results:

| Method | Result |
|---|---|
| Node `fetch` + `cheerio` | Worked on 3 of 4 sample pages. Timeanddate returned `403` with a challenge page. |
| Existing `puppeteer` | Reached Timeanddate with `200`, but extracted only a small noisy page body, not enough for reliable research. |
| Scrapling `Fetcher` | Fetched Timeanddate with `200` and exposed the expected title/H1 where Node fetch failed. |
| Scrapling + `trafilatura` | Clean on PublicHolidays and Edarabia. Noisy on Timeanddate, so extraction confidence checks are required. |

Conclusion:

- Scrapling is useful, but it should not replace every layer.
- The best method is not one scraper. It is a tiered fetch and extraction pipeline with confidence scoring.
- For this repo, keep scraping offline and write only validated user-facing improvements into authored content data.

## Research Scope

For holiday events, use the existing runtime research file when the event model depends on it:

```text
src/data/holidays/events/<slug>/research.json
```

For non-holiday pages, do not create dedicated competitor JSON files or private research artifacts unless the user explicitly asks for them or runtime code already imports that file. The output should be the improved visible page content, metadata, FAQ, tables, source links, and internal links.

When a runtime JSON or structured content file is changed, every key must align with the consuming code. Do not add keys that are never rendered, never used for schema, or only preserve internal notes. Static SEO content from those files should be rendered by Server Components or server-rendered page output by default; Client Components are reserved for interaction, forms, filters, calculators, live state, and browser-only APIs.

Minimum working research target per page:

- 3 Arabic competitors
- 3 English competitors
- 3 official or high-authority fact sources when factual claims are important
- 10 primary queries
- 8 concise coverage gaps or opportunities
- 8 keyword or content gaps
- 6 unanswered questions

Keep this research concise. It is a working brief for rewriting, not a committed deliverable.

## Extraction Quality Gate

Mark extraction as low confidence and require manual review or competitor replacement when any of these happen:

- HTTP status is not `200`.
- Extracted text has fewer than 250 useful words for an article/reference page.
- H1 is missing or unrelated to the query.
- The title says "Just a moment", "Access denied", "Attention required", or similar.
- More than half of extracted headings are navigation, footer, newsletter, or unrelated news.
- The extracted first paragraph does not mention the topic.
- The page is PDF-only, paywalled, login-only, or heavily scripted.
- Arabic text is mojibake or directionally broken.

Only high-confidence research should feed content generation automatically.

## Full Rewrite Gate

A page is not complete when only the title, intro, or a few paragraphs changed. A page is complete only when all of these are true:

- the full existing page content was read before editing
- 3 Arabic competitors and 3 English competitors were scraped or explicitly replaced with a reason
- full readable content was extracted for every usable competitor
- competitor gaps and stronger angles were identified before writing
- the page was rewritten section by section, including weak sections removed, missing sections added, and outdated sections replaced
- metadata was updated to match the rewritten page
- FAQ, quick answers, tables, checklists, schema-visible text, and internal links were reviewed
- all changed JSON/data keys are consumed by the renderer and visible to users or schema
- SEO-critical content renders in the initial server HTML and is not hidden behind client-only hydration
- the final page follows Arabic content, SEO, accessibility, data-safety, and Google Ads quality rules where relevant
- validation passed before the page is marked done
- the full changed page is reviewed before starting the next item

## Content Rewrite Rules

Every improved page must include:

- a direct answer in the first 100 words
- Arabic-first phrasing, not translated English structure
- clear source-backed facts where the topic needs factual accuracy
- one stronger user-facing element competitors missed, such as a table, checklist, timeline, decision rule, calculator, direct countdown, country-specific note, or FAQ cluster
- internal links to relevant app pages
- no copied competitor paragraphs
- no generic filler
- no claims without a source when the claim affects planning, money, dates, law, prayer, health, or official status

## Legal And SEO Safety

Follow these rules in the scraper:

- Respect robots.txt where the tool supports it.
- Use a clear user agent.
- Add per-domain delays and concurrency limits.
- Do not bypass paywalls, login walls, or private data.
- Do not store full competitor articles in committed files.
- Store source URLs, facts, headings, short snippets, and gap summaries.
- Raise errors after retries instead of silently publishing incomplete research.
- Never publish scraped or lightly paraphrased content. Google treats scraped or stitched content with little original value as spam risk.

## Implementation Checklist

### Phase 1 - Foundation

- [ ] Pick the SERP provider: DataForSEO for exact Google-localized SERPs, or Brave Search for broad lower-cost discovery.
- [ ] Add required environment variables for the chosen provider.
- [ ] Create an offline content-research tool environment, separate from Next.js runtime.
- [ ] Add typed schemas for search result, fetched page, extraction result, competitor brief, and page research brief.
- [ ] Add structured logging for URL, status code, extraction tool, retry count, word count, and confidence.
- [ ] Add retry policy with warnings, then raise the last error with URL, status, and response context.

### Phase 2 - Page Research Pipeline

- [ ] Inventory target pages from `docs/seo-edit-map.md`.
- [ ] For each page, define Arabic primary keyword, English comparison keyword, country/locale, and page intent.
- [ ] Fetch top 3 Arabic results.
- [ ] Fetch top 3 English results.
- [ ] Filter out irrelevant, duplicate, social, PDF-only, and weak pages unless they are official sources.
- [ ] Extract title, meta description, H1, headings, estimated word count, tables, dates, and main text.
- [ ] Score extraction confidence.
- [ ] Keep concise working notes only for the current rewrite.
- [ ] Save only source links and visible facts that need to appear on the page.

### Phase 3 - Content Brief

- [ ] Identify competitor coverage gaps.
- [ ] List facts that must be verified against official sources.
- [ ] List keyword variants and natural Arabic questions.
- [ ] List competitor weaknesses and missed user needs.
- [ ] Define what our page will add that competitors do not have.
- [ ] Create a page-specific writing brief before rewriting content.
- [ ] Decide which existing sections should be deleted, merged, expanded, or replaced.

### Phase 4 - Full Page Rewrite

- [ ] Read the full current page source before editing.
- [ ] Rewrite the answer summary, intro, main sections, FAQ, tables, checklists, and related links as one coherent page.
- [ ] Delete weak filler sections instead of preserving them.
- [ ] Add missing sections when competitor research shows a real user need.
- [ ] Update title, meta description, keywords, Open Graph copy, schema-facing text, and source links.
- [ ] Confirm the first 100 words answer the main intent directly.
- [ ] Confirm the rewritten content is original and not a stitched competitor paraphrase.

### Phase 5 - Apply To Holidays

- [ ] Start with high-value published events.
- [ ] Backfill every event `research.json` to 6 competitors where possible.
- [ ] Keep old 3-competitor validator minimum until the backfill is complete.
- [ ] After backfill, add a validator warning for fewer than 6 competitors on high-priority events.
- [ ] Run `npm run events:build`.
- [ ] Run `npm run validate:holidays`.

### Phase 6 - Apply To Other Pages

- [ ] Time pages: `/time-now`, country pages, city pages.
- [ ] Prayer pages: `/mwaqit-al-salat`, country pages, city pages.
- [ ] Date pages: today, converter, country date pages.
- [ ] Calculator hubs and detail pages.
- [ ] Blog and guide pages.
- [ ] Trust pages only if they have search intent; do not over-optimize legal pages.

### Phase 7 - QA Before Publishing

- [ ] Confirm no page content is copied from competitors.
- [ ] Confirm official dates and factual claims are source-backed.
- [ ] Confirm the first paragraph answers the main query.
- [ ] Confirm title, meta description, canonical, Open Graph, and schema remain valid.
- [ ] Confirm Arabic reads naturally and avoids generic AI patterns.
- [ ] Run route health checks for changed routes.
- [ ] Run the relevant validation scripts.

## Rollout Checklist

The page-by-page rollout queue lives in [`docs/content-research-rollout-checklist.md`](./content-research-rollout-checklist.md).

## Acceptance Criteria

This method is ready for full rollout when:

- one event page and one non-holiday page have been upgraded through the full pipeline
- each pilot page has 3 Arabic and 3 English competitor records
- extraction confidence is recorded for every competitor
- official facts are separated from competitor observations
- generated content is original and stronger than competitors on at least three concrete points
- validators and route checks pass

## Sources Checked

- Scrapling documentation: https://scrapling.readthedocs.io/
- Scrapling fetcher documentation: https://scrapling.readthedocs.io/en/latest/fetching/static.html
- Scrapling stealth documentation: https://scrapling.readthedocs.io/en/latest/fetching/stealthy.html
- Crawlee documentation: https://crawlee.dev/
- Brave Search API: https://brave.com/search/api/
- DataForSEO Google Organic SERP API: https://docs.dataforseo.com/v3/serp-google-organic-overview/
- Trafilatura documentation: https://trafilatura.readthedocs.io/en/stable/
- Mozilla Readability: https://github.com/mozilla/readability
- Google helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google spam policies for scraped content: https://developers.google.com/search/docs/essentials/spam-policies

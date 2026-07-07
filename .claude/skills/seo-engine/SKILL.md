---
name: seo-engine
description: "SEO rules for every page. Use when writing metadata, generateMetadata, titles, descriptions, Open Graph, structured data, URLs, sitemaps, internal links, or any content page. Covers: Arabic SEO, Core Web Vitals as ranking signals, structured data schemas, GEO for AI search, canonical tags."
---

# SEO Engine Rules

## 1. Every Page Must Be Rank-Ready Before It Goes Live
- A page that is not rank-ready is a liability — it can drag down the domain's overall quality signal
- No page goes to production without a unique title, meta description, canonical tag, Open Graph block, and at least one valid piece of structured data
- Metadata is the first thing written for a new page — it defines the page's purpose and guides its content
- Pages with duplicate or missing metadata are treated by Google as lower quality than their actual content deserves

## 2. Title Rules
- Every title is unique across the entire site — duplicate titles signal duplicate content
- Target 50–60 characters — longer titles are truncated in search results, losing the most important part
- Lead with the primary keyword — Google weights the beginning of the title more heavily
- Write for the human who will read it in search results, not for the algorithm — the title is an ad for the page
- Never keyword-stuff: "أفضل تطبيق | أفضل خدمة | مجاني | سريع" is spam, not a title
- Place the brand name at the end, separated by a dash or pipe — this maximizes keyword space while maintaining identity
- Titles for Arabic pages must be written in Arabic — a page that targets Arabic speakers but has an English title loses credibility and keyword relevance

## 3. Meta Description Rules
- Target 120–155 characters — shorter wastes the space, longer gets cut off
- Write it as a direct answer to the intent of someone who would search for this page
- It is a conversion tool: it must make the user want to click — include a clear value proposition or benefit
- Never repeat the page title inside the description
- Never write in third person — address the reader directly
- Google may rewrite your description if it does not match the page content — the best protection against rewriting is a description that accurately summarizes the page
- Arabic descriptions must sound natural in Arabic — translated English descriptions often read awkwardly and reduce CTR

## 4. Heading Structure
- One H1 per page — the page title — no exceptions
- H2 divides the major sections of the content, H3 divides subsections within an H2
- Never use heading tags for visual styling — use CSS classes for visual weight, heading tags for semantic structure
- Headings must contain the actual topic of the section they introduce — "Section 3" is not a heading
- The H1 must match or closely relate to the page title tag — consistency between these is a ranking signal
- All headings on Arabic pages must be in Arabic

## 5. Content Depth Requirements
- Blog posts and informational pages: minimum 800 words of substantive, non-padded content
- Product and service pages: minimum 500 words explaining specific benefits, use cases, and differentiators
- Category and listing pages: minimum 200 words of contextual text describing what the category contains and who it is for
- Landing pages: minimum 400 words of content — a page that is mostly a form and a headline will be rejected by Google Ads and ranked poorly organically
- Pages under 300 words of meaningful content are considered thin content and can pull the entire domain's quality signal down
- Length without substance is still thin — a 1500-word article that restates the same point twelve times ranks poorly

## 6. Structured Data Is a Ranking Differentiator
- Use `Article` schema on all blog posts and news content — include `headline`, `author`, `datePublished`, `dateModified`, and `image`
- Use `FAQPage` schema on any page that answers questions — this enables FAQ rich results in Google Search
- Use `BreadcrumbList` on any page more than one level deep — this appears in search results and improves click-through
- Use `Organization` or `WebSite` schema on the homepage — this anchors the brand entity in Google's knowledge graph
- Use `Product` schema for product pages with `name`, `description`, `price`, `availability`, and `review` where applicable
- Use `LocalBusiness` schema if the product has a physical or regional presence
- All structured data must exactly match the visible content on the page — misleading structured data triggers manual penalties
- Validate every structured data implementation with Google's Rich Results Test before deploying
- Include `inLanguage: "ar"` in schemas for Arabic content — this tells search engines the content language explicitly

## 7. Internal Linking Strategy
- Every content page must link to at least 2–3 other relevant pages on the same site
- Internal links distribute ranking signals — pages with many internal links pointing to them rank better than orphaned pages
- Anchor text must describe the destination page — "اضغط هنا" or "اقرأ المزيد" as anchor text provides zero SEO value
- High-traffic pages (homepage, category pages) should link down to content pages — this passes authority from strong pages to weaker ones
- Orphan pages — pages with zero internal links pointing to them — will not be crawled or indexed reliably regardless of their content quality
- Use related content sections at the bottom of articles to create natural internal link clusters

## 8. URL and Canonical Rules
- URLs must be human-readable and semantically meaningful — they appear in search results and influence click-through
- Use transliterated or English slugs for Arabic pages — Arabic characters in URLs create encoding issues and look broken when shared
- Never change a URL after it has been indexed without setting up a proper 301 redirect — a URL change without a redirect loses all accumulated ranking signals for that page
- Every page must have a self-referencing canonical tag — this prevents duplicate content issues when pages can be reached via multiple paths
- Canonical tags between language versions must be correct — an Arabic page must canonical to itself, not to the English version

## 9. Sitemap and Robots
- A sitemap must exist, must include all indexable pages, and must be submitted to Google Search Console
- The sitemap must update automatically when pages are added, removed, or modified
- Pages with `noindex` must not appear in the sitemap — search engines see the contradiction as a signal of poor site quality
- Robots.txt must block crawlers from accessing auth pages, admin areas, API routes, and generated utility pages
- Pages that should not be indexed must declare `noindex` in their metadata — never rely on robots.txt alone to prevent indexing

## 10. Core Web Vitals as SEO Signals
- Google uses LCP, CLS, and INP as ranking signals — a slow page with great content ranks below a fast page with equal content
- LCP must be under 2.5 seconds — this is the loading time for the main visible content
- CLS must be under 0.1 — images and fonts must not shift content after it first renders
- INP must be under 200ms — every tap and click must respond immediately
- Measure with real-user field data from Google Search Console, not just Lighthouse lab scores — they measure different things
- Mobile performance matters more than desktop — the majority of Arabic-speaking users browse on mobile, and Google uses mobile-first indexing

## 11. Arabic-Specific SEO Rules
- Arabic keywords are not translated English keywords — the search intent, phrasing, and volume are completely different
- Research keywords from actual Arabic search behavior using Search Console data, Google autocomplete, and regional keyword tools
- Use Modern Standard Arabic (MSA) for broad-audience content — it is understood across all 22 Arabic-speaking countries
- For country-specific targeting, incorporate regional vocabulary and references — Saudi users phrase searches differently from Egyptian or Moroccan users
- Long-tail Arabic queries are extremely valuable — Arabic users search with natural conversational phrases, not keywords
- Ramadan, Eid Al-Fitr, Eid Al-Adha, and national holidays in target countries drive massive seasonal traffic — plan content calendars around them
- Mobile-first is not optional — over 85% of Arabic internet users browse on mobile, and Google indexes the mobile version of every site

## 12. Generative Engine Optimization (GEO)
- AI-powered search (Google AI Overviews, ChatGPT Search) is becoming a primary discovery channel — optimize content to appear in AI-generated answers, not just traditional search results
- AI systems favor content that is structured, fact-dense, explicitly typed with schema, and easy to attribute to a named author or organization
- Lead every page with a direct, single-sentence answer to the most likely question it answers — AI systems extract first-paragraph answers preferentially
- Include real data, real dates, real statistics, and real examples — AI systems prefer content they can cite with confidence
- Maintain author information with expertise signals — AI systems evaluate the credibility of the source, not just the content
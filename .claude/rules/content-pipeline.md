---
paths:
  - src/data/holidays/**
  - scripts/events-*.ts
  - scripts/holiday-batches/**
  - docs/add-new-event.md
---

# Holiday Content Pipeline Rules

## Authoring surface
Edit ONLY these three files per event:
- `src/data/holidays/events/<slug>/package.json` — core data, SEO, FAQs, related slugs
- `src/data/holidays/events/<slug>/research.json` — competitor research notes (never published)
- `src/data/holidays/events/<slug>/qa.json` — QA checklist state

Never touch `src/data/holidays/generated/` — compiled output only.

## After any event edit
```bash
npm run events:build          # compile JSON to generated/
npm run validate:holidays     # check quality warnings
```

## Publish one event end-to-end
```bash
npm run events:new -- --slug <slug> --name "الاسم" --type fixed --category national
# edit package.json, research.json, qa.json
npm run events:sync -- --slug <slug>   # build + validate + go-live
```

## Bulk updates
Use batch files in `scripts/holiday-batches/`, not one-off root scripts:
```bash
npm run events:apply-batch -- --file scripts/holiday-batches/your-batch.ts --build --validate
```

## Content research checklist (before writing any event content)
1. Web search: find top 3 Arabic + top 3 English competitors for the event keyword
2. Run Puppeteer/Cheerio scraper on competitor pages (see `docs/content-research-scraping-method.md`)
3. Read any Ahrefs/GSC CSV in the data directory for current ranking signals
4. Extract: headings outline, FAQ questions asked, date formats used, source citations
5. Write ORIGINAL Arabic-first content — do not copy or lightly rewrite competitors
6. Store only research summaries in `research.json`, never raw competitor text

## Full publish pipeline order
1. `npm run events:new` (scaffold)
2. Edit `package.json` (core, SEO, FAQs, relatedSlugs, countryScope)
3. Fill `research.json` with source URLs and gap notes
4. Fill `qa.json` with QA state
5. `npm run events:build`
6. `npm run validate:holidays:strict`
7. Fix all warnings (especially: faq_below_minimum, seo_meta_description_length_out_of_range, related_not_reciprocal, direct_answer_missing)
8. `npm run events:sync -- --slug <slug>`
9. `npm run ci:check`

## Quality targets for ranking + AI citation
- FAQ: minimum 4 items per event, each answer starts with a direct sentence
- answerSummary: 2-3 sentences, direct answer to the main query, no filler
- metaDescription: 120-155 characters, includes event name + year token + one differentiator
- relatedSlugs: 4-6 slugs, same category or audience, reciprocal links required
- No hardcoded years in copy — use `{{year}}` tokens
- No placeholder text in any published field

## countryScope values
- `"all"` — one canonical event generates country alias pages automatically
- `"none"` with `core._countryCode` — single-country event
- `"none"` without country code — global/international event
# Event Creation — Lessons Learned & Hard Rules

Last updated: 2026-06-24. Derived from: salary-day-uae/kuwait/qatar, pension-day-uae (session 1); ramadan, eid-al-fitr, eid-al-adha, takaful-karama-egypt, Saudi events (session 2).

---

## 0. Golden Rule: Research BEFORE Writing a Single Line

**Never scaffold an event until you have all of the following:**

1. **Top-5 Arabic + top-5 English competitors** scraped/read — headlines, FAQ questions they answer, date formats, gaps, what the current #1 does well
2. **Primary keyword + 10 secondary + 10+ long-tail** phrases listed with realistic intent analysis
3. **The clear winning angle** — one sentence: "We beat the current #1 by doing X that they don't do"
4. **All fact-sourced data** — official source URL for every date rule, payout condition, exception
5. **Winnability Gate passed (§1.1 of the backlog)** — if we can't realistically reach top 3, we don't build

Skipping any of these means shipping a page that won't rank. The validator will pass but Google won't care.

---

## 1. Validator: How `keyword_integration_below_minimum` Actually Works

### The `{{year}}` normalization trap (most common failure)

`normalizeText` uses `.replace(/[^a-z0-9؀-ۿ\s]/g, ' ')`:
- `{}` characters → stripped to space
- **Latin letters a-z are KEPT** — `{{year}}` → `" year "`, `{{nextYear}}` → `" nextyear "`, `{{formattedDate}}` → `" formatteddate "`

So a keyword like `"كم باقي على راتب الإمارات {{year}}"` normalizes to **`"كم باقي على راتب الإمارات year"`**, not `"كم باقي على راتب الإمارات"`.

**The fix:** FAQ questions that correspond to `{{year}}`-suffixed keywords must include `{{year}}` in the question text.

```json
// ❌ keyword "كم باقي على راتب الإمارات {{year}}" won't match this:
{ "question": "كم باقي على راتب الإمارات؟" }

// ✅ works:
{ "question": "كم باقي على راتب الإمارات {{year}}؟" }
```

Similarly, FAQ answers that repeat the keyword phrase should keep `{{year}}` in position:
```json
// ❌ "موعد راتب الإمارات {{year}}" keyword won't match:
{ "answer": "يبقى موعد راتب الإمارات {{nextYear}} مرتبطاً..." }

// ✅ works (use {{year}} where the keyword has {{year}}):
{ "answer": "يبقى موعد راتب الإمارات {{year}} مرتبطاً..., وينطبق نفس المبدأ على راتب الإمارات {{nextYear}}." }
```

### What `collectEventText` collects (the matching surface)

- `answerSummary` — string
- `about.paragraphs` — array joined (most events use `aboutEvent` instead, that's fine)
- `aboutEvent` — **object VALUES only, not keys** — keys like `"ما هو راتب الإمارات؟"` are NOT matched
- `faq` — all `question + answer` concatenated

The `keywords[]` top-level field is NOT collected. Only the fields above contribute to the match count.

### Which phrases qualify for matching

From `uniqueNormalizedPhrases` + `countPhraseMatchesInText`:
- Phrases < 6 characters in length after normalization are **skipped**
- Duplicates after normalization are deduplicated (so `"متى راتب الإمارات"` appearing in both `secondaryKeywords` and `longTailKeywords` counts as one phrase)
- Match = `.includes(normalizedPhrase)` — pure substring match, case-insensitive, after normalization

### Minimum: 5 phrase matches out of all (primary + secondary + longTail)

Count must be ≥ 5 or `keyword_integration_below_minimum:{count}` blocks `events:sync`.

### Debug script to quickly check match count before running the full validator

```js
// Save as a temp file and run with node
import { readFileSync } from 'fs';
import { pickFaqEntries } from './src/lib/holidays/faq-normalizer.js';

function normalizeText(input) {
  return input.toLowerCase()
    .replace(/[^a-z0-9؀-ۿ\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function collectEventText(content) {
  const pieces = [];
  if (content.answerSummary) pieces.push(content.answerSummary);
  if (content.about?.paragraphs?.length) pieces.push(content.about.paragraphs.join(' '));
  if (content.aboutEvent) pieces.push(Object.values(content.aboutEvent).join(' '));
  const faq = pickFaqEntries(content);
  if (faq.length) pieces.push(faq.map(i => `${i.question} ${i.answer}`).join(' '));
  return normalizeText(pieces.join(' '));
}

const pkg = JSON.parse(readFileSync('./src/data/holidays/events/SLUG/package.json', 'utf8'));
const content = pkg.richContent;
const { primaryKeyword, secondaryKeywords, longTailKeywords } = content.seoMeta;
const text = collectEventText(content);

let count = 0;
const allPhrases = [primaryKeyword, ...secondaryKeywords, ...longTailKeywords];
const seen = new Set();
for (const phrase of allPhrases) {
  const norm = normalizeText(phrase);
  if (norm.length < 6 || seen.has(norm)) continue;
  seen.add(norm);
  if (text.includes(norm)) { count++; console.log('✓', norm); }
  else console.log('✗', norm);
}
console.log(`\nTotal: ${count}/5`);
```

---

## 2. Other Validator Rules (quick reference)

| Rule | What triggers it | Fix |
|---|---|---|
| `keyword_integration_below_minimum:N` | < 5 keyword phrases appear as substrings in collected text | Add `{{year}}`-matching FAQ questions; use keyword phrases literally in FAQ answers |
| `seo_meta_description_length_out_of_range:N` | metaDescription < 120 or > 155 chars (raw string including `{{tokens}}`) | Rewrite to hit 120-155 counting the literal token strings (e.g. `{{year}}` = 8 chars, `{{formattedDate}}` = 17 chars) |
| `base_country_leakage:الإمارات` | `aliasSlugs.length > 0` AND a known country name appears in base content | For single-country events: use `"aliasSlugs": []` (never add aliases to country-specific events) |
| `related_not_reciprocal:slug` | Event links to `slug` but that event doesn't link back | **Non-blocking** — `events:sync` passes. Fix when doing bulk maintenance on related slugs. |
| `faq_below_minimum` | Fewer than 4 FAQ entries | Add more FAQ items (target 6-8) |
| `seo_extended_keywords_count_out_of_range:N` | `longTailKeywords` outside 10-24 range | Keep between 10 and 24 entries |
| `islamic_year_pair_missing` | Hijri event missing `{{year}} - {{hijriYear}} هـ` in titleTag | Add the hijri year pair to Islamic event title templates |

---

## 3. Pipeline Checklist (run in this exact order)

```bash
# 1. After editing package.json:
npm run events:build

# 2. Run the debug script above (skip straight to fixing, not guessing)
node /tmp/debug-keywords.mjs

# 3. Strict validation — fix every non-reciprocal and keyword issue:
npm run validate:holidays:strict

# 4. Only then sync:
npm run events:sync -- --slug <slug>

# 5. Full CI gate:
npm run ci:check
```

---

## 4. Content Quality Requirements (for ranking and ad eligibility)

### answerSummary
- Must directly answer the main query in the first sentence — no preamble
- Include the primaryKeyword phrase with `{{year}}` token
- Include "كم باقي على" or "متى ينزل" phrasing naturally
- 3-5 sentences max; avoid marketing filler

### FAQ questions — structure that beats validators AND ranks
- Q1: Restate the primaryKeyword as a direct question with `{{year}}` (e.g. `"متى ينزل راتب الإمارات {{year}}؟"`)
- Q2: "كم باقي على [event] {{year}}؟" — include `{{year}}` to match the keyword
- Q7: "متى [event] {{nextYear}}؟" — this creates `nextyear` in normalized text, matching `{{nextYear}}`-suffixed keywords
- Q7 answer: "يبقى موعد [event] {{year}} مرتبطاً... وينطبق على {{nextYear}}" — uses both tokens
- At least one FAQ answer must contain a keyword phrase with "في [البلد]" pattern
- Minimum 6 FAQs (8 is better)

### aboutEvent
- Only VALUES are collected for keyword matching, not keys
- At least one value should naturally contain a longTail keyword phrase
- Keys are used for display only — make them natural Arabic headings

### Keywords with {{year}} vs {{nextYear}} — token placement map
| Keyword suffix | Must appear in | Token to use |
|---|---|---|
| `{{year}}` | answerSummary OR FAQ Q/A | `{{year}}` |
| `{{nextYear}}` | Q7 question "متى X {{nextYear}}؟" | `{{nextYear}}` |
| `{{year}}` in secondary | FAQ Q2 "كم باقي على X {{year}}؟" | `{{year}}` |

---

## 5. Research-First Template (fill this before creating any event)

```markdown
## Event: [slug] — Pre-Build Research

### Top-5 Arabic Competitors
| Rank | Site | URL | Strengths | Gaps |
|------|------|-----|-----------|------|
| 1 | | | | |
...

### Top-5 English Competitors  
...

### Our Winning Angle
Current #1 = [X]. We beat it by: [specific differentiator].

### Verified Facts
- Date rule: [exact rule with source URL]
- Weekend exception: [if applicable]
- Official source: [URL]

### Keywords — All Confirmed as Real Search Volume
| Phrase | Type | Intent |
|--------|------|--------|
| [primary] | primary | |
| [secondary 1] | secondary | |
...
(minimum: 1 primary + 8 secondary + 10 longTail)

### Winnability Gate (5 questions)
1. Top 3 owner: [answer] → Beatable? [yes/no]
2. Can we be objectively best? [yes/no + how]
3. Rides our unfair advantage? [yes/no]
4. Intent = answer/tool not portal? [yes/no]
5. Arabic SERP thin/fragmented? [yes/no]

### Decision: BUILD / SKIP
Reason: ...
```

---

## 6. Monthly Event Specific Rules

For `"type": "monthly"` events (salary, pension, support payments):

```json
{
  "core": {
    "type": "monthly",
    "day": 25,           // day of month (Gregorian)
    "_countryCode": "ae" // required for country-specific
  }
}
```

- **No aliasSlugs** for single-country monthly events — always `"aliasSlugs": []`
- **No countryScope** expansion — use `"countryScope": "none"`
- Weekend exception rule belongs in `answerSummary` + FAQ Q4/Q5, not just quickFacts
- UAE weekend: Sat+Sun (since Jan 2022)
- Kuwait weekend: Fri+Sat → exception: if day falls on Fri or Sat, pay Thursday
- Qatar weekend: Sat+Sun (since Jan 2022) → same as UAE
- Saudi weekend: Fri+Sat

---

## 7. Common Mistakes to Never Repeat

1. **Don't assume `{{year}}` strips to empty** — it becomes `" year "` after normalization
2. **Don't rely on aboutEvent keys for keyword matching** — only values count
3. **Don't add aliasSlugs to single-country events** — triggers `base_country_leakage`
4. **Don't skip `{{year}}` in Q2 question** — "كم باقي على X؟" won't match "كم باقي على X year" keyword
5. **Don't run validate:holidays without events:build first** — validates stale compiled output
6. **Don't hardcode years in any content field** — use `{{year}}`, `{{nextYear}}`
7. **Don't count "related_not_reciprocal" as a blocker** — it's a warning; events:sync passes anyway
8. **Don't write content without the research template filled** — rankings come from genuine value over competitors, not from passing the validator
9. **`research_fact_sources_below_minimum:N`** — add at least 3 `sources[]` entries with real official URLs; 2 is below minimum. Blocked by `events:sync`.
10. **"لماذا قد يختلف" ≠ "لماذا يختلف"** — "قد" between words breaks phrase matching. The keyword phrase must appear as an exact substring in text. Change the FAQ question to match the keyword exactly, not approximately.
11. **"(مصر)" in keywords strips to "مصر"** — parens removed, so "(مصر)" → "مصر" after normalization. Content must say "X مصر Y" not "X في مصر Y" or "X (مصر) Y" for the phrase to match.
12. **Run the debug script on ALL existing events, not just new ones** — discovered salary-day-saudi was at 6/36 keyword matches despite being live for months. Audit frequently.

---

## 8. Saudi Hub Page Pattern (T2 P1 from backlog)

Built at `/calculators/saudi-pay-dates` — server-rendered info page, no client component needed.

Files touched for any new calculator-style info page:
- `src/lib/calculators/data.js` → add to `_CALCULATOR_ROUTES_RAW`
- `src/lib/calculators/finance-page-content.js` → add to `FINANCE_PAGE_CONTENT`
- `src/lib/seo/calculator-route-manifest.js` → add to `STATIC_CALCULATOR_SEO_ROUTES`
- `src/app/calculators/<slug>/page.jsx` → create the page

The hub renders a static table linking to individual event countdown pages. No client countdown needed on the hub itself — users click through to sub-pages.

Saudi pay schedule (verified from event `core.day` values):

| برنامج | اليوم | التقويم | slug الحدث |
|---|---|---|---|
| راتب حكومي | 27 | ميلادي | salary-day-saudi |
| حساب المواطن | 10 | ميلادي | citizen-account-saudi |
| راتب تقاعد | 1 | ميلادي | pension-day-saudi |
| حافز | 5 | ميلادي | hafez-saudi |
| ضمان اجتماعي | 1 | ميلادي | social-security-saudi |
| دعم سكن | 24 | ميلادي | housing-support-saudi |
| تعويض ساند (GOSI) | 1 | ميلادي | sand-payment-saudi |
| دعم ريف | 1 (نافذة 1–10) | ميلادي | reef-support-saudi |

⚠️ **Slug trap (found 2026-07-05):** `sand-payment-saudi` is NOT "دعم رمل" — no such Saudi program
exists. The slug is a transliteration of **ساند (SANED)**; the event's `core.name` is "ساند (السعودية)"
and its primary keyword is "متى ينزل ساند". This mislabel caused Wave 5 to build a DUPLICATE
`saned-saudi` event targeting the identical query with a conflicting pay day — cannibalizing the
already-ranking page (pos 6). The duplicate was retired to `drafted`; `sand-payment-saudi` is the one
canonical SANED page. **Before scaffolding any Saudi benefit event, grep event names/keywords — not
just slugs — for the program name in Arabic.**

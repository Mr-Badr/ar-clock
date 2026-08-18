/**
 * Shared "what this data does and doesn't mean" disclaimers, used by every
 * CLI in this directory so the wording stays identical everywhere instead of
 * drifting between scripts.
 */

export const SEARCH_CONSOLE_LIMITATIONS = [
  'Search Console reports actual clicks/impressions/position for THIS property\'s ' +
    'appearances in Google Search only — it is not total market search volume for a ' +
    'keyword, and it is not comparable to a keyword-planning tool.',
  'Data has a processing lag: Google documents roughly 2-3 days before a day\'s data is ' +
    `final. Reports request a 28-day window ending 3 days ago (not "today") to avoid ` +
    'showing partial/undercounted recent days.',
  '"Average position" is an impression-weighted average across every ranking position the ' +
    'property held for that query/page in the window — a single high-ranking spike and many ' +
    'low-ranking impressions can average out to a misleading middle number.',
  'Very low-volume query rows can be omitted entirely by Google for anonymization reasons ' +
    '— the API does not guarantee every query that generated an impression appears here, ' +
    'especially for rare/long-tail queries.',
  'CTR and position are Google-reported aggregates, not independently recomputed by these ' +
    'scripts — no values here are invented or estimated when the API returns them.',
  'This is a read-only diagnostic snapshot. Nothing printed here triggers any automatic ' +
    'change to any page, and no classification is a confirmed problem — everything is ' +
    'phrased as an investigation opportunity that still needs human/SERP review.',
];

export const OPPORTUNITY_ENGINE_LIMITATIONS = [
  'The query×page relationship data (dimensions=[query,page]) is fetched with pagination up ' +
    'to 4 pages of 25,000 rows each (100,000 rows max, 4 API calls). If even that ceiling is ' +
    'hit, the report says so explicitly (with the exact row/page counts and a cross-check ' +
    'against `gsc:report`\'s official totals showing the size of the gap) — check that ' +
    'truncation warning each run rather than assuming completeness; whether it triggers ' +
    'depends on the site\'s actual traffic volume at query×page granularity, not on this text.',
  'Page- and query-level totals in this report are DERIVED by aggregating the returned ' +
    'query×page rows (summing clicks/impressions, impression-weighting position). ' +
    'Because Google\'s per-combination anonymization can drop individual low-volume rows ' +
    'that would still count toward a coarser single-dimension total, these derived totals ' +
    'can run slightly below the "official" totals from `npm run gsc:report`. Where a cached ' +
    '`gsc:report` run is available, this report prints the delta so you can see how much was ' +
    'likely lost to trimming/anonymization — it does not guess or fill in the gap.',
  'The "relevance" component of the opportunity score is a crude lexical overlap between the ' +
    'query\'s words and the page URL\'s slug words — not a semantic or topical relevance ' +
    'model. On this Arabic-content/often-English-slug site it will read as low for most rows; ' +
    'that is a known weakness of the signal, not evidence the query and page are unrelated.',
  'Nothing in this report — including the "cannibalization" and flag-D/E page groupings — is ' +
    'an automatic recommendation to merge, redirect, or rewrite anything. Every case needs a ' +
    'human to check actual search intent and the real SERP before any page changes.',
  'Country and device breakdowns are only fetched for the highest-scoring opportunities (to ' +
    'bound API usage), not for every row in this report.',
];

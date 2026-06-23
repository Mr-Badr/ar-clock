/**
 * keyword-suggest.ts
 * Free keyword discovery using Google Autosuggest + DuckDuckGo Suggest.
 * No API keys required. Country-targeted for MENA regions.
 *
 * Usage (internal module): import and call getAllSuggestions().
 */

export const MENA_COUNTRIES: Record<string, string> = {
  dz: 'الجزائر',
  ma: 'المغرب',
  tn: 'تونس',
  sa: 'السعودية',
  eg: 'مصر',
  sy: 'سوريا',
  iq: 'العراق',
  jo: 'الأردن',
  ae: 'الإمارات',
  kw: 'الكويت',
  lb: 'لبنان',
  ly: 'ليبيا',
};

const QUESTION_PREFIXES = [
  'متى', 'كيف', 'هل', 'كم', 'ما', 'لماذا', 'أين',
  'متى تُعلن', 'كيف أستعلم', 'هل يمكن', 'كم باقي على',
  'ما موعد', 'ما هو موعد', 'من يعلن',
];

const INTENT_PREFIXES = [
  'موعد', 'رابط', 'طريقة', 'نتيجة', 'تاريخ', 'إجازة',
  'كم باقي على', 'العد التنازلي',
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Query Google Autosuggest for a specific query + country.
 * Returns the suggestion array (may be empty on failure).
 */
async function getGoogleSuggestions(query: string, country: string): Promise<string[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      hl: 'ar',
      gl: country,
      client: 'firefox',
      output: 'firefox',
    });
    const url = `https://suggestqueries.google.com/complete/search?${params}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; research-bot/1.0)',
        Accept: 'application/json, */*',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Response format: ["query", ["sug1", "sug2", ...], ...]
    return Array.isArray(data[1]) ? (data[1] as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * Query DuckDuckGo Autosuggest as a secondary source.
 */
async function getDuckDuckGoSuggestions(query: string): Promise<string[]> {
  try {
    const url = `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&kl=ar-ar`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; research-bot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map((item: { phrase: string }) => item.phrase) : [];
  } catch {
    return [];
  }
}

export interface SuggestionResult {
  query: string;
  source: string;
  country: string;
}

/**
 * Run all suggestion queries for a seed keyword across multiple countries.
 * Returns deduped list sorted roughly by frequency (first-seen = highest priority).
 */
export async function getAllSuggestions(
  seed: string,
  countries: string[],
  { verbose = false } = {},
): Promise<SuggestionResult[]> {
  const seen = new Map<string, SuggestionResult>();

  const addResult = (query: string, source: string, country: string) => {
    const norm = query.trim().toLowerCase();
    if (!norm || seen.has(norm)) return;
    seen.set(norm, { query: query.trim(), source, country });
  };

  // Build query variants
  const queries: Array<{ q: string; label: string }> = [
    { q: seed, label: 'seed' },
    { q: `${seed} `, label: 'seed+space' },
  ];

  for (const prefix of QUESTION_PREFIXES) {
    queries.push({ q: `${prefix} ${seed}`, label: `question:${prefix}` });
  }
  for (const prefix of INTENT_PREFIXES) {
    queries.push({ q: `${prefix} ${seed}`, label: `intent:${prefix}` });
  }

  // Query Google Autosuggest per country
  for (const country of countries) {
    for (const { q, label } of queries) {
      if (verbose) process.stdout.write(`  ⟳ Google ${country}/${label}...\r`);
      const results = await getGoogleSuggestions(q, country);
      results.forEach((r) => addResult(r, `google:${country}`, country));
      await delay(220);
    }
  }

  // DuckDuckGo for the seed + main question forms (country-independent)
  const ddgQueries = [seed, ...QUESTION_PREFIXES.slice(0, 6).map((p) => `${p} ${seed}`)];
  for (const q of ddgQueries) {
    if (verbose) process.stdout.write(`  ⟳ DuckDuckGo: ${q.slice(0, 30)}...\r`);
    const results = await getDuckDuckGoSuggestions(q);
    results.forEach((r) => addResult(r, 'duckduckgo', 'ar'));
    await delay(180);
  }

  if (verbose) process.stdout.write('\n');

  return Array.from(seen.values());
}

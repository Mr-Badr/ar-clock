// Pan-Arab country/currency list — built for the Zakat tools (a universal religious obligation,
// not a Gulf government program, so it belongs in the "works for the whole Arab world" content
// bucket per docs/PLAN.md §11, distinct from the Gulf-only `GULF_CURRENCIES`
// (src/lib/hvac/gulf-currencies.js) used by GOSI/ZATCA-style government-program calculators).
// Do NOT modify gulf-currencies.js or its 13 other consumers — this is a new, parallel list.
//
// Coverage = the 21-country `PRIORITY_COUNTRY_SLUGS` (src/lib/db/constants.ts, already used for
// time-now/imsakiya/date/country prerendering) + Palestine. `slug` matches PRIORITY_COUNTRY_SLUGS
// exactly so future cross-linking to those pages is a direct lookup, not a translation step.
//
// `fxTrust` is the honest-engineering flag verified via direct curl against open.er-api.com this
// session — all 22 currencies ARE returned by the API (no coverage gap), but not every returned
// rate reflects real local purchasing power:
//   - 'high': official USD rate is a reasonable real-world proxy. Most of these are hard USD pegs
//     (SAR 3.75, AED 3.6725, QAR 3.64, BHD 0.376, OMR ~0.3845 all verified exactly against known
//     pegs); a few float against a stable basket (KWD) or track reasonably (EGP, MAD, TND, DZD*,
//     JOD, IQD, DJF, KMF, MRU).
//   - 'manual': real, documented parallel-market gaps large enough that the "official" API rate
//     could meaningfully mislead someone calculating a religious obligation (LBP, SYP, SDG, YER,
//     LYD). zakat-live-prices.js skips the live fetch for these entirely.
//   - 'watch': shown live, but flagged with a visible caveat (Palestine/ILS; Algeria/DZD for a
//     known, smaller parallel-market spread than the 'manual' tier).
//
// Labels are a curated static array — never derive them via Intl.DisplayNames, a documented real
// SSR/CSR hydration-mismatch risk elsewhere in this codebase.
export const ARAB_CURRENCIES = [
  { code: 'sa', slug: 'saudi-arabia', country: 'السعودية', short: 'ريال', iso: 'SAR', region: 'gulf', fxTrust: 'high' },
  { code: 'ae', slug: 'united-arab-emirates', country: 'الإمارات', short: 'درهم', iso: 'AED', region: 'gulf', fxTrust: 'high' },
  { code: 'kw', slug: 'kuwait', country: 'الكويت', short: 'دينار', iso: 'KWD', region: 'gulf', fxTrust: 'high' },
  { code: 'qa', slug: 'qatar', country: 'قطر', short: 'ريال قطري', iso: 'QAR', region: 'gulf', fxTrust: 'high' },
  { code: 'bh', slug: 'bahrain', country: 'البحرين', short: 'دينار', iso: 'BHD', region: 'gulf', fxTrust: 'high' },
  { code: 'om', slug: 'oman', country: 'عُمان', short: 'ريال عماني', iso: 'OMR', region: 'gulf', fxTrust: 'high' },
  { code: 'ye', slug: 'yemen', country: 'اليمن', short: 'ريال يمني', iso: 'YER', region: 'peninsula', fxTrust: 'manual' },
  { code: 'eg', slug: 'egypt', country: 'مصر', short: 'جنيه', iso: 'EGP', region: 'north-africa', fxTrust: 'high' },
  { code: 'ma', slug: 'morocco', country: 'المغرب', short: 'درهم مغربي', iso: 'MAD', region: 'north-africa', fxTrust: 'high' },
  { code: 'dz', slug: 'algeria', country: 'الجزائر', short: 'دينار جزائري', iso: 'DZD', region: 'north-africa', fxTrust: 'watch' },
  { code: 'tn', slug: 'tunisia', country: 'تونس', short: 'دينار تونسي', iso: 'TND', region: 'north-africa', fxTrust: 'high' },
  { code: 'ly', slug: 'libya', country: 'ليبيا', short: 'دينار ليبي', iso: 'LYD', region: 'north-africa', fxTrust: 'manual' },
  { code: 'mr', slug: 'mauritania', country: 'موريتانيا', short: 'أوقية', iso: 'MRU', region: 'north-africa', fxTrust: 'high' },
  { code: 'jo', slug: 'jordan', country: 'الأردن', short: 'دينار أردني', iso: 'JOD', region: 'levant', fxTrust: 'high' },
  { code: 'lb', slug: 'lebanon', country: 'لبنان', short: 'ليرة لبنانية', iso: 'LBP', region: 'levant', fxTrust: 'manual' },
  { code: 'sy', slug: 'syria', country: 'سوريا', short: 'ليرة سورية', iso: 'SYP', region: 'levant', fxTrust: 'manual' },
  { code: 'ps', slug: 'palestine', country: 'فلسطين', short: 'شيكل', iso: 'ILS', region: 'levant', fxTrust: 'watch' },
  { code: 'iq', slug: 'iraq', country: 'العراق', short: 'دينار عراقي', iso: 'IQD', region: 'levant', fxTrust: 'high' },
  { code: 'sd', slug: 'sudan', country: 'السودان', short: 'جنيه سوداني', iso: 'SDG', region: 'horn', fxTrust: 'manual' },
  { code: 'so', slug: 'somalia', country: 'الصومال', short: 'شلن صومالي', iso: 'SOS', region: 'horn', fxTrust: 'manual' },
  { code: 'dj', slug: 'djibouti', country: 'جيبوتي', short: 'فرنك جيبوتي', iso: 'DJF', region: 'horn', fxTrust: 'high' },
  { code: 'km', slug: 'comoros', country: 'جزر القمر', short: 'فرنك قمري', iso: 'KMF', region: 'horn', fxTrust: 'high' },
];

export const REGION_LABELS = {
  gulf: 'الخليج',
  peninsula: 'شبه الجزيرة العربية',
  'north-africa': 'شمال أفريقيا',
  levant: 'بلاد الشام والعراق',
  horn: 'القرن الأفريقي',
};

// Quick-access subset shown as chips above the full grouped picker (§5.2 of the plan) — the 6 Gulf
// countries (matching the tool's original scope, most of this site's traffic) + Egypt (by far the
// largest Arabic-speaking population + the single highest-volume keyword found, زكاة الذهب).
export const QUICK_CURRENCY_CODES = ['sa', 'ae', 'kw', 'qa', 'bh', 'om', 'eg'];

export function getCurrencyByCode(code) {
  return ARAB_CURRENCIES.find((c) => c.code === code) || ARAB_CURRENCIES[0];
}

export function groupCurrenciesByRegion() {
  const groups = {};
  for (const currency of ARAB_CURRENCIES) {
    if (!groups[currency.region]) groups[currency.region] = [];
    groups[currency.region].push(currency);
  }
  return groups;
}

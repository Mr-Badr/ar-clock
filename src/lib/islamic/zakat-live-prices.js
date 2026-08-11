// Live gold/silver pricing for the Zakat al-Mal calculator's Nisab check — this is a concrete
// "more advanced than any competitor" edge. Even arabtoolbox.com (the deepest real competitor
// found, see keyword-research/zakat-calculator-tracker/DECISION.md) only does live pricing per its
// own selected country; this fetches real spot gold/silver + real Arab exchange rates server-side
// and computes a per-gram, per-purity price for all 22 ARAB_CURRENCIES at once, with honest
// per-currency reliability handling (see `fxTrust` below).
//
// Two free, no-API-key sources (verified working via direct curl before wiring in, 2026-08-10/11):
// - https://gold-api.com — real-time XAU/XAG spot price in USD/troy-oz, CORS-open, ~26s cache.
// - https://www.exchangerate-api.com (open.er-api.com free tier) — USD FX rates, refreshed daily.
//   Verified via direct curl to return all 22 ARAB_CURRENCIES codes, including the harder ones
//   (SYP, YER, SOS, MRU, KMF, DJF, LYD) — coverage is not the problem. Rate *meaning* is: several
//   of these currencies (LBP, SYP, SDG, YER, LYD) have real, large, documented parallel-market gaps
//   where the "official" API rate could meaningfully mislead someone calculating a religious
//   obligation — those are tagged `fxTrust: 'manual'` in arab-currencies.js and skipped here
//   entirely rather than shown as if reliable.
//
// Both fetches are cached for an hour (Nisab checks don't need second-level freshness) and fail
// soft: if either source is unreachable, this returns null and the calculator component falls
// back to a fully manual, editable price field — the page must never break because a third-party
// API is briefly down.
import { ARAB_CURRENCIES } from '@/lib/shared/arab-currencies';

const TROY_OUNCE_GRAMS = 31.1034768;

// Real purity fractions relative to 24-karat (pure) gold — standard karat definition (karat/24).
// 14k and 10k added for parity with real North African/Levant jewelry markets (arabtoolbox.com
// offers 6 karats; the original Gulf-only build only had 4).
export const GOLD_PURITIES = [
  { karat: 24, label: 'عيار 24 (ذهب خالص)', fraction: 1 },
  { karat: 22, label: 'عيار 22', fraction: 22 / 24 },
  { karat: 21, label: 'عيار 21', fraction: 21 / 24 },
  { karat: 18, label: 'عيار 18', fraction: 18 / 24 },
  { karat: 14, label: 'عيار 14', fraction: 14 / 24 },
  { karat: 10, label: 'عيار 10', fraction: 10 / 24 },
];

async function fetchSpotPriceUsd(symbol) {
  try {
    const res = await fetch(`https://api.gold-api.com/price/${symbol}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.price === 'number' && data.price > 0 ? data.price : null;
  } catch {
    return null;
  }
}

async function fetchUsdFxRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.result === 'success' && data?.rates ? data.rates : null;
  } catch {
    return null;
  }
}

/**
 * Returns, per currency code in ARAB_CURRENCIES with fxTrust !== 'manual': gold price per gram at
 * each purity + silver price per gram. Also returns `unpriced`, the list of currency codes
 * deliberately skipped because their fxTrust is 'manual' — callers use this to show a specific,
 * honest reason instead of a generic "price unavailable" for those countries. Returns null on any
 * upstream failure — callers must handle that as "no live data, fall back to manual entry."
 * Deliberately does NOT stamp a `new Date()` timestamp here — Next.js's Cache Components model
 * flags `new Date()` reached without first touching genuinely-uncached data as a prerender error
 * (a real recurring bug class in this project, see project memory), and the revalidated `fetch()`
 * calls above don't count as "uncached" for that check. If an on-page "آخر تحديث" label is ever
 * needed, compute it in the calling Server Component after its own `fetch`/`searchParams` access,
 * not inside this shared helper.
 */
export async function getZakatLivePrices() {
  const [goldUsdPerOz, silverUsdPerOz, fxRates] = await Promise.all([
    fetchSpotPriceUsd('XAU'),
    fetchSpotPriceUsd('XAG'),
    fetchUsdFxRates(),
  ]);

  if (!goldUsdPerOz || !silverUsdPerOz || !fxRates) return null;

  const goldUsdPerGram24k = goldUsdPerOz / TROY_OUNCE_GRAMS;
  const silverUsdPerGram = silverUsdPerOz / TROY_OUNCE_GRAMS;

  const byCountry = {};
  const unpriced = [];
  for (const currency of ARAB_CURRENCIES) {
    if (currency.fxTrust === 'manual') {
      unpriced.push(currency.code);
      continue;
    }
    const fx = fxRates[currency.iso];
    if (!fx) {
      unpriced.push(currency.code);
      continue;
    }
    byCountry[currency.code] = {
      goldPerGramByKarat: Object.fromEntries(
        GOLD_PURITIES.map((p) => [p.karat, goldUsdPerGram24k * p.fraction * fx]),
      ),
      silverPerGram: silverUsdPerGram * fx,
    };
  }

  if (Object.keys(byCountry).length === 0) return null;

  return { byCountry, unpriced };
}

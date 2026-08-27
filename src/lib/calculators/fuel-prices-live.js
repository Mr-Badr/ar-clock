import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { logger, serializeError } from '@/lib/logger';
import { FUEL_PRICE_DATA } from '@/lib/calculators/fuel-prices-data';

/**
 * fuel-prices-live.js — live fetch for ALL fuel-price pages, from a free, no-key, no-registration
 * API (openvan.camp/api/fuel/prices — a "vanlife" side project, CC BY 4.0, 142 countries, weekly
 * updates from real sources: EU Oil Bulletin, EIA, and per-country attributions like "Saudi Aramco
 * (official)"/"UAE Fuel Price Committee"/"WOQOD Qatar"). One call returns every country; verified
 * directly (2026-08-25, real `curl`, not docs) that Saudi and UAE numbers match EXACTLY what was
 * independently researched and cross-checked against the dedicated UAE Fuel Price Committee API.
 *
 * Superseded 2026-08-25: this file used to call the UAE-only uae-fuel-prices-api.vercel.app. That
 * dedicated API is still real and still works, but openvan.camp covers every country this feature
 * needs in one unified call, so the UAE-only integration was retired in favor of this one.
 *
 * REJECTED SOURCES (confirmed unusable, not just assumed) — kept here so this isn't re-attempted:
 *   - oilpriceapi.com: entire Gulf retail-fuel product line returns `commodity_discontinued` for
 *     every country, "zero rows were ever collected" — never worked, not just recently retired.
 *   - fuel.abbara.dev (Saudi-specific hobby API): real live data, but its own labels are wrong —
 *     querying `diesel` returns 4.49 (the real Gasoline-98 price); `gasoline 98` isn't a valid
 *     type at all. Would have meant publishing a false diesel price. Rejected on that basis.
 *
 * WHY THIS IS DEFENSIVE, NOT A BLIND FETCH-AND-TRUST:
 * Still a single small side-project — no SLA, no company behind it. Every failure mode (network
 * error, missing country, implausible price jump) falls back to the static seed in
 * fuel-prices-data.js, and the caller is told exactly which of 3 honest states applies:
 *   1. LIVE — a fetch just succeeded this call.
 *   2. STALE-LIVE — this attempt failed, but an earlier successful fetch is remembered in-process
 *      (module-scope `lastKnownGood`, resets on server restart/redeploy — acceptable, honestly
 *      labeled degradation, not a hidden failure).
 *   3. NEVER-LIVE — no successful fetch yet this process; falls back to the static seed.
 */

const API_URL = 'https://openvan.camp/api/fuel/prices';
// A real monthly change has historically been small (largest seen: ~6% in one month for UAE).
// 40% is a generous ceiling that only exists to catch a garbled response, not flag genuine
// volatility — set a bit looser than the UAE-only integration's 35% since this now also covers
// Morocco, whose liberalized/market-set prices move more often and can jump further in one read.
const MAX_PLAUSIBLE_CHANGE_RATIO = 0.4;

// In-process memory of the last successful live fetch, PER COUNTRY — see file header.
const lastKnownGood = new Map();

function extractCountryGrades(raw, seedGrades) {
  if (!raw?.prices) return null;
  const grades = [];
  for (const seed of seedGrades) {
    const price = raw.prices[seed.sourceKey];
    if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) return null;
    const ratio = Math.abs(price - seed.price) / seed.price;
    if (ratio > MAX_PLAUSIBLE_CHANGE_RATIO) return null;
    const changeRaw = raw.price_changes?.[seed.sourceKey];
    grades.push({
      grade: seed.grade,
      label: seed.label,
      price: Math.round(price * 10000) / 10000,
      changeFromLastMonth: typeof changeRaw === 'number' ? Math.round(changeRaw * 10000) / 10000 : null,
    });
  }
  return grades;
}

/**
 * Fetches live data for ONE country. Internally fetches the whole API response (openvan.camp
 * returns all countries in one payload; Next's fetch cache + this module's own cacheLife wrapper
 * below mean this only hits the network roughly once a day, not once per country per request).
 */
export async function fetchFuelPricesLive(countryCode) {
  const seed = FUEL_PRICE_DATA[countryCode];
  if (!seed) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      logger.warn('fuel-prices-live-fetch-failed', { status: res.status, countryCode });
      return fallbackResult(countryCode, seed);
    }

    const json = await res.json();
    const raw = json?.data?.[countryCode.toUpperCase()];
    const grades = extractCountryGrades(raw, seed.grades);
    if (!grades) {
      logger.warn('fuel-prices-live-parse-failed', { countryCode, hadEntry: Boolean(raw) });
      return fallbackResult(countryCode, seed);
    }

    const result = {
      ...seed,
      grades,
      isLive: true,
      lastLiveAt: new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
      sourceLabel: 'openvan.camp Fuel Prices API' + (raw.sources?.length ? ` — ${raw.sources.join('، ')}` : ''),
      sourceUrl: 'https://openvan.camp/en/developers',
    };
    lastKnownGood.set(countryCode, result);
    return result;
  } catch (error) {
    logger.warn('fuel-prices-live-fetch-error', { countryCode, error: serializeError(error) });
    return fallbackResult(countryCode, seed);
  }
}

function fallbackResult(countryCode, seed) {
  const good = lastKnownGood.get(countryCode);
  return good
    ? { ...good, isLive: false, lastLiveAt: good.fetchedAt }
    : { ...seed, isLive: false, lastLiveAt: null };
}

/**
 * Cached wrapper — every fuel-price page calls THIS, never fetchFuelPricesLive() directly, so
 * every country shares one real fetch per cache window instead of one per page. Same 'daily-ish'
 * freshness profile as next.config.js's fuelPricesDaily cacheLife.
 */
export async function getFuelPricesLive(countryCode) {
  'use cache';
  cacheTag(`fuel-prices-live-${countryCode}`);
  cacheLife('fuelPricesDaily');
  return fetchFuelPricesLive(countryCode);
}

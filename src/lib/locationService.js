/**
 * src/lib/locationService.js
 *
 * NEW: All data comes from the normalized countries + cities DB tables.
 * The same function signatures are preserved so callers don't need changes.
 *
 * Resolution pipeline for city lookups:
 *   1. cities-index.json fallback  — built at build time, ZERO latency
 *   2. Supabase DB via new queries  — cached with 'use cache' / cacheLife
 *   3. Nominatim geocode fallback   — for unknown cities only
 */

import { getCountryBySlug, getAllCountries }                           from '@/lib/db/queries/countries';
import { getCityBySlug, getTopCitiesByCountry, getCapitalCity,
         searchCities as dbSearchCities, getAllCityParams }            from '@/lib/db/queries/cities';
import { supabase }                                                    from '@/lib/supabase/server';
import citiesFallback                                                  from '@/lib/db/fallback/cities-index.json';

/* ── In-memory index from build-time fallback for O(1) lookups ─────────── */
const FALLBACK_INDEX = new Map(
  citiesFallback.map(c => [`${c.country_code?.toLowerCase()}::${c.city_slug}`, c])
);

/* ── COUNTRY_CODE_TO_SLUG — used by geo-IP detection ───────────────────── */
export const COUNTRY_CODE_TO_SLUG = {
  EG: 'egypt',            SA: 'saudi-arabia',     AE: 'uae',
  MA: 'morocco',          DZ: 'algeria',           TN: 'tunisia',
  LY: 'libya',            SD: 'sudan',             KW: 'kuwait',
  QA: 'qatar',            BH: 'bahrain',           OM: 'oman',
  IQ: 'iraq',             JO: 'jordan',            LB: 'lebanon',
  SY: 'syria',            PS: 'palestine',         YE: 'yemen',
  SO: 'somalia',          DJ: 'djibouti',          MR: 'mauritania',
  US: 'united-states',    GB: 'united-kingdom',    FR: 'france',
  DE: 'germany',          TR: 'turkey',            JP: 'japan',
  CN: 'china',            IN: 'india',             BR: 'brazil',
  RU: 'russia',           AU: 'australia',         CA: 'canada',
  IT: 'italy',            ES: 'spain',             NG: 'nigeria',
  ZA: 'south-africa',     PK: 'pakistan',          BD: 'bangladesh',
  ID: 'indonesia',        MX: 'mexico',            KR: 'south-korea',
  PH: 'philippines',      TH: 'thailand',          VN: 'vietnam',
  KE: 'kenya',            ET: 'ethiopia',          GH: 'ghana',
  TZ: 'tanzania',         SG: 'singapore',         MY: 'malaysia',
  IL: 'israel',           IR: 'iran',              AF: 'afghanistan',
  NL: 'netherlands',      BE: 'belgium',           SE: 'sweden',
  NO: 'norway',           DK: 'denmark',           FI: 'finland',
  CH: 'switzerland',      AT: 'austria',           PL: 'poland',
  PT: 'portugal',         GR: 'greece',            UA: 'ukraine',
  AR: 'argentina',        CL: 'chile',             CO: 'colombia',
  NZ: 'new-zealand',      NE: 'niger',             TD: 'chad',
  ML: 'mali',             SN: 'senegal',           CM: 'cameroon',
};

/* ── Normalise a city row from either schema to a consistent shape ──────── */
function normalise(city, countrySlug = '') {
  if (!city) return null;
  return {
    // New schema fields
    id:           city.id,
    country_code: city.country_code,
    city_slug:    city.city_slug,
    name_ar:      city.name_ar,
    name_en:      city.name_en,
    lat:          city.lat,
    lon:          city.lon,
    timezone:     city.timezone,
    population:   city.population,
    priority:     city.priority,
    is_capital:   city.is_capital,
    // Legacy-compat aliases so old callers keep working
    country_slug:    countrySlug || city.country_slug || '',
    country_name_ar: city.country_name_ar || '',
    city_name_ar:    city.name_ar,
    city_name_en:    city.name_en,
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   findCityBySlug — primary entry point
   ══════════════════════════════════════════════════════════════════════════ */
export async function findCityBySlug(countrySlug, citySlug) {
  // 1. Build-time fallback (zero latency)
  // Look up by country_code if we have the mapping
  const country = await getCountryBySlug(countrySlug).catch(() => null);
  if (country) {
    // Try DB first (cached)
    const city = await getCityBySlug(country.country_code, citySlug).catch(() => null);
    if (city) return normalise(city, countrySlug);
  }

  // 2. Scan fallback index by country_slug match
  for (const [, c] of FALLBACK_INDEX.entries()) {
    if (c.city_slug === citySlug && (c.country_slug === countrySlug || c.country_code?.toLowerCase() === countrySlug)) {
      return normalise(c, countrySlug);
    }
  }

  // 3. Nominatim geocode as last resort
  return geocodeAndReturn(countrySlug, citySlug);
}

async function geocodeAndReturn(countrySlug, citySlug) {
  const q = encodeURIComponent(`${citySlug.replace(/-/g, ' ')}, ${countrySlug.replace(/-/g, ' ')}`);
  try {
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&accept-language=ar`,
      { headers: { 'User-Agent': 'ar-clock/1.0' }, next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.length) return null;
    const hit = json[0];
    return {
      country_slug: countrySlug, city_slug: citySlug,
      name_ar: hit.display_name.split(',')[0].trim(),
      name_en: hit.display_name.split(',')[0].trim(),
      city_name_ar: hit.display_name.split(',')[0].trim(),
      city_name_en: hit.display_name.split(',')[0].trim(),
      lat: parseFloat(hit.lat), lon: parseFloat(hit.lon),
      timezone: 'UTC', population: 0, priority: 0, is_capital: false,
    };
  } catch { return null; }
}

/* ══════════════════════════════════════════════════════════════════════════
   getCapitalByCountrySlug
   ══════════════════════════════════════════════════════════════════════════ */
export async function getCapitalByCountrySlug(countrySlug) {
  const country = await getCountryBySlug(countrySlug).catch(() => null);
  if (country) {
    const capital = await getCapitalCity(country.country_code).catch(() => null);
    if (capital) return normalise(capital, countrySlug);
    // No capital flag? return first top city
    const top = await getTopCitiesByCountry(country.country_code, 1).catch(() => []);
    if (top[0]) return normalise(top[0], countrySlug);
  }
  // Fallback: scan cities-index.json
  const candidates = citiesFallback.filter(c => c.country_slug === countrySlug || c.country_code?.toLowerCase() === countrySlug);
  if (candidates.length === 0) return null;
  const capital = candidates.find(c => c.is_capital);
  return normalise(capital || candidates.sort((a, b) => (b.priority || 0) - (a.priority || 0))[0], countrySlug);
}

/* ══════════════════════════════════════════════════════════════════════════
   getTopCitiesForCountry
   ══════════════════════════════════════════════════════════════════════════ */
export async function getTopCitiesForCountry(countrySlug, limit = 12) {
  const country = await getCountryBySlug(countrySlug).catch(() => null);
  if (country) {
    const cities = await getTopCitiesByCountry(country.country_code, limit).catch(() => []);
    if (cities.length > 0) return cities.map(c => normalise(c, countrySlug));
  }
  // Fallback
  return citiesFallback
    .filter(c => c.country_slug === countrySlug || c.country_code?.toLowerCase() === countrySlug)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, limit)
    .map(c => normalise(c, countrySlug));
}

/* ══════════════════════════════════════════════════════════════════════════
   searchCities — passthrough to new DB query
   ══════════════════════════════════════════════════════════════════════════ */
export async function searchCities(query, limit = 10) {
  return dbSearchCities(query, limit);
}

/* ══════════════════════════════════════════════════════════════════════════
   getCountries — passthrough to new DB query
   ══════════════════════════════════════════════════════════════════════════ */
export async function getCountries() {
  return getAllCountries();
}

/* ══════════════════════════════════════════════════════════════════════════
   getTopCountrySlugs — uses getAllCityParams from new DB layer
   ══════════════════════════════════════════════════════════════════════════ */
export async function getTopCountrySlugs() {
  try {
    const params = await getAllCityParams();
    const seen   = new Set();
    return params
      .filter(p => { if (seen.has(p.country)) return false; seen.add(p.country); return true; })
      .map(p => ({ country: p.country }));
  } catch {
    // Fallback: derive from cities-index.json
    const seen = new Set();
    return citiesFallback
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .filter(c => c.country_slug && !seen.has(c.country_slug) && seen.add(c.country_slug))
      .map(c => ({ country: c.country_slug }));
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   getTopCitySlugs — high-priority city param pairs
   ══════════════════════════════════════════════════════════════════════════ */
export async function getTopCitySlugs() {
  try {
    return getAllCityParams();
  } catch {
    const seen = new Set();
    return citiesFallback
      .filter(c => (c.priority || 0) >= 80)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .filter(c => {
        const k = `${c.country_slug}::${c.city_slug}`;
        if (seen.has(k)) return false;
        seen.add(k); return true;
      })
      .slice(0, 500)
      .map(c => ({ country: c.country_slug, city: c.city_slug }));
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   findNearestCity — Haversine over cities-index.json then DB RPC
   ══════════════════════════════════════════════════════════════════════════ */
export async function findNearestCity(lat, lon) {
  const getDist = (la1, lo1, la2, lo2) => {
    const R = 6371, dLat = (la2 - la1) * Math.PI / 180, dLon = (lo2 - lo1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  let nearest = null, minDist = Infinity;
  for (const city of citiesFallback) {
    const d = getDist(lat, lon, city.lat, city.lon);
    if (d < minDist) { minDist = d; nearest = city; }
  }

  // If fallback match is too far, try DB
  if (minDist > 5) {
    try {
      const { data } = await supabase.rpc('find_nearest_cities', { user_lat: lat, user_lon: lon, lim: 1 });
      if (data?.length) {
        const db = data[0];
        const dbDist = getDist(lat, lon, db.lat, db.lon);
        if (dbDist < minDist) { minDist = dbDist; nearest = db; }
      }
    } catch {}
  }

  return nearest ? normalise(nearest, nearest.country_slug || '') : null;
}

/* ══════════════════════════════════════════════════════════════════════════
   Utility helpers — no data dependency on old schema
   ══════════════════════════════════════════════════════════════════════════ */

/** Top N cities from build-time fallback by priority */
export function getTopSeedCities(n = 100) {
  return [...citiesFallback]
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, n);
}

/** Find city by IANA timezone from fallback data */
export function mapTimezoneToCityFromSeed(tz) {
  const direct = citiesFallback.find(c => c.timezone === tz && (c.priority || 0) >= 90);
  if (direct) return normalise(direct, direct.country_slug || '');
  const any = citiesFallback.find(c => c.timezone === tz);
  return any ? normalise(any, any.country_slug || '') : null;
}

/** Detect country / city from Vercel edge headers */
export function detectGeoFromHeaders(request) {
  const h = request.headers;
  return {
    countryCode: h.get('x-vercel-ip-country')       ?? null,
    regionCode:  h.get('x-vercel-ip-country-region') ?? null,
    cityName:    h.get('x-vercel-ip-city')           ?? null,
    timezone:    h.get('x-vercel-ip-timezone')        ?? null,
    ip:          h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
  };
}

export function getTimeDataForTimezone(tz) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: tz, hour: '2-digit', hour12: false,
    minute: '2-digit', second: '2-digit',
  }).formatToParts(now);
  const get = (t) => parseInt(parts.find(p => p.type === t)?.value ?? '0', 10);
  return {
    hours: get('hour'), minutes: get('minute'), seconds: get('second'),
    dateStrAr:    new Intl.DateTimeFormat('ar', { timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now),
    dateStrHijri: new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now),
    tzLabel:      new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'long' }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? '',
    utcOffset:    new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? '',
    ianaTimezone: tz,
  };
}

export function getUtcOffsetStr(tz) {
  return new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' })
    .formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value ?? 'UTC';
}

export function getCountriesWithSameOffset(ianaTimezone) {
  // Kept for API compat — not used in prerendered pages, safe for runtime
  const now       = new Date();
  const offsetStr = new Intl.DateTimeFormat('en', { timeZone: ianaTimezone, timeZoneName: 'shortOffset' })
    .formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? 'UTC';

  return citiesFallback
    .filter(c => {
      try {
        const o = new Intl.DateTimeFormat('en', { timeZone: c.timezone, timeZoneName: 'shortOffset' })
          .formatToParts(now).find(p => p.type === 'timeZoneName')?.value;
        return o === offsetStr && c.timezone !== ianaTimezone;
      } catch { return false; }
    })
    .slice(0, 8)
    .map(c => ({ country_slug: c.country_slug, country_name_ar: c.country_name_ar || '' }));
}

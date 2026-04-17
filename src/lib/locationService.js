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

import { getCountryBySlug, getCountryByCode }                          from '@/lib/db/queries/countries';
import { getCityBySlug, getTopCitiesByCountry, getCapitalCity, getCitiesByCountry,
         searchCities as dbSearchCities, getAllCityParams }            from '@/lib/db/queries/cities';
import { findNearestCitiesViaLiveSource }                              from '@/lib/db/live-geo-source';
import { lookupIpGeo }                                                 from '@/lib/ip-lookup';
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

const MAX_COUNTRY_HINT_DISTANCE_KM = 750;

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
      const data = await findNearestCitiesViaLiveSource(lat, lon, 1);
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
  const matches = citiesFallback.filter(c => c.timezone === tz);
  if (!matches.length) return null;

  const countries = new Set(matches.map(c => c.country_slug || c.country_code || ''));
  if (countries.size === 1) {
    const capital = matches.find(c => c.is_capital);
    if (capital) return normalise(capital, capital.country_slug || '');
  }

  const rankedPool = matches.some(c => (c.priority || 0) >= 90)
    ? matches.filter(c => (c.priority || 0) >= 90)
    : matches;

  const ranked = [...rankedPool].sort((a, b) =>
    Number(Boolean(b.is_capital)) - Number(Boolean(a.is_capital)) ||
    (b.priority || 0) - (a.priority || 0) ||
    (b.population || 0) - (a.population || 0)
  );

  return ranked[0] ? normalise(ranked[0], ranked[0].country_slug || '') : null;
}

function normalizeLooseText(s = '') {
  return String(s || '')
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ؤئ]/g, 'ء')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sortRepresentativeCities(a, b) {
  return Number(Boolean(b.is_capital)) - Number(Boolean(a.is_capital))
    || (b.priority || 0) - (a.priority || 0)
    || (b.population || 0) - (a.population || 0);
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestInPool(lat, lon, cities) {
  let nearest = null;
  let minDist = Infinity;

  for (const city of cities) {
    if (typeof city.lat !== 'number' || typeof city.lon !== 'number') continue;
    const distance = getDistanceKm(lat, lon, city.lat, city.lon);
    if (distance < minDist) {
      minDist = distance;
      nearest = city;
    }
  }

  return {
    city: nearest,
    distanceKm: minDist,
  };
}

function findCityByNameInPool(cities, cityName) {
  const query = normalizeLooseText(cityName);
  if (!query) return null;

  const ranked = cities
    .map((city) => {
      const names = [
        city.name_ar,
        city.name_en,
        city.city_name_ar,
        city.city_name_en,
        String(city.city_slug || '').replace(/-/g, ' '),
      ]
        .map(normalizeLooseText)
        .filter(Boolean);

      let score = -1;
      for (const name of names) {
        if (name === query) score = Math.max(score, 100);
        else if (name.startsWith(query)) score = Math.max(score, 80);
        else if (name.includes(query)) score = Math.max(score, 60);
      }

      return { city, score };
    })
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score || sortRepresentativeCities(a.city, b.city));

  return ranked[0]?.city || null;
}

function pickRepresentativeCity(cities, timezone = '') {
  const sameTimezone = timezone
    ? cities.filter((city) => city.timezone === timezone)
    : [];
  const pool = sameTimezone.length ? sameTimezone : cities;
  return [...pool].sort(sortRepresentativeCities)[0] || null;
}

export async function detectBestCityMatch({ lat, lon, timezone, countryCode, cityName } = {}) {
  const normalizedCountryCode = String(countryCode || '').trim().toUpperCase();
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lon);

  let country = null;
  let countrySlug = '';
  let countryCities = [];

  if (normalizedCountryCode) {
    country = await getCountryByCode(normalizedCountryCode).catch(() => null);
    countrySlug = country?.country_slug || COUNTRY_CODE_TO_SLUG[normalizedCountryCode] || '';
    countryCities = await getCitiesByCountry(normalizedCountryCode).catch(() => []);
    if (!countryCities.length) {
      countryCities = citiesFallback.filter(
        (city) => city.country_code?.toUpperCase() === normalizedCountryCode,
      );
    }

    if (cityName) {
      const nameMatch = findCityByNameInPool(countryCities, cityName);
      if (nameMatch) return normalise(nameMatch, countrySlug);
    }

    if (hasCoords && countryCities.length) {
      const nearestInCountry = findNearestInPool(lat, lon, countryCities);
      if (
        nearestInCountry.city &&
        Number.isFinite(nearestInCountry.distanceKm) &&
        nearestInCountry.distanceKm <= MAX_COUNTRY_HINT_DISTANCE_KM
      ) {
        return normalise(nearestInCountry.city, countrySlug);
      }
    }

    if (timezone && countryCities.length) {
      const sameTimezoneCities = countryCities.filter((city) => city.timezone === timezone);
      const representative = pickRepresentativeCity(sameTimezoneCities, timezone);
      if (representative) return normalise(representative, countrySlug);
    }
  }

  if (hasCoords) {
    const nearest = await findNearestCity(lat, lon);
    if (nearest) return nearest;
  }

  if (timezone) {
    const timezoneCity = mapTimezoneToCityFromSeed(timezone);
    if (timezoneCity) return timezoneCity;
  }

  if (countrySlug) {
    const capital = await getCapitalByCountrySlug(countrySlug).catch(() => null);
    if (capital) return capital;

    if (countryCities.length) {
      const representative = pickRepresentativeCity(countryCities, timezone);
      if (representative) return normalise(representative, countrySlug);
    }
  }

  return null;
}

function getForwardedIp(headersLike) {
  const forwarded = headersLike?.get?.('x-forwarded-for') || '';
  return forwarded.split(',')[0]?.trim() || '';
}

function isLookupableIp(ip) {
  if (!ip) return false;
  if (ip === '::1' || ip === 'localhost') return false;
  if (ip.startsWith('127.') || ip.startsWith('10.') || ip.startsWith('192.168.')) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return false;
  if (/^(fc|fd|fe80)/i.test(ip)) return false;
  return true;
}

export async function resolveRequestLocationFromHeaders(headersLike) {
  const headerTimezone =
    headersLike?.get?.('x-vercel-ip-timezone') ||
    headersLike?.get?.('x-timezone') ||
    headersLike?.get?.('cf-timezone') ||
    null;

  const headerCountryCode =
    headersLike?.get?.('x-vercel-ip-country') ||
    headersLike?.get?.('cf-ipcountry') ||
    null;

  const headerCityName = headersLike?.get?.('x-vercel-ip-city') || null;
  const ip = getForwardedIp(headersLike);

  let ipGeo = null;
  if (isLookupableIp(ip)) {
    ipGeo = await lookupIpGeo(ip, {
      fields: ['status', 'countryCode', 'city', 'lat', 'lon', 'timezone'],
      revalidate: 3600,
    }).catch(() => null);
  }

  return detectBestCityMatch({
    lat: ipGeo?.lat,
    lon: ipGeo?.lon,
    timezone: headerTimezone || ipGeo?.timezone || undefined,
    countryCode: headerCountryCode || ipGeo?.countryCode || undefined,
    cityName: headerCityName || ipGeo?.city || undefined,
  });
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
    dateStrAr:    new Intl.DateTimeFormat('ar-u-nu-latn', { timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now),
    dateStrHijri: new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', { timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now),
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

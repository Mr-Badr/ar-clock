'use client';

import { detectBestCityAction } from '@/app/actions/location';

const LOCATION_CACHE_KEY = 'waqt-user-location-v1';
const LOCATION_CACHE_VERSION = 1;

const LOCATION_CACHE_TTL_MS = {
  gps: 30 * 60 * 1000,
  ip: 60 * 60 * 1000,
  timezone: 12 * 60 * 60 * 1000,
  country: 24 * 60 * 60 * 1000,
};

const CACHEABLE_SOURCES = new Set(Object.keys(LOCATION_CACHE_TTL_MS));

let memoryCacheEntry = null;
const inflightResolvers = new Map();

function normalizeDetectedCity(city) {
  if (!city) return null;

  return {
    ...city,
    country_slug: city.country_slug || '',
    country_code: String(city.country_code || city.countryCode || '').toUpperCase(),
    country_name_ar: city.country_name_ar || '',
    country_name_en: city.country_name_en || '',
    city_slug: city.city_slug || city.slug || '',
    city_name_ar: city.city_name_ar || city.name_ar || city.name || '',
    city_name_en: city.city_name_en || city.name_en || city.name || '',
    timezone: city.timezone || '',
    lat: Number.isFinite(city.lat) ? city.lat : Number(city.lat || 0),
    lon: Number.isFinite(city.lon) ? city.lon : Number(city.lon || 0),
    is_capital: Boolean(city.is_capital),
    population: Number(city.population || 0),
  };
}

function normalizeHints(hints = {}) {
  return {
    timezone: String(hints.timezone || '').trim(),
    countryCode: String(hints.countryCode || '').trim().toUpperCase(),
  };
}

function getLocationStorage() {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getCacheTtlMs(source, options = {}) {
  if (Number.isFinite(options.maxCacheAgeMs) && options.maxCacheAgeMs > 0) {
    return options.maxCacheAgeMs;
  }

  return LOCATION_CACHE_TTL_MS[source] || (30 * 60 * 1000);
}

function clearLocationCache() {
  memoryCacheEntry = null;

  const storage = getLocationStorage();
  if (!storage) return;

  try {
    storage.removeItem(LOCATION_CACHE_KEY);
  } catch {}
}

function createCacheEntry({ city, source, hints }) {
  const normalizedCity = normalizeDetectedCity(city);
  if (!normalizedCity?.country_slug || !normalizedCity?.city_slug) return null;
  if (!CACHEABLE_SOURCES.has(source)) return null;

  return {
    version: LOCATION_CACHE_VERSION,
    resolvedAt: Date.now(),
    source,
    hints: normalizeHints(hints),
    city: normalizedCity,
  };
}

function normalizeCacheEntry(entry) {
  if (!entry || entry.version !== LOCATION_CACHE_VERSION) return null;
  if (!CACHEABLE_SOURCES.has(entry.source)) return null;

  const normalizedCity = normalizeDetectedCity(entry.city);
  if (!normalizedCity?.country_slug || !normalizedCity?.city_slug) return null;

  return {
    version: LOCATION_CACHE_VERSION,
    resolvedAt: Number(entry.resolvedAt || 0),
    source: entry.source,
    hints: normalizeHints(entry.hints),
    city: normalizedCity,
  };
}

function isCacheCompatible(entry, hints) {
  if (!entry?.city) return false;

  const normalizedHints = normalizeHints(hints);
  const cachedHints = normalizeHints(entry.hints);

  if (
    normalizedHints.countryCode &&
    cachedHints.countryCode &&
    normalizedHints.countryCode !== cachedHints.countryCode
  ) {
    return false;
  }

  if (
    normalizedHints.timezone &&
    cachedHints.timezone &&
    normalizedHints.timezone !== cachedHints.timezone
  ) {
    return false;
  }

  if (
    normalizedHints.countryCode &&
    entry.city.country_code &&
    normalizedHints.countryCode !== entry.city.country_code
  ) {
    return false;
  }

  if (
    normalizedHints.timezone &&
    entry.city.timezone &&
    normalizedHints.timezone !== entry.city.timezone
  ) {
    return false;
  }

  return true;
}

function isCacheFresh(entry, hints, options = {}) {
  if (!entry?.resolvedAt || !Number.isFinite(entry.resolvedAt)) return false;
  if (!isCacheCompatible(entry, hints)) return false;

  return (Date.now() - entry.resolvedAt) <= getCacheTtlMs(entry.source, options);
}

function readLocationCache(hints, options = {}) {
  const normalizedHints = normalizeHints(hints);

  if (memoryCacheEntry && isCacheFresh(memoryCacheEntry, normalizedHints, options)) {
    return memoryCacheEntry;
  }

  const storage = getLocationStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(LOCATION_CACHE_KEY);
    if (!raw) return null;

    const parsed = normalizeCacheEntry(JSON.parse(raw));
    if (!parsed) {
      clearLocationCache();
      return null;
    }

    if (!isCacheFresh(parsed, normalizedHints, options)) {
      return null;
    }

    memoryCacheEntry = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function writeLocationCache(result) {
  const entry = createCacheEntry(result);
  if (!entry) return null;

  memoryCacheEntry = entry;

  const storage = getLocationStorage();
  if (!storage) return entry;

  try {
    storage.setItem(LOCATION_CACHE_KEY, JSON.stringify(entry));
  } catch {}

  return entry;
}

function buildResolverKey(hints, options = {}) {
  return JSON.stringify({
    hints: normalizeHints(hints),
    geolocation: options.geolocation || 'always',
    enableIp: options.enableIp !== false,
    enableTimezone: options.enableTimezone !== false,
    preferFresh: Boolean(options.preferFresh),
  });
}

function toResolvedResult(entry, hints, extra = {}) {
  return {
    city: entry?.city || null,
    source: entry?.source || null,
    hints: normalizeHints(hints),
    cached: Boolean(extra.cached),
    resolvedAt: entry?.resolvedAt || Date.now(),
  };
}

export function getBrowserCountryCode() {
  if (typeof navigator === 'undefined') return '';

  const locales = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
  for (const locale of locales) {
    try {
      const region = new Intl.Locale(locale).region;
      if (region && region.length === 2) return region.toUpperCase();
    } catch {
      const match = String(locale).match(/[-_]([A-Za-z]{2})(?:[-_]|$)/);
      if (match?.[1]) return match[1].toUpperCase();
    }
  }

  return '';
}

export function getBrowserLocationHints() {
  const timezone =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || ''
      : '';

  return normalizeHints({
    timezone,
    countryCode: getBrowserCountryCode(),
  });
}

async function canUseGeolocation(mode) {
  if (mode === 'never' || typeof navigator === 'undefined' || !navigator.geolocation) {
    return false;
  }

  if (mode === 'always') {
    return true;
  }

  if (mode === 'if-granted') {
    try {
      if (!navigator.permissions?.query) return false;
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state === 'granted';
    } catch {
      return false;
    }
  }

  return true;
}

async function detectByGps(hints, options) {
  const mode = options.geolocation || 'always';
  if (!(await canUseGeolocation(mode))) {
    return null;
  }

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: options.gpsTimeoutMs || 8000,
        enableHighAccuracy: true,
        maximumAge: 0,
      });
    });

    return normalizeDetectedCity(await detectBestCityAction({
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      timezone: hints.timezone || undefined,
      countryCode: hints.countryCode || undefined,
    }));
  } catch {
    return null;
  }
}

async function detectByIp(hints) {
  try {
    const params = new URLSearchParams();
    if (hints.countryCode) params.set('countryCodeHint', hints.countryCode);
    if (hints.timezone) params.set('timezoneHint', hints.timezone);

    const response = await fetch(`/api/ip-city?${params.toString()}`, { cache: 'no-store' });
    if (!response.ok) return null;

    return normalizeDetectedCity(await response.json());
  } catch {
    return null;
  }
}

async function detectByTimezone(hints) {
  if (!hints.timezone) return null;

  return normalizeDetectedCity(await detectBestCityAction({
    timezone: hints.timezone,
    countryCode: hints.countryCode || undefined,
  }));
}

function scoreCandidate(city, source, hints) {
  if (!city) return Number.NEGATIVE_INFINITY;

  let score = 0;

  if (source === 'ip') score += 55;
  if (source === 'timezone') score += 45;
  if (source === 'country') score += 30;

  if (hints.countryCode && city.country_code) {
    score += city.country_code === hints.countryCode ? 18 : -28;
  }

  if (hints.timezone && city.timezone) {
    score += city.timezone === hints.timezone ? 16 : -12;
  }

  if (city.is_capital) score += 3;
  score += Math.min(city.population || 0, 5_000_000) / 1_000_000;

  return score;
}

function chooseBestCandidate(candidates, hints) {
  const ranked = new Map();

  for (const candidate of candidates) {
    if (!candidate?.city) continue;

    const city = normalizeDetectedCity(candidate.city);
    if (!city?.country_slug || !city?.city_slug) continue;

    const key = `${city.country_slug}::${city.city_slug}`;
    const next = {
      city,
      source: candidate.source,
      score: scoreCandidate(city, candidate.source, hints),
    };

    const existing = ranked.get(key);
    if (!existing || next.score > existing.score) {
      ranked.set(key, next);
    }
  }

  return Array.from(ranked.values()).sort((a, b) =>
    b.score - a.score ||
    Number(Boolean(b.city.is_capital)) - Number(Boolean(a.city.is_capital)) ||
    (b.city.population || 0) - (a.city.population || 0)
  )[0] || null;
}

export function getLocationSourceMessage(source) {
  if (source === 'gps') return 'تم تحديد موقعك بنجاح';
  if (source === 'ip') return 'تم تحديد موقعك تقريبياً عبر الشبكة';
  if (source === 'timezone') return 'تم تحديد موقعك تقريبياً حسب المنطقة الزمنية';
  if (source === 'country') return 'تعذر تحديد المدينة بدقة، فتم عرض عاصمة بلدك';
  return '';
}

export async function resolveCurrentUserCity(options = {}) {
  const hints = normalizeHints(options.hints || getBrowserLocationHints());
  const cachedEntry = readLocationCache(hints, options);

  if (cachedEntry && !options.preferFresh) {
    return toResolvedResult(cachedEntry, hints, { cached: true });
  }

  const resolverKey = buildResolverKey(hints, options);
  if (inflightResolvers.has(resolverKey)) {
    return inflightResolvers.get(resolverKey);
  }

  const task = (async () => {
    const gpsCity = await detectByGps(hints, options);
    if (gpsCity) {
      const result = { city: gpsCity, source: 'gps', hints };
      const entry = writeLocationCache(result) || createCacheEntry(result);
      return toResolvedResult(entry, hints);
    }

    const [ipCity, timezoneCity] = await Promise.all([
      options.enableIp === false ? null : detectByIp(hints),
      options.enableTimezone === false ? null : detectByTimezone(hints),
    ]);

    const bestCandidate = chooseBestCandidate([
      { city: ipCity, source: 'ip' },
      { city: timezoneCity, source: 'timezone' },
    ], hints);

    if (bestCandidate) {
      const result = {
        city: bestCandidate.city,
        source: bestCandidate.source,
        hints,
      };
      const entry = writeLocationCache(result) || createCacheEntry(result);
      return toResolvedResult(entry, hints);
    }

    if (hints.countryCode) {
      const countryCapital = normalizeDetectedCity(await detectBestCityAction({
        countryCode: hints.countryCode,
        timezone: hints.timezone || undefined,
      }));

      if (countryCapital) {
        const result = { city: countryCapital, source: 'country', hints };
        const entry = writeLocationCache(result) || createCacheEntry(result);
        return toResolvedResult(entry, hints);
      }
    }

    if (cachedEntry) {
      return toResolvedResult(cachedEntry, hints, { cached: true });
    }

    return {
      city: null,
      source: null,
      hints,
      cached: false,
      resolvedAt: Date.now(),
    };
  })().finally(() => {
    inflightResolvers.delete(resolverKey);
  });

  inflightResolvers.set(resolverKey, task);
  return task;
}

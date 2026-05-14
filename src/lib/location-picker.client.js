'use client';

import fallbackCountries from '@/lib/db/fallback/countries.json';
import { PRIORITY_COUNTRY_SLUGS, GLOBAL_POPULAR_COUNTRIES } from '@/lib/db/constants';

const COUNTRY_PRIORITY = new Map(
  [...PRIORITY_COUNTRY_SLUGS, ...GLOBAL_POPULAR_COUNTRIES].map((slug, index) => [slug, index]),
);

function normalizeCountryRecord(country = {}) {
  const slug = String(country.slug || country.country_slug || '').trim();
  const countryCode = String(country.country_code || '').trim().toUpperCase();
  const nameEn = String(country.name_en || '').trim();
  const fallbackLabel = slug ? slug.replace(/-/g, ' ') : '';

  return {
    ...country,
    slug,
    country_slug: slug,
    country_code: countryCode,
    name_ar: String(country.name_ar || '').trim() || nameEn || fallbackLabel,
    name_en: nameEn || null,
    timezone: country.timezone || '',
  };
}

function sortCountries(a, b) {
  const aPriority = COUNTRY_PRIORITY.has(a.slug) ? COUNTRY_PRIORITY.get(a.slug) : Number.POSITIVE_INFINITY;
  const bPriority = COUNTRY_PRIORITY.has(b.slug) ? COUNTRY_PRIORITY.get(b.slug) : Number.POSITIVE_INFINITY;

  if (aPriority !== bPriority) return aPriority - bPriority;

  return String(a.name_ar || a.name_en || a.slug).localeCompare(
    String(b.name_ar || b.name_en || b.slug),
    'ar',
  );
}

function mergeCountries(...countryLists) {
  const merged = new Map();

  for (const list of countryLists) {
    for (const country of list || []) {
      const normalized = normalizeCountryRecord(country);
      const key = normalized.slug || normalized.country_code;
      if (!key) continue;

      merged.set(key, {
        ...(merged.get(key) || {}),
        ...normalized,
      });
    }
  }

  return Array.from(merged.values()).sort(sortCountries);
}

const FALLBACK_COUNTRIES = mergeCountries(fallbackCountries);

let countriesCache = FALLBACK_COUNTRIES;
let countriesLoaded = false;
let countriesPromise = null;

const countryCitiesCache = new Map();
const countryCitiesPromiseCache = new Map();
let citySearchIndexCache = [];
let citySearchIndexLoaded = false;
let citySearchIndexPromise = null;

function normalizeCityRecord(city = {}) {
  const citySlug = String(city.city_slug || city.slug || '').trim();
  const countrySlug = String(city.country_slug || city.country_code || '').trim();

  return {
    ...city,
    city_slug: citySlug,
    country_slug: countrySlug,
    city_name_ar: String(city.city_name_ar || city.name_ar || city.city_name_en || city.name_en || citySlug).trim(),
    city_name_en: String(city.city_name_en || city.name_en || '').trim() || null,
    country_name_ar: String(city.country_name_ar || '').trim() || null,
    country_name_en: String(city.country_name_en || '').trim() || null,
    country_code: String(city.country_code || '').trim().toUpperCase(),
    timezone: city.timezone || '',
    lat: city.lat,
    lon: city.lon,
    is_capital: Boolean(city.is_capital),
    priority: Number(city.priority || 0),
    population: Number(city.population || 0),
  };
}

function sortCities(a, b) {
  return Number(Boolean(b.is_capital)) - Number(Boolean(a.is_capital))
    || (b.priority || 0) - (a.priority || 0)
    || (b.population || 0) - (a.population || 0)
    || String(a.city_name_ar || a.city_name_en || a.city_slug).localeCompare(
      String(b.city_name_ar || b.city_name_en || b.city_slug),
      'ar',
    );
}

function mergeCities(...cityLists) {
  const merged = new Map();

  for (const list of cityLists) {
    for (const city of list || []) {
      const normalized = normalizeCityRecord(city);
      const key = `${normalized.country_slug || normalized.country_code}:${normalized.city_slug}`;
      if (!normalized.city_slug || (!normalized.country_slug && !normalized.country_code)) continue;

      merged.set(key, {
        ...(merged.get(key) || {}),
        ...normalized,
      });
    }
  }

  return Array.from(merged.values()).sort(sortCities);
}

export function getInitialCountries(preloadedCountries = []) {
  countriesCache = mergeCountries(countriesCache, preloadedCountries);
  return countriesCache;
}

export async function loadCountriesDirectory(preloadedCountries = []) {
  const seededCountries = getInitialCountries(preloadedCountries);

  if (countriesLoaded) {
    return seededCountries;
  }

  if (!countriesPromise) {
    countriesPromise = fetch('/geo/countries.json', {
      headers: { Accept: 'application/json' },
      cache: 'force-cache',
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const remoteCountries = await response.json();
        countriesCache = mergeCountries(countriesCache, remoteCountries);
        countriesLoaded = true;
        return countriesCache;
      })
      .catch(() => countriesCache)
      .finally(() => {
        countriesPromise = null;
      });
  }

  const loadedCountries = await countriesPromise;
  countriesCache = mergeCountries(seededCountries, loadedCountries);
  return countriesCache;
}

export async function loadCountryCities(countrySlug) {
  const normalizedCountrySlug = String(countrySlug || '').trim();
  if (!normalizedCountrySlug) return [];

  if (countryCitiesCache.has(normalizedCountrySlug)) {
    return countryCitiesCache.get(normalizedCountrySlug);
  }

  if (!countryCitiesPromiseCache.has(normalizedCountrySlug)) {
    const request = Promise.all([
      fetch(`/geo/cities/${encodeURIComponent(normalizedCountrySlug)}.json`, {
        headers: { Accept: 'application/json' },
        cache: 'force-cache',
      })
        .then(async (response) => {
          if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error(`HTTP ${response.status}`);
          }

          const cities = await response.json();
          return Array.isArray(cities) ? cities : [];
        }),
      fetch(`/api/cities-by-country?country=${encodeURIComponent(normalizedCountrySlug)}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
        .then(async (response) => {
          if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error(`HTTP ${response.status}`);
          }

          const cities = await response.json();
          return Array.isArray(cities) ? cities : [];
        }),
    ])
      .then(([staticCities, dbCities]) => {
        const mergedCities = mergeCities(staticCities, dbCities);
        countryCitiesCache.set(normalizedCountrySlug, mergedCities);
        return mergedCities;
      })
      .catch((error) => {
        console.warn(`[location-picker] Could not load cities for "${normalizedCountrySlug}":`, error.message);
        return countryCitiesCache.get(normalizedCountrySlug) || [];
      })
      .finally(() => {
        countryCitiesPromiseCache.delete(normalizedCountrySlug);
      });

    countryCitiesPromiseCache.set(normalizedCountrySlug, request);
  }

  return countryCitiesPromiseCache.get(normalizedCountrySlug);
}

export async function loadCitySearchIndex() {
  if (citySearchIndexLoaded) {
    return citySearchIndexCache;
  }

  if (!citySearchIndexPromise) {
    citySearchIndexPromise = fetch('/geo/city-search-index.json', {
      headers: { Accept: 'application/json' },
      cache: 'force-cache',
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const index = await response.json();
        citySearchIndexCache = mergeCities(index);
        citySearchIndexLoaded = true;
        return citySearchIndexCache;
      })
      .catch((error) => {
        console.warn('[location-picker] Could not load global city search index:', error.message);
        return citySearchIndexCache;
      })
      .finally(() => {
        citySearchIndexPromise = null;
      });
  }

  return citySearchIndexPromise;
}

export function getLoadedCountryCities() {
  const snapshot = [];

  for (const cities of countryCitiesCache.values()) {
    if (Array.isArray(cities) && cities.length) {
      snapshot.push(...cities);
    }
  }

  return snapshot;
}

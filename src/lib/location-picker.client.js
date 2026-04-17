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
    const request = fetch(`/geo/cities/${encodeURIComponent(normalizedCountrySlug)}.json`, {
      headers: { Accept: 'application/json' },
      cache: 'force-cache',
    })
      .then(async (response) => {
        if (response.ok) {
          const cities = await response.json();
          countryCitiesCache.set(normalizedCountrySlug, Array.isArray(cities) ? cities : []);
          return countryCitiesCache.get(normalizedCountrySlug);
        }

        if (response.status !== 404) {
          throw new Error(`HTTP ${response.status}`);
        }

        const fallbackResponse = await fetch(`/api/cities-by-country?country=${encodeURIComponent(normalizedCountrySlug)}`);
        if (fallbackResponse.status === 404) {
          countryCitiesCache.set(normalizedCountrySlug, []);
          return [];
        }

        if (!fallbackResponse.ok) {
          throw new Error(`HTTP ${fallbackResponse.status}`);
        }

        const fallbackCities = await fallbackResponse.json();
        countryCitiesCache.set(normalizedCountrySlug, Array.isArray(fallbackCities) ? fallbackCities : []);
        return countryCitiesCache.get(normalizedCountrySlug);
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
        citySearchIndexCache = Array.isArray(index) ? index : [];
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

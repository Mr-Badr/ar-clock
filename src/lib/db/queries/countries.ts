import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import type { Country } from '@/lib/db/types'
import fallback from '@/lib/db/fallback/countries.json'
import snapshot from '../../../../public/geo/countries.json'
import { PRIORITY_COUNTRY_SLUGS, GLOBAL_POPULAR_COUNTRIES } from '@/lib/db/constants'
import { logger } from '@/lib/logger'
import {
  isLiveGeoDbEnabled,
  loadAllCountries,
  loadAllCountrySlugs,
  loadCountryByCode,
  loadCountryBySlug,
} from '@/lib/db/live-geo-source'

type SnapshotCountry = Country & { slug?: string | null }

function normalizeCountry(country: Partial<SnapshotCountry>): Country | null {
  const countrySlug = String(country.country_slug || country.slug || '').trim()
  const countryCode = String(country.country_code || '').trim().toUpperCase()

  if (!countrySlug || !countryCode) return null

  return {
    id: Number(country.id || 0),
    country_code: countryCode,
    country_slug: countrySlug,
    name_ar: String(country.name_ar || country.name_en || countrySlug),
    name_en: country.name_en ? String(country.name_en) : null,
    timezone: country.timezone ? String(country.timezone) : null,
  }
}

const fallbackCountries = (fallback as SnapshotCountry[])
  .map(normalizeCountry)
  .filter((country): country is Country => Boolean(country?.country_slug))
const snapshotCountries = (snapshot as SnapshotCountry[])
  .map(normalizeCountry)
  .filter((country): country is Country => Boolean(country?.country_slug))
const GEO_DB_FALLBACK_ENABLED = isLiveGeoDbEnabled()

function getCountryKey(country: Partial<Country>) {
  return country.country_slug || country.country_code || ''
}

function sortCountries(a: Country, b: Country) {
  return String(a.name_ar || a.name_en || a.country_slug).localeCompare(
    String(b.name_ar || b.name_en || b.country_slug),
    'ar',
  )
}

function mergeCountries(rows: Country[]) {
  const merged = new Map<string, Country>()

  for (const country of fallbackCountries) {
    const key = getCountryKey(country)
    if (key) merged.set(key, country)
  }

  for (const country of snapshotCountries) {
    const key = getCountryKey(country)
    if (key) merged.set(key, country)
  }

  for (const country of rows) {
    const key = getCountryKey(country)
    if (key) merged.set(key, country)
  }

  return Array.from(merged.values()).sort(sortCountries)
}

function findFallbackCountryBySlug(slug: string) {
  return mergeCountries([]).find((country) => country.country_slug === slug) ?? null
}

function findFallbackCountryByCode(code: string) {
  const normalizedCode = code.toUpperCase()
  return mergeCountries([]).find((country) => country.country_code === normalizedCode) ?? null
}

async function fetchCountryBySlugFromDb(slug: string) {
  return loadCountryBySlug(slug)
}

async function fetchCountryByCodeFromDb(code: string) {
  return loadCountryByCode(code)
}

async function fetchAllCountrySlugsFromDb() {
  return loadAllCountrySlugs()
}

async function fetchAllCountriesFromDb() {
  return loadAllCountries()
}

function warnCountryQueryFallback(reason: string, context: Record<string, unknown>) {
  logger.warn('country-query-fallback', {
    reason,
    ...context,
  })
}

export async function getAllCountries(): Promise<Country[]> {
  'use cache'
  cacheTag('countries')
  cacheLife('days')

  if (!GEO_DB_FALLBACK_ENABLED) {
    return mergeCountries([])
  }

  try {
    const dbRows = await fetchAllCountriesFromDb()
    if (dbRows.length > 0) {
      return mergeCountries(dbRows)
    }
  } catch (error) {
    warnCountryQueryFallback('getAllCountries-error', {
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return mergeCountries([])
}

export async function getCountryBySlug(slug: string): Promise<Country | null> {
  'use cache'
  cacheTag('countries', `country-${slug}`)
  cacheLife('days')

  if (GEO_DB_FALLBACK_ENABLED) {
    try {
      const country = await fetchCountryBySlugFromDb(slug)
      if (country) return country
    } catch (error) {
      warnCountryQueryFallback('getCountryBySlug-error', {
        slug,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return findFallbackCountryBySlug(slug)
}

export async function getCountryByCode(code: string): Promise<Country | null> {
  'use cache'
  cacheTag('countries', `country-code-${code}`)
  cacheLife('days')

  if (GEO_DB_FALLBACK_ENABLED) {
    try {
      const country = await fetchCountryByCodeFromDb(code)
      if (country) return country
    } catch (error) {
      warnCountryQueryFallback('getCountryByCode-error', {
        code,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return findFallbackCountryByCode(code)
}

export async function getAllCountrySlugs(): Promise<string[]> {
  'use cache'
  cacheTag('countries')
  cacheLife('days')

  const fallbackSlugs = fallbackCountries
    .map((country) => country.country_slug)
    .filter(Boolean)

  if (!GEO_DB_FALLBACK_ENABLED) {
    return Array.from(new Set(fallbackSlugs))
  }

  try {
    const dbSlugs = await fetchAllCountrySlugsFromDb()
    if (dbSlugs.length > 0) {
      return Array.from(new Set(dbSlugs))
    }
  } catch (error) {
    warnCountryQueryFallback('getAllCountrySlugs-error', {
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return Array.from(new Set(fallbackSlugs))
}

export async function getPriorityCountrySlugs(limit = 60): Promise<string[]> {
  'use cache'
  cacheTag('countries', 'priority-country-slugs')
  cacheLife('days')

  const allSlugs = await getAllCountrySlugs()
  const priority = [...PRIORITY_COUNTRY_SLUGS, ...GLOBAL_POPULAR_COUNTRIES]
  const seen = new Set<string>()
  const merged = [...priority, ...allSlugs].filter((slug): slug is string => {
    if (!slug || seen.has(slug)) return false
    seen.add(slug)
    return true
  })

  return merged.slice(0, limit)
}

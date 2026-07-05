import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import type { City, CityParams } from '@/lib/db/types'
import fallback from '@/lib/db/fallback/cities-index.json'
import snapshot from '../../../../public/geo/city-search-index.json'
import { logger } from '@/lib/logger'
import { PRIORITY_COUNTRY_SLUGS } from '@/lib/db/constants'
import {
  isLiveGeoDbEnabled,
  loadAllCityParams,
  loadBridgeCityParams,
  loadCitiesByCountry,
  loadCityBySlug,
  loadPriorityCityParams,
  searchCitiesViaLiveSource,
  type LiveSearchableCity,
} from '@/lib/db/live-geo-source'

type SearchResultCountryMeta = {
  country_slug: string
  name_ar: string
  name_en: string
}

type CityParamRow = {
  city_slug: string | null
  country_code: string | null
  countries: { country_slug: string | null } | Array<{ country_slug: string | null }> | null
}

type SearchableCity = LiveSearchableCity & {
  countries?: SearchResultCountryMeta
  country_slug?: string
  country_name_ar?: string
  country_name_en?: string
}

type SnapshotCity = {
  city_slug?: string | null
  city_name_ar?: string | null
  city_name_en?: string | null
  country_slug?: string | null
  country_code?: string | null
  country_name_ar?: string | null
  country_name_en?: string | null
  timezone?: string | null
  lat?: number | string | null
  lon?: number | string | null
  is_capital?: boolean | null
  priority?: number | null
  population?: number | null
}

function normalizeSearchableCity(city: Partial<SearchableCity | SnapshotCity>): SearchableCity | null {
  const snapshotCity = city as Partial<SnapshotCity>
  const searchableCity = city as Partial<SearchableCity>
  const citySlug = String(city.city_slug || '').trim()
  const countryCode = String(city.country_code || '').trim().toUpperCase()
  const countrySlug = String(city.country_slug || '').trim()

  if (!citySlug || !countryCode || !countrySlug) return null

  const nameAr = String(
    snapshotCity.city_name_ar
    || searchableCity.name_ar
    || snapshotCity.city_name_en
    || searchableCity.name_en
    || citySlug,
  ).trim()
  const nameEn = String(
    snapshotCity.city_name_en
    || searchableCity.name_en
    || '',
  ).trim() || null
  const countryNameAr = String(city.country_name_ar || '').trim()
  const countryNameEn = String(city.country_name_en || '').trim()

  return {
    id: Number((city as SearchableCity).id || 0),
    country_code: countryCode,
    city_slug: citySlug,
    name_ar: nameAr,
    name_en: nameEn,
    lat: Number(city.lat || 0),
    lon: Number(city.lon || 0),
    timezone: String(city.timezone || '').trim(),
    population: Number(city.population || 0),
    priority: Number(city.priority || city.population || 0),
    is_capital: Boolean(city.is_capital),
    country_slug: countrySlug,
    country_name_ar: countryNameAr,
    country_name_en: countryNameEn,
    countries: {
      country_slug: countrySlug,
      name_ar: countryNameAr,
      name_en: countryNameEn,
    },
  }
}

const fallbackCities = [
  ...(snapshot as SnapshotCity[])
    .map(normalizeSearchableCity)
    .filter((city): city is SearchableCity => Boolean(city?.city_slug)),
  ...(fallback as SearchableCity[])
    .map(normalizeSearchableCity)
    .filter((city): city is SearchableCity => Boolean(city?.city_slug)),
]
const GEO_DB_FALLBACK_ENABLED = isLiveGeoDbEnabled()

function getCityCountrySlug(city: Partial<SearchableCity>) {
  return city.country_slug || city.country_code?.toLowerCase() || ''
}

function sortCities(a: SearchableCity, b: SearchableCity) {
  return Number(Boolean(b.is_capital)) - Number(Boolean(a.is_capital))
    || (b.priority || 0) - (a.priority || 0)
    || (b.population || 0) - (a.population || 0)
    || String(a.name_ar || a.name_en || a.city_slug).localeCompare(
      String(b.name_ar || b.name_en || b.city_slug),
      'ar',
    )
}

function mergeCities(rows: SearchableCity[], countryCode?: string) {
  const normalizedCountryCode = countryCode?.toUpperCase() || null
  const merged = new Map<string, SearchableCity>()

  for (const city of fallbackCities) {
    if (normalizedCountryCode && city.country_code?.toUpperCase() !== normalizedCountryCode) continue
    if (city.city_slug) merged.set(city.city_slug, city)
  }

  for (const city of rows) {
    if (normalizedCountryCode && city.country_code?.toUpperCase() !== normalizedCountryCode) continue
    if (city.city_slug) merged.set(city.city_slug, city)
  }

  return Array.from(merged.values()).sort(sortCities)
}

function mergeCityParams(rows: CityParams[]) {
  const seen = new Set<string>()
  const merged: CityParams[] = []

  for (const row of rows) {
    const key = `${row.country}::${row.city}`
    if (!row.country || !row.city || seen.has(key)) continue
    seen.add(key)
    merged.push(row)
  }

  return merged
}

function getFallbackCitiesByCountry(countryCode: string) {
  return mergeCities([], countryCode)
}

function getFallbackCityBySlug(countryCode: string, citySlug: string) {
  return fallbackCities.find((city) => (
    city.country_code?.toUpperCase() === countryCode.toUpperCase()
    && city.city_slug === citySlug
  )) ?? null
}

function buildFallbackSearchMeta(city: SearchableCity) {
  return {
    country_slug: getCityCountrySlug(city),
    name_ar: city.country_name_ar || '',
    name_en: city.country_name_en || '',
  }
}

async function fetchCitiesByCountryFromDb(countryCode: string) {
  return loadCitiesByCountry(countryCode) as Promise<SearchableCity[]>
}

async function fetchCityBySlugFromDb(countryCode: string, citySlug: string) {
  return loadCityBySlug(countryCode, citySlug) as Promise<SearchableCity | null>
}

async function fetchAllCityParamsFromDb(): Promise<CityParams[]> {
  return loadAllCityParams()
}

function warnCityQueryFallback(reason: string, context: Record<string, unknown>) {
  logger.warn('city-query-fallback', {
    reason,
    ...context,
  })
}

export async function getCitiesByCountry(countryCode: string): Promise<City[]> {
  'use cache'
  cacheTag('cities', `cities-${countryCode}`)
  cacheLife('days')

  const fallbackRows = getFallbackCitiesByCountry(countryCode)

  if (!GEO_DB_FALLBACK_ENABLED) {
    return fallbackRows as City[]
  }

  try {
    const dbRows = await fetchCitiesByCountryFromDb(countryCode)
    if (dbRows.length > 0) {
      return mergeCities(dbRows, countryCode) as City[]
    }
  } catch (error) {
    warnCityQueryFallback('getCitiesByCountry-error', {
      countryCode,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return fallbackRows as City[]
}

export async function getTopCitiesByCountry(countryCode: string, limit = 20): Promise<City[]> {
  'use cache'
  cacheTag('cities', `top-cities-${countryCode}`)
  cacheLife('days')

  const cities = await getCitiesByCountry(countryCode)
  return cities.slice(0, limit)
}

export async function getCityBySlug(countryCode: string, citySlug: string): Promise<City | null> {
  'use cache'
  cacheTag('cities', `city-${countryCode}-${citySlug}`)
  cacheLife('days')

  if (GEO_DB_FALLBACK_ENABLED) {
    try {
      const city = await fetchCityBySlugFromDb(countryCode, citySlug)
      if (city) return city as City
    } catch (error) {
      warnCityQueryFallback('getCityBySlug-error', {
        countryCode,
        citySlug,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return getFallbackCityBySlug(countryCode, citySlug) as City | null
}

export async function getCapitalCity(countryCode: string): Promise<City | null> {
  'use cache'
  cacheTag('cities', `capital-${countryCode}`)
  cacheLife('days')

  if (GEO_DB_FALLBACK_ENABLED) {
    try {
      const dbCities = await fetchCitiesByCountryFromDb(countryCode)
      if (dbCities.length > 0) {
        return mergeCities(dbCities, countryCode).find((city) => city.is_capital) as City ?? dbCities[0] as City ?? null
      }
    } catch (error) {
      warnCityQueryFallback('getCapitalCity-error', {
        countryCode,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const fallbackCapital = getFallbackCitiesByCountry(countryCode).find((city) => city.is_capital)
  if (fallbackCapital) return fallbackCapital as City
  const fallbackFirst = getFallbackCitiesByCountry(countryCode)[0]
  if (fallbackFirst) return fallbackFirst as City
  return null
}

export async function getAllCityParams(): Promise<CityParams[]> {
  'use cache'
  cacheTag('cities', 'all-city-params')
  cacheLife('days')

  const fallbackParams = fallbackCities.map((city) => ({
    country: getCityCountrySlug(city),
    city: city.city_slug,
  }))

  if (!GEO_DB_FALLBACK_ENABLED) {
    return mergeCityParams(fallbackParams)
  }

  try {
    const dbParams = await fetchAllCityParamsFromDb()
    if (dbParams.length > 0) {
      return mergeCityParams(dbParams)
    }
  } catch (error) {
    warnCityQueryFallback('getAllCityParams-error', {
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return mergeCityParams(fallbackParams)
}

export async function getPriorityCityParams(limit = 10): Promise<CityParams[]> {
  'use cache'
  cacheTag('cities', 'priority-city-params')
  cacheLife('days')

  if (GEO_DB_FALLBACK_ENABLED) {
    try {
      const dbParams = await loadPriorityCityParams(limit)
      if (dbParams.length > 0) {
        return mergeCityParams(dbParams)
      }
    } catch (error) {
      warnCityQueryFallback('getPriorityCityParams-error', {
        limit,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const fallbackParams = [...fallbackCities]
    .sort(sortCities)
    .map((city) => ({
      country: getCityCountrySlug(city),
      city: city.city_slug,
    }))

  return mergeCityParams(fallbackParams).slice(0, limit)
}

export async function getBridgeCityParams(extraLimit = 100): Promise<CityParams[]> {
  'use cache'
  cacheTag('cities', 'bridge-city-params')
  cacheLife('days')

  if (GEO_DB_FALLBACK_ENABLED) {
    try {
      const dbParams = await loadBridgeCityParams(extraLimit)
      if (dbParams.length > 0) {
        return mergeCityParams(dbParams)
      }
    } catch (error) {
      warnCityQueryFallback('getBridgeCityParams-error', {
        extraLimit,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const capitals = fallbackCities
    .filter((city) => city.is_capital)
    .sort(sortCities)
    .map((city) => ({
      country: getCityCountrySlug(city),
      city: city.city_slug,
    }))

  const extra = fallbackCities
    .filter((city) => !city.is_capital)
    .sort(sortCities)
    .slice(0, extraLimit)
    .map((city) => ({
      country: getCityCountrySlug(city),
      city: city.city_slug,
    }))

  return mergeCityParams([...capitals, ...extra])
}

// Global population/capital-based prerendering (getPriorityCityParams, getBridgeCityParams)
// starves small-but-important Arab/Islamic markets: Saudi Arabia has only 13 cities total, but
// only Riyadh ranks in the global top 24, so Jeddah/Makkah/Madinah/Dammam/etc. never get
// build-time SSG. This guarantees every PRIORITY_COUNTRY_SLUGS country gets its own top cities
// prerendered regardless of global population ranking.
export async function getPriorityCountriesCityParams(perCountryLimit = 15): Promise<CityParams[]> {
  'use cache'
  cacheTag('cities', 'priority-countries-city-params')
  cacheLife('days')

  const prioritySlugs = new Set(PRIORITY_COUNTRY_SLUGS)
  const byCountry = new Map<string, SearchableCity[]>()

  for (const city of fallbackCities) {
    const slug = getCityCountrySlug(city)
    if (!prioritySlugs.has(slug)) continue
    const list = byCountry.get(slug)
    if (list) {
      list.push(city)
    } else {
      byCountry.set(slug, [city])
    }
  }

  const params: CityParams[] = []
  for (const [slug, cities] of Array.from(byCountry.entries())) {
    const top = [...cities].sort(sortCities).slice(0, perCountryLimit)
    for (const city of top) {
      params.push({ country: slug, city: city.city_slug })
    }
  }

  return mergeCityParams(params)
}

function normalizeSearchQuery(query: string) {
  return query
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ؤئ]/g, 'ء')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]"'?:؛،؟]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function searchFallbackCities(query: string) {
  if (!query || query.trim().length < 2) return []

  const q = normalizeSearchQuery(query)
  if (!q || q.length < 2) return []

  const qStripped = q.replace(/(^|\s)\u0627\u0644/g, '$1').trim()

  return fallbackCities
    .filter((city) => {
      const nameAr = normalizeSearchQuery(String(city.name_ar || ''))
      const nameEn = String(city.name_en || '').toLowerCase()
      return nameAr.includes(q) || nameAr.includes(qStripped) || nameEn.includes(q)
    })
    .sort(sortCities)
    .map((city) => ({
      ...city,
      countries: buildFallbackSearchMeta(city),
    }))
}

function mergeSearchCityResults(
  primaryRows: SearchableCity[],
  supplementalRows: SearchableCity[],
  limit: number,
) {
  const merged: SearchableCity[] = []
  const seen = new Set<string>()

  for (const row of [...primaryRows, ...supplementalRows]) {
    const key = `${row.country_code}:${row.city_slug}`
    if (!row.city_slug || !row.country_code || seen.has(key)) continue
    seen.add(key)
    merged.push(row)
    if (merged.length >= limit) break
  }

  return merged
}

// Dynamic search — DB-first, with local snapshot support only as a supplement or explicit fallback.
export async function searchCities(query: string, limit = 10): Promise<City[]> {
  'use cache'
  cacheTag('cities', 'search-cities')
  cacheLife('hours')

  const localMatches = searchFallbackCities(query)

  if (!GEO_DB_FALLBACK_ENABLED) {
    return localMatches.slice(0, limit) as City[]
  }

  const q = normalizeSearchQuery(query)
  if (q.length < 4) {
    return localMatches.slice(0, limit) as City[]
  }

  const qStripped = q.replace(/(^|\s)\u0627\u0644/g, '$1').trim()

  try {
    const liveRows = await searchCitiesViaLiveSource(q, qStripped, limit)
    if (liveRows.length > 0) {
      return mergeSearchCityResults(
        liveRows as SearchableCity[],
        localMatches,
        limit,
      ) as City[]
    }
  } catch (error) {
    warnCityQueryFallback('searchCities-error', {
      query,
      normalizedQuery: q,
      limit,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return localMatches.slice(0, limit) as City[]
}

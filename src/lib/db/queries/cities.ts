import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { supabase } from '@/lib/supabase/server'
import type { City, CityParams } from '@/lib/db/types'
import fallback from '@/lib/db/fallback/cities-index.json'
import snapshot from '../../../../public/geo/city-search-index.json'

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

type SearchableCity = City & {
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
const GEO_DB_FALLBACK_ENABLED = process.env.ENABLE_LIVE_GEO_DB === 'true'

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
  if (!GEO_DB_FALLBACK_ENABLED) return []

  const { data, error } = await supabase
    .from('cities').select('*')
    .eq('country_code', countryCode.toUpperCase())
    .order('priority', { ascending: false })
    .order('population', { ascending: false })

  if (error || !data?.length) {
    throw new Error(error?.message ?? 'empty')
  }

  return data as SearchableCity[]
}

async function fetchCityBySlugFromDb(countryCode: string, citySlug: string) {
  if (!GEO_DB_FALLBACK_ENABLED) return null

  const { data, error } = await supabase
    .from('cities').select('*')
    .eq('country_code', countryCode.toUpperCase())
    .eq('city_slug', citySlug)
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'not found')
  }

  return data as SearchableCity
}

async function fetchAllCityParamsFromDb(): Promise<CityParams[]> {
  if (!GEO_DB_FALLBACK_ENABLED) return []

  const { data, error } = await supabase
    .from('cities')
    .select('city_slug, country_code, countries!inner(country_slug)')
    .order('priority', { ascending: false })
    .order('population', { ascending: false })

  if (error || !data) {
    throw new Error(error?.message || 'Unable to load city params')
  }

  return (data as unknown as CityParamRow[]).map((row) => {
    const countrySlug = Array.isArray(row.countries)
      ? row.countries[0]?.country_slug
      : row.countries?.country_slug

    return {
      country: countrySlug || String(row.country_code || '').toLowerCase(),
      city: row.city_slug || '',
    }
  })
}

export async function getCitiesByCountry(countryCode: string): Promise<City[]> {
  'use cache'
  cacheTag('cities', `cities-${countryCode}`)
  cacheLife('days')

  const fallbackRows = getFallbackCitiesByCountry(countryCode)
  if (fallbackRows.length > 0) {
    return fallbackRows as City[]
  }

  try {
    const dbRows = await fetchCitiesByCountryFromDb(countryCode)
    return mergeCities(dbRows, countryCode) as City[]
  } catch (err: any) {
    if (err?.message && err.message !== 'empty') {
      console.warn(`[DB] getCitiesByCountry(${countryCode}) → fallback:`, err.message)
    }
    return []
  }
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

  const fromFallback = getFallbackCityBySlug(countryCode, citySlug)
  if (fromFallback) return fromFallback as City

  try {
    const city = await fetchCityBySlugFromDb(countryCode, citySlug)
    return city as City
  } catch {
    return null
  }
}

export async function getCapitalCity(countryCode: string): Promise<City | null> {
  'use cache'
  cacheTag('cities', `capital-${countryCode}`)
  cacheLife('days')

  const fallbackCapital = getFallbackCitiesByCountry(countryCode).find((city) => city.is_capital)
  if (fallbackCapital) return fallbackCapital as City

  const fallbackFirst = getFallbackCitiesByCountry(countryCode)[0]
  if (fallbackFirst) return fallbackFirst as City

  try {
    const dbCities = await fetchCitiesByCountryFromDb(countryCode)
    return mergeCities(dbCities, countryCode).find((city) => city.is_capital) as City ?? dbCities[0] as City ?? null
  } catch {
    return null
  }
}

export async function getAllCityParams(): Promise<CityParams[]> {
  'use cache'
  cacheTag('cities', 'all-city-params')
  cacheLife('days')

  const fallbackParams = fallbackCities.map((city) => ({
    country: getCityCountrySlug(city),
    city: city.city_slug,
  }))

  try {
    const dbParams = await fetchAllCityParamsFromDb()
    return mergeCityParams([...fallbackParams, ...dbParams])
  } catch (err: any) {
    if (err?.message) {
      console.warn('[DB] getAllCityParams() → fallback:', err.message)
    }
    return mergeCityParams(fallbackParams)
  }
}

export async function getPriorityCityParams(limit = 10): Promise<CityParams[]> {
  'use cache'
  cacheTag('cities', 'priority-city-params')
  cacheLife('days')

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

// Dynamic search — local-first, DB only as a long-tail fallback.
export async function searchCities(query: string, limit = 10): Promise<City[]> {
  'use cache'
  cacheTag('cities', 'search-cities')
  cacheLife('hours')

  const localMatches = searchFallbackCities(query).slice(0, limit)

  if (localMatches.length >= limit || !GEO_DB_FALLBACK_ENABLED) {
    return localMatches as City[]
  }

  const q = normalizeSearchQuery(query)
  const qStripped = q.replace(/(^|\s)\u0627\u0644/g, '$1').trim()
  const arOrFilter = `name_ar.ilike.%${q}%,name_ar.ilike.%${qStripped}%`

  try {
    const [arResult, enResult] = await Promise.all([
      supabase
        .from('cities')
        .select('*, countries!inner(country_slug, name_ar, name_en)')
        .or(arOrFilter)
        .order('priority', { ascending: false })
        .order('population', { ascending: false })
        .limit(limit),
      supabase
        .from('cities')
        .select('*, countries!inner(country_slug, name_ar, name_en)')
        .ilike('name_en', `%${q}%`)
        .order('priority', { ascending: false })
        .order('population', { ascending: false })
        .limit(limit),
    ])

    if (arResult.error) throw arResult.error

    const merged: SearchableCity[] = [...localMatches]
    const seen = new Set(merged.map((city) => `${city.country_code}:${city.city_slug}`))

    for (const row of [...(arResult.data ?? []), ...(enResult.data ?? [])]) {
      const key = `${row.country_code}:${row.city_slug}`
      if (seen.has(key)) continue

      seen.add(key)
      merged.push(row as SearchableCity)
    }

    return merged.slice(0, limit) as City[]
  } catch (err) {
    console.error('[DB] searchCities query failed:', err)
    return localMatches as City[]
  }
}

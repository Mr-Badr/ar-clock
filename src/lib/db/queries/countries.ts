import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { supabase } from '@/lib/supabase/server'
import type { Country } from '@/lib/db/types'
import fallback from '@/lib/db/fallback/countries.json'
import snapshot from '../../../../public/geo/countries.json'
import { PRIORITY_COUNTRY_SLUGS, GLOBAL_POPULAR_COUNTRIES } from '@/lib/db/constants'

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
const GEO_DB_FALLBACK_ENABLED = process.env.ENABLE_LIVE_GEO_DB === 'true'

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
  if (!GEO_DB_FALLBACK_ENABLED) return null

  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('country_slug', slug)
    .single()

  if (error || !data) {
    throw new Error(error?.message || `Country not found: ${slug}`)
  }

  return data as Country
}

async function fetchCountryByCodeFromDb(code: string) {
  if (!GEO_DB_FALLBACK_ENABLED) return null

  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('country_code', code.toUpperCase())
    .single()

  if (error || !data) {
    throw new Error(error?.message || `Country not found: ${code}`)
  }

  return data as Country
}

async function fetchAllCountrySlugsFromDb() {
  if (!GEO_DB_FALLBACK_ENABLED) return []

  const { data, error } = await supabase
    .from('countries')
    .select('country_slug')

  if (error || !data) {
    throw new Error(error?.message || 'Unable to load country slugs')
  }

  return data
    .map((row) => row.country_slug)
    .filter((slug): slug is string => Boolean(slug))
}

export async function getAllCountries(): Promise<Country[]> {
  'use cache'
  cacheTag('countries')
  cacheLife('days')
  return mergeCountries([])
}

export async function getCountryBySlug(slug: string): Promise<Country | null> {
  'use cache'
  cacheTag('countries', `country-${slug}`)
  cacheLife('days')

  const fromFallback = findFallbackCountryBySlug(slug)
  if (fromFallback) return fromFallback

  try {
    return await fetchCountryBySlugFromDb(slug)
  } catch {
    throw new Error(`Country not found: ${slug}`)
  }
}

export async function getCountryByCode(code: string): Promise<Country | null> {
  'use cache'
  cacheTag('countries', `country-code-${code}`)
  cacheLife('days')

  const fromFallback = findFallbackCountryByCode(code)
  if (fromFallback) return fromFallback

  try {
    return await fetchCountryByCodeFromDb(code)
  } catch {
    return null
  }
}

export async function getAllCountrySlugs(): Promise<string[]> {
  'use cache'
  cacheTag('countries')
  cacheLife('days')

  const fallbackSlugs = fallbackCountries
    .map((country) => country.country_slug)
    .filter(Boolean)

  try {
    const dbSlugs = await fetchAllCountrySlugsFromDb()
    return Array.from(new Set([...fallbackSlugs, ...dbSlugs]))
  } catch (err: any) {
    if (err?.message) {
      console.warn('[DB] getAllCountrySlugs() → fallback:', err.message)
    }
    return Array.from(new Set(fallbackSlugs))
  }
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

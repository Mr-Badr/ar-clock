import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { supabase } from '@/lib/supabase/server'
import type { Country } from '@/lib/db/types'
import fallback from '@/lib/db/fallback/countries.json'

const fallbackCountries = fallback as Country[]

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

  for (const country of rows) {
    const key = getCountryKey(country)
    if (key) merged.set(key, country)
  }

  return Array.from(merged.values()).sort(sortCountries)
}

export async function getAllCountries(): Promise<Country[]> {
  'use cache'
  cacheTag('countries')
  cacheLife('days')
  try {
    const { data, error } = await supabase.from('countries').select('*').order('name_ar')
    if (error || !data?.length) throw new Error(error?.message ?? 'empty')
    return mergeCountries(data as Country[])
  } catch (err) {
    console.error('[DB] getAllCountries → fallback:', err)
    return mergeCountries([])
  }
}

export async function getCountryBySlug(slug: string): Promise<Country | null> {
  'use cache'
  cacheTag('countries', `country-${slug}`)
  cacheLife('days')
  try {
    const { data, error } = await supabase
      .from('countries').select('*').eq('country_slug', slug).single()
    if (error) throw new Error(error.message)
    return data as Country
  } catch {
    const fromFallback = (fallback as Country[]).find(c => c.country_slug === slug) ?? null
    // Never cache a null result — throw so Next.js doesn't store null in the cache
    if (!fromFallback) throw new Error(`Country not found: ${slug}`)
    return fromFallback
  }
}

export async function getCountryByCode(code: string): Promise<Country | null> {
  'use cache'
  cacheTag('countries', `country-code-${code}`)
  cacheLife('days')
  try {
    const { data, error } = await supabase
      .from('countries').select('*').eq('country_code', code.toUpperCase()).single()
    if (error) throw new Error(error.message)
    return data as Country
  } catch {
    return (fallback as Country[]).find(c => c.country_code === code.toUpperCase()) ?? null
  }
}

export async function getAllCountrySlugs(): Promise<string[]> {
  'use cache'
  cacheTag('countries')
  cacheLife('days')
  try {
    const { data, error } = await supabase.from('countries').select('country_slug')
    if (error) throw new Error(error.message)
    const dbSlugs = (data ?? []).map(c => c.country_slug).filter(Boolean)
    return Array.from(new Set([
      ...dbSlugs,
      ...fallbackCountries.map(c => c.country_slug).filter(Boolean),
    ]))
  } catch {
    return fallbackCountries.map(c => c.country_slug)
  }
}

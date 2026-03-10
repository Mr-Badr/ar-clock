import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { supabase } from '@/lib/supabase/server'
import type { City, CityParams } from '@/lib/db/types'
import fallback from '@/lib/db/fallback/cities-index.json'

export async function getCitiesByCountry(countryCode: string): Promise<City[]> {
  'use cache'
  cacheTag('cities', `cities-${countryCode}`)
  cacheLife('days')
  try {
    const { data, error } = await supabase
      .from('cities').select('*')
      .eq('country_code', countryCode.toUpperCase())
      .order('priority', { ascending: false })
      .order('population', { ascending: false })
    if (error || !data?.length) throw new Error(error?.message ?? 'empty')
    return data as City[]
  } catch (err: any) {
    if (err?.message !== 'empty') {
      console.warn(`[DB] getCitiesByCountry(${countryCode}) → fallback:`, err.message)
    }
    return (fallback as any[]).filter(c => c.country_code?.toUpperCase() === countryCode.toUpperCase()) as City[]
  }
}

export async function getTopCitiesByCountry(countryCode: string, limit = 20): Promise<City[]> {
  'use cache'
  cacheTag('cities', `top-cities-${countryCode}`)
  cacheLife('days')
  try {
    const { data, error } = await supabase
      .from('cities').select('*')
      .eq('country_code', countryCode.toUpperCase())
      .order('is_capital', { ascending: false })
      .order('priority', { ascending: false })
      .order('population', { ascending: false })
      .limit(limit)
    if (error || !data?.length) throw new Error(error?.message ?? 'empty')
    return data as City[]
  } catch (err) {
    return (fallback as any[])
      .filter(c => c.country_code?.toUpperCase() === countryCode.toUpperCase())
      .sort((a, b) => (b.is_capital ? 1 : 0) - (a.is_capital ? 1 : 0) || (b.priority || 0) - (a.priority || 0))
      .slice(0, limit) as City[]
  }
}

export async function getCityBySlug(countryCode: string, citySlug: string): Promise<City | null> {
  'use cache'
  cacheTag('cities', `city-${countryCode}-${citySlug}`)
  cacheLife('days')
  try {
    const { data, error } = await supabase
      .from('cities').select('*')
      .eq('country_code', countryCode.toUpperCase())
      .eq('city_slug', citySlug)
      .single()
    if (error || !data) throw new Error(error?.message ?? 'not found')
    return data as City
  } catch {
    return (fallback as any[]).find(c => c.country_code?.toUpperCase() === countryCode.toUpperCase() && c.city_slug === citySlug) as City ?? null
  }
}

export async function getCapitalCity(countryCode: string): Promise<City | null> {
  'use cache'
  cacheTag('cities', `capital-${countryCode}`)
  cacheLife('days')
  try {
    const { data, error } = await supabase
      .from('cities').select('*')
      .eq('country_code', countryCode.toUpperCase())
      .eq('is_capital', true)
      .single()
    if (error || !data) throw new Error(error?.message ?? 'not found')
    return data as City
  } catch {
    return (fallback as any[]).find(c => c.country_code?.toUpperCase() === countryCode.toUpperCase() && c.is_capital) as City ?? null
  }
}

// For generateStaticParams — returns all {country_slug, city_slug} pairs
export async function getAllCityParams(): Promise<CityParams[]> {
  'use cache'
  cacheTag('cities', 'countries')
  cacheLife('days')
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('city_slug, country_code, countries!inner(country_slug)')
      .order('population', { ascending: false })
    if (error || !data?.length) throw new Error(error?.message ?? 'empty')
    return (data ?? []).map((row: any) => ({
      country: row.countries.country_slug,
      city: row.city_slug,
    }))
  } catch {
    return (fallback as any[]).map(c => ({
      country: c.country_slug || c.country_code?.toLowerCase(),
      city: c.city_slug,
    }))
  }
}

// Dynamic search — NOT cached (real-time autocomplete)
export async function searchCities(query: string, limit = 10): Promise<City[]> {
  if (!query || query.trim().length < 2) return []

  // Pre-clean the query: normalize hamzas, remove tatweel & tashkeel, standardizing ta marbuta/alif maksura, strip punctuation
  let q = query
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ؤئ]/g, 'ء')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]"'?:؛،؟]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  if (!q || q.length < 2) return []

  // Strip Arabic definite article ال so "الرباط" matches "رباط", and "دار بيضاء" matches "الدار البيضاء"
  const qStripped = q.replace(/(^|\s)\u0627\u0644/g, '$1').trim()

  // Create an OR string for PostgREST
  // We match name_ar against either the raw query OR the stripped query
  const arOrFilter = `name_ar.ilike.%${q}%,name_ar.ilike.%${qStripped}%`

  try {
    // PostgREST .or() cannot reference joined table columns (e.g., countries.name_ar)
    // so we run two separate queries and merge: one for Arabic, one for English
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
    // Merge and deduplicate by city_slug
    const seen = new Set<string>()
    const merged: any[] = []
    for (const row of [...(arResult.data ?? []), ...(enResult.data ?? [])]) {
      if (!seen.has(row.city_slug)) {
        seen.add(row.city_slug)
        merged.push(row)
      }
    }
    return merged.slice(0, limit) as City[]
  } catch (err) {
    console.error('[DB] searchCities query failed:', err)
    return []
  }
}

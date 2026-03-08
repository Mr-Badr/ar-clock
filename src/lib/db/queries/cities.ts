import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { supabase } from '@/lib/supabase/server'
import type { City, CityParams } from '@/lib/db/types'

export async function getCitiesByCountry(countryCode: string): Promise<City[]> {
  'use cache'
  cacheTag('cities', `cities-${countryCode}`)
  cacheLife('days')
  const { data, error } = await supabase
    .from('cities').select('*')
    .eq('country_code', countryCode.toUpperCase())
    .order('priority', { ascending: false })
    .order('population', { ascending: false })
  if (error) { console.error(`[DB] getCitiesByCountry(${countryCode}):`, error); return [] }
  return (data ?? []) as City[]
}

export async function getTopCitiesByCountry(countryCode: string, limit = 20): Promise<City[]> {
  'use cache'
  cacheTag('cities', `top-cities-${countryCode}`)
  cacheLife('days')
  const { data } = await supabase
    .from('cities').select('*')
    .eq('country_code', countryCode.toUpperCase())
    .order('is_capital', { ascending: false })
    .order('priority',   { ascending: false })
    .order('population', { ascending: false })
    .limit(limit)
  return (data ?? []) as City[]
}

export async function getCityBySlug(countryCode: string, citySlug: string): Promise<City | null> {
  'use cache'
  cacheTag('cities', `city-${countryCode}-${citySlug}`)
  cacheLife('days')
  const { data, error } = await supabase
    .from('cities').select('*')
    .eq('country_code', countryCode.toUpperCase())
    .eq('city_slug', citySlug)
    .single()
  if (error) return null
  return data as City
}

export async function getCapitalCity(countryCode: string): Promise<City | null> {
  'use cache'
  cacheTag('cities', `capital-${countryCode}`)
  cacheLife('days')
  const { data } = await supabase
    .from('cities').select('*')
    .eq('country_code', countryCode.toUpperCase())
    .eq('is_capital', true)
    .single()
  return (data as City) ?? null
}

// For generateStaticParams — returns all {country_slug, city_slug} pairs
export async function getAllCityParams(): Promise<CityParams[]> {
  'use cache'
  cacheTag('cities', 'countries')
  cacheLife('days')
  const { data, error } = await supabase
    .from('cities')
    .select('city_slug, country_code, countries!inner(country_slug)')
    .order('population', { ascending: false })
  if (error) { console.error('[DB] getAllCityParams:', error); return [] }
  return (data ?? []).map((row: any) => ({
    country: row.countries.country_slug,
    city: row.city_slug,
  }))
}

// Dynamic search — NOT cached (real-time autocomplete)
export async function searchCities(query: string, limit = 10): Promise<City[]> {
  if (!query || query.trim().length < 2) return []
  const { data } = await supabase
    .from('cities')
    .select('*, countries!inner(country_slug, name_ar, name_en)')
    .ilike('name_ar', `%${query.trim()}%`)
    .order('population', { ascending: false })
    .limit(limit)
  return (data ?? []) as City[]
}

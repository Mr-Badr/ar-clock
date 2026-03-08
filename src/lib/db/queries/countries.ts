import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { supabase } from '@/lib/supabase/server'
import type { Country } from '@/lib/db/types'
import fallback from '@/lib/db/fallback/countries.json'

export async function getAllCountries(): Promise<Country[]> {
  'use cache'
  cacheTag('countries')
  cacheLife('days')
  try {
    const { data, error } = await supabase.from('countries').select('*').order('name_ar')
    if (error || !data?.length) throw new Error(error?.message ?? 'empty')
    return data as Country[]
  } catch (err) {
    console.error('[DB] getAllCountries → fallback:', err)
    return fallback as Country[]
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
    return (fallback as Country[]).find(c => c.country_slug === slug) ?? null
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
    return (data ?? []).map(c => c.country_slug)
  } catch {
    return (fallback as Country[]).map(c => c.country_slug)
  }
}

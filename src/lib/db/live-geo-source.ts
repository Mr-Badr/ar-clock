import 'server-only'

import type { City, Country } from '@/lib/db/types'

type CountrySlugRow = { country_slug: string | null }

type CityParamJoin =
  | { country_slug: string | null }
  | Array<{ country_slug: string | null }>
  | null

type CityParamRow = {
  city_slug: string | null
  country_code: string | null
  countries: CityParamJoin
}

type SearchResultCountryMeta = {
  country_slug: string | null
  name_ar: string | null
  name_en: string | null
}

export type LiveSearchableCity = City & {
  countries?: SearchResultCountryMeta
  country_slug?: string | null
  country_name_ar?: string | null
  country_name_en?: string | null
}

type NearestCityRow = Partial<LiveSearchableCity>

export function isLiveGeoDbEnabled() {
  return process.env.ENABLE_LIVE_GEO_DB === 'true'
}

export function getLiveGeoProviderName() {
  if (!isLiveGeoDbEnabled()) return 'disabled'
  return process.env.LIVE_GEO_PROVIDER || 'supabase'
}

async function getSupabaseClient() {
  const provider = getLiveGeoProviderName()

  if (provider !== 'supabase') {
    throw new Error(`[live-geo] Unsupported provider: ${provider}`)
  }

  const mod = await import('@/lib/supabase/server')
  return mod.supabase
}

export async function loadCountryBySlug(slug: string): Promise<Country | null> {
  if (!isLiveGeoDbEnabled()) return null

  const supabase = await getSupabaseClient()
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

export async function loadCountryByCode(code: string): Promise<Country | null> {
  if (!isLiveGeoDbEnabled()) return null

  const supabase = await getSupabaseClient()
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

export async function loadAllCountrySlugs(): Promise<string[]> {
  if (!isLiveGeoDbEnabled()) return []

  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('countries')
    .select('country_slug')

  if (error || !data) {
    throw new Error(error?.message || 'Unable to load country slugs')
  }

  return (data as CountrySlugRow[])
    .map((row) => row.country_slug)
    .filter((slug): slug is string => Boolean(slug))
}

export async function loadCitiesByCountry(countryCode: string): Promise<LiveSearchableCity[]> {
  if (!isLiveGeoDbEnabled()) return []

  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('country_code', countryCode.toUpperCase())
    .order('priority', { ascending: false })
    .order('population', { ascending: false })

  if (error || !data?.length) {
    throw new Error(error?.message ?? 'empty')
  }

  return data as LiveSearchableCity[]
}

export async function loadCityBySlug(countryCode: string, citySlug: string): Promise<LiveSearchableCity | null> {
  if (!isLiveGeoDbEnabled()) return null

  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('country_code', countryCode.toUpperCase())
    .eq('city_slug', citySlug)
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'not found')
  }

  return data as LiveSearchableCity
}

export async function loadAllCityParams(): Promise<Array<{ country: string; city: string }>> {
  if (!isLiveGeoDbEnabled()) return []

  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('cities')
    .select('city_slug, country_code, countries!inner(country_slug)')
    .order('priority', { ascending: false })
    .order('population', { ascending: false })

  if (error || !data) {
    throw new Error(error?.message || 'Unable to load city params')
  }

  return (data as CityParamRow[]).map((row) => {
    const countryMeta = Array.isArray(row.countries)
      ? row.countries[0]
      : row.countries

    return {
      country: countryMeta?.country_slug || String(row.country_code || '').toLowerCase(),
      city: row.city_slug || '',
    }
  })
}

export async function searchCitiesViaLiveSource(
  normalizedQuery: string,
  strippedArabicQuery: string,
  limit: number,
): Promise<LiveSearchableCity[]> {
  if (!isLiveGeoDbEnabled()) return []

  const supabase = await getSupabaseClient()
  const arOrFilter = `name_ar.ilike.%${normalizedQuery}%,name_ar.ilike.%${strippedArabicQuery}%`

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
      .ilike('name_en', `%${normalizedQuery}%`)
      .order('priority', { ascending: false })
      .order('population', { ascending: false })
      .limit(limit),
  ])

  if (arResult.error) {
    throw arResult.error
  }

  if (enResult.error) {
    throw enResult.error
  }

  return [...(arResult.data ?? []), ...(enResult.data ?? [])] as LiveSearchableCity[]
}

export async function findNearestCitiesViaLiveSource(
  lat: number,
  lon: number,
  limit = 1,
): Promise<NearestCityRow[]> {
  if (!isLiveGeoDbEnabled()) return []

  const supabase = await getSupabaseClient()
  const { data, error } = await supabase.rpc('find_nearest_cities', {
    user_lat: lat,
    user_lon: lon,
    lim: limit,
  })

  if (error) {
    throw error
  }

  return (data ?? []) as NearestCityRow[]
}

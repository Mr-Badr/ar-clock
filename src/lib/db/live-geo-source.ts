import 'server-only'

import type { City, Country } from '@/lib/db/types'

type LiveGeoProvider = 'supabase' | 'postgres'

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

type PrismaCountryRow = {
  id: bigint | number
  countryCode: string
  countrySlug: string
  nameAr: string
  nameEn: string | null
  timezone: string | null
}

type PrismaCityCountryRow = {
  countrySlug: string
  nameAr: string
  nameEn: string | null
}

type PrismaCityRow = {
  id: bigint | number
  countryCode: string
  citySlug: string
  nameAr: string
  nameEn: string | null
  lat: number
  lon: number
  timezone: string
  population: number
  priority: number
  isCapital: boolean
  country?: PrismaCityCountryRow | null
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

function assertLiveGeoProvider(provider: string): LiveGeoProvider {
  if (provider === 'supabase' || provider === 'postgres') {
    return provider
  }

  throw new Error(`[live-geo] Unsupported provider: ${provider}`)
}

function toSafeNumber(value: bigint | number | null | undefined) {
  if (typeof value === 'bigint') return Number(value)
  return Number(value || 0)
}

function normalizeCountryFromPrisma(row: PrismaCountryRow): Country {
  return {
    id: toSafeNumber(row.id),
    country_code: row.countryCode,
    country_slug: row.countrySlug,
    name_ar: row.nameAr,
    name_en: row.nameEn,
    timezone: row.timezone,
  }
}

function normalizeCountryMeta(country?: PrismaCityCountryRow | null): SearchResultCountryMeta {
  return {
    country_slug: country?.countrySlug ?? null,
    name_ar: country?.nameAr ?? null,
    name_en: country?.nameEn ?? null,
  }
}

function normalizeCityFromPrisma(row: PrismaCityRow): LiveSearchableCity {
  const countryMeta = normalizeCountryMeta(row.country)

  return {
    id: toSafeNumber(row.id),
    country_code: row.countryCode,
    city_slug: row.citySlug,
    name_ar: row.nameAr,
    name_en: row.nameEn,
    lat: Number(row.lat),
    lon: Number(row.lon),
    timezone: row.timezone,
    population: Number(row.population || 0),
    priority: Number(row.priority || 0),
    is_capital: Boolean(row.isCapital),
    country_slug: countryMeta.country_slug,
    country_name_ar: countryMeta.name_ar,
    country_name_en: countryMeta.name_en,
    countries: countryMeta,
  }
}

async function getSupabaseClient() {
  const mod = await import('@/lib/supabase/server')
  return mod.getSupabase()
}

async function getPrismaClient() {
  const mod = await import('@/lib/db/prisma')
  return mod.prisma
}

export async function loadCountryBySlug(slug: string): Promise<Country | null> {
  if (!isLiveGeoDbEnabled()) return null

  const provider = assertLiveGeoProvider(getLiveGeoProviderName())

  if (provider === 'supabase') {
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

  const prisma = await getPrismaClient()
  const data = await prisma.country.findUnique({
    where: { countrySlug: slug },
  })

  if (!data) {
    throw new Error(`Country not found: ${slug}`)
  }

  return normalizeCountryFromPrisma(data as PrismaCountryRow)
}

export async function loadCountryByCode(code: string): Promise<Country | null> {
  if (!isLiveGeoDbEnabled()) return null

  const provider = assertLiveGeoProvider(getLiveGeoProviderName())
  const normalizedCode = code.toUpperCase()

  if (provider === 'supabase') {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('country_code', normalizedCode)
      .single()

    if (error || !data) {
      throw new Error(error?.message || `Country not found: ${code}`)
    }

    return data as Country
  }

  const prisma = await getPrismaClient()
  const data = await prisma.country.findUnique({
    where: { countryCode: normalizedCode },
  })

  if (!data) {
    throw new Error(`Country not found: ${code}`)
  }

  return normalizeCountryFromPrisma(data as PrismaCountryRow)
}

export async function loadAllCountrySlugs(): Promise<string[]> {
  if (!isLiveGeoDbEnabled()) return []

  const provider = assertLiveGeoProvider(getLiveGeoProviderName())

  if (provider === 'supabase') {
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

  const prisma = await getPrismaClient()
  const rows = await prisma.country.findMany({
    select: { countrySlug: true },
    orderBy: { countrySlug: 'asc' },
  })

  return rows
    .map((row) => row.countrySlug)
    .filter((slug): slug is string => Boolean(slug))
}

export async function loadCitiesByCountry(countryCode: string): Promise<LiveSearchableCity[]> {
  if (!isLiveGeoDbEnabled()) return []

  const provider = assertLiveGeoProvider(getLiveGeoProviderName())
  const normalizedCode = countryCode.toUpperCase()

  if (provider === 'supabase') {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('country_code', normalizedCode)
      .order('priority', { ascending: false })
      .order('population', { ascending: false })

    if (error || !data?.length) {
      throw new Error(error?.message ?? 'empty')
    }

    return data as LiveSearchableCity[]
  }

  const prisma = await getPrismaClient()
  const data = await prisma.city.findMany({
    where: { countryCode: normalizedCode },
    include: {
      country: {
        select: {
          countrySlug: true,
          nameAr: true,
          nameEn: true,
        },
      },
    },
    orderBy: [
      { isCapital: 'desc' },
      { priority: 'desc' },
      { population: 'desc' },
      { nameAr: 'asc' },
    ],
  })

  if (!data.length) {
    throw new Error('empty')
  }

  return data.map((row) => normalizeCityFromPrisma(row as PrismaCityRow))
}

export async function loadCityBySlug(countryCode: string, citySlug: string): Promise<LiveSearchableCity | null> {
  if (!isLiveGeoDbEnabled()) return null

  const provider = assertLiveGeoProvider(getLiveGeoProviderName())
  const normalizedCode = countryCode.toUpperCase()

  if (provider === 'supabase') {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('country_code', normalizedCode)
      .eq('city_slug', citySlug)
      .single()

    if (error || !data) {
      throw new Error(error?.message ?? 'not found')
    }

    return data as LiveSearchableCity
  }

  const prisma = await getPrismaClient()
  const data = await prisma.city.findFirst({
    where: {
      countryCode: normalizedCode,
      citySlug,
    },
    include: {
      country: {
        select: {
          countrySlug: true,
          nameAr: true,
          nameEn: true,
        },
      },
    },
  })

  if (!data) {
    throw new Error('not found')
  }

  return normalizeCityFromPrisma(data as PrismaCityRow)
}

export async function loadAllCityParams(): Promise<Array<{ country: string; city: string }>> {
  if (!isLiveGeoDbEnabled()) return []

  const provider = assertLiveGeoProvider(getLiveGeoProviderName())

  if (provider === 'supabase') {
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

  const prisma = await getPrismaClient()
  const rows = await prisma.city.findMany({
    select: {
      citySlug: true,
      countryCode: true,
      country: {
        select: {
          countrySlug: true,
        },
      },
    },
    orderBy: [
      { isCapital: 'desc' },
      { priority: 'desc' },
      { population: 'desc' },
      { citySlug: 'asc' },
    ],
  })

  return rows.map((row) => ({
    country: row.country?.countrySlug || String(row.countryCode || '').toLowerCase(),
    city: row.citySlug || '',
  }))
}

export async function searchCitiesViaLiveSource(
  normalizedQuery: string,
  strippedArabicQuery: string,
  limit: number,
): Promise<LiveSearchableCity[]> {
  if (!isLiveGeoDbEnabled()) return []

  const provider = assertLiveGeoProvider(getLiveGeoProviderName())

  if (provider === 'supabase') {
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

  const prisma = await getPrismaClient()
  const normalizedTerms = Array.from(new Set(
    [normalizedQuery, strippedArabicQuery]
      .map((value) => value.trim())
      .filter(Boolean),
  ))

  const data = await prisma.city.findMany({
    where: {
      OR: [
        ...normalizedTerms.map((value) => ({
          nameAr: { contains: value },
        })),
        {
          nameEn: {
            contains: normalizedQuery,
            mode: 'insensitive',
          },
        },
      ],
    },
    include: {
      country: {
        select: {
          countrySlug: true,
          nameAr: true,
          nameEn: true,
        },
      },
    },
    orderBy: [
      { isCapital: 'desc' },
      { priority: 'desc' },
      { population: 'desc' },
      { nameAr: 'asc' },
    ],
    take: limit,
  })

  return data.map((row) => normalizeCityFromPrisma(row as PrismaCityRow))
}

type NearestCityQueryRow = {
  id: bigint | number
  country_code: string
  city_slug: string
  name_ar: string
  name_en: string | null
  lat: number
  lon: number
  timezone: string
  population: number | null
  priority: number | null
  is_capital: boolean | null
  country_slug: string
  country_name_ar: string
  country_name_en: string | null
}

function normalizeNearestCityRow(row: NearestCityQueryRow): NearestCityRow {
  return {
    id: toSafeNumber(row.id),
    country_code: row.country_code,
    city_slug: row.city_slug,
    name_ar: row.name_ar,
    name_en: row.name_en,
    lat: Number(row.lat),
    lon: Number(row.lon),
    timezone: row.timezone,
    population: Number(row.population || 0),
    priority: Number(row.priority || 0),
    is_capital: Boolean(row.is_capital),
    country_slug: row.country_slug,
    country_name_ar: row.country_name_ar,
    country_name_en: row.country_name_en,
    countries: {
      country_slug: row.country_slug,
      name_ar: row.country_name_ar,
      name_en: row.country_name_en,
    },
  }
}

export async function findNearestCitiesViaLiveSource(
  lat: number,
  lon: number,
  limit = 1,
): Promise<NearestCityRow[]> {
  if (!isLiveGeoDbEnabled()) return []

  const provider = assertLiveGeoProvider(getLiveGeoProviderName())
  const safeLimit = Math.max(1, Math.floor(limit))

  if (provider === 'supabase') {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.rpc('find_nearest_cities', {
      user_lat: lat,
      user_lon: lon,
      lim: safeLimit,
    })

    if (error) {
      throw error
    }

    return (data ?? []) as NearestCityRow[]
  }

  const prisma = await getPrismaClient()
  const rows = await prisma.$queryRaw<NearestCityQueryRow[]>`
    SELECT
      c.id,
      c.country_code,
      c.city_slug,
      c.name_ar,
      c.name_en,
      c.lat,
      c.lon,
      c.timezone,
      c.population,
      c.priority,
      c.is_capital,
      co.country_slug,
      co.name_ar AS country_name_ar,
      co.name_en AS country_name_en
    FROM public.cities AS c
    INNER JOIN public.countries AS co
      ON co.country_code = c.country_code
    ORDER BY
      (
        6371 * acos(
          LEAST(
            1,
            GREATEST(
              -1,
              cos(radians(${lat})) * cos(radians(c.lat)) * cos(radians(c.lon) - radians(${lon}))
              + sin(radians(${lat})) * sin(radians(c.lat))
            )
          )
        )
      ) ASC,
      c.is_capital DESC,
      c.priority DESC,
      c.population DESC
    LIMIT ${safeLimit}
  `

  return rows.map(normalizeNearestCityRow)
}

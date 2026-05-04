import 'server-only'

import type { City, Country } from '@/lib/db/types'

/**
 * 🚨 DESIGN RULE:
 * VPS is Postgres-only (no Supabase, no fallback, no dual mode)
 */

export type LiveSearchableCity = City & {
  country_slug?: string | null
  country_name_ar?: string | null
  country_name_en?: string | null
}

/* -------------------------------------------------------------------------- */
/* ENV CONTROL                                                                */
/* -------------------------------------------------------------------------- */

function isLiveGeoEnabled() {
  return process.env.ENABLE_LIVE_GEO_DB === 'true'
}

/**
 * Always Postgres in VPS architecture.
 */
function getProvider(): 'postgres' | 'disabled' {
  if (!isLiveGeoEnabled()) return 'disabled'
  return 'postgres'
}

/* -------------------------------------------------------------------------- */
/* PRISMA                                                                     */
/* -------------------------------------------------------------------------- */

async function getPrisma() {
  const mod = await import('@/lib/db/prisma')
  return mod.prisma
}

/* -------------------------------------------------------------------------- */
/* NORMALIZERS                                                                */
/* -------------------------------------------------------------------------- */

function normalizeCountry(row: any): Country {
  return {
    id: Number(row.id),
    country_code: row.countryCode,
    country_slug: row.countrySlug,
    name_ar: row.nameAr,
    name_en: row.nameEn,
    timezone: row.timezone,
  }
}

function normalizeCity(row: any): LiveSearchableCity {
  return {
    id: Number(row.id),
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

    country_slug: row.country?.countrySlug ?? null,
    country_name_ar: row.country?.nameAr ?? null,
    country_name_en: row.country?.nameEn ?? null,
  }
}

/* -------------------------------------------------------------------------- */
/* COUNTRY                                                                    */
/* -------------------------------------------------------------------------- */

export async function loadCountryBySlug(slug: string): Promise<Country | null> {
  if (!isLiveGeoEnabled()) return null

  const prisma = await getPrisma()

  const data = await prisma.country.findUnique({
    where: { countrySlug: slug },
  })

  if (!data) return null

  return normalizeCountry(data)
}

export async function loadCountryByCode(code: string): Promise<Country | null> {
  if (!isLiveGeoEnabled()) return null

  const prisma = await getPrisma()

  const data = await prisma.country.findUnique({
    where: { countryCode: code.toUpperCase() },
  })

  if (!data) return null

  return normalizeCountry(data)
}

export async function loadAllCountrySlugs(): Promise<string[]> {
  if (!isLiveGeoEnabled()) return []

  const prisma = await getPrisma()

  const rows = await prisma.country.findMany({
    select: { countrySlug: true },
    orderBy: { countrySlug: 'asc' },
  })

  return rows.map((r) => r.countrySlug).filter(Boolean)
}

/* -------------------------------------------------------------------------- */
/* CITIES                                                                     */
/* -------------------------------------------------------------------------- */

export async function loadCitiesByCountry(countryCode: string): Promise<LiveSearchableCity[]> {
  if (!isLiveGeoEnabled()) return []

  const prisma = await getPrisma()

  const rows = await prisma.city.findMany({
    where: { countryCode: countryCode.toUpperCase() },
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
    ],
  })

  return rows.map(normalizeCity)
}

export async function loadCityBySlug(
  countryCode: string,
  citySlug: string,
): Promise<LiveSearchableCity | null> {
  if (!isLiveGeoEnabled()) return null

  const prisma = await getPrisma()

  const data = await prisma.city.findFirst({
    where: {
      countryCode: countryCode.toUpperCase(),
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

  if (!data) return null

  return normalizeCity(data)
}

/* -------------------------------------------------------------------------- */
/* PARAMS                                                                     */
/* -------------------------------------------------------------------------- */

export async function loadAllCityParams(): Promise<
  Array<{ country: string; city: string }>
> {
  if (!isLiveGeoEnabled()) return []

  const prisma = await getPrisma()

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
  })

  return rows.map((row) => ({
    country: row.country?.countrySlug || row.countryCode.toLowerCase(),
    city: row.citySlug,
  }))
}

/* -------------------------------------------------------------------------- */
/* SEARCH                                                                     */
/* -------------------------------------------------------------------------- */

export async function searchCitiesViaLiveSource(
  query: string,
  _normalizedArabic: string,
  limit: number,
): Promise<LiveSearchableCity[]> {
  if (!isLiveGeoEnabled()) return []

  const prisma = await getPrisma()

  const rows = await prisma.city.findMany({
    where: {
      OR: [
        { nameAr: { contains: query } },
        { nameEn: { contains: query, mode: 'insensitive' } },
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
    take: limit,
    orderBy: [
      { isCapital: 'desc' },
      { priority: 'desc' },
      { population: 'desc' },
    ],
  })

  return rows.map(normalizeCity)
}

/* -------------------------------------------------------------------------- */
/* NEAREST                                                                    */
/* -------------------------------------------------------------------------- */

export async function findNearestCitiesViaLiveSource(
  lat: number,
  lon: number,
  limit = 1,
): Promise<LiveSearchableCity[]> {
  if (!isLiveGeoEnabled()) return []

  const prisma = await getPrisma()

  const rows = await prisma.$queryRaw<any[]>`
    SELECT *
    FROM cities c
    ORDER BY (
      6371 * acos(
        cos(radians(${lat})) *
        cos(radians(c.lat)) *
        cos(radians(c.lon) - radians(${lon})) +
        sin(radians(${lat})) *
        sin(radians(c.lat))
      )
    ) ASC
    LIMIT ${limit}
  `

  return rows.map(normalizeCity)
}

/* -------------------------------------------------------------------------- */
/* BACKWARD COMPATIBILITY (CI FIX)                                            */
/* -------------------------------------------------------------------------- */

export function isLiveGeoDbEnabled() {
  return isLiveGeoEnabled()
}

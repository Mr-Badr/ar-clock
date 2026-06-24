import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { prisma } from '../src/lib/db/prisma';

import fallbackCountries from '../src/lib/db/fallback/countries.json';
import fallbackCities from '../src/lib/db/fallback/cities-index.json';

type CountryRow = {
  id?: number;
  country_code: string;
  country_slug: string;
  name_ar: string;
  name_en?: string | null;
  timezone?: string | null;
};

type CityRow = {
  id?: number;
  country_code: string;
  country_slug?: string;
  city_slug: string;
  name_ar: string;
  name_en?: string | null;
  timezone: string;
  is_capital?: boolean;
  lat: number;
  lon: number;
  priority?: number;
  population?: number;
  country_name_ar?: string;
  country_name_en?: string;
};

const ROOT = process.cwd();
const GEO_ROOT = join(ROOT, 'public', 'geo');
const COUNTRY_CITY_ROOT = join(GEO_ROOT, 'cities');

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

function writeJson(path: string, value: unknown) {
  ensureDir(join(path, '..'));
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function uniqueBy<T>(values: T[], getKey: (value: T) => string) {
  const map = new Map<string, T>();

  for (const value of values) {
    const key = getKey(value);
    if (!key) continue;
    map.set(key, value);
  }

  return Array.from(map.values());
}

function sortCountries(a: CountryRow, b: CountryRow) {
  return String(a.name_ar || a.name_en || a.country_slug).localeCompare(
    String(b.name_ar || b.name_en || b.country_slug),
    'ar',
  );
}

function sortCities(a: CityRow, b: CityRow) {
  return Number(Boolean(b.is_capital)) - Number(Boolean(a.is_capital))
    || (b.priority || 0) - (a.priority || 0)
    || (b.population || 0) - (a.population || 0)
    || String(a.name_ar || a.name_en || a.city_slug).localeCompare(
      String(b.name_ar || b.name_en || b.city_slug),
      'ar',
    );
}

function normalizeCountryRow(country: CountryRow): CountryRow {
  return {
    id: country.id,
    country_code: String(country.country_code || '').toUpperCase(),
    country_slug: String(country.country_slug || '').trim(),
    name_ar: String(country.name_ar || '').trim(),
    name_en: country.name_en ? String(country.name_en).trim() : null,
    timezone: country.timezone ? String(country.timezone).trim() : null,
  };
}

function normalizeCityRow(city: CityRow, countriesByCode: Map<string, CountryRow>): CityRow {
  const countryCode = String(city.country_code || '').toUpperCase();
  const country = countriesByCode.get(countryCode);

  return {
    id: city.id,
    country_code: countryCode,
    country_slug: String(
      city.country_slug
      || country?.country_slug
      || countryCode.toLowerCase(),
    ).trim(),
    city_slug: String(city.city_slug || '').trim(),
    name_ar: String(city.name_ar || '').trim(),
    name_en: city.name_en ? String(city.name_en).trim() : null,
    timezone: String(city.timezone || '').trim(),
    is_capital: Boolean(city.is_capital),
    lat: Number(city.lat),
    lon: Number(city.lon),
    priority: Number(city.priority || 0),
    population: Number(city.population || 0),
    country_name_ar: String(city.country_name_ar || country?.name_ar || '').trim(),
    country_name_en: city.country_name_en
      ? String(city.country_name_en).trim()
      : (country?.name_en ? String(country.name_en).trim() : ''),
  };
}

async function fetchCountriesFromDb(): Promise<CountryRow[] | null> {
  try {

    const data = await prisma.country.findMany({
      orderBy: { nameAr: 'asc' },
    });

    if (!data?.length) {
      throw new Error('Empty countries dataset');
    }

    const formattedData = data.map((c) => ({
      id: Number(c.id),
      country_code: c.countryCode,
      country_slug: c.countrySlug,
      name_en: c.nameEn,
      name_ar: c.nameAr,
      timezone: c.timezone
    }));

    await prisma.$disconnect();
    return formattedData as CountryRow[];
  } catch (error) {
    console.warn('[geo:snapshot] Falling back to bundled countries:', error);
    return null;
  }
}

async function fetchCitiesFromDb(countriesByCode: Map<string, CountryRow>): Promise<CityRow[] | null> {
  try {

    const data = await prisma.city.findMany({
      orderBy: [
        { isCapital: 'desc' },
        { priority: 'desc' },
        { population: 'desc' }
      ],
      include: {
        country: {
          select: { countrySlug: true, nameAr: true, nameEn: true }
        }
      }
    });

    if (!data?.length) {
      throw new Error('Empty cities dataset');
    }

    const formattedData = data.map((row) => ({
      id: Number(row.id),
      city_slug: row.citySlug,
      country_code: row.countryCode,
      name_ar: row.nameAr,
      name_en: row.nameEn,
      timezone: row.timezone,
      is_capital: row.isCapital,
      lat: row.lat,
      lon: row.lon,
      priority: row.priority,
      population: row.population,
      countries: {
        country_slug: row.country?.countrySlug,
        name_ar: row.country?.nameAr,
        name_en: row.country?.nameEn
      }
    }));

    await prisma.$disconnect();
    return formattedData.map((row) => normalizeCityRow({
      ...row,
      country_slug: row.countries?.country_slug,
      country_name_ar: row.countries?.name_ar,
      country_name_en: row.countries?.name_en || undefined,
    }, countriesByCode));
  } catch (error) {
    console.warn('[geo:snapshot] Falling back to bundled cities:', error);
    return null;
  }
}

async function main() {
  const fallbackCountryRows = uniqueBy(
    (fallbackCountries as CountryRow[]).map(normalizeCountryRow),
    (country) => country.country_slug || country.country_code,
  ).sort(sortCountries);

  const countriesFromDb = await fetchCountriesFromDb();
  const countries = uniqueBy(
    [...fallbackCountryRows, ...((countriesFromDb || []).map(normalizeCountryRow))],
    (country) => country.country_slug || country.country_code,
  ).sort(sortCountries);

  const countriesByCode = new Map(
    countries.map((country) => [country.country_code.toUpperCase(), country]),
  );

  const fallbackCityRows = uniqueBy(
    (fallbackCities as CityRow[]).map((city) => normalizeCityRow(city, countriesByCode)),
    (city) => `${city.country_slug}::${city.city_slug}`,
  ).sort(sortCities);

  const citiesFromDb = await fetchCitiesFromDb(countriesByCode);
  const cities = uniqueBy(
    [...fallbackCityRows, ...((citiesFromDb || []).map((city) => normalizeCityRow(city, countriesByCode)))],
    (city) => `${city.country_slug}::${city.city_slug}`,
  ).sort(sortCities);

  const countriesWithCities = new Map<string, CityRow[]>();

  for (const city of cities) {
    const countrySlug = city.country_slug || city.country_code.toLowerCase();
    const existing = countriesWithCities.get(countrySlug) || [];
    existing.push(city);
    countriesWithCities.set(countrySlug, existing);
  }

  ensureDir(COUNTRY_CITY_ROOT);

  const searchableCities = cities.map((city) => ({
    city_slug: city.city_slug,
    city_name_ar: city.name_ar,
    city_name_en: city.name_en,
    country_slug: city.country_slug,
    country_code: city.country_code,
    country_name_ar: city.country_name_ar,
    country_name_en: city.country_name_en,
    timezone: city.timezone,
    lat: city.lat,
    lon: city.lon,
    is_capital: Boolean(city.is_capital),
    priority: Number(city.priority || 0),
    population: Number(city.population || 0),
  }));

  for (const [countrySlug, countryCities] of Array.from(countriesWithCities.entries())) {
    writeJson(join(COUNTRY_CITY_ROOT, `${countrySlug}.json`), countryCities.map((city: CityRow) => ({
      city_slug: city.city_slug,
      city_name_ar: city.name_ar,
      city_name_en: city.name_en,
      country_slug: city.country_slug,
      country_code: city.country_code,
      country_name_ar: city.country_name_ar,
      country_name_en: city.country_name_en,
      timezone: city.timezone,
      lat: city.lat,
      lon: city.lon,
      is_capital: Boolean(city.is_capital),
      priority: Number(city.priority || 0),
      population: Number(city.population || 0),
    })));
  }

  writeJson(join(GEO_ROOT, 'countries.json'), countries.map((country) => ({
    id: country.id,
    country_code: country.country_code,
    country_slug: country.country_slug,
    slug: country.country_slug,
    name_ar: country.name_ar,
    name_en: country.name_en || null,
    timezone: country.timezone || null,
  })));

  writeJson(join(GEO_ROOT, 'city-search-index.json'), searchableCities);

  writeJson(join(GEO_ROOT, 'manifest.json'), {
    generatedAt: new Date().toISOString(),
    countryCount: countries.length,
    cityCount: cities.length,
    countriesPath: '/geo/countries.json',
    citySearchIndexPath: '/geo/city-search-index.json',
    cityFilePattern: '/geo/cities/{countrySlug}.json',
    countriesWithCityFiles: Array.from(countriesWithCities.keys()).sort((a, b) => a.localeCompare(b)),
  });

  console.log(`[geo:snapshot] countries=${countries.length} cities=${cities.length}`);

  // Quick sanity check after generation — fail fast before the snapshot is committed.
  // Full deep audit runs separately via "npm run validate:geo".
  let badCount = 0;
  for (const city of cities) {
    if (!city.timezone || !city.lat || !city.lon) {
      console.warn(`[geo:snapshot] WARNING: ${city.country_slug}/${city.city_slug} has missing timezone/coordinates`);
      badCount++;
    }
  }
  if (badCount > 0) {
    console.warn(`[geo:snapshot] ${badCount} cities have incomplete data. Run "npm run validate:geo" for details.`);
    console.warn('[geo:snapshot] If data is wrong in the DB, run "npm run geo:fix" to repair via OpenStreetMap API.');
  }
}

main().catch((error) => {
  console.error('[geo:snapshot] Fatal:', error);
  process.exit(1);
});

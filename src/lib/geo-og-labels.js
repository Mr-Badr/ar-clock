import fallbackCities from '@/lib/db/fallback/cities-index.json';
import snapshotCities from '../../public/geo/city-search-index.json';
import snapshotCountries from '../../public/geo/countries.json';

function humanizeSlug(value) {
  try {
    return decodeURIComponent(String(value || ''))
      .replace(/[-_]+/g, ' ')
      .trim();
  } catch {
    return String(value || '')
      .replace(/[-_]+/g, ' ')
      .trim();
  }
}

function normalizeCountry(row) {
  const countrySlug = String(row?.country_slug || row?.slug || '').trim();
  if (!countrySlug) return null;

  return {
    countrySlug,
    nameAr: String(row?.name_ar || row?.name_en || countrySlug).trim(),
    nameEn: String(row?.name_en || '').trim() || null,
  };
}

function normalizeCity(row) {
  const citySlug = String(row?.city_slug || '').trim();
  const countrySlug = String(row?.country_slug || row?.country_code || '').trim();

  if (!citySlug || !countrySlug) return null;

  return {
    citySlug,
    countrySlug,
    nameAr: String(row?.city_name_ar || row?.name_ar || row?.city_name_en || row?.name_en || citySlug).trim(),
    nameEn: String(row?.city_name_en || row?.name_en || '').trim() || null,
    countryNameAr: String(row?.country_name_ar || '').trim() || null,
    countryNameEn: String(row?.country_name_en || '').trim() || null,
    isCapital: Boolean(row?.is_capital),
    priority: Number(row?.priority || 0),
    population: Number(row?.population || 0),
  };
}

const countryMap = new Map();

for (const row of snapshotCountries) {
  const country = normalizeCountry(row);
  if (!country) continue;
  countryMap.set(country.countrySlug, country);
}

const cityMap = new Map();
const capitalMap = new Map();

for (const row of [...snapshotCities, ...fallbackCities]) {
  const city = normalizeCity(row);
  if (!city) continue;

  const cityKey = `${city.countrySlug}::${city.citySlug}`;
  if (!cityMap.has(cityKey)) {
    cityMap.set(cityKey, city);
  }

  const currentCapital = capitalMap.get(city.countrySlug);
  if (!currentCapital) {
    capitalMap.set(city.countrySlug, city);
    continue;
  }

  const currentScore = Number(Boolean(currentCapital.isCapital)) * 1_000_000
    + currentCapital.priority
    + currentCapital.population;
  const nextScore = Number(Boolean(city.isCapital)) * 1_000_000
    + city.priority
    + city.population;

  if (nextScore > currentScore) {
    capitalMap.set(city.countrySlug, city);
  }
}

export function getOgCountryLabels(countrySlug) {
  const country = countryMap.get(String(countrySlug || '').trim());
  const fallbackLabel = humanizeSlug(countrySlug) || 'البلد';

  return {
    countryLabel: country?.nameAr || country?.nameEn || fallbackLabel,
    fallbackCountryLabel: fallbackLabel,
  };
}

export function getOgCountryCapitalLabels(countrySlug) {
  const { countryLabel, fallbackCountryLabel } = getOgCountryLabels(countrySlug);
  const capital = capitalMap.get(String(countrySlug || '').trim());

  return {
    countryLabel,
    capitalLabel: capital?.nameAr || capital?.nameEn || countryLabel,
    fallbackCountryLabel,
  };
}

export function getOgCityLabels(countrySlug, citySlug) {
  const { countryLabel, fallbackCountryLabel } = getOgCountryLabels(countrySlug);
  const city = cityMap.get(`${String(countrySlug || '').trim()}::${String(citySlug || '').trim()}`);
  const fallbackCityLabel = humanizeSlug(citySlug) || 'المدينة';

  return {
    cityLabel: city?.nameAr || city?.nameEn || fallbackCityLabel,
    countryLabel: city?.countryNameAr || city?.countryNameEn || countryLabel,
    fallbackCityLabel,
    fallbackCountryLabel,
  };
}

export { humanizeSlug };

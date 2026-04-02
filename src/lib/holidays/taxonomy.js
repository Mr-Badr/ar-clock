import countriesData from '@/data/holidays/taxonomy/countries.json';
import categoriesData from '@/data/holidays/taxonomy/categories.json';

export const HOLIDAY_COUNTRIES = countriesData;
export const HOLIDAY_CATEGORIES = categoriesData;

export const HOLIDAY_COUNTRIES_BY_CODE = Object.freeze(
  Object.fromEntries(HOLIDAY_COUNTRIES.map((country) => [country.code, country])),
);

export const HOLIDAY_CATEGORIES_BY_ID = Object.freeze(
  Object.fromEntries(HOLIDAY_CATEGORIES.map((category) => [category.id, category])),
);

export const HOLIDAY_COUNTRY_CODES = HOLIDAY_COUNTRIES.map((country) => country.code);

export function getHolidayCountryByCode(code) {
  if (!code) return null;
  return HOLIDAY_COUNTRIES_BY_CODE[code] || null;
}

export function getHolidayCategoryById(id) {
  if (!id) return null;
  return HOLIDAY_CATEGORIES_BY_ID[id] || null;
}

export function getHolidayCountryAliasToken(code) {
  return getHolidayCountryByCode(code)?.aliasSlugToken || code || '';
}

export function getAllHolidayCountryNamesAr() {
  return HOLIDAY_COUNTRIES.flatMap((country) => [
    country.nameAr,
    country.officialNameAr,
    ...(country.localTerms || []),
  ]);
}

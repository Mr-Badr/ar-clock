import {
  HOLIDAY_COUNTRIES_BY_CODE,
  HOLIDAY_COUNTRY_CODES,
  getAllHolidayCountryNamesAr,
  getHolidayCountryAliasToken,
  getHolidayCountryByCode,
} from '@/lib/holidays/taxonomy';

export const COUNTRY_DICTIONARY = HOLIDAY_COUNTRIES_BY_CODE;
export const COUNTRY_CODES = HOLIDAY_COUNTRY_CODES;

export function getCountryByCode(code) {
  return getHolidayCountryByCode(code);
}

export function getCountryAliasToken(code) {
  return getHolidayCountryAliasToken(code);
}

export function getAllCountryNamesAr() {
  return getAllHolidayCountryNamesAr();
}

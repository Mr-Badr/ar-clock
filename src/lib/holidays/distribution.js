import {
  HOLIDAY_COUNTRY_CODES,
  getHolidayCountryByCode,
} from '@/lib/holidays/taxonomy';

function normalizeCountryCode(code) {
  const normalized = String(code || '').trim().toLowerCase();
  if (!normalized) return null;
  return getHolidayCountryByCode(normalized)?.code || null;
}

function collectExplicitCountryCodes(pkg) {
  const codes = new Set();
  const packageCountryCode = normalizeCountryCode(pkg?.core?._countryCode);
  if (packageCountryCode) codes.add(packageCountryCode);

  for (const rawCode of Object.keys(pkg?.countryOverrides || {})) {
    const normalizedCode = normalizeCountryCode(rawCode);
    if (normalizedCode) codes.add(normalizedCode);
  }

  return Array.from(codes);
}

export function shouldAutoExpandHolidayCountries(pkg) {
  if (!pkg || typeof pkg !== 'object') return false;
  if (pkg.core?._countryCode) return false;
  if (pkg.countryScope === 'none') return false;
  if (pkg.countryScope === 'all') return true;
  if (pkg.countryScope === 'custom') {
    return pkg.core?.category === 'islamic' && pkg.core?.type === 'hijri';
  }
  return false;
}

export function getHolidayCountryCoverage(pkg) {
  if (shouldAutoExpandHolidayCountries(pkg)) {
    return [...HOLIDAY_COUNTRY_CODES];
  }
  return collectExplicitCountryCodes(pkg);
}

export function getHolidayDistributionKind(pkg) {
  if (shouldAutoExpandHolidayCountries(pkg)) return 'shared';

  const explicitCountryCodes = collectExplicitCountryCodes(pkg);
  if (pkg?.core?._countryCode) return 'country_specific';
  if (explicitCountryCodes.length > 0) return 'selective';
  return 'standalone';
}

export function describeHolidayDistribution(pkg) {
  const kind = getHolidayDistributionKind(pkg);
  const countryCodes = getHolidayCountryCoverage(pkg);

  return {
    kind,
    countryCodes,
    autoExpandCountries: kind === 'shared',
    isShared: kind === 'shared',
    isCountrySpecific: kind === 'country_specific',
  };
}

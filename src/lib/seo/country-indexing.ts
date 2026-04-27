import { GLOBAL_POPULAR_COUNTRIES, PRIORITY_COUNTRY_SLUGS } from '@/lib/db/constants';

export const SEO_PRIORITY_COUNTRY_SLUGS = Array.from(
  new Set([...PRIORITY_COUNTRY_SLUGS, ...GLOBAL_POPULAR_COUNTRIES]),
);

const SEO_PRIORITY_COUNTRY_SLUG_SET = new Set(SEO_PRIORITY_COUNTRY_SLUGS);

export const GEO_SEO_SCOPE = {
  ALL: 'all',
  PRIORITY: 'priority',
} as const;

type GeoSeoScope = typeof GEO_SEO_SCOPE[keyof typeof GEO_SEO_SCOPE];

export const GEO_ROUTE_INDEXING_POLICIES = {
  dateCountry: {
    countryScope: GEO_SEO_SCOPE.PRIORITY,
  },
  prayerTimes: {
    countryScope: GEO_SEO_SCOPE.PRIORITY,
    cityScope: GEO_SEO_SCOPE.PRIORITY,
  },
  timeNow: {
    countryScope: GEO_SEO_SCOPE.PRIORITY,
    cityScope: GEO_SEO_SCOPE.PRIORITY,
  },
} as const;

export function isSeoPriorityCountrySlug(slug: string | null | undefined) {
  const normalizedSlug = String(slug || '').trim().toLowerCase();
  return Boolean(normalizedSlug) && SEO_PRIORITY_COUNTRY_SLUG_SET.has(normalizedSlug);
}

export function isSeoIndexableCountrySlug(
  slug: string | null | undefined,
  { scope = GEO_SEO_SCOPE.PRIORITY }: { scope?: GeoSeoScope } = {},
) {
  const normalizedSlug = String(slug || '').trim().toLowerCase();
  if (!normalizedSlug) return false;
  if (scope === GEO_SEO_SCOPE.ALL) return true;
  return isSeoPriorityCountrySlug(normalizedSlug);
}

export function isSeoIndexableCityParams(
  row: { country?: string | null; city?: string | null } | null | undefined,
  {
    countryScope = GEO_SEO_SCOPE.PRIORITY,
    cityScope = GEO_SEO_SCOPE.PRIORITY,
  }: { countryScope?: GeoSeoScope; cityScope?: GeoSeoScope } = {},
) {
  const country = String(row?.country || '').trim().toLowerCase();
  const city = String(row?.city || '').trim().toLowerCase();

  if (!country || !city) return false;
  if (cityScope === GEO_SEO_SCOPE.ALL) {
    return isSeoIndexableCountrySlug(country, { scope: countryScope });
  }
  return isSeoIndexableCountrySlug(country, { scope: countryScope });
}

export function selectSeoCountrySlugs(
  slugs: Array<string | null | undefined>,
  { scope = GEO_SEO_SCOPE.PRIORITY }: { scope?: GeoSeoScope } = {},
) {
  const seen = new Set<string>();

  return slugs.filter((slug): slug is string => {
    const normalizedSlug = String(slug || '').trim().toLowerCase();
    if (!normalizedSlug || seen.has(normalizedSlug)) return false;
    if (!isSeoIndexableCountrySlug(normalizedSlug, { scope })) {
      return false;
    }
    seen.add(normalizedSlug);
    return true;
  });
}

export function selectSeoCityParams<
  T extends { country?: string | null; city?: string | null },
>(
  rows: T[],
  {
    countryScope = GEO_SEO_SCOPE.PRIORITY,
    cityScope = GEO_SEO_SCOPE.PRIORITY,
  }: { countryScope?: GeoSeoScope; cityScope?: GeoSeoScope } = {},
) {
  const seen = new Set<string>();

  return rows.filter((row) => (
    (() => {
      const country = String(row?.country || '').trim().toLowerCase();
      const city = String(row?.city || '').trim().toLowerCase();
      const key = `${country}::${city}`;

      if (!country || !city || seen.has(key)) return false;
      if (!isSeoIndexableCityParams(row, { countryScope, cityScope })) {
        return false;
      }

      seen.add(key);
      return true;
    })()
  ));
}

export function filterSeoPriorityCountrySlugs(slugs: Array<string | null | undefined>) {
  return selectSeoCountrySlugs(slugs, { scope: GEO_SEO_SCOPE.PRIORITY });
}

export function filterSeoPriorityCityParams<
  T extends { country?: string | null; city?: string | null },
>(rows: T[]) {
  return selectSeoCityParams(rows, { countryScope: GEO_SEO_SCOPE.PRIORITY });
}

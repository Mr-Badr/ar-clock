import { GLOBAL_POPULAR_COUNTRIES, PRIORITY_COUNTRY_SLUGS } from '@/lib/db/constants';

export const SEO_PRIORITY_COUNTRY_SLUGS = Array.from(
  new Set([...PRIORITY_COUNTRY_SLUGS, ...GLOBAL_POPULAR_COUNTRIES]),
);

const SEO_PRIORITY_COUNTRY_SLUG_SET = new Set(SEO_PRIORITY_COUNTRY_SLUGS);

export function isSeoPriorityCountrySlug(slug: string | null | undefined) {
  const normalizedSlug = String(slug || '').trim().toLowerCase();
  return Boolean(normalizedSlug) && SEO_PRIORITY_COUNTRY_SLUG_SET.has(normalizedSlug);
}

export function filterSeoPriorityCountrySlugs(slugs: Array<string | null | undefined>) {
  const seen = new Set<string>();

  return slugs.filter((slug): slug is string => {
    const normalizedSlug = String(slug || '').trim().toLowerCase();
    if (!normalizedSlug || seen.has(normalizedSlug)) return false;
    if (!SEO_PRIORITY_COUNTRY_SLUG_SET.has(normalizedSlug)) return false;
    seen.add(normalizedSlug);
    return true;
  });
}

export function filterSeoPriorityCityParams<
  T extends { country?: string | null; city?: string | null },
>(rows: T[]) {
  return rows.filter((row) => (
    Boolean(row?.city)
    && isSeoPriorityCountrySlug(row?.country)
  ));
}

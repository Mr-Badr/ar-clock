export function normalizeHolidayFilter(filter = {}) {
  return {
    category: filter?.category || 'all',
    countryCode: filter?.countryCode || filter?.country || 'all',
    search: filter?.search || filter?.q || '',
    timeRange: filter?.timeRange || filter?.range || 'all',
  };
}

export function buildHolidayQueryString(filter = {}) {
  const normalized = normalizeHolidayFilter(filter);
  const params = new URLSearchParams();

  if (normalized.category !== 'all') params.set('category', normalized.category);
  if (normalized.countryCode !== 'all') params.set('country', normalized.countryCode);
  if (normalized.search.trim()) params.set('q', normalized.search.trim());
  if (normalized.timeRange !== 'all') params.set('range', normalized.timeRange);

  return params.toString();
}

export function readFiltersFromSearchParams(searchParams) {
  return normalizeHolidayFilter({
    category: searchParams?.get('category') || 'all',
    country: searchParams?.get('country') || 'all',
    q: searchParams?.get('q') || '',
    range: searchParams?.get('range') || 'all',
  });
}

export function sameHolidayFilters(a, b) {
  const left = normalizeHolidayFilter(a);
  const right = normalizeHolidayFilter(b);

  return (
    left.category === right.category &&
    left.countryCode === right.countryCode &&
    left.search === right.search &&
    left.timeRange === right.timeRange
  );
}

export function sortHolidayEvents(events, mode) {
  const sorted = [...events];

  if (mode === 'daysLeft') return sorted.sort((left, right) => left._daysLeft - right._daysLeft);
  if (mode === 'daysLeftDesc') return sorted.sort((left, right) => right._daysLeft - left._daysLeft);

  return sorted.sort((left, right) => left.name.localeCompare(right.name, 'ar'));
}

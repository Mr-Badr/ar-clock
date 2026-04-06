export function buildTimeDifferenceSegment(countrySlug, citySlug) {
  const country = String(countrySlug || '').trim().replace(/^-+|-+$/g, '');
  const city = String(citySlug || '').trim().replace(/^-+|-+$/g, '');

  if (!country || !city) return '';
  return `${country}-${city}`;
}

export function buildTimeDifferenceHref(fromSegment, toSegment) {
  const from = String(fromSegment || '').trim().replace(/^\/+|\/+$/g, '');
  const to = String(toSegment || '').trim().replace(/^\/+|\/+$/g, '');

  if (!from || !to) return '/time-difference';
  return `/time-difference/${from}/${to}`;
}

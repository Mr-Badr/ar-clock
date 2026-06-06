export const CRITICAL_ROUTE_PROBES = Object.freeze([
  { id: 'home', path: '/', label: 'Home' },
  { id: 'blog-hub', path: '/blog', label: 'Blog hub' },
  { id: 'blog-article', path: '/blog/best-nap-length', label: 'Blog article' },
  { id: 'finance-calculator', path: '/calculators/monthly-installment', label: 'Finance calculator' },
  { id: 'holiday-page', path: '/holidays/ramadan', label: 'Holiday page' },
  { id: 'date-calendar', path: '/date/calendar/2026', label: 'Gregorian calendar year' },
  { id: 'date-country', path: '/date/country/saudi-arabia', label: 'Country date page' },
  { id: 'time-country', path: '/time-now/saudi-arabia', label: 'Country time page' },
  { id: 'prayer-city', path: '/mwaqit-al-salat/saudi-arabia/riyadh', label: 'Prayer city page' },
  { id: 'time-difference', path: '/time-difference/saudi-arabia-riyadh/egypt-cairo', label: 'Time difference page' },
  {
    id: 'invalid-time-city-placeholder',
    path: '/time-now/china/%5Bcity%5D',
    label: 'Invalid time city placeholder',
    expectedStatus: 404,
  },
  {
    id: 'invalid-prayer-city-placeholder',
    path: '/mwaqit-al-salat/china/%5Bcity%5D',
    label: 'Invalid prayer city placeholder',
    expectedStatus: 404,
  },
  {
    id: 'invalid-time-difference-placeholder',
    path: '/time-difference/saudi-arabia-riyadh/%5Bto%5D',
    label: 'Invalid time difference placeholder',
    expectedStatus: 404,
  },
  {
    id: 'invalid-date-placeholder',
    path: '/date/2026/%5Bmonth%5D/%5Bday%5D',
    label: 'Invalid date placeholder',
    expectedStatus: 404,
  },
]);

const ROUTE_ERROR_MARKERS = Object.freeze([
  'data-route-status="route-segment-error"',
  'data-route-status="app-error"',
  'data-route-status="global-error"',
  'data-route-status="route-unavailable"',
  'Application error: a server-side exception has occurred',
  'NEXT_HTTP_ERROR_FALLBACK;500',
]);

export function normalizeRouteHealthBaseUrl(baseUrl) {
  const value = String(baseUrl || '').trim();
  if (!value) {
    throw new Error('Route health base URL is required.');
  }

  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function buildRouteProbeUrl(baseUrl, path) {
  const normalizedBase = normalizeRouteHealthBaseUrl(baseUrl);
  const normalizedPath = String(path || '').startsWith('/') ? String(path) : `/${String(path || '')}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function evaluateRouteProbeResponse(input) {
  const status = Number(input?.status || 0);
  const body = String(input?.body || '');
  const expectedStatus = Number(input?.expectedStatus || 200);

  if (status !== expectedStatus) {
    return {
      status: 'fail',
      reason: `unexpected-http-${status || 'unknown'}-expected-${expectedStatus}`,
    };
  }

  if (expectedStatus !== 200) {
    return {
      status: 'ok',
      reason: `blocked-with-http-${expectedStatus}`,
    };
  }

  if (!body.trim()) {
    return {
      status: 'fail',
      reason: 'empty-html-body',
    };
  }

  const matchedMarker = ROUTE_ERROR_MARKERS.find((marker) => body.includes(marker));
  if (matchedMarker) {
    return {
      status: 'fail',
      reason: 'route-rendered-fallback-state',
      marker: matchedMarker,
    };
  }

  if (!body.includes('<main') && !body.includes('<article')) {
    return {
      status: 'warn',
      reason: 'no-primary-content-node-detected',
    };
  }

  if (body.length < 1600) {
    return {
      status: 'warn',
      reason: 'html-body-shorter-than-expected',
    };
  }

  return {
    status: 'ok',
    reason: 'rendered-normally',
  };
}

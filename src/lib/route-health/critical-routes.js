const currentDate = new Date();
const currentGregorianDatePath = [
  '/date',
  String(currentDate.getUTCFullYear()),
  String(currentDate.getUTCMonth() + 1).padStart(2, '0'),
  String(currentDate.getUTCDate()).padStart(2, '0'),
].join('/');

export const CRITICAL_ROUTE_PROBES = Object.freeze([
  { id: 'home', path: '/', label: 'Home' },
  { id: 'blog-hub', path: '/blog', label: 'Blog hub' },
  { id: 'blog-article', path: '/blog/best-nap-length', label: 'Blog article' },
  {
    id: 'calculators-hub',
    path: '/calculators',
    label: 'Calculators hub',
    minimumBodyBytes: 10000,
    requiredMarkers: ['حاسبات عربية تجيب عن سؤالك مباشرة', '/calculators/age', '/calculators/vat'],
    forbiddenMarkers: ['content="noindex'],
  },
  {
    id: 'finance-calculator',
    path: '/calculators/monthly-installment',
    label: 'Finance calculator',
    minimumBodyBytes: 10000,
    requiredMarkers: ['حاسبة القسط الشهري', 'كم قسط القرض الشخصي والتمويل العقاري'],
    forbiddenMarkers: ['content="noindex'],
  },
  {
    id: 'age-calculator',
    path: '/calculators/age',
    label: 'Age calculator',
    minimumBodyBytes: 10000,
    requiredMarkers: ['حاسبة العمر', 'احسب عمرك الان'],
    forbiddenMarkers: ['content="noindex'],
  },
  {
    id: 'vat-calculator',
    path: '/calculators/vat',
    label: 'VAT calculator',
    minimumBodyBytes: 10000,
    requiredMarkers: ['حاسبة ضريبة القيمة المضافة', 'إضافة واستخراج — السعودية والإمارات'],
    forbiddenMarkers: ['content="noindex'],
  },
  {
    id: 'percentage-calculator',
    path: '/calculators/percentage',
    label: 'Percentage calculator',
    minimumBodyBytes: 10000,
    requiredMarkers: ['حاسبة النسبة المئوية', 'الخصم والزيادة ونسبة التغيير'],
    forbiddenMarkers: ['content="noindex'],
  },
  {
    id: 'sleep-calculators',
    path: '/calculators/sleep',
    label: 'Sleep calculators',
    minimumBodyBytes: 10000,
    requiredMarkers: ['حاسبات النوم الذكي', '/calculators/sleep/bedtime'],
    forbiddenMarkers: ['content="noindex'],
  },
  {
    id: 'cement-calculator',
    path: '/calculators/building/cement',
    label: 'Cement calculator',
    minimumBodyBytes: 10000,
    requiredMarkers: ['حاسبة الأسمنت والخرسانة', 'الأكياس والرمل والحصى'],
    forbiddenMarkers: ['content="noindex'],
  },
  {
    id: 'holidays-hub',
    path: '/holidays',
    label: 'Holidays hub',
    minimumBodyBytes: 10000,
    requiredMarkers: ['المناسبات القادمة والعدّ التنازلي', 'رمضان', 'اليوم الوطني'],
    forbiddenMarkers: ['content="noindex'],
  },
  {
    id: 'holiday-page',
    path: '/holidays/ramadan',
    label: 'Holiday page',
    minimumBodyBytes: 10000,
    requiredMarkers: ['كم باقي على رمضان', 'FAQPage'],
    forbiddenMarkers: ['content="noindex'],
  },
  {
    id: 'holiday-national-day-page',
    path: '/holidays/kuwait-national-day',
    label: 'Holiday national day page',
    minimumBodyBytes: 10000,
    requiredMarkers: ['كم باقي على اليوم الوطني الكويتي', 'FAQPage'],
    forbiddenMarkers: ['content="noindex'],
  },
  {
    id: 'holidays-sitemap',
    path: '/holidays/sitemap.xml',
    label: 'Holidays sitemap',
    expectedContentType: 'application/xml',
    minimumBodyBytes: 1000,
    requiredMarkers: ['/holidays/ramadan', '/holidays/eid-al-fitr'],
  },
  {
    id: 'date-calendar',
    path: '/date/calendar/2026',
    label: 'Gregorian calendar year',
    requiredMarkers: ['تقويم عام 2026 ميلادي', 'date-month-panel'],
  },
  {
    id: 'date-hijri-calendar-history',
    path: '/date/calendar/hijri/1441',
    label: 'Historical Hijri calendar year',
    requiredMarkers: [
      'التقويم الهجري لعام 1441 هـ',
      'date-month-panel',
      '/date/hijri/1441/12/',
      'content="noindex',
    ],
  },
  {
    id: 'date-gregorian-current-day',
    path: currentGregorianDatePath,
    label: 'Current Gregorian day',
    requiredMarkers: ['/date/calendar/'],
    forbiddenMarkers: ['content="noindex'],
  },
  {
    id: 'date-gregorian-first-supported-day',
    path: '/date/1924/01/01',
    label: 'First supported Gregorian day',
    requiredMarkers: ['1 يناير 1924 يوافق', '/date/calendar/1924', 'content="noindex'],
  },
  {
    id: 'date-gregorian-future-day',
    path: '/date/2077/12/31',
    label: 'Last supported Gregorian day',
    requiredMarkers: ['31 ديسمبر 2077 يوافق', '/date/calendar/2077', 'content="noindex'],
  },
  {
    id: 'date-hijri-first-supported-day',
    path: '/date/hijri/1343/01/01',
    label: 'First supported Hijri day',
    requiredMarkers: ['1 محرم 1343 هجري يوافق', '/date/calendar/hijri/1343', 'content="noindex'],
  },
  {
    id: 'date-hijri-future-day',
    path: '/date/hijri/1500/12/30',
    label: 'Last supported Hijri day',
    requiredMarkers: ['30 ذو الحجة 1500 هجري يوافق', '/date/calendar/hijri/1500', 'content="noindex'],
  },
  {
    id: 'date-gregorian-rolling-sitemap',
    path: '/date/gregorian/sitemap.xml',
    label: 'Gregorian rolling sitemap',
    expectedContentType: 'application/xml',
    minimumBodyBytes: 1000,
    requiredMarkers: ['/date/'],
  },
  {
    id: 'date-hijri-rolling-sitemap',
    path: '/date/hijri/sitemap.xml',
    label: 'Hijri rolling sitemap',
    expectedContentType: 'application/xml',
    minimumBodyBytes: 1000,
    requiredMarkers: ['/date/hijri/'],
  },
  { id: 'date-country', path: '/date/country/saudi-arabia', label: 'Country date page' },
  { id: 'time-country', path: '/time-now/saudi-arabia', label: 'Country time page' },
  { id: 'prayer-city', path: '/mwaqit-al-salat/saudi-arabia/riyadh', label: 'Prayer city page' },
  { id: 'time-difference', path: '/time-difference/saudi-arabia-riyadh/egypt-cairo', label: 'Time difference page' },
  {
    id: 'time-city-og-image',
    path: '/time-now/egypt/suez/opengraph-image',
    label: 'Time city Open Graph image',
    expectedContentType: 'image/png',
    minimumBodyBytes: 1000,
  },
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
  'data-route-status="calendar-section-error"',
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

export function resolveRouteProbeOrigin(requestUrl, nodeEnv, portValue) {
  const requestOrigin = new URL(requestUrl).origin;
  if (nodeEnv !== 'production') return requestOrigin;

  const port = Number(portValue);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new TypeError(`PORT must be a valid TCP port for production route probes; received "${String(portValue)}".`);
  }

  return `http://127.0.0.1:${port}`;
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
  const contentType = String(input?.contentType || '').toLowerCase();
  const expectedContentType = String(input?.expectedContentType || '').toLowerCase();
  const bodyByteLength = Number(input?.bodyByteLength || new TextEncoder().encode(body).byteLength);
  const minimumBodyBytes = Number(input?.minimumBodyBytes || 0);
  const requiredMarkers = Array.isArray(input?.requiredMarkers) ? input.requiredMarkers : [];
  const forbiddenMarkers = Array.isArray(input?.forbiddenMarkers) ? input.forbiddenMarkers : [];

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

  if (expectedContentType && !contentType.startsWith(expectedContentType)) {
    return {
      status: 'fail',
      reason: `unexpected-content-type-${contentType || 'missing'}`,
    };
  }

  if (minimumBodyBytes > 0 && bodyByteLength < minimumBodyBytes) {
    return {
      status: 'fail',
      reason: `body-shorter-than-${minimumBodyBytes}-bytes`,
    };
  }

  const expectsTextBody = expectedContentType.startsWith('text/')
    || expectedContentType.includes('json')
    || expectedContentType.includes('xml');
  if ((!expectedContentType || expectsTextBody) && !body.trim()) {
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

  const missingMarker = requiredMarkers.find((marker) => !body.includes(marker));
  if (missingMarker) {
    return {
      status: 'fail',
      reason: 'required-content-marker-missing',
      marker: missingMarker,
    };
  }

  const forbiddenMarker = forbiddenMarkers.find((marker) => body.includes(marker));
  if (forbiddenMarker) {
    return {
      status: 'fail',
      reason: 'forbidden-content-marker-found',
      marker: forbiddenMarker,
    };
  }

  if (expectedContentType && !expectedContentType.startsWith('text/html')) {
    return {
      status: 'ok',
      reason: 'binary-response-rendered-normally',
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

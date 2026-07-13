import { NextRequest, NextResponse } from 'next/server';

import fallbackCities from '@/lib/db/fallback/cities-index.json';
import fallbackCountries from '@/lib/db/fallback/countries.json';
import {
  hasDynamicRouteToken,
  validateRouteSlug,
} from '@/lib/route-param-validation';
import { getHijriMonthDays } from '@/lib/date-adapter';
import snapshotCities from '../public/geo/city-search-index.json';
import snapshotCountries from '../public/geo/countries.json';

const PUBLIC_FILE_PATTERN: RegExp = /\.[a-z0-9]{2,12}$/i;
const GREGORIAN_DATE_MIN_YEAR: number = 1924;
const GREGORIAN_DATE_MAX_YEAR: number = 2077;
const HIJRI_DATE_MIN_YEAR: number = 1343;
const HIJRI_DATE_MAX_YEAR: number = 1500;
const TIME_DIFFERENCE_CITY_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  'united-states:new-york': 'new-york-city',
});
const SKIPPED_PREFIXES: readonly string[] = Object.freeze([
  '/_next/',
  '/api/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/ads.txt',
  '/manifest.webmanifest',
]);
const DATE_STATIC_ROUTES: ReadonlySet<string> = new Set([
  'converter',
  'gregorian-to-hijri',
  'hijri-to-gregorian',
  'hijri-months',
]);
const PRAYER_STATIC_ROUTES: ReadonlySet<string> = new Set([
  'last-third-of-night',
  'duha-prayer-time',
  'friday-response-hour',
  'white-days',
  'prayer-times-calculation-method',
]);
const DATE_TODAY_ROUTES: ReadonlySet<string> = new Set(['gregorian', 'hijri']);
const DATE_SITEMAP_ROUTES: ReadonlySet<string> = new Set(['static', 'calendars', 'countries']);

type CountryRouteRow = {
  country_slug?: unknown;
  slug?: unknown;
};

type CityRouteRow = {
  city_slug?: unknown;
  country_slug?: unknown;
};

function normalizeRouteSlugValue(value: unknown): string | null {
  const result = validateRouteSlug(value);
  return result.valid ? result.value : null;
}

function buildCountrySlugSet(rows: readonly CountryRouteRow[]): ReadonlySet<string> {
  return new Set(
    rows
      .map((row) => normalizeRouteSlugValue(row.country_slug || row.slug))
      .filter((slug): slug is string => Boolean(slug)),
  );
}

function buildCityPairSet(rows: readonly CityRouteRow[]): ReadonlySet<string> {
  return new Set(
    rows
      .map((row) => {
        const countrySlug = normalizeRouteSlugValue(row.country_slug);
        const citySlug = normalizeRouteSlugValue(row.city_slug);
        return countrySlug && citySlug ? `${countrySlug}::${citySlug}` : null;
      })
      .filter((pair): pair is string => Boolean(pair)),
  );
}

const COUNTRY_SLUGS: ReadonlySet<string> = buildCountrySlugSet([
  ...(fallbackCountries as CountryRouteRow[]),
  ...(snapshotCountries as CountryRouteRow[]),
]);
const CITY_PAIRS: ReadonlySet<string> = buildCityPairSet([
  ...(fallbackCities as CityRouteRow[]),
  ...(snapshotCities as CityRouteRow[]),
]);

function isSkippedPath(pathname: string): boolean {
  if (SKIPPED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))) {
    return true;
  }

  return PUBLIC_FILE_PATTERN.test(pathname);
}

function getPathSegments(pathname: string): string[] {
  return pathname.split('/').filter(Boolean);
}

function isKnownCountrySlug(countrySlug: string): boolean {
  return COUNTRY_SLUGS.has(countrySlug);
}

function isKnownCityPair(countrySlug: string, citySlug: string): boolean {
  return CITY_PAIRS.has(`${countrySlug}::${citySlug}`);
}

function getTimeDifferenceCityCandidates(countrySlug: string, citySlug: string): string[] {
  const alias = TIME_DIFFERENCE_CITY_ALIASES[`${countrySlug}:${citySlug}`];
  const cityVariant = citySlug.endsWith('-city')
    ? citySlug.replace(/-city$/, '')
    : `${citySlug}-city`;

  return Array.from(new Set([citySlug, alias, cityVariant].filter((value): value is string => Boolean(value))));
}

function isKnownTimeDifferenceSegment(segment: string): boolean {
  const normalizedSegment = normalizeRouteSlugValue(segment);
  if (!normalizedSegment || !normalizedSegment.includes('-')) {
    return false;
  }

  const matchingCountrySlugs = Array.from(COUNTRY_SLUGS)
    .filter((countrySlug) => normalizedSegment === countrySlug || normalizedSegment.startsWith(`${countrySlug}-`))
    .sort((left, right) => right.length - left.length);

  for (const countrySlug of matchingCountrySlugs) {
    const citySlug = normalizedSegment.slice(countrySlug.length).replace(/^-/, '');
    if (!citySlug) {
      continue;
    }

    const isKnownCandidate = getTimeDifferenceCityCandidates(countrySlug, citySlug)
      .some((candidateCitySlug) => isKnownCityPair(countrySlug, candidateCitySlug));
    if (isKnownCandidate) {
      return true;
    }
  }

  return false;
}

function isTimeNowPathValid(segments: string[]): boolean {
  if (segments.length === 1) {
    return true;
  }

  if (segments.length === 2) {
    const countrySlug = normalizeRouteSlugValue(segments[1]);
    return Boolean(countrySlug && isKnownCountrySlug(countrySlug));
  }

  if (segments.length === 3) {
    const countrySlug = normalizeRouteSlugValue(segments[1]);
    const citySlug = normalizeRouteSlugValue(segments[2]);
    return Boolean(
      countrySlug
      && (
        segments[2] === 'opengraph-image'
        || (citySlug && isKnownCityPair(countrySlug, citySlug))
      ),
    );
  }

  if (segments.length === 4) {
    const countrySlug = normalizeRouteSlugValue(segments[1]);
    const citySlug = normalizeRouteSlugValue(segments[2]);
    return Boolean(
      countrySlug
      && citySlug
      && isKnownCityPair(countrySlug, citySlug)
      && segments[3] === 'opengraph-image',
    );
  }

  return false;
}

function isPrayerPathValid(segments: string[]): boolean {
  if (segments.length === 1) {
    return true;
  }

  if (segments.length === 2 && PRAYER_STATIC_ROUTES.has(segments[1])) {
    return true;
  }

  if (segments.length === 2) {
    const countrySlug = normalizeRouteSlugValue(segments[1]);
    return Boolean(countrySlug && isKnownCountrySlug(countrySlug));
  }

  if (segments.length === 3) {
    const countrySlug = normalizeRouteSlugValue(segments[1]);
    const citySlug = normalizeRouteSlugValue(segments[2]);
    return Boolean(countrySlug && citySlug && isKnownCityPair(countrySlug, citySlug));
  }

  if (segments.length === 4) {
    const countrySlug = normalizeRouteSlugValue(segments[1]);
    const citySlug = normalizeRouteSlugValue(segments[2]);
    return Boolean(
      countrySlug
      && citySlug
      && isKnownCityPair(countrySlug, citySlug)
      && segments[3] === 'opengraph-image',
    );
  }

  return false;
}

function isTimeDifferencePathValid(segments: string[]): boolean {
  if (segments.length === 1) {
    return true;
  }

  if (segments.length !== 3) {
    return false;
  }

  return isKnownTimeDifferenceSegment(segments[1]) && isKnownTimeDifferenceSegment(segments[2]);
}

function parseNumericSegment(value: string, minimum: number, maximum: number, maxDigits: number): number | null {
  if (value.length < 1 || value.length > maxDigits || !/^\d+$/.test(value)) {
    return null;
  }

  const numericValue = Number.parseInt(value, 10);
  if (numericValue < minimum || numericValue > maximum) {
    return null;
  }

  return numericValue;
}

function isGregorianDateShapeValid(yearSegment: string, monthSegment: string, daySegment: string): boolean {
  const year = parseNumericSegment(yearSegment, GREGORIAN_DATE_MIN_YEAR, GREGORIAN_DATE_MAX_YEAR, 4);
  const month = parseNumericSegment(monthSegment, 1, 12, 2);
  const day = parseNumericSegment(daySegment, 1, 31, 2);
  if (year === null || month === null || day === null) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() + 1 === month
    && date.getUTCDate() === day;
}

function isHijriDateShapeValid(yearSegment: string, monthSegment: string, daySegment: string): boolean {
  const year = parseNumericSegment(yearSegment, HIJRI_DATE_MIN_YEAR, HIJRI_DATE_MAX_YEAR, 4);
  const month = parseNumericSegment(monthSegment, 1, 12, 2);
  const day = parseNumericSegment(daySegment, 1, 30, 2);
  if (year === null || month === null || day === null) {
    return false;
  }

  return day <= getHijriMonthDays(year, month);
}

function isGregorianCalendarYearValid(yearSegment: string): boolean {
  return parseNumericSegment(
    yearSegment,
    GREGORIAN_DATE_MIN_YEAR,
    GREGORIAN_DATE_MAX_YEAR,
    4,
  ) !== null;
}

function isHijriCalendarYearValid(yearSegment: string): boolean {
  return parseNumericSegment(
    yearSegment,
    HIJRI_DATE_MIN_YEAR,
    HIJRI_DATE_MAX_YEAR,
    4,
  ) !== null;
}

function isDatePathValid(segments: string[]): boolean {
  if (segments.length === 1) {
    return true;
  }

  if (segments.length === 2 && DATE_STATIC_ROUTES.has(segments[1])) {
    return true;
  }

  if (segments[1] === 'today') {
    if (segments.length === 2) {
      return true;
    }

    return segments.length === 3 && DATE_TODAY_ROUTES.has(segments[2]);
  }

  if (segments[1] === 'country') {
    if (segments.length === 2) {
      return true;
    }

    if (segments.length === 3) {
      const countrySlug = normalizeRouteSlugValue(segments[2]);
      return Boolean(countrySlug && isKnownCountrySlug(countrySlug));
    }

    return false;
  }

  if (segments[1] === 'calendar') {
    if (segments.length === 2) {
      return true;
    }

    if (segments[2] === 'hijri' && segments.length === 3) {
      return true;
    }

    if (segments[2] === 'hijri' && segments.length === 4) {
      return isHijriCalendarYearValid(segments[3]);
    }

    if (segments.length === 3) {
      return isGregorianCalendarYearValid(segments[2]);
    }

    return false;
  }

  if (segments[1] === 'sitemaps') {
    return segments.length === 3 && DATE_SITEMAP_ROUTES.has(segments[2]);
  }

  if (segments[1] === 'gregorian' && segments[2] === 'sitemap' && segments.length === 4) {
    return isGregorianCalendarYearValid(segments[3]);
  }

  if (segments[1] === 'hijri' && segments[2] === 'sitemap' && segments.length === 4) {
    return isHijriCalendarYearValid(segments[3]);
  }

  if (segments[1] === 'hijri' && segments.length === 5) {
    return isHijriDateShapeValid(segments[2], segments[3], segments[4]);
  }

  if (segments.length === 4) {
    return isGregorianDateShapeValid(segments[1], segments[2], segments[3]);
  }

  return false;
}

function shouldBlockPath(pathname: string): boolean {
  if (isSkippedPath(pathname)) {
    return false;
  }

  const segments = getPathSegments(pathname);
  if (segments.some((segment) => hasDynamicRouteToken(segment))) {
    return true;
  }

  if (segments[0] === 'time-now') {
    return !isTimeNowPathValid(segments);
  }

  if (segments[0] === 'mwaqit-al-salat') {
    return !isPrayerPathValid(segments);
  }

  if (segments[0] === 'time-difference') {
    return !isTimeDifferencePathValid(segments);
  }

  if (segments[0] === 'date') {
    return !isDatePathValid(segments);
  }

  return false;
}

function createBlockedRouteResponse(pathname: string): NextResponse {
  const safePathname = pathname.replaceAll('<', '').replaceAll('>', '');
  const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>الصفحة غير موجودة | ميقاتنا</title><meta name="description" content="هذا الرابط غير صالح أو خارج النطاق المدعوم في ميقاتنا."></head><body style="margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f7f8f5;color:#111827"><main style="min-height:100vh;display:grid;place-items:center;padding:32px"><section style="width:min(100%,720px);background:#fffdf9;border:1px solid #dde5e2;border-radius:22px;padding:32px;box-shadow:0 6px 18px rgba(17,24,39,.08)"><p style="margin:0 0 12px;color:#697586;font-weight:700">رابط غير قابل للفهرسة</p><h1 style="margin:0 0 16px;font-size:clamp(28px,5vw,40px);line-height:1.25">الصفحة غير موجودة</h1><p style="margin:0 0 16px;font-size:18px;line-height:1.9;color:#44515f">الرابط المطلوب غير صالح، أو خارج النطاق المدعوم، أو يحتوي على جزء ديناميكي غير مكتمل. أعدنا هذه الصفحة كخطأ 404 واضح حتى لا تتحول إلى نتيجة بحث ضعيفة أو صفحة فارغة.</p><p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#697586" dir="ltr">${safePathname}</p><nav aria-label="مسارات بديلة" style="display:flex;flex-wrap:wrap;gap:12px"><a href="/" style="display:inline-flex;min-height:44px;align-items:center;border-radius:14px;background:#006d9c;color:white;padding:0 18px;text-decoration:none;font-weight:700">الرئيسية</a><a href="/date" style="display:inline-flex;min-height:44px;align-items:center;border-radius:14px;border:1px solid #dde5e2;color:#111827;padding:0 18px;text-decoration:none;font-weight:700">قسم التاريخ</a><a href="/date/converter" style="display:inline-flex;min-height:44px;align-items:center;border-radius:14px;border:1px solid #dde5e2;color:#111827;padding:0 18px;text-decoration:none;font-weight:700">محول التاريخ</a></nav></section></main></body></html>`;

  return new NextResponse(html, {
    status: 404,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

function shouldNoindexDiscoveryVariant(request: NextRequest): boolean {
  return request.nextUrl.pathname === '/fahras'
    && (request.nextUrl.searchParams.has('q') || request.nextUrl.searchParams.has('tab'));
}

function buildRedirectUrl(request: NextRequest, pathname: string): URL {
  return new URL(pathname, request.url);
}

function getCanonicalDateRedirect(request: NextRequest): URL | null {
  const segments = getPathSegments(request.nextUrl.pathname);

  if (segments[0] === 'date' && segments.length === 4 && isGregorianDateShapeValid(segments[1], segments[2], segments[3])) {
    const month = segments[2].padStart(2, '0');
    const day = segments[3].padStart(2, '0');
    if (month !== segments[2] || day !== segments[3]) {
      return buildRedirectUrl(request, `/date/${segments[1]}/${month}/${day}`);
    }
  }

  if (segments[0] === 'date' && segments[1] === 'hijri' && segments.length === 5 && isHijriDateShapeValid(segments[2], segments[3], segments[4])) {
    const month = segments[3].padStart(2, '0');
    const day = segments[4].padStart(2, '0');
    if (month !== segments[3] || day !== segments[4]) {
      return buildRedirectUrl(request, `/date/hijri/${segments[2]}/${month}/${day}`);
    }
  }

  return null;
}

export function proxy(request: NextRequest): NextResponse {
  if (shouldBlockPath(request.nextUrl.pathname)) {
    return createBlockedRouteResponse(request.nextUrl.pathname);
  }

  const canonicalDateRedirect = getCanonicalDateRedirect(request);
  if (canonicalDateRedirect) {
    return NextResponse.redirect(canonicalDateRedirect, 308);
  }

  const response = NextResponse.next();
  if (shouldNoindexDiscoveryVariant(request)) {
    response.headers.set('x-robots-tag', 'noindex, follow');
  }

  return response;
}

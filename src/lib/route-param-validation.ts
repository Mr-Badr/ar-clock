import { getHijriMonthDays } from '@/lib/date-adapter';

export const ROUTE_SLUG_PATTERN: RegExp = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type InvalidRouteReason =
  | 'not-a-string'
  | 'empty'
  | 'dynamic-token'
  | 'malformed-encoding'
  | 'invalid-format'
  | 'invalid-date';

export type RouteSlugValidationResult =
  | { valid: true; value: string }
  | { valid: false; reason: InvalidRouteReason; value: string };

export type CalendarRouteValidationResult =
  | { valid: true; year: number; month: number; day: number; isoDate: string }
  | { valid: false; reason: InvalidRouteReason; value: string };

type DateRouteSegments = {
  year: unknown;
  month: unknown;
  day: unknown;
};

type NoindexRouteMetadataInput = {
  title: string;
  description: string;
  canonical: string;
};

type NoindexRouteMetadata = {
  title: string;
  description: string;
  alternates: {
    canonical: string;
  };
  robots: {
    index: false;
    follow: false;
    googleBot: {
      index: false;
      follow: false;
    };
  };
};

function stringifyRouteSegment(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function decodeRouteSegment(value: string): RouteSlugValidationResult {
  try {
    return {
      valid: true,
      value: decodeURIComponent(value),
    };
  } catch (error) {
    if (error instanceof URIError) {
      return {
        valid: false,
        reason: 'malformed-encoding',
        value,
      };
    }

    throw error;
  }
}

export function hasDynamicRouteToken(value: unknown): boolean {
  const segment = stringifyRouteSegment(value);
  if (!segment) {
    return false;
  }

  if (segment.includes('[') || segment.includes(']')) {
    return true;
  }

  const decoded = decodeRouteSegment(segment);
  if (!decoded.valid) {
    return false;
  }

  return decoded.value.includes('[') || decoded.value.includes(']');
}

export function validateRouteSlug(value: unknown): RouteSlugValidationResult {
  if (typeof value !== 'string') {
    return {
      valid: false,
      reason: 'not-a-string',
      value: '',
    };
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return {
      valid: false,
      reason: 'empty',
      value: trimmed,
    };
  }

  const decoded = decodeRouteSegment(trimmed);
  if (!decoded.valid) {
    return decoded;
  }

  const normalized = decoded.value.toLowerCase();
  if (hasDynamicRouteToken(normalized)) {
    return {
      valid: false,
      reason: 'dynamic-token',
      value: normalized,
    };
  }

  if (!ROUTE_SLUG_PATTERN.test(normalized)) {
    return {
      valid: false,
      reason: 'invalid-format',
      value: normalized,
    };
  }

  return {
    valid: true,
    value: normalized,
  };
}

export function isRouteSlug(value: unknown): boolean {
  return validateRouteSlug(value).valid;
}

/**
 * Validates that a city record from the geo snapshot / DB is safe to render.
 * A city with missing or invalid timezone / coordinates will produce wrong times
 * or throw during calculation — call notFound() when this returns false.
 */
export function isRenderableCityData(city: unknown): boolean {
  if (!city || typeof city !== 'object') return false;
  const c = city as Record<string, unknown>;
  // Timezone must be a non-empty string that Intl recognises
  if (!c.timezone || typeof c.timezone !== 'string') return false;
  try { new Intl.DateTimeFormat('en', { timeZone: c.timezone as string }); }
  catch { return false; }
  // Coordinates must be finite numbers in valid ranges; (0,0) signals missing data
  const lat = Number(c.lat);
  const lon = Number(c.lon);
  if (!isFinite(lat) || lat < -90 || lat > 90) return false;
  if (!isFinite(lon) || lon < -180 || lon > 180) return false;
  if (lat === 0 && lon === 0) return false;
  return true;
}

function validateTwoDigitNumber(value: unknown, minimum: number, maximum: number): number | null {
  if (typeof value !== 'string' || !/^\d{2}$/.test(value)) {
    return null;
  }

  const numericValue = Number.parseInt(value, 10);
  if (numericValue < minimum || numericValue > maximum) {
    return null;
  }

  return numericValue;
}

function validateFourDigitYear(value: unknown): number | null {
  if (typeof value !== 'string' || !/^\d{4}$/.test(value)) {
    return null;
  }

  return Number.parseInt(value, 10);
}

function buildInvalidCalendarResult(segments: DateRouteSegments, reason: InvalidRouteReason): CalendarRouteValidationResult {
  return {
    valid: false,
    reason,
    value: `${String(segments.year)}/${String(segments.month)}/${String(segments.day)}`,
  };
}

export function validateGregorianDateRouteSegments(segments: DateRouteSegments): CalendarRouteValidationResult {
  if (hasDynamicRouteToken(segments.year) || hasDynamicRouteToken(segments.month) || hasDynamicRouteToken(segments.day)) {
    return buildInvalidCalendarResult(segments, 'dynamic-token');
  }

  const year = validateFourDigitYear(segments.year);
  const month = validateTwoDigitNumber(segments.month, 1, 12);
  const day = validateTwoDigitNumber(segments.day, 1, 31);

  if (year === null || month === null || day === null) {
    return buildInvalidCalendarResult(segments, 'invalid-format');
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate = date.getUTCFullYear() === year
    && date.getUTCMonth() + 1 === month
    && date.getUTCDate() === day;

  if (!isRealDate) {
    return buildInvalidCalendarResult(segments, 'invalid-date');
  }

  const isoDate = [
    String(year),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-');

  return {
    valid: true,
    year,
    month,
    day,
    isoDate,
  };
}

export function validateHijriDateRouteSegments(segments: DateRouteSegments): CalendarRouteValidationResult {
  if (hasDynamicRouteToken(segments.year) || hasDynamicRouteToken(segments.month) || hasDynamicRouteToken(segments.day)) {
    return buildInvalidCalendarResult(segments, 'dynamic-token');
  }

  const year = validateFourDigitYear(segments.year);
  const month = validateTwoDigitNumber(segments.month, 1, 12);
  const day = validateTwoDigitNumber(segments.day, 1, 30);

  if (year === null || month === null || day === null) {
    return buildInvalidCalendarResult(segments, 'invalid-format');
  }

  if (day > getHijriMonthDays(year, month)) {
    return buildInvalidCalendarResult(segments, 'invalid-date');
  }

  const isoDate = [
    String(year),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-');

  return {
    valid: true,
    year,
    month,
    day,
    isoDate,
  };
}

export function buildNoindexRouteMetadata(input: NoindexRouteMetadataInput): NoindexRouteMetadata {
  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: input.canonical,
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

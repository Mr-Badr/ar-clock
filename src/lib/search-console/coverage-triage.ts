import {
  isSeoIndexableGregorianDate,
  isSeoIndexableHijriDate,
} from '@/lib/seo/date-indexing';
import {
  validateGregorianDateRouteSegments,
  validateHijriDateRouteSegments,
} from '@/lib/route-param-validation';

export type CoverageClassification =
  | 'ads-blocker'
  | 'sitemap-blocker'
  | 'fixed-request-validation'
  | 'expected-noindex'
  | 'expected-404'
  | 'redirect-review'
  | 'canonical-review'
  | 'indexable-ok'
  | 'manual-review';

export type CoverageRow = {
  input: string;
  url: string;
  reason: string | null;
};

export type FetchAudit = {
  requestedUrl: string;
  finalUrl: string | null;
  status: number;
  contentType: string | null;
  robotsMeta: string | null;
  xRobotsTag: string | null;
  canonical: string | null;
  title: string | null;
  error: string | null;
};

export type CoverageClassificationResult = {
  classification: CoverageClassification;
  action: string;
  details: string;
};

const ADS_BLOCKING_REASONS = [
  'server error',
  '5xx',
  'redirect error',
  'not found',
  'soft 404',
];

export function normalizeComparableUrl(value: string | null): string | null {
  if (!value) return null;

  const url = new URL(value);
  url.hash = '';
  if (url.pathname !== '/') {
    url.pathname = url.pathname.replace(/\/+$/, '');
  }
  if ((url.protocol === 'https:' && url.port === '443') || (url.protocol === 'http:' && url.port === '80')) {
    url.port = '';
  }
  return url.toString();
}

export function hasNoindex(audit: FetchAudit): boolean {
  const robots = `${audit.robotsMeta || ''},${audit.xRobotsTag || ''}`.toLowerCase();
  return robots.includes('noindex');
}

function hasAdsBlockingReason(reason: string | null): boolean {
  const normalizedReason = String(reason || '').toLowerCase();
  return ADS_BLOCKING_REASONS.some((item) => normalizedReason.includes(item));
}

export function getExpectedNoindexReason(finalUrl: string, now: Date): string | null {
  const pathname = new URL(finalUrl).pathname.replace(/\/+$/, '') || '/';
  const gregorianMatch = pathname.match(/^\/date\/(\d{4})\/(\d{2})\/(\d{2})$/);
  if (gregorianMatch) {
    const routeDate = validateGregorianDateRouteSegments({
      year: gregorianMatch[1],
      month: gregorianMatch[2],
      day: gregorianMatch[3],
    });
    if (routeDate.valid && !isSeoIndexableGregorianDate(routeDate, now)) {
      return 'daily Gregorian date outside the rolling indexing window';
    }
  }

  const hijriMatch = pathname.match(/^\/date\/hijri\/(\d{4})\/(\d{2})\/(\d{2})$/);
  if (hijriMatch) {
    const routeDate = validateHijriDateRouteSegments({
      year: hijriMatch[1],
      month: hijriMatch[2],
      day: hijriMatch[3],
    });
    if (routeDate.valid && !isSeoIndexableHijriDate(routeDate, now)) {
      return 'daily Hijri date outside the rolling indexing window';
    }
  }

  if (pathname === '/offline' || pathname === '/search') {
    return 'utility page intentionally excluded from indexing';
  }

  return null;
}

export function classifyCoverageRow(
  row: CoverageRow,
  audit: FetchAudit,
  inSitemap: boolean,
  now: Date,
): CoverageClassificationResult {
  if (audit.status === 0 || audit.status >= 500) {
    return {
      classification: 'ads-blocker',
      action: 'Fix the production error before submitting this URL to Google Ads or requesting GSC validation.',
      details: audit.error || `Current HTTP status is ${audit.status}.`,
    };
  }

  if (inSitemap && (audit.status !== 200 || hasNoindex(audit))) {
    return {
      classification: 'sitemap-blocker',
      action: 'Remove this URL from the sitemap or make the live page return 200 indexable HTML with a self canonical.',
      details: `Submitted URL currently returns status ${audit.status} with robots "${audit.robotsMeta || audit.xRobotsTag || 'none'}".`,
    };
  }

  if (audit.status === 404 || audit.status === 410) {
    return {
      classification: 'expected-404',
      action: 'Leave it out of sitemaps. In GSC, validate fix if the old report showed 5xx; otherwise ignore as stale invalid discovery.',
      details: `Current status is ${audit.status}; this is not an Ads blocker unless used as an ad final URL.`,
    };
  }

  if (audit.finalUrl && normalizeComparableUrl(audit.requestedUrl) !== normalizeComparableUrl(audit.finalUrl)) {
    return {
      classification: 'redirect-review',
      action: 'Use the final canonical URL in internal links, sitemaps, and Google Ads final URLs.',
      details: `Redirects to ${audit.finalUrl}.`,
    };
  }

  const expectedNoindexReason = audit.finalUrl ? getExpectedNoindexReason(audit.finalUrl, now) : null;
  if (hasNoindex(audit) && expectedNoindexReason) {
    return {
      classification: 'expected-noindex',
      action: 'No code fix needed. Do not request indexing unless the SEO policy changes.',
      details: expectedNoindexReason,
    };
  }

  if (hasNoindex(audit)) {
    return {
      classification: hasAdsBlockingReason(row.reason) ? 'ads-blocker' : 'manual-review',
      action: 'Confirm this page should be excluded. If it is a landing page or sitemap URL, remove noindex.',
      details: `Current robots directive is "${audit.robotsMeta || audit.xRobotsTag || 'noindex'}".`,
    };
  }

  if (audit.canonical && audit.finalUrl && normalizeComparableUrl(audit.canonical) !== normalizeComparableUrl(audit.finalUrl)) {
    return {
      classification: 'canonical-review',
      action: 'Confirm the canonical target is intentional. Use only canonical URLs in sitemaps and Ads.',
      details: `Canonical is ${audit.canonical}.`,
    };
  }

  if (audit.status === 200) {
    return {
      classification: hasAdsBlockingReason(row.reason) ? 'fixed-request-validation' : 'indexable-ok',
      action: hasAdsBlockingReason(row.reason)
        ? 'Request validation in Search Console; the live URL is now healthy.'
        : 'No technical coverage fix needed.',
      details: 'Current live response is indexable.',
    };
  }

  return {
    classification: 'manual-review',
    action: 'Review this URL manually before using it in Ads or requesting indexing.',
    details: `Current HTTP status is ${audit.status}.`,
  };
}

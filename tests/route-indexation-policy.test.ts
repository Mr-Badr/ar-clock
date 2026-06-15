import test from 'node:test';
import assert from 'node:assert/strict';

import { NextRequest } from 'next/server';

import * as proxyModule from '@/proxy';
import {
  evaluateRouteProbeResponse,
  resolveRouteProbeOrigin,
} from '@/lib/route-health/critical-routes';
import {
  type CoverageRow,
  type FetchAudit,
  classifyCoverageRow,
} from '@/lib/search-console/coverage-triage';

function runProxy(pathname: string) {
  const proxy =
    proxyModule.proxy ||
    (proxyModule as unknown as { default?: { proxy?: typeof proxyModule.proxy } }).default?.proxy;
  assert.equal(typeof proxy, 'function', 'proxy export should be available');
  return proxy(new NextRequest(`https://miqatona.com${pathname}`));
}

function buildCoverageRow(url: string, reason: string | null): CoverageRow {
  return {
    input: 'gsc-export.csv',
    url,
    reason,
  };
}

function buildFetchAudit(input: {
  requestedUrl: string;
  finalUrl: string | null;
  status: number;
  robotsMeta: string | null;
  xRobotsTag: string | null;
  canonical: string | null;
  error: string | null;
}): FetchAudit {
  return {
    requestedUrl: input.requestedUrl,
    finalUrl: input.finalUrl,
    status: input.status,
    contentType: 'text/html; charset=utf-8',
    robotsMeta: input.robotsMeta,
    xRobotsTag: input.xRobotsTag,
    canonical: input.canonical,
    title: 'ميقاتنا',
    error: input.error,
  };
}

test('route proxy blocks unknown date paths before they become indexation noise', () => {
  const blockedPaths: string[] = [
    '/date/not-a-real-tool',
    '/date/today/not-a-page',
    '/date/2026/13/01',
    '/date/hijri/1600/01/01',
    '/date/hijri/1441/02/30',
    '/date/country/not-a-country',
  ];

  for (const pathname of blockedPaths) {
    const response = runProxy(pathname);

    assert.equal(response.status, 404, `${pathname} should be blocked`);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  }
});

test('route proxy allows indexable date pages and canonical sitemap endpoints', () => {
  const allowedPaths: string[] = [
    '/date',
    '/date/today',
    '/date/today/gregorian',
    '/date/today/hijri',
    '/date/converter',
    '/date/gregorian-to-hijri',
    '/date/hijri-to-gregorian',
    '/date/calendar/2026',
    '/date/calendar/hijri/1447',
    '/date/2026/05/22',
    '/date/hijri/1447/12/06',
    '/date/gregorian/sitemap/1924',
    '/date/gregorian/sitemap/2077',
    '/date/hijri/sitemap/1343',
    '/date/hijri/sitemap/1500',
    '/date/sitemaps/static',
    '/date/sitemaps/calendars',
    '/date/sitemaps/countries',
  ];

  for (const pathname of allowedPaths) {
    const response = runProxy(pathname);

    assert.notEqual(response.status, 404, `${pathname} should be allowed`);
    assert.notEqual(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  }
});

test('route proxy redirects unpadded date URLs to one canonical day URL', () => {
  const response = runProxy('/date/2026/5/2');

  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), 'https://miqatona.com/date/2026/05/02');
});

test('route health requires configured HTML markers', () => {
  const result = evaluateRouteProbeResponse({
    status: 200,
    body: '<html><body><main>Calendar page</main></body></html>',
    contentType: 'text/html; charset=utf-8',
    requiredMarkers: ['date-month-panel'],
  });

  assert.equal(result.status, 'fail');
  assert.equal(result.reason, 'required-content-marker-missing');
});

test('route health accepts a non-empty PNG response', () => {
  const result = evaluateRouteProbeResponse({
    status: 200,
    body: '',
    bodyByteLength: 4096,
    contentType: 'image/png',
    expectedContentType: 'image/png',
    minimumBodyBytes: 1000,
  });

  assert.equal(result.status, 'ok');
  assert.equal(result.reason, 'binary-response-rendered-normally');
});

test('route health rejects indexable pages that contain noindex metadata', () => {
  const result = evaluateRouteProbeResponse({
    status: 200,
    body: '<html><head><meta name="robots" content="noindex, follow"></head><body><main>Date</main></body></html>',
    contentType: 'text/html; charset=utf-8',
    forbiddenMarkers: ['content="noindex'],
  });

  assert.equal(result.status, 'fail');
  assert.equal(result.reason, 'forbidden-content-marker-found');
});

test('route health accepts usable historical pages with intentional noindex metadata', () => {
  const result = evaluateRouteProbeResponse({
    status: 200,
    body: `<html><head><meta name="robots" content="noindex, follow"></head><body><main>${'Historical date '.repeat(120)}</main></body></html>`,
    contentType: 'text/html; charset=utf-8',
    requiredMarkers: ['content="noindex', 'Historical date'],
  });

  assert.equal(result.status, 'ok');
  assert.equal(result.reason, 'rendered-normally');
});

test('production route health probes the app container directly', () => {
  assert.equal(
    resolveRouteProbeOrigin('https://miqatona.com/api/health', 'production', '3000'),
    'http://127.0.0.1:3000',
  );
});

test('production route health rejects an invalid app port', () => {
  assert.throws(
    () => resolveRouteProbeOrigin('https://miqatona.com/api/health', 'production', undefined),
    /PORT must be a valid TCP port/,
  );
});

test('development route health keeps the request origin', () => {
  assert.equal(
    resolveRouteProbeOrigin('http://localhost:3100/api/health', 'development', undefined),
    'http://localhost:3100',
  );
});

test('GSC coverage triage treats old rolling-window date noindex as expected exclusion', () => {
  const url = 'https://miqatona.com/date/1954/06/16';
  const result = classifyCoverageRow(
    buildCoverageRow(url, 'Excluded by noindex tag'),
    buildFetchAudit({
      requestedUrl: url,
      finalUrl: url,
      status: 200,
      robotsMeta: 'noindex, follow',
      xRobotsTag: null,
      canonical: url,
      error: null,
    }),
    false,
    new Date('2026-06-15T00:00:00.000Z'),
  );

  assert.equal(result.classification, 'expected-noindex');
  assert.match(result.details, /rolling indexing window/);
});

test('GSC coverage triage fails submitted noindex pages as sitemap blockers', () => {
  const url = 'https://miqatona.com/date/1954/06/16';
  const result = classifyCoverageRow(
    buildCoverageRow(url, 'Excluded by noindex tag'),
    buildFetchAudit({
      requestedUrl: url,
      finalUrl: url,
      status: 200,
      robotsMeta: 'noindex, follow',
      xRobotsTag: null,
      canonical: url,
      error: null,
    }),
    true,
    new Date('2026-06-15T00:00:00.000Z'),
  );

  assert.equal(result.classification, 'sitemap-blocker');
});

test('GSC coverage triage separates stale 5xx reports from current live failures', () => {
  const url = 'https://miqatona.com/time-now/kyrgyzstan/bishkek';
  const fixedResult = classifyCoverageRow(
    buildCoverageRow(url, 'Server error (5xx)'),
    buildFetchAudit({
      requestedUrl: url,
      finalUrl: url,
      status: 200,
      robotsMeta: 'index, follow',
      xRobotsTag: null,
      canonical: url,
      error: null,
    }),
    true,
    new Date('2026-06-15T00:00:00.000Z'),
  );
  const failingResult = classifyCoverageRow(
    buildCoverageRow(url, 'Server error (5xx)'),
    buildFetchAudit({
      requestedUrl: url,
      finalUrl: url,
      status: 502,
      robotsMeta: null,
      xRobotsTag: null,
      canonical: null,
      error: null,
    }),
    true,
    new Date('2026-06-15T00:00:00.000Z'),
  );

  assert.equal(fixedResult.classification, 'fixed-request-validation');
  assert.equal(failingResult.classification, 'ads-blocker');
});

test('GSC coverage triage treats invalid discovered typo URLs as expected 404 when absent from sitemap', () => {
  const url = 'https://miqatona.com/time-now/kygyzstan/bishkek';
  const result = classifyCoverageRow(
    buildCoverageRow(url, 'Server error (5xx)'),
    buildFetchAudit({
      requestedUrl: url,
      finalUrl: url,
      status: 404,
      robotsMeta: 'noindex,nofollow',
      xRobotsTag: 'noindex, nofollow',
      canonical: null,
      error: null,
    }),
    false,
    new Date('2026-06-15T00:00:00.000Z'),
  );

  assert.equal(result.classification, 'expected-404');
});

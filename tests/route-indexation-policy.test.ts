import test from 'node:test';
import assert from 'node:assert/strict';

import { NextRequest } from 'next/server';

import * as proxyModule from '@/proxy';

function runProxy(pathname: string) {
  const proxy =
    proxyModule.proxy ||
    (proxyModule as unknown as { default?: { proxy?: typeof proxyModule.proxy } }).default?.proxy;
  assert.equal(typeof proxy, 'function', 'proxy export should be available');
  return proxy(new NextRequest(`https://miqatona.com${pathname}`));
}

test('route proxy blocks unknown date paths before they become indexation noise', () => {
  const blockedPaths: string[] = [
    '/date/not-a-real-tool',
    '/date/today/not-a-page',
    '/date/2026/13/01',
    '/date/hijri/1600/01/01',
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

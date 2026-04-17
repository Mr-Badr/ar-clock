import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatona.com';

import manifest from '@/data/holidays/generated/manifest.json';
import { GENERATED_ALIAS_META_BY_SLUG } from '@/lib/events/generated-aliases';
import calculatorsSitemap from '@/app/calculators/sitemap';
import economySitemap from '@/app/economie/sitemap';
import holidaysSitemap from '@/app/holidays/sitemap';
import rootSitemap from '@/app/sitemap';
import { GET as sitemapIndexRoute } from '@/app/sitemap-index.xml/route';
import robots from '@/app/robots';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import { COUNTRY_LIST } from '@/lib/calculators/building/country-data';

test('holiday sitemap contains published canonical events and their routable aliases', async () => {
  const sitemap = await holidaysSitemap();
  const publishedCanonicalSlugs = (manifest.events || [])
    .filter((row) => ['published', 'monitored'].includes(row.publishStatus))
    .map((row) => row.slug)
    .sort();
  const publishedCanonicalSet = new Set(publishedCanonicalSlugs);
  const publishedAliasSlugs = Object.entries(GENERATED_ALIAS_META_BY_SLUG || {})
    .filter(([, meta]) => meta?.canonicalSlug && publishedCanonicalSet.has(meta.canonicalSlug))
    .map(([slug]) => slug)
    .sort();
  const expectedSlugs = [...publishedCanonicalSlugs, ...publishedAliasSlugs].sort();

  const sitemapSlugs = sitemap
    .map((row) => String(row.url).split('/holidays/')[1])
    .filter(Boolean)
    .sort();

  assert.deepEqual(sitemapSlugs, expectedSlugs);
});

test('holiday sitemap only includes aliases for published canonicals', async () => {
  const sitemap = await holidaysSitemap();
  const urls = sitemap.map((row) => String(row.url));
  const publishedCanonicalSet = new Set(
    (manifest.events || [])
      .filter((row) => ['published', 'monitored'].includes(row.publishStatus))
      .map((row) => row.slug),
  );
  const aliasEntries = Object.entries(GENERATED_ALIAS_META_BY_SLUG || {});

  for (const [aliasSlug, meta] of aliasEntries) {
    const shouldAppear = publishedCanonicalSet.has(meta?.canonicalSlug);
    assert.equal(
      urls.some((url) => url.endsWith(`/holidays/${aliasSlug}`)),
      shouldAppear,
      `alias slug ${aliasSlug} should ${shouldAppear ? '' : 'not '}appear in sitemap`,
    );
  }
});

test('holiday sitemap urls use site base url and valid lastModified values', async () => {
  const sitemap = await holidaysSitemap();
  const base = getSiteUrl();

  for (const row of sitemap) {
    assert.ok(String(row.url).startsWith(`${base}/holidays/`));
    assert.equal(Number.isNaN(Date.parse(String(row.lastModified))), false);
  }
});

test('root sitemap includes key static pages', async () => {
  const sitemap = await rootSitemap();
  const base = getSiteUrl();
  const expectedPaths: string[] = [
    '/',
    '/time-now',
    '/mwaqit-al-salat',
    '/holidays',
    '/time-difference',
    '/calculators',
    '/map',
    '/about',
    '/editorial-policy',
    '/terms',
    '/disclaimer',
    '/privacy',
    '/contact',
  ];
  for (const expectedPath of expectedPaths) {
    assert.equal(
      sitemap.some((row) => row.url === `${base}${expectedPath}`),
      true,
      `${expectedPath} should appear in the root sitemap`,
    );
  }

  assert.equal(
    sitemap.some((row) => row.url === `${base}/calculators/age`),
    false,
    '/calculators/age should be covered by the calculators sitemap, not duplicated in the root sitemap',
  );
});

test('calculators sitemap includes hub and detail routes', async () => {
  const sitemap = await calculatorsSitemap();
  const base = getSiteUrl();
  const staticPaths: string[] = [
    '/calculators',
    '/calculators/age',
    '/calculators/age/calculator',
    '/calculators/age/hijri',
    '/calculators/age/difference',
    '/calculators/age/birth-day',
    '/calculators/age/milestones',
    '/calculators/age/planets',
    '/calculators/age/countdown',
    '/calculators/age/retirement',
    '/calculators/end-of-service-benefits',
    '/calculators/monthly-installment',
    '/calculators/vat',
    '/calculators/percentage',
    '/calculators/building',
    '/calculators/building/cement',
    '/calculators/building/rebar',
    '/calculators/building/tiles',
  ];
  const countryPaths = COUNTRY_LIST.map((country) => `/calculators/building/${country.slug}`);
  const expectedPaths = [...staticPaths, ...countryPaths];

  assert.equal(sitemap.length, expectedPaths.length);

  for (const expectedPath of expectedPaths) {
    assert.equal(
      sitemap.some((row) => row.url === `${base}${expectedPath}`),
      true,
      `${expectedPath} should appear in the calculators sitemap`,
    );
  }
});

test('economy sitemap includes all economy routes with site base urls', async () => {
  const sitemap = await economySitemap();
  const base = getSiteUrl();
  const expectedPaths: string[] = [
    '/economie',
    '/economie/us-market-open',
    '/economie/gold-market-hours',
    '/economie/forex-sessions',
    '/economie/stock-markets',
    '/economie/market-clock',
    '/economie/best-trading-time',
  ];

  assert.equal(sitemap.length, expectedPaths.length);

  for (const expectedPath of expectedPaths) {
    assert.equal(
      sitemap.some((row) => row.url === `${base}${expectedPath}`),
      true,
      `${expectedPath} should appear in the economy sitemap`,
    );
  }
});

test('sitemap index includes economy sitemap entry', async () => {
  const base = getSiteUrl();
  const response = await sitemapIndexRoute();
  const xml = await response.text();

  assert.match(xml, new RegExp(`${base}/calculators/sitemap\\.xml`));
  assert.match(xml, new RegExp(`${base}/economie/sitemap\\.xml`));
  assert.match(xml, new RegExp(`${base}/date/sitemaps/static`));
  assert.match(xml, new RegExp(`${base}/date/sitemaps/countries`));
  assert.match(xml, new RegExp(`${base}/date/sitemaps/calendars`));
});

test('robots points crawlers to sitemap index', () => {
  const base = getSiteUrl();
  const data = robots();
  assert.equal(data.sitemap, `${base}/sitemap-index.xml`);
});

test('canonical metadata includes canonical and crawl directives', () => {
  const meta = buildCanonicalMetadata({
    title: 'عنوان تجريبي',
    description: 'وصف تجريبي',
    keywords: ['أ', 'ب'],
    url: 'https://example.com/holidays/demo',
  });

  assert.equal(meta.alternates?.canonical, 'https://example.com/holidays/demo');
  assert.equal(meta.robots?.index, true);
  assert.equal(meta.openGraph?.url, 'https://example.com/holidays/demo');
  assert.equal(meta.twitter?.card, 'summary_large_image');
});

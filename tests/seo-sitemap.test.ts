import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatona.com';

import manifest from '@/data/holidays/generated/manifest.json';
import { GENERATED_ALIAS_META_BY_SLUG } from '@/lib/events/generated-aliases';
import blogSitemap from '@/app/blog/sitemap';
import calculatorsSitemap from '@/app/calculators/sitemap';
import holidaysSitemap from '@/app/holidays/sitemap';
import rootSitemap from '@/app/sitemap';
import { GET as sitemapIndexRoute } from '@/app/sitemap-index.xml/route';
import { GET as gregorianDateSitemapRoute } from '@/app/date/gregorian/sitemap.xml/route';
import { GET as hijriDateSitemapRoute } from '@/app/date/hijri/sitemap.xml/route';
import { GET as calendarDateSitemapRoute } from '@/app/date/sitemaps/calendars/route';
import robots from '@/app/robots';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { ALL_CALCULATOR_SEO_ROUTES } from '@/lib/seo/calculator-route-manifest';
import {
  DATE_DAILY_SITEMAP_WINDOW_DAYS,
  GREGORIAN_CALENDAR_INDEXABLE_RANGE,
  HIJRI_CALENDAR_INDEXABLE_RANGE,
} from '@/lib/seo/date-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { COUNTRY_LIST } from '@/lib/calculators/building/country-data';

test('holiday sitemap contains published canonical events only', async () => {
  const sitemap = await holidaysSitemap();
  const publishedCanonicalSlugs = (manifest.events || [])
    .filter((row: { publishStatus?: string }) => ['published', 'monitored'].includes(String(row.publishStatus)))
    .map((row: { slug: string }) => row.slug)
    .sort();

  const sitemapSlugs = sitemap
    .map((row) => String(row.url).split('/holidays/')[1])
    .filter(Boolean)
    .sort();

  assert.deepEqual(sitemapSlugs, publishedCanonicalSlugs);
});

test('holiday sitemap excludes alias routes so duplicates do not compete with canonicals', async () => {
  const sitemap = await holidaysSitemap();
  const urls = sitemap.map((row) => String(row.url));
  const aliasEntries = Object.entries(GENERATED_ALIAS_META_BY_SLUG || {});

  for (const [aliasSlug] of aliasEntries) {
    assert.equal(
      urls.some((url) => url.endsWith(`/holidays/${aliasSlug}`)),
      false,
      `alias slug ${aliasSlug} should not appear in sitemap`,
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
  const sitemap: Array<{ url: string }> = await rootSitemap();
  const base = getSiteUrl();
  const expectedPaths: string[] = [
    '/',
    '/time-now',
    '/mwaqit-al-salat',
    '/holidays',
    '/time-difference',
    '/calculators',
    '/blog',
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
    sitemap.some((row) => row.url === `${base}/map`),
    false,
    '/map should not appear in the root sitemap because the route does not exist',
  );

  assert.equal(
    sitemap.some((row) => row.url === `${base}/calculators/age`),
    true,
    '/calculators/age should remain in the root sitemap as a promoted priority tool path',
  );
  assert.equal(
    sitemap.some((row) => row.url.includes('/guides') || row.url.includes('/guide/')),
    false,
    'root sitemap should not include legacy article aliases',
  );
});

test('root sitemap promotes all calculator tools as first-class routes', async () => {
  const sitemap: Array<{ url: string }> = await rootSitemap();
  const base = getSiteUrl();
  const sitemapUrls = new Set(sitemap.map((row) => row.url));
  const expectedPaths = ALL_CALCULATOR_SEO_ROUTES.map((route) => route.path);

  for (const expectedPath of expectedPaths) {
    assert.equal(
      sitemapUrls.has(`${base}${expectedPath}`),
      true,
      `${expectedPath} should appear in the root sitemap as a promoted first-class route`,
    );
  }
});

test('calculators sitemap includes hub and detail routes', async () => {
  const sitemap = await calculatorsSitemap();
  const base = getSiteUrl();
  const sitemapUrls = sitemap.map((row) => row.url);
  const staticPaths: string[] = [
    '/calculators',
    '/calculators/sleep',
    '/calculators/sleep/bedtime',
    '/calculators/sleep/wake-time',
    '/calculators/sleep/sleep-duration',
    '/calculators/sleep/nap-calculator',
    '/calculators/sleep/sleep-debt',
    '/calculators/sleep/sleep-needs-by-age',
    '/calculators/personal-finance',
    '/calculators/personal-finance/emergency-fund',
    '/calculators/personal-finance/debt-payoff',
    '/calculators/personal-finance/savings-goal',
    '/calculators/personal-finance/net-worth',
    '/calculators/finance',
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

  assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, 'calculators sitemap should not contain duplicate URLs');

  for (const expectedPath of expectedPaths) {
    assert.equal(
      sitemapUrls.includes(`${base}${expectedPath}`),
      true,
      `${expectedPath} should appear in the calculators sitemap`,
    );
  }
});

test('blog sitemap includes the blog hub and article routes', async () => {
  const sitemap = await blogSitemap();
  const base = getSiteUrl();
  const sitemapUrls = sitemap.map((row) => row.url);

  assert.equal(sitemapUrls.includes(`${base}/blog`), true);
  assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, 'blog sitemap should not contain duplicate URLs');
  assert.equal(
    sitemapUrls.some((url) => url.includes('/guides') || url.includes('/guide/')),
    false,
    'blog sitemap should only publish canonical /blog article URLs',
  );
  assert.equal(
    sitemapUrls.some((url) => String(url).startsWith(`${base}/blog/`)),
    true,
    'blog sitemap should include article routes',
  );
});

test('sitemap index includes active sitemap entries', async () => {
  const base = getSiteUrl();
  const response = await sitemapIndexRoute();
  const xml = await response.text();

  assert.match(xml, new RegExp(`${base}/calculators/sitemap\\.xml`));
  assert.match(xml, new RegExp(`${base}/blog/sitemap\\.xml`));
  assert.doesNotMatch(xml, new RegExp(`${base}/date/sitemap\\.xml`));
  assert.match(xml, new RegExp(`${base}/date/sitemaps/static`));
  assert.match(xml, new RegExp(`${base}/date/sitemaps/countries`));
  assert.match(xml, new RegExp(`${base}/date/sitemaps/calendars`));
  assert.match(xml, new RegExp(`${base}/date/gregorian/sitemap\\.xml`));
  assert.match(xml, new RegExp(`${base}/date/hijri/sitemap\\.xml`));
});

test('date daily sitemaps publish canonical Gregorian and Hijri day pages', async () => {
  const base = getSiteUrl();

  const gregorianXml = await (await gregorianDateSitemapRoute()).text();
  const hijriXml = await (await hijriDateSitemapRoute()).text();
  const expectedUrlCount = DATE_DAILY_SITEMAP_WINDOW_DAYS * 2 + 1;

  assert.match(gregorianXml, new RegExp(`${base}/date/\\d{4}/\\d{2}/\\d{2}`));
  assert.match(hijriXml, new RegExp(`${base}/date/hijri/\\d{4}/\\d{2}/\\d{2}`));
  assert.equal(
    [...gregorianXml.matchAll(/<url>/g)].length,
    expectedUrlCount,
    'Gregorian daily sitemap should use the rolling daily-date window only',
  );
  assert.equal(
    [...hijriXml.matchAll(/<url>/g)].length,
    expectedUrlCount,
    'Hijri daily sitemap should use the rolling daily-date window only',
  );
});

test('calendar sitemap includes the full supported Gregorian and Hijri year ranges', async () => {
  const base = getSiteUrl();
  const xml = await (await calendarDateSitemapRoute()).text();

  assert.match(
    xml,
    new RegExp(`${base}/date/calendar/${GREGORIAN_CALENDAR_INDEXABLE_RANGE.minYear}`),
  );
  assert.match(
    xml,
    new RegExp(`${base}/date/calendar/${GREGORIAN_CALENDAR_INDEXABLE_RANGE.maxYear}`),
  );
  assert.match(
    xml,
    new RegExp(`${base}/date/calendar/hijri/${HIJRI_CALENDAR_INDEXABLE_RANGE.minYear}`),
  );
  assert.match(
    xml,
    new RegExp(`${base}/date/calendar/hijri/${HIJRI_CALENDAR_INDEXABLE_RANGE.maxYear}`),
  );
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

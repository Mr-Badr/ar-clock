import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';

import manifest from '@/data/holidays/generated/manifest.json';
import { GENERATED_ALIAS_META_BY_SLUG } from '@/lib/events/generated-aliases';
import holidaysSitemap from '@/app/holidays/sitemap';
import rootSitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

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
  const expectedPaths: string[] = ['/holidays', '/map', '/about', '/privacy', '/contact'];
  for (const expectedPath of expectedPaths) {
    assert.equal(
      sitemap.some((row) => row.url === `${base}${expectedPath}`),
      true,
      `${expectedPath} should appear in the root sitemap`,
    );
  }
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

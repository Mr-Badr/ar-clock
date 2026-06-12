import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { load } from 'cheerio';

type RenderedHtmlAudit = {
  filePath: string;
  routePath: string;
  sizeBytes: number;
  title: string | null;
  description: string | null;
  canonical: string | null;
  titleLength: number;
  descriptionLength: number;
  h1Count: number;
  jsonLdCount: number;
  invalidJsonLdCount: number;
  faqPageCount: number;
  robotsMeta: string | null;
  wordCount: number;
  isInternal: boolean;
  isPlaceholder: boolean;
  isNoindex: boolean;
  hasPrivacyLink: boolean;
  hasContactLink: boolean;
  hasAboutLink: boolean;
};

type AuditSummary = {
  htmlCount: number;
  publicHtmlCount: number;
  indexableHtmlCount: number;
  noindexHtmlCount: number;
  placeholderHtmlCount: number;
  missingTitleCount: number;
  missingDescriptionCount: number;
  missingCanonicalCount: number;
  invalidH1Count: number;
  missingStructuredDataCount: number;
  invalidJsonLdCount: number;
  duplicateFaqPageCount: number;
  timeNowFaqPageCount: number;
  missingTrustLinksCount: number;
  titleOutsideRecommendedLengthCount: number;
  descriptionOutsideRecommendedLengthCount: number;
  under300WordsCount: number;
  under500WordsCount: number;
  under700WordsCount: number;
  medianHtmlBytes: number;
  p90HtmlBytes: number;
  p99HtmlBytes: number;
  largestHtmlBytes: number;
};

const APP_BUILD_DIR = path.join(process.cwd(), '.next', 'server', 'app');
const PLACEHOLDER_PATTERN: RegExp = /(?:\[|\]|%5B|%5D)/i;
const SITEMAP_FILE_PATTERN: RegExp = /(?:sitemap|\.xml)(?:\.body)?$/i;
const TIME_NOW_ROUTE_PATTERN: RegExp = /^\/time-now(?:\/|$)/;

function assertBuiltAppDir(): void {
  if (!existsSync(APP_BUILD_DIR)) {
    throw new Error('Rendered SEO audit requires .next/server/app. Run npm run build first.');
  }
}

function listFilesRecursive(directoryPath: string): string[] {
  const entries = readdirSync(directoryPath, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      return listFilesRecursive(fullPath);
    }

    return [fullPath];
  });
}

function routePathFromHtmlFile(filePath: string): string {
  const relativePath = path.relative(APP_BUILD_DIR, filePath).replaceAll(path.sep, '/');
  const withoutHtml = relativePath.replace(/\.html$/i, '');
  const withoutIndex = withoutHtml.endsWith('/index')
    ? withoutHtml.slice(0, -'/index'.length)
    : withoutHtml;
  const routePath = `/${withoutIndex}`.replace(/\/+/g, '/');

  return routePath === '/' ? '/' : routePath.replace(/\/$/g, '');
}

function isInternalRoute(routePath: string): boolean {
  return routePath.startsWith('/_')
    || routePath === '/404'
    || routePath === '/500'
    || routePath.includes('/_');
}

function countVisibleWords(html: string): number {
  const $ = load(html);
  $('script,style,noscript,svg').remove();
  const text = $('body').text().replace(/\s+/g, ' ').trim();

  if (!text) {
    return 0;
  }

  return text.split(/\s+/u).filter(Boolean).length;
}

function countJsonLdType(value: unknown, targetType: string): number {
  if (Array.isArray(value)) {
    return value.reduce((count, item) => count + countJsonLdType(item, targetType), 0);
  }

  if (!value || typeof value !== 'object') {
    return 0;
  }

  const record = value as Record<string, unknown>;
  const schemaType = record['@type'];
  const matchesTarget = schemaType === targetType
    || (Array.isArray(schemaType) && schemaType.includes(targetType));

  return Object.values(record).reduce(
    (count, item) => count + countJsonLdType(item, targetType),
    matchesTarget ? 1 : 0,
  );
}

function inspectJsonLd(html: string): { count: number; invalidCount: number; faqPageCount: number } {
  const $ = load(html);
  const scripts = $('script[type="application/ld+json"]').toArray();
  let invalidCount = 0;
  let faqPageCount = 0;

  for (const script of scripts) {
    const source = $(script).text().trim();

    try {
      faqPageCount += countJsonLdType(JSON.parse(source), 'FAQPage');
    } catch {
      invalidCount += 1;
    }
  }

  return {
    count: scripts.length,
    invalidCount,
    faqPageCount,
  };
}

function auditHtmlFile(filePath: string): RenderedHtmlAudit {
  const html = readFileSync(filePath, 'utf8');
  const $ = load(html);
  const jsonLd = inspectJsonLd(html);
  const routePath = routePathFromHtmlFile(filePath);
  const title = $('title').first().text().trim() || null;
  const description = $('meta[name="description"]').first().attr('content')?.trim() || null;
  const canonical = $('link[rel="canonical"]').first().attr('href')?.trim() || null;
  const robotsMeta = $('meta[name="robots"]').first().attr('content')?.trim() || null;
  const normalizedRobotsMeta = String(robotsMeta || '').toLowerCase();
  const links = new Set(
    $('a[href]')
      .toArray()
      .map((node) => $(node).attr('href')?.trim() || '')
      .filter(Boolean),
  );

  return {
    filePath,
    routePath,
    sizeBytes: Buffer.byteLength(html),
    title,
    description,
    canonical,
    titleLength: title?.length || 0,
    descriptionLength: description?.length || 0,
    h1Count: $('h1').length,
    jsonLdCount: jsonLd.count,
    invalidJsonLdCount: jsonLd.invalidCount,
    faqPageCount: jsonLd.faqPageCount,
    robotsMeta,
    wordCount: countVisibleWords(html),
    isInternal: isInternalRoute(routePath),
    isPlaceholder: PLACEHOLDER_PATTERN.test(routePath),
    isNoindex: normalizedRobotsMeta.includes('noindex'),
    hasPrivacyLink: links.has('/privacy'),
    hasContactLink: links.has('/contact'),
    hasAboutLink: links.has('/about'),
  };
}

function percentile(values: readonly number[], percentileValue: number): number {
  if (values.length === 0) {
    return 0;
  }

  const sortedValues = [...values].sort((left, right) => left - right);
  const index = Math.min(sortedValues.length - 1, Math.max(0, Math.ceil((percentileValue / 100) * sortedValues.length) - 1));

  return sortedValues[index] || 0;
}

function summarizeAudits(audits: readonly RenderedHtmlAudit[]): AuditSummary {
  const publicAudits = audits.filter((audit) => !audit.isInternal && !audit.isPlaceholder);
  const indexableAudits = publicAudits.filter((audit) => !audit.isNoindex);
  const sizes = indexableAudits.map((audit) => audit.sizeBytes);

  return {
    htmlCount: audits.length,
    publicHtmlCount: publicAudits.length,
    indexableHtmlCount: indexableAudits.length,
    noindexHtmlCount: publicAudits.filter((audit) => audit.isNoindex).length,
    placeholderHtmlCount: audits.filter((audit) => audit.isPlaceholder).length,
    missingTitleCount: indexableAudits.filter((audit) => !audit.title).length,
    missingDescriptionCount: indexableAudits.filter((audit) => !audit.description).length,
    missingCanonicalCount: indexableAudits.filter((audit) => !audit.canonical).length,
    invalidH1Count: indexableAudits.filter((audit) => audit.h1Count !== 1).length,
    missingStructuredDataCount: indexableAudits.filter((audit) => audit.jsonLdCount < 1).length,
    invalidJsonLdCount: indexableAudits.reduce((count, audit) => count + audit.invalidJsonLdCount, 0),
    duplicateFaqPageCount: indexableAudits.filter((audit) => audit.faqPageCount > 1).length,
    timeNowFaqPageCount: indexableAudits.filter((audit) => (
      TIME_NOW_ROUTE_PATTERN.test(audit.routePath) && audit.faqPageCount > 0
    )).length,
    missingTrustLinksCount: indexableAudits.filter((audit) => (
      !audit.hasPrivacyLink || !audit.hasContactLink || !audit.hasAboutLink
    )).length,
    titleOutsideRecommendedLengthCount: indexableAudits.filter((audit) => (
      audit.titleLength > 0 && (audit.titleLength < 20 || audit.titleLength > 80)
    )).length,
    descriptionOutsideRecommendedLengthCount: indexableAudits.filter((audit) => (
      audit.descriptionLength > 0 && (audit.descriptionLength < 90 || audit.descriptionLength > 175)
    )).length,
    under300WordsCount: indexableAudits.filter((audit) => audit.wordCount < 300).length,
    under500WordsCount: indexableAudits.filter((audit) => audit.wordCount < 500).length,
    under700WordsCount: indexableAudits.filter((audit) => audit.wordCount < 700).length,
    medianHtmlBytes: percentile(sizes, 50),
    p90HtmlBytes: percentile(sizes, 90),
    p99HtmlBytes: percentile(sizes, 99),
    largestHtmlBytes: Math.max(0, ...sizes),
  };
}

function findSitemapPlaceholderLeaks(files: readonly string[]): string[] {
  return files.filter((filePath) => {
    if (!SITEMAP_FILE_PATTERN.test(filePath)) {
      return false;
    }

    const body = readFileSync(filePath, 'utf8');
    return PLACEHOLDER_PATTERN.test(body);
  });
}

function formatBytes(value: number): string {
  return `${Math.round(value / 1024)} KB`;
}

function printTopRoutes(label: string, audits: readonly RenderedHtmlAudit[], limit: number): void {
  if (audits.length === 0) {
    return;
  }

  console.log(label);
  for (const audit of audits.slice(0, limit)) {
    console.log(`- ${audit.routePath} (${audit.wordCount} words, ${formatBytes(audit.sizeBytes)})`);
  }
}

function printMetadataRoutes(label: string, audits: readonly RenderedHtmlAudit[], limit: number): void {
  if (audits.length === 0) {
    return;
  }

  console.log(label);
  for (const audit of audits.slice(0, limit)) {
    console.log(`- ${audit.routePath} (title ${audit.titleLength}, description ${audit.descriptionLength})`);
  }
}

function runAudit(): void {
  assertBuiltAppDir();

  const files = listFilesRecursive(APP_BUILD_DIR);
  const htmlFiles = files.filter((filePath) => filePath.endsWith('.html'));
  const audits = htmlFiles.map((filePath) => auditHtmlFile(filePath));
  const publicAudits = audits.filter((audit) => !audit.isInternal && !audit.isPlaceholder);
  const indexableAudits = publicAudits.filter((audit) => !audit.isNoindex);
  const summary = summarizeAudits(audits);
  const missingTitle = indexableAudits.filter((audit) => !audit.title);
  const missingDescription = indexableAudits.filter((audit) => !audit.description);
  const missingCanonical = indexableAudits.filter((audit) => !audit.canonical);
  const invalidH1 = indexableAudits.filter((audit) => audit.h1Count !== 1);
  const missingStructuredData = indexableAudits.filter((audit) => audit.jsonLdCount < 1);
  const invalidJsonLd = indexableAudits.filter((audit) => audit.invalidJsonLdCount > 0);
  const duplicateFaqPages = indexableAudits.filter((audit) => audit.faqPageCount > 1);
  const timeNowFaqPages = indexableAudits.filter((audit) => (
    TIME_NOW_ROUTE_PATTERN.test(audit.routePath) && audit.faqPageCount > 0
  ));
  const missingTrustLinks = indexableAudits.filter((audit) => (
    !audit.hasPrivacyLink || !audit.hasContactLink || !audit.hasAboutLink
  ));
  const titleOutsideRecommendedLength = indexableAudits
    .filter((audit) => audit.titleLength > 0 && (audit.titleLength < 20 || audit.titleLength > 80))
    .sort((left, right) => right.titleLength - left.titleLength);
  const descriptionOutsideRecommendedLength = indexableAudits
    .filter((audit) => audit.descriptionLength > 0 && (audit.descriptionLength < 90 || audit.descriptionLength > 175))
    .sort((left, right) => left.descriptionLength - right.descriptionLength);
  const thinPublicPages = indexableAudits
    .filter((audit) => audit.wordCount < 300)
    .sort((left, right) => left.wordCount - right.wordCount);
  const shallowPublicPages = indexableAudits
    .filter((audit) => audit.wordCount < 500)
    .sort((left, right) => left.wordCount - right.wordCount);
  const contentDepthWarnings = indexableAudits
    .filter((audit) => audit.wordCount < 700)
    .sort((left, right) => left.wordCount - right.wordCount);
  const placeholderHtml = audits.filter((audit) => audit.isPlaceholder);
  const sitemapPlaceholderLeaks = findSitemapPlaceholderLeaks(files);
  const failures = [
    ...missingTitle.map((audit) => `Missing title: ${audit.routePath}`),
    ...missingDescription.map((audit) => `Missing description: ${audit.routePath}`),
    ...missingCanonical.map((audit) => `Missing canonical: ${audit.routePath}`),
    ...invalidH1.map((audit) => `Invalid H1 count (${audit.h1Count}): ${audit.routePath}`),
    ...missingStructuredData.map((audit) => `Missing structured data: ${audit.routePath}`),
    ...invalidJsonLd.map((audit) => `Invalid JSON-LD scripts (${audit.invalidJsonLdCount}): ${audit.routePath}`),
    ...duplicateFaqPages.map((audit) => `Duplicate FAQPage definitions (${audit.faqPageCount}): ${audit.routePath}`),
    ...timeNowFaqPages.map((audit) => `Retired FAQPage schema under /time-now: ${audit.routePath}`),
    ...missingTrustLinks.map((audit) => `Missing trust links: ${audit.routePath}`),
    ...shallowPublicPages.map((audit) => `Public page under 500 words: ${audit.routePath} (${audit.wordCount} words)`),
    ...sitemapPlaceholderLeaks.map((filePath) => `Placeholder leaked into sitemap output: ${path.relative(process.cwd(), filePath)}`),
  ];

  console.log('Rendered SEO audit summary');
  console.log(`- HTML files: ${summary.htmlCount}`);
  console.log(`- Public HTML files: ${summary.publicHtmlCount}`);
  console.log(`- Indexable HTML files: ${summary.indexableHtmlCount}`);
  console.log(`- Noindex public HTML files: ${summary.noindexHtmlCount}`);
  console.log(`- Placeholder shell HTML files: ${summary.placeholderHtmlCount}`);
  console.log(`- Missing titles: ${summary.missingTitleCount}`);
  console.log(`- Missing descriptions: ${summary.missingDescriptionCount}`);
  console.log(`- Missing canonicals: ${summary.missingCanonicalCount}`);
  console.log(`- Invalid H1 counts: ${summary.invalidH1Count}`);
  console.log(`- Missing structured data: ${summary.missingStructuredDataCount}`);
  console.log(`- Invalid JSON-LD scripts: ${summary.invalidJsonLdCount}`);
  console.log(`- Pages with duplicate FAQPage definitions: ${summary.duplicateFaqPageCount}`);
  console.log(`- /time-now pages with retired FAQPage schema: ${summary.timeNowFaqPageCount}`);
  console.log(`- Missing trust links: ${summary.missingTrustLinksCount}`);
  console.log(`- Titles outside 20-80 chars: ${summary.titleOutsideRecommendedLengthCount}`);
  console.log(`- Descriptions outside 90-175 chars: ${summary.descriptionOutsideRecommendedLengthCount}`);
  console.log(`- Public pages under 300 words: ${summary.under300WordsCount}`);
  console.log(`- Public pages under 500 words: ${summary.under500WordsCount}`);
  console.log(`- Quality warnings under 700 words: ${summary.under700WordsCount}`);
  console.log(`- HTML size median/p90/p99/max: ${formatBytes(summary.medianHtmlBytes)} / ${formatBytes(summary.p90HtmlBytes)} / ${formatBytes(summary.p99HtmlBytes)} / ${formatBytes(summary.largestHtmlBytes)}`);

  printTopRoutes('Thin public pages sample', thinPublicPages, 10);
  printTopRoutes('Content depth warning sample', contentDepthWarnings, 10);
  printMetadataRoutes('Metadata length warning sample', [...titleOutsideRecommendedLength, ...descriptionOutsideRecommendedLength], 10);
  printTopRoutes('Placeholder shell pages blocked by proxy sample', placeholderHtml, 10);

  if (failures.length > 0) {
    console.error('Rendered SEO audit failed');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Rendered SEO audit passed');
}

runAudit();

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { load } from 'cheerio';

type RenderedPage = {
  routePath: string;
  family: string;
  wordCount: number;
  contentHash: string;
  shingles: Set<string>;
};

type SimilarityPair = {
  leftPath: string;
  rightPath: string;
  family: string;
  score: number;
  leftWords: number;
  rightWords: number;
};

type FamilySummary = {
  family: string;
  pageCount: number;
  maximumSimilarity: number;
  reviewPairCount: number;
};

const APP_BUILD_DIR = path.join(process.cwd(), '.next', 'server', 'app');
const PLACEHOLDER_PATTERN = /(?:\[|\]|%5B|%5D)/i;
const SHINGLE_SIZE = 7;
const REVIEW_THRESHOLD = 0.7;
const FAILURE_THRESHOLD = 0.85;
const REPORT_LIMIT = 20;

function assertBuiltAppDir(): void {
  if (!existsSync(APP_BUILD_DIR)) {
    throw new Error('Content originality audit requires .next/server/app. Run npm run build first.');
  }
}

function listFilesRecursive(directoryPath: string): string[] {
  return readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directoryPath, entry.name);
    return entry.isDirectory() ? listFilesRecursive(fullPath) : [fullPath];
  });
}

function routePathFromHtmlFile(filePath: string): string {
  const relativePath = path.relative(APP_BUILD_DIR, filePath).replaceAll(path.sep, '/');
  const withoutHtml = relativePath.replace(/\.html$/i, '');
  const withoutIndex = withoutHtml === 'index'
    ? ''
    : withoutHtml.replace(/\/index$/i, '');
  const routePath = `/${withoutIndex}`.replace(/\/+/g, '/');

  return routePath === '/' ? '/' : routePath.replace(/\/$/g, '');
}

function getRouteFamily(routePath: string): string {
  const segments = routePath.split('/').filter(Boolean);
  if (segments.length === 0) return 'home';
  if (segments[0] === 'date' && segments[1] === 'country') return 'date-country';
  if (segments[0] === 'date' && segments[1] === 'calendar') return 'date-calendar';
  if (segments[0] === 'date') return 'date';
  if (segments[0] === 'time-now') return 'time-now';
  if (segments[0] === 'time-difference') return 'time-difference';
  if (segments[0] === 'mwaqit-al-salat') return 'prayer-times';
  if (segments[0] === 'holidays') return 'holidays';
  if (segments[0] === 'calculators' && segments[1]) return `calculators-${segments[1]}`;
  if (segments[0] === 'calculators') return 'calculators';
  if (segments[0] === 'blog') return 'blog';
  return segments[0] || 'other';
}

function normalizeText(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .toLowerCase();
}

function buildShingles(words: readonly string[], size: number): Set<string> {
  const shingles = new Set<string>();

  for (let index = 0; index <= words.length - size; index += 1) {
    shingles.add(words.slice(index, index + size).join(' '));
  }

  return shingles;
}

function calculateJaccardSimilarity(left: ReadonlySet<string>, right: ReadonlySet<string>): number {
  const smaller = left.size <= right.size ? left : right;
  const larger = left.size <= right.size ? right : left;
  let intersectionCount = 0;

  for (const value of smaller) {
    if (larger.has(value)) {
      intersectionCount += 1;
    }
  }

  const unionCount = left.size + right.size - intersectionCount;
  return unionCount > 0 ? intersectionCount / unionCount : 0;
}

function inspectRenderedPage(filePath: string): RenderedPage | null {
  const routePath = routePathFromHtmlFile(filePath);
  if (
    routePath.startsWith('/_')
    || routePath === '/404'
    || routePath === '/500'
    || PLACEHOLDER_PATTERN.test(routePath)
  ) {
    return null;
  }

  const html = readFileSync(filePath, 'utf8');
  const $ = load(html);
  const robots = String($('meta[name="robots"]').first().attr('content') || '').toLowerCase();
  if (robots.includes('noindex')) {
    return null;
  }

  $('script, style, noscript, svg, header, footer, nav').remove();
  const text = normalizeText($('body').text());
  const words = text.split(/\s+/u).filter(Boolean);
  if (words.length < SHINGLE_SIZE) {
    return null;
  }

  return {
    routePath,
    family: getRouteFamily(routePath),
    wordCount: words.length,
    contentHash: createHash('sha256').update(text).digest('hex'),
    shingles: buildShingles(words, SHINGLE_SIZE),
  };
}

function comparePages(pages: readonly RenderedPage[]): SimilarityPair[] {
  const pairs: SimilarityPair[] = [];

  for (let leftIndex = 0; leftIndex < pages.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < pages.length; rightIndex += 1) {
      const left = pages[leftIndex];
      const right = pages[rightIndex];
      if (!left || !right || left.family !== right.family) {
        continue;
      }

      const score = calculateJaccardSimilarity(left.shingles, right.shingles);
      if (score < REVIEW_THRESHOLD && left.contentHash !== right.contentHash) {
        continue;
      }

      pairs.push({
        leftPath: left.routePath,
        rightPath: right.routePath,
        family: left.family,
        score,
        leftWords: left.wordCount,
        rightWords: right.wordCount,
      });
    }
  }

  return pairs.sort((left, right) => right.score - left.score);
}

function summarizeFamilies(
  pages: readonly RenderedPage[],
  pairs: readonly SimilarityPair[],
): FamilySummary[] {
  const pageCounts = new Map<string, number>();
  const familyPairs = new Map<string, SimilarityPair[]>();

  for (const page of pages) {
    pageCounts.set(page.family, (pageCounts.get(page.family) || 0) + 1);
  }

  for (const pair of pairs) {
    const currentPairs = familyPairs.get(pair.family) || [];
    familyPairs.set(pair.family, [...currentPairs, pair]);
  }

  return Array.from(pageCounts.entries())
    .map(([family, pageCount]) => {
      const reviewPairs = familyPairs.get(family) || [];
      return {
        family,
        pageCount,
        maximumSimilarity: reviewPairs[0]?.score || 0,
        reviewPairCount: reviewPairs.length,
      };
    })
    .filter((summary) => summary.pageCount > 1)
    .sort((left, right) => right.maximumSimilarity - left.maximumSimilarity);
}

function formatScore(value: number): string {
  return value.toFixed(3);
}

function runAudit(): void {
  assertBuiltAppDir();

  const pages = listFilesRecursive(APP_BUILD_DIR)
    .filter((filePath) => filePath.endsWith('.html'))
    .map((filePath) => inspectRenderedPage(filePath))
    .filter((page): page is RenderedPage => page !== null);
  const pairs = comparePages(pages);
  const exactDuplicates = pairs.filter((pair) => pair.score === 1);
  const nearDuplicates = pairs.filter((pair) => pair.score >= FAILURE_THRESHOLD);
  const familySummaries = summarizeFamilies(pages, pairs);

  console.log('Content originality audit summary');
  console.log(`- Indexable rendered pages: ${pages.length}`);
  console.log(`- Exact duplicate pairs: ${exactDuplicates.length}`);
  console.log(`- Near-duplicate pairs at or above ${FAILURE_THRESHOLD}: ${nearDuplicates.length}`);
  console.log(`- Review pairs at or above ${REVIEW_THRESHOLD}: ${pairs.length}`);

  for (const summary of familySummaries.filter((item) => item.reviewPairCount > 0)) {
    console.log(
      `- ${summary.family}: ${summary.pageCount} pages, max ${formatScore(summary.maximumSimilarity)}, ${summary.reviewPairCount} review pairs`,
    );
  }

  if (pairs.length > 0) {
    console.log('Highest rendered-content similarities');
    for (const pair of pairs.slice(0, REPORT_LIMIT)) {
      console.log(
        `- ${formatScore(pair.score)} ${pair.leftPath} (${pair.leftWords}) <> ${pair.rightPath} (${pair.rightWords})`,
      );
    }
  }

  if (nearDuplicates.length > 0) {
    console.error('Content originality audit failed');
    process.exitCode = 1;
    return;
  }

  console.log('Content originality audit passed');
}

runAudit();

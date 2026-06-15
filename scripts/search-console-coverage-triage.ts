import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

import {
  type CoverageClassification,
  type CoverageRow,
  type FetchAudit,
  classifyCoverageRow,
  normalizeComparableUrl,
} from '@/lib/search-console/coverage-triage';

type Args = {
  inputs: string[];
  base: string;
  out: string | null;
  concurrency: number;
  timeoutMs: number;
};

type TriagedCoverageRow = CoverageRow & FetchAudit & {
  inSitemap: boolean;
  classification: CoverageClassification;
  action: string;
  details: string;
};

const DEFAULT_BASE_URL = 'https://miqatona.com';
const DEFAULT_CONCURRENCY = 8;
const DEFAULT_TIMEOUT_MS = 15_000;
const SITEMAP_FETCH_ATTEMPTS = 3;
const URL_HEADER_ALIASES = [
  'url',
  'page',
  'pages',
  'address',
  'landing page',
  'inspected url',
  'عنوان url',
  'الصفحة',
];
const REASON_HEADER_ALIASES = [
  'reason',
  'issue',
  'coverage',
  'status',
  'why pages aren’t indexed',
  "why pages aren't indexed",
  'السبب',
  'الحالة',
];
function getArgumentValues(args: string[], key: string): string[] {
  const prefix = `--${key}=`;
  return args
    .filter((item) => item.startsWith(prefix))
    .map((item) => item.slice(prefix.length).trim())
    .filter(Boolean);
}

function getSingleArgumentValue(args: string[], key: string): string | null {
  const values = getArgumentValues(args, key);
  return values.length > 0 ? values[values.length - 1] : null;
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function normalizeOrigin(value: string): string {
  const trimmedValue = value.trim();
  const withProtocol = /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
  return new URL(withProtocol).origin;
}

function parseArgs(argv: string[]): Args {
  const inputs = getArgumentValues(argv, 'input');
  if (inputs.length === 0) {
    throw new Error('Missing Search Console export. Use --input=/path/to/export.csv. Repeat --input for multiple files.');
  }

  return {
    inputs,
    base: normalizeOrigin(getSingleArgumentValue(argv, 'base') || DEFAULT_BASE_URL),
    out: getSingleArgumentValue(argv, 'out'),
    concurrency: parsePositiveInteger(getSingleArgumentValue(argv, 'concurrency'), DEFAULT_CONCURRENCY),
    timeoutMs: parsePositiveInteger(getSingleArgumentValue(argv, 'timeout-ms'), DEFAULT_TIMEOUT_MS),
  };
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      currentValue += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === ',' && !insideQuotes) {
      values.push(currentValue);
      currentValue = '';
      continue;
    }

    currentValue += char;
  }

  values.push(currentValue);
  return values.map((value) => value.trim());
}

function findColumnIndex(headers: string[], aliases: string[]): number {
  const normalizedAliases = aliases.map(normalizeHeader);
  return headers.findIndex((header) => normalizedAliases.includes(header));
}

function parseCsvRows(inputPath: string, content: string): CoverageRow[] {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error(`Search Console export is empty or missing rows: ${inputPath}`);
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const urlIndex = findColumnIndex(headers, URL_HEADER_ALIASES);
  if (urlIndex === -1) {
    throw new Error(`Search Console export is missing a URL/page column: ${inputPath}`);
  }

  const reasonIndex = findColumnIndex(headers, REASON_HEADER_ALIASES);
  return lines.slice(1)
    .map((line): CoverageRow | null => {
      const columns = parseCsvLine(line);
      const url = String(columns[urlIndex] || '').trim();
      if (!url) return null;

      return {
        input: inputPath,
        url,
        reason: reasonIndex === -1 ? null : String(columns[reasonIndex] || '').trim() || null,
      };
    })
    .filter((row): row is CoverageRow => Boolean(row));
}

async function loadCoverageRows(inputPaths: string[]): Promise<CoverageRow[]> {
  const rows: CoverageRow[] = [];
  for (const inputPath of inputPaths) {
    const absolutePath = path.resolve(process.cwd(), inputPath);
    const content = await readFile(absolutePath, 'utf8');
    rows.push(...parseCsvRows(absolutePath, content));
  }

  return rows;
}

function resolveUrl(base: string, value: string): string {
  return new URL(value, base).toString();
}

async function fetchText(url: string, timeoutMs: number): Promise<{ response: Response; text: string }> {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/xml;q=0.9,*/*;q=0.8',
      'user-agent': 'miqatona-gsc-coverage-triage/1.0',
    },
  });

  return {
    response,
    text: await response.text(),
  };
}

async function fetchTextWithRetry(url: string, timeoutMs: number, attempts: number): Promise<{ response: Response; text: string }> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const result = await fetchText(url, timeoutMs);
      if (result.response.ok || result.response.status < 500 || attempt === attempts) {
        return result;
      }

      lastError = new Error(`HTTP ${result.response.status}`);
      console.warn('[search-console-coverage-triage] sitemap-fetch-retry', JSON.stringify({
        url,
        attempt,
        status: result.response.status,
      }));
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === attempts) {
        throw lastError;
      }

      console.warn('[search-console-coverage-triage] sitemap-fetch-retry', JSON.stringify({
        url,
        attempt,
        error: lastError.message,
      }));
    }
  }

  throw lastError || new Error(`Sitemap fetch failed for ${url}`);
}

async function fetchSitemapUrls(base: string, timeoutMs: number): Promise<Set<string>> {
  const seenSitemaps = new Set<string>();
  const pageUrls = new Set<string>();
  const queue = [`${base}/sitemap-index.xml`];

  while (queue.length > 0) {
    const sitemapUrl = queue.shift();
    if (!sitemapUrl || seenSitemaps.has(sitemapUrl)) continue;
    seenSitemaps.add(sitemapUrl);

    const { response, text } = await fetchTextWithRetry(sitemapUrl, timeoutMs, SITEMAP_FETCH_ATTEMPTS);
    if (!response.ok) {
      throw new Error(`Sitemap fetch failed for ${sitemapUrl}: HTTP ${response.status}`);
    }

    const $ = cheerio.load(text, { xmlMode: true });
    const locs = $('loc').map((_, node) => $(node).text().trim()).get().filter(Boolean);
    const isSitemapIndex = text.includes('<sitemapindex');

    for (const loc of locs) {
      if (isSitemapIndex) {
        queue.push(loc);
      } else {
        pageUrls.add(normalizeComparableUrl(loc) || loc);
      }
    }
  }

  return pageUrls;
}

async function auditUrl(url: string, timeoutMs: number): Promise<FetchAudit> {
  try {
    const { response, text } = await fetchText(url, timeoutMs);
    const contentType = response.headers.get('content-type');
    const finalUrl = response.url || url;
    const xRobotsTag = response.headers.get('x-robots-tag');

    if (!contentType?.toLowerCase().includes('text/html')) {
      return {
        requestedUrl: url,
        finalUrl,
        status: response.status,
        contentType,
        robotsMeta: null,
        xRobotsTag,
        canonical: null,
        title: null,
        error: null,
      };
    }

    const $ = cheerio.load(text);
    const canonicalHref = $('link[rel="canonical"]').first().attr('href')?.trim() || null;
    return {
      requestedUrl: url,
      finalUrl,
      status: response.status,
      contentType,
      robotsMeta: $('meta[name="robots"]').first().attr('content')?.trim() || null,
      xRobotsTag,
      canonical: canonicalHref ? new URL(canonicalHref, finalUrl).toString() : null,
      title: $('title').first().text().trim() || null,
      error: null,
    };
  } catch (error) {
    return {
      requestedUrl: url,
      finalUrl: null,
      status: 0,
      contentType: null,
      robotsMeta: null,
      xRobotsTag: null,
      canonical: null,
      title: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function consume(): Promise<void> {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => consume()),
  );

  return results;
}

function summarize(rows: TriagedCoverageRow[]): Record<string, number> {
  return rows.reduce<Record<string, number>>((accumulator, row) => {
    accumulator[row.classification] = (accumulator[row.classification] || 0) + 1;
    return accumulator;
  }, {});
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const coverageRows = await loadCoverageRows(args.inputs);
  const sitemapUrls = await fetchSitemapUrls(args.base, args.timeoutMs);
  const now = new Date();
  const auditedRows = await runWithConcurrency(
    coverageRows,
    args.concurrency,
    async (row): Promise<TriagedCoverageRow> => {
      const resolvedUrl = resolveUrl(args.base, row.url);
      const audit = await auditUrl(resolvedUrl, args.timeoutMs);
      const comparableUrl = normalizeComparableUrl(audit.finalUrl || audit.requestedUrl);
      const inSitemap = comparableUrl ? sitemapUrls.has(comparableUrl) : false;
      const classification = classifyCoverageRow(row, audit, inSitemap, now);

      return {
        ...row,
        ...audit,
        inSitemap,
        ...classification,
      };
    },
  );

  const priorityRows = auditedRows.filter((row) => (
    row.classification === 'ads-blocker'
    || row.classification === 'sitemap-blocker'
    || row.classification === 'redirect-review'
    || row.classification === 'canonical-review'
  ));

  const report = {
    summary: {
      base: args.base,
      checkedAt: now.toISOString(),
      inputFiles: args.inputs.map((input) => path.resolve(process.cwd(), input)),
      rows: auditedRows.length,
      sitemapUrls: sitemapUrls.size,
      byClassification: summarize(auditedRows),
    },
    priorityRows,
    rows: auditedRows,
  };

  console.log('[search-console-coverage-triage] summary');
  console.log(JSON.stringify(report.summary, null, 2));
  console.log('[search-console-coverage-triage] priority-rows');
  console.log(JSON.stringify(priorityRows.slice(0, 80), null, 2));

  if (args.out) {
    const outPath = path.resolve(process.cwd(), args.out);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(`[search-console-coverage-triage] Report written to ${outPath}`);
  }

  if (priorityRows.some((row) => row.classification === 'ads-blocker' || row.classification === 'sitemap-blocker')) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[search-console-coverage-triage] crashed');
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});

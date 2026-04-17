import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

type Args = {
  base: string;
  limit: number | null;
  out: string | null;
  concurrency: number;
  timeoutMs: number;
};

type SitemapFetchResult = {
  sitemapUrl: string;
  status: number;
  ok: boolean;
  kind: 'index' | 'urlset' | 'unknown' | 'error';
  childSitemaps: string[];
  pageUrls: string[];
  error?: string;
};

type PageAuditResult = {
  url: string;
  finalUrl: string | null;
  status: number;
  contentType: string | null;
  canonical: string | null;
  canonicalMatches: boolean | null;
  title: string | null;
  description: string | null;
  robotsMeta: string | null;
  xRobotsTag: string | null;
  issues: string[];
};

function parseArgs(argv: string[]): Args {
  const defaults: Args = {
    base: 'https://miqatona.com',
    limit: null,
    out: null,
    concurrency: 6,
    timeoutMs: 15_000,
  };

  for (const arg of argv) {
    if (arg.startsWith('--base=')) defaults.base = arg.slice('--base='.length);
    if (arg.startsWith('--limit=')) {
      const raw = arg.slice('--limit='.length);
      defaults.limit = raw === 'all' ? null : Number.parseInt(raw, 10);
    }
    if (arg.startsWith('--out=')) defaults.out = arg.slice('--out='.length);
    if (arg.startsWith('--concurrency=')) {
      defaults.concurrency = Math.max(1, Number.parseInt(arg.slice('--concurrency='.length), 10) || defaults.concurrency);
    }
    if (arg.startsWith('--timeout-ms=')) {
      defaults.timeoutMs = Math.max(1000, Number.parseInt(arg.slice('--timeout-ms='.length), 10) || defaults.timeoutMs);
    }
  }

  defaults.base = normalizeOrigin(defaults.base);
  return defaults;
}

function normalizeOrigin(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return new URL(withProtocol).origin;
}

function normalizeComparableUrl(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    url.hash = '';
    if (url.pathname !== '/') {
      url.pathname = url.pathname.replace(/\/+$/, '');
    }
    if ((url.protocol === 'https:' && url.port === '443') || (url.protocol === 'http:' && url.port === '80')) {
      url.port = '';
    }
    return url.toString();
  } catch {
    return value.trim();
  }
}

async function fetchText(url: string, timeoutMs: number) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      'user-agent': 'miqatona-seo-audit/1.0',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/xml;q=0.9,*/*;q=0.8',
    },
  });

  return {
    response,
    text: await response.text(),
  };
}

function extractLocs(xml: string) {
  const $ = load(xml, { xmlMode: true });
  return $('loc')
    .toArray()
    .map((node) => $(node).text().trim())
    .filter(Boolean);
}

async function fetchSitemap(url: string, timeoutMs: number): Promise<SitemapFetchResult> {
  try {
    const { response, text } = await fetchText(url, timeoutMs);
    const kind = text.includes('<sitemapindex') ? 'index'
      : text.includes('<urlset') ? 'urlset'
      : 'unknown';
    const locs = extractLocs(text);

    return {
      sitemapUrl: url,
      status: response.status,
      ok: response.ok,
      kind,
      childSitemaps: kind === 'index' ? locs : [],
      pageUrls: kind === 'urlset' ? locs : [],
    };
  } catch (error: any) {
    return {
      sitemapUrl: url,
      status: 0,
      ok: false,
      kind: 'error',
      childSitemaps: [],
      pageUrls: [],
      error: error?.message || 'Unknown sitemap fetch error',
    };
  }
}

async function expandSitemapIndex(rootSitemapUrl: string, timeoutMs: number) {
  const seenSitemaps = new Set<string>();
  const sitemapResults: SitemapFetchResult[] = [];
  const queue = [rootSitemapUrl];
  const pageUrls = new Set<string>();

  while (queue.length > 0) {
    const sitemapUrl = queue.shift();
    if (!sitemapUrl || seenSitemaps.has(sitemapUrl)) continue;
    seenSitemaps.add(sitemapUrl);

    const result = await fetchSitemap(sitemapUrl, timeoutMs);
    sitemapResults.push(result);

    if (result.kind === 'index') {
      for (const child of result.childSitemaps) {
        if (!seenSitemaps.has(child)) queue.push(child);
      }
    }

    for (const url of result.pageUrls) {
      pageUrls.add(url);
    }
  }

  return {
    sitemapResults,
    pageUrls: Array.from(pageUrls),
  };
}

async function auditPage(url: string, timeoutMs: number): Promise<PageAuditResult> {
  try {
    const { response, text } = await fetchText(url, timeoutMs);
    const contentType = response.headers.get('content-type');
    const finalUrl = response.url || url;
    const issues: string[] = [];

    if (!response.ok) issues.push(`http-${response.status}`);

    let canonical: string | null = null;
    let title: string | null = null;
    let description: string | null = null;
    let robotsMeta: string | null = null;
    let canonicalMatches: boolean | null = null;

    if (contentType?.includes('text/html')) {
      const $ = load(text);
      const canonicalHref = $('link[rel="canonical"]').attr('href')?.trim() || null;
      canonical = canonicalHref ? new URL(canonicalHref, finalUrl).toString() : null;
      canonicalMatches = canonical
        ? normalizeComparableUrl(canonical) === normalizeComparableUrl(finalUrl)
        : null;
      title = $('title').text().trim() || null;
      description = $('meta[name="description"]').attr('content')?.trim() || null;
      robotsMeta = $('meta[name="robots"]').attr('content')?.trim() || null;

      if (!canonical) issues.push('missing-canonical');
      if (canonical && canonicalMatches === false) issues.push('canonical-mismatch');
      if (!title) issues.push('missing-title');
      if (!description) issues.push('missing-description');
      if ((robotsMeta || '').toLowerCase().includes('noindex')) issues.push('meta-noindex');
    }

    const xRobotsTag = response.headers.get('x-robots-tag');
    if ((xRobotsTag || '').toLowerCase().includes('noindex')) issues.push('header-noindex');

    return {
      url,
      finalUrl,
      status: response.status,
      contentType,
      canonical,
      canonicalMatches,
      title,
      description,
      robotsMeta,
      xRobotsTag,
      issues,
    };
  } catch (error: any) {
    return {
      url,
      finalUrl: null,
      status: 0,
      contentType: null,
      canonical: null,
      canonicalMatches: null,
      title: null,
      description: null,
      robotsMeta: null,
      xRobotsTag: null,
      issues: [error?.message || 'request-failed'],
    };
  }
}

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function consume() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => consume()),
  );

  return results;
}

async function fetchRobots(base: string, timeoutMs: number) {
  try {
    const { response, text } = await fetchText(`${base}/robots.txt`, timeoutMs);
    return {
      ok: response.ok,
      status: response.status,
      text,
      issues: text.includes('/sitemap-index.xml') ? [] : ['missing-sitemap-index-reference'],
    };
  } catch (error: any) {
    return {
      ok: false,
      status: 0,
      text: '',
      issues: [error?.message || 'robots-fetch-failed'],
    };
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const robots = await fetchRobots(args.base, args.timeoutMs);
  const sitemapIndexUrl = `${args.base}/sitemap-index.xml`;
  const sitemapTree = await expandSitemapIndex(sitemapIndexUrl, args.timeoutMs);

  const candidateUrls = sitemapTree.pageUrls
    .filter((url) => url.startsWith(args.base))
    .sort((a, b) => a.localeCompare(b));
  const auditedUrls = args.limit ? candidateUrls.slice(0, args.limit) : candidateUrls;
  const pageResults = await runWithConcurrency(
    auditedUrls,
    args.concurrency,
    (url) => auditPage(url, args.timeoutMs),
  );

  const pageIssues = pageResults.filter((result) => result.issues.length > 0);
  const sitemapIssues = sitemapTree.sitemapResults.filter((result) => !result.ok || result.kind === 'unknown');
  const summary = {
    base: args.base,
    checkedAt: new Date().toISOString(),
    robots: {
      ok: robots.ok,
      status: robots.status,
      issues: robots.issues,
    },
    sitemapCount: sitemapTree.sitemapResults.length,
    pageUrlCount: candidateUrls.length,
    auditedPageCount: pageResults.length,
    sitemapIssues: sitemapIssues.length,
    pageIssues: pageIssues.length,
    topIssueCounts: Object.entries(
      pageResults
        .flatMap((result) => result.issues)
        .reduce<Record<string, number>>((acc, issue) => {
          acc[issue] = (acc[issue] || 0) + 1;
          return acc;
        }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
  };

  const report = {
    summary,
    robots,
    sitemaps: sitemapTree.sitemapResults,
    pages: pageResults,
  };

  console.log(`[seo-audit] Base: ${summary.base}`);
  console.log(`[seo-audit] Robots: ${robots.ok ? 'ok' : 'error'} (${robots.status})`);
  console.log(`[seo-audit] Sitemaps discovered: ${summary.sitemapCount}`);
  console.log(`[seo-audit] URLs discovered: ${summary.pageUrlCount}`);
  console.log(`[seo-audit] URLs audited: ${summary.auditedPageCount}`);

  if (summary.topIssueCounts.length === 0) {
    console.log('[seo-audit] No issues detected in the audited sample.');
  } else {
    console.log('[seo-audit] Top issues:');
    for (const [issue, count] of summary.topIssueCounts) {
      console.log(`  - ${issue}: ${count}`);
    }
  }

  if (pageIssues.length > 0) {
    console.log('[seo-audit] Sample problem URLs:');
    for (const result of pageIssues.slice(0, 12)) {
      console.log(`  - ${result.url} -> ${result.issues.join(', ')}`);
    }
  }

  if (args.out) {
    const outPath = path.resolve(args.out);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(`[seo-audit] Report written to ${outPath}`);
  }

  if (!robots.ok || robots.issues.length > 0 || sitemapIssues.length > 0 || pageIssues.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[seo-audit] Fatal error:', error);
  process.exitCode = 1;
});


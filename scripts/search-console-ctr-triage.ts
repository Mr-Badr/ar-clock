import { readFileSync } from 'node:fs';
import path from 'node:path';

type SearchConsoleRow = {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type TriageRow = SearchConsoleRow & {
  routeFamily: string;
  priority: 'rewrite-now' | 'cluster-review' | 'position-work' | 'watch';
  reason: string;
};

type DatePageKind = 'gregorian-day' | 'hijri-day';

type DateDemandCandidate = {
  page: string;
  kind: DatePageKind;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  queryCount: number;
  reason: string;
};

const DEFAULT_MIN_IMPRESSIONS = 500;
const DEFAULT_MAX_CTR = 1.2;
const DEFAULT_MIN_POSITION = 3;
const DEFAULT_MAX_POSITION = 20;
const DEFAULT_DATE_MIN_IMPRESSIONS = 25;
const DEFAULT_DATE_MAX_POSITION = 40;
const MAX_OUTPUT_ROWS = 80;
const MAX_DATE_OUTPUT_ROWS = 100;

const COLUMN_ALIASES = {
  query: ['query', 'queries', 'top queries', 'search term', 'الكلمة', 'طلب البحث'],
  page: ['page', 'pages', 'url', 'landing page', 'الصفحة'],
  clicks: ['clicks', 'النقرات'],
  impressions: ['impressions', 'الظهور', 'مرات الظهور'],
  ctr: ['ctr', 'click-through rate', 'نسبة النقر إلى الظهور'],
  position: ['position', 'average position', 'avg. position', 'الموضع', 'متوسط الموضع'],
} as const;

function getArgumentValue(args: string[], key: string) {
  const prefix = `--${key}=`;
  const value = args.find((item) => item.startsWith(prefix));
  if (!value) return null;
  return value.slice(prefix.length).trim() || null;
}

function parseNumber(value: string | null, fallback: number) {
  if (!value) return fallback;
  const normalized = value.replace('%', '').replace(',', '.').trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === ',' && !insideQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function parseCsv(content: string) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error('Search Console CSV must include a header row and at least one data row.');
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const rows = lines.slice(1).map((line) => parseCsvLine(line));

  return { headers, rows };
}

function findColumnIndex(headers: string[], aliases: readonly string[]) {
  const normalizedAliases = aliases.map(normalizeHeader);
  return headers.findIndex((header) => normalizedAliases.includes(header));
}

function requireColumn(headers: string[], aliases: readonly string[], label: string) {
  const index = findColumnIndex(headers, aliases);
  if (index === -1) {
    throw new Error(`Search Console CSV is missing required column: ${label}`);
  }
  return index;
}

function parseCtr(value: string) {
  const parsed = parseNumber(value, 0);
  return value.includes('%') ? parsed : parsed * 100;
}

function parseRows(content: string) {
  const parsed = parseCsv(content);
  const queryIndex = requireColumn(parsed.headers, COLUMN_ALIASES.query, 'query');
  const pageIndex = requireColumn(parsed.headers, COLUMN_ALIASES.page, 'page');
  const clicksIndex = requireColumn(parsed.headers, COLUMN_ALIASES.clicks, 'clicks');
  const impressionsIndex = requireColumn(parsed.headers, COLUMN_ALIASES.impressions, 'impressions');
  const ctrIndex = requireColumn(parsed.headers, COLUMN_ALIASES.ctr, 'ctr');
  const positionIndex = requireColumn(parsed.headers, COLUMN_ALIASES.position, 'position');

  return parsed.rows.map((row) => ({
    query: row[queryIndex] || '',
    page: row[pageIndex] || '',
    clicks: parseNumber(row[clicksIndex] || null, 0),
    impressions: parseNumber(row[impressionsIndex] || null, 0),
    ctr: parseCtr(row[ctrIndex] || '0'),
    position: parseNumber(row[positionIndex] || null, 0),
  })).filter((row) => row.query && row.page && row.impressions > 0);
}

function extractPath(page: string) {
  try {
    return new URL(page).pathname;
  } catch {
    return page.startsWith('/') ? page : `/${page}`;
  }
}

function getRouteFamily(page: string) {
  const pathname = extractPath(page);
  if (pathname.startsWith('/mwaqit-al-salat')) return 'prayer';
  if (pathname.startsWith('/time-now')) return 'time-now';
  if (pathname.startsWith('/time-difference')) return 'time-difference';
  if (pathname.startsWith('/date')) return 'date';
  if (pathname.startsWith('/calculators')) return 'calculators';
  if (pathname.startsWith('/holidays')) return 'holidays';
  if (pathname.startsWith('/blog')) return 'blog';
  if (pathname === '/' || pathname === '/fahras') return 'site';
  return 'other';
}

function classifyRow(row: SearchConsoleRow) {
  if (row.position >= 3 && row.position <= 12 && row.ctr <= 1.2) {
    return {
      priority: 'rewrite-now' as const,
      reason: 'High visibility with weak CTR. Rewrite title, description, H1, and first answer for exact query match.',
    };
  }

  if (row.position > 12 && row.position <= 20 && row.ctr <= 1.2) {
    return {
      priority: 'cluster-review' as const,
      reason: 'Moderate ranking with weak CTR. Improve internal links, topical depth, and snippet promise.',
    };
  }

  if (row.position > 20) {
    return {
      priority: 'position-work' as const,
      reason: 'CTR is partly limited by low ranking. Improve content depth and topical authority before snippet-only work.',
    };
  }

  return {
    priority: 'watch' as const,
    reason: 'Keep monitoring; not the first rewrite target.',
  };
}

function triageRows(
  rows: SearchConsoleRow[],
  minImpressions: number,
  maxCtr: number,
  minPosition: number,
  maxPosition: number,
) {
  return rows
    .filter((row) => (
      row.impressions >= minImpressions
      && row.ctr <= maxCtr
      && row.position >= minPosition
      && row.position <= maxPosition
    ))
    .map((row): TriageRow => {
      const classification = classifyRow(row);
      return {
        ...row,
        routeFamily: getRouteFamily(row.page),
        priority: classification.priority,
        reason: classification.reason,
      };
    })
    .sort((left, right) => (
      right.impressions - left.impressions
      || left.position - right.position
      || left.ctr - right.ctr
    ));
}

function summarizeByFamily(rows: TriageRow[]) {
  const summary = new Map<string, { impressions: number; clicks: number; rows: number }>();

  for (const row of rows) {
    const current = summary.get(row.routeFamily) || { impressions: 0, clicks: 0, rows: 0 };
    summary.set(row.routeFamily, {
      impressions: current.impressions + row.impressions,
      clicks: current.clicks + row.clicks,
      rows: current.rows + 1,
    });
  }

  return Array.from(summary.entries())
    .map(([family, value]) => ({
      family,
      rows: value.rows,
      impressions: value.impressions,
      clicks: value.clicks,
      ctr: value.impressions > 0 ? Number(((value.clicks / value.impressions) * 100).toFixed(2)) : 0,
    }))
    .sort((left, right) => right.impressions - left.impressions);
}

function getDailyDatePageKind(page: string): DatePageKind | null {
  const pathname = extractPath(page);

  if (/^\/date\/hijri\/\d{4}\/\d{2}\/\d{2}\/?$/.test(pathname)) {
    return 'hijri-day';
  }

  if (/^\/date\/\d{4}\/\d{2}\/\d{2}\/?$/.test(pathname)) {
    return 'gregorian-day';
  }

  return null;
}

function getDateDemandCandidates(
  rows: SearchConsoleRow[],
  minImpressions: number,
  maxPosition: number,
): DateDemandCandidate[] {
  const aggregates = new Map<string, {
    page: string;
    kind: DatePageKind;
    clicks: number;
    impressions: number;
    weightedPosition: number;
    queries: Set<string>;
  }>();

  for (const row of rows) {
    const kind = getDailyDatePageKind(row.page);
    if (!kind) continue;

    const pathname = extractPath(row.page);
    const current = aggregates.get(pathname) || {
      page: pathname,
      kind,
      clicks: 0,
      impressions: 0,
      weightedPosition: 0,
      queries: new Set<string>(),
    };

    current.clicks += row.clicks;
    current.impressions += row.impressions;
    current.weightedPosition += row.position * row.impressions;
    current.queries.add(row.query);
    aggregates.set(pathname, current);
  }

  return Array.from(aggregates.values())
    .map((row): DateDemandCandidate => {
      const position = row.impressions > 0
        ? Number((row.weightedPosition / row.impressions).toFixed(2))
        : 0;
      const ctr = row.impressions > 0
        ? Number(((row.clicks / row.impressions) * 100).toFixed(2))
        : 0;

      return {
        page: row.page,
        kind: row.kind,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr,
        position,
        queryCount: row.queries.size,
        reason: row.clicks > 0
          ? 'The page already earns organic clicks and should be reviewed before any noindex decision.'
          : 'The page has meaningful impressions within the review position range.',
      };
    })
    .filter((row) => (
      row.clicks > 0
      || (row.impressions >= minImpressions && row.position <= maxPosition)
    ))
    .sort((left, right) => (
      right.clicks - left.clicks
      || right.impressions - left.impressions
      || left.position - right.position
    ));
}

function main() {
  const args = process.argv.slice(2);
  const input = getArgumentValue(args, 'input');

  if (!input) {
    throw new Error('Missing Search Console CSV path. Use --input=/path/to/export.csv');
  }

  const minImpressions = parseNumber(getArgumentValue(args, 'min-impressions'), DEFAULT_MIN_IMPRESSIONS);
  const maxCtr = parseNumber(getArgumentValue(args, 'max-ctr'), DEFAULT_MAX_CTR);
  const minPosition = parseNumber(getArgumentValue(args, 'min-position'), DEFAULT_MIN_POSITION);
  const maxPosition = parseNumber(getArgumentValue(args, 'max-position'), DEFAULT_MAX_POSITION);
  const dateMinImpressions = parseNumber(
    getArgumentValue(args, 'date-min-impressions'),
    DEFAULT_DATE_MIN_IMPRESSIONS,
  );
  const dateMaxPosition = parseNumber(
    getArgumentValue(args, 'date-max-position'),
    DEFAULT_DATE_MAX_POSITION,
  );
  const csvPath = path.resolve(process.cwd(), input);
  const rows = parseRows(readFileSync(csvPath, 'utf8'));
  const triagedRows = triageRows(rows, minImpressions, maxCtr, minPosition, maxPosition);
  const dateDemandCandidates = getDateDemandCandidates(
    rows,
    dateMinImpressions,
    dateMaxPosition,
  );

  console.log('[search-console-ctr-triage] summary');
  console.log(JSON.stringify({
    input: csvPath,
    totalRows: rows.length,
    matchedRows: triagedRows.length,
    filters: {
      minImpressions,
      maxCtr,
      minPosition,
      maxPosition,
      dateMinImpressions,
      dateMaxPosition,
    },
    byFamily: summarizeByFamily(triagedRows),
    dateDemandCandidatePages: dateDemandCandidates.length,
  }, null, 2));

  console.log('[search-console-ctr-triage] top-opportunities');
  console.log(JSON.stringify(triagedRows.slice(0, MAX_OUTPUT_ROWS), null, 2));

  console.log('[search-console-ctr-triage] date-indexing-candidates');
  console.log(JSON.stringify(dateDemandCandidates.slice(0, MAX_DATE_OUTPUT_ROWS), null, 2));
}

try {
  main();
} catch (error) {
  console.error('[search-console-ctr-triage] crashed');
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
}

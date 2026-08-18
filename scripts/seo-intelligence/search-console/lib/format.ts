import type { SearchConsoleRow } from './report-data';

export function formatInt(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatCtr(ctrFraction: number): string {
  return `${(ctrFraction * 100).toFixed(2)}%`;
}

export function formatPosition(position: number): string {
  return position.toFixed(1);
}

/**
 * One row per line, numeric columns first (fixed width, left-aligned so
 * they stay legible), label/URL/query text last and unpadded — avoids
 * fighting with variable-width Arabic text in a fixed-width table layout.
 */
export function printRow(row: SearchConsoleRow, index: number) {
  const label = row.keys.join('  |  ') || '(all)';
  console.log(
    `  ${String(index + 1).padStart(3)}. clicks=${formatInt(row.clicks).padEnd(7)} ` +
      `impr=${formatInt(row.impressions).padEnd(8)} ctr=${formatCtr(row.ctr).padEnd(7)} ` +
      `pos=${formatPosition(row.position).padEnd(5)} ${label}`,
  );
}

export function printSectionHeader(title: string) {
  console.log(`\n${title}`);
  console.log('-'.repeat(title.length));
}

export function printRows(rows: SearchConsoleRow[], emptyMessage: string) {
  if (rows.length === 0) {
    console.log(`  ${emptyMessage}`);
    return;
  }
  rows.forEach((row, index) => printRow(row, index));
}

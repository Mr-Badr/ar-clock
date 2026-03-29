/**
 * HistoricalTable — Historical dates table for events
 * Shows past and future dates for the event
 */

import { HIJRI_MONTHS_AR } from '@/lib/holidays-engine';

export default function HistoricalTable({ event, hijriYear, currentYear }) {
  if (event.type !== 'hijri') return null;
  const rows = event.historicalDates || [
    { year: `${hijriYear - 1} هـ`, gregorian: `${currentYear - 1}م`, note: 'السنة الماضية' },
    { year: `${hijriYear} هـ`, gregorian: `${currentYear}م`, note: 'السنة الحالية' },
    { year: `${hijriYear + 1} هـ`, gregorian: `${currentYear + 1}م`, note: 'تقديري (~11 يوماً أبكر)' },
  ];
  return (
    <section style={{ marginTop: 'var(--space-8)' }} aria-labelledby="hist-h">
      <h2 id="hist-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
        {event.name} — مواعيد السنوات المتعاقبة
      </h2>
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-default)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }} dir="rtl">
          <caption className="sr-only">تواريخ {event.name} لعدة سنوات</caption>
          <thead>
            <tr style={{ background: 'var(--bg-surface-3)', borderBottom: '1px solid var(--border-default)' }}>
              {['السنة الهجرية', 'التاريخ الهجري', 'الميلادي (تقريبي)', 'ملاحظة'].map(h => (
                <th key={h} scope="col" style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.year} style={{
                background: r.note?.includes('الحالية') ? 'var(--accent-soft)' : i % 2 === 0 ? 'var(--bg-surface-2)' : 'var(--bg-surface-3)',
                borderBottom: '1px solid var(--border-subtle)',
                fontWeight: r.note?.includes('الحالية') ? 'var(--font-semibold)' : 'var(--font-regular)',
              }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{r.year}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{event.hijriDay} {HIJRI_MONTHS_AR[event.hijriMonth]}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{r.gregorian}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)' }}>
                  {r.note?.includes('الحالية') ? <span className="badge badge-accent">{r.note}</span> : <span style={{ color: 'var(--text-muted)' }}>{r.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

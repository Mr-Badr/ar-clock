/**
 * CountryTable — Country comparison table for event dates
 * Shows dates for different countries with calendar method info
 */

export default function CountryTable({ event, countryDates }) {
  if (!countryDates?.length) return null;
  return (
    <section style={{ marginTop: 'var(--space-8)' }} aria-labelledby="country-h">
      <h2 id="country-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
        مواعيد {event.name} حسب الدولة
      </h2>
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-default)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }} dir="rtl">
          <caption className="sr-only">مقارنة مواعيد {event.name}</caption>
          <thead>
            <tr style={{ background: 'var(--bg-surface-3)', borderBottom: '1px solid var(--border-default)' }}>
              {['الدولة', 'التاريخ المتوقع', 'مصدر التقويم'].map(h => (
                <th key={h} scope="col" style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {countryDates.map((row, i) => (
              <tr key={row.code} style={{ background: i % 2 === 0 ? 'var(--bg-surface-2)' : 'var(--bg-surface-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>{row.flag} {row.country}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{row.date}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
        * قد تختلف التواريخ بيوم بناءً على رؤية الهلال في كل دولة.
      </p>
    </section>
  );
}

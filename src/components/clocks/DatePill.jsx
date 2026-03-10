
'use client';
/**
 * components/clocks/DatePill.jsx
 * 
 * A unified date display component used by LiveClock, TimeNowHero, and CountdownTicker.
 * Shows Gregorian and Hijri dates on the same line.
 * 
 * Format: [Gregorian Date] — [Hijri Date]
 */

export default function DatePill({ dateAr, dateHijri, className = '' }) {
  if (!dateAr && !dateHijri) return null;

  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'center', animation: 'ct-fade-in 0.6s ease 0.55s both' }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4em',
        padding: '0.35rem 1.1rem',
        borderRadius: '999px',
        background: 'var(--bg-surface-3)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.85rem',
        fontWeight: '500',
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
      }}>
        <span aria-hidden style={{ opacity: 0.6 }}>📅</span>
        {dateAr}
        {dateAr && dateHijri && <span style={{ margin: '0 0.4rem', opacity: 0.4 }}>—</span>}
        {dateHijri}
      </span>
    </div>
  );
}

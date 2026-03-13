
'use client';
/**
 * components/clocks/DatePill.jsx
 *
 * A unified date display component used by LiveClock, TimeNowHero, and CountdownTicker.
 *
 * Desktop/Tablet : both dates inline on one row → [📅 Gregorian — Hijri]
 * Mobile         : two lines, dash separator between them
 */

export default function DatePill({ dateAr, dateHijri, className = '' }) {
  if (!dateAr && !dateHijri) return null;

  const hasBoth = dateAr && dateHijri;

  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'center', animation: 'ct-fade-in 0.6s ease 0.55s both' }}>
      {/* ── Desktop / tablet layout: single pill, one row ── */}
      <span className="date-pill-desktop" style={{
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
        {hasBoth && <span style={{ margin: '0 0.4rem', opacity: 0.4 }}>—</span>}
        {dateHijri}
      </span>

      {/* ── Mobile layout: stacked, dash as divider ── */}
      <span className="date-pill-mobile" style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.45rem 1rem',
        borderRadius: '1.25rem',
        background: 'var(--bg-surface-3)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.78rem',
        fontWeight: '500',
        color: 'var(--text-muted)',
        gap: 0,
        textAlign: 'center',
      }}>
        {dateAr && <span>{dateAr}</span>}
        {hasBoth && (
          <span style={{ opacity: 0.4, marginBlock: '0.2rem', lineHeight: 1 }}>—</span>
        )}
        {dateHijri && <span>{dateHijri}</span>}
      </span>
    </div>
  );
}

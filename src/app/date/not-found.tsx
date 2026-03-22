import Link from 'next/link';

export default function DateNotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        gap: '1.5rem',
      }}
    >
      <div
        style={{
          fontSize: '4rem',
          lineHeight: 1,
          opacity: 0.3,
        }}
      >
        📅
      </div>
      <h1
        style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--text-primary)',
        }}
      >
        التاريخ غير موجود
      </h1>
      <p
        style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--text-muted)',
          maxWidth: '50ch',
        }}
      >
        التاريخ الذي بحثت عنه غير صحيح أو خارج النطاق المدعوم.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/date"
          className="btn btn-primary"
          style={{
            background: 'var(--accent-gradient)',
            color: 'var(--text-on-accent)',
            padding: '0.65rem 1.5rem',
            borderRadius: 'var(--radius)',
            fontWeight: 'var(--font-semibold)',
            textDecoration: 'none',
          }}
        >
          صفحة التاريخ الرئيسية
        </Link>
        <Link
          href="/date/converter"
          style={{
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
            padding: '0.65rem 1.5rem',
            borderRadius: 'var(--radius)',
            fontWeight: 'var(--font-semibold)',
            textDecoration: 'none',
          }}
        >
          محول التاريخ
        </Link>
      </div>
    </div>
  );
}

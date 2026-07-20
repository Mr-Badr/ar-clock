'use client';

/**
 * This route is embedded via <iframe> on third-party sites, so it must never
 * fall through to Next.js's default error UI — that would render badly
 * inside someone else's small iframe. Kept minimal and chrome-free.
 */
export default function Error({ reset }) {
  return (
    <main className="embed-calculator-widget" dir="rtl" lang="ar" aria-live="polite">
      <p style={{ margin: 0, textAlign: 'center' }}>
        تعذر تحميل الحاسبة.{' '}
        <button
          type="button"
          onClick={() => reset()}
          style={{ textDecoration: 'underline', color: 'inherit', background: 'none', border: 0, cursor: 'pointer', padding: 0, font: 'inherit' }}
        >
          أعد المحاولة
        </button>
      </p>
    </main>
  );
}

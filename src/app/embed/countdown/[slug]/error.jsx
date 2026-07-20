'use client';

export default function Error({ reset }) {
  return (
    <main className="embed-countdown-widget" dir="rtl" lang="ar" aria-live="polite">
      <p style={{ margin: 0 }}>
        تعذر تحميل العداد.{' '}
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

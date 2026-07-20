'use client';

/**
 * This route is embedded via <iframe> on third-party sites, so it must never
 * fall through to Next.js's default error UI (full navbar/stack trace look)
 * — that would render badly inside someone else's small iframe. Kept
 * deliberately minimal and chrome-free, matching the widget's own markup.
 */
export default function Error({ reset }) {
  return (
    <div className="embed-prayer-widget" dir="rtl" lang="ar" aria-live="polite">
      <div className="embed-prayer-widget__header">
        <span className="embed-prayer-widget__city">تعذر تحميل مواقيت الصلاة</span>
      </div>
      <p className="embed-prayer-widget__attribution" style={{ marginBottom: 0 }}>
        حدث خطأ غير متوقع في هذا الودجت.{' '}
        <button
          type="button"
          onClick={() => reset()}
          style={{ textDecoration: 'underline', color: 'inherit', background: 'none', border: 0, cursor: 'pointer', padding: 0, font: 'inherit' }}
        >
          أعد المحاولة
        </button>
      </p>
    </div>
  );
}

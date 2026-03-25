// src/components/date/DateNavigation.tsx
// ─────────────────────────────────────────────────────────────────────────────
// IMPROVED:
//   • Full prev/next labels visible on all sizes (short on mobile, full on sm+)
//   • Uses .btn .btn-surface CSS classes (hover works via CSS, not inline style)
//   • Center "calendar" link is clean and unobtrusive
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';

interface DateNavigationProps {
  prevUrl:   string;
  nextUrl:   string;
  prevLabel: string;
  nextLabel: string;
  hubHref?:  string;
  hubLabel?: string;
}

export function DateNavigation({
  prevUrl,
  nextUrl,
  prevLabel,
  nextLabel,
  hubHref  = '/date/calendar',
  hubLabel = 'التقويم',
}: DateNavigationProps) {
  return (
    <nav
      aria-label="التنقل بين التواريخ"
      className="flex items-center justify-between p-4 rounded-2xl shadow-sm"
      style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', gap: '12px' }}
    >
      {/* Previous */}
      <Link
        href={prevUrl}
        prefetch
        className="btn btn-surface btn-sm flex items-center"
        style={{ gap: '6px' }}
        aria-label={`اليوم السابق: ${prevLabel}`}
      >
        {/* RTL: right arrow for "previous in time" = visually right side */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="hidden sm:inline truncate" style={{ maxWidth: '100px' }}>{prevLabel}</span>
        <span className="sm:hidden">السابق</span>
      </Link>

      {/* Hub */}
      <Link
        href={hubHref}
        className="btn btn-ghost btn-sm flex items-center text-muted"
        style={{ gap: '4px' }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span>{hubLabel}</span>
      </Link>

      {/* Next */}
      <Link
        href={nextUrl}
        prefetch
        className="btn btn-surface btn-sm flex items-center"
        style={{ gap: '6px' }}
        aria-label={`اليوم التالي: ${nextLabel}`}
      >
        <span className="hidden sm:inline truncate" style={{ maxWidth: '100px' }}>{nextLabel}</span>
        <span className="sm:hidden">التالي</span>
        {/* RTL: left arrow for "next in time" = visually left side */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </nav>
  );
}

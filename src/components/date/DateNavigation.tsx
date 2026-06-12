import Link from 'next/link';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DateNavigation.module.css';

interface DateNavigationProps {
  prevUrl?: string;
  nextUrl?: string;
  prevLabel?: string;
  nextLabel?: string;
  hubHref?:  string;
  hubLabel?: string;
}

export function DateNavigation({
  prevUrl,
  nextUrl,
  prevLabel,
  nextLabel,
  hubHref,
  hubLabel,
}: DateNavigationProps) {
  const resolvedHubHref = hubHref ?? '/date/calendar';
  const resolvedHubLabel = hubLabel ?? 'التقويم';

  return (
    <nav
      aria-label="التنقل بين التواريخ"
      className={styles.nav}
    >
      {prevUrl && prevLabel ? (
        <Link
          href={prevUrl}
          prefetch
          className={`btn btn-surface btn-sm ${styles.link}`}
          aria-label={`اليوم السابق: ${prevLabel}`}
        >
          <ChevronRight size={15} strokeWidth={1.9} aria-hidden="true" />
          <span className={`${styles.label} ${styles.desktopLabel}`}>{prevLabel}</span>
          <span className={styles.mobileLabel}>السابق</span>
        </Link>
      ) : (
        <span className={`btn btn-surface btn-sm ${styles.link}`} aria-disabled="true">
          لا يوجد يوم سابق
        </span>
      )}

      <Link
        href={resolvedHubHref}
        className={`btn btn-ghost btn-sm text-muted ${styles.link}`}
      >
        <CalendarDays size={15} strokeWidth={1.8} aria-hidden="true" />
        <span>{resolvedHubLabel}</span>
      </Link>

      {nextUrl && nextLabel ? (
        <Link
          href={nextUrl}
          prefetch
          className={`btn btn-surface btn-sm ${styles.link}`}
          aria-label={`اليوم التالي: ${nextLabel}`}
        >
          <span className={`${styles.label} ${styles.desktopLabel}`}>{nextLabel}</span>
          <span className={styles.mobileLabel}>التالي</span>
          <ChevronLeft size={15} strokeWidth={1.9} aria-hidden="true" />
        </Link>
      ) : (
        <span className={`btn btn-surface btn-sm ${styles.link}`} aria-disabled="true">
          لا يوجد يوم تال
        </span>
      )}
    </nav>
  );
}

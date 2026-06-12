import styles from '@/components/shared/RouteLoading.module.css';
import { Skeleton } from '@/components/ui/skeleton';

type DateRouteLoadingKind = 'hub' | 'calendar';

function TextBlockSkeleton() {
  return (
    <>
      <Skeleton className={styles.titleLine} />
      <Skeleton className={styles.bodyLine} />
      <Skeleton className={styles.bodyLineWide} />
    </>
  );
}

function BreadcrumbSkeleton() {
  return (
    <div className={styles.breadcrumb} aria-hidden="true">
      <Skeleton className={styles.metaLine} />
      <Skeleton className={styles.tinyLine} />
      <Skeleton className={styles.metaLine} />
      <Skeleton className={styles.tinyLine} />
      <Skeleton className={styles.metaLine} />
    </div>
  );
}

function LoadingMonthCard({ index }: { index: number }) {
  return (
    <div key={index} className={styles.monthCard}>
      <div className={styles.monthHead}>
        <Skeleton className={styles.monthTitle} />
        <Skeleton className={styles.monthMeta} />
      </div>

      <div className={styles.weekdayGrid}>
        {Array.from({ length: 7 }, (_, weekday) => (
          <div key={weekday} className={styles.weekdayCell}>
            <Skeleton className={styles.metaLine} />
          </div>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {Array.from({ length: 28 }, (_, cell) => (
          <Skeleton key={`${index}-${cell}`} className={styles.calendarCell} />
        ))}
      </div>
    </div>
  );
}

export function DateCalendarGridSkeleton() {
  return (
    <div className={styles.gridCalendar}>
      {Array.from({ length: 2 }, (_, index) => (
        <LoadingMonthCard key={index} index={index} />
      ))}
    </div>
  );
}

export default function DateRouteLoading({
  kind,
  title,
  description,
}: {
  kind?: DateRouteLoadingKind;
  title?: string;
  description?: string;
}) {
  const resolvedKind = kind ?? 'hub';
  const resolvedTitle =
    title ?? (resolvedKind === 'calendar' ? 'جاري تحميل التقويم' : 'جاري تحميل صفحة التاريخ');
  const resolvedDescription =
    description ??
    (resolvedKind === 'calendar'
      ? 'نجهز لك الأشهر والسنوات ومسارات الأيام الآن.'
      : 'نجهز تاريخ اليوم وأدوات التحويل ومسارات التقويم الآن.');

  return (
    <div className={styles.page} dir="rtl" aria-busy="true">
      <main className={styles.main}>
        <BreadcrumbSkeleton />

        <div className={styles.stack}>
          <section className={styles.panel}>
            <Skeleton className={styles.titleLineWide} aria-hidden="true" />
            <Skeleton className={styles.bodyLine} aria-hidden="true" />
            <Skeleton className={styles.bodyLineShort} aria-hidden="true" />
            <p className={styles.helperText}>{resolvedTitle}</p>
            <p className={styles.helperTextSmall}>{resolvedDescription}</p>
          </section>

          {resolvedKind === 'hub' ? (
            <>
              <section className={styles.gridTwo} aria-hidden="true">
                {Array.from({ length: 2 }, (_, index) => (
                  <div key={`date-loading-feature-${index}`} className={styles.panelTight}>
                    <Skeleton className={styles.metaLine} />
                    <Skeleton className={styles.titleLine} />
                    <Skeleton className={styles.bodyLineShort} />
                  </div>
                ))}
              </section>

              <section className={styles.gridFour} aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => (
                  <div key={`date-loading-link-${index}`} className={styles.panelTight}>
                    <Skeleton className={styles.square} />
                    <Skeleton className={styles.bodyLineWide} />
                    <Skeleton className={styles.bodyLineShort} />
                  </div>
                ))}
              </section>

              <section className={styles.gridTwo} aria-hidden="true">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={`date-loading-section-${index}`} className={styles.panelTight}>
                    <TextBlockSkeleton />
                  </div>
                ))}
              </section>
            </>
          ) : (
            <>
              <section aria-hidden="true">
                <DateCalendarGridSkeleton />
              </section>

              <section className={styles.gridTwo} aria-hidden="true">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={`date-calendar-loading-section-${index}`} className={styles.panelTight}>
                    <TextBlockSkeleton />
                    <Skeleton className={styles.bodyLineShort} />
                  </div>
                ))}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

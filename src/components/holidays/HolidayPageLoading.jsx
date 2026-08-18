import styles from '@/components/shared/RouteLoading.module.css';
import { Skeleton } from '@/components/ui/skeleton';
import StuckLoadingRecovery from '@/components/shared/StuckLoadingRecovery.client';

function BreadcrumbSkeleton() {
  return (
    <div className={styles.breadcrumb} aria-hidden="true">
      <Skeleton className={styles.metaLine} />
      <Skeleton className={styles.tinyLine} />
      <Skeleton className={styles.metaLine} />
      <Skeleton className={styles.tinyLine} />
      <Skeleton className={styles.titleLine} />
    </div>
  );
}

export default function HolidayPageLoading() {
  return (
    <div className={styles.page} dir="rtl" aria-busy="true">
      {/* This skeleton is the ONLY Suspense boundary the page has (the real
          page.jsx awaits its data at the top level, no inner Suspense) — if
          the streamed content never arrives, this stays on screen forever
          without the watchdog below. See StuckLoadingRecovery for why. */}
      <StuckLoadingRecovery />
      <main className={styles.main}>
        <BreadcrumbSkeleton />

        <div className={styles.stack}>
          <section className={styles.panel} aria-hidden="true">
            <Skeleton className={styles.metaLine} />
            <Skeleton className={styles.titleLineWide} />
            <Skeleton className={styles.bodyLine} />
            <Skeleton className={styles.bodyLineShort} />
          </section>

          <section className={styles.panel} aria-hidden="true">
            <div className={styles.gridFour}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={`holiday-loading-fact-${index}`} className={styles.square} />
              ))}
            </div>
          </section>

          <section className={styles.gridTwo} aria-hidden="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`holiday-loading-section-${index}`} className={styles.panelTight}>
                <Skeleton className={styles.titleLine} />
                <Skeleton className={styles.bodyLine} />
                <Skeleton className={styles.bodyLineWide} />
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

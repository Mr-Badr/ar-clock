import { Calculator } from 'lucide-react';

import styles from '@/components/shared/RouteLoading.module.css';
import { Skeleton } from '@/components/ui/skeleton';

function TextBlockSkeleton() {
  return (
    <>
      <Skeleton className={styles.titleLine} />
      <Skeleton className={styles.bodyLine} />
      <Skeleton className={styles.bodyLineWide} />
    </>
  );
}

export default function CalculatorRouteLoading() {
  return (
    <main className={styles.page} dir="rtl" aria-busy="true">
      <span className="sr-only">جاري تجهيز قسم الحاسبات والشرح المرافق للنتائج.</span>
      <section className={styles.main}>
        <div className={styles.stack}>
          <section className={styles.panel} aria-hidden="true">
            <div className={styles.kicker}>
              <Calculator size={16} aria-hidden="true" />
              قسم الحاسبات
            </div>
            <Skeleton className={styles.titleLineWide} />
            <Skeleton className={styles.bodyLine} />
            <Skeleton className={styles.bodyLineShort} />
            <div className={styles.gridTwo}>
              <Skeleton className={styles.largeTile} />
              <Skeleton className={styles.largeTile} />
            </div>
          </section>

          <section className={styles.panel} aria-hidden="true">
            <TextBlockSkeleton />
            <div className={styles.gridFour}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`calculator-route-loading-hub-${index}`} className={styles.tile} />
              ))}
            </div>
          </section>

          <section className={styles.gridTwo} aria-hidden="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`calculator-route-loading-card-${index}`} className={styles.panelTight}>
                <TextBlockSkeleton />
                <Skeleton className={styles.chart} />
              </div>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}

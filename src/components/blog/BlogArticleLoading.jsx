import { Skeleton } from '@/components/ui/skeleton';

import styles from './BlogArticleView.module.css';

export default function BlogArticleLoading() {
  return (
    <main className={styles.page} dir="rtl" aria-busy="true">
      <span className="sr-only">جاري تجهيز المقالات، ستظهر الخلاصة والنتائج بعد لحظات.</span>
      <div className={styles.shell}>
        <div className={styles.breadcrumb}>
          <Skeleton className="h-4 w-16 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-4 w-3 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-4 w-20 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-4 w-3 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-4 w-36 bg-[var(--bg-surface-2)]" />
        </div>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <Skeleton className="h-8 w-32 rounded-[var(--radius-md)] bg-[var(--bg-surface-2)]" />
            <Skeleton className="h-12 w-3/4 bg-[var(--bg-surface-2)]" />
            <Skeleton className="h-5 w-full bg-[var(--bg-surface-2)]" />
            <Skeleton className="h-5 w-11/12 bg-[var(--bg-surface-2)]" />
            <div className={styles.highlightList}>
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className={styles.highlightItem}>
                  <Skeleton className="h-3 w-3 rounded-[var(--radius-sm)] bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-4 w-full bg-[var(--bg-surface-2)]" />
                </div>
              ))}
            </div>
            <div className={styles.heroFooter}>
              <div className={styles.summaryCard}>
                <Skeleton className="h-4 w-28 bg-[var(--bg-surface-2)]" />
                <Skeleton className="mt-3 h-7 w-3/4 bg-[var(--bg-surface-2)]" />
                <Skeleton className="mt-3 h-4 w-full bg-[var(--bg-surface-2)]" />
                <Skeleton className="mt-2 h-4 w-10/12 bg-[var(--bg-surface-2)]" />
              </div>
              <div className={styles.quickFactsGrid}>
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className={styles.quickFactCard}>
                    <Skeleton className="h-8 w-8 rounded-[var(--radius-lg)] bg-[var(--bg-surface-2)]" />
                    <Skeleton className="h-6 w-16 bg-[var(--bg-surface-2)]" />
                    <Skeleton className="h-4 w-20 bg-[var(--bg-surface-2)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <Skeleton className="h-5 w-24 bg-[var(--bg-surface-2)]" />
              <div className={styles.toc}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded-[var(--radius-lg)] bg-[var(--bg-surface-2)]" />
                ))}
              </div>
            </div>
          </aside>

          <div className={styles.content}>
            {Array.from({ length: 3 }, (_, index) => (
              <section key={index} className={styles.section}>
                <div className={styles.sectionHead}>
                  <Skeleton className="h-5 w-28 rounded-[var(--radius-md)] bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-8 w-2/3 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-4 w-full bg-[var(--bg-surface-2)]" />
                </div>
                <div className={styles.answerGrid}>
                  {Array.from({ length: 2 }, (_, cardIndex) => (
                    <div key={cardIndex} className={styles.answerCard}>
                      <Skeleton className="h-6 w-3/4 bg-[var(--bg-surface-2)]" />
                      <Skeleton className="h-4 w-full bg-[var(--bg-surface-2)]" />
                      <Skeleton className="h-4 w-10/12 bg-[var(--bg-surface-2)]" />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

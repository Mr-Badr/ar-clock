import { Skeleton } from '@/components/ui/skeleton';
import routeStyles from '@/app/mwaqit-al-salat/PrayerRoutePage.module.css';

export default function PrayerRouteLoading() {
  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">
      <main>
        <div className={`container mx-auto px-4 ${routeStyles.breadcrumb}`} aria-hidden="true">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        <section className={`container mx-auto px-4 ${routeStyles.heroSection}`} aria-hidden="true">
          <div className={routeStyles.heroInner}>
            <div className={routeStyles.heroCopy}>
              <Skeleton className="h-12 w-80 rounded-[var(--radius-md)]" />
              <Skeleton className="h-4 w-full max-w-[42rem] rounded-[var(--radius-md)]" />
              <Skeleton className="h-4 w-3/4 max-w-[34rem] rounded-[var(--radius-md)]" />
            </div>

            <div className={routeStyles.searchWrap}>
              <Skeleton className="h-16 w-full rounded-[var(--radius-lg)]" />
              <Skeleton className="mt-3 h-3 w-36 rounded-[var(--radius-md)]" />
            </div>

            <div className="space-y-4">
              <Skeleton className={routeStyles.largePanelSkeleton} />
              <div className={routeStyles.sectionPanel}>
                <Skeleton className={`${routeStyles.titleSkeleton} ${routeStyles.lineSkeleton}`} />
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={`prayer-loading-row-${index}`} className={routeStyles.faqItemSkeleton} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

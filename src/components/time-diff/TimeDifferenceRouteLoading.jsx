import { Globe } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

export default function TimeDifferenceRouteLoading() {
  return (
    <div className="route-loading-shell" dir="rtl">
      <main className="route-loading-shell__main content-col">
        <header className="route-loading-hero" aria-hidden="true">
          <div className="route-loading-badge">
            <Globe size={13} aria-hidden />
            فرق التوقيت
          </div>
          <Skeleton className="route-loading-skeleton route-loading-skeleton--title" />
          <Skeleton className="route-loading-skeleton route-loading-skeleton--lead" />
        </header>

        <section className="surface-panel route-loading-block" aria-hidden="true">
          <Skeleton className="route-loading-skeleton route-loading-skeleton--section-title" />
          <Skeleton className="route-loading-skeleton route-loading-skeleton--line" />
          <Skeleton className="route-loading-skeleton route-loading-skeleton--line route-loading-skeleton--line-short" />
          <div className="route-loading-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`time-diff-quick-link-${index}`} className="route-loading-skeleton route-loading-skeleton--link" />
            ))}
          </div>
        </section>

        <section className="surface-panel route-loading-block" aria-hidden="true">
          <div className="route-loading-converter">
            <Skeleton className="route-loading-skeleton route-loading-skeleton--field" />
            <Skeleton className="route-loading-skeleton route-loading-skeleton--swap" />
            <Skeleton className="route-loading-skeleton route-loading-skeleton--field" />
          </div>
        </section>

        <section className="route-loading-two-col" aria-hidden="true">
          <Skeleton className="route-loading-skeleton route-loading-skeleton--panel" />
          <Skeleton className="route-loading-skeleton route-loading-skeleton--panel" />
        </section>

        <section className="route-loading-two-col" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`time-diff-content-card-${index}`} className="surface-panel route-loading-block">
              <Skeleton className="route-loading-skeleton route-loading-skeleton--section-title" />
              <Skeleton className="route-loading-skeleton route-loading-skeleton--line" />
              <Skeleton className="route-loading-skeleton route-loading-skeleton--line route-loading-skeleton--line-short" />
              <Skeleton className="route-loading-skeleton route-loading-skeleton--mini-panel" />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

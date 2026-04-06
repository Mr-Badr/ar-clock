import { Skeleton } from '@/components/ui/skeleton';

type DateRouteLoadingKind = 'hub' | 'calendar';

function LoadingMonthCard({ index }: { index: number }) {
  return (
    <div key={index} className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: 'var(--accent-soft)' }}
      >
        <Skeleton className="h-4 w-24 bg-[var(--bg-surface-3)]" />
        <Skeleton className="h-3 w-16 bg-[var(--bg-surface-3)]" />
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {Array.from({ length: 7 }, (_, weekday) => (
          <div key={weekday} className="px-1 py-2">
            <Skeleton className="h-3 w-full bg-[var(--bg-surface-3)]" />
          </div>
        ))}
      </div>

      <div className="grid p-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
        {Array.from({ length: 35 }, (_, cell) => (
          <Skeleton
            key={`${index}-${cell}`}
            className="h-9 rounded-md bg-[var(--bg-surface-2)]"
          />
        ))}
      </div>
    </div>
  );
}

export function DateCalendarGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '20px' }}>
      {Array.from({ length: 6 }, (_, index) => (
        <LoadingMonthCard key={index} index={index} />
      ))}
    </div>
  );
}

export default function DateRouteLoading({
  kind = 'hub',
  title,
  description,
}: {
  kind?: DateRouteLoadingKind;
  title?: string;
  description?: string;
}) {
  const resolvedTitle =
    title ?? (kind === 'calendar' ? 'جاري تحميل التقويم' : 'جاري تحميل صفحة التاريخ');
  const resolvedDescription =
    description ??
    (kind === 'calendar'
      ? 'نجهز لك الأشهر والسنوات وروابط الأيام الآن.'
      : 'نجهز تاريخ اليوم وأدوات التحويل وروابط التقويم الآن.');

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl">
      <main className="content-col pt-24 pb-20 mt-12">
        <div className="mb-5 hidden sm:flex items-center gap-2">
          <Skeleton className="h-3 w-16 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-3 w-3 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-3 w-24 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-3 w-3 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-3 w-20 bg-[var(--bg-surface-2)]" />
        </div>

        <section className="card mb-8">
          <Skeleton className="h-10 w-60 mb-4 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-4 w-full max-w-2xl mb-2 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-4 w-11/12 max-w-xl bg-[var(--bg-surface-2)]" />
          <p className="text-sm text-muted mt-4 mb-0">{resolvedTitle}</p>
          <p className="text-xs text-muted mt-2 mb-0">{resolvedDescription}</p>
        </section>

        {kind === 'hub' ? (
          <>
            <section className="card mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
                <div className="card-nested">
                  <Skeleton className="h-4 w-28 mb-4 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-16 w-28 mb-3 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-6 w-40 mb-2 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-4 w-32 bg-[var(--bg-surface-2)]" />
                </div>
                <div className="card-nested">
                  <Skeleton className="h-4 w-28 mb-4 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-16 w-28 mb-3 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-6 w-40 mb-2 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-4 w-32 bg-[var(--bg-surface-2)]" />
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mb-8" style={{ gap: '12px' }}>
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="card">
                  <Skeleton className="h-8 w-8 mb-4 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-4 w-5/6 mb-2 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-3 w-2/3 bg-[var(--bg-surface-2)]" />
                </div>
              ))}
            </section>

            <section className="grid md:grid-cols-2" style={{ gap: '16px' }}>
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="card">
                  <Skeleton className="h-5 w-40 mb-3 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-4 w-full mb-2 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-4 w-10/12 bg-[var(--bg-surface-2)]" />
                </div>
              ))}
            </section>
          </>
        ) : (
          <>
            <section className="mb-8">
              <DateCalendarGridSkeleton />
            </section>

            <section className="grid md:grid-cols-2" style={{ gap: '16px' }}>
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="card">
                  <Skeleton className="h-5 w-36 mb-3 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-4 w-full mb-2 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-4 w-11/12 mb-2 bg-[var(--bg-surface-2)]" />
                  <Skeleton className="h-4 w-3/4 bg-[var(--bg-surface-2)]" />
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton';
import StuckLoadingRecovery from '@/components/shared/StuckLoadingRecovery.client';

export default function Loading() {
  // This single boundary also covers /imsakiya/[country] and
  // /imsakiya/[country]/[city] (no more specific loading.jsx exists for
  // either) — both use a priority-slice generateStaticParams, so most
  // country/city pages render on demand behind this fallback. See
  // StuckLoadingRecovery for why a watchdog matters here.
  return (
    <div className="container mx-auto px-4 pt-10 pb-12" dir="rtl">
      <StuckLoadingRecovery />
      <Skeleton className="h-4 w-48 mb-4" />
      <Skeleton className="h-9 w-80 mb-3" />
      <Skeleton className="h-5 w-64 mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

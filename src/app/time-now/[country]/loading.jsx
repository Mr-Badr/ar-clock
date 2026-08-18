import TimeNowRouteLoading from '@/components/time-now/TimeNowRouteLoading';
import StuckLoadingRecovery from '@/components/shared/StuckLoadingRecovery.client';

export default function Loading() {
  // Only 24 of ~221 countries are statically prerendered
  // (getPriorityCountrySlugs) — most render on demand behind this
  // fallback. See StuckLoadingRecovery for why a watchdog matters here.
  return (
    <>
      <StuckLoadingRecovery />
      <TimeNowRouteLoading />
    </>
  );
}

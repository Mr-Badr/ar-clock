import TimeNowRouteLoading from '@/components/time-now/TimeNowRouteLoading';
import StuckLoadingRecovery from '@/components/shared/StuckLoadingRecovery.client';

export default function Loading() {
  // Only a priority slice of cities is statically prerendered
  // (getPriorityCityParams/getPriorityCountriesCityParams) — most city
  // pages render on demand behind this fallback. See StuckLoadingRecovery
  // for why a watchdog matters here.
  return (
    <>
      <StuckLoadingRecovery />
      <TimeNowRouteLoading />
    </>
  );
}

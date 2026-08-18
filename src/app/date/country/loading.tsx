import DateRouteLoading from '@/components/date/DateRouteLoading';
import StuckLoadingRecovery from '@/components/shared/StuckLoadingRecovery.client';

export default function Loading() {
  return (
    <>
      {/* This boundary also covers /date/country/[countrySlug] — only 24 of
          ~221 countries are statically prerendered (getPriorityCountrySlugs),
          so most country slugs render on demand behind this fallback. See
          StuckLoadingRecovery for why a watchdog matters here. */}
      <StuckLoadingRecovery />
      <DateRouteLoading
        kind="hub"
        title="جاري تحديد بلدك"
        description="نجهز صفحة التاريخ المناسبة لبلدك حسب موقعك أو إعدادات متصفحك."
      />
    </>
  );
}

import DateRouteLoading from '@/components/date/DateRouteLoading';

export default function GregorianCalendarYearLoading() {
  return (
    <DateRouteLoading
      kind="calendar"
      title="جاري تجهيز التقويم الميلادي"
      description="نحمّل لك الملخص والشهور بشكل تدريجي حتى لا ترى صفحة فارغة أثناء الانتقال."
    />
  );
}

import DateRouteLoading from '@/components/date/DateRouteLoading';

export default function HijriCalendarYearLoading() {
  return (
    <DateRouteLoading
      kind="calendar"
      title="جاري تجهيز التقويم الهجري"
      description="نعرض لك عنوان السنة والملخص أولاً، ثم نحمّل شبكة الأشهر والأيام."
    />
  );
}

'use client';

import RouteSegmentError from '@/components/shared/RouteSegmentError';

export default function Error({
  error,
  reset,
  unstable_retry,
}: {
  error: Error;
  reset: () => void;
  unstable_retry?: () => void;
}) {
  return (
    <RouteSegmentError
      error={error}
      reset={reset}
      unstable_retry={unstable_retry}
      boundary="app/date/calendar/hijri/[year]"
      eyebrow="تم احتواء مشكلة صفحة السنة الهجرية"
      title="تعذر تحميل صفحة التقويم الهجري لهذه السنة بالكامل"
      description="أوقفنا الخلل داخل صفحة السنة الهجرية نفسها حتى تبقى التجربة مفهومة وقابلة لإعادة المحاولة."
    />
  );
}

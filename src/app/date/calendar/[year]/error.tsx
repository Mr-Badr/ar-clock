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
      boundary="app/date/calendar/[year]"
      eyebrow="تم احتواء مشكلة صفحة السنة"
      title="تعذر تحميل صفحة التقويم الميلادي لهذه السنة بالكامل"
      description="الخلل أصاب صفحة السنة نفسها قبل اكتمال التقويم، لذلك أظهرنا لك شاشة واضحة ومباشرة بدلاً من صفحة غير مفهومة."
    />
  );
}

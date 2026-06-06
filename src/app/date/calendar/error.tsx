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
      boundary="app/date/calendar"
      eyebrow="تم احتواء مشكلة التقويم الميلادي"
      title="تعذر تحميل قسم التقويم الميلادي بالكامل"
      description="حصل خلل داخل صفحات التقويم الميلادي، لذلك عرضنا لك بديلاً واضحاً يسمح بإعادة المحاولة بدلاً من انهيار التجربة."
    />
  );
}

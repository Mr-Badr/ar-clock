'use client';

import RouteSegmentError from '@/components/shared/RouteSegmentError';

export default function Error({
  error,
  reset,
  unstable_retry,
}) {
  return (
    <RouteSegmentError
      error={error}
      reset={reset}
      unstable_retry={unstable_retry}
      boundary="app/time-now"
      eyebrow="تم احتواء مشكلة قسم الوقت الان"
      title="تعذر تحميل قسم الوقت الان بالكامل"
      description="الخلل أصاب صفحة الوقت الان نفسها قبل اكتمال العرض، لذلك أظهرنا لك بديلاً واضحاً بدلاً من شاشة بيضاء."
    />
  );
}

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
      boundary="app/date"
      eyebrow="تم احتواء مشكلة قسم التاريخ"
      title="تعذر تحميل قسم التاريخ بالكامل"
      description="حدث الخلل داخل قسم التاريخ قبل اكتمال العرض، لذلك أظهرنا لك حالة واضحة بدلاً من شاشة فارغة. جرّب إعادة المحاولة وسيبقى السجل محتفظاً بالتفاصيل."
    />
  );
}

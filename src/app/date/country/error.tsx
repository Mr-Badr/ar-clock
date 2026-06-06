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
      boundary="app/date/country"
      eyebrow="تم احتواء مشكلة دليل الدول"
      title="تعذر تحميل صفحة التاريخ حسب الدولة بالكامل"
      description="تعطلت صفحة دليل الدول قبل اكتمال محتواها، لذلك عرضنا لك حالة واضحة مع إمكانية إعادة المحاولة بدلاً من صفحة فارغة."
    />
  );
}

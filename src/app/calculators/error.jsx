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
      boundary="app/calculators"
      eyebrow="تعذر تجهيز الحاسبات الآن"
      title="لم يكتمل تحميل قسم الحاسبات"
      description="الحاسبة تحتاج أن تظهر مع المدخلات والنتيجة والشرح معاً. أعد المحاولة حتى لا تعتمد على صفحة ناقصة أو رقم من دون سياق."
    />
  );
}

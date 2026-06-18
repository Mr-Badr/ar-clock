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
      boundary="app/time-now/[country]/[city]"
      eyebrow="تم احتواء مشكلة صفحة المدينة"
      title="تعذر تحميل صفحة الوقت في هذه المدينة بالكامل"
      description="أظهرنا لك حالة واضحة بدلاً من صفحة بيضاء أو فارغة. بعد إعادة المحاولة ستصلنا تفاصيل الخطأ في السجل إذا كان الخلل ما زال قائماً."
    />
  );
}

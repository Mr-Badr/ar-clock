'use client';

import RouteSegmentError from '@/components/shared/RouteSegmentError';

export default function Error({
  error,
  reset,
}) {
  return (
    <RouteSegmentError
      error={error}
      reset={reset}
      boundary="app/time-difference/[from]/[to]"
      eyebrow="تم احتواء مشكلة صفحة المقارنة"
      title="تعذر تحميل صفحة فرق التوقيت بالكامل"
      description="صفحة المقارنة نفسها واجهت مشكلة قبل اكتمال البيانات، لذلك عرضنا لك بديلاً واضحاً ومتاحاً لإعادة المحاولة بدلاً من تركك مع شاشة غير مفهومة."
    />
  );
}

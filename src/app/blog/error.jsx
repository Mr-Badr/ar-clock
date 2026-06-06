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
      boundary="app/blog"
      eyebrow="تعذر تجهيز المدونة الآن"
      title="لم نحمّل المقالات بالطريقة المتوقعة"
      description="أبقينا الصفحة في حالة واضحة بدلاً من عرض مساحة فارغة. أعد المحاولة، ثم ابدأ من البحث أو التصفية عندما تعود المقالات للظهور."
    />
  );
}

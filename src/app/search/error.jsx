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
      boundary="app/search"
      eyebrow="تعذر تجهيز البحث الآن"
      title="لم تظهر نتائج البحث بالطريقة المتوقعة"
      description="أعد المحاولة أولاً. إذا استمر الخطأ، افتح فهرس ميقاتنا وابحث من هناك حسب القسم: الوقت، الصلاة، التاريخ، الحاسبات، المناسبات، أو المقالات."
    />
  );
}

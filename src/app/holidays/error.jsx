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
      boundary="app/holidays"
      eyebrow="تم احتواء مشكلة قسم المناسبات"
      title="تعذر تحميل قسم المناسبات بالكامل"
      description="حدث خلل أثناء تجهيز العدادات أو الفلاتر. أعد المحاولة، أو افتح التاريخ اليوم ومواقيت الصلاة إذا كان سؤالك عاجلاً قبل الرجوع إلى قائمة المناسبات."
    />
  );
}

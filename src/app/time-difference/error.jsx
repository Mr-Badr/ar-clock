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
      boundary="app/time-difference"
      eyebrow="تم احتواء مشكلة قسم فرق التوقيت"
      title="تعذر تحميل قسم فرق التوقيت بالكامل"
      description="أوقفنا الخلل داخل قسم فرق التوقيت نفسه حتى تحصل على شاشة واضحة مع إعادة المحاولة بدلاً من فقدان الصفحة."
    />
  );
}

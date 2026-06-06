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
      boundary="app/time-difference"
      eyebrow="تم احتواء مشكلة قسم فرق التوقيت"
      title="تعذر تحميل قسم فرق التوقيت بالكامل"
      description="أوقفنا الخلل داخل قسم فرق التوقيت نفسه حتى تحصل على شاشة واضحة مع إعادة المحاولة بدلاً من فقدان الصفحة."
    />
  );
}

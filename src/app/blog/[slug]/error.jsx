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
      boundary="app/blog/[slug]"
      eyebrow="تعذر تجهيز المقال الآن"
      title="لم يكتمل تحميل هذا المقال"
      description="المقال يحتاج أن يظهر بجوابه وخطواته ومساراته كاملة. أعد المحاولة حتى لا تقرأ نسخة ناقصة أو تفقد الطريق إلى الخطوة التالية."
    />
  );
}

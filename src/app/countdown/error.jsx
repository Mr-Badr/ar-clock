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
      boundary="app/countdown"
      eyebrow="تعذر تجهيز العداد التنازلي الآن"
      title="لم يكتمل تحميل صفحة العداد التنازلي"
      description="أعد المحاولة حتى لا تعتمد على عداد أو تاريخ ناقص."
    />
  );
}

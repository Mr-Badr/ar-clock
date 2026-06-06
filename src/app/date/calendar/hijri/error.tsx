'use client';

import RouteSegmentError from '@/components/shared/RouteSegmentError';

export default function Error({
  error,
  reset,
  unstable_retry,
}: {
  error: Error;
  reset: () => void;
  unstable_retry?: () => void;
}) {
  return (
    <RouteSegmentError
      error={error}
      reset={reset}
      unstable_retry={unstable_retry}
      boundary="app/date/calendar/hijri"
      eyebrow="تم احتواء مشكلة التقويم الهجري"
      title="تعذر تحميل قسم التقويم الهجري بالكامل"
      description="الخلل محصور داخل صفحات التقويم الهجري، لذلك يمكنك إعادة المحاولة من شاشة واضحة بدلاً من فقدان الصفحة كلها."
    />
  );
}

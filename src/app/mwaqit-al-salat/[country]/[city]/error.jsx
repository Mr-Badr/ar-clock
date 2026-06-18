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
      boundary="app/mwaqit-al-salat/[country]/[city]"
      eyebrow="تم احتواء مشكلة صفحة المدينة"
      title="تعذر تحميل صفحة مواقيت الصلاة لهذه المدينة بالكامل"
      description="بدلاً من صفحة بيضاء أو رسالة غامضة، أظهرنا لك حالة واضحة يمكنك منها إعادة المحاولة بينما نحتفظ بتفاصيل الخطأ في السجل."
    />
  );
}

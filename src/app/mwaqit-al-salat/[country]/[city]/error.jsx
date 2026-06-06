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
      boundary="app/mwaqit-al-salat/[country]/[city]"
      eyebrow="تم احتواء مشكلة صفحة المدينة"
      title="تعذر تحميل صفحة مواقيت الصلاة لهذه المدينة بالكامل"
      description="بدلاً من صفحة بيضاء أو رسالة غامضة، أظهرنا لك حالة واضحة يمكنك منها إعادة المحاولة بينما نحتفظ بتفاصيل الخطأ في السجل."
    />
  );
}

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
      boundary="app/mwaqit-al-salat"
      eyebrow="تم احتواء مشكلة قسم مواقيت الصلاة"
      title="تعذر تحميل قسم مواقيت الصلاة بالكامل"
      description="حصرنا الخلل داخل قسم مواقيت الصلاة نفسه حتى لا تتحول الصفحة إلى حالة فارغة أو مربكة. جرّب إعادة المحاولة وسيسجل النظام التفاصيل."
    />
  );
}

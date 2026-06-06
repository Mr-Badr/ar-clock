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
      boundary="app/mwaqit-al-salat/[country]"
      eyebrow="تم احتواء مشكلة صفحة الدولة"
      title="تعذر تحميل صفحة مواقيت الصلاة لهذه الدولة بالكامل"
      description="أظهرنا لك حالة واضحة بدلاً من صفحة فارغة. جرّب إعادة المحاولة، وإذا استمرت المشكلة فسيبقى السجل محتفظاً بالتفاصيل اللازمة للمراجعة."
    />
  );
}

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
      boundary="app/date/country/[countrySlug]"
      eyebrow="تم احتواء مشكلة صفحة التاريخ"
      title="تعذر تحميل صفحة التاريخ لهذه الدولة بالكامل"
      description="أظهرنا لك حالة واضحة بدلاً من شاشة فارغة. جرّب إعادة المحاولة، وإذا استمرت المشكلة فسيبقى السجل محتفظاً بالتفاصيل اللازمة للمراجعة."
    />
  );
}

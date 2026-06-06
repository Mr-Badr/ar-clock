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
      boundary="app/time-now/[country]"
      eyebrow="تم احتواء مشكلة صفحة الدولة"
      title="تعذر تحميل صفحة الوقت في هذه الدولة بالكامل"
      description="الخلل أصاب الصفحة نفسها قبل اكتمال عرض أقسامها، لذلك أظهرنا لك شاشة واضحة بدلاً من صفحة فارغة. جرّب إعادة المحاولة وسنلتقط التفاصيل في السجل."
    />
  );
}

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
      boundary="app/holidays/[slug]"
      eyebrow="تم احتواء مشكلة صفحة المناسبة"
      title="تعذر تحميل صفحة المناسبة بالكامل"
      description="الخلل أصاب الصفحة التفصيلية لهذه المناسبة قبل اكتمال أقسامها، لذلك عرضنا بديلاً واضحاً ومتاحاً لإعادة المحاولة."
    />
  );
}

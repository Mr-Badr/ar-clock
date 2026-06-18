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
      boundary="app/holidays/[slug]"
      eyebrow="تم احتواء مشكلة صفحة المناسبة"
      title="تعذر تحميل صفحة المناسبة بالكامل"
      description="الخلل أصاب الصفحة التفصيلية لهذه المناسبة قبل اكتمال أقسامها، لذلك عرضنا بديلاً واضحاً ومتاحاً لإعادة المحاولة."
    />
  );
}

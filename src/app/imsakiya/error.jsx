'use client';

import RouteSegmentError from '@/components/shared/RouteSegmentError';

export default function Error({ error, reset, unstable_retry }) {
  return (
    <RouteSegmentError
      error={error}
      reset={reset}
      unstable_retry={unstable_retry}
      boundary="app/imsakiya"
      eyebrow="تعذر تحميل الإمساكية"
      title="تعذر تحميل جدول إمساكية رمضان"
      description="حصرنا الخلل في قسم الإمساكية. جرّب إعادة المحاولة."
    />
  );
}

'use client';

import { startTransition, useEffect } from 'react';

import PageStatusState from '@/components/shared/PageStatusState';
import { logger, serializeError } from '@/lib/logger';

export default function Error({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    logger.warn('next-route-error-boundary', {
      boundary: 'app/error',
      error: serializeError(error),
      handled: true,
    });
  }, [error]);

  function handleRetry() {
    const retry = typeof unstable_retry === 'function' ? unstable_retry : reset;

    startTransition(() => {
      retry();
    });
  }

  return (
    <PageStatusState
      tone="error"
      statusKey="app-error"
      eyebrow="تم احتواء المشكلة"
      title="حدث خلل مفاجئ في هذا الجزء من الصفحة"
      description="بقية التطبيق ما زالت تعمل بشكل طبيعي. جرّب إعادة تحميل هذا الجزء، وإذا استمرت المشكلة فغالباً تكون مؤقتة وسيتم التقاط تفاصيلها في السجل."
      guidanceTitle="ما الذي يمكنك فعله الآن؟"
      guidanceBody="أعد المحاولة أولاً. إذا ظهر الخطأ مرة أخرى، حدّث الصفحة أو انتقل إلى قسم آخر ثم ارجع لاحقاً."
      actions={[
        {
          label: 'إعادة المحاولة',
          onClick: handleRetry,
          primary: true,
        },
      ]}
    />
  );
}

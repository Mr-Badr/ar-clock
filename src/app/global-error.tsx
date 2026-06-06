'use client';

import { startTransition, useEffect } from 'react';

import PageStatusState from '@/components/shared/PageStatusState';
import { logger, serializeError } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    logger.warn('next-global-error-boundary', {
      boundary: 'app/global-error',
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
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          fontFamily: 'Noto Sans Arabic, system-ui, sans-serif',
          background: 'var(--bg)',
          color: 'var(--text-primary)',
        }}
      >
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '0',
          }}
        >
          <PageStatusState
            tone="error"
            statusKey="global-error"
            eyebrow="تم إيقاف الخلل قبل أن يتمدّد"
            title="حدث خلل كبير، لكن التطبيق ما زال تحت السيطرة"
            description="يمكنك إعادة المحاولة الآن. وإذا استمرت المشكلة، فالتفاصيل الضرورية تم تسجيلها للمراجعة والتشخيص بدون إسقاط التجربة كلها."
            guidanceTitle="خطوات مقترحة"
            guidanceBody="أعد المحاولة أولاً. وإن عاد الخلل مرة أخرى، حدّث الصفحة أو افتحها من جديد بعد لحظات."
            actions={[
              {
                label: 'إعادة المحاولة',
                onClick: handleRetry,
                primary: true,
              },
            ]}
          />
        </main>
      </body>
    </html>
  );
}

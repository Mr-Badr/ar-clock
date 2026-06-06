'use client';

import { startTransition, useEffect } from 'react';

import PageStatusState from '@/components/shared/PageStatusState';
import { logger, serializeError } from '@/lib/logger';

export default function RouteSegmentError(props) {
  const routeError = props?.error;
  const resetBoundary = props?.reset;
  const retryBoundary = props?.unstable_retry;
  const routeBoundary = props?.boundary;
  const routeEyebrow = props?.eyebrow;
  const routeTitle = props?.title;
  const routeDescription = props?.description;

  useEffect(() => {
    logger.warn('next-route-error-boundary', {
      boundary: routeBoundary,
      error: serializeError(routeError),
      handled: true,
    });
  }, [routeBoundary, routeError]);

  function handleRetry() {
    const retry = typeof retryBoundary === 'function' ? retryBoundary : resetBoundary;

    startTransition(() => {
      retry();
    });
  }

  return (
    <PageStatusState
      tone="neutral"
      statusKey="route-segment-error"
      eyebrow={routeEyebrow}
      title={routeTitle}
      description={routeDescription}
      guidanceTitle="ماذا يمكن فعله الآن؟"
      guidanceBody="جرّب إعادة المحاولة أولاً. إذا استمرت المشكلة، حدّث الصفحة أو ارجع بعد لحظات وسيكون السجل قد احتفظ بالتفاصيل اللازمة للمراجعة."
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

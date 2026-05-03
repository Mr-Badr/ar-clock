'use client';

import { useEffect } from 'react';

import { logger, serializeError } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.warn('next-global-error-boundary', {
      boundary: 'app/global-error',
      error: serializeError(error),
      handled: true,
    });
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          fontFamily: 'Noto Sans Arabic, system-ui, sans-serif',
          background:
            'radial-gradient(circle at top, rgba(14,165,233,0.14), transparent 32%), linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          color: '#0f172a',
        }}
      >
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              maxWidth: '760px',
              width: '100%',
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(226,232,240,0.95)',
              borderRadius: '32px',
              padding: '36px',
              textAlign: 'center',
              boxShadow: '0 24px 80px rgba(15,23,42,0.12)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <p
              style={{
                margin: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '999px',
                border: '1px solid #bae6fd',
                background: '#f0f9ff',
                padding: '8px 14px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0369a1',
              }}
            >
              تم إيقاف الخلل قبل أن يتمدّد
            </p>
            <h1 style={{ margin: '18px 0 0', fontSize: '32px', lineHeight: 1.3 }}>
              حدث خلل كبير، لكن التطبيق ما زال تحت السيطرة
            </h1>
            <p style={{ margin: '18px 0 0', lineHeight: 1.9, color: '#475569', fontSize: '16px' }}>
              يمكنك إعادة المحاولة الآن. وإذا استمرت المشكلة، فالتفاصيل
              الضرورية تم تسجيلها للمراجعة والتشخيص بدون إسقاط التجربة كلها.
            </p>
            <div
              style={{
                marginTop: '24px',
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                padding: '18px 20px',
                textAlign: 'right',
              }}
            >
              <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>
                خطوات مقترحة
              </p>
              <p style={{ margin: '10px 0 0', lineHeight: 1.8, color: '#475569' }}>
                أعد المحاولة أولاً. وإن عاد الخلل مرة أخرى، حدّث الصفحة أو
                افتحها من جديد بعد لحظات.
              </p>
            </div>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                marginTop: '28px',
                border: 0,
                borderRadius: '999px',
                background: '#0f172a',
                color: '#fff',
                padding: '12px 22px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}

'use client';

import { useEffect } from 'react';

import { logger, serializeError } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.warn('next-route-error-boundary', {
      boundary: 'app/error',
      error: serializeError(error),
    });
  }, [error]);

  return (
    <main className="relative isolate mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="absolute inset-0 -z-10 opacity-80"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at top, rgba(14,165,233,0.18), transparent 38%), radial-gradient(circle at 20% 80%, rgba(15,23,42,0.10), transparent 32%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
        }}
      />
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="mx-auto inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
          تم احتواء المشكلة
        </div>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          حدث خلل مفاجئ في هذا الجزء من الصفحة
        </h1>
        <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
          بقية التطبيق ما زالت تعمل بشكل طبيعي. جرّب إعادة تحميل هذا الجزء،
          وإذا استمرت المشكلة فغالباً تكون مؤقتة وسيتم التقاط تفاصيلها في السجل.
        </p>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-right">
          <p className="text-sm font-semibold text-slate-800">ما الذي يمكنك فعله الآن؟</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            أعد المحاولة أولاً. إذا ظهر الخطأ مرة أخرى، حدّث الصفحة أو انتقل
            إلى قسم آخر ثم ارجع لاحقاً.
          </p>
        </div>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          إعادة المحاولة
        </button>
      </div>
    </main>
  );
}

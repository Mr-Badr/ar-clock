import Link from 'next/link';
import type { Metadata } from 'next';
import ReloadButton from './ReloadButton';

export const metadata: Metadata = {
  title: 'غير متصل | ميقات',
  description: 'أنت غير متصل بالإنترنت حالياً',
};

export default function OfflinePage() {
  return (
    <div
      className="bg-base"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        textAlign: 'center',
      }}
      dir="rtl"
    >
      <div
        style={{
          maxWidth: '400px',
          padding: 'var(--space-8)',
          background: 'var(--bg-surface-1)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div
          style={{
            fontSize: '4rem',
            marginBottom: 'var(--space-4)',
          }}
        >
          📡
        </div>

        <h1
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-3)',
          }}
        >
          غير متصل بالإنترنت
        </h1>

        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
            marginBottom: 'var(--space-6)',
          }}
        >
          يبدو أنك غير متصل بالإنترنت حالياً. تحقق من اتصالك وحاول مرة أخرى.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          <ReloadButton />

          <Link
            href="/"
            className="btn"
            style={{
              width: '100%',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--bg-surface-3)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 'var(--font-semibold)',
              fontSize: 'var(--text-base)',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            العودة للرئيسية
          </Link>
        </div>

        <p
          style={{
            marginTop: 'var(--space-6)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
          }}
        >
          بعض المحتوى قد يكون متاحاً بدون إنترنت إذا قمت بزيارته مسبقاً
        </p>
      </div>
    </div>
  );
}

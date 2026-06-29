import Link from 'next/link';
import { ShieldCheck, UserRound, FileText, AlertCircle } from 'lucide-react';
import { getDefaultAuthor } from '@/data/site/authors';

export default function SectionTrustBar() {
  const author = getDefaultAuthor();

  return (
    <section
      aria-label="مصداقية المحتوى"
      style={{
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'color-mix(in srgb, var(--bg-surface-1) 60%, transparent)',
        padding: 'clamp(0.65rem, 1.5vw, 0.9rem) clamp(1rem, 4vw, 2.5rem)',
      }}
    >
      <ul
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.5rem 2rem',
          margin: 0,
          padding: 0,
          listStyle: 'none',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}
        role="list"
      >
        <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <UserRound size={14} aria-hidden="true" />
          <span>إعداد ومراجعة</span>
          <Link
            href={`/author/${author.id}`}
            style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            {author.name}
          </Link>
        </li>

        <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FileText size={14} aria-hidden="true" />
          <span>المحتوى مستند إلى مصادر رسمية معتمدة</span>
        </li>

        <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={14} aria-hidden="true" />
          <Link
            href="/editorial-policy"
            style={{ color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            السياسة التحريرية
          </Link>
        </li>

        <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginInlineStart: 'auto' }}>
          <AlertCircle size={14} aria-hidden="true" />
          <Link
            href="/contact"
            style={{ color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            أبلغ عن خطأ
          </Link>
        </li>
      </ul>
    </section>
  );
}

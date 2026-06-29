import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { AUTHORS, buildPersonSchema } from '@/data/site/authors';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

export async function generateStaticParams() {
  return Object.keys(AUTHORS).map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const author = AUTHORS[id];
  if (!author) return {};
  return buildCanonicalMetadata({
    title: `${author.name} — ${author.role} في ميقاتنا`,
    description: author.bio,
    url: `${SITE_URL}/author/${id}`,
  });
}

export default async function AuthorPage({ params }) {
  const { id } = await params;
  const author = AUTHORS[id];
  if (!author) notFound();

  const personSchema = buildPersonSchema(id);

  const COVER_LABELS = {
    finance: 'الحاسبات المالية',
    time: 'الوقت الان',
    prayer: 'مواقيت الصلاة',
    date: 'التاريخ والتقويم',
    holidays: 'المناسبات والأعياد',
    health: 'الحاسبات الصحية',
    calculators: 'الحاسبات العامة',
  };

  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-base text-primary">
      <JsonLd data={personSchema} />

      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">

        {/* Back link */}
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          من نحن
        </Link>

        {/* Author header */}
        <div className="flex items-start gap-5 mb-10">
          <div
            className="flex-shrink-0 w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground border border-border overflow-hidden"
            aria-hidden="true"
          >
            {/* Show initials if no photo */}
            {author.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-primary mb-1">{author.name}</h1>
            <p className="text-sm font-semibold text-accent-alt mb-1">{author.role}</p>
            <p className="text-sm text-muted-foreground">{author.credentials}</p>
          </div>
        </div>

        {/* Bio */}
        <section aria-labelledby="author-bio-heading" className="mb-10">
          <h2 id="author-bio-heading" className="text-lg font-bold mb-3">نبذة</h2>
          <p className="text-base leading-relaxed text-secondary">{author.bio}</p>
        </section>

        {/* Coverage areas */}
        {author.covers?.length ? (
          <section aria-labelledby="author-covers-heading" className="mb-10">
            <h2 id="author-covers-heading" className="text-lg font-bold mb-3">أقسام المراجعة</h2>
            <ul className="flex flex-wrap gap-2">
              {author.covers.map((area) => (
                <li
                  key={area}
                  className="px-3 py-1.5 rounded-md text-sm font-medium border border-border bg-muted text-secondary"
                >
                  {COVER_LABELS[area] || area}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Contact + sameAs */}
        <section aria-labelledby="author-contact-heading" className="mb-10">
          <h2 id="author-contact-heading" className="text-lg font-bold mb-3">التواصل</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="text-muted-foreground">البريد: </span>
              <a href={`mailto:${author.email}`} className="underline text-accent-alt hover:opacity-80">
                {author.email}
              </a>
            </li>
            {author.sameAs?.filter(Boolean).map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-accent-alt hover:opacity-80">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Editorial policy note */}
        <div className="p-4 rounded-lg border border-border bg-muted/40 text-sm text-secondary leading-relaxed">
          <strong className="text-primary">ملاحظة شفافية:</strong>{' '}
          يُراجع المؤلف المحتوى والبيانات المصدرية بشكل دوري. للاطلاع على معايير الدقة وآلية التحديث والإبلاغ عن خطأ،
          راجع{' '}
          <Link href="/editorial-policy" className="underline text-accent-alt hover:opacity-80">
            السياسة التحريرية
          </Link>.
        </div>
      </div>
    </main>
  );
}

// src/app/date/gregorian-to-hijri/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { ConverterForm } from '../converter/ConverterForm';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'تحويل ميلادي إلى هجري',
  description: 'تحويل أي تاريخ ميلادي إلى هجري بثلاث طرق حساب: أم القرى، فلكي، ومدني. أسرع وأدق محول عربي.',
  alternates: { canonical: `${BASE_URL}/date/gregorian-to-hijri` },
  openGraph: {
    title: 'تحويل ميلادي إلى هجري | مواقيت',
    description: 'تحويل من ميلادي إلى هجري بثلاث طرق حساب',
    url: `${BASE_URL}/date/gregorian-to-hijri`,
    locale: 'ar_SA',
  },
};

export default function GregorianToHijriPage() {
  return (
    <Suspense fallback={<div className="h-screen animate-pulse bg-surface-1" />}>
      <GregorianToHijriDynamicContent />
    </Suspense>
  );
}

async function GregorianToHijriDynamicContent() {
  const now = new Date(await getCachedNowIso());
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'محول التاريخ', href: '/date/converter' },
    { label: 'ميلادي إلى هجري' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'تحويل من ميلادي إلى هجري',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: `${BASE_URL}/date/gregorian-to-hijri`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <h1 className="text-3xl font-bold text-primary mb-2">
            تحويل من ميلادي إلى هجري
          </h1>
          <p className="text-sm text-muted mb-8">
            أدخل أي تاريخ ميلادي للحصول على مكافئه الهجري فوراً
          </p>

          <section className="mb-10">
            <Suspense fallback={<div className="card animate-pulse h-[420px] bg-surface-2" />}>
              <ConverterForm
                defaultDirection="gregorian-to-hijri"
                lockedDirection
                defaultYear={y}
                defaultMonth={m}
                defaultDay={d}
              />
            </Suspense>
          </section>

          <section className="bg-surface-1 border border-border rounded-[var(--radius)] p-6 md:p-8 mb-8 shadow-sm">
            <h2 className="text-lg md:text-xl font-bold text-primary mb-3">
              كيف تحوّل من ميلادي إلى هجري؟
            </h2>
            <p className="text-secondary leading-relaxed text-sm md:text-base mb-0">
              لتحويل أي تاريخ ميلادي إلى هجري: أدخل اليوم والشهر والسنة الميلادية في الحقول أعلاه، اختر طريقة الحساب المناسبة لبلدك، ثم اضغط «تحويل». ستحصل على التاريخ الهجري الموافق مع اسم اليوم والشهر الهجري.
            </p>
          </section>

          <nav className="flex gap-4 flex-wrap pb-4 border-t border-border pt-6">
            <Link href="/date/hijri-to-gregorian" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
              تحويل هجري إلى ميلادي ←
            </Link>
            <Link href="/date/today/hijri" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
              التاريخ الهجري اليوم ←
            </Link>
            <Link href="/date/converter" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
              محول التاريخ ←
            </Link>
          </nav>
        </main>
      </AdLayoutWrapper>
    </>
  );
}

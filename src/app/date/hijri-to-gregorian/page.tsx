// src/app/date/hijri-to-gregorian/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate } from '@/lib/date-adapter';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { ConverterForm } from '../converter/ConverterForm';
import { headers } from 'next/headers';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';

export const metadata: Metadata = {
  title: 'تحويل هجري إلى ميلادي',
  description: 'تحويل أي تاريخ هجري إلى ميلادي بثلاث طرق حساب: أم القرى، فلكي، ومدني. فوري ودقيق.',
  alternates: { canonical: `${BASE_URL}/date/hijri-to-gregorian` },
  openGraph: {
    title: 'تحويل هجري إلى ميلادي | مواقيت',
    description: 'من هجري إلى ميلادي بثلاث طرق حساب',
    url: `${BASE_URL}/date/hijri-to-gregorian`,
    locale: 'ar_SA',
  },
};

export default function HijriToGregorianPage() {
  return (
    <Suspense fallback={<div className="h-screen animate-pulse bg-surface-1" />}>
      <HijriToGregorianDynamicContent />
    </Suspense>
  );
}

async function HijriToGregorianDynamicContent() {
  await headers();
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  let todayHijri;
  try {
    todayHijri = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' });
  } catch { }

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'محول التاريخ', href: '/date/converter' },
    { label: 'هجري إلى ميلادي' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'تحويل من هجري إلى ميلادي',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: `${BASE_URL}/date/hijri-to-gregorian`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <h1 className="text-3xl font-bold text-primary mb-2">
            تحويل من هجري إلى ميلادي
          </h1>
          {todayHijri ? (
            <p className="text-sm text-muted mb-8">
              اليوم هجري: <span className="font-semibold text-accent-alt">{todayHijri.formatted.ar}</span> — الموافق <span dir="ltr">{isoDate}</span>م
            </p>
          ) : (
            <p className="text-sm text-muted mb-8 pb-3"></p>
          )}

          <section className="mb-10">
            <Suspense fallback={<div className="card animate-pulse h-[420px] bg-surface-2" />}>
              <ConverterForm
                defaultDirection="hijri-to-gregorian"
                lockedDirection
                defaultYear={todayHijri?.year}
                defaultMonth={todayHijri?.month}
                defaultDay={todayHijri?.day}
              />
            </Suspense>
          </section>

          <section className="bg-surface-1 border border-border rounded-[var(--radius)] p-6 md:p-8 mb-8 shadow-sm">
            <h2 className="text-lg md:text-xl font-bold text-primary mb-3">
              كيف تحوّل من هجري إلى ميلادي؟
            </h2>
            <p className="text-secondary leading-relaxed text-sm md:text-base mb-0">
              لتحويل أي تاريخ هجري إلى ميلادي: أدخل اليوم والشهر الهجري والسنة الهجرية في الحقول أعلاه، ثم اختر طريقة الحساب المناسبة لبلدك (أم القرى للخليج، فلكي لشمال أفريقيا والشام)، واضغط «تحويل».
            </p>
          </section>

          <nav className="flex gap-4 flex-wrap pb-4 border-t border-border pt-6">
            <Link href="/date/gregorian-to-hijri" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
              تحويل ميلادي إلى هجري ←
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

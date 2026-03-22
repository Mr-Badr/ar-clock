// src/app/date/calendar/[year]/page.tsx
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { YearlyCalendar } from '@/components/date/YearlyCalendar';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';

export async function generateStaticParams() {
  const currentYear = new Date().getUTCFullYear();
  const params = [];
  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    params.push({ year: String(y) });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;

  if (!year.match(/^\d{4}$/)) {
    return { title: 'تقويم غير صالح' };
  }

  return {
    title: `تقويم عام ${year} ميلادي | التقويم الميلادي والهجري`,
    description: `التقويم الميلادي لعام ${year} كاملًا متقاطعًا مع التقويم الهجري. تصفح أشهر السنة الميلادية والأيام وما يوافقها بالهجري.`,
    alternates: { canonical: `${BASE_URL}/date/calendar/${year}` },
    openGraph: {
      title: `تقويم عام ${year} ميلادي | مواقيت`,
      description: `تصفح التقويم الميلادي لعام ${year} وما يوافقه من الهجري`,
      url: `${BASE_URL}/date/calendar/${year}`,
      locale: 'ar_SA',
    },
  };
}

export default async function GregorianCalendarPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;

  if (!year.match(/^\d{4}$/)) notFound();
  const y = parseInt(year, 10);

  if (y < 1924 || y > 2077) redirect('/date/converter');

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'التقويم الميلادي' },
    { label: `عام ${year}` },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `التقويم الميلادي لعام ${year}`,
    url: `${BASE_URL}/date/calendar/${year}`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* <AdLayoutWrapper> */}
      <main className="content-col pt-24 pb-20 mt-12">
        <DateBreadcrumb items={breadcrumb} />

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-border pb-6">
          <h1 className="text-3xl font-black text-primary">
            التقويم الميلادي — عام {year}
          </h1>
          <nav className="flex items-center gap-2">
            <Link
              href={`/date/calendar/${y - 1}`}
              className="px-4 py-2 bg-surface-2 border border-border rounded-[var(--radius)] text-sm font-semibold hover:bg-surface-3 transition-colors"
            >
              ← {y - 1}
            </Link>
            <Link
              href={`/date/calendar/${y + 1}`}
              className="px-4 py-2 bg-surface-2 border border-border rounded-[var(--radius)] text-sm font-semibold hover:bg-surface-3 transition-colors"
            >
              {y + 1} →
            </Link>
          </nav>
        </div>

        <p className="text-secondary text-base mb-8 font-medium">
          هذا التقويم يعرض أشهر وأيام السنة الميلادية {year}، موضحاً تحت كل يوم ميلادي ما يوافقه بالتقويم الهجري بناءً على تقويم أم القرى.
        </p>

        <section className="mb-12">
          <Suspense fallback={<div className="text-center py-12 text-muted">جاري تحميل التقويم...</div>}>
            <YearlyCalendar year={y} />
          </Suspense>
        </section>

        <nav className="flex gap-4 flex-wrap pt-6 border-t border-border mt-4">
          <Link href="/date" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
            صفحة التاريخ الرئيسية ←
          </Link>
          <Link href="/date/converter" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
            محول التاريخ ←
          </Link>
          <Link href="/date/hijri-to-gregorian" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
            تحويل هجري إلى ميلادي ←
          </Link>
        </nav>
      </main>
      {/* </AdLayoutWrapper> */}
    </>
  );
}

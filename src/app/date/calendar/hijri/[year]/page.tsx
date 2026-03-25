import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { HijriYearlyCalendar } from '@/components/date/HijriYearlyCalendar';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { convertDate } from '@/lib/date-adapter';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';

export async function generateStaticParams() {
  const now = new Date();
  const isoNow = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;

  let currentHijriYear = 1447;
  try {
    const h = convertDate({ date: isoNow, toCalendar: 'hijri', method: 'umalqura' });
    currentHijriYear = h.year;
  } catch { }

  const params = [];
  for (let y = currentHijriYear - 5; y <= currentHijriYear + 5; y++) {
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
    title: `التقويم الهجري لعام ${year} هـ | تقويم أم القرى`,
    description: `التقويم الهجري لعام ${year} كاملًا متقاطعًا مع التقويم الميلادي. تصفح أشهر السنة الهجرية والأيام وما يوافقها بالميلادي.`,
    alternates: { canonical: `${BASE_URL}/date/calendar/hijri/${year}` },
    openGraph: {
      title: `تقويم عام ${year} هجري | مواقيت`,
      description: `تصفح التقويم الهجري لعام ${year} هـ وما يوافقه من الميلادي`,
      url: `${BASE_URL}/date/calendar/hijri/${year}`,
      locale: 'ar_SA',
    },
  };
}

export default async function HijriCalendarPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;

  if (!year.match(/^\d{4}$/)) notFound();
  const y = parseInt(year, 10);

  if (y < 1343 || y > 1500) redirect('/date/converter');

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'التقويم الهجري', href: '/date/today/hijri' },
    { label: `عام ${year} هـ` },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `التقويم الهجري لعام ${year}`,
    url: `${BASE_URL}/date/calendar/hijri/${year}`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <div className="flex flex-col md:flex-row justify-between items-center w-full mb-8 gap-4 border-b border-border pb-6">

            <nav className="flex items-center justify-between mx-auto w-full">
              {/* Previous year link on the left */}
              <Link
                href={`/date/calendar/hijri/${y - 1}`}
                className="px-4 py-2 bg-surface-2 border border-border rounded-[var(--radius)] text-sm font-semibold hover:bg-surface-3 transition-colors text-primary"
              >
                → {y - 1} هـ
              </Link>

              {/* Heading in the center */}
              <h1 className="text-3xl font-black text-accent-alt text-center flex-1">
                التقويم الهجري — عام {year}
              </h1>

              {/* Next year link on the right */}
              <Link
                href={`/date/calendar/hijri/${y + 1}`}
                className="px-4 py-2 bg-surface-2 border border-border rounded-[var(--radius)] text-sm font-semibold hover:bg-surface-3 transition-colors text-primary"
              >
                {y + 1} هـ ←
              </Link>
            </nav>
          </div>

          <p className="text-secondary text-base mb-8 font-medium">
            هذا التقويم يعرض أشهر وأيام السنة الهجرية {year}، موضحاً تحت كل يوم هجري ما يوافقه بالتقويم الميلادي بناءً على تقويم أم القرى (المعتمد في المملكة العربية السعودية ودول الخليج).
          </p>

          <section className="mb-12">
            <HijriYearlyCalendar year={y} />
          </section>

          <nav className="flex gap-4 flex-wrap pt-6 border-t border-border mt-4">
            <Link href="/date" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
              صفحة التاريخ الرئيسية ←
            </Link>
            <Link href="/date/converter" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
              محول التاريخ ←
            </Link>
            <Link href="/date/gregorian-to-hijri" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
              تحويل ميلادي إلى هجري ←
            </Link>
          </nav>
        </main>
      </AdLayoutWrapper>
    </>
  );
}

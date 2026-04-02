// src/app/date/country/[countrySlug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

import { getAllCountrySlugs, getCountryBySlug } from '@/lib/db/queries/countries';
import { getCapitalCity } from '@/lib/db/queries/cities';
import { getCachedNowIso } from '@/lib/date-utils';
import { convertDate, GREGORIAN_MONTH_NAMES_AR } from '@/lib/date-adapter';
import { getFlagEmoji, getSafeTimezone } from '@/lib/country-utils';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { DateShareActions } from '@/components/date/DateShareActions';
import { headers } from 'next/headers';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { Calendar, Clock, ArrowLeftRight } from "lucide-react"
import { getSiteUrl } from '@/lib/site-config';

const BASE_URL = getSiteUrl();

const COUNTRY_HIJRI_METHODS: Record<string, 'umalqura' | 'astronomical' | 'civil'> = {
  'SA': 'umalqura',      // Saudi Arabia
  'AE': 'umalqura',      // UAE
  'KW': 'umalqura',      // Kuwait
  'QA': 'umalqura',      // Qatar
  'BH': 'umalqura',      // Bahrain
  'OM': 'umalqura',      // Oman
  'MA': 'astronomical',  // Morocco
  'EG': 'astronomical',  // Egypt
  'JO': 'astronomical',  // Jordan
  'DZ': 'astronomical',  // Algeria
  'TN': 'astronomical',  // Tunisia
  'IQ': 'astronomical',  // Iraq
  'LB': 'astronomical',  // Lebanon
  'SY': 'astronomical',  // Syria
};

interface RelatedLinksProps {
  countrySlug: string
  countryNameAr: string
}
 
const links = (countrySlug: string, countryNameAr: string) => [
  {
    href: "/date",
    label: "صفحة التاريخ الرئيسية",
    description: "عرض التاريخ الهجري والميلادي",
    icon: Calendar,
  },
  {
    href: `/time-now/${countrySlug}`,
    label: `الوقت الآن في ${countryNameAr}`,
    description: "الساعة الحالية وفق التوقيت المحلي",
    icon: Clock,
  },
  {
    href: "/date/converter",
    label: "تحويل تاريخ آخر",
    description: "أداة تحويل التواريخ الهجرية والميلادية",
    icon: ArrowLeftRight,
  },
]

export async function generateStaticParams() {
  const slugs = await getAllCountrySlugs();
  return slugs.map(slug => ({ countrySlug: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countrySlug: string }>;
}): Promise<Metadata> {
  const { countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  if (!country) return { title: 'التاريخ الهجري' };

  const countryAr = country.name_ar;
  return {
    title: `التاريخ الهجري اليوم في ${countryAr} | مواقيت`,
    description: `تعرف على التاريخ الهجري والميلادي اليوم في ${countryAr} حسب التقويم المعتمد.`,
    alternates: { canonical: `${BASE_URL}/date/country/${countrySlug}` },
    openGraph: {
      title: `التاريخ الهجري والميلادي اليوم في ${countryAr}`,
      description: `التاريخ اليوم في ${countryAr} مع التقويم الهجري والميلادي.`,
      url: `${BASE_URL}/date/country/${countrySlug}`,
      locale: 'ar_SA',
    },
  };
}

export default function CountryDatePage({
  params,
}: {
  params: Promise<{ countrySlug: string }>;
}) {
  return (
    <Suspense fallback={<div className="h-screen animate-pulse bg-surface-1" />}>
      <CountryDateDynamicContent params={params} />
    </Suspense>
  );
}

async function CountryDateDynamicContent({
  params,
}: {
  params: Promise<{ countrySlug: string }>;
}) {
  await headers();
  const { countrySlug } = await params;
  let countryRaw;
  try {
    countryRaw = await getCountryBySlug(countrySlug);
  } catch {
    notFound();
  }
  if (!countryRaw) notFound();
  const country = countryRaw as NonNullable<typeof countryRaw>;

  const capital = await getCapitalCity(country.country_code);
  const _tzRaw = capital?.timezone ?? (country.timezone ? getSafeTimezone(country.timezone) : undefined);
  const timezone = _tzRaw ?? 'UTC';

  // Get current local date in that country's timezone
  const nowIso = await getCachedNowIso();
  let localDateIso = nowIso.split('T')[0];
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' });
    const parts = formatter.formatToParts(new Date(nowIso));
    const y = parts.find(p => p.type === 'year')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const d = parts.find(p => p.type === 'day')?.value;
    if (y && m && d) localDateIso = `${y}-${m}-${d}`;
  } catch { }

  const method = COUNTRY_HIJRI_METHODS[country.country_code] || 'umalqura';
  const methodNameAr = method === 'umalqura' ? 'تقويم أم القرى' : method === 'astronomical' ? 'الحساب الفلكي' : 'التقويم المدني';

  let hijri;
  try {
    hijri = convertDate({ date: localDateIso, toCalendar: 'hijri', method });
  } catch {
    notFound();
  }

  // Build Gregorian info manually from localDateIso to avoid convertDate range errors
  const [gy, gm, gd] = localDateIso.split('-').map(Number);
  const gregorian = {
    day: gd,
    month: gm,
    year: gy,
    monthNameAr: GREGORIAN_MONTH_NAMES_AR[gm - 1],
    formatted: {
      ar: `${gd} ${GREGORIAN_MONTH_NAMES_AR[gm - 1]} ${gy}`,
      iso: localDateIso
    }
  };

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: `التاريخ في ${country.name_ar}` },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `التاريخ في ${country.name_ar}`,
    url: `${BASE_URL}/date/country/${countrySlug}`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `كم التاريخ الهجري اليوم في ${country.name_ar}؟`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `التاريخ الهجري اليوم في ${country.name_ar} هو ${hijri.formatted.ar} بناءً على ${methodNameAr}.`,
          },
        },
        {
          '@type': 'Question',
          name: `كم التاريخ الميلادي اليوم في ${country.name_ar}؟`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `التاريخ الميلادي اليوم في ${country.name_ar} هو ${gregorian.formatted.ar}.`,
          },
        },
      ],
    },
  };

  const flag = getFlagEmoji(country.country_code);

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          {/* COUNTRY HEADER */}
          <div className="flex flex-col items-center justify-center text-center mb-8 border-b border-border pb-8">
            <div className="text-5xl mb-4">{flag}</div>
            <h1 className="text-3xl md:text-4xl font-black text-primary mb-3">
              التاريخ اليوم في <span className="text-accent">{country.name_ar}</span>
            </h1>
            <p className="text-secondary font-medium">
              تحديث مباشر للتاريخ الهجري والميلادي حسب التوقيت المحلي ({timezone})
            </p>
          </div>

          {/* MAIN DISPLAY */}
          <section className="bg-surface-1 border border-border rounded-[var(--radius)] overflow-hidden shadow-sm mb-8">
            <div className="bg-accent-gradient px-6 py-3 flex justify-between items-center text-white/90">
              <span className="text-sm font-semibold">{hijri.dayNameAr}</span>
              <span className="text-sm font-semibold">{localDateIso}</span>
            </div>
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-right border-b md:border-b-0 md:border-l border-border pb-6 md:pb-0 md:pl-6">
                <div className="text-sm font-bold text-accent-alt mb-2 flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-alt"></span>
                  التاريخ الهجري
                </div>
                <div className="text-3xl lg:text-4xl font-black text-primary mb-2 leading-tight">
                  {hijri.formatted.ar}
                </div>
                <div className="text-sm text-muted font-medium bg-surface-2 inline-block px-3 py-1 rounded-md">
                  يعتمد على: {methodNameAr}
                </div>
              </div>

              <div className="flex-1 text-center md:text-right">
                <div className="text-sm font-bold text-success mb-2 flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  التاريخ الميلادي
                </div>
                <div className="text-3xl lg:text-4xl font-black text-primary mb-2 leading-tight">
                  {gregorian.formatted.ar}م
                </div>
                <div className="text-sm text-muted font-medium bg-surface-2 inline-block px-3 py-1 rounded-md">
                  السنة الميلادية
                </div>
              </div>
            </div>
          </section>

          {/* NOTE CARD */}
          <section className="bg-surface-2 border border-border rounded-[var(--radius)] p-5 mb-8 flex gap-4 items-start shadow-sm">
            <div className="text-2xl mt-0.5">💡</div>
            <div>
              <h3 className="text-base font-bold text-primary mb-1.5">معلومة تهمك</h3>
              <p className="text-sm text-secondary leading-relaxed">
                وفقاً لقاعدة البيانات، فإن التوقيت في {country.name_ar} حالياً يتوافق مع يوم {hijri.dayNameAr}.
                يتم عرض التاريخ الهجري باستخدام {methodNameAr} وهو التقويم الأقرب للرسمي المعتمد في هذه الدولة.
                قد تختلف رؤية الهلال في بعض الدول المجاورة.
              </p>
            </div>
          </section>

          {/* ACTIONS */}
          <section className="mb-8">
            <DateShareActions
              hijriFormatted={hijri.formatted.ar}
              gregorianFormatted={`${gregorian.day} ${gregorian.monthNameAr} ${gregorian.year}`}
              hijriIso={hijri.formatted.iso}
              gregorianIso={gregorian.formatted.iso}
              pageUrl={`${BASE_URL}/date/country/${countrySlug}`}
            />
          </section>

          {/* LINKS */}
          <nav
            aria-label="روابط ذات صلة"
            className="related-links"
            dir="rtl"
          >
            <p className="related-links__heading">
              صفحات ذات صلة
            </p>
      
            <div className="related-links__grid">
              {links(countrySlug, country.name_ar).map(({ href, label, description, icon: Icon }) => (
                <Link key={href} href={href} className="related-link-card">
                  {/* Icon container */}
                  <span className="related-link-card__icon" aria-hidden="true">
                    <Icon size={16} strokeWidth={1.75} />
                  </span>
      
                  {/* Text */}
                  <span className="related-link-card__body">
                    <span className="related-link-card__label">{label}</span>
                    <span className="related-link-card__desc">{description}</span>
                  </span>
      
                  {/* Arrow — flips to → in RTL */}
                  <span className="related-link-card__arrow" aria-hidden="true">←</span>
                </Link>
              ))}
            </div>
          </nav>

        </main>
      </AdLayoutWrapper>
    </>
  );
}

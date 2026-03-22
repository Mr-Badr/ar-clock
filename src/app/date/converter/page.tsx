// src/app/date/converter/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate } from '@/lib/date-adapter';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { ConverterForm } from './ConverterForm';
import { headers } from 'next/headers';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';

export const metadata: Metadata = {
  title: 'محول التاريخ — هجري وميلادي',
  description: 'تحويل فوري بين التاريخ الهجري والميلادي بثلاث طرق حساب: أم القرى، فلكي، ومدني. أدق محول تاريخ عربي.',
  alternates: { canonical: `${BASE_URL}/date/converter` },
  openGraph: {
    title: 'محول التاريخ الهجري والميلادي | مواقيت',
    description: 'تحويل فوري وبثلاث طرق حساب',
    url: `${BASE_URL}/date/converter`,
    locale: 'ar_SA',
  },
};

export default function ConverterPage() {
  return (
    <Suspense fallback={<div className="h-screen animate-pulse bg-surface-1" />}>
      <ConverterDynamicContent />
    </Suspense>
  );
}

async function ConverterDynamicContent() {
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
    { label: 'محول التاريخ' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'محول التاريخ الهجري والميلادي',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'تحويل فوري بين التاريخ الهجري والميلادي بثلاث طرق حساب',
    url: `${BASE_URL}/date/converter`,
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'كيف أحول تاريخ ميلادي إلى هجري؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'استخدم محول التاريخ: أدخل التاريخ الميلادي، اختر الاتجاه «ميلادي إلى هجري»، واضغط تحويل للحصول على التاريخ الهجري فوراً.',
          },
        },
        {
          '@type': 'Question',
          name: 'ما الفرق بين تقويم أم القرى والحساب الفلكي؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'أم القرى هو التقويم الرسمي للسعودية وتعتمد عليه دول الخليج. الحساب الفلكي تتبعه مصر والمغرب والأردن. قد يختلفان بيوم واحد.',
          },
        },
      ],
    },
    howTo: {
      '@type': 'HowTo',
      name: 'كيفية تحويل التاريخ الهجري إلى ميلادي',
      step: [
        { '@type': 'HowToStep', text: 'أدخل التاريخ الهجري (يوم، شهر، سنة).' },
        { '@type': 'HowToStep', text: 'اختر اتجاه التحويل: هجري إلى ميلادي.' },
        { '@type': 'HowToStep', text: 'اختر طريقة الحساب المناسبة لبلدك.' },
        { '@type': 'HowToStep', text: 'انقر «تحويل» لعرض النتيجة فوراً.' },
      ],
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <h1 className="text-3xl font-bold text-primary mb-2 leading-tight">
            محول التاريخ الهجري والميلادي
          </h1>
          {todayHijri && (
            <p className="text-sm text-muted mb-8">
              اليوم: <span className="font-semibold text-accent-alt">{todayHijri.formatted.ar} هـ</span>
            </p>
          )}

          {/* CONVERTER FORM */}
          <section className="mb-10">
            <Suspense fallback={<div className="card animate-pulse h-[420px] bg-surface-2" />}>
              <ConverterForm defaultYear={y} defaultMonth={m} defaultDay={d} />
            </Suspense>
          </section>

          {/* METHOD EXPLANATION CARDS */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-primary mb-4 leading-snug">
              طرق الحساب المتاحة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'أم القرى',
                  subtitle: 'Umm al-Qura',
                  desc: 'التقويم الرسمي للمملكة العربية السعودية. يُستخدم في السعودية، الإمارات، الكويت، قطر، البحرين، وعُمان.',
                  badge: 'الخليج',
                  color: 'text-accent-alt',
                  bg: 'bg-accent-soft',
                },
                {
                  title: 'فلكي',
                  subtitle: 'Astronomical',
                  desc: 'يعتمد على الرصد الفلكي لبداية الهلال. تتبعه المغرب، مصر، الأردن، العراق، لبنان، سوريا، الجزائر، وتونس.',
                  badge: 'شمال أفريقيا والشام',
                  color: 'text-info flex-shrink-0',
                  bg: 'bg-info-soft',
                },
                {
                  title: 'مدني / حسابي',
                  subtitle: 'Civil / Tabular',
                  desc: 'حساب رياضي منتظم للتقويم الهجري دون اعتبار الهلال. يُستخدم في بعض الحسابات الأكاديمية والإدارية.',
                  badge: 'أكاديمي',
                  color: 'text-success flex-shrink-0',
                  bg: 'bg-success-soft',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-surface-1 border border-border rounded-[var(--radius)] p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3 gap-2 border-b border-border/50 pb-3">
                    <div>
                      <div className="font-bold text-primary text-lg leading-tight">{card.title}</div>
                      <div className="text-xs text-muted font-semibold pr-1">{card.subtitle}</div>
                    </div>
                    <span className={`${card.bg} ${card.color} px-2.5 py-1 rounded-full text-[0.7rem] font-semibold whitespace-nowrap`}>
                      {card.badge}
                    </span>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed m-0">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SEO CONTENT */}
          <section className="bg-surface-1 border border-border rounded-[var(--radius)] p-6 md:p-8 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold text-primary mb-4 leading-snug">
              كيف يعمل محول التاريخ؟
            </h2>
            <p className="text-secondary leading-[1.7] mb-4 text-sm md:text-base">
              يستخدم هذا المحول أحدث خوارزميات تحويل التقويم المُعتمدة رياضياً وفلكياً. عند إدخال أي تاريخ ميلادي، يتم تحويله فورياً إلى التقويم الهجري باستخدام الطريقة التي اخترتها. النتيجة دقيقة وفورية ولا تتطلب الاتصال بالإنترنت بعد تحميل الصفحة.
            </p>
            <p className="text-secondary leading-[1.7] mb-0 text-sm md:text-base font-medium">
              النطاق الزمني المدعوم: من عام 1924م (1343هـ) حتى عام 2077م (1500هـ تقريباً). التواريخ خارج هذا النطاق قد لا تكون متاحة في قاعدة بيانات التقويم.
            </p>
          </section>

          {/* NAVIGATION */}
          <nav className="flex gap-4 flex-wrap pb-4 border-t border-border pt-6">
            <Link href="/date/hijri-to-gregorian" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
              تحويل هجري إلى ميلادي مباشرةً ←
            </Link>
            <Link href="/date/gregorian-to-hijri" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
              تحويل ميلادي إلى هجري مباشرةً ←
            </Link>
            <Link href="/date/today/hijri" className="text-accent text-sm font-semibold hover:text-accent-alt transition-colors">
              التاريخ الهجري اليوم ←
            </Link>
          </nav>
        </main>
      </AdLayoutWrapper>
    </>
  );
}

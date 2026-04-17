// src/app/date/page.tsx — DATE HUB (complete new page)
// ─────────────────────────────────────────────────────────────────────────────
// This page did not exist before (was empty or minimal).
//
// STRUCTURE:
//   1. Hero — today's date in both calendars (immediate value)
//   2. Tools grid — 8 quick-access cards linking to all sub-routes
//   3. Popular dates — chips for common searches
//   4. SEO editorial — 4 topic cards explaining all features
//   5. FAQ JSON-LD — targets People Also Ask positions
//
// KEYWORDS:
//   تاريخ اليوم · التاريخ الهجري اليوم · تحويل التاريخ · التقويم الهجري
//   كم التاريخ اليوم · الهجري والميلادي · تاريخ اليوم بالهجري · التقويم الهجري
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate, type ConvertDateResult } from '@/lib/date-adapter';
import { getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import DateRouteLoading from '@/components/date/DateRouteLoading';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { ArrowLeftRight, Moon, CalendarDays, Calendar } from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'كم التاريخ اليوم؟ | بالهجري والميلادي وتحويل التاريخ',
  description:
    'اعرف فوراً تاريخ اليوم بالهجري والميلادي، وحوّل التواريخ بين التقويمين، وتصفح التقويم الكامل وصفحات اليوم والدول من مركز تاريخ عربي سريع وواضح.',
  keywords: buildDateKeywords(),
  alternates: { canonical: `${BASE_URL}/date` },
  openGraph: {
    title: 'كم التاريخ اليوم؟',
    description: 'تاريخ اليوم، محول التاريخ، والتقويم الهجري والميلادي في صفحة عربية واحدة.',
    url: `${BASE_URL}/date`,
    locale: 'ar_SA',
  },
};

const GREGORIAN_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const HUB_FAQ_ITEMS = [
  {
    question: 'كم تاريخ اليوم بالهجري؟',
    answer: 'تاريخ اليوم بالهجري يظهر هنا وفق تقويم أم القرى مع تحديث مستمر. ويمكنك من الصفحة نفسها الانتقال إلى التفاصيل اليومية أو مقارنة النتائج مع طرق الحساب الأخرى.',
  },
  {
    question: 'كيف أحول تاريخاً من ميلادي إلى هجري؟',
    answer: 'يمكنك تحويل أي تاريخ من ميلادي إلى هجري عبر أداة محول التاريخ في هذا القسم. اختر نوع التحويل وأدخل التاريخ المطلوب ثم ستظهر لك النتيجة مباشرة مع أكثر من طريقة حساب.',
  },
  {
    question: 'ما الفرق بين تقويم أم القرى والحساب الفلكي؟',
    answer: 'تقويم أم القرى هو المرجع الرسمي الشائع في السعودية ودول الخليج، بينما يعتمد الحساب الفلكي في دول وجهات أخرى. قد يؤدي اختلاف المنهج إلى فرق بيوم واحد في بعض التواريخ الهجرية.',
  },
  {
    question: 'هل يختلف التاريخ الهجري بين الدول العربية؟',
    answer: 'نعم، قد يختلف التاريخ الهجري بين الدول العربية بحسب الجهة الرسمية وطريقة الإثبات المعتمدة. لهذا نوفر صفحات للتحويل والتقويم حتى تتمكن من المقارنة والوصول إلى التاريخ المناسب لبلدك.',
  },
];

export default function DateHubPage() {
  return (
    <Suspense
      fallback={(
        <DateRouteLoading
          kind="hub"
          title="جاري تحميل مركز التاريخ"
          description="نجهز لك تاريخ اليوم وأدوات التحويل وروابط التقاويم الآن."
        />
      )}
    >
      <DateHubDynamicContent />
    </Suspense>
  );
}

async function DateHubDynamicContent() {
  const now = new Date(await getCachedNowIso());
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const dayOfWeek = DAY_NAMES[now.getUTCDay()];
  const monthAr = GREGORIAN_MONTHS[m - 1];

  let hijri: ConvertDateResult | undefined;
  try { hijri = convertDate({ date: iso, toCalendar: 'hijri', method: 'umalqura' }); } catch { /**/ }

  const events = hijri ? getIslamicEventsForHijriDate(hijri.year, hijri.month, hijri.day) : [];

  const breadcrumb = [{ label: 'الرئيسية', href: '/' }, { label: 'التاريخ' }];
  const toolLinks = [
    { href: '/date/converter', label: 'محول التاريخ', description: 'تحويل بين الهجري والميلادي بثلاث طرق حساب.' },
    { href: '/date/today/hijri', label: 'التاريخ الهجري اليوم', description: 'اعرف التاريخ الهجري اليوم ومقارنة طرق الحساب.' },
    { href: '/date/today/gregorian', label: 'التاريخ الميلادي اليوم', description: 'استعرض التاريخ الميلادي اليوم واليوم من السنة.' },
    { href: '/date/gregorian-to-hijri', label: 'ميلادي إلى هجري', description: 'تحويل مباشر من التاريخ الميلادي إلى التاريخ الهجري.' },
    { href: '/date/hijri-to-gregorian', label: 'هجري إلى ميلادي', description: 'تحويل مباشر من التاريخ الهجري إلى التاريخ الميلادي.' },
    { href: `/date/calendar/${y}`, label: `تقويم ${y}`, description: `التقويم الميلادي الكامل لعام ${y} مع المقابل الهجري.` },
    { href: `/date/calendar/hijri/${hijri?.year ?? 1447}`, label: `تقويم ${hijri?.year ?? 1447} هـ`, description: 'التقويم الهجري الكامل مع الأيام والمناسبات.' },
    { href: '/date/country', label: 'التاريخ حسب الدولة', description: 'اعرف التاريخ اليوم في الدول العربية وفق الطريقة الأقرب للاستخدام الرسمي.' },
  ];
  const dateUtilityLinks = [
    {
      href: '/time-now',
      label: 'الوقت الآن',
      description: 'اعرف الساعة الحالية في المدن والدول المرتبطة بتاريخ اليوم.',
    },
    {
      href: '/mwaqit-al-salat',
      label: 'مواقيت الصلاة اليوم',
      description: 'انتقل إلى مواقيت الصلاة الدقيقة من نفس بنية الوقت والتاريخ.',
    },
    {
      href: '/time-difference',
      label: 'حاسبة فرق التوقيت',
      description: 'قارن الوقت بين الدول والمدن عند التخطيط للتواريخ والسفر والعمل.',
    },
    {
      href: '/holidays',
      label: 'المناسبات القادمة',
      description: 'استكشف المناسبات والإجازات القادمة المرتبطة بالتاريخ الهجري والميلادي.',
    },
  ];

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'مركز التاريخ الهجري والميلادي',
    description: 'تاريخ اليوم الهجري والميلادي مع أدوات تحويل شاملة',
    url: `${BASE_URL}/date`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'أدوات التاريخ الهجري والميلادي',
    url: `${BASE_URL}/date`,
    description: 'مجموعة أدوات وصفحات التاريخ في ميقاتنا: تاريخ اليوم، محول التاريخ، التقاويم، والتاريخ حسب الدولة.',
    inLanguage: 'ar',
  };
  const toolsItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'أدوات التاريخ الأساسية',
    itemListElement: toolLinks.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.label,
      url: `${BASE_URL}${tool.href}`,
    })),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HUB_FAQ_ITEMS.map((item, index) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: index === 0 && hijri
          ? `تاريخ اليوم بالهجري هو ${hijri.formatted.ar} وفق تقويم أم القرى.`
          : item.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={collectionSchema} />
      <JsonLd data={toolsItemListSchema} />
      <JsonLd data={faqSchema} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          {/* ── HERO: Today's date ──────────────────────────────────────── */}
          <section
            className="rounded-2xl overflow-hidden mb-8 shadow-sm"
            style={{ border: '1px solid var(--border-subtle)' }}
            aria-label="تاريخ اليوم"
          >
            {/* Header strip */}
            <div
              className="flex items-center justify-between flex-wrap px-6 py-3"
              style={{ background: 'var(--accent-gradient)', gap: '8px' }}
            >
              <h1 className="text-base font-bold m-0" style={{ color: '#fff' }}>
                تاريخ اليوم — {dayOfWeek}
              </h1>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {d} {monthAr} {y}م
              </span>
            </div>

            {/* Dual display */}
            <div
              className="grid grid-cols-1 md:grid-cols-2"
            >
              {/* Hijri */}
              <div
                className="px-6 py-8 text-center"
                style={{ borderBottom: '1px solid var(--border-subtle)', borderLeft: 'none' }}
              >
                <div className="text-xs font-semibold text-muted mb-3 flex items-center justify-center gap-1.5">
                  🌙 التاريخ الهجري (أم القرى)
                </div>
                {hijri ? (
                  <>
                    <div
                      className="font-black leading-none tabular-nums mb-1"
                      style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', color: 'var(--accent-alt)' }}
                    >
                      {hijri.day}
                    </div>
                    <div className="text-2xl font-bold text-primary mb-0.5">{hijri.monthNameAr}</div>
                    <div className="text-xl font-semibold text-secondary mb-4">{hijri.year} هـ</div>
                    {events.length > 0 && (
                      <span className="badge badge-success text-sm px-4 py-2">
                        ⭐ {events.map(e => e.nameAr).join(' • ')}
                      </span>
                    )}
                  </>
                ) : <div className="text-muted">—</div>}
                <Link
                  href="/date/today/hijri"
                  className="block mt-4 text-xs font-semibold text-accent-alt hover:text-accent transition-colors"
                >
                  تفاصيل التاريخ الهجري ←
                </Link>
              </div>

              {/* Gregorian */}
              <div
                className="px-6 py-8 text-center"
                style={{ background: 'var(--bg-surface-2)' }}
              >
                <div className="text-xs font-semibold text-muted mb-3 flex items-center justify-center gap-1.5">
                  🗓️ التاريخ الميلادي
                </div>
                <div
                  className="font-black leading-none tabular-nums mb-1"
                  style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', color: 'var(--text-primary)' }}
                >
                  {d}
                </div>
                <div className="text-2xl font-bold text-primary mb-0.5">{monthAr}</div>
                <div className="text-xl font-semibold text-secondary mb-4">{y}م</div>
                <Link
                  href={`/date/${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`}
                  className="block text-xs font-semibold text-accent-alt hover:text-accent transition-colors"
                >
                  صفحة {d} {monthAr} {y} ←
                </Link>
              </div>
            </div>
          </section>

          {/* ── TOOLS GRID ──────────────────────────────────────────────── */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-primary mb-5">أدوات التاريخ</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ gap: '12px' }}>
              {[
                { href: '/date/converter', icon: '🔄', title: 'محول التاريخ', sub: 'هجري ↔ ميلادي', primary: true },
                { href: '/date/today/hijri', icon: '🌙', title: 'التاريخ الهجري اليوم', sub: 'بثلاث طرق حساب' },
                { href: '/date/today/gregorian', icon: '🗓️', title: 'التاريخ الميلادي اليوم', sub: 'تفاصيل السنة' },
                { href: '/date/gregorian-to-hijri', icon: '📅', title: 'ميلادي → هجري', sub: 'تحويل مباشر' },
                { href: '/date/hijri-to-gregorian', icon: '📿', title: 'هجري → ميلادي', sub: 'تحويل مباشر' },
                { href: `/date/calendar/${y}`, icon: '📆', title: `تقويم ${y}`, sub: 'ميلادي + هجري' },
                { href: `/date/calendar/hijri/${hijri?.year ?? 1447}`, icon: '🗓', title: `تقويم ${hijri?.year ?? 1447} هـ`, sub: 'هجري كامل' },
                { href: '/date/country', icon: '🌍', title: 'التاريخ حسب الدولة', sub: '22+ دولة عربية' },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="card card-hover"
                  style={{
                    ...(tool.primary ? { borderColor: 'var(--border-accent-strong)', background: 'var(--accent-soft)' } : {}),
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <span className="text-2xl leading-none" aria-hidden="true">{tool.icon}</span>
                  <span
                    className="text-sm font-bold leading-tight"
                    style={{ color: tool.primary ? 'var(--accent-alt)' : 'var(--text-primary)' }}
                  >
                    {tool.title}
                  </span>
                  <span className="text-xs text-muted">{tool.sub}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── POPULAR QUICK LINKS ────────────────────────────────────── */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-primary mb-4">تواريخ شائعة</h2>
            <div className="flex flex-wrap" style={{ gap: '8px' }}>
              {[
                { label: 'اليوم', href: '/date/today' },
                { label: `${d} ${monthAr} ${y}م`, href: `/date/${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}` },
                ...(hijri ? [
                  { label: `${hijri.day} ${hijri.monthNameAr} ${hijri.year} هـ`, href: `/date/hijri/${hijri.year}/${String(hijri.month).padStart(2, '0')}/${String(hijri.day).padStart(2, '0')}` },
                  { label: `1 رمضان ${hijri.year}`, href: `/date/hijri/${hijri.year}/09/01` },
                  { label: `1 محرم ${hijri.year + 1}`, href: `/date/hijri/${hijri.year + 1}/01/01` },
                  { label: `تقويم ${hijri.year} هـ`, href: `/date/calendar/hijri/${hijri.year}` },
                ] : []),
                { label: `تقويم ${y}م`, href: `/date/calendar/${y}` },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="chip"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>

          {/* ── SEO EDITORIAL ──────────────────────────────────────────── */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-5">كل ما تحتاجه عن التاريخ الهجري والميلادي</h2>
            <div className="grid md:grid-cols-2" style={{ gap: '16px' }}>
              {[
                {
                  icon: '🌙',
                  title: 'التاريخ الهجري اليوم',
                  body: 'التقويم الهجري تقويم قمري يعتمد على دورة القمر. يتحرك 11 يوماً مبكراً كل عام ميلادي، لذا تمرّ المناسبات الإسلامية كرمضان والأعياد على جميع الفصول خلال 33 عاماً.',
                },
                {
                  icon: '🔄',
                  title: 'طرق تحويل التاريخ الثلاثة',
                  body: 'نوفر ثلاث طرق حساب: أم القرى (رسمي للخليج)، الفلكي (مصر والمغرب والشام)، والمدني (للأغراض الأكاديمية). قد يختلف التاريخ بيوم واحد بين الطرق.',
                },
                {
                  icon: '📆',
                  title: 'التقويمان الكاملان',
                  body: 'يوفر الموقع تقاويم سنوية كاملة بالتقويمين الهجري والميلادي. كل يوم يعرض مكافئه الهجري مع إبراز المناسبات الإسلامية الكبرى.',
                },
                {
                  icon: '🌍',
                  title: 'التاريخ حسب الدولة',
                  body: 'يختلف التاريخ الهجري المعتمد رسمياً من دولة لأخرى. دول الخليج تتبع أم القرى، بينما تتبع مصر والمغرب والأردن الحساب الفلكي.',
                },
              ].map((card) => (
                <article key={card.title} className="card">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl leading-none" aria-hidden="true">{card.icon}</span>
                    <h3 className="card__title text-base">{card.title}</h3>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed m-0">{card.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-5">أسئلة شائعة حول التاريخ الهجري والميلادي</h2>
            <div className="grid md:grid-cols-2" style={{ gap: '16px' }}>
              {HUB_FAQ_ITEMS.map((item) => (
                <article key={item.question} className="card">
                  <h3 className="card__title text-base mb-3">{item.question}</h3>
                  <p className="text-sm text-secondary leading-relaxed m-0">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── FOOTER NAV ──────────────────────────────────────────────── */}
          <nav aria-label="روابط ذات صلة" className="related-links" dir="rtl">
            <p className="related-links__heading">صفحات ذات صلة</p>
            <div className="related-links__grid">

              <Link href="/date/converter" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <ArrowLeftRight size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">محول التاريخ</span>
                  <span className="related-link-card__desc">تحويل بين الهجري والميلادي بثلاث طرق</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/today/hijri" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Moon size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ الهجري اليوم</span>
                  <span className="related-link-card__desc">اعرف تاريخ اليوم بالتقويم الهجري</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/today/gregorian" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ الميلادي اليوم</span>
                  <span className="related-link-card__desc">تفاصيل اليوم بالتقويم الميلادي</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href={`/date/calendar/${y}`} className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التقويم الميلادي</span>
                  <span className="related-link-card__desc">تقويم عام {y} ميلادي كامل</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

            </div>
          </nav>

          <section className="mt-12">
            <GeoInternalLinks
              title="روابط أساسية مرتبطة بقسم التاريخ"
              description="هذه الروابط تربط قسم التاريخ بأقسام الوقت الحالي والصلاة وفرق التوقيت والمناسبات، حتى تبقى الصفحات المرجعية الأساسية قريبة من بعضها في الهيكل الداخلي للموقع."
              links={dateUtilityLinks}
              ariaLabel="روابط أساسية مرتبطة بقسم التاريخ"
            />
          </section>
        </main>
      </AdLayoutWrapper>
    </>
  );
}

// app/mwaqit-al-salat/page.jsx
import Link from 'next/link';
import { Suspense } from 'react';
import SearchCityWrapper from '@/components/SearchCityWrapper.client';
import FAQAccordions from '@/components/mwaqit/FAQAccordions.client';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';
import { Clock } from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  getPopularPrayerCityLinks,
  getPopularPrayerCountryLinks,
} from '@/lib/seo/popular-links';
import { buildPrayerKeywords } from '@/lib/seo/section-search-intent';

const BASE = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'مواقيت الصلاة اليوم في مدينتك | الفجر والمغرب والعشاء بدقة',
  description:
    'اعرف مواقيت الصلاة اليوم بدقة في مدينتك: الفجر والشروق والظهر والعصر والمغرب والعشاء، مع إمساكية شهرية وطريقة الحساب المناسبة لكل بلد وروابط المدن الأكثر بحثاً.',
  keywords: buildPrayerKeywords(),
  url: `${BASE}/mwaqit-al-salat`,
});

// ─── 12 Calculation Methods data ──────────────────────────────────────────────
const METHODS_TABLE = [
  { method: 'أم القرى',                      code: 'UmmAlQura',            region: 'المملكة العربية السعودية',                 fajr: '18.5°', isha: '90 دق' },
  { method: 'الهيئة المصرية',                code: 'Egyptian',             region: 'مصر، المغرب، الجزائر، تونس، ليبيا',        fajr: '19.5°', isha: '17.5°' },
  { method: 'كراتشي',                        code: 'Karachi',              region: 'باكستان، الهند، بنغلاديش، أفغانستان',      fajr: '18°',   isha: '18°'   },
  { method: 'رابطة العالم الإسلامي',         code: 'MWL',                  region: 'أوروبا، أفريقيا جنوب الصحراء',             fajr: '18°',   isha: '17°'   },
  { method: 'دبي',                           code: 'Dubai',                region: 'الإمارات، عُمان، البحرين، اليمن',           fajr: '18.2°', isha: '18.2°' },
  { method: 'قطر',                           code: 'Qatar',                region: 'قطر',                                      fajr: '18°',   isha: '90 دق' },
  { method: 'الكويت',                        code: 'Kuwait',               region: 'الكويت',                                   fajr: '18°',   isha: '17.5°' },
  { method: 'Diyanet تركيا',                 code: 'Turkey',               region: 'تركيا، أذربيجان',                          fajr: '18°',   isha: '17°'   },
  { method: 'سنغافورة / MUIS',               code: 'Singapore',            region: 'سنغافورة، ماليزيا، إندونيسيا، بروناي',    fajr: '20°',   isha: '18°'   },
  { method: 'ISNA — أمريكا الشمالية',        code: 'NorthAmerica',         region: 'الولايات المتحدة، كندا، أستراليا',         fajr: '15°',   isha: '15°'   },
  { method: 'طهران',                         code: 'Tehran',               region: 'إيران',                                    fajr: '17.7°', isha: '14°'   },
  { method: 'لجنة رؤية الهلال',              code: 'Moonsighting',         region: 'المملكة المتحدة، أيرلندا',                 fajr: '18°',   isha: 'حسب اللجنة' },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'كيف تُحسب مواقيت الصلاة على الموقع؟',
    node: (
      <div className="space-y-2 text-secondary">
        <p>
          يعتمد الموقع على معادلات فلكية دقيقة تأخذ في الاعتبار إحداثيات المدينة،
          المنطقة الزمنية، والانكسار الجوي.
        </p>
        <p>
          الأهم: يختار الموقع تلقائياً <strong className="text-primary">طريقة الحساب الرسمية المعتمدة في بلدك</strong>{' '}
          من بين 12 طريقة — أم القرى للسعودية، الطريقة المصرية للمغرب، Diyanet لتركيا،
          كراتشي لباكستان. النتيجة مواقيت مطابقة لما تعتمده المساجد المحلية.
        </p>
      </div>
    ),
  },
  {
    q: 'ما الفرق بين وقت العصر للشافعي والحنفي والمالكي والحنبلي؟',
    node: (
      <div className="space-y-2 text-secondary">
        <p>الخلاف يظهر <strong className="text-primary">فقط في وقت العصر</strong>. جميع الصلوات الأخرى متطابقة:</p>
        <ul className="list-disc pr-5 space-y-1.5">
          <li><strong className="text-primary">الشافعي والمالكي والحنبلي:</strong> العصر حين يساوي الظل طول الشيء (×1) — وهم يعطون نفس وقت البداية تماماً.</li>
          <li><strong className="text-primary">الحنفي:</strong> العصر حين يكون الظل ضعف الطول (×2)، مما يؤخره 45–90 دقيقة. معتمد في تركيا وباكستان والهند وآسيا الوسطى.</li>
        </ul>
        <p className="text-xs text-muted pt-1">الموقع يعرض كلا التوقيتين جنباً إلى جنب في صفحة كل مدينة.</p>
      </div>
    ),
  },
  {
    q: 'ما الفرق بين طرق الحساب الـ12 المدعومة؟',
    node: (
      <div className="space-y-2 text-secondary">
        <p>الاختلاف الرئيسي هو <strong className="text-primary">زاوية الفجر والعشاء تحت الأفق</strong> بالدرجات. مثلاً:</p>
        <ul className="list-disc pr-5 space-y-1">
          <li>أم القرى: الفجر 18.5°، العشاء 90 دق بعد المغرب</li>
          <li>ISNA: الفجر 15° (مناسبة لخطوط العرض العالية في أمريكا الشمالية)</li>
          <li>سنغافورة: الفجر 20°، العشاء 18° (الأكبر)</li>
        </ul>
        <p>الموقع يختار الطريقة الأنسب تلقائياً ويمكنك تغييرها يدوياً.</p>
      </div>
    ),
  },
  {
    q: 'هل يدعم الموقع التوقيت الصيفي (DST)؟',
    a: 'نعم. نستخدم قواعد المنطقة الزمنية لكل مدينة مباشرةً فيتحول التوقيت الصيفي تلقائياً.',
  },
  {
    q: 'هل تقدمون إمساكية رمضان؟',
    a: 'نعم. في صفحة كل مدينة ستجد جدولاً شهرياً كاملاً بمواقيت الصلاة يومياً، قابلاً للطباعة بنقرة واحدة.',
  },
  {
    q: 'ما دقة الحسابات المعروضة؟',
    a: 'تُحسب المواقيت بدقة ثانية واحدة وتُعرض بالدقيقة، وتتجدد تلقائياً كل يوم.',
  },
];

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: '🌍',
    q: 'اختيار تلقائي لأدق طريقة حساب لكل بلد',
    node: (
      <div className="space-y-2 text-secondary">
        <p>يحدد الموقع طريقة الحساب الرسمية تلقائياً من بين 12 طريقة:</p>
        <p className="text-xs text-muted leading-relaxed">
          أم القرى (SA) · الطريقة المصرية (EG/MA/DZ/TN) · كراتشي (PK/IN/BD/AF) ·
          رابطة العالم الإسلامي (JO/LB/FR/DE) · دبي (AE/OM/BH) · قطر · الكويت ·
          Diyanet تركيا (TR) · MUIS سنغافورة (SG/MY/ID) · ISNA (US/CA) ·
          لجنة رؤية الهلال (GB) · طهران (IR)
        </p>
        <p>النتيجة: مواقيت مطابقة تماماً لما تعتمده المساجد في بلدك.</p>
      </div>
    ),
  },
  {
    icon: '🔵',
    q: 'دعم المذاهب الأربعة — الشافعي والمالكي والحنبلي والحنفي',
    a: 'يُعرض وقت العصر وفق المذهب الصحيح لبلدك تلقائياً، مع مقارنة تفاعلية بين الشافعي والحنفي وشرح الفرق الفلكي والفقهي.',
  },
  {
    icon: '📅',
    q: 'تقويم شهري قابل للطباعة',
    a: 'جدول شهري كامل بمواقيت الصلاة يومياً مع تمييز يوم الجمعة واليوم الحالي، قابل للطباعة في وضع مُحسَّن.',
  },
  {
    icon: '🕒',
    q: 'عداد تنازلي ذكي للصلاة القادمة',
    a: 'عداد تنازلي دقيق مع حلقة تقدم بصرية تُحدَّث كل ثانية بدون إعادة تحميل الصفحة.',
  },
  {
    icon: '🌐',
    q: 'يعمل لأكثر من 1000 مدينة حول العالم',
    a: 'قاعدة بيانات شاملة تغطي مدن العالم الإسلامي مع إحداثيات دقيقة ومناطق زمنية صحيحة.',
  },
];

function PrayerLandingPopularLinksFallback() {
  return (
    <div className="space-y-6 mb-12" aria-hidden="true">
      <section className="card mb-0">
        <div className="h-7 w-56 rounded-full bg-[var(--bg-surface-2)] mb-3 animate-pulse" />
        <div className="h-4 w-full rounded-full bg-[var(--bg-surface-2)] mb-2 animate-pulse" />
        <div className="h-4 w-4/5 rounded-full bg-[var(--bg-surface-2)] mb-6 animate-pulse" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`popular-city-skeleton-${index}`}
              className="h-24 rounded-2xl bg-[var(--bg-surface-2)] animate-pulse"
            />
          ))}
        </div>
      </section>

      <section className="card-nested mb-0">
        <div className="h-7 w-48 rounded-full bg-[var(--bg-surface-2)] mb-3 animate-pulse" />
        <div className="h-4 w-3/4 rounded-full bg-[var(--bg-surface-2)] mb-4 animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`popular-country-skeleton-${index}`}
              className="h-10 w-40 rounded-full bg-[var(--bg-surface-2)] animate-pulse"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

async function PrayerLandingPopularLinks() {
  const [popularPrayerCityLinks, popularPrayerCountryLinks] = await Promise.all([
    getPopularPrayerCityLinks(),
    getPopularPrayerCountryLinks(),
  ]);

  const cityItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'صفحات مواقيت الصلاة الأكثر بحثاً',
    itemListElement: popularPrayerCityLinks.slice(0, 24).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      url: `${BASE}${item.href}`,
    })),
  };

  const countryItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'صفحات مواقيت الصلاة في الدول',
    itemListElement: popularPrayerCountryLinks.slice(0, 24).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      url: `${BASE}${item.href}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityItemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(countryItemListSchema) }} />

      <section className="card mb-10" aria-labelledby="popular-prayer-city-links-heading">
        <h2 id="popular-prayer-city-links-heading" className="text-xl font-semibold text-primary mb-2">
          صفحات مواقيت الصلاة الأكثر بحثاً
        </h2>
        <p className="text-sm text-secondary leading-[1.8] mb-5">
          هذه الروابط تُساعد محركات البحث والمستخدمين على الوصول مباشرة إلى صفحات المدن الأكثر طلباً مثل
          &quot;مواقيت الصلاة في الرياض&quot; و&quot;مواقيت الصلاة في الرباط&quot; و&quot;مواقيت الصلاة في القاهرة&quot;.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {popularPrayerCityLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                padding: '1rem',
                borderRadius: '1rem',
                textDecoration: 'none',
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
              }}
              title={item.description}
            >
              <strong
                style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                {item.label}
              </strong>
              <span style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {item.description}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="card-nested mb-12" aria-labelledby="popular-prayer-country-links-heading">
        <h2 id="popular-prayer-country-links-heading" className="text-xl font-semibold text-primary mb-2">
          مواقيت الصلاة في الدول
        </h2>
        <p className="text-sm text-secondary leading-[1.8] mb-4">
          الصفحات التالية تربط بين صفحة الدولة وصفحات المدن التابعة لها، مما يحسن اكتشاف الصفحات الطويلة الذيل
          في نتائج البحث والزحف الداخلي.
        </p>
        <div className="flex flex-wrap gap-2">
          {popularPrayerCountryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="waqt-pill"
              style={{ textDecoration: 'none' }}
              title={item.description}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default async function PrayerLandingPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'مواقيت الصلاة اليوم في الدول والمدن',
    url: `${BASE}/mwaqit-al-salat`,
    description:
      'قسم مواقيت الصلاة في ميقاتنا يربط بين صفحات الدول والمدن مع مواقيت الفجر والظهر والعصر والمغرب والعشاء والجداول الشهرية.',
    inLanguage: 'ar',
  };
  const utilityLinks = [
    {
      href: '/time-now',
      label: 'الوقت الآن في المدن والدول',
      description: 'اعرف الساعة الحالية في نفس المدن التي تتابع فيها مواقيت الصلاة.',
    },
    {
      href: '/date/today/hijri',
      label: 'التاريخ الهجري اليوم',
      description: 'راجع التاريخ الهجري اليوم المرتبط بالمواقيت والتقويم والمناسبات الإسلامية.',
    },
    {
      href: '/date/converter',
      label: 'محول التاريخ',
      description: 'حوّل بين التاريخ الهجري والميلادي بسرعة عند التخطيط للمناسبات والعبادات.',
    },
    {
      href: '/time-difference',
      label: 'حاسبة فرق التوقيت',
      description: 'قارن التوقيت بين المدن والدول عند متابعة الصلاة والسفر والعمل عن بعد.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name:    f.q,
      acceptedAnswer: { '@type': 'Answer', text: typeof f.a === 'string' ? f.a : 'انظر الصفحة للتفاصيل.' },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type':    'HowTo',
    name:       'كيفية معرفة مواقيت الصلاة لمدينتك',
    step: [
      { '@type': 'HowToStep', name: 'ابحث عن مدينتك',         text: 'اكتب اسم المدينة أو الدولة في خانة البحث.' },
      { '@type': 'HowToStep', name: 'اطلع على مواقيت اليوم',  text: 'يُعرض جدول مفصّل بالفجر والشروق والظهر والعصر والمغرب والعشاء.' },
      { '@type': 'HowToStep', name: 'اختر المذهب (اختياري)', text: 'حدد الشافعي أو الحنفي لرؤية وقت العصر وفق مذهبك.' },
      { '@type': 'HowToStep', name: 'اطبع أو شارك الإمساكية', text: 'انسخ الرابط أو اطبع الجدول الشهري مباشرةً.' },
    ],
  };

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">
      {/* <AdLayoutWrapper> */}
      <main className="content-col pt-24 pb-20 mt-12">

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

        {/* ── H1 Header ─────────────────────────────────────────────────── */}
        <header className="text-center mb-10">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.9rem',
              borderRadius: '999px',
              background: 'var(--accent-soft)',
              border: '1px solid var(--border-accent)',
              fontSize: '0.78rem',
              color: 'var(--accent)',
              fontWeight: '700',
              marginBottom: '1rem',
            }}
          >
            <Clock size={13} /> 
            مواقيت الصلاة اليوم لكل مدينة — حسب المذاهب الأربعة
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            مواقيت الصلاة اليوم في مدينتك — حسب المذاهب الأربعة
          </h1>

          <p className="text-secondary text-base leading-[1.7] mx-auto max-w-[720px]">
            اعرف الآن{" "}
            <strong className="text-primary">مواقيت الصلاة الدقيقة اليوم</strong>{" "}
            لأي مدينة في العالم: الفجر، الشروق، الظهر، العصر، المغرب والعشاء.{" "}
            يدعم الموقع{" "}
            <strong className="text-primary">
              المذاهب الأربعة (الشافعي، الحنفي، المالكي، الحنبلي)
            </strong>{" "}
            مع اختيار تلقائي لـ{" "}
            <strong className="text-primary">طريقة الحساب المعتمدة في بلدك</strong>{" "}
            من بين أكثر من 12 طريقة رسمية لحساب أوقات الصلاة.
          </p>
        </header>

        <AdTopBanner slotId="top-mwaqit" />

        {/* ── Search Card ───────────────────────────────────────────────── */}
        <div className="card card--glass mb-16">
          <label className="block text-sm font-semibold text-secondary mb-3">
            ابحث عن مدينتك أو دولتك
          </label>
          <SearchCityWrapper mode="prayer" />
        </div>

        {/* ── Features ─────────────────────────────────────────────────── */}
        <section className="mb-14" aria-label="مميزات الأداة">
          <h2 className="text-2xl font-semibold text-primary mb-6">مميزات الأداة</h2>
          <FAQAccordions items={features} />
        </section>

        <AdInArticle slotId="mid-mwaqit-1" />

        {/* ── Madhab Comparison Table ───────────────────────────────────── */}
        <section className="card mb-10" aria-label="الفرق بين المذاهب في وقت العصر">
          <h2 className="text-xl font-semibold text-primary mb-1">الفرق بين المذاهب في وقت العصر</h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            المذاهب الأربعة متفقة في جميع الصلوات — <strong className="text-secondary">الفرق الوحيد هو وقت العصر</strong>.
          </p>
          <div className="overflow-x-auto rounded-xl border border-default">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-3 text-secondary">
                  <th className="text-right py-3 px-4 font-semibold border-b border-subtle">المذهب</th>
                  <th className="text-right py-3 px-4 font-semibold border-b border-subtle">قاعدة ظل العصر</th>
                  <th className="text-right py-3 px-4 font-semibold border-b border-subtle">الدول المعتمِدة</th>
                  <th className="text-right py-3 px-4 font-semibold border-b border-subtle">وقت العصر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {[
                  { name: 'الشافعي',  rule: '× 1', countries: 'مصر، سوريا، الأردن، ماليزيا، إندونيسيا، اليمن', timing: 'أبكر', timingClass: 'text-success' },
                  { name: 'المالكي',  rule: '× 1', countries: 'المغرب، الجزائر، تونس، ليبيا، غرب أفريقيا',      timing: 'أبكر (= الشافعي)', timingClass: 'text-success' },
                  { name: 'الحنبلي',  rule: '× 1', countries: 'السعودية، قطر، الكويت',                           timing: 'أبكر (= الشافعي)', timingClass: 'text-success' },
                  { name: 'الحنفي',   rule: '× 2', countries: 'تركيا، باكستان، الهند، بنغلاديش، العراق',         timing: 'متأخر 45–90 دق',  timingClass: 'text-warning' },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-surface-3 transition-colors">
                    <td className="py-3 px-4 font-semibold text-accent-alt">{row.name}</td>
                    <td className="py-3 px-4 text-muted tabular-nums font-mono">{row.rule}</td>
                    <td className="py-3 px-4 text-secondary">{row.countries}</td>
                    <td className={`py-3 px-4 font-semibold ${row.timingClass}`}>{row.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 12 Calculation Methods Table ─────────────────────────────── */}
        <section className="card mb-10" aria-label="طرق الحساب المدعومة">
          <h2 className="text-xl font-semibold text-primary mb-1">طرق الحساب الـ12 المدعومة</h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            لكل بلد هيئة دينية تحدد زوايا الفجر والعشاء المعتمدة. الموقع يختار الطريقة الصحيحة تلقائياً.
          </p>
          <div className="overflow-x-auto rounded-xl border border-default">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-surface-3 text-secondary">
                  <th className="text-right py-3 px-3 font-semibold border-b border-subtle">الطريقة</th>
                  <th className="text-right py-3 px-3 font-semibold border-b border-subtle">المنطقة</th>
                  <th className="text-center py-3 px-3 font-semibold border-b border-subtle">زاوية الفجر</th>
                  <th className="text-center py-3 px-3 font-semibold border-b border-subtle">زاوية العشاء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {METHODS_TABLE.map((row) => (
                  <tr key={row.code} className="hover:bg-surface-3 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-accent-alt whitespace-nowrap">{row.method}</td>
                    <td className="py-2.5 px-3 text-secondary">{row.region}</td>
                    <td className="py-2.5 px-3 text-muted tabular-nums font-mono text-center">{row.fajr}</td>
                    <td className="py-2.5 px-3 text-muted tabular-nums font-mono text-center">{row.isha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── How it's calculated ───────────────────────────────────────── */}
        <section className="card-nested mb-10">
          <h2 className="text-xl font-semibold text-primary mb-3">كيف تُحسب أوقات الصلاة فلكياً؟</h2>
          <div className="space-y-2 text-sm text-secondary leading-[1.7]">
            <p>يعتمد الحساب على موضع الشمس بالنسبة للأفق مع مراعاة إحداثيات المدينة، ارتفاعها، والانكسار الجوي.</p>
            <ul className="space-y-1.5 list-disc pr-5">
              <li><span className="font-semibold text-primary">الفجر:</span> حين تصل الشمس لزاوية محددة تحت الأفق (15°–20° حسب الطريقة).</li>
              <li><span className="font-semibold text-primary">الشروق والمغرب:</span> عند ملامسة قرص الشمس للأفق مع تصحيح الانكسار الجوي (~0.833°).</li>
              <li><span className="font-semibold text-primary">الظهر:</span> لحظة تعامد الشمس على المدينة (الزوال) — متطابق بين جميع المذاهب.</li>
              <li><span className="font-semibold text-primary">العصر:</span> طول الظل ×1 (شافعي/مالكي/حنبلي) أو ×2 (حنفي).</li>
              <li><span className="font-semibold text-primary">العشاء:</span> اختفاء الشفقة الحمراء (14°–18°) أو وقت ثابت بعد المغرب حسب الطريقة.</li>
            </ul>
          </div>
        </section>

        <Suspense fallback={<PrayerLandingPopularLinksFallback />}>
          <PrayerLandingPopularLinks />
        </Suspense>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="mb-20" aria-label="أسئلة شائعة">
          <h2 className="text-2xl font-semibold text-primary mb-6 text-center">أسئلة شائعة</h2>
          <FAQAccordions items={faqs} />
        </section>

        <section className="mb-12">
          <GeoInternalLinks
            title="روابط أساسية مرتبطة بمواقيت الصلاة"
            description="هذه الروابط تربط صفحات الصلاة مع الوقت الآن والتاريخ وفرق التوقيت حتى تصل محركات البحث والمستخدمون إلى الأقسام المكملة من نفس بنية الموقع."
            links={utilityLinks}
            ariaLabel="روابط أساسية مرتبطة بمواقيت الصلاة"
          />
        </section>

      </main>
      {/* </AdLayoutWrapper> */}
    </div>
  );
}

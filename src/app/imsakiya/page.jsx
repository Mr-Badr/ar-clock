/**
 * /imsakiya — Imsakiya hub: links to top cities per country.
 * Server-rendered, static. No dynamic data needed — just city links.
 */

import Link from 'next/link';
import { Moon, ArrowLeftRight, Calendar } from 'lucide-react';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import { getUpcomingRamadanHijriYear, getRamadanGregorianStart } from '@/lib/imsakiyaEngine';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdMultiplex from '@/components/ads/AdMultiplex';
import { JsonLd } from '@/components/seo/JsonLd';
import { SiteDotLinkList } from '@/components/shared/SiteDotLinkList';
import { SiteFaqAccordion } from '@/components/shared/SiteFaqAccordion';
import { SiteRelatedCardGrid } from '@/components/shared/SiteRelatedCardGrid';
import './imsakiya.css';

const SITE_URL = getSiteUrl();

// Precompute Ramadan year at module load (build time) — avoids new Date() in render
const _hijriYear = getUpcomingRamadanHijriYear();
const _ramadanStart = getRamadanGregorianStart(_hijriYear);
const _gregYear = _ramadanStart.year;

// Top cities with Arabic names — static, curated list. This is the hub's "start here"
// shortlist, not a full directory (DESIGN.md: an exhaustive directory is never the main
// experience) — every real city still has its own indexable page via /imsakiya/[country].
const TOP_IMSAKIYA_CITIES = [
  // Saudi Arabia
  { country: 'saudi-arabia', countryAr: 'السعودية', city: 'riyadh', cityAr: 'الرياض' },
  { country: 'saudi-arabia', countryAr: 'السعودية', city: 'jeddah', cityAr: 'جدة' },
  { country: 'saudi-arabia', countryAr: 'السعودية', city: 'makkah', cityAr: 'مكة المكرمة' },
  { country: 'saudi-arabia', countryAr: 'السعودية', city: 'medina', cityAr: 'المدينة المنورة' },
  // Egypt
  { country: 'egypt', countryAr: 'مصر', city: 'cairo', cityAr: 'القاهرة' },
  { country: 'egypt', countryAr: 'مصر', city: 'alexandria', cityAr: 'الإسكندرية' },
  { country: 'egypt', countryAr: 'مصر', city: 'giza', cityAr: 'الجيزة' },
  // UAE
  { country: 'uae', countryAr: 'الإمارات', city: 'dubai', cityAr: 'دبي' },
  { country: 'uae', countryAr: 'الإمارات', city: 'abu-dhabi', cityAr: 'أبو ظبي' },
  // Kuwait
  { country: 'kuwait', countryAr: 'الكويت', city: 'kuwait-city', cityAr: 'الكويت' },
  // Qatar
  { country: 'qatar', countryAr: 'قطر', city: 'doha', cityAr: 'الدوحة' },
  // Morocco
  { country: 'morocco', countryAr: 'المغرب', city: 'casablanca', cityAr: 'الدار البيضاء' },
  { country: 'morocco', countryAr: 'المغرب', city: 'rabat', cityAr: 'الرباط' },
  { country: 'morocco', countryAr: 'المغرب', city: 'fez', cityAr: 'فاس' },
  // Algeria
  { country: 'algeria', countryAr: 'الجزائر', city: 'algiers', cityAr: 'الجزائر العاصمة' },
  { country: 'algeria', countryAr: 'الجزائر', city: 'oran', cityAr: 'وهران' },
  // Tunisia
  { country: 'tunisia', countryAr: 'تونس', city: 'tunis', cityAr: 'تونس' },
  // Jordan
  { country: 'jordan', countryAr: 'الأردن', city: 'amman', cityAr: 'عمّان' },
  // Iraq
  { country: 'iraq', countryAr: 'العراق', city: 'baghdad', cityAr: 'بغداد' },
  // Libya
  { country: 'libya', countryAr: 'ليبيا', city: 'tripoli', cityAr: 'طرابلس' },
  // Sudan
  { country: 'sudan', countryAr: 'السودان', city: 'khartoum', cityAr: 'الخرطوم' },
  // Bahrain
  { country: 'bahrain', countryAr: 'البحرين', city: 'manama', cityAr: 'المنامة' },
  // Oman
  { country: 'oman', countryAr: 'عُمان', city: 'muscat', cityAr: 'مسقط' },
];

const GREGORIAN_MONTHS_AR = [
  '', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

// Group by country
function groupByCountry(cities) {
  const map = new Map();
  for (const c of cities) {
    if (!map.has(c.country)) map.set(c.country, { countryAr: c.countryAr, country: c.country, cities: [] });
    map.get(c.country).cities.push(c);
  }
  return Array.from(map.values());
}

export const metadata = buildCanonicalMetadata({
  title: `إمساكية رمضان ${_hijriYear} هـ / ${_gregYear} — أوقات السحور والإفطار لجميع المدن`,
  description: `إمساكيات رمضان ${_gregYear} لأكثر من 20 مدينة عربية: الرياض، القاهرة، دبي، الكويت، الدار البيضاء وغيرها — أوقات السحور والإفطار يومياً محسوبة فلكياً.`,
  keywords: [
    `إمساكية رمضان ${_gregYear}`,
    `إمساكية رمضان ${_hijriYear} هـ`,
    'إمساكية رمضان',
    'وقت الإفطار',
    'وقت السحور',
    'مواقيت رمضان',
    'إمساكية السعودية',
    'إمساكية مصر',
    'إمساكية الإمارات',
    'إمساكية المغرب',
    `رمضان ${_gregYear}`,
    'امساكية الرياض',
    'امساكية القاهرة',
    'امساكية دبي',
    'امساكية الكويت',
    'كم باقي على الافطار',
    'موعد الاذان اليوم',
    'إمساكية الجزائر',
    'إمساكية العراق',
    'اول يوم رمضان',
    'الفرق بين الامساك والفجر',
  ],
  url: `${SITE_URL}/imsakiya`,
});

export default function ImsakiyaHubPage() {
  const hijriYear = _hijriYear;
  const ramadanStart = _ramadanStart;
  const gregYear = _gregYear;
  const groups = groupByCountry(TOP_IMSAKIYA_CITIES);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'إمساكية رمضان', item: `${SITE_URL}/imsakiya` },
    ],
  };

  const faqItems = [
    {
      question: 'ما الفرق بين وقت الإمساك ووقت الفجر؟',
      answer: 'وقت الإمساك هو الوقت الذي يُوصى فيه بالتوقف عن الأكل والشرب احتياطاً، وعادةً يسبق الأذان بعشر دقائق. أما وقت الفجر (السحور) فهو أذان الفجر الصادق، وهو الوقت الحقيقي لبداية الصيام وفق الفقه الإسلامي. كثير من الإمساكيات تعتمد وقت الفجر مباشرةً دون إمساك إضافي.',
    },
    {
      question: 'لماذا يختلف وقت الإفطار بين المدن في نفس الدولة؟',
      answer: 'يتحدد وقت الإفطار بغروب الشمس فلكياً، وهذا يختلف من موقع لآخر بحسب خط الطول. في الدول الكبيرة كالسعودية ومصر والمغرب، قد يصل الفرق بين أقصى الشرق وأقصى الغرب إلى 15-20 دقيقة. لهذا يُنصح دائماً باستخدام إمساكية مدينتك تحديداً.',
    },
    {
      question: 'هل يمكن الاعتماد على هذه الإمساكيات للصيام؟',
      answer: 'هذه الأوقات محسوبة فلكياً بدقة عالية وهي صالحة للاستخدام. للتأكد، يمكنك مقارنتها مع إمساكية المسجد المحلي في مدينتك أو توقيت دار الإفتاء في بلدك. الاختلافات الصغيرة (دقيقة أو دقيقتان) مقبولة فقهياً، ولا تؤثر على صحة الصيام.',
    },
    {
      question: `كيف أعرف أول يوم رمضان ${gregYear}؟`,
      answer: `وفق الحسابات الفلكية وتقويم أم القرى، يُتوقع أن يبدأ رمضان ${gregYear} في ${ramadanStart.day} ${GREGORIAN_MONTHS_AR[ramadanStart.month]} ${gregYear}. غير أن الإعلان الرسمي يعتمد على رؤية هلال رمضان، وقد يختلف من دولة لأخرى بيوم كامل. تابع إعلانات وزارة الأوقاف أو دار الإفتاء في بلدك للتأكيد.`,
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20">
          {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
          <AdTopBanner slotId="imsakiya-hub-top" />

          <nav aria-label="مسار التنقل" className="text-xs text-muted mb-6 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-accent transition-colors">الرئيسية</Link>
            <span aria-hidden="true">›</span>
            <span className="text-secondary">إمساكية رمضان</span>
          </nav>

          <section className="date-hero-panel date-hero-panel--single mb-12">
            <div className="date-hero-main">
              <p className="date-kicker m-0">
                <Moon size={15} aria-hidden="true" /> إمساكية رمضان حسب المدينة
              </p>
              <h1 className="date-hero-title">
                إمساكية رمضان {hijriYear} هـ / {gregYear}
              </h1>
              <p className="date-hero-copy">
                أوقات السحور والإفطار لكل يوم من رمضان — اختر مدينتك لرؤية جدول كامل محسوب فلكياً بدقة.
              </p>
              <p className="ims-caveat">
                <Calendar size={16} aria-hidden="true" />
                <span>
                  <strong>أول رمضان المتوقع:</strong> {ramadanStart.day} {GREGORIAN_MONTHS_AR[ramadanStart.month]} {gregYear} وفق تقويم أم القرى — قد يتقدم يوماً أو يتأخر برؤية الهلال.
                </span>
              </p>
            </div>
          </section>

          {/* City picker — dot lists, not equal boxes (DESIGN.md §4.4 / §12.2, the
              site's one "choose from many links" pattern). */}
          <section className="date-section" aria-labelledby="imsakiya-cities-heading">
            <h2 id="imsakiya-cities-heading" className="date-section-title">
              اختر مدينتك
            </h2>
            {groups.map(({ country, countryAr, cities }) => (
              <div key={country} className="ims-country-group">
                <h3 className="ims-country-group__title">{countryAr}</h3>
                <SiteDotLinkList
                  ariaLabel={`مدن ${countryAr}`}
                  items={cities.map(({ city, cityAr }) => ({
                    href: `/imsakiya/${country}/${city}`,
                    label: cityAr,
                    description: `إمساكية رمضان ${gregYear} في ${cityAr}`,
                  }))}
                />
              </div>
            ))}
          </section>

          {/* Plain text — a heading and two sentences don't earn a bordered panel
              (DESIGN.md Law 4). */}
          <section className="date-section max-w-3xl" aria-labelledby="imsakiya-about-heading">
            <h2 id="imsakiya-about-heading" className="date-section-title">
              كيف تُحسب هذه الإمساكيات؟
            </h2>
            <p className="date-editorial-copy">
              الأوقات محسوبة باستخدام بيانات الموقع الجغرافي الدقيق لكل مدينة ومعادلات الفلك الإسلامية المعتمدة إقليمياً.
              وقت السحور = وقت الفجر، ووقت الإفطار = وقت المغرب.
            </p>
            <p className="date-editorial-copy mt-3">
              رمضان {hijriYear} هـ يبدأ المتوقع {ramadanStart.day} {GREGORIAN_MONTHS_AR[ramadanStart.month]} {gregYear} — هذا التاريخ مبني على تقويم أم القرى ويعتمد عملياً في السعودية وكثير من دول الخليج.
              قد تعتمد دول أخرى التقويم المحلي أو الرؤية المحلية للهلال.
            </p>
          </section>

          <AdMultiplex slotId="imsakiya-hub-bottom" />

          <section className="date-section max-w-3xl" aria-labelledby="imsakiya-faq-heading">
            <h2 id="imsakiya-faq-heading" className="date-section-title">
              أسئلة شائعة عن إمساكية رمضان {gregYear}
            </h2>
            <SiteFaqAccordion items={faqItems} />
          </section>

          <section className="date-section" aria-labelledby="imsakiya-related-heading">
            <SiteRelatedCardGrid
              heading="خطوات تكمل رمضان"
              headingId="imsakiya-related-heading"
              items={[
                {
                  href: '/holidays/ramadan',
                  label: `كم باقي على رمضان ${gregYear}`,
                  Icon: Calendar,
                },
                {
                  href: '/holidays/eid-al-fitr',
                  label: `كم باقي على عيد الفطر ${gregYear}`,
                  Icon: Calendar,
                },
                {
                  href: '/date/hijri-months',
                  label: 'الأشهر الهجرية بالترتيب',
                  Icon: ArrowLeftRight,
                },
              ]}
            />
          </section>
        </main>
      </AdLayoutWrapper>
    </>
  );
}

/**
 * /imsakiya/[country] — Country-level imsakiya listing.
 * Lists cities in that country with links to city-level imsakiya pages.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Moon, Calendar } from 'lucide-react';
import { getCountryBySlug, getAllCountrySlugs } from '@/lib/db/queries/countries';
import { getCitiesByCountry } from '@/lib/db/queries/cities';
import { isRouteSlug, buildNoindexRouteMetadata } from '@/lib/route-param-validation';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import { getUpcomingRamadanHijriYear, getRamadanGregorianStart, GREGORIAN_MONTHS_AR } from '@/lib/imsakiyaEngine';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdMultiplex from '@/components/ads/AdMultiplex';
import { JsonLd } from '@/components/seo/JsonLd';
import CountryFlag from '@/components/shared/CountryFlag';
import { SiteDotLinkList } from '@/components/shared/SiteDotLinkList';
import { SiteFaqAccordion } from '@/components/shared/SiteFaqAccordion';
import '../imsakiya.css';

const SITE_URL = getSiteUrl();

// Precomputed at module load (build time) — avoids new Date() during render
const _hijriYear = getUpcomingRamadanHijriYear();
const _gregYear = getRamadanGregorianStart(_hijriYear).year;

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [{ country: 'saudi-arabia' }, { country: 'egypt' }, { country: 'morocco' }];
  }
  // One dimension (country only), cheap and linear to prerender in full — was
  // `getPriorityCountrySlugs(20)`, which didn't even guarantee full coverage of the ~38-country
  // priority+global set since that helper slices AFTER prepending it. Fixed 2026-08-24.
  const slugs = await getAllCountrySlugs();
  return slugs.map(country => ({ country }));
}

export async function generateMetadata({ params }) {
  const { country: countrySlug } = await params;
  if (!isRouteSlug(countrySlug)) {
    return buildNoindexRouteMetadata({ title: 'رابط غير صالح', description: '', canonical: '/imsakiya' });
  }
  const country = await getCountryBySlug(countrySlug);
  if (!country) {
    return buildNoindexRouteMetadata({ title: 'دولة غير موجودة', description: '', canonical: '/imsakiya' });
  }

  const hijriYear = _hijriYear;
  const gregYear = _gregYear;
  const countryAr = country.name_ar || countrySlug;

  return buildCanonicalMetadata({
    title: `إمساكية رمضان ${gregYear} في ${countryAr} — السحور والإفطار`,
    description: `اختر مدينتك في ${countryAr} لعرض إمساكية رمضان ${gregYear} الكاملة — أوقات السحور والإفطار لكل يوم محسوبة فلكياً.`,
    keywords: [
      `إمساكية رمضان ${countryAr}`,
      `إمساكية ${countryAr}`,
      `مواقيت رمضان ${countryAr}`,
      `وقت الإفطار ${countryAr}`,
      `وقت السحور ${countryAr}`,
      `متى الإفطار في ${countryAr}`,
      `متى السحور في ${countryAr}`,
      `مواقيت الصيام ${countryAr}`,
      `جدول رمضان ${countryAr}`,
      `إمساكية رمضان ${gregYear} ${countryAr}`,
      `إمساكية رمضان ${hijriYear} هـ ${countryAr}`,
      `كم باقي على الافطار في ${countryAr}`,
      `اذان المغرب اليوم في ${countryAr}`,
      `تقويم رمضان ${countryAr}`,
    ],
    url: `${SITE_URL}/imsakiya/${countrySlug}`,
  });
}

export default async function ImsakiyaCountryPage({ params }) {
  const { country: countrySlug } = await params;
  if (!isRouteSlug(countrySlug)) notFound();

  const country = await getCountryBySlug(countrySlug);
  if (!country) notFound();

  const cities = await getCitiesByCountry(country.country_code);
  const hijriYear = _hijriYear;
  const gregYear = _gregYear;
  const ramadanStart = getRamadanGregorianStart(hijriYear);
  const countryAr = country.name_ar || countrySlug;

  // Sort by population desc, limit to 40 cities
  const topCities = [...cities]
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, 40)
    .filter(c => c.city_slug);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'إمساكية رمضان', item: `${SITE_URL}/imsakiya` },
      { '@type': 'ListItem', position: 3, name: countryAr, item: `${SITE_URL}/imsakiya/${countrySlug}` },
    ],
  };

  const faqItems = [
    {
      question: 'كيف تُحسب أوقات السحور والإفطار؟',
      answer: 'تُحسب أوقات السحور والإفطار فلكياً بناءً على موضع الشمس — يبدأ الصيام عند الفجر الصادق (انبثاق الضوء في أفق السماء قبل الشروق)، وينتهي عند غروب الشمس. تختلف هذه الأوقات من مدينة لأخرى داخل نفس الدولة بسبب تباين خطوط الطول والعرض.',
    },
    {
      question: `هل يختلف موعد الإفطار بين مدن ${countryAr}؟`,
      answer: `نعم، قد يختلف موعد الإفطار بين مدن ${countryAr} بدقائق تتراوح عادةً بين دقيقة وعشر دقائق حسب موقع المدينة جغرافياً. المدن الغربية يغرب فيها الشمس متأخرةً قليلاً عن المدن الشرقية. لهذا السبب يُنصح بالاستعانة بإمساكية مدينتك تحديداً لا إمساكية عاصمة الدولة.`,
    },
    {
      question: `متى يبدأ رمضان ${gregYear} في ${countryAr}؟`,
      answer: `المتوقع أن يبدأ رمضان ${gregYear} في ${ramadanStart.day} ${GREGORIAN_MONTHS_AR[ramadanStart.month]} ${gregYear} وفق حسابات تقويم أم القرى. غير أن الموعد الرسمي يعتمد على رؤية هلال رمضان، وقد يتقدم يوماً أو يتأخر يوماً. تابع إعلان دار الإفتاء أو الجهة الدينية الرسمية في ${countryAr} لتأكيد البداية الفعلية.`,
    },
    {
      question: 'ما الفرق بين الإمساكية الفلكية وإمساكية دار الإفتاء؟',
      answer: 'الإمساكية الفلكية تعتمد حسابات علم الفلك الدقيقة لتحديد أوقات الفجر والغروب، وهي الأكثر دقة للتخطيط المسبق. أما إمساكية دار الإفتاء أو وزارة الأوقاف في كل دولة فقد تختلف قليلاً بسبب احتياطات تُضاف للسحور أو الإفطار. الفروق عادةً لا تتجاوز دقيقة أو دقيقتين.',
    },
    {
      question: `كم ساعة الصيام يومياً في رمضان ${gregYear}؟`,
      answer: 'تتباين مدة الصيام اليومي حسب الموسم الذي يقع فيه رمضان. حين يقع رمضان صيفاً تمتد ساعات الصيام من 14 إلى 18 ساعة في كثير من الدول العربية، وحين يقع شتاءً تتراجع إلى 11-13 ساعة. للاطلاع على المدة الدقيقة ليومٍ بعينه في مدينتك، افتح إمساكية مدينتك من القائمة أعلاه.',
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20">
          {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
          <AdTopBanner slotId="imsakiya-country-top" />

          <nav aria-label="مسار التنقل" className="text-xs text-muted mb-6 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-accent transition-colors">الرئيسية</Link>
            <span aria-hidden="true">›</span>
            <Link href="/imsakiya" className="hover:text-accent transition-colors">إمساكية رمضان</Link>
            <span aria-hidden="true">›</span>
            <span className="text-secondary">{countryAr}</span>
          </nav>

          <section className="date-hero-panel date-hero-panel--single mb-12">
            <div className="date-hero-main">
              <p className="date-kicker m-0">
                <CountryFlag code={country.country_code} /> إمساكية حسب المدينة
              </p>
              <h1 className="date-hero-title">
                إمساكية رمضان {hijriYear} هـ / {gregYear} في {countryAr}
              </h1>
              <p className="date-hero-copy">
                اختر مدينتك لعرض جدول أوقات السحور والإفطار لكل يوم من رمضان {gregYear}.
              </p>
              <p className="ims-caveat">
                <Calendar size={16} aria-hidden="true" />
                <span>
                  <strong>أول رمضان المتوقع:</strong> {ramadanStart.day} {GREGORIAN_MONTHS_AR[ramadanStart.month]} {gregYear} وفق تقويم أم القرى — قد يتقدم أو يتأخر يوماً برؤية الهلال.
                </span>
              </p>
            </div>
          </section>

          <section className="date-section" aria-labelledby="imsakiya-country-cities-heading">
            <h2 id="imsakiya-country-cities-heading" className="date-section-title">
              مدن {countryAr}
            </h2>
            {topCities.length === 0 ? (
              <p className="date-section-copy">لا توجد مدن متاحة لهذه الدولة حالياً.</p>
            ) : (
              <SiteDotLinkList
                ariaLabel={`مدن ${countryAr}`}
                items={topCities.map((city) => ({
                  href: `/imsakiya/${countrySlug}/${city.city_slug}`,
                  label: city.name_ar || city.city_slug,
                  description: `إمساكية رمضان ${gregYear} في ${city.name_ar || city.city_slug}`,
                }))}
              />
            )}
          </section>

          <section className="date-section max-w-3xl" aria-labelledby="imsakiya-country-method-heading">
            <h2 id="imsakiya-country-method-heading" className="date-section-title">
              كيف نحسب أوقات الإمساكية؟
            </h2>
            <p className="date-editorial-copy">
              تعتمد حاسبة الإمساكية على خوارزمية فلكية دقيقة تأخذ في الاعتبار إحداثيات كل مدينة (خط الطول، خط العرض، الارتفاع عن سطح البحر) وزاوية ميل الشمس تحت الأفق لتحديد لحظة الفجر الصادق الدقيقة.
            </p>
            <p className="date-editorial-copy mt-3">
              وقت الإفطار يتطابق مع غروب الشمس الفلكي — وهو اللحظة التي يختفي فيها القرص الشمسي كلياً تحت خط الأفق. هذه الأوقات محسوبة مسبقاً لكل أيام رمضان وتُعرض بدقة إلى الدقيقة.
            </p>
            <p className="date-editorial-copy mt-3">
              يُستحسن إضافة هامش احتياط من دقيقة إلى ثلاث دقائق للسحور احتياطاً، والأخذ بالتوقيت الرسمي لدار الإفتاء في بلدك إذا كان متاحاً. الحسابات الفلكية مرجع للتخطيط، والتأكيد النهائي من المرجعيات الدينية المعتمدة في {countryAr}.
            </p>
          </section>

          <AdMultiplex slotId="imsakiya-country-bottom" />

          <section className="date-section max-w-3xl" aria-labelledby="imsakiya-country-faq-heading">
            <h2 id="imsakiya-country-faq-heading" className="date-section-title">
              أسئلة شائعة عن إمساكية رمضان في {countryAr}
            </h2>
            <SiteFaqAccordion items={faqItems} />
          </section>

          <section className="date-section">
            <Link href="/imsakiya" className="date-quick-action">
              <Moon size={16} aria-hidden="true" />
              عرض جميع الدول
            </Link>
          </section>
        </main>
      </AdLayoutWrapper>
    </>
  );
}

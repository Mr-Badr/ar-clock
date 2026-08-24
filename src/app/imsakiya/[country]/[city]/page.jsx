/**
 * /imsakiya/[country]/[city] — Per-city Ramadan imsakiya (suhoor + iftar table).
 *
 * Fully server-rendered. Uses Adhan.js via prayerEngine + Hijri conversion via date-adapter.
 * Times computed from the next upcoming Ramadan; cached at the route level.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, CalendarDays, Moon, Flame, Sparkles } from 'lucide-react';
import { getCityBySlug, getPriorityCityParams, getPriorityCountriesCityParams } from '@/lib/db/queries/cities';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import { isRouteSlug, buildNoindexRouteMetadata, isRenderableCityData } from '@/lib/route-param-validation';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import {
  generateImsakiya,
  getUpcomingRamadanHijriYear,
  GREGORIAN_MONTHS_AR,
} from '@/lib/imsakiyaEngine';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import { JsonLd } from '@/components/seo/JsonLd';
import CountryFlag from '@/components/shared/CountryFlag';
import { SiteFaqAccordion } from '@/components/shared/SiteFaqAccordion';
import { SiteRelatedCardGrid } from '@/components/shared/SiteRelatedCardGrid';
import '../../imsakiya.css';

const SITE_URL = getSiteUrl();

// Precomputed at module load (build time) — avoids new Date() during render
const _hijriYear = getUpcomingRamadanHijriYear();

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [
      { country: 'saudi-arabia', city: 'riyadh' },
      { country: 'egypt',        city: 'cairo'   },
      { country: 'uae',          city: 'dubai'   },
    ];
  }
  // Was `getPriorityCityParams(24)` alone — ranks cities by GLOBAL population, which starves
  // small-but-important markets (e.g. Saudi Arabia's ~13 cities: only Riyadh made past global
  // rankings, so Jeddah/Makkah/Madinah never got prerendered even though Ramadan imsakiya demand
  // for them is real). Merged with `getPriorityCountriesCityParams(15)` the same way
  // /time-now/[country]/[city] already does, so every priority Arab/Islamic country gets its own
  // top cities prerendered regardless of global rank. Fixed 2026-08-24.
  const [globalParams, priorityCountryParams] = await Promise.all([
    getPriorityCityParams(24),
    getPriorityCountriesCityParams(15),
  ]);
  const seen = new Set((globalParams || []).map((p) => `${p.country}::${p.city}`));
  const merged = Array.isArray(globalParams) ? [...globalParams] : [];
  for (const p of (priorityCountryParams || [])) {
    const key = `${p.country}::${p.city}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(p);
    }
  }
  return merged.filter((item) => isRouteSlug(item?.country) && isRouteSlug(item?.city));
}

async function resolveCity(countrySlug, citySlug) {
  const country = await getCountryBySlug(countrySlug);
  if (!country) return null;
  const city = await getCityBySlug(country.country_code, citySlug);
  if (!city || !isRenderableCityData(city)) return null;
  return { country, city };
}

export async function generateMetadata({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  if (!isRouteSlug(countrySlug) || !isRouteSlug(citySlug)) {
    return buildNoindexRouteMetadata({
      title: 'رابط غير صالح',
      description: 'رابط الإمساكية غير صالح.',
      canonical: '/imsakiya',
    });
  }

  const resolved = await resolveCity(countrySlug, citySlug);
  if (!resolved) {
    return buildNoindexRouteMetadata({
      title: 'مدينة غير موجودة',
      description: 'لم يتم العثور على بيانات المدينة.',
      canonical: '/imsakiya',
    });
  }

  const { country, city } = resolved;
  const hijriYear = _hijriYear;
  const { gregYear } = generateImsakiya(city, hijriYear);
  const cityAr = city.name_ar || city.city_slug;
  const countryAr = country.name_ar || country.country_slug;

  const title = `إمساكية رمضان ${hijriYear} هـ / ${gregYear} في ${cityAr} — أوقات السحور والإفطار`;
  const description = `إمساكية رمضان ${gregYear} في ${cityAr}، ${countryAr}: جدول كامل بأوقات السحور والإفطار وعدد ساعات الصيام لكل يوم — محسوبة فلكياً بدقة.`;
  const url = `${SITE_URL}/imsakiya/${countrySlug}/${citySlug}`;
  const keywords = [
    `إمساكية رمضان ${gregYear} ${cityAr}`,
    `إمساكية ${cityAr}`,
    `وقت الإفطار ${cityAr}`,
    `وقت السحور ${cityAr}`,
    `إمساكية رمضان ${hijriYear} هـ`,
    `مواقيت الصيام ${cityAr}`,
    `متى الإفطار في ${cityAr}`,
    `متى السحور في ${cityAr}`,
    `إمساكية رمضان ${countryAr}`,
    `جدول رمضان ${cityAr}`,
    `كم باقي على الافطار في ${cityAr}`,
    `اذان المغرب اليوم في ${cityAr}`,
    `عدد ساعات الصيام في ${cityAr}`,
  ];

  return buildCanonicalMetadata({ title, description, keywords, url });
}

export default async function ImsakiyaCityPage({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  if (!isRouteSlug(countrySlug) || !isRouteSlug(citySlug)) notFound();

  const resolved = await resolveCity(countrySlug, citySlug);
  if (!resolved) notFound();

  const { country, city } = resolved;
  const hijriYear = _hijriYear;
  const imsakiya = generateImsakiya(city, hijriYear);

  const cityAr = city.name_ar || city.city_slug;
  const countryAr = country.name_ar || country.country_slug;
  const { gregYear, ramadanStart, dayCount, days } = imsakiya;

  const canonicalUrl = `${SITE_URL}/imsakiya/${countrySlug}/${citySlug}`;

  // Compute average fasting hours from middle of month
  const midDays = days.filter(d => d.ramadanDay >= 10 && d.ramadanDay <= 20);
  const sampleDay = midDays[Math.floor(midDays.length / 2)];

  // JSON-LD schemas
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'إمساكية رمضان', item: `${SITE_URL}/imsakiya` },
      { '@type': 'ListItem', position: 3, name: countryAr, item: `${SITE_URL}/imsakiya/${countrySlug}` },
      { '@type': 'ListItem', position: 4, name: cityAr, item: canonicalUrl },
    ],
  };

  const faqItems = [
    {
      question: `متى أول يوم رمضان ${gregYear} في ${cityAr}؟`,
      answer: `أول يوم رمضان ${hijriYear} هـ في ${cityAr} هو ${ramadanStart.day} ${GREGORIAN_MONTHS_AR[ramadanStart.month]} ${gregYear} وفق التقويم الأمّ القرى — قد يتقدم يوماً أو يتأخر يوماً برؤية الهلال في ${countryAr}.`,
    },
    {
      question: `كم عدد ساعات الصيام في رمضان ${gregYear} في ${cityAr}؟`,
      answer: `تتراوح ساعات الصيام في ${cityAr} خلال رمضان ${gregYear} حول ${sampleDay?.fastingHours || '—'} يومياً في منتصف الشهر. تتفاوت الأوقات من أول الشهر لآخره بحسب مسار الشمس.`,
    },
    {
      question: 'هل وقت السحور ووقت الفجر هو نفسه؟',
      answer: 'نعم. وقت السحور هو الوقت الفاصل قبل الفجر — بمجرد دخول وقت الفجر يجب الإمساك. لذلك تُقدّر بعض الإمساكيات الورقية وقت الإمساك بنحو 10–15 دقيقة قبل الفجر احتياطاً، لكن الصحيح الفقهي هو دخول وقت الفجر.',
    },
    {
      question: `كيف أتحقق من وقت الإفطار في ${cityAr} هذا الشهر؟`,
      answer: `وقت الإفطار في ${cityAr} هو وقت المغرب. راجع الجدول أعلاه ليوم صيامك للحصول على الوقت الدقيق.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const tableRows = days.map(d => ({
    '@type': 'ListItem',
    position: d.ramadanDay,
    name: `${d.ramadanDay} رمضان — سحور: ${d.suhoorAr} — إفطار: ${d.iftarAr}`,
  }));
  const itemListSchema = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: tableRows };

  return (
    <>
      <JsonLd data={[breadcrumbSchema, faqSchema, itemListSchema]} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20">
          {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
          <AdTopBanner slotId="imsakiya-city-top" />

          <nav aria-label="مسار التنقل" className="text-xs text-muted mb-6 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-accent transition-colors">الرئيسية</Link>
            <span aria-hidden="true">›</span>
            <Link href="/imsakiya" className="hover:text-accent transition-colors">إمساكية رمضان</Link>
            <span aria-hidden="true">›</span>
            <Link href={`/imsakiya/${countrySlug}`} className="hover:text-accent transition-colors">{countryAr}</Link>
            <span aria-hidden="true">›</span>
            <span className="text-secondary">{cityAr}</span>
          </nav>

          <section className="date-hero-panel date-hero-panel--single mb-10">
            <div className="date-hero-main">
              <p className="date-kicker m-0">
                <CountryFlag code={country.country_code} /> {countryAr}
              </p>
              <h1 className="date-hero-title">
                إمساكية رمضان {hijriYear} هـ / {gregYear} في {cityAr}
              </h1>
              <p className="date-hero-copy">
                جدول أوقات السحور والإفطار لكل يوم من أيام رمضان في {cityAr}، {countryAr}.
              </p>
              <p className="ims-caveat">
                <Calendar size={16} aria-hidden="true" />
                <span>
                  <strong>تنبيه:</strong> الأوقات محسوبة فلكياً وفق تقويم أم القرى. قد يتقدم أول رمضان يوماً أو يتأخر يوماً بحسب رؤية الهلال في {countryAr}.
                </span>
              </p>
            </div>
          </section>

          <section className="date-stat-grid mb-10" aria-label="ملخص رمضان في هذه المدينة">
            <div className="date-stat-item">
              <span className="date-stat-icon" aria-hidden="true"><Calendar size={18} /></span>
              <span className="date-stat-value">{ramadanStart.day} {GREGORIAN_MONTHS_AR[ramadanStart.month]}</span>
              <span className="date-stat-label">أول رمضان</span>
            </div>
            <div className="date-stat-item">
              <span className="date-stat-icon" aria-hidden="true"><CalendarDays size={18} /></span>
              <span className="date-stat-value">{dayCount} يوماً</span>
              <span className="date-stat-label">عدد أيام الشهر</span>
            </div>
            <div className="date-stat-item">
              <span className="date-stat-icon" aria-hidden="true"><Moon size={18} /></span>
              <span className="date-stat-value">{hijriYear} هـ</span>
              <span className="date-stat-label">السنة الهجرية</span>
            </div>
            {sampleDay && (
              <div className="date-stat-item">
                <span className="date-stat-icon" aria-hidden="true"><Flame size={18} /></span>
                <span className="date-stat-value">{sampleDay.fastingHours}</span>
                <span className="date-stat-label">متوسط ساعات الصيام</span>
              </div>
            )}
          </section>

          {/* Imsakiya Table */}
          <section className="date-section" aria-labelledby="imsakiya-table-heading">
            <h2 id="imsakiya-table-heading" className="date-section-title">
              جدول إمساكية رمضان {gregYear} — {cityAr}
            </h2>
            <div className="table-wrapper">
              <table className="table table--compact table--striped ims-table">
                <thead>
                  <tr>
                    <th>اليوم</th>
                    <th>التاريخ<span className="hidden sm:inline"> الميلادي</span></th>
                    <th>السحور<span className="hidden sm:inline"> (الفجر)</span></th>
                    <th>الإفطار<span className="hidden sm:inline"> (المغرب)</span></th>
                    <th className="hidden md:table-cell">ساعات الصيام</th>
                  </tr>
                </thead>
                <tbody>
                  {days.map((d) => {
                    const isLaylat = d.ramadanDay === 27;
                    return (
                      <tr key={d.ramadanDay} className={isLaylat ? 'ims-table__qadr-row' : undefined}>
                        <td className="font-bold">
                          {d.ramadanDay}
                          {isLaylat && (
                            <span className="ims-table__qadr-tag">
                              <Sparkles size={11} aria-hidden="true" /> ليلة القدر
                            </span>
                          )}
                        </td>
                        <td className="text-secondary">
                          <span className="hidden sm:inline">{d.weekdayAr} </span>
                          {d.gregDay} {GREGORIAN_MONTHS_AR[d.gregMonth]}
                        </td>
                        <td className="ims-table__suhoor">{d.suhoorAr}</td>
                        <td className="ims-table__iftar">{d.iftarAr}</td>
                        <td className="text-secondary hidden md:table-cell">{d.fastingHours}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Plain text — a heading and three sentences don't earn a bordered panel
              (DESIGN.md Law 4). */}
          <section className="date-section max-w-3xl" aria-labelledby="imsakiya-city-method-heading">
            <h2 id="imsakiya-city-method-heading" className="date-section-title">
              كيف تُحسب الإمساكية؟
            </h2>
            <p className="date-editorial-copy">
              <strong className="text-primary">وقت السحور = وقت الفجر:</strong> هو الوقت الذي يجب على الصائم الإمساك عنده. محسوب من موقع {cityAr} الجغرافي بدقة ({city.lat.toFixed(2)}° شمالاً، {city.lon.toFixed(2)}° شرقاً).
            </p>
            <p className="date-editorial-copy mt-3">
              <strong className="text-primary">وقت الإفطار = وقت المغرب:</strong> هو الوقت الذي يحل فيه الإفطار ببداية غروب الشمس. يختلف كل يوم بضع دقائق بحسب تحرك الشمس.
            </p>
            <p className="date-editorial-copy mt-3">
              <strong className="text-primary">طريقة الحساب:</strong> تعتمد الأوقات على المعادلات الفلكية المعتمدة في {countryAr}. قد تختلف دقيقة أو دقيقتين عن الإمساكية الرسمية المطبوعة بسبب اختلاف طريقة التقريب.
            </p>
          </section>

          <AdInArticle slotId="imsakiya-city-mid" />

          <section className="date-section max-w-3xl" aria-labelledby="imsakiya-city-faq-heading">
            <h2 id="imsakiya-city-faq-heading" className="date-section-title">
              أسئلة شائعة عن إمساكية رمضان {gregYear} في {cityAr}
            </h2>
            <SiteFaqAccordion items={faqItems} />
          </section>

          <AdMultiplex slotId="imsakiya-city-bottom" />

          <section className="date-section" aria-labelledby="imsakiya-city-related-heading">
            <SiteRelatedCardGrid
              heading="صفحات ذات صلة"
              headingId="imsakiya-city-related-heading"
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
                  href: `/imsakiya/${countrySlug}`,
                  label: `إمساكية مدن ${countryAr} الأخرى`,
                  Icon: Moon,
                },
              ]}
            />
          </section>
        </main>
      </AdLayoutWrapper>
    </>
  );
}

// Factory for the per-country/per-city "special prayer time" SEO pages
// (e.g. /mwaqit-al-salat/last-third-of-night/[country]/[city]). Each of the
// four solar fact types (see special-prayer-fact-types.js) gets a real,
// server-rendered, city-specific answer page instead of relying only on the
// single global topic page — this is what lets a query like
// "الثلث الأخير في الرياض" land on a page that's actually about Riyadh.
//
// Both createFactCountryPage() and createFactCityPage() return
// { generateStaticParams, generateMetadata, Page } — each factType's
// page.jsx file just imports its config and re-exports these three.
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import {
  getCityBySlug,
  getCitiesByCountry,
  getCapitalCity,
  getPriorityCityParams,
  getPriorityCountriesCityParams,
} from '@/lib/db/queries/cities';
import { getCountryBySlug, getPriorityCountrySlugs } from '@/lib/db/queries/countries';
import { getCachedNowIso } from '@/lib/date-utils';
import { isRouteSlug, isRenderableCityData, buildNoindexRouteMetadata } from '@/lib/route-param-validation';
import { GEO_ROUTE_INDEXING_POLICIES, isSeoIndexableCityParams, isSeoIndexableCountrySlug } from '@/lib/seo/country-indexing';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import SiteTrustPanel from '@/components/site/SiteTrustPanel';
import FAQAccordions from '@/components/mwaqit/FAQAccordions.client';
import SpecialPrayerFactCard from '@/components/mwaqit/SpecialPrayerFactCard';
import RouteUnavailableState from '@/components/shared/RouteUnavailableState';
import { JsonLd } from '@/components/seo/JsonLd';
import routeStyles from '@/app/mwaqit-al-salat/PrayerRoutePage.module.css';
import { getSiteUrl } from '@/lib/site-config';
import { logger, serializeError } from '@/lib/logger';

const BASE = getSiteUrl();

function toFaqItems(rawFaq) {
  return rawFaq.map((item) => ({ q: item.question, a: item.answer }));
}

// ─── City-level page: /mwaqit-al-salat/[factSlug]/[country]/[city] ──────────
export function createFactCityPage(config) {
  const { slug, factKey, factBuilder, topicLabelAr, metaPillAr, buildH1, buildTitle, buildDescription, buildIntro, buildWhyDiffers, buildFaq } = config;
  const topicHref = `/mwaqit-al-salat/${slug}`;

  async function generateStaticParams() {
    if (process.env.NODE_ENV === 'development') {
      return [{ country: 'saudi-arabia', city: 'riyadh' }];
    }
    const [globalParams, priorityCountryParams] = await Promise.all([
      getPriorityCityParams(12),
      getPriorityCountriesCityParams(6),
    ]);
    const seen = new Set();
    const merged = [];
    for (const p of [...globalParams, ...priorityCountryParams]) {
      const key = `${p.country}::${p.city}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(p);
      }
    }
    return merged;
  }

  async function generateMetadata({ params }) {
    const { country: countrySlug, city: citySlug } = await params;
    if (!isRouteSlug(countrySlug) || !isRouteSlug(citySlug)) {
      return buildNoindexRouteMetadata({
        title: `رابط مدينة غير صالح في ${topicLabelAr}`,
        description: 'هذا الرابط غير صالح أو يحتوي على جزء ديناميكي غير مكتمل، لذلك لا تتم فهرسته.',
        canonical: topicHref,
      });
    }

    try {
      const country = await getCountryBySlug(countrySlug);
      if (!country) return {};
      const cityData = await getCityBySlug(country.country_code, citySlug);
      if (!cityData || !isRenderableCityData(cityData)) return {};

      const cityNameAr = cityData.name_ar || cityData.name_en;
      const countryNameAr = country.name_ar || country.name_en;
      const nowIso = await getCachedNowIso();
      const facts = factBuilder({
        lat: cityData.lat,
        lon: cityData.lon,
        timezone: cityData.timezone,
        date: new Date(nowIso),
        countryCode: country.country_code,
        cacheKey: `meta::${slug}::${countrySlug}::${citySlug}`,
      });
      if (!facts) return {};

      const title = buildTitle(cityNameAr, facts);
      const description = buildDescription(cityNameAr, countryNameAr, facts);
      const canonical = `${BASE}/mwaqit-al-salat/${slug}/${countrySlug}/${citySlug}`;
      const policy = GEO_ROUTE_INDEXING_POLICIES.prayerTimes;
      const isIndexableCity = isSeoIndexableCityParams(
        { country: countrySlug, city: citySlug },
        { countryScope: policy.countryScope, cityScope: policy.cityScope },
      );

      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, type: 'website', locale: 'ar_SA', url: canonical },
        robots: {
          index: isIndexableCity,
          follow: true,
          googleBot: { index: isIndexableCity, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
        },
      };
    } catch (error) {
      logger.error(`${slug}-city-metadata-failed`, {
        routePath: `/mwaqit-al-salat/${slug}/${countrySlug}/${citySlug}`,
        countrySlug,
        citySlug,
        error: serializeError(error),
      });
      return {
        title: topicLabelAr,
        alternates: { canonical: `${BASE}/mwaqit-al-salat/${slug}/${countrySlug}/${citySlug}` },
      };
    }
  }

  async function Page({ params }) {
    const { country: countrySlug, city: citySlug } = await params;
    if (!isRouteSlug(countrySlug) || !isRouteSlug(citySlug)) notFound();

    let country;
    try {
      country = await getCountryBySlug(countrySlug);
    } catch (error) {
      logger.error(`${slug}-city-country-lookup-failed`, {
        routePath: `/mwaqit-al-salat/${slug}/${countrySlug}/${citySlug}`,
        countrySlug,
        citySlug,
        error: serializeError(error),
      });
      return (
        <RouteUnavailableState
          eyebrow="تعذر الوصول إلى بيانات المدينة الآن"
          title={`صفحة ${topicLabelAr} لهذه المدينة متوقفة مؤقتاً`}
          description="تعذر تحميل بيانات الدولة أو المدينة في هذه اللحظة، لذلك عرضنا لك بديلاً واضحاً بدلاً من ترك الصفحة تنهار بخطأ خادم."
          primaryLink={{ href: topicHref, label: `افتح صفحة ${topicLabelAr}`, description: 'ابدأ من الصفحة العامة ثم ابحث عن مدينة أخرى مباشرة.' }}
          secondaryLinks={[
            { href: '/mwaqit-al-salat', label: 'افتح قسم مواقيت الصلاة', description: 'ابدأ من القسم الرئيسي ثم ابحث عن مدينة أو دولة أخرى.' },
            { href: '/fahras', label: 'استكشف الصفحات', description: 'استخدم فهرس الصفحات للوصول إلى أقرب مسار مرتبط.' },
          ]}
        />
      );
    }
    if (!country) notFound();

    let cityData;
    try {
      cityData = await getCityBySlug(country.country_code, citySlug);
    } catch (error) {
      logger.error(`${slug}-city-page-data-failed`, {
        routePath: `/mwaqit-al-salat/${slug}/${countrySlug}/${citySlug}`,
        countrySlug,
        citySlug,
        error: serializeError(error),
      });
      return (
        <RouteUnavailableState
          eyebrow="تعذر تحميل المدينة المطلوبة الآن"
          title={`بيانات ${topicLabelAr} لهذه المدينة غير متاحة مؤقتاً`}
          description="الخلل حدث قبل اكتمال تحميل بيانات المدينة، لذلك أوقفنا الانهيار الكامل وتركنا لك مسارات عملية للرجوع."
          primaryLink={{ href: `/mwaqit-al-salat/${countrySlug}`, label: 'افتح صفحة الدولة', description: 'قد تتمكن من متابعة العاصمة والمدن الكبرى من صفحة الدولة الأساسية.' }}
          secondaryLinks={[
            { href: topicHref, label: `افتح صفحة ${topicLabelAr}`, description: 'ابدأ من الصفحة العامة ثم ابحث عن مدينة أخرى.' },
            { href: '/mwaqit-al-salat', label: 'افتح قسم مواقيت الصلاة', description: 'ابدأ من القسم الرئيسي.' },
          ]}
        />
      );
    }
    if (!cityData) notFound();
    if (!isRenderableCityData(cityData)) notFound();

    const nowIso = await getCachedNowIso();
    const facts = factBuilder({
      lat: cityData.lat,
      lon: cityData.lon,
      timezone: cityData.timezone,
      date: new Date(nowIso),
      countryCode: country.country_code,
      cacheKey: `${slug}::${countrySlug}::${citySlug}`,
    });
    if (!facts) notFound();

    const cityNameAr = cityData.name_ar || cityData.name_en;
    const countryNameAr = country.name_ar || country.name_en;
    const cityHref = `/mwaqit-al-salat/${countrySlug}/${citySlug}`;
    const faqItems = toFaqItems(buildFaq(cityNameAr, countryNameAr, facts));

    const siblingCitiesRaw = await getCitiesByCountry(country.country_code).catch(() => []);
    const siblingCities = Array.isArray(siblingCitiesRaw)
      ? siblingCitiesRaw.filter((c) => (c?.city_slug || c?.slug) !== citySlug).slice(0, 12)
      : [];

    const canonicalUrl = `${BASE}/mwaqit-al-salat/${slug}/${countrySlug}/${citySlug}`;
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: 'مواقيت الصلاة', item: `${BASE}/mwaqit-al-salat` },
        { '@type': 'ListItem', position: 3, name: topicLabelAr, item: `${BASE}${topicHref}` },
        { '@type': 'ListItem', position: 4, name: countryNameAr, item: `${BASE}/mwaqit-al-salat/${countrySlug}` },
        { '@type': 'ListItem', position: 5, name: `${topicLabelAr} في ${cityNameAr}`, item: canonicalUrl },
      ],
    };
    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: buildH1(cityNameAr),
      url: canonicalUrl,
      description: buildDescription(cityNameAr, countryNameAr, facts),
      inLanguage: 'ar',
      breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
    };
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    };

    return (
      <div className={`${routeStyles.prayerHubPage} min-h-screen bg-base text-primary`} dir="rtl" lang="ar">
        <JsonLd data={[breadcrumbSchema, webPageSchema, faqSchema]} />
        <AdLayoutWrapper layout="wide" sidebarMode="dual">
          <main className={routeStyles.pageMain}>
            {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
            <AdTopBanner slotId={`top-${slug}-${countrySlug}-${citySlug}`} />

            <nav aria-label="مسار التنقل" className={`container mx-auto px-4 ${routeStyles.breadcrumb}`}>
              <ol className={routeStyles.breadcrumbList}>
                {[
                  { href: '/', label: 'الرئيسية' },
                  { href: '/mwaqit-al-salat', label: 'مواقيت الصلاة' },
                  { href: topicHref, label: topicLabelAr },
                  { href: `/mwaqit-al-salat/${countrySlug}`, label: countryNameAr },
                ].map((item) => (
                  <li key={item.href} className={routeStyles.breadcrumbItem}>
                    <Link href={item.href} className={routeStyles.breadcrumbLink}>{item.label}</Link>
                    <ChevronLeft size={12} className={routeStyles.breadcrumbChevron} aria-hidden />
                  </li>
                ))}
                <li aria-current="page" className={routeStyles.breadcrumbCurrent}>{cityNameAr}</li>
              </ol>
            </nav>

            <section className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
              <div className={`${routeStyles.heroInner} ${routeStyles.heroCenter}`}>
                <div className={routeStyles.heroCopy}>
                  <div className={routeStyles.metaPill}>{metaPillAr}</div>
                  <h1 className={routeStyles.heroTitle}>{buildH1(cityNameAr)}</h1>
                  <p className={routeStyles.heroLead}>{buildIntro(cityNameAr)}</p>
                </div>

                <div className={routeStyles.searchWrap}>
                  <SpecialPrayerFactCard
                    factKey={factKey}
                    facts={facts}
                    cityNameAr={cityNameAr}
                    countryCode={country.country_code}
                    cityHref={cityHref}
                  />
                </div>
              </div>
            </section>

            <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
              <div className={routeStyles.sectionPanel}>
                <div className={routeStyles.proseBlock}>
                  <h2>لماذا يختلف {topicLabelAr} في {cityNameAr} عن مدينة أخرى؟</h2>
                  <p>{buildWhyDiffers(cityNameAr)}</p>
                </div>
              </div>
            </section>

            <section className="container mx-auto px-4">
              <AdInArticle slotId={`mid-${slug}-${countrySlug}-${citySlug}-1`} />
            </section>

            <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label={`أسئلة شائعة عن ${topicLabelAr} في ${cityNameAr}`}>
              <div className={routeStyles.sectionPanel}>
                <h2 className={`${routeStyles.sectionTitle} mb-6 text-center`}>أسئلة شائعة عن {topicLabelAr} في {cityNameAr}</h2>
                <FAQAccordions items={faqItems} />
              </div>
            </section>

            {siblingCities.length > 0 ? (
              <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
                <div className={routeStyles.sectionPanel}>
                  <div className={routeStyles.sectionHead}>
                    <h2 className={routeStyles.sectionTitle}>{topicLabelAr} في مدن {countryNameAr} الأخرى</h2>
                    <p className={routeStyles.sectionCopy}>
                      إذا كانت وجهتك مدينة أخرى داخل {countryNameAr}، انتقل إليها مباشرة من هنا.
                    </p>
                  </div>
                  <div className={routeStyles.compactCityGrid}>
                    {siblingCities.map((c) => {
                      const otherCitySlug = c.city_slug || c.slug;
                      const otherCityName = c.name_ar || c.name_en;
                      if (!otherCitySlug || !otherCityName) return null;
                      return (
                        <Link
                          key={otherCitySlug}
                          href={`/mwaqit-al-salat/${slug}/${countrySlug}/${otherCitySlug}`}
                          className={routeStyles.compactCityLink}
                        >
                          {otherCityName}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            ) : null}

            <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="مصادر">
              <div className={routeStyles.sectionPanel}>
                <div className={routeStyles.sectionHead}>
                  <p className={routeStyles.sectionCopy}>
                    الحساب مبني على إحداثيات {cityNameAr} بنفس محرك الحساب المستخدم في صفحات مواقيت الصلاة.
                    راجع <Link href={cityHref} className={routeStyles.contextLink}>مواقيت الصلاة الكاملة في {cityNameAr}</Link>{' '}
                    أو <Link href={topicHref} className={routeStyles.contextLink}>صفحة {topicLabelAr} العامة</Link> لمزيد من التفاصيل.
                  </p>
                </div>
              </div>
            </section>

            <section className="container mx-auto px-4 pb-20">
              <AdMultiplex slotId={`end-${slug}-${countrySlug}-${citySlug}`} />
            </section>

            <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
              <div className={routeStyles.sectionPanel}>
                <SiteTrustPanel panel="prayer" />
              </div>
            </section>
          </main>
        </AdLayoutWrapper>
      </div>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}

// ─── Country-level page: /mwaqit-al-salat/[factSlug]/[country] ──────────────
export function createFactCountryPage(config) {
  const { slug, factKey, factBuilder, topicLabelAr, metaPillAr, buildH1, buildTitle, buildDescription, buildIntro, buildFaq } = config;
  const topicHref = `/mwaqit-al-salat/${slug}`;

  async function generateStaticParams() {
    if (process.env.NODE_ENV === 'development') {
      return [{ country: 'saudi-arabia' }];
    }
    const slugs = await getPriorityCountrySlugs(15);
    return slugs.map((countrySlug) => ({ country: countrySlug }));
  }

  async function generateMetadata({ params }) {
    const { country: countrySlug } = await params;
    if (!isRouteSlug(countrySlug)) {
      return buildNoindexRouteMetadata({
        title: `رابط دولة غير صالح في ${topicLabelAr}`,
        description: 'هذا الرابط غير صالح أو يحتوي على جزء ديناميكي غير مكتمل، لذلك لا تتم فهرسته.',
        canonical: topicHref,
      });
    }

    try {
      const country = await getCountryBySlug(countrySlug);
      if (!country) return {};
      const capital = await getCapitalCity(country.country_code);
      if (!capital || !isRenderableCityData(capital)) return {};

      const countryNameAr = country.name_ar || country.name_en;
      const capitalNameAr = capital.name_ar || capital.name_en;
      const nowIso = await getCachedNowIso();
      const facts = factBuilder({
        lat: capital.lat,
        lon: capital.lon,
        timezone: capital.timezone,
        date: new Date(nowIso),
        countryCode: country.country_code,
        cacheKey: `meta::${slug}::${countrySlug}::capital`,
      });
      if (!facts) return {};

      const title = buildTitle(countryNameAr, facts).length <= 80
        ? buildTitle(countryNameAr, facts)
        : buildH1(countryNameAr);
      const description = buildDescription(countryNameAr, capitalNameAr, facts);
      const canonical = `${BASE}/mwaqit-al-salat/${slug}/${countrySlug}`;
      const policy = GEO_ROUTE_INDEXING_POLICIES.prayerTimes;
      const isIndexableCountry = isSeoIndexableCountrySlug(countrySlug, { scope: policy.countryScope });

      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, type: 'website', locale: 'ar_SA', url: canonical },
        robots: {
          index: isIndexableCountry,
          follow: true,
          googleBot: { index: isIndexableCountry, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
        },
      };
    } catch (error) {
      logger.error(`${slug}-country-metadata-failed`, {
        routePath: `/mwaqit-al-salat/${slug}/${countrySlug}`,
        countrySlug,
        error: serializeError(error),
      });
      return {
        title: topicLabelAr,
        alternates: { canonical: `${BASE}/mwaqit-al-salat/${slug}/${countrySlug}` },
      };
    }
  }

  async function Page({ params }) {
    const { country: countrySlug } = await params;
    if (!isRouteSlug(countrySlug)) notFound();

    let country;
    try {
      country = await getCountryBySlug(countrySlug);
    } catch (error) {
      logger.error(`${slug}-country-lookup-failed`, {
        routePath: `/mwaqit-al-salat/${slug}/${countrySlug}`,
        countrySlug,
        error: serializeError(error),
      });
      return (
        <RouteUnavailableState
          eyebrow="تعذر الوصول إلى بيانات الدولة الآن"
          title={`صفحة ${topicLabelAr} لهذه الدولة متوقفة مؤقتاً`}
          description="تعذر تحميل البيانات الأساسية لهذه الدولة في هذه اللحظة، لذلك أظهرنا لك مسارات بديلة واضحة."
          primaryLink={{ href: topicHref, label: `افتح صفحة ${topicLabelAr}`, description: 'ابدأ من الصفحة العامة ثم ابحث عن دولة أخرى.' }}
          secondaryLinks={[
            { href: '/mwaqit-al-salat', label: 'افتح قسم مواقيت الصلاة', description: 'انتقل إلى القسم الرئيسي.' },
            { href: '/fahras', label: 'استكشف الصفحات', description: 'استخدم فهرس الصفحات للوصول السريع.' },
          ]}
        />
      );
    }
    if (!country) notFound();

    const [citiesResult, capitalResult] = await Promise.allSettled([
      getCitiesByCountry(country.country_code),
      getCapitalCity(country.country_code),
    ]);
    const cities = citiesResult.status === 'fulfilled' && Array.isArray(citiesResult.value) ? citiesResult.value : [];
    const capital = capitalResult.status === 'fulfilled' ? capitalResult.value : null;

    if (!capital || !isRenderableCityData(capital)) {
      return (
        <RouteUnavailableState
          eyebrow="بيانات العاصمة غير متاحة"
          title={`صفحة ${topicLabelAr} لهذه الدولة غير مكتملة`}
          description="تعذر تحميل بيانات العاصمة المرجعية لهذه الدولة. اختر مدينتك مباشرة من القائمة."
          primaryLink={{ href: `/mwaqit-al-salat/${countrySlug}`, label: 'افتح صفحة الدولة', description: 'راجع قائمة المدن الكاملة من صفحة الدولة الأساسية.' }}
          secondaryLinks={[{ href: topicHref, label: `افتح صفحة ${topicLabelAr}`, description: 'ابدأ من الصفحة العامة.' }]}
        />
      );
    }

    const nowIso = await getCachedNowIso();
    const facts = factBuilder({
      lat: capital.lat,
      lon: capital.lon,
      timezone: capital.timezone,
      date: new Date(nowIso),
      countryCode: country.country_code,
      cacheKey: `${slug}::${countrySlug}::capital`,
    });
    if (!facts) notFound();

    const countryNameAr = country.name_ar || country.name_en;
    const capitalNameAr = capital.name_ar || capital.name_en;
    const capitalHref = `/mwaqit-al-salat/${countrySlug}/${capital.city_slug}`;
    const faqItems = toFaqItems(buildFaq(capitalNameAr, countryNameAr, facts));
    faqItems.push({
      q: `هل ${topicLabelAr} في ${capitalNameAr} ينطبق على كل مدن ${countryNameAr}؟`,
      a: `لا. هذه الصفحة تستخدم ${capitalNameAr} كمرجع سريع للدولة، لكن التوقيت الدقيق يختلف قليلاً من مدينة لأخرى داخل ${countryNameAr}. اختر مدينتك من القائمة أدناه لتوقيت مخصص لها.`,
    });

    const featuredCities = cities.filter((c) => (c?.city_slug || c?.slug) !== capital.city_slug).slice(0, 24);

    const canonicalUrl = `${BASE}/mwaqit-al-salat/${slug}/${countrySlug}`;
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: 'مواقيت الصلاة', item: `${BASE}/mwaqit-al-salat` },
        { '@type': 'ListItem', position: 3, name: topicLabelAr, item: `${BASE}${topicHref}` },
        { '@type': 'ListItem', position: 4, name: `${topicLabelAr} في ${countryNameAr}`, item: canonicalUrl },
      ],
    };
    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: buildH1(countryNameAr),
      url: canonicalUrl,
      description: buildDescription(countryNameAr, capitalNameAr, facts),
      inLanguage: 'ar',
      breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
    };
    const cityItemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${topicLabelAr} في مدن ${countryNameAr}`,
      itemListElement: featuredCities.slice(0, 24).map((cityItem, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: cityItem.name_ar || cityItem.name_en,
        url: `${BASE}/mwaqit-al-salat/${slug}/${countrySlug}/${cityItem.city_slug}`,
      })),
    };
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    };

    return (
      <div className={`${routeStyles.prayerHubPage} min-h-screen bg-base text-primary`} dir="rtl" lang="ar">
        <JsonLd data={[breadcrumbSchema, webPageSchema, cityItemListSchema, faqSchema]} />
        <AdLayoutWrapper layout="wide" sidebarMode="dual">
          <main className={routeStyles.pageMain}>
            {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
            <AdTopBanner slotId={`top-${slug}-${countrySlug}`} />

            <nav aria-label="مسار التنقل" className={`container mx-auto px-4 ${routeStyles.breadcrumb}`}>
              <ol className={routeStyles.breadcrumbList}>
                {[
                  { href: '/', label: 'الرئيسية' },
                  { href: '/mwaqit-al-salat', label: 'مواقيت الصلاة' },
                  { href: topicHref, label: topicLabelAr },
                ].map((item) => (
                  <li key={item.href} className={routeStyles.breadcrumbItem}>
                    <Link href={item.href} className={routeStyles.breadcrumbLink}>{item.label}</Link>
                    <ChevronLeft size={12} className={routeStyles.breadcrumbChevron} aria-hidden />
                  </li>
                ))}
                <li aria-current="page" className={routeStyles.breadcrumbCurrent}>{countryNameAr}</li>
              </ol>
            </nav>

            <section className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
              <div className={`${routeStyles.heroInner} ${routeStyles.heroCenter}`}>
                <div className={routeStyles.heroCopy}>
                  <div className={routeStyles.metaPill}>{metaPillAr}</div>
                  <h1 className={routeStyles.heroTitle}>{buildH1(countryNameAr)}</h1>
                  <p className={routeStyles.heroLead}>{buildIntro(capitalNameAr)}</p>
                </div>

                <div className={routeStyles.searchWrap}>
                  <SpecialPrayerFactCard
                    factKey={factKey}
                    facts={facts}
                    cityNameAr={capitalNameAr}
                    countryCode={country.country_code}
                    cityHref={capitalHref}
                  />
                </div>
              </div>
            </section>

            <section className="container mx-auto px-4">
              <AdInArticle slotId={`mid-${slug}-${countrySlug}-1`} />
            </section>

            {featuredCities.length > 0 ? (
              <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
                <div className={routeStyles.sectionPanel}>
                  <div className={routeStyles.sectionHead}>
                    <h2 className={routeStyles.sectionTitle}>{topicLabelAr} في مدن {countryNameAr}</h2>
                    <p className={routeStyles.sectionCopy}>
                      العاصمة {capitalNameAr} نقطة مرجعية سريعة، لكن التوقيت الدقيق يختلف باختلاف المدينة. اختر مدينتك من هنا.
                    </p>
                  </div>
                  <div className={routeStyles.compactCityGrid}>
                    {featuredCities.map((c) => {
                      const otherCitySlug = c.city_slug || c.slug;
                      const otherCityName = c.name_ar || c.name_en;
                      if (!otherCitySlug || !otherCityName) return null;
                      return (
                        <Link
                          key={otherCitySlug}
                          href={`/mwaqit-al-salat/${slug}/${countrySlug}/${otherCitySlug}`}
                          className={routeStyles.compactCityLink}
                        >
                          {otherCityName}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            ) : null}

            <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label={`أسئلة شائعة عن ${topicLabelAr} في ${countryNameAr}`}>
              <div className={routeStyles.sectionPanel}>
                <h2 className={`${routeStyles.sectionTitle} mb-6 text-center`}>أسئلة شائعة عن {topicLabelAr} في {countryNameAr}</h2>
                <FAQAccordions items={faqItems} />
              </div>
            </section>

            <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="مصادر">
              <div className={routeStyles.sectionPanel}>
                <div className={routeStyles.sectionHead}>
                  <p className={routeStyles.sectionCopy}>
                    الحساب مبني على إحداثيات {capitalNameAr} كمرجع للدولة، بنفس محرك الحساب المستخدم في كل صفحات مواقيت الصلاة.
                    راجع <Link href={topicHref} className={routeStyles.contextLink}>صفحة {topicLabelAr} العامة</Link> لمزيد من التفاصيل.
                  </p>
                </div>
              </div>
            </section>

            <section className="container mx-auto px-4 pb-20">
              <AdMultiplex slotId={`end-${slug}-${countrySlug}`} />
            </section>

            <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
              <div className={routeStyles.sectionPanel}>
                <SiteTrustPanel panel="prayer" />
              </div>
            </section>
          </main>
        </AdLayoutWrapper>
      </div>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}

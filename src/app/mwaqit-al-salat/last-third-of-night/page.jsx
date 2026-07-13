// app/mwaqit-al-salat/last-third-of-night/page.jsx
import Link from 'next/link';
import { Suspense } from 'react';
import { Moon, Clock, Info } from 'lucide-react';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import FAQAccordions from '@/components/mwaqit/FAQAccordions.client';
import SearchCityWrapper from '@/components/SearchCityWrapper.client';
import SiteTrustPanel from '@/components/site/SiteTrustPanel';
import { JsonLd } from '@/components/seo/JsonLd';
import routeStyles from '@/app/mwaqit-al-salat/PrayerRoutePage.module.css';
import { getSiteUrl } from '@/lib/site-config';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getCachedNowIso } from '@/lib/date-utils';
import { getCityBySlug } from '@/lib/db/queries/cities';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import { getLastThirdOfNightFacts } from '@/lib/night-prayer-facts';
import { getPopularPrayerCityLinks } from '@/lib/seo/popular-links';

const BASE = getSiteUrl();
const PAGE_URL = `${BASE}/mwaqit-al-salat/last-third-of-night`;

export const metadata = buildCanonicalMetadata({
  title: 'متى الثلث الأخير من الليل؟ | حساب دقيق حسب مدينتك',
  description:
    'احسب وقت الثلث الأخير من الليل ومنتصف الليل الشرعي في مدينتك الآن، من المغرب إلى الفجر مباشرة. اعرف أفضل وقت للتهجد والدعاء الليلي بدقة الدقيقة.',
  keywords: [
    'الثلث الأخير من الليل',
    'متى الثلث الأخير من الليل',
    'حساب الثلث الأخير من الليل',
    'منتصف الليل الشرعي',
    'وقت التهجد',
    'أفضل وقت للدعاء في الليل',
    'الثلث الأخير من الليل بالرياض',
    'كيف احسب الثلث الأخير من الليل',
  ],
  url: PAGE_URL,
});

const FAQS = [
  {
    q: 'كيف يُحسب الثلث الأخير من الليل؟',
    node: (
      <div className="space-y-2 text-secondary">
        <p>
          الليل في الفقه الإسلامي هو الفترة من أذان المغرب إلى أذان الفجر، وليس من منتصف الليل
          المدني (الساعة 12) إلى الفجر كما يظن كثيرون.
        </p>
        <p>
          تُقسَّم هذه الفترة إلى ثلاثة أقسام متساوية، ويبدأ <strong className="text-primary">الثلث الأخير</strong>{' '}
          عند نهاية الثلثين الأولين، ويستمر حتى أذان الفجر مباشرة.
        </p>
      </div>
    ),
  },
  {
    q: 'ما الفرق بين الثلث الأخير من الليل ومنتصف الليل الشرعي؟',
    a: 'منتصف الليل الشرعي هو نقطة المنتصف تماماً بين المغرب والفجر، ويُعتمد عند بعض العلماء كنهاية لوقت العشاء المفضل. الثلث الأخير يبدأ بعد ذلك، عند تمام ثلثي الليل، وهو الوقت المخصوص بفضل التهجد والدعاء.',
  },
  {
    q: 'لماذا يختلف وقت الثلث الأخير من الليل كل يوم؟',
    a: 'لأنه يعتمد على وقتي المغرب والفجر، وكلاهما يتغيران يومياً مع حركة الشمس وفصل السنة. في الصيف تكون الليالي أقصر فيبدأ الثلث الأخير متأخراً نسبياً، وفي الشتاء تطول الليالي فيبدأ أبكر.',
  },
  {
    q: 'ما فضل قيام الثلث الأخير من الليل؟',
    a: 'ورد في الحديث الصحيح أن الله تعالى ينزل في هذا الوقت نزولاً يليق بجلاله، ويقبل دعاء الداعين واستغفار المستغفرين. لهذا يحرص كثير من المسلمين على الاستيقاظ فيه للصلاة والدعاء قبل آذان الفجر مباشرة.',
  },
  {
    q: 'هل يمكنني معرفة وقت الثلث الأخير من الليل في مدينتي؟',
    a: 'نعم، ابحث عن اسم مدينتك في الأعلى وستنتقل إلى صفحة مواقيت الصلاة الخاصة بها، وستجد فيها الثلث الأخير ومنتصف الليل الشرعي محسوبين تلقائياً من إحداثيات مدينتك ووقتي المغرب والفجر الفعليين.',
  },
  {
    q: 'هل يمكن الصلاة أو الدعاء طوال الثلث الأخير أم في لحظة محددة؟',
    a: 'الثلث الأخير من الليل نافذة زمنية كاملة تمتد من بدايته حتى أذان الفجر، وليس لحظة واحدة. يمكنك التهجد أو الدعاء أو الاستغفار في أي وقت ضمن هذه النافذة.',
  },
  {
    q: 'ماذا لو استيقظت بعد أذان الفجر؟',
    a: 'ينتهي الثلث الأخير من الليل بدخول وقت الفجر، فإذا استيقظت بعده يفوتك وقت التهجد المخصوص، لكن يبقى لك أجر صلاة الفجر وأذكار الصباح. حاول ضبط المنبه قبل وقت الفجر بساعة تقريباً لإدراك جزء من الثلث الأخير.',
  },
];

async function LastThirdReferenceCity() {
  const [country, nowIso] = await Promise.all([
    getCountryBySlug('saudi-arabia'),
    getCachedNowIso(),
  ]);
  if (!country) return null;

  const city = await getCityBySlug(country.country_code, 'riyadh');
  if (!city) return null;

  const now = new Date(nowIso);
  const facts = getLastThirdOfNightFacts({
    lat: city.lat,
    lon: city.lon,
    timezone: city.timezone,
    date: now,
    countryCode: country.country_code,
    cacheKey: 'saudi-arabia::riyadh::night-pillar',
  });

  if (!facts) return null;

  const cityNameAr = city.name_ar || city.name_en;

  return (
    <section className={routeStyles.sectionPanel} aria-label={`مثال حي: الثلث الأخير من الليل في ${cityNameAr}`}>
      <div className={routeStyles.sectionHead}>
        <h2 className={routeStyles.sectionTitle}>مثال حي الآن: {cityNameAr}</h2>
        <p className={routeStyles.sectionCopy}>
          هذا مثال مباشر بمدينة {cityNameAr} ليوضح لك طريقة الحساب. ابحث عن مدينتك في الأعلى
          للحصول على توقيتك الدقيق أنت.
        </p>
      </div>
      <div className={routeStyles.contextGrid}>
        <article className={routeStyles.contextCard}>
          <h3 className={routeStyles.contextTitle}>الثلث الأخير من الليل</h3>
          <p className={routeStyles.contextBody}>
            يبدأ عند <strong>{facts.lastThirdStartLabel}</strong> ويمتد حتى أذان الفجر عند{' '}
            <strong>{facts.fajrLabel}</strong>. مدة الليل الكاملة (من المغرب إلى الفجر){' '}
            {facts.nightDurationLabel}.
          </p>
        </article>
        <article className={routeStyles.contextCard}>
          <h3 className={routeStyles.contextTitle}>منتصف الليل الشرعي</h3>
          <p className={routeStyles.contextBody}>
            نقطة المنتصف بين المغرب (<strong>{facts.maghribLabel}</strong>) والفجر عند{' '}
            <strong>{facts.islamicMidnightLabel}</strong>.
          </p>
        </article>
      </div>
      <Link href={`/mwaqit-al-salat/${country.country_slug}/riyadh`} className={routeStyles.contextLink}>
        مواقيت الصلاة الكاملة في {cityNameAr} ←
      </Link>
    </section>
  );
}

async function PopularCitiesForNight() {
  const links = await getPopularPrayerCityLinks(24);
  const safeLinks = Array.isArray(links) ? links.filter((item) => item?.href && item?.label) : [];
  if (safeLinks.length === 0) return null;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'الثلث الأخير من الليل حسب المدينة',
    itemListElement: safeLinks.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label.replace('مواقيت الصلاة في', 'الثلث الأخير من الليل في'),
      url: `${BASE}${item.href}`,
    })),
  };

  return (
    <section className={routeStyles.sectionPanel} aria-label="الثلث الأخير من الليل حسب المدينة">
      <JsonLd data={itemListSchema} />
      <div className={routeStyles.sectionHead}>
        <h2 className={routeStyles.sectionTitle}>اختر مدينتك</h2>
        <p className={routeStyles.sectionCopy}>
          كل صفحة مدينة تعرض الثلث الأخير من الليل ومنتصف الليل الشرعي محسوبَين لحظياً من إحداثياتها.
        </p>
      </div>
      <div className={routeStyles.compactCityGrid}>
        {safeLinks.map((item) => (
          <Link key={item.href} href={item.href} className={routeStyles.compactCityLink} title={item.description}>
            {item.label.replace('مواقيت الصلاة في', '')}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function LastThirdOfNightPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: typeof f.a === 'string' ? f.a : 'انظر الصفحة للتفاصيل.' },
    })),
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'متى الثلث الأخير من الليل؟',
    url: PAGE_URL,
    description: 'حساب حي للثلث الأخير من الليل ومنتصف الليل الشرعي حسب مدينتك، من المغرب إلى الفجر.',
    inLanguage: 'ar',
  };

  return (
    <div className={`${routeStyles.prayerHubPage} min-h-screen bg-base text-primary`} dir="rtl" lang="ar">
      <AdLayoutWrapper layout="wide" sidebarMode="dual">
        <main className={routeStyles.pageMain}>
          <JsonLd data={webPageSchema} />
          <JsonLd data={faqSchema} />

          <section className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
            <div className={`${routeStyles.heroInner} ${routeStyles.heroCenter}`}>
              <div className={routeStyles.heroCopy}>
                <div className={routeStyles.metaPill}>
                  <Moon size={13} />
                  الثلث الأخير من الليل الآن
                </div>
                <h1 className={routeStyles.heroTitle}>متى الثلث الأخير من الليل؟</h1>
                <p className={routeStyles.heroLead}>
                  إذا كان سؤالك المباشر: يبدأ الثلث الأخير من الليل عند تمام ثلثي الفترة بين
                  أذان المغرب وأذان الفجر، ويمتد حتى دخول الفجر مباشرة. الوقت الدقيق يختلف
                  يومياً وحسب مدينتك — ابحث عن مدينتك بالأسفل لتوقيتك الآن.
                </p>
              </div>
              <div className={routeStyles.searchWrap}>
                <div className={`${routeStyles.sectionPanel} ${routeStyles.heroSearchPanel}`} aria-labelledby="night-search-title">
                  <div className={routeStyles.searchPanelHeader}>
                    <span className={routeStyles.searchPanelKicker}>احسب توقيتك</span>
                    <h2 id="night-search-title" className={routeStyles.searchPanelTitle}>ابحث عن مدينتك</h2>
                  </div>
                  <div className={routeStyles.searchCommandShell}>
                    <SearchCityWrapper mode="prayer" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 pb-2">
            <AdTopBanner slotId="top-last-third-night" />
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <Suspense fallback={null}>
              <LastThirdReferenceCity />
            </Suspense>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.proseBlock}>
                <h2>لماذا يُحسب الليل من المغرب لا من منتصف الليل المدني؟</h2>
                <p>
                  الليل في الشرع يبدأ بغروب الشمس (المغرب) وينتهي بطلوع الفجر، وهذا هو التعريف الذي
                  اعتمده الفقهاء عند تقسيم الليل إلى أثلاث. لهذا فإن الساعة 12 منتصف الليل المدني
                  ليست بالضرورة منتصف الليل الشرعي — فمنتصف الليل الشرعي يتحرك يومياً بحسب طول
                  النهار والليل في كل فصل ومدينة.
                </p>
                <div className={`${routeStyles.contextGrid} ${routeStyles.decisionList}`}>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>الخطوة 1</h3>
                    <p className={routeStyles.contextBody}>احسب مدة الليل كاملة: من أذان المغرب إلى أذان الفجر التالي.</p>
                  </article>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>الخطوة 2</h3>
                    <p className={routeStyles.contextBody}>قسّم هذه المدة على ثلاثة أجزاء متساوية.</p>
                  </article>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>الخطوة 3</h3>
                    <p className={routeStyles.contextBody}>يبدأ الثلث الأخير عند نهاية الجزأين الأولين، ويمتد حتى الفجر.</p>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4">
            <AdInArticle slotId="mid-last-third-night-1" />
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <Suspense fallback={null}>
              <PopularCitiesForNight />
            </Suspense>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="أسئلة شائعة عن الثلث الأخير من الليل">
            <div className={routeStyles.sectionPanel}>
              <h2 className={`${routeStyles.sectionTitle} mb-6 text-center`}>أسئلة شائعة عن الثلث الأخير من الليل</h2>
              <FAQAccordions items={FAQS} />
            </div>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="مصادر">
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.sectionHead}>
                <span className={routeStyles.metaPill}><Info size={13} />ملاحظة منهجية</span>
                <p className={routeStyles.sectionCopy}>
                  الحساب مبني على وقتي المغرب والفجر الفلكيين لمدينتك بنفس محرك الحساب المستخدم في
                  صفحات مواقيت الصلاة، وهو تقسيم حسابي متفق عليه بين العلماء لتحديد الثلث الأخير،
                  وليس فتوى محلية ملزمة. راجع مسجدك إن وُجد جدول محلي معتمد.
                </p>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 pb-20">
            <AdMultiplex slotId="end-last-third-night" />
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

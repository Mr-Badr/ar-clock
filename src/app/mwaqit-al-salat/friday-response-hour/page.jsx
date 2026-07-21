// app/mwaqit-al-salat/friday-response-hour/page.jsx
import Link from 'next/link';
import { Suspense } from 'react';
import { Clock, Info } from 'lucide-react';
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
import { getFridayResponseHourFacts } from '@/lib/night-prayer-facts';
import { getPopularPrayerCityLinks } from '@/lib/seo/popular-links';

const BASE = getSiteUrl();
const PAGE_URL = `${BASE}/mwaqit-al-salat/friday-response-hour`;

export const metadata = buildCanonicalMetadata({
  title: 'متى ساعة الاستجابة يوم الجمعة؟ | آخر ساعة قبل المغرب',
  description:
    'احسب موعد ساعة الاستجابة يوم الجمعة في مدينتك: آخر ساعة قبل أذان المغرب على الرأي الراجح. حي كل جمعة، وعداد تنازلي بقية أيام الأسبوع.',
  keywords: [
    'ساعة الاستجابة يوم الجمعة',
    'متى ساعة الاستجابة',
    'آخر ساعة يوم الجمعة',
    'ساعة الاستجابة قبل المغرب',
    'دعاء ساعة الاستجابة',
    'ساعة الاستجابة بالرياض',
  ],
  url: PAGE_URL,
});

const FAQS = [
  {
    q: 'متى تبدأ ساعة الاستجابة يوم الجمعة؟',
    node: (
      <div className="space-y-2 text-secondary">
        <p>
          للعلماء فيها قولان مشهوران: الأول أنها آخر ساعة بعد صلاة العصر إلى غروب الشمس (أذان
          المغرب)، وهو ما رجّحه الإمام أحمد وجمع من العلماء. الثاني أنها من جلوس الإمام على المنبر
          يوم الجمعة إلى انتهاء الصلاة.
        </p>
        <p>
          هذه الصفحة تحسب <strong className="text-primary">الرأي الأول القابل للحساب الفلكي</strong>:
          الساعة الأخيرة قبل أذان المغرب مباشرة.
        </p>
      </div>
    ),
  },
  {
    q: 'لماذا اخترتم رأي "آخر ساعة قبل المغرب" تحديداً؟',
    a: 'لأنه الرأي الوحيد من القولين القابل للحساب الفلكي الدقيق (مغرب اليوم ناقص ساعة واحدة). أما رأي "من جلوس الإمام إلى نهاية الصلاة" فيعتمد على توقيت خطبة كل مسجد وليس له حساب فلكي موحّد، فنذكره كمعلومة دون حساب.',
  },
  {
    q: 'هل ساعة الاستجابة نشطة كل يوم أم يوم الجمعة فقط؟',
    a: 'يوم الجمعة فقط. في بقية أيام الأسبوع تعرض الصفحة عداداً تنازلياً حتى بداية الساعة في الجمعة القادمة، وتتحول تلقائياً إلى وضع "جارية الآن" أثناء الساعة الأخيرة قبل المغرب من كل جمعة.',
  },
  {
    q: 'ما الدعاء المستحب في ساعة الاستجابة؟',
    a: 'لم يرد دعاء معين مخصوص بهذه الساعة، بل يُستحب الإكثار من الدعاء بخير الدنيا والآخرة، والاستغفار، والصلاة على النبي ﷺ، لأن الفضل في الساعة نفسها لا في صيغة معينة.',
  },
  {
    q: 'هل يمكن معرفة ساعة الاستجابة في مدينتي؟',
    a: 'نعم، ابحث عن اسم مدينتك في الأعلى وستنتقل إلى صفحة مواقيتها، وستجد فيها موعد بداية الساعة الأخيرة قبل المغرب محسوباً تلقائياً من إحداثيات مدينتك.',
  },
  {
    q: 'ماذا لو فاتتني الساعة الأخيرة قبل المغرب؟',
    a: 'يبقى للجمعة كلها فضل عظيم بالدعاء والذكر وقراءة سورة الكهف، وتتكرر ساعة الاستجابة كل أسبوع، فاضبط تذكيراً قبل أذان المغرب بساعة في الجمعة القادمة.',
  },
];

async function FridayReferenceCity() {
  const [country, nowIso] = await Promise.all([
    getCountryBySlug('saudi-arabia'),
    getCachedNowIso(),
  ]);
  if (!country) return null;

  const city = await getCityBySlug(country.country_code, 'riyadh');
  if (!city) return null;

  const now = new Date(nowIso);
  const facts = getFridayResponseHourFacts({
    lat: city.lat,
    lon: city.lon,
    timezone: city.timezone,
    date: now,
    countryCode: country.country_code,
    cacheKey: 'saudi-arabia::riyadh::friday-pillar',
  });

  if (!facts) return null;

  const cityNameAr = city.name_ar || city.name_en;

  return (
    <section className={routeStyles.sectionPanel} aria-label={`مثال حي: ساعة الاستجابة في ${cityNameAr}`}>
      <div className={routeStyles.sectionHead}>
        <h2 className={routeStyles.sectionTitle}>مثال حي الآن: {cityNameAr}</h2>
        <p className={routeStyles.sectionCopy}>
          هذا مثال مباشر بمدينة {cityNameAr}. ابحث عن مدينتك في الأعلى للحصول على توقيتك الدقيق أنت.
        </p>
      </div>
      <div className={routeStyles.contextGrid}>
        <article className={routeStyles.contextCard}>
          <h3 className={routeStyles.contextTitle}>
            {facts.isLiveNow ? 'الساعة جارية الآن' : facts.isFridayToday ? 'اليوم جمعة' : 'الجمعة القادمة'}
          </h3>
          <p className={routeStyles.contextBody}>
            تبدأ الساعة الأخيرة عند <strong>{facts.responseHourStartLabel}</strong> وتنتهي بأذان
            المغرب عند <strong>{facts.fridayMaghribLabel}</strong>.
          </p>
        </article>
      </div>
      <Link href={`/mwaqit-al-salat/${country.country_slug}/riyadh`} className={routeStyles.contextLink}>
        مواقيت الصلاة الكاملة في {cityNameAr} ←
      </Link>
    </section>
  );
}

async function PopularCitiesForFriday() {
  const links = await getPopularPrayerCityLinks(24);
  const safeLinks = Array.isArray(links) ? links.filter((item) => item?.href && item?.label) : [];
  if (safeLinks.length === 0) return null;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ساعة الاستجابة يوم الجمعة حسب المدينة',
    itemListElement: safeLinks.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label.replace('مواقيت الصلاة في', 'ساعة الاستجابة في'),
      url: `${BASE}${item.href}`,
    })),
  };

  return (
    <section className={routeStyles.sectionPanel} aria-label="ساعة الاستجابة حسب المدينة">
      <JsonLd data={itemListSchema} />
      <div className={routeStyles.sectionHead}>
        <h2 className={routeStyles.sectionTitle}>اختر مدينتك</h2>
        <p className={routeStyles.sectionCopy}>
          كل صفحة مدينة تعرض موعد ساعة الاستجابة القادمة محسوباً لحظياً من إحداثياتها.
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

export default async function FridayResponseHourPage() {
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
    name: 'متى ساعة الاستجابة يوم الجمعة؟',
    url: PAGE_URL,
    description: 'حساب حي لساعة الاستجابة يوم الجمعة حسب مدينتك — آخر ساعة قبل المغرب على الرأي الراجح.',
    inLanguage: 'ar',
  };

  return (
    <div className={`${routeStyles.prayerHubPage} min-h-screen bg-base text-primary`} dir="rtl" lang="ar">
      <AdLayoutWrapper layout="wide" sidebarMode="dual">
        <main className={routeStyles.pageMain}>
          <JsonLd data={webPageSchema} />
          <JsonLd data={faqSchema} />

          {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
          <AdTopBanner slotId="top-friday-response" />

          <section className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
            <div className={`${routeStyles.heroInner} ${routeStyles.heroCenter}`}>
              <div className={routeStyles.heroCopy}>
                <div className={routeStyles.metaPill}>
                  <Clock size={13} />
                  ساعة الاستجابة كل جمعة
                </div>
                <h1 className={routeStyles.heroTitle}>متى ساعة الاستجابة يوم الجمعة؟</h1>
                <p className={routeStyles.heroLead}>
                  إذا كان سؤالك المباشر: على الرأي الراجح، تبدأ ساعة الاستجابة آخر ساعة قبل أذان
                  المغرب يوم الجمعة وتنتهي معه. الوقت الدقيق يختلف حسب مدينتك — ابحث عن مدينتك
                  بالأسفل لتوقيتك الآن.
                </p>
              </div>
              <div className={routeStyles.searchWrap}>
                <div className={`${routeStyles.sectionPanel} ${routeStyles.heroSearchPanel}`} aria-labelledby="friday-search-title">
                  <div className={routeStyles.searchPanelHeader}>
                    <span className={routeStyles.searchPanelKicker}>احسب توقيتك</span>
                    <h2 id="friday-search-title" className={routeStyles.searchPanelTitle}>ابحث عن مدينتك</h2>
                  </div>
                  <div className={routeStyles.searchCommandShell}>
                    <SearchCityWrapper mode="prayer" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <Suspense fallback={null}>
              <FridayReferenceCity />
            </Suspense>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.proseBlock}>
                <h2>القولان في تحديد ساعة الاستجابة</h2>
                <p>
                  اختلف العلماء في تحديد ساعة الاستجابة يوم الجمعة على قولين مشهورين. هذه الصفحة
                  تحسب القول الأول فلكياً لأنه مبني على وقت ثابت قابل للحساب، وتذكر القول الثاني
                  كمعلومة تكميلية.
                </p>
                <div className={`${routeStyles.contextGrid} ${routeStyles.decisionList}`}>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>القول الأول (محسوب هنا)</h3>
                    <p className={routeStyles.contextBody}>آخر ساعة قبل أذان المغرب يوم الجمعة — رأي الإمام أحمد وجمع من العلماء.</p>
                  </article>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>القول الثاني (وصفي فقط)</h3>
                    <p className={routeStyles.contextBody}>من جلوس الإمام على المنبر إلى انتهاء الصلاة، ويعتمد على توقيت كل مسجد.</p>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4">
            <AdInArticle slotId="mid-friday-response-1" />
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <Suspense fallback={null}>
              <PopularCitiesForFriday />
            </Suspense>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="أسئلة شائعة عن ساعة الاستجابة">
            <div className={routeStyles.sectionPanel}>
              <h2 className={`${routeStyles.sectionTitle} mb-6 text-center`}>أسئلة شائعة عن ساعة الاستجابة</h2>
              <FAQAccordions items={FAQS} />
            </div>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="مصادر">
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.sectionHead}>
                <span className={routeStyles.metaPill}><Info size={13} />ملاحظة منهجية</span>
                <p className={routeStyles.sectionCopy}>
                  الحساب مبني على وقت المغرب الفلكي لمدينتك بنفس محرك الحساب المستخدم في صفحات
                  مواقيت الصلاة. هذا تقدير حسابي لأحد القولين الفقهيين، وليس فتوى ملزمة.
                </p>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 pb-20">
            <AdMultiplex slotId="end-friday-response" />
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

// app/mwaqit-al-salat/duha-prayer-time/page.jsx
import Link from 'next/link';
import { Suspense } from 'react';
import { Sun, Info } from 'lucide-react';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import FAQAccordions from '@/components/mwaqit/FAQAccordions.client';
import SearchCityWrapper from '@/components/SearchCityWrapper.client';
import DuhaAutoCard from '@/components/mwaqit/DuhaAutoCard.client';
import SiteTrustPanel from '@/components/site/SiteTrustPanel';
import { JsonLd } from '@/components/seo/JsonLd';
import routeStyles from '@/app/mwaqit-al-salat/PrayerRoutePage.module.css';
import { getSiteUrl } from '@/lib/site-config';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getPopularPrayerCityLinks } from '@/lib/seo/popular-links';

const BASE = getSiteUrl();
const PAGE_URL = `${BASE}/mwaqit-al-salat/duha-prayer-time`;

export const metadata = buildCanonicalMetadata({
  title: 'متى وقت صلاة الضحى؟ | البداية والنهاية حسب مدينتك',
  description:
    'احسب وقت صلاة الضحى الآن في مدينتك: يبدأ بعد ارتفاع الشمس عن الشروق وينتهي قبل دخول الظهر. اعرف أفضل وقت لأدائها بدقة الدقيقة.',
  keywords: [
    'وقت صلاة الضحى',
    'متى وقت صلاة الضحى',
    'متى ينتهي وقت الضحى',
    'أفضل وقت لصلاة الضحى',
    'حساب وقت الضحى',
    'صلاة الضحى بالرياض',
    'كم ركعة صلاة الضحى',
  ],
  url: PAGE_URL,
});

const FAQS = [
  {
    q: 'متى يبدأ وقت صلاة الضحى؟',
    a: 'يبدأ وقت صلاة الضحى بعد ارتفاع الشمس قيد رمح عن الأفق، أي بعد الشروق بنحو 15 دقيقة تقريباً، وهو الوقت الذي ينتهي فيه وقت الكراهة لأداء النافلة بعد شروق الشمس مباشرة.',
  },
  {
    q: 'متى ينتهي وقت صلاة الضحى؟',
    a: 'ينتهي وقت الضحى قبيل دخول وقت الظهر بنحو 10 دقائق، أي عند اقتراب الشمس من كبد السماء (وقت الاستواء)، وهو وقت يُكره فيه التنفل أيضاً.',
  },
  {
    q: 'ما هو أفضل وقت لصلاة الضحى؟',
    a: 'أفضل وقت لصلاة الضحى هو آخر وقتها، أي قرب نهاية النافذة قبل الظهر مباشرة، وهو ما يُعرف بوقت "صلاة الأوابين" حين ترمض الفصال (تشتد حرارة الشمس على صغار الإبل)، وهذا هو الوارد في السنة عن وقتها الأفضل.',
  },
  {
    q: 'كم ركعة صلاة الضحى؟',
    a: 'أقلها ركعتان، وأكثرها ثمان ركعات أو أكثر عند بعض العلماء، وكل ركعتين بتسليمة. لا حد أقصى ملزم، فمن صلى ركعتين أدرك السنة.',
  },
  {
    q: 'هل يمكن قضاء صلاة الضحى بعد خروج وقتها؟',
    a: 'صلاة الضحى نافلة مرتبطة بوقتها بين الشروق والظهر، فإذا خرج وقتها فاتت، ولا تُقضى بعد دخول الظهر. يمكنك تعويض أجرها بنوافل أخرى في يومك.',
  },
  {
    q: 'هل يختلف وقت الضحى حسب المدينة؟',
    a: 'نعم، لأنه يعتمد على وقتي الشروق والظهر في مدينتك تحديداً، وكلاهما يتغيران يومياً. ابحث عن مدينتك في الأعلى لمعرفة وقتك الدقيق اليوم.',
  },
];

async function PopularCitiesForDuha() {
  const links = await getPopularPrayerCityLinks(24);
  const safeLinks = Array.isArray(links) ? links.filter((item) => item?.href && item?.label) : [];
  if (safeLinks.length === 0) return null;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'وقت صلاة الضحى حسب المدينة',
    itemListElement: safeLinks.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label.replace('مواقيت الصلاة في', 'وقت صلاة الضحى في'),
      url: `${BASE}${item.href}`,
    })),
  };

  return (
    <section className={routeStyles.sectionPanel} aria-label="وقت صلاة الضحى حسب المدينة">
      <JsonLd data={itemListSchema} />
      <div className={routeStyles.sectionHead}>
        <h2 className={routeStyles.sectionTitle}>اختر مدينتك</h2>
        <p className={routeStyles.sectionCopy}>
          كل صفحة مدينة تعرض وقت بداية ونهاية صلاة الضحى محسوباً لحظياً من إحداثياتها.
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

export default async function DuhaPrayerTimePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'متى وقت صلاة الضحى؟',
    url: PAGE_URL,
    description: 'حساب حي لبداية ونهاية وقت صلاة الضحى حسب مدينتك، من الشروق إلى الظهر.',
    inLanguage: 'ar',
  };

  return (
    <div className={`${routeStyles.prayerHubPage} min-h-screen bg-base text-primary`} dir="rtl" lang="ar">
      <AdLayoutWrapper layout="wide" sidebarMode="dual">
        <main className={routeStyles.pageMain}>
          <JsonLd data={webPageSchema} />
          <JsonLd data={faqSchema} />

          {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
          <AdTopBanner slotId="top-duha-prayer" />

          <section className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
            <div className={`${routeStyles.heroInner} ${routeStyles.heroCenter}`}>
              <div className={routeStyles.heroCopy}>
                <div className={routeStyles.metaPill}>
                  <Sun size={13} />
                  وقت صلاة الضحى الآن
                </div>
                <h1 className={routeStyles.heroTitle}>متى وقت صلاة الضحى؟</h1>
                <p className={routeStyles.heroLead}>
                  يبدأ وقت صلاة الضحى بعد ارتفاع الشمس عن الشروق بربع ساعة تقريباً، وينتهي قبل
                  دخول الظهر بعشر دقائق.
                </p>
              </div>

              <div className={routeStyles.searchWrap}>
                <DuhaAutoCard />
              </div>

              <div className={routeStyles.searchWrap}>
                <div className={`${routeStyles.sectionPanel} ${routeStyles.heroSearchPanel}`} aria-labelledby="duha-search-title">
                  <div className={routeStyles.searchPanelHeader}>
                    <span className={routeStyles.searchPanelKicker}>مدينة مختلفة؟</span>
                    <h2 id="duha-search-title" className={routeStyles.searchPanelTitle}>ابحث عن مدينة أخرى</h2>
                  </div>
                  <div className={routeStyles.searchCommandShell}>
                    <SearchCityWrapper mode="prayer" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.proseBlock}>
                <h2>لماذا لا تُصلى الضحى فور الشروق أو قبيل الظهر مباشرة؟</h2>
                <p>
                  ورد النهي عن التنفل في وقتين: فور شروق الشمس (حتى ترتفع قيد رمح) ووقت استواء
                  الشمس في كبد السماء قبيل الظهر مباشرة. لهذا تبدأ نافذة الضحى بعد الشروق بدقائق
                  معدودة، وتنتهي قبل الظهر بدقائق معدودة، تاركة نافذة آمنة وواسعة بينهما.
                </p>
                <div className={`${routeStyles.contextGrid} ${routeStyles.decisionList}`}>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>بداية الوقت</h3>
                    <p className={routeStyles.contextBody}>الشروق + 15 دقيقة تقريباً، بعد ارتفاع الشمس عن الأفق.</p>
                  </article>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>نهاية الوقت</h3>
                    <p className={routeStyles.contextBody}>الظهر − 10 دقائق تقريباً، قبل اقتراب الشمس من كبد السماء.</p>
                  </article>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>الوقت الأفضل</h3>
                    <p className={routeStyles.contextBody}>آخر النافذة، قرب اشتداد الحر، وفق ما ورد في السنة.</p>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4">
            <AdInArticle slotId="mid-duha-prayer-1" />
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <Suspense fallback={null}>
              <PopularCitiesForDuha />
            </Suspense>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="أسئلة شائعة عن صلاة الضحى">
            <div className={routeStyles.sectionPanel}>
              <h2 className={`${routeStyles.sectionTitle} mb-6 text-center`}>أسئلة شائعة عن صلاة الضحى</h2>
              <FAQAccordions items={FAQS} />
            </div>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="مصادر">
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.sectionHead}>
                <span className={routeStyles.metaPill}><Info size={13} />ملاحظة منهجية</span>
                <p className={routeStyles.sectionCopy}>
                  الحساب مبني على وقتي الشروق والظهر الفلكيين لمدينتك بنفس محرك الحساب المستخدم في
                  صفحات مواقيت الصلاة. هذا تقدير حسابي متعارف عليه، وليس فتوى محلية ملزمة.
                </p>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 pb-20">
            <AdMultiplex slotId="end-duha-prayer" />
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

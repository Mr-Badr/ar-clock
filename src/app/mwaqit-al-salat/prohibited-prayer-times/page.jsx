// app/mwaqit-al-salat/prohibited-prayer-times/page.jsx
import Link from 'next/link';
import { Suspense } from 'react';
import { Sun, Clock, Info } from 'lucide-react';
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
import { getProhibitedPrayerWindowsFacts } from '@/lib/night-prayer-facts';
import { getPopularPrayerCityLinks } from '@/lib/seo/popular-links';

const BASE = getSiteUrl();
const PAGE_URL = `${BASE}/mwaqit-al-salat/prohibited-prayer-times`;

export const metadata = buildCanonicalMetadata({
  title: 'ما هي أوقات النهي عن الصلاة؟ | حساب دقيق حسب مدينتك',
  description:
    'تعرف على أوقات النهي الثلاثة عن الصلاة محسوبة حياً حسب مدينتك: بعد الفجر حتى ارتفاع الشمس، عند الاستواء، ومن العصر حتى الغروب. اعرف الآن هل أنت داخل وقت نهي أم لا.',
  keywords: [
    'أوقات النهي عن الصلاة',
    'متى وقت النهي عن الصلاة',
    'أوقات الكراهة',
    'وقت الاستواء',
    'النهي عن الصلاة بعد العصر',
    'النهي عن الصلاة بعد الفجر',
    'هل الآن وقت نهي عن الصلاة',
    'أوقات النهي عن الصلاة بالرياض',
  ],
  url: PAGE_URL,
});

const FAQS = [
  {
    q: 'ما هي أوقات النهي عن الصلاة الثلاثة؟',
    node: (
      <div className="space-y-2 text-secondary">
        <p>
          ثبت في صحيح مسلم عن عقبة بن عامر رضي الله عنه ثلاثة أوقات نهانا فيها رسول الله ﷺ عن
          الصلاة أو دفن الموتى فيها:
        </p>
        <p>
          <strong className="text-primary">حين تطلع الشمس</strong> حتى ترتفع، و
          <strong className="text-primary"> حين يقوم قائم الظهيرة</strong> حتى تميل الشمس (وقت
          الاستواء)، و<strong className="text-primary"> حين تضيّف الشمس للغروب</strong> حتى تغرب
          تماماً.
        </p>
      </div>
    ),
  },
  {
    q: 'هل يشمل النهي كل الصلوات أم النوافل فقط؟',
    a: 'في هذه الأوقات الثلاثة المغلّظة تحديداً (عند الشروق والاستواء والغروب) يشمل النهي حتى قضاء الفوائت وصلاة الجنازة عند كثير من أهل العلم، وهي أشد الأوقات. أما بقية فترة ما بعد الفجر حتى الشروق وما بعد العصر حتى الغروب، فالمنهي عنه فيها صلاة النافلة غير ذات السبب تحديداً، وتجوز فيها الفريضة وقضاء الفوائت وذوات الأسباب عند جمهور العلماء.',
  },
  {
    q: 'كم تستغرق كل فترة نهي بالدقائق؟',
    a: 'قدّر أهل العلم كل فترة من الفترات الثلاث المغلّظة بما بين عشر دقائق إلى ربع ساعة تقريباً؛ فترة الشروق حوالي 15 دقيقة بعد طلوع الشمس، وفترة الاستواء حوالي 10 دقائق قبل دخول الظهر، وفترة الغروب تمتد عملياً من العصر حتى غروب الشمس تماماً.',
  },
  {
    q: 'لماذا نهي عن الصلاة في هذه الأوقات تحديداً؟',
    a: 'ورد في الحديث الصحيح أن هذه الأوقات الثلاثة ترتبط بطلوع الشمس وغروبها واستوائها بين قرني شيطان، وهي الأوقات التي كان يسجد فيها بعض عبدة الشمس. الحكمة من النهي — كما ذكر العلماء — سد الذريعة أمام أي تشابه ولو ظاهري بعبادة الشمس.',
  },
  {
    q: 'هل يمكنني معرفة أوقات النهي في مدينتي؟',
    a: 'نعم، ابحث عن اسم مدينتك في الأعلى وستنتقل إلى صفحة مواقيت الصلاة الخاصة بها، وستجد فيها أوقات النهي الثلاثة محسوبة تلقائياً من إحداثيات مدينتك بالاعتماد على مواقيت الفجر والشروق والظهر والعصر والمغرب الفعلية.',
  },
  {
    q: 'هل صلاة الضحى داخلة في وقت النهي؟',
    a: 'لا، صلاة الضحى تبدأ تحديداً عند انتهاء وقت نهي الشروق (بعد ارتفاع الشمس بربع ساعة تقريباً) وتنتهي عند بداية وقت نهي الاستواء (قبل الظهر بعشر دقائق تقريباً)، فالوقتان متكاملان لا متداخلان. راجع صفحة وقت صلاة الضحى لمعرفة توقيتها الدقيق في مدينتك.',
  },
  {
    q: 'ماذا لو كانت علي صلاة فائتة وأنا في وقت نهي؟',
    a: 'الراجح عند جمهور أهل العلم أن قضاء الفريضة الفائتة جائز في وقت النهي غير المغلّظ (بعد الفجر وبعد العصر)، ولا يُؤخَّر لخطورة تفويت الوقت. أما في الأوقات الثلاثة المغلّظة تحديداً (الشروق والاستواء والغروب) فالأولى تأخير القضاء دقائق معدودة حتى ينتهي الوقت المغلّظ إن أمكن ذلك دون حرج.',
  },
];

async function ProhibitedWindowsReferenceCity() {
  const [country, nowIso] = await Promise.all([
    getCountryBySlug('saudi-arabia'),
    getCachedNowIso(),
  ]);
  if (!country) return null;

  const city = await getCityBySlug(country.country_code, 'riyadh');
  if (!city) return null;

  const now = new Date(nowIso);
  const facts = getProhibitedPrayerWindowsFacts({
    lat: city.lat,
    lon: city.lon,
    timezone: city.timezone,
    date: now,
    countryCode: country.country_code,
    cacheKey: 'saudi-arabia::riyadh::prohibited-windows',
  });

  if (!facts) return null;

  const cityNameAr = city.name_ar || city.name_en;

  return (
    <section className={routeStyles.sectionPanel} aria-label={`مثال حي: أوقات النهي عن الصلاة في ${cityNameAr}`}>
      <div className={routeStyles.sectionHead}>
        <h2 className={routeStyles.sectionTitle}>
          {facts.isProhibitedNow ? `الآن وقت نهي في ${cityNameAr}` : `مثال حي الآن: ${cityNameAr}`}
        </h2>
        <p className={routeStyles.sectionCopy}>
          {facts.isProhibitedNow
            ? `أنت الآن داخل «${facts.activeWindow?.title}» — ينتهي عند ${facts.activeWindow?.endLabel}.`
            : 'هذا مثال مباشر بمدينة ' + cityNameAr + ' ليوضح لك أوقات النهي الثلاثة اليوم. ابحث عن مدينتك في الأعلى للحصول على توقيتك الدقيق أنت.'}
        </p>
      </div>
      <div className={routeStyles.contextGrid}>
        {facts.windows.map((w) => (
          <article key={w.key} className={routeStyles.contextCard}>
            <h3 className={routeStyles.contextTitle}>
              {w.title}
              {w.isActiveNow ? ' — الآن' : ''}
            </h3>
            <p className={routeStyles.contextBody}>
              من <strong>{w.startLabel}</strong> حتى <strong>{w.endLabel}</strong> ({w.durationLabel})
            </p>
          </article>
        ))}
      </div>
      <Link href={`/mwaqit-al-salat/${country.country_slug}/riyadh`} className={routeStyles.contextLink}>
        مواقيت الصلاة الكاملة في {cityNameAr} ←
      </Link>
    </section>
  );
}

async function PopularCitiesForProhibitedWindows() {
  const links = await getPopularPrayerCityLinks(24);
  const safeLinks = Array.isArray(links) ? links.filter((item) => item?.href && item?.label) : [];
  if (safeLinks.length === 0) return null;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'أوقات النهي عن الصلاة حسب المدينة',
    itemListElement: safeLinks.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label.replace('مواقيت الصلاة في', 'أوقات النهي عن الصلاة في'),
      url: `${BASE}${item.href}`,
    })),
  };

  return (
    <section className={routeStyles.sectionPanel} aria-label="أوقات النهي عن الصلاة حسب المدينة">
      <JsonLd data={itemListSchema} />
      <div className={routeStyles.sectionHead}>
        <h2 className={routeStyles.sectionTitle}>اختر مدينتك</h2>
        <p className={routeStyles.sectionCopy}>
          كل صفحة مدينة تعرض أوقات النهي الثلاثة محسوبَة لحظياً من إحداثياتها.
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

export default async function ProhibitedPrayerTimesPage() {
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
    name: 'ما هي أوقات النهي عن الصلاة؟',
    url: PAGE_URL,
    description: 'حساب حي لأوقات النهي الثلاثة عن الصلاة حسب مدينتك: الشروق، الاستواء، والغروب.',
    inLanguage: 'ar',
  };

  return (
    <div className={`${routeStyles.prayerHubPage} min-h-screen bg-base text-primary`} dir="rtl" lang="ar">
      <AdLayoutWrapper layout="wide" sidebarMode="dual">
        <main className={routeStyles.pageMain}>
          <JsonLd data={webPageSchema} />
          <JsonLd data={faqSchema} />

          {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
          <AdTopBanner slotId="top-prohibited-prayer-times" />

          <section className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
            <div className={`${routeStyles.heroInner} ${routeStyles.heroCenter}`}>
              <div className={routeStyles.heroCopy}>
                <div className={routeStyles.metaPill}>
                  <Sun size={13} />
                  أوقات النهي عن الصلاة الآن
                </div>
                <h1 className={routeStyles.heroTitle}>ما هي أوقات النهي عن الصلاة؟</h1>
                <p className={routeStyles.heroLead}>
                  إذا كان سؤالك المباشر: أوقات النهي عن الصلاة ثلاثة، ثبتت في صحيح مسلم — بعد
                  الفجر حتى ارتفاع الشمس، عند استواء الشمس قبيل الظهر، ومن العصر حتى غروب الشمس
                  تماماً. الوقت الدقيق يختلف يومياً وحسب مدينتك — ابحث عن مدينتك بالأسفل لتوقيتك
                  الآن.
                </p>
              </div>
              <div className={routeStyles.searchWrap}>
                <div className={`${routeStyles.sectionPanel} ${routeStyles.heroSearchPanel}`} aria-labelledby="prohibited-search-title">
                  <div className={routeStyles.searchPanelHeader}>
                    <span className={routeStyles.searchPanelKicker}>احسب توقيتك</span>
                    <h2 id="prohibited-search-title" className={routeStyles.searchPanelTitle}>ابحث عن مدينتك</h2>
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
              <ProhibitedWindowsReferenceCity />
            </Suspense>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.proseBlock}>
                <h2>ما الفرق بين النهي المغلّظ والنهي العام؟</h2>
                <p>
                  يفرّق أهل العلم بين نوعين من أوقات النهي: النهي المغلّظ في اللحظات الثلاث الدقيقة
                  (عند شروق الشمس، وعند استوائها، وعند غروبها)، حيث يُمنع فيها حتى قضاء الفوائت
                  وصلاة الجنازة عند كثير من العلماء؛ والنهي العام في الفترة الأوسع بعد الفجر حتى
                  الشروق وبعد العصر حتى الغروب، حيث يُمنع فيها تحديداً صلاة النافلة غير ذات السبب،
                  بينما تجوز الفريضة وقضاء الفوائت.
                </p>
                <div className={`${routeStyles.contextGrid} ${routeStyles.decisionList}`}>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>وقت الشروق</h3>
                    <p className={routeStyles.contextBody}>من طلوع الفجر حتى ارتفاع الشمس قدر رمح، أي نحو 15 دقيقة بعد الشروق.</p>
                  </article>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>وقت الاستواء</h3>
                    <p className={routeStyles.contextBody}>نحو 10 دقائق قبل دخول وقت الظهر، حين تكون الشمس في كبد السماء.</p>
                  </article>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>وقت الغروب</h3>
                    <p className={routeStyles.contextBody}>من دخول وقت العصر حتى غروب الشمس تماماً، وآخره أشد تأكيداً.</p>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4">
            <AdInArticle slotId="mid-prohibited-prayer-times-1" />
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <Suspense fallback={null}>
              <PopularCitiesForProhibitedWindows />
            </Suspense>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="أسئلة شائعة عن أوقات النهي عن الصلاة">
            <div className={routeStyles.sectionPanel}>
              <h2 className={`${routeStyles.sectionTitle} mb-6 text-center`}>أسئلة شائعة عن أوقات النهي عن الصلاة</h2>
              <FAQAccordions items={FAQS} />
            </div>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="مصادر">
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.sectionHead}>
                <span className={routeStyles.metaPill}><Info size={13} />ملاحظة منهجية</span>
                <p className={routeStyles.sectionCopy}>
                  الأوقات الثلاثة ثابتة بحديث عقبة بن عامر رضي الله عنه في صحيح مسلم، والحساب هنا
                  مبني على مواقيت الفجر والشروق والظهر والعصر والمغرب الفلكية لمدينتك بنفس محرك
                  الحساب المستخدم في صفحات مواقيت الصلاة، مع تقدير عملي بالدقائق لبداية فترتي
                  الشروق والاستواء متفق عليه بين أهل العلم. راجع مسجدك أو مرجعك الشرعي لأي تفصيل
                  فقهي إضافي.
                </p>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 pb-20">
            <AdMultiplex slotId="end-prohibited-prayer-times" />
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

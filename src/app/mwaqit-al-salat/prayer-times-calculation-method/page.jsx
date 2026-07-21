// app/mwaqit-al-salat/prayer-times-calculation-method/page.jsx
import Link from 'next/link';
import { Suspense } from 'react';
import { Compass, Sun, Moon, Clock, Info } from 'lucide-react';
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
import { calculatePrayerTimes, calculateAsrComparison, formatTime } from '@/lib/prayerEngine';
import { getPopularPrayerCityLinks } from '@/lib/seo/popular-links';

const BASE = getSiteUrl();
const PAGE_URL = `${BASE}/mwaqit-al-salat/prayer-times-calculation-method`;

export const metadata = buildCanonicalMetadata({
  title: 'كيف تُحسب مواقيت الصلاة فلكياً؟ | مثال حي بالحساب الفعلي',
  description:
    'تعرف على الطريقة الفلكية الحقيقية لحساب مواقيت الصلاة: زوايا الفجر والعشاء، طول ظل العصر، ولماذا تختلف المواقيت بين المدن والمذاهب، مع مثال حي محسوب فعلياً لمدينة الرياض.',
  keywords: [
    'كيف تحسب مواقيت الصلاة',
    'طريقة حساب أوقات الصلاة',
    'لماذا تختلف مواقيت الصلاة بين المدن',
    'حساب وقت الفجر فلكياً',
    'زاوية الفجر والعشاء',
    'حساب العصر حسب المذهب',
    'الحساب الفلكي لمواقيت الصلاة',
    'فرق مواقيت الصلاة بين الدول',
  ],
  url: PAGE_URL,
});

// Real Adhan.js CalculationMethod angle presets — the exact values this site's own
// engine (src/lib/prayerEngine.js) uses per country. First-party, verifiable in-repo.
const METHOD_ANGLES = [
  { method: 'أم القرى (السعودية)', fajr: '18.5°', isha: '90 دقيقة بعد المغرب (120 في رمضان)' },
  { method: 'رابطة العالم الإسلامي (MWL)', fajr: '18°', isha: '17°' },
  { method: 'الهيئة المصرية العامة للمساحة', fajr: '19.5°', isha: '17.5°' },
  { method: 'جامعة كراتشي', fajr: '18°', isha: '18°' },
  { method: 'هيئة دبي (يُعتمد في معظم الخليج)', fajr: '18.2°', isha: '18.2°' },
  { method: 'قطر (نسخة معدّلة من أم القرى)', fajr: '18°', isha: '90 دقيقة بعد المغرب' },
  { method: 'الكويت', fajr: '18°', isha: '17.5°' },
  { method: 'سنغافورة (MUIS)', fajr: '20°', isha: '18°' },
  { method: 'تركيا (ديانت)', fajr: '18°', isha: '17°' },
  { method: 'طهران', fajr: '17.7°', isha: '14°' },
  { method: 'أمريكا الشمالية (ISNA)', fajr: '15°', isha: '15°' },
];

const FAQS = [
  {
    q: 'كيف تُحسب مواقيت الصلاة فلكياً بالضبط؟',
    node: (
      <div className="space-y-2 text-secondary">
        <p>
          كل موقع صلاة مبني على موضع الشمس الفعلي بالنسبة لمدينتك: الشروق والغروب يُحسبان من زاوية
          الشمس صفر تحت الأفق، والفجر والعشاء يُحسبان من زاوية أعمق (بين 15° و20° تقريباً) تحدد لحظة
          ظهور أو اختفاء الشفق. الظهر هو لحظة عبور الشمس خط الزوال، والعصر يعتمد على طول ظل شاخص
          مقارنة بطوله وقت الظهر.
        </p>
        <p>
          هذه الزوايا والقواعد ليست تقديراً عاماً — هي نفس القيم التي تستخدمها هذه الصفحة الآن لحساب
          موقعك، وتراها حية أدناه في مثال مدينة الرياض.
        </p>
      </div>
    ),
  },
  {
    q: 'لماذا تختلف مواقيت الصلاة بين المدن؟',
    a: 'كل مدينة لها خط طول وخط عرض مختلفان، فتختلف لحظة عبور الشمس خط الزوال (الظهر) ولحظة وصولها لزاوية الفجر أو العشاء المحددة. المدن الأبعد شمالاً أو جنوباً تشهد فروقاً أكبر بين الفصول أيضاً، لأن طول الليل والنهار يتغير معها بشكل أوضح.',
  },
  {
    q: 'لماذا تختلف مواقيت الصلاة بين الدول رغم أنها بنفس خط الطول تقريباً؟',
    a: 'لأن كل دولة أو هيئة دينية تعتمد زاوية فجر وعشاء مختلفة قليلاً (راجع الجدول أعلاه)، وهي اختيارات فلكية-فقهية معتمدة من كل هيئة رسمية بناءً على أبحاثها الخاصة في وضوح الشفق. الفرق الناتج عادة بضع دقائق فقط، لكنه يظهر بوضوح عند المقارنة بين تقويمين مختلفين لنفس المدينة تقريباً.',
  },
  {
    q: 'ما الفرق بين حساب العصر عند الشافعية والحنفية؟',
    a: 'الفرق الوحيد القابل للحساب بين المذاهب الأربعة هو وقت العصر: يبدأ عند الشافعية والمالكية والحنابلة حين يصبح ظل الشيء مساوياً لطوله (× 1)، بينما يبدأ عند الحنفية حين يصبح الظل ضعف الطول (× 2)، أي متأخراً عادة بـ45 إلى 90 دقيقة. بقية الصلوات (الفجر والظهر والمغرب والعشاء) محسوبة بنفس الطريقة عند جميع المذاهب.',
  },
  {
    q: 'هل الحساب الفلكي نفسه دقيق أم تقريبي؟',
    a: 'الحساب الفلكي لموضع الشمس (الشروق والغروب وخط الزوال) دقيق بدقة الثانية تقريباً، لأنه معادلات فلكية معروفة. الجزء الوحيد الذي يحمل اجتهاداً بشرياً هو اختيار زاوية الفجر والعشاء، لأن رؤية الشفق الفعلية تتأثر بعوامل جوية لا يمكن حسابها فلكياً بدقة مطلقة — لهذا تختلف الهيئات الدينية في اختيار الزاوية الأنسب لمنطقتها.',
  },
  {
    q: 'كيف أعرف طريقة الحساب المعتمدة لمدينتي؟',
    a: 'ابحث عن مدينتك في الأعلى للانتقال إلى صفحتها المخصصة، وستجد فيها طريقة الحساب المعتمدة (مثل أم القرى للسعودية أو رابطة العالم الإسلامي لبلدان أخرى) موضحة صراحة إلى جانب المواقيت الفعلية.',
  },
];

async function LiveCalculationExample() {
  const [country, nowIso] = await Promise.all([
    getCountryBySlug('saudi-arabia'),
    getCachedNowIso(),
  ]);
  if (!country) return null;

  const city = await getCityBySlug(country.country_code, 'riyadh');
  if (!city) return null;

  const now = new Date(nowIso);
  const times = calculatePrayerTimes({
    lat: city.lat,
    lon: city.lon,
    timezone: city.timezone,
    date: now,
    countryCode: country.country_code,
    cacheKey: 'saudi-arabia::riyadh::calc-method-page',
  });
  const asrComparison = calculateAsrComparison({
    lat: city.lat,
    lon: city.lon,
    timezone: city.timezone,
    date: now,
    countryCode: country.country_code,
    cacheKey: 'saudi-arabia::riyadh::calc-method-page',
  });

  if (!times) return null;

  const cityNameAr = city.name_ar || city.name_en;
  const tz = city.timezone;
  const fajrLabel = formatTime(times.fajr, tz);
  const sunriseLabel = formatTime(times.sunrise, tz);
  const dhuhrLabel = formatTime(times.dhuhr, tz);
  const maghribLabel = formatTime(times.maghrib, tz);
  const ishaLabel = formatTime(times.isha, tz);
  const shafiAsrLabel = asrComparison.shafiAsr ? formatTime(asrComparison.shafiAsr, tz) : null;
  const hanafiAsrLabel = asrComparison.hanafiAsr ? formatTime(asrComparison.hanafiAsr, tz) : null;

  return (
    <section className={routeStyles.sectionPanel} aria-label={`مثال حي: حساب مواقيت الصلاة في ${cityNameAr}`}>
      <div className={routeStyles.sectionHead}>
        <h2 className={routeStyles.sectionTitle}>مثال حي الآن: الحساب الفعلي لمدينة {cityNameAr}</h2>
        <p className={routeStyles.sectionCopy}>
          هذه ليست أرقاماً توضيحية — هي نتيجة حساب فعلي بمحرك الموقع نفسه لإحداثيات {cityNameAr}{' '}
          اليوم، بطريقة أم القرى المعتمدة رسمياً في السعودية (زاوية فجر 18.5°، وعشاء بعد المغرب بـ90
          دقيقة).
        </p>
      </div>
      <div className={routeStyles.contextGrid}>
        <article className={routeStyles.contextCard}>
          <h3 className={routeStyles.contextTitle}>الفجر — زاوية 18.5°</h3>
          <p className={routeStyles.contextBody}>
            يبدأ عند <strong>{fajrLabel}</strong>، لحظة وصول الشمس إلى 18.5 درجة تحت الأفق الشرقي —
            بداية الشفق الفلكي الذي يسبق طلوع الشمس.
          </p>
        </article>
        <article className={routeStyles.contextCard}>
          <h3 className={routeStyles.contextTitle}>الشروق — زاوية 0°</h3>
          <p className={routeStyles.contextBody}>
            عند <strong>{sunriseLabel}</strong>، لحظة ظهور حافة الشمس العلوية عند خط الأفق تماماً.
          </p>
        </article>
        <article className={routeStyles.contextCard}>
          <h3 className={routeStyles.contextTitle}>الظهر — عبور خط الزوال</h3>
          <p className={routeStyles.contextBody}>
            عند <strong>{dhuhrLabel}</strong>، لحظة وصول الشمس أعلى نقطة لها في السماء بالنسبة لهذا
            الموقع تحديداً.
          </p>
        </article>
        <article className={routeStyles.contextCard}>
          <h3 className={routeStyles.contextTitle}>العصر — طول الظل</h3>
          <p className={routeStyles.contextBody}>
            {shafiAsrLabel ? <>الشافعي/المالكي/الحنبلي: <strong>{shafiAsrLabel}</strong> (ظل = طول الشاخص)</> : null}
            {hanafiAsrLabel ? <><br />الحنفي: <strong>{hanafiAsrLabel}</strong> (ظل = ضعف طول الشاخص)</> : null}
          </p>
        </article>
        <article className={routeStyles.contextCard}>
          <h3 className={routeStyles.contextTitle}>المغرب — زاوية 0°</h3>
          <p className={routeStyles.contextBody}>
            عند <strong>{maghribLabel}</strong>، لحظة اختفاء حافة الشمس العلوية عند خط الأفق الغربي.
          </p>
        </article>
        <article className={routeStyles.contextCard}>
          <h3 className={routeStyles.contextTitle}>العشاء — 90 دقيقة بعد المغرب</h3>
          <p className={routeStyles.contextBody}>
            عند <strong>{ishaLabel}</strong>. طريقة أم القرى لا تستخدم زاوية شفق للعشاء كبقية الطرق، بل
            فاصلاً زمنياً ثابتاً بعد المغرب (يمتد إلى 120 دقيقة في رمضان).
          </p>
        </article>
      </div>
      <Link href={`/mwaqit-al-salat/${country.country_slug}/riyadh`} className={routeStyles.contextLink}>
        مواقيت الصلاة الكاملة في {cityNameAr} اليوم ←
      </Link>
    </section>
  );
}

async function PopularCitiesForCalcMethod() {
  const links = await getPopularPrayerCityLinks(24);
  const safeLinks = Array.isArray(links) ? links.filter((item) => item?.href && item?.label) : [];
  if (safeLinks.length === 0) return null;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'مواقيت الصلاة حسب المدينة',
    itemListElement: safeLinks.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      url: `${BASE}${item.href}`,
    })),
  };

  return (
    <section className={routeStyles.sectionPanel} aria-label="اعرف طريقة الحساب المعتمدة لمدينتك">
      <JsonLd data={itemListSchema} />
      <div className={routeStyles.sectionHead}>
        <h2 className={routeStyles.sectionTitle}>اعرف طريقة الحساب في مدينتك</h2>
        <p className={routeStyles.sectionCopy}>
          كل صفحة مدينة تعرض طريقة الحساب المعتمدة والمواقيت الفعلية المحسوبة منها لحظياً.
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

export default async function PrayerTimesCalculationMethodPage() {
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
    name: 'كيف تُحسب مواقيت الصلاة فلكياً؟',
    url: PAGE_URL,
    description: 'شرح فلكي لطريقة حساب مواقيت الصلاة مع مثال حي محسوب فعلياً، وجدول مقارنة زوايا الفجر والعشاء بين الهيئات المختلفة.',
    inLanguage: 'ar',
  };

  return (
    <div className={`${routeStyles.prayerHubPage} min-h-screen bg-base text-primary`} dir="rtl" lang="ar">
      <AdLayoutWrapper layout="wide" sidebarMode="dual">
        <main className={routeStyles.pageMain}>
          <JsonLd data={webPageSchema} />
          <JsonLd data={faqSchema} />

          {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
          <AdTopBanner slotId="top-prayer-calc-method" />

          <section className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
            <div className={`${routeStyles.heroInner} ${routeStyles.heroCenter}`}>
              <div className={routeStyles.heroCopy}>
                <div className={routeStyles.metaPill}>
                  <Compass size={13} />
                  الحساب الفلكي لمواقيت الصلاة
                </div>
                <h1 className={routeStyles.heroTitle}>كيف تُحسب مواقيت الصلاة فلكياً؟</h1>
                <p className={routeStyles.heroLead}>
                  إذا كان سؤالك المباشر: مواقيت الصلاة الخمس مبنية على موضع الشمس الفعلي — الشروق
                  والغروب عند زاوية صفر تحت الأفق، والفجر والعشاء عند زاوية أعمق (شفق فلكي)، والظهر
                  عند عبور الشمس خط الزوال، والعصر حسب طول ظل شاخص. انزل للمثال الحي المحسوب فعلياً
                  الآن بمدينة الرياض.
                </p>
              </div>
              <div className={routeStyles.searchWrap}>
                <div className={`${routeStyles.sectionPanel} ${routeStyles.heroSearchPanel}`} aria-labelledby="calc-method-search-title">
                  <div className={routeStyles.searchPanelHeader}>
                    <span className={routeStyles.searchPanelKicker}>احسب توقيتك</span>
                    <h2 id="calc-method-search-title" className={routeStyles.searchPanelTitle}>ابحث عن مدينتك</h2>
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
              <LiveCalculationExample />
            </Suspense>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.proseBlock}>
                <h2>الأسس الفلكية الخمسة لمواقيت الصلاة</h2>
                <p>
                  كل موقيت من مواقيت الصلاة الخمس مبني على نقطة فلكية محددة بدقة في مسار الشمس اليومي
                  الظاهري حول الأرض. لا يوجد تخمين أو تقريب في حساب موضع الشمس نفسه — المعادلات
                  الفلكية معروفة ودقيقة بالثانية. الاجتهاد البشري الوحيد هو في اختيار زاوية الفجر
                  والعشاء، لأن رؤية الشفق الفعلية تتأثر بعوامل جوية لا يمكن حسابها فلكياً بشكل مطلق.
                </p>
                <div className={`${routeStyles.contextGrid} ${routeStyles.decisionList}`}>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>الفجر</h3>
                    <p className={routeStyles.contextBody}>الشمس تصل زاوية بين 15° و20° تحت الأفق الشرقي — بداية الشفق الفلكي.</p>
                  </article>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>الشروق</h3>
                    <p className={routeStyles.contextBody}>حافة الشمس العلوية تلامس خط الأفق الشرقي (زاوية صفر).</p>
                  </article>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>الظهر</h3>
                    <p className={routeStyles.contextBody}>الشمس تعبر خط الزوال — أعلى نقطة لها في السماء لهذا الموقع تحديداً.</p>
                  </article>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>العصر</h3>
                    <p className={routeStyles.contextBody}>ظل شاخص عمودي يساوي طوله (الشافعية) أو ضعف طوله (الحنفية).</p>
                  </article>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>المغرب</h3>
                    <p className={routeStyles.contextBody}>حافة الشمس العلوية تختفي تحت خط الأفق الغربي (زاوية صفر).</p>
                  </article>
                  <article className={routeStyles.contextCard}>
                    <h3 className={routeStyles.contextTitle}>العشاء</h3>
                    <p className={routeStyles.contextBody}>الشمس تصل زاوية أعمق (14° إلى 20° تقريباً) — نهاية الشفق، أو فاصل زمني ثابت بعد المغرب في بعض الطرق.</p>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4">
            <AdInArticle slotId="mid-prayer-calc-method-1" />
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.sectionHead}>
                <span className={routeStyles.metaPill}><Sun size={13} />مقارنة الهيئات</span>
                <h2 className={routeStyles.sectionTitle}>لماذا تختلف مواقيت الفجر والعشاء بين الدول؟</h2>
                <p className={routeStyles.sectionCopy}>
                  كل هيئة دينية رسمية تعتمد زاوية فجر وعشاء اختارتها بناءً على أبحاثها الفلكية الخاصة
                  في وضوح الشفق بمنطقتها. الفروق عادة بضع دقائق، لكنها تفسر لماذا يختلف تقويمان لمدينتين
                  متقاربتين إذا اعتمدتا هيئتين مختلفتين. هذا جدول الزوايا الفعلية التي يستخدمها محرك هذا
                  الموقع لكل دولة:
                </p>
              </div>
              <div className="table-wrapper" dir="rtl">
                <table className="table table--compact">
                  <caption className="sr-only">زوايا الفجر والعشاء حسب طريقة الحساب</caption>
                  <thead>
                    <tr>
                      <th scope="col">الهيئة / الطريقة</th>
                      <th scope="col">زاوية الفجر</th>
                      <th scope="col">زاوية أو قاعدة العشاء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {METHOD_ANGLES.map((row) => (
                      <tr key={row.method}>
                        <td>{row.method}</td>
                        <td>{row.fajr}</td>
                        <td>{row.isha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <Suspense fallback={null}>
              <PopularCitiesForCalcMethod />
            </Suspense>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="أسئلة شائعة عن حساب مواقيت الصلاة">
            <div className={routeStyles.sectionPanel}>
              <h2 className={`${routeStyles.sectionTitle} mb-6 text-center`}>أسئلة شائعة عن حساب مواقيت الصلاة</h2>
              <FAQAccordions items={FAQS} />
            </div>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="مسارات ذات صلة">
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.sectionHead}>
                <h2 className={routeStyles.sectionTitle}>تعمّق أكثر في مواقيت الصلاة</h2>
              </div>
              <div className={routeStyles.compactCityGrid}>
                <Link href="/mwaqit-al-salat/last-third-of-night" className={routeStyles.compactCityLink}>
                  الثلث الأخير من الليل
                </Link>
                <Link href="/mwaqit-al-salat/duha-prayer-time" className={routeStyles.compactCityLink}>
                  وقت صلاة الضحى
                </Link>
                <Link href="/mwaqit-al-salat/friday-response-hour" className={routeStyles.compactCityLink}>
                  ساعة الإجابة يوم الجمعة
                </Link>
                <Link href="/mwaqit-al-salat/white-days" className={routeStyles.compactCityLink}>
                  الأيام البيض
                </Link>
                <Link href="/mwaqit-al-salat" className={routeStyles.compactCityLink}>
                  كل مواقيت الصلاة
                </Link>
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="مصادر">
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.sectionHead}>
                <span className={routeStyles.metaPill}><Info size={13} />ملاحظة منهجية</span>
                <p className={routeStyles.sectionCopy}>
                  كل الأرقام في هذه الصفحة، بما فيها مثال الرياض الحي، محسوبة بنفس محرك الحساب الفلكي
                  المستخدم في كل صفحات مواقيت الصلاة على هذا الموقع (مكتبة Adhan.js لحساب موضع الشمس)،
                  وليست تقريباً توضيحياً منفصلاً. زوايا الفجر والعشاء المعروضة هي القيم الرسمية المعتمدة
                  من كل هيئة، وقد تُحدَّث الهيئات قيمها من وقت لآخر — راجع تقويم مسجدك المحلي عند الشك.
                </p>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 pb-20">
            <AdMultiplex slotId="end-prayer-calc-method" />
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

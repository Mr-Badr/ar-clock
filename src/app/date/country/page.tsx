import type { Metadata } from 'next';
import Link from 'next/link';

import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { getFlagEmoji } from '@/lib/country-utils';
import { getCachedNowIso } from '@/lib/date-utils';
import { getAllCountries, getPriorityCountrySlugs } from '@/lib/db/queries/countries';
import type { Country } from '@/lib/db/types';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import { getSiteUrl } from '@/lib/site-config';

import DateCountryRedirectClient from './DateCountryRedirectClient';

const BASE_URL = getSiteUrl();
const PAGE_PATH = '/date/country';
const PRIMARY_COUNTRY_SLUG = 'saudi-arabia';
const FEATURED_COUNTRY_LIMIT = 12;
const DIRECTORY_COUNTRY_LIMIT = 32;

const PAGE_KEYWORDS: readonly string[] = [
  ...buildDateKeywords({}),
  'التاريخ حسب الدولة',
  'التاريخ اليوم حسب البلد',
  'التاريخ الهجري حسب الدولة',
  'التاريخ الميلادي حسب الدولة',
  'تاريخ اليوم في الدول العربية',
  'كم التاريخ اليوم في بلدي',
  'التاريخ المحلي اليوم',
  'اختيار الدولة للتاريخ الهجري والميلادي',
];

const COUNTRY_DISPLAY_NAMES: Readonly<Record<string, string>> = {
  'saudi-arabia': 'السعودية',
  'united-arab-emirates': 'الإمارات',
  'united-states': 'أمريكا',
  'united-kingdom': 'بريطانيا',
};

const COUNTRY_REASON_BY_SLUG: Readonly<Record<string, string>> = {
  'saudi-arabia': 'مفيد عندما تبحث عن التاريخ الهجري اليوم أو تقويم أم القرى في سياق سعودي.',
  egypt: 'اختر مصر عندما تريد التاريخ المحلي قبل ربطه بالوقت أو مواقيت الصلاة في المدن المصرية.',
  morocco: 'ابدأ من المغرب إذا كان الموعد مرتبطاً بالتوقيت المحلي أو بفرق اليوم مع المشرق.',
  algeria: 'مناسب عندما تحتاج تاريخ اليوم في الجزائر بصيغتيه الهجرية والميلادية.',
  'united-arab-emirates': 'اختر الإمارات للمواعيد والعمل والحجوزات المرتبطة بالتوقيت المحلي هناك.',
  tunisia: 'يفيدك عند متابعة التاريخ اليومي في تونس ومقارنته بالتحويل أو التقويم السنوي.',
  libya: 'استخدمه عندما يكون سؤالك عن تاريخ اليوم داخل ليبيا لا عن نتيجة عامة.',
  sudan: 'يعطيك نقطة بداية محلية قبل فتح الوقت الان أو التقويم الكامل في السودان.',
  iraq: 'اختيار مناسب لمن ينسق موعداً أو رسالة مرتبطة بالتاريخ المحلي في العراق.',
  jordan: 'ابدأ من الأردن عندما تريد تاريخ اليوم في البلد نفسه قبل المقارنة مع بلد آخر.',
  syria: 'يفيد في قراءة التاريخ المحلي السوري مع مسارات الوقت والتحويل.',
  lebanon: 'مناسب للمواعيد والرسائل التي تحتاج التاريخ المحلي في لبنان بوضوح.',
  yemen: 'استخدمه عندما تريد تاريخ اليوم في اليمن مع رابط سريع للوقت والتحويل.',
  kuwait: 'مفيد للتأكد من التاريخ المحلي في الكويت قبل الصلاة أو التحويل أو المشاركة.',
  qatar: 'يفيدك في الأسئلة اليومية المرتبطة بتاريخ قطر الحالي والوقت المحلي.',
  bahrain: 'اختر البحرين عندما يكون الموعد أو الرسالة مرتبطاً بتاريخ اليوم هناك.',
  oman: 'يساعدك على قراءة التاريخ المحلي في عُمان قبل فتح التقويم أو المحول.',
  mauritania: 'مناسب لمتابعة تاريخ اليوم في موريتانيا مع سياق المنطقة الزمنية.',
};

const ARAB_COUNTRY_SLUGS: readonly string[] = [
  'saudi-arabia',
  'egypt',
  'morocco',
  'algeria',
  'united-arab-emirates',
  'tunisia',
  'libya',
  'sudan',
  'iraq',
  'jordan',
  'syria',
  'lebanon',
  'yemen',
  'kuwait',
  'qatar',
  'bahrain',
  'oman',
  'somalia',
  'djibouti',
  'mauritania',
  'comoros',
];

interface CountryPathway {
  slug: string;
  flag: string;
  name: string;
  description: string;
  reason: string;
}

interface DecisionRow {
  need: string;
  startHere: string;
  nextStep: string;
}

interface SourceLink {
  href: string;
  label: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const DECISION_ROWS: readonly DecisionRow[] = [
  {
    need: 'تريد تاريخ اليوم في بلد محدد',
    startHere: 'ابدأ من صفحة الدولة، لأنها تقرأ اليوم حسب توقيت البلد لا حسب توقيت جهازك فقط.',
    nextStep: 'افتح الوقت الان إذا كان الموعد قريباً من منتصف الليل أو مرتبطاً بدولة أخرى.',
  },
  {
    need: 'تريد تحويل تاريخ مكتوب أمامك',
    startHere: 'استخدم محول التاريخ، لأن الدولة لا تكفي عندما يكون لديك يوم وشهر وسنة محددة.',
    nextStep: 'احتفظ بالتاريخين معاً إذا كان الاستخدام في وثيقة أو نموذج رسمي.',
  },
  {
    need: 'تريد تخطيط شهر أو سنة',
    startHere: 'افتح التقويم السنوي أو الهجري، لأن صفحة الدولة تعرض اليوم الحالي فقط.',
    nextStep: 'ارجع إلى صفحة الدولة إذا أردت معرفة هل اليوم المحلي بدأ فعلاً في ذلك البلد.',
  },
  {
    need: 'تريد موعداً دينياً أو حكومياً',
    startHere: 'استخدم الصفحة للفهم السريع، ثم راجع إعلان الجهة المختصة في البلد.',
    nextStep: 'لا تعتمد على التحويل وحده عند رمضان والعيد والحج وبدايات الأشهر الرسمية.',
  },
];

const SOURCE_LINKS: readonly SourceLink[] = [
  {
    href: 'https://www.iana.org/time-zones',
    label: 'IANA Time Zone Database',
    description: 'مرجع المناطق الزمنية الذي تعتمد عليه أنظمة كثيرة لفهم الوقت المحلي وتغيراته.',
  },
  {
    href: 'https://cldr.unicode.org/',
    label: 'Unicode CLDR',
    description: 'قاعدة بيانات دولية لتنسيق التواريخ والأوقات واللغات والبلدان في البرمجيات.',
  },
  {
    href: 'https://www.ummulqura.org.sa/Index.aspx',
    label: 'تقويم أم القرى',
    description: 'مرجع سعودي للتقويم الهجري وأدوات التاريخ والصلاة والتحويل.',
  },
  {
    href: 'https://www.britannica.com/topic/Gregorian-calendar',
    label: 'Britannica: التقويم الميلادي',
    description: 'خلفية موثوقة عن التقويم الميلادي الشمسي ولماذا يستخدم عالمياً في المعاملات المدنية.',
  },
];

const DATE_COUNTRY_FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: 'ما معنى التاريخ حسب الدولة؟',
    answer:
      'يعني أن تبدأ من البلد الذي يهمك، فتقرأ التاريخ الهجري والميلادي وفق اليوم المحلي لذلك البلد، ثم تنتقل منه إلى الوقت الان أو مواقيت الصلاة أو التحويل. هذا أدق من صفحة عامة عندما يكون السؤال مرتبطاً بسياق محلي.',
  },
  {
    question: 'لماذا قد يختلف التاريخ الهجري بين دولتين؟',
    answer:
      'قد يختلف التاريخ الهجري يوماً واحداً إذا اعتمدت دولة رؤية محلية للهلال أو إعلاناً رسمياً مختلفاً، أو إذا كان الفرق الزمني يجعل بلداً دخل يوماً جديداً قبل بلد آخر. لذلك تعرض صفحات الدول طريقة الحساب وتربط النتيجة بالوقت المحلي.',
  },
  {
    question: 'هل صفحة الدولة بديل عن إعلان الجهة الرسمية؟',
    answer:
      'لا. يمكنك استخدامها للفهم السريع والمشاركة اليومية، لكن المواعيد الدينية والحكومية والحالات القانونية تحتاج مراجعة الجهة الرسمية في البلد نفسه.',
  },
  {
    question: 'هل يمكنني اكتشاف بلدي تلقائياً؟',
    answer:
      'نعم. زر الاكتشاف يستخدم إشارات المتصفح والشبكة والمنطقة الزمنية للوصول إلى أقرب صفحة بلد متاحة. وإذا أردت رابطاً ثابتاً للمشاركة، اختر الدولة يدوياً من القائمة.',
  },
  {
    question: 'متى أستخدم صفحة الدولة بدلاً من محول التاريخ؟',
    answer:
      'استخدم صفحة الدولة عندما تريد تاريخ اليوم المحلي. استخدم محول التاريخ عندما يكون لديك تاريخ محدد وتريد تحويله من هجري إلى ميلادي أو العكس.',
  },
  {
    question: 'هل تعرض الصفحة كل دول العالم؟',
    answer:
      'تعرض الصفحة الدول الأكثر طلباً أولاً، ثم مسارات إضافية مبنية على بيانات الدول المتاحة في ميقاتنا. الهدف أن تصل بسرعة إلى البلد المفيد بدلاً من قراءة قائمة طويلة بلا سياق.',
  },
];

function getCountryDisplayName(country: Country): string {
  return COUNTRY_DISPLAY_NAMES[country.country_slug] ?? country.name_ar;
}

function getCountryReason(country: Country): string {
  return COUNTRY_REASON_BY_SLUG[country.country_slug]
    ?? `افتح ${getCountryDisplayName(country)} عندما تريد تاريخ اليوم المحلي لا نتيجة عامة.`;
}

function buildCountryPathway(country: Country): CountryPathway {
  const name = getCountryDisplayName(country);

  return {
    slug: country.country_slug,
    flag: getFlagEmoji(country.country_code),
    name,
    description: `صفحة مخصصة لمعرفة التاريخ الهجري والميلادي اليوم في ${name} مع روابط الوقت والصلاة والتحويل.`,
    reason: getCountryReason(country),
  };
}

function orderCountriesBySlugs(countries: readonly Country[], slugs: readonly string[]): Country[] {
  const countryBySlug = new Map(countries.map((country) => [country.country_slug, country]));

  return slugs
    .map((slug) => countryBySlug.get(slug))
    .filter((country): country is Country => Boolean(country));
}

function mergeCountryLists(primaryList: readonly Country[], secondaryList: readonly Country[], limit: number): Country[] {
  const seen = new Set<string>();
  const merged: Country[] = [];

  for (const country of [...primaryList, ...secondaryList]) {
    if (seen.has(country.country_slug)) continue;
    seen.add(country.country_slug);
    merged.push(country);
    if (merged.length >= limit) break;
  }

  return merged;
}

export const metadata: Metadata = {
  title: 'التاريخ حسب الدولة | الهجري والميلادي اليوم في بلدك',
  description:
    'اختر بلدك لمعرفة التاريخ الهجري والميلادي اليوم حسب التوقيت المحلي، وافهم متى تستخدم صفحة الدولة ومتى تنتقل إلى المحول أو التقويم.',
  keywords: [...PAGE_KEYWORDS],
  alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    title: 'التاريخ حسب الدولة | التاريخ الهجري والميلادي اليوم',
    description:
      'دليل عربي لاختيار بلدك وقراءة تاريخ اليوم المحلي مع روابط الوقت الان والصلاة والتحويل والتقويم.',
    url: `${BASE_URL}${PAGE_PATH}`,
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'التاريخ حسب الدولة | ميقاتنا',
    description: 'اختر الدولة التي يهمك وقتها واقرأ التاريخ الهجري والميلادي اليوم بدون خلط بين البلد والتوقيت.',
  },
};

export default async function DateCountryRootPage() {
  const now = new Date(await getCachedNowIso());
  const currentYear = now.getUTCFullYear();
  const allCountries = await getAllCountries();
  const prioritySlugs = await getPriorityCountrySlugs(DIRECTORY_COUNTRY_LIMIT);
  const arabCountries = orderCountriesBySlugs(allCountries, ARAB_COUNTRY_SLUGS);
  const priorityCountries = orderCountriesBySlugs(allCountries, prioritySlugs);
  const directoryCountries = mergeCountryLists(arabCountries, priorityCountries, DIRECTORY_COUNTRY_LIMIT);
  const featuredCountries = directoryCountries.slice(0, FEATURED_COUNTRY_LIMIT).map(buildCountryPathway);
  const primaryCountry = featuredCountries.find((country) => country.slug === PRIMARY_COUNTRY_SLUG) ?? featuredCountries[0];
  const secondaryCountries = featuredCountries.filter((country) => country.slug !== primaryCountry?.slug);

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'التاريخ حسب الدولة' },
  ];
  const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumb, BASE_URL);
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'التاريخ حسب الدولة',
    description:
      'دليل عربي لاختيار الدولة وقراءة التاريخ الهجري والميلادي اليوم حسب التوقيت المحلي، مع مسارات الوقت والصلاة والتحويل.',
    url: `${BASE_URL}${PAGE_PATH}`,
    inLanguage: 'ar',
    about: ['تاريخ اليوم', 'التاريخ الهجري', 'التاريخ الميلادي', 'التوقيت المحلي', 'تقويم أم القرى'],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'صفحات التاريخ حسب الدولة',
    itemListElement: featuredCountries.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `التاريخ اليوم في ${item.name}`,
      url: `${BASE_URL}${PAGE_PATH}/${item.slug}`,
    })),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: DATE_COUNTRY_FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema, webPageSchema, itemListSchema, faqSchema]} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <section className="date-hero-panel mb-8" aria-labelledby="date-country-title">
            <div className="date-hero-main">
              <div className="date-kicker">التاريخ حسب الدولة</div>
              <h1 id="date-country-title" className="date-hero-title">
                اختر بلدك لمعرفة التاريخ الهجري والميلادي اليوم
              </h1>
              <p className="date-hero-copy mb-4">
                إذا كنت تسأل: كم التاريخ اليوم في بلدي؟ فابدأ من الدولة. صفحة الدولة تعرض التاريخ
                الهجري والميلادي وفق اليوم المحلي، ثم تساعدك على فتح الوقت الان ومواقيت الصلاة
                ومحول التاريخ من نفس السياق.
              </p>
              <p className="date-hero-copy mb-0">
                هذه الصفحة لا تعطيك رقماً عاماً فقط؛ بل تساعدك على تجنب خطأ شائع: مشاركة تاريخ صحيح
                في بلدك لكنه لم يبدأ بعد في بلد آخر بسبب فرق التوقيت أو اختلاف بداية الشهر الهجري.
              </p>
            </div>
            <div className="date-hero-rail" aria-label="اختيار الدولة">
              <div>
                <div className="date-hero-answer">ابدأ من بلدك</div>
                <p className="date-hero-note mb-0">
                  استخدم الاكتشاف السريع إذا أردت أقرب صفحة لك، أو اختر الدولة يدوياً عندما تريد مشاركة رابط واضح.
                </p>
              </div>
              <div className="date-hero-actions">
                <DateCountryRedirectClient />
                <Link href="/date/today" className="date-hero-link">
                  تاريخ اليوم العام
                  <span aria-hidden="true">←</span>
                </Link>
              </div>
            </div>
          </section>

          <AdTopBanner slotId="top-date-country-list" slotKey="topDateBanner" />

          {primaryCountry && (
            <section className="date-section" aria-labelledby="featured-countries-heading">
              <div className="date-section-head">
                <h2 id="featured-countries-heading" className="date-section-title">
                  دول تبدأ منها الأسئلة غالباً
                </h2>
                <p className="date-section-copy">
                  المنافسون يعرضون تاريخ اليوم في صفحة واحدة غالباً، لكنك تحتاج أحياناً إجابة محلية:
                  بلدك، توقيته، وطريقة فهم الهجري فيه. اختر الدولة التي تهمك أولاً، ثم انتقل منها إلى الأداة المناسبة.
                </p>
              </div>

              <div className="date-country-pathways">
                <Link
                  href={`${PAGE_PATH}/${primaryCountry.slug}`}
                  className="date-country-primary"
                >
                  <span className="date-country-primary__flag" aria-hidden="true">
                    {primaryCountry.flag}
                  </span>
                  <span className="date-country-primary__body">
                    <span className="date-action-meta">مسار موصى به للبدء</span>
                    <span className="date-country-primary__title">
                      التاريخ اليوم في {primaryCountry.name}
                    </span>
                    <span className="date-country-primary__copy">
                      {primaryCountry.description} {primaryCountry.reason}
                    </span>
                    <span className="date-link-action">
                      افتح صفحة {primaryCountry.name} ←
                    </span>
                  </span>
                </Link>

                <div className="date-country-list" aria-label="دول عربية متكررة">
                  {secondaryCountries.map((country) => (
                    <Link
                      key={country.slug}
                      href={`${PAGE_PATH}/${country.slug}`}
                      className="date-country-row"
                    >
                      <span className="date-country-row__flag" aria-hidden="true">
                        {country.flag}
                      </span>
                      <span className="date-country-row__main">
                        <span className="date-country-row__title">
                          {country.name}
                        </span>
                        <span className="date-country-row__copy">
                          {country.reason}
                        </span>
                      </span>
                      <span className="date-link-action">افتح ←</span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {directoryCountries.length > FEATURED_COUNTRY_LIMIT && (
            <section className="date-section" aria-labelledby="country-directory-heading">
              <div className="date-section-head">
                <h2 id="country-directory-heading" className="date-section-title">
                  دول أخرى قد تحتاج تاريخها المحلي
                </h2>
                <p className="date-section-copy">
                  هذه روابط مختصرة إلى صفحات الدول المتاحة. اقرأ الاسم، افتح الصفحة، ثم راجع التاريخين
                  الهجري والميلادي معاً قبل استخدام النتيجة في رسالة أو موعد.
                </p>
              </div>
              <div className="date-country-grid">
                {directoryCountries.slice(FEATURED_COUNTRY_LIMIT).map((country) => (
                  <Link
                    key={country.country_slug}
                    href={`${PAGE_PATH}/${country.country_slug}`}
                    className="date-country-link"
                  >
                    <span className="date-country-flag" aria-hidden="true">
                      {getFlagEmoji(country.country_code)}
                    </span>
                    <span className="date-country-title">
                      {getCountryDisplayName(country)}
                    </span>
                    <span className="date-country-copy">
                      التاريخ اليوم في {getCountryDisplayName(country)} حسب اليوم المحلي.
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="date-editorial-grid date-section" aria-label="شرح اختيار التاريخ حسب الدولة">
            <article className="date-editorial-block">
              <h2 className="date-editorial-title">لماذا لا تكفي صفحة تاريخ عامة دائماً؟</h2>
              <p className="date-editorial-copy m-0">
                لأن التاريخ اليومي مرتبط بالوقت. قد تكون أنت في يوم جديد بينما الشخص الذي تراسله
                في دولة أخرى ما زال في اليوم السابق. وعند الهجري، قد يضيف إعلان بداية الشهر فرقاً
                بسيطاً بين بلد وآخر. لذلك تبدأ من الدولة عندما يكون السؤال محلياً، لا عندما تريد
                معلومة تقويمية عامة فقط.
              </p>
            </article>

            <article className="date-editorial-block">
              <h2 className="date-editorial-title">كيف تقرأ الصفحة دون أن تختلط عليك الأدوات؟</h2>
              <p className="date-editorial-copy m-0">
                صفحة الدولة تجيب عن “ما تاريخ اليوم هنا؟”. محول التاريخ يجيب عن “ما المقابل لتاريخ
                محدد؟”. التقويم يجيب عن “كيف تبدو السنة أو الشهر كاملاً؟”. إذا عرفت الفرق بين هذه
                الأسئلة، ستصل للنتيجة الصحيحة أسرع ولن تنسخ تاريخاً خارج سياقه.
              </p>
            </article>
          </section>

          <section className="date-detail-panel mb-8" aria-labelledby="date-country-decision-heading">
            <h2 id="date-country-decision-heading" className="date-section-title">
              قاعدة القرار: من أين تبدأ؟
            </h2>
            <div className="date-detail-list">
              {DECISION_ROWS.map((row) => (
                <div key={row.need} className="date-detail-row">
                  <span className="date-detail-label">{row.need}</span>
                  <span className="date-detail-value">
                    {row.startHere} {row.nextStep}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="related-links mb-8" dir="rtl" aria-labelledby="date-country-sources-heading">
            <p id="date-country-sources-heading" className="related-links__heading">
              مصادر ومنهج عرض التاريخ حسب الدولة
            </p>
            <div className="related-links__grid">
              {SOURCE_LINKS.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  className="related-link-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="related-link-card__body">
                    <span className="related-link-card__label">{source.label}</span>
                    <span className="related-link-card__desc">{source.description}</span>
                  </span>
                  <span className="related-link-card__arrow" aria-hidden="true">←</span>
                </a>
              ))}
            </div>
          </section>

          <section className="date-section mb-10" aria-labelledby="date-country-faq-heading">
            <div className="date-section-head">
              <h2 id="date-country-faq-heading" className="date-section-title">
                أسئلة قبل اختيار تاريخ دولة معينة
              </h2>
              <p className="date-section-copy">
                اقرأ هذه الإجابات إذا كنت تختار بين صفحة الدولة، تاريخ اليوم العام، المحول، أو التقويم.
              </p>
            </div>
            <div className="date-faq-grid">
              {DATE_COUNTRY_FAQ_ITEMS.map((item) => (
                <article key={item.question} className="date-faq-item">
                  <h3 className="date-faq-question">{item.question}</h3>
                  <p className="date-faq-copy m-0">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <nav aria-label="مسارات متابعة التاريخ المحلي حسب الدولة" className="related-links" dir="rtl">
            <p className="related-links__heading">إذا كنت تريد ربط التاريخ المحلي بالوقت أو الصلاة</p>
            <div className="related-links__grid">
              <Link href="/time-now" className="related-link-card">
                <span className="related-link-card__body">
                  <span className="related-link-card__label">الوقت الان</span>
                  <span className="related-link-card__desc">ابدأ من الدولة أو المدينة لمعرفة الساعة الحالية قبل اعتماد التاريخ</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>
              <Link href="/mwaqit-al-salat" className="related-link-card">
                <span className="related-link-card__body">
                  <span className="related-link-card__label">مواقيت الصلاة</span>
                  <span className="related-link-card__desc">اربط التاريخ المحلي بأوقات الصلاة عندما يكون اليوم الهجري مهماً لعبادة أو مناسبة</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>
              <Link href={`/date/calendar/${currentYear}`} className="related-link-card">
                <span className="related-link-card__body">
                  <span className="related-link-card__label">تقويم {currentYear}</span>
                  <span className="related-link-card__desc">افتح السنة الميلادية كاملة عندما تحتاج أكثر من تاريخ اليوم فقط</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>
              <Link href="/date/converter" className="related-link-card">
                <span className="related-link-card__body">
                  <span className="related-link-card__label">محول التاريخ</span>
                  <span className="related-link-card__desc">حوّل تاريخاً محدداً بين الهجري والميلادي بدل الاكتفاء بتاريخ اليوم</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>
            </div>
          </nav>
        </main>
      </AdLayoutWrapper>
    </>
  );
}

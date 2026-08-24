import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Clock3, MapPin, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import { getCountriesAction } from '@/app/actions/location';
import AdInArticle from '@/components/ads/AdInArticle';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdMultiplex from '@/components/ads/AdMultiplex';
import AdTopBanner from '@/components/ads/AdTopBanner';
import SearchCity from '@/components/SearchCityWrapper.client';
import TimeNowHero from '@/components/time-now/TimeNowHero';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildTimeNowKeywords } from '@/lib/seo/section-search-intent';
import { getSiteUrl } from '@/lib/site-config';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';

import TimeNowClient from './TimeNowClient';
import styles from './time-now.module.css';

const SITE_URL = getSiteUrl();
const ARAB_COUNTRY_CODES = ['SA', 'EG', 'AE', 'KW', 'QA', 'BH', 'OM', 'IQ', 'JO', 'LB', 'SY', 'PS', 'YE', 'MA', 'DZ', 'TN', 'LY', 'SD', 'SO', 'MR', 'DJ'];
const TIME_NOW_FAQ_ITEMS = [
  {
    question: 'كيف أعرف الوقت الان في مدينتي؟',
    answer:
      'اكتب اسم المدينة في مربع البحث، ثم اختر النتيجة الأقرب. ستصل إلى صفحة تعرض الساعة الحالية، تاريخ اليوم، والمنطقة الزمنية، وروابط تساعدك إذا أردت مقارنة الوقت مع مدينة أخرى.',
  },
  {
    question: 'هل صفحات الوقت الان تشمل الدول والمدن العربية؟',
    answer:
      'نعم، نرتب الدول العربية أولاً لأن أغلب الزوار يبحثون عن الرياض، القاهرة، دبي، الدوحة، الكويت، الرباط، عمّان، وبقية العواصم والمدن اليومية. إذا لم تجد المدينة في الاختصارات، استخدم البحث أو صفحة الدولة للوصول إليها.',
  },
  {
    question: 'هل تعرض الصفحة التوقيت المحلي بدقة؟',
    answer:
      'يعتمد العرض على المنطقة الزمنية المرتبطة بالمدينة أو الدولة، ويحدّث الساعة بشكل حي. عند وجود توقيت صيفي أو تغيير موسمي، لا تعتمد على فرق محفوظ من الذاكرة، بل افتح صفحة المدينة أو استخدم حاسبة فرق التوقيت.',
  },
  {
    question: 'ما الصفحات المرتبطة بالوقت الان داخل الموقع؟',
    answer:
      'بعد معرفة الساعة يمكنك الانتقال إلى فرق التوقيت إذا كان لديك اتصال أو اجتماع، تاريخ اليوم إذا كان السؤال مرتبطاً بتوثيق موعد، أو المناسبات القادمة إذا كنت تخطط لسفر أو إجازة.',
  },
  {
    question: 'ما الفرق بين الوقت المحلي وUTC أو GMT؟',
    answer:
      'الوقت المحلي هو الساعة التي يعيش بها أهل المدينة الآن. أما UTC فهو مرجع عالمي تُقاس منه الفروقات، مثل UTC+3 أو UTC-4. إذا كنت ترتب اجتماعاً دولياً، لا تحفظ فرقاً قديماً؛ افتح صفحة المدينة أو فرق التوقيت لأن التوقيت الصيفي قد يغير الفرق خلال السنة.',
  },
  {
    question: 'هل يكفي أن أعرف الساعة الان قبل اجتماع أو رحلة؟',
    answer:
      'إذا كان السؤال سريعاً فمعرفة الساعة تكفي. أما للاجتماعات والرحلات والمواعيد العابرة لمنتصف الليل، فالأفضل أن تراجع فرق التوقيت والتاريخ المحلي أيضاً حتى لا تختار وقتاً يقع في يوم مختلف عند الطرف الآخر.',
  },
];
const TIME_NOW_UTILITY_LINKS = [
  {
    href: '/time-difference',
    label: 'حاسبة فرق التوقيت',
    description: 'قارن الوقت بين أي مدينتين أو دولتين مباشرة بعد معرفة الوقت الحالي في كل منهما.',
  },
  {
    href: '/date/today',
    label: 'تاريخ اليوم',
    description: 'راجع التاريخ الهجري والميلادي اليوم ثم افتح التحويل أو التقويم عند الحاجة.',
  },
  {
    href: '/holidays',
    label: 'المناسبات القادمة',
    description: 'استكشف العد التنازلي للأعياد والمناسبات والإجازات الرسمية المرتبطة بالتاريخ الحالي.',
  },
  {
    href: '/tools',
    label: 'كل الحاسبات والأدوات',
    description: 'تصفح جميع فئات الأدوات: المال والعمل، الصحة، البناء، التعليم، والمزيد من مكان واحد.',
  },
];
const TIME_NOW_SOURCE_LINKS = [
  {
    href: 'https://www.iana.org/time-zones',
    label: 'IANA Time Zone Database',
    description: 'المرجع التقني الأهم لأسماء المناطق الزمنية مثل Asia/Riyadh وAfrica/Cairo.',
  },
  {
    href: 'https://www.bipm.org/en/time-ftp/utc',
    label: 'BIPM UTC',
    description: 'مرجع التوقيت العالمي المنسق UTC الذي تُقاس منه الفروقات الزمنية.',
  },
  {
    href: 'https://www.timeanddate.com/time/dst/',
    label: 'Daylight Saving Time',
    description: 'شرح عملي للتوقيت الصيفي ولماذا تتغير فروق الساعات بين المدن خلال السنة.',
  },
];
const TIME_NOW_SEARCH_EXAMPLES = ['الرياض', 'القاهرة', 'دبي', 'الدوحة', 'الكويت', 'الرباط'];
const TIME_NOW_NEXT_STEP_TAGS = ['اجتماع', 'تاريخ', 'مناسبة', 'أدوات'];
const TIME_NOW_NEXT_STEP_TONES = ['blue', 'green', 'amber', 'rose'];

export const metadata = buildCanonicalMetadata({
  title: 'كم الساعة الآن؟ — توقيت حي في 100+ مدينة عربية وعالمية',
  description:
    'الوقت الآن في أي مدينة أو دولة بالثانية — الرياض، القاهرة، دبي، لندن، نيويورك وأكثر من 100 مدينة. يشمل التاريخ المحلي والمنطقة الزمنية وفرق التوقيت.',
  keywords: buildTimeNowKeywords(),
  url: `${SITE_URL}/time-now`,
});

export default function TimeNowPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'الوقت الان في العالم والدول والمدن',
    url: `${SITE_URL}/time-now`,
    description:
      'صفحة عربية تجمع الوقت الان في الدول والمدن العربية والعالمية مع التاريخ المحلي والمنطقة الزمنية وروابط فرق التوقيت والتاريخ.',
    inLanguage: 'ar',
    isPartOf: {
      '@type': 'WebSite',
      name: 'ميقاتنا',
      url: SITE_URL,
    },
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: '/time-now',
    name: 'أداة الوقت الان في المدن والدول',
    description:
      'أداة عربية مجانية لمعرفة الوقت الان في أي مدينة أو دولة، مع التاريخ المحلي والمنطقة الزمنية ومسارات فورية إلى فرق التوقيت والتاريخ اليوم.',
    about: [
      'الوقت الان',
      'الساعة الان',
      'الوقت الآن',
      'الساعة الآن',
      'التوقيت المحلي',
      'المنطقة الزمنية',
      'الوقت في المدن والدول',
    ],
    keywords: buildTimeNowKeywords(),
  });
  return (
    <div className={`${styles.page} min-h-screen bg-base text-primary`} dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <AdLayoutWrapper layout="wide" sidebarMode="dual">
        <main className={styles.main}>
        {/* First thing on the page, before the breadcrumb/H1 — see
            AdTopBanner.tsx v3. */}
        <AdTopBanner slotId="top-time-now-hub" />

        <section className={styles.heroShell} aria-labelledby="time-now-heading">
          <header className={styles.hero}>
            <div className={styles.heroBadge}>
              <Search size={13} aria-hidden />
              بحث مباشر عن الوقت الان
            </div>
            <h1 id="time-now-heading" className={styles.heroTitle}>
              كم الساعة الان في <span className={styles.heroAccent}>مدينتك</span>؟
            </h1>
            <p className={styles.heroLead}>
              اكتب اسم المدينة لتصل إلى صفحتها بالساعة الحية والتاريخ والمنطقة الزمنية، أو تحقق من ساعتك المحلية مباشرة أدناه.
            </p>
          </header>

          <div className={styles.searchPanel}>
            <div className={styles.searchPanelHeader}>
              <span className={styles.searchPanelKicker}>الخطوة الأولى</span>
              <h2 id="time-now-search-heading" className={styles.searchPanelTitle}>
                ابحث عن المدينة
              </h2>
            </div>
            <div className={styles.searchCommandShell}>
              <SearchCity mode="time-now" />
            </div>
            <div className={styles.searchSuggestionRow} aria-label="أمثلة بحث سريعة">
              {TIME_NOW_SEARCH_EXAMPLES.map((cityName) => (
                <span key={cityName}>{cityName}</span>
              ))}
            </div>
          </div>

          <div className={styles.orDivider}>
            <span className={styles.orDividerLine} aria-hidden="true" />
            <h2 id="time-now-local-clock-heading" className={styles.orDividerLabel}>
              <Clock3 size={13} aria-hidden />
              أو تحقق من توقيتك المحلي الآن
            </h2>
            <span className={styles.orDividerLine} aria-hidden="true" />
          </div>

          <div className={styles.clockSection} aria-labelledby="time-now-local-clock-heading">
            <Suspense fallback={<div className={styles.heroSkeleton} />}>
              <TimeNowHero cityNameAr="توقيتك المحلي" />
            </Suspense>
          </div>
        </section>

        <AdInArticle slotId="mid-time-now-hub" />

        <Suspense fallback={<TimeNowLandingSectionsFallback />}>
          <TimeNowLandingSections />
        </Suspense>
          <AdMultiplex slotId="end-time-now-hub" />
        </main>
      </AdLayoutWrapper>
    </div>
  );
}

async function TimeNowLandingSections() {
  const allCountries = await getCountriesAction();
  const safeCountries = Array.isArray(allCountries) ? allCountries : [];
  const arabCountries = safeCountries.filter((country) => ARAB_COUNTRY_CODES.includes(country.country_code));
  const worldCountries = safeCountries.filter((country) => !ARAB_COUNTRY_CODES.includes(country.country_code));

  return (
    <>
      <section className={`${styles.section} ${styles.nextStepSection}`}>
        <TimeNowNextSteps links={TIME_NOW_UTILITY_LINKS.slice(0, 4)} />
      </section>

      <section aria-labelledby="browse-time-now-archive-heading" className={`${styles.section} ${styles.archiveSection}`}>
        <div className={styles.panel}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionKicker}>
              <MapPin size={13} aria-hidden />
              إذا لم تعرف المدينة
            </span>
            <h2 id="browse-time-now-archive-heading" className={styles.sectionTitle}>
              اختر الدولة ثم افتح المدينة الأقرب
            </h2>
            <p className={styles.sectionCopy}>
              البحث هو الطريق الأسرع، لكن قائمة الدول تفيدك عندما تريد استكشاف مدن بلد كامل أو مشاركة رابط ثابت.
            </p>
          </div>

          <Suspense
            fallback={(
              <div className={styles.fallbackGrid}>
                {Array.from({ length: 21 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className={styles.chipSkeleton}
                  />
                ))}
              </div>
            )}
          >
            <TimeNowClient arabCountries={arabCountries} worldCountries={worldCountries} />
          </Suspense>
        </div>
      </section>

      <section aria-labelledby="time-now-method-heading" className={`${styles.section} ${styles.guidedSection}`}>
        <div className={styles.panel}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionKicker}>اختيار سريع</span>
            <h2 id="time-now-method-heading" className={styles.sectionTitle}>
              متى تكفيك الساعة الحالية، ومتى تحتاج خطوة إضافية؟
            </h2>
            <p className={styles.sectionCopy}>
              السؤال عن الوقت يبدو بسيطاً، لكن الاستخدام يختلف: مرة تريد معرفة الساعة فقط،
              ومرة تريد قراراً عملياً لمكالمة أو صلاة أو موعد يمتد بين بلدين.
            </p>
          </div>

          <ul className={styles.methodList}>
            <li className={styles.methodRow}>
              <span className={styles.methodIndex} aria-hidden="true">1</span>
              <p className={styles.methodRowText}>
                <strong>تريد معرفة الساعة الان فقط؟</strong> اقرأ الساعة من بطاقة المدينة مباشرة، هذا يكفي لمعرفة الوقت أو مشاركته.
              </p>
            </li>
            <li className={styles.methodRow}>
              <span className={styles.methodIndex} aria-hidden="true">2</span>
              <p className={styles.methodRowText}>
                <strong>عندك مكالمة أو اجتماع؟</strong> افتح فرق التوقيت لتعرف من يسبق ومن يتأخر، خصوصاً إذا غيّر التوقيت الصيفي الفرق بينكما.
              </p>
            </li>
            <li className={styles.methodRow}>
              <span className={styles.methodIndex} aria-hidden="true">3</span>
              <p className={styles.methodRowText}>
                <strong>الوقت مرتبط برحلة أو موعد رسمي؟</strong> افتح تاريخ اليوم لتربط الساعة بالتاريخ الصحيح قبل أن تقرر.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="time-now-sources-heading" className={`${styles.section} ${styles.sourceSection}`}>
        <div className={styles.panel}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionKicker}>مصادر الوقت</span>
            <h2 id="time-now-sources-heading" className={styles.sectionTitle}>
              لماذا لا نعتمد على فرق ساعات محفوظ؟
            </h2>
            <p className={styles.sectionCopy}>
              المناطق الزمنية ليست أرقاماً ثابتة دائماً. بعض الدول تطبق التوقيت الصيفي، وبعض المدن تتبع قواعد محلية، لذلك نربط الصفحات بمناطق زمنية معروفة بدلاً من فرق يدوي قابل للخطأ.
            </p>
          </div>

          <ul className={styles.sourceList}>
            {TIME_NOW_SOURCE_LINKS.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  className={styles.sourceRow}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.sourceRowBody}>
                    <strong className={styles.sourceRowTitle}>{source.label}</strong>
                    <span className={styles.sourceRowDescription}>{source.description}</span>
                  </span>
                  <ArrowUpRight size={16} aria-hidden className={styles.sourceRowIcon} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${styles.section} ${styles.faqSection}`} aria-labelledby="time-now-faq-heading">
        <div className={styles.panel}>
          <div className={styles.sectionHead}>
            <h2 id="time-now-faq-heading" className={styles.sectionTitle}>
              أسئلة سريعة عن الوقت الان
            </h2>
          </div>
          <div className={styles.faqGrid}>
            {TIME_NOW_FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className={styles.faqCard}
              >
                <summary className={styles.faqTitle}>
                  {item.question}
                </summary>
                <p className={styles.faqCopy}>
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function TimeNowNextSteps({ links }) {
  const safeLinks = Array.isArray(links)
    ? links.filter((link) => link?.href && link?.label).slice(0, 4)
    : [];

  if (safeLinks.length === 0) return null;

  return (
    <nav className={styles.nextStepsPanel} aria-label="خطوات تكمل معرفة الوقت الان">
      <div className={styles.sectionHead}>
        <span className={styles.sectionKicker}>بعد معرفة الساعة</span>
        <h2 className={styles.sectionTitle}>ما الخطوة التي تحتاجها الآن؟</h2>
        <p className={styles.sectionCopy}>
          اختر مساراً واحداً فقط حسب سبب بحثك عن الوقت: اجتماع، تاريخ، أو مناسبة قادمة.
        </p>
      </div>
      <div className={styles.nextStepList}>
        {safeLinks.map((link, index) => (
          <Link key={link.href} href={link.href} className={styles.nextStepLink} data-tone={TIME_NOW_NEXT_STEP_TONES[index] || 'blue'}>
            <span className={styles.nextStepTag}>{TIME_NOW_NEXT_STEP_TAGS[index] || 'خطوة'}</span>
            <span className={styles.nextStepCopy}>
              <span className={styles.nextStepTitle}>{link.label}</span>
              <span className={styles.nextStepDescription}>{link.description}</span>
            </span>
            <span className={styles.nextStepAction}>
              افتح
              <ArrowLeft size={14} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function TimeNowLandingSectionsFallback() {
  return (
    <div className={styles.fallbackStack}>
      <section className="card" aria-hidden="true">
        <Skeleton className={styles.skeletonTitleMedium} />
        <Skeleton className={styles.skeletonLineFull} />
        <Skeleton className={styles.skeletonLineMedium} />
        <div className={styles.fallbackCards}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={`time-now-next-step-${index}`}
              className={styles.popularCitySkeleton}
            />
          ))}
        </div>
      </section>

      <section aria-hidden="true" className={styles.fallbackGrid}>
        {Array.from({ length: 21 }).map((_, index) => (
          <Skeleton
            key={`time-now-country-chip-${index}`}
            className={styles.chipSkeleton}
          />
        ))}
      </section>
    </div>
  );
}

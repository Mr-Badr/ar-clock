/**
 * app/holidays/page.jsx
 * Static-first holidays landing page with client-synced query filters.
 */
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';

import {
  approxHijriYear,
  buildBreadcrumbSchema,
} from '@/lib/holidays-engine';
import { getInitialEvents } from './data';
import HolidaysClient from './HolidaysClient';
import { getCachedNowIso } from '@/lib/date-utils';
import HolidaysSections from '@/components/holidays/index';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';
import { appendToolDiscoveryLinks } from '@/lib/seo/discovery-links';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';
import { normalizeHolidayFilter } from './holidays-filter-utils';
import { logger, serializeError } from '@/lib/logger';
import styles from './HolidaysV4.module.css';

const SITE = getSiteUrl();

async function getHolidaysNow(routePath) {
  try {
    const nowIso = await getCachedNowIso();
    const now = new Date(nowIso);
    if (Number.isNaN(now.getTime())) {
      throw new Error('getCachedNowIso returned an invalid ISO date');
    }
    return { now, nowIso };
  } catch (error) {
    logger.warn('holidays-current-date-fallback-used', {
      routePath,
      error: serializeError(error),
    });
    const now = new Date();
    return { now, nowIso: now.toISOString() };
  }
}

function isValidEvent(event) {
  return Boolean(
    event
      && typeof event === 'object'
      && typeof event.slug === 'string'
      && event.slug.trim().length > 0
      && typeof event.name === 'string'
      && event.name.trim().length > 0,
  );
}

function normalizeInitialEventsData(data) {
  const events = Array.isArray(data?.events) ? data.events.filter(isValidEvent) : [];
  const total = Number.isFinite(data?.total) ? data.total : events.length;
  const nextCursor = data?.nextCursor ?? null;

  return {
    events,
    total,
    nextCursor,
  };
}

/* ── Dynamic metadata ────────────────────────────────────────────────── */
export async function generateMetadata() {
  const { now } = await getHolidaysNow('/holidays');
  const gr = now.getFullYear();
  const hi = approxHijriYear(gr);
  return {
    title: `كم باقي على المناسبات القادمة؟ عداد عربي وتواريخ ${gr}`,
    description: `تابع المناسبات القادمة في ${SITE_BRAND}: عداد مباشر، تاريخ هجري وميلادي، تصفية حسب البلد والنوع، وتنبيهات واضحة عند اختلاف التواريخ الهجرية أو الإجازات الرسمية.`,
    keywords: `كم باقي على المناسبات, عداد المناسبات القادمة, كم باقي على رمضان ${gr}, كم باقي على العيد ${gr}, المناسبات الإسلامية ${hi}, المناسبات الوطنية العربية, العطل الرسمية ${gr}, المناسبات المدرسية, العد التنازلي للأعياد, مواعيد الدعم والرواتب`,
    alternates: { canonical: `${SITE}/holidays`, languages: { ar: `${SITE}/holidays` } },
    robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    openGraph: {
      title: `كم باقي على رمضان والعيد والمناسبات القادمة؟`,
      description: `عداد عربي للمناسبات القادمة مع التاريخين الهجري والميلادي وتصفية حسب البلد والنوع.`,
      locale: 'ar_SA', type: 'website', url: `${SITE}/holidays`,
    },
  };
}

const DEFAULT_FILTER = normalizeHolidayFilter();
const HOLIDAY_QUICK_PATHS = [
  {
    href: '/holidays?category=islamic',
    eyebrow: 'ديني وهجري',
    title: 'المناسبات الإسلامية',
    description: 'رمضان والعيدان وليلة القدر وعاشوراء مع تنبيه اختلاف الرؤية المحلية.',
  },
  {
    href: '/holidays?country=sa',
    eyebrow: 'حسب البلد',
    title: 'المناسبات في السعودية',
    description: 'ابدأ بالدولة عندما تبحث عن إجازة رسمية أو موعد دفع أو تقويم مدرسي.',
  },
  {
    href: '/holidays?range=month',
    eyebrow: 'هذا الشهر',
    title: 'الأقرب زمنيًا',
    description: 'قلّل النتائج إلى المواعيد القريبة التي يمكن أن تؤثر في خطتك الآن.',
  },
  {
    href: '/date/today',
    eyebrow: 'مرجع سريع',
    title: 'التاريخ اليوم',
    description: 'راجع التاريخ الهجري والميلادي قبل تحويل موعد أو مقارنة مناسبة.',
  },
];

const HOLIDAY_READING_RULES = [
  {
    title: 'ابدأ بالموعد الأقرب، لا بالقائمة الأطول',
    description: 'إذا كانت المناسبة خلال أيام قليلة فافتح صفحتها أولاً. ستجد العدّاد والتاريخين ثم التفاصيل التي تساعدك على التخطيط بدون مقارنة عشرات النتائج.',
  },
  {
    title: 'راجع نوع التاريخ قبل الاعتماد النهائي',
    description: 'المناسبات الهجرية قد تختلف محلياً بحسب الرؤية أو الإعلان الرسمي، أما التواريخ الثابتة فتبقى في نفس اليوم الميلادي غالباً.',
  },
  {
    title: 'حوّل التاريخ عند الحجز أو السفر',
    description: 'عندما يرتبط الموعد بإجازة أو رحلة أو دفع، حوّل التاريخ وتأكد من بلدك قبل أن تبني قراراً على العدّاد وحده.',
  },
];

const HOLIDAY_TRUST_RULES = [
  {
    title: 'العداد يقرّبك من الموعد، لكنه ليس إعلاناً رسمياً',
    description: 'استخدمه للتخطيط الأولي، ثم راجع الجهة الرسمية في بلدك عندما يتعلق الأمر بإجازة عمل، مدرسة، سفر، أو موعد دفع.',
    href: '/disclaimer',
    label: 'حدود الاعتماد',
  },
  {
    title: 'التاريخ الهجري قد يختلف محلياً',
    description: 'رمضان والعيدان وعرفة وبداية الأشهر قد تتغير يوماً حسب الرؤية أو الإعلان المحلي. لذلك نوضح طريقة الحساب عندما تكون مهمة.',
    href: '/date/hijri-to-gregorian',
    label: 'حوّل التاريخ الهجري',
  },
  {
    title: 'ابدأ من البلد عند البحث عن إجازة',
    description: 'اسم المناسبة وحده لا يكفي دائماً. الدولة تحدد هل اليوم إجازة، هل يوجد تعويض، وهل التاريخ عملي أم مجرد مناسبة عامة.',
    href: '/holidays?country=sa',
    label: 'اختر دولة',
  },
];

/* ── Page ────────────────────────────────────────────────────────────── */
export default async function HolidaysPage() {
  /* ── Schemas ──────────────────────────────────────────────────────── */
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'الرئيسية', url: SITE },
    { name: 'المناسبات', url: `${SITE}/holidays` },
  ]);
  const websiteSchema = {
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: `${SITE_BRAND}: عداد المواعيد`, url: SITE, inLanguage: 'ar',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE}/holidays?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  const orgSchema = {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: `${SITE_BRAND}: عداد المواعيد`, url: SITE,
    logo: { '@type': 'ImageObject', url: `${SITE}/icons/icon-512.png`, width: 512, height: 512 },
    description: 'منصة عربية تعرض العد التنازلي للمناسبات الإسلامية والوطنية والمدرسية ومواعيد الدعم، مع توضيح حدود التاريخ الهجري والإعلانات الرسمية.',
    inLanguage: 'ar',
    areaServed: ['SA', 'EG', 'MA', 'DZ', 'AE', 'TN', 'KW', 'QA'],
    sameAs: [`${SITE}`],
    knowsAbout: ['التقويم الهجري', 'المناسبات الإسلامية', 'العد التنازلي', 'تقويم أم القرى', 'رمضان', 'عيد الفطر', 'عيد الأضحى'],
  };

  /* ── Date / year resolution ─────────────────────────────────────── */
  const [{ now, nowIso }, initialData] = await Promise.all([
    getHolidaysNow('/holidays'),
    getInitialEvents(DEFAULT_FILTER),
  ]);
  const defaultData = normalizeInitialEventsData(initialData);
  const gr = now.getFullYear();
  const hi = approxHijriYear(gr);
  const utilityLinks = appendToolDiscoveryLinks([
    {
      href: '/date/today',
      label: 'كم التاريخ اليوم؟',
      description: 'اعرف التاريخ الهجري والميلادي اليوم ثم انتقل إلى المناسبات المرتبطة به مباشرة.',
    },
    {
      href: '/mwaqit-al-salat',
      label: 'مواقيت الصلاة اليوم',
      description: 'اربط بين التاريخ الحالي والمواقيت اليومية عند متابعة رمضان والأعياد والمناسبات الإسلامية.',
    },
    {
      href: '/time-now',
      label: 'كم الساعة الان؟',
      description: 'راجع الوقت الحالي في مدينتك أو دولة أخرى عند متابعة العدادات المباشرة والمناسبات الدولية.',
    },
  ]);
  const featuredEventLinks = defaultData.events.slice(0, 12).map((event, index) => ({
    position: index + 1,
    href: `/holidays/${event.slug}`,
    title: event.name,
    description: `${event._formatted || 'تاريخ قادم'}، متبقي ${Number.isFinite(event._daysLeft) ? event._daysLeft : 'غير محدد'} يوم`,
  }));
  const holidaysCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `المناسبات القادمة ${gr}`,
    url: `${SITE}/holidays`,
    inLanguage: 'ar',
    description: 'صفحة تجمع المناسبات القادمة مع عد تنازلي مباشر وتاريخ هجري وميلادي وتصفية حسب البلد والنوع وسياق عملي لكل مناسبة.',
    mainEntity: {
      '@type': 'ItemList',
      name: 'أقرب المناسبات القادمة',
      numberOfItems: featuredEventLinks.length,
      itemListElement: featuredEventLinks.map((item) => ({
        '@type': 'ListItem',
        position: item.position,
        name: item.title,
        url: `${SITE}${item.href}`,
      })),
    },
  };
  const upcomingEventsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'أقرب المناسبات القادمة',
    itemListElement: featuredEventLinks.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.title,
      url: `${SITE}${item.href}`,
    })),
  };

  // NOTE: FAQPage schema is emitted by HolidaysGlobalSchemas (via HolidaysSections below).
  // Do NOT add a second FAQPage here — Google flags "Duplicate field FAQPage" and
  // invalidates both schemas, making the page ineligible for FAQ rich results.

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <div className="bg-base" style={{ minHeight: '100dvh' }} dir="rtl">
      {/* JSON-LD schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(holidaysCollectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(upcomingEventsSchema) }} />

      
      <main className={styles.pageShell}>
        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <nav
          aria-label="breadcrumb"
          className={styles.breadcrumb}
        >
          <Link href="/">
            الرئيسية
          </Link>
          <span aria-hidden>/</span>
          <span aria-current="page">المناسبات</span>
        </nav>

        {/* ── Primary task: search and results ───────────────────────── */}
        <section aria-labelledby="events-heading" className={styles.primaryTaskSection}>
          <div className={styles.primaryTaskIntro}>
            <div className={styles.heroBadge}>
              <Calendar size={13} aria-hidden="true" />
              عداد المواعيد
            </div>
            <h1 id="events-heading" className={styles.heroTitle}>
              المناسبات القادمة والعدّ التنازلي في مكان واحد
            </h1>
            <p className={styles.heroLead}>
              ابحث باسم المناسبة أو اختر الدولة والنوع، وستجد أقرب المواعيد أولاً مع التاريخين والمدة المتبقية وما يجب التأكد منه قبل الاعتماد على الموعد.
            </p>
            <div className={styles.heroMeta} aria-label="سياق السنة الحالية">
              <span>السنة الميلادية {gr}</span>
              <span>تقريباً {hi} هـ</span>
              <span>التصفية تعمل بدون مغادرة الصفحة</span>
            </div>
          </div>
          <HolidaysClient
            initialEvents={defaultData.events}
            initialNextCursor={defaultData.nextCursor}
            initialTotal={defaultData.total}
            initialFilters={DEFAULT_FILTER}
          />
        </section>

        <section aria-labelledby="holidays-quick-start-heading" className={styles.journeySection}>
          <div className={styles.sectionHead}>
            <h2 id="holidays-quick-start-heading" className={styles.sectionTitle}>
              اختصارات مفيدة بعد البحث
            </h2>
            <p className={styles.sectionLead}>
              لا تحتاج إلى تصفح كل شيء. اختر واحداً من هذه المسارات عندما تعرف أنك تريد مناسبة دينية، دولة محددة، موعداً قريباً، أو تاريخ اليوم.
            </p>
          </div>

          <div className={styles.quickPathGrid}>
            {HOLIDAY_QUICK_PATHS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.quickPath}
              >
                <span className={styles.cardEyebrow}>{item.eyebrow}</span>
                <strong className={styles.cardTitle}>{item.title}</strong>
                <span className={styles.cardCopy}>{item.description}</span>
                <span className={styles.cardAction}>
                  افتح
                  <ArrowLeft size={14} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="holidays-reading-heading" className={styles.guideSection}>
          <div className={styles.guidePanel}>
            <div className={styles.sectionHead}>
              <h2 id="holidays-reading-heading" className={styles.sectionTitle}>
                كيف تستخدم العدّاد بدون قرار متسرع؟
              </h2>
              <p className={styles.sectionLead}>
                العدّاد يجيب عن سؤال “كم بقي؟”، لكن القرار العملي يحتاج خطوة إضافية:
                هل التاريخ ثابت، هل يختلف حسب البلد، وهل تحتاج تحويله قبل الحجز أو الترتيب؟
              </p>
            </div>
            <div className={styles.guideGrid}>
              <div className={styles.readingList}>
                {HOLIDAY_READING_RULES.map((rule, index) => (
                  <article key={rule.title} className={styles.readingItem}>
                    <span className={styles.readingNumber}>{index + 1}</span>
                    <div>
                      <h3 className={styles.compactTitle}>{rule.title}</h3>
                      <p className={styles.compactCopy}>{rule.description}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className={styles.trustList} aria-label="حدود الاعتماد على العدادات">
                {HOLIDAY_TRUST_RULES.map((rule) => (
                  <article key={rule.title} className={styles.trustItem}>
                    <h3 className={styles.compactTitle}>{rule.title}</h3>
                    <p className={styles.compactCopy}>{rule.description}</p>
                    <Link href={rule.href} className={styles.trustLink}>
                      {rule.label}
                      <ArrowLeft size={14} aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.followupSection}>
          <GeoInternalLinks
            title="خطوتك التالية بعد اختيار مناسبة"
            description="من يتابع رمضان أو العيد أو مناسبة قادمة يحتاج غالباً إلى تاريخ اليوم، مواقيت الصلاة، أو الوقت الان. اختر المسار الذي يكمّل التخطيط بدلاً من فتح صفحات كثيرة."
            links={utilityLinks.slice(0, 3)}
            ariaLabel="خطوات تكمل متابعة المناسبات"
          />
        </section>
      </main>
      <HolidaysSections nowIso={nowIso} />
    </div>
  );
}

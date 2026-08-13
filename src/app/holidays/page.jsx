/**
 * app/holidays/page.jsx
 * Static-first holidays landing page with client-synced query filters.
 */
import Link from 'next/link';
import { ArrowLeft, Calendar, Compass, CalendarCheck, ArrowLeftRight, ShieldAlert, CalendarDays, Clock3 } from 'lucide-react';

import {
  approxHijriYear,
  buildBreadcrumbSchema,
} from '@/lib/holidays-engine';
import { getInitialEvents, getFacetCounts } from './data';
import HolidaysClient from './HolidaysClient';
import { getCachedNowIso } from '@/lib/date-utils';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdMultiplex from '@/components/ads/AdMultiplex';
import AdTopBanner from '@/components/ads/AdTopBanner';
import HolidaysSections from '@/components/holidays/index';
import { SiteRelatedCardGrid } from '@/components/shared/SiteRelatedCardGrid';
import CountryFlag from '@/components/shared/CountryFlag';
import { COUNTRY_HUBS } from '@/lib/holidays/country-hub-data';
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

// Consolidated from two overlapping lists (reading rules + trust rules, 6 items with real
// duplication — e.g. "الهجري قد يختلف محلياً" appeared in both) into one tight list (owner,
// 2026-08-13: "better content not boaring"). Each rule owns one real idea, no repeated links to
// destinations already covered by the quick-start shortcuts above or the related cards below.
const HOLIDAY_QUICK_RULES = [
  {
    title: 'ابدأ بالأقرب، لا بأطول قائمة',
    description: 'إذا كانت المناسبة خلال أيام قليلة، افتح صفحتها مباشرة — العدّاد والتاريخين والتفاصيل هناك، دون مقارنة عشرات النتائج.',
    Icon: Compass,
  },
  {
    title: 'تحقق من نوع التاريخ',
    description: 'الهجري قد يختلف يوماً حسب رؤية الهلال أو الإعلان المحلي، أما الثابت فيبقى في نفس اليوم الميلادي غالباً.',
    Icon: CalendarCheck,
  },
  {
    title: 'حوّل التاريخ قبل الحجز أو السفر',
    description: 'إذا ارتبط الموعد بإجازة أو رحلة أو دفع، تأكد من بلدك وحوّل التاريخ قبل أن تبني قراراً على العدّاد وحده.',
    Icon: ArrowLeftRight,
  },
  {
    title: 'العدّاد للتخطيط، لا للاعتماد الرسمي',
    description: 'استخدمه للتقريب الأولي، ثم راجع الجهة الرسمية في بلدك عندما يتعلق الأمر بإجازة عمل أو مدرسة أو موعد دفع.',
    Icon: ShieldAlert,
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
  const [{ now, nowIso }, initialData, initialFacetCounts] = await Promise.all([
    getHolidaysNow('/holidays'),
    getInitialEvents(DEFAULT_FILTER),
    getFacetCounts(DEFAULT_FILTER),
  ]);
  const defaultData = normalizeInitialEventsData(initialData);
  const gr = now.getFullYear();
  const hi = approxHijriYear(gr);
  const utilityLinks = appendToolDiscoveryLinks([
    {
      href: '/date/today',
      label: 'كم التاريخ اليوم؟',
      Icon: CalendarDays,
    },
    {
      href: '/time-now',
      label: 'كم الساعة الان؟',
      Icon: Clock3,
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

      <AdLayoutWrapper layout="wide" sidebarMode="dual">
        <div className="layout-content-shell">
          <main className={styles.pageShell}>
        {/* First thing on the page, before the breadcrumb/H1 — see
            AdTopBanner.tsx v3. */}
        <AdTopBanner slotId="top-holidays-list" />

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
            initialFacetCounts={initialFacetCounts}
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

        {/* Real internal traffic evidence (2026-08-09): the dedicated per-country pages get
            genuine visits, but this hub never linked to them directly — the only country
            shortcut above points at an in-page filter (?country=sa), not the real page. This
            section is the missing discovery path straight to /holidays/country/[slug]. */}
        <section aria-labelledby="holidays-countries-heading" className={styles.countriesSection}>
          <div className={styles.sectionHead}>
            <h2 id="holidays-countries-heading" className={styles.sectionTitle}>
              لائحة العطل الرسمية حسب الدولة
            </h2>
            <p className={styles.sectionLead}>
              اختر دولتك لعرض كل الإجازات الرسمية والمناسبات الوطنية والدينية فيها في صفحة واحدة، مع مصدر كل إجازة ومدتها.
            </p>
          </div>
          <div className={styles.countryGrid}>
            {COUNTRY_HUBS.map((hub) => (
              <Link key={hub.slug} href={`/holidays/country/${hub.slug}`} className={styles.countryChip}>
                <CountryFlag code={hub.code} className={styles.countryChipFlag} label={hub.nameAr} />
                <span>{hub.nameAr}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Plain text + icon-chip inline list — no bordered panel, no two-column split, no
            border-bottom lines between items (owner, 2026-08-13: replacing the old .guidePanel/
            .trustItem line-separated design; consolidated from 6 overlapping rules to 4). */}
        <section aria-labelledby="holidays-reading-heading" className="date-section max-w-3xl">
          <h2 id="holidays-reading-heading" className={styles.sectionTitle}>
            قبل ما تعتمد على العدّاد
          </h2>
          <p className="date-editorial-copy">
            العدّاد يجيب عن سؤال «كم بقي؟»، لكن القرار العملي يحتاج خطوة إضافية:
            هل التاريخ ثابت، هل يختلف حسب البلد، وهل تحتاج تحويله قبل الحجز أو الترتيب؟
          </p>
          <ul className="date-use-inline-list">
            {HOLIDAY_QUICK_RULES.map((rule) => (
              <li key={rule.title}>
                <span className="date-use-icon" aria-hidden="true"><rule.Icon size={16} strokeWidth={1.75} /></span>
                <span><strong>{rule.title}</strong> — {rule.description}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Related pages — small clean cards, not a dot-list (owner, 2026-08-13: "related
            pages and tools should be small clean cards"). */}
        <section className={styles.followupSection}>
          <SiteRelatedCardGrid
            heading="خطوتك التالية بعد اختيار مناسبة"
            headingId="holidays-next-paths-heading"
            items={utilityLinks.slice(0, 4)}
          />
        </section>
          </main>
          <HolidaysSections nowIso={nowIso} />
          <section className={styles.followupSection}>
            <AdMultiplex slotId="end-holidays-list" />
          </section>
        </div>
      </AdLayoutWrapper>
    </div>
  );
}

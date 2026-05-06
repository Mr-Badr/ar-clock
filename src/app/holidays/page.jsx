/**
 * app/holidays/page.jsx
 * Static-first holidays landing page with client-synced query filters.
 */
import Link from 'next/link';
import { Calendar } from 'lucide-react';

import {
  approxHijriYear,
  buildBreadcrumbSchema,
} from '@/lib/holidays-engine';
import { getInitialEvents } from './data';
import HolidaysClient from './HolidaysClient';
import { getCachedNowIso } from '@/lib/date-utils';
import HolidaysSections from '@/components/holidays/index';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';
import { appendToolDiscoveryLinks } from '@/lib/seo/discovery-links';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';
import { normalizeHolidayFilter } from './holidays-filter-utils';

const SITE = getSiteUrl();

/* ── Dynamic metadata ────────────────────────────────────────────────── */
export async function generateMetadata() {
  const now = new Date(await getCachedNowIso());
  const gr = now.getFullYear();
  const hi = approxHijriYear(gr);
  return {
    title: `كم باقي على رمضان والعيد والمناسبات القادمة؟ | عداد مباشر ${gr}`,
    description: `إذا كان سؤالك: كم باقي على رمضان أو العيد أو المناسبة القادمة؟ فهذه الصفحة تعرض عداداً مباشراً للمناسبات الإسلامية والوطنية والمدرسية مع التاريخ الهجري والميلادي وصفحات تفصيلية لكل مناسبة.`,
    keywords: `كم باقي على المناسبات, كم باقي على الأعياد ${gr}, المناسبات القادمة ${gr}, المناسبات الإسلامية ${hi}, عداد المناسبات, العطل الرسمية ${gr}, المناسبات المدرسية, متى المناسبة القادمة`,
    alternates: { canonical: `${SITE}/holidays`, languages: { ar: `${SITE}/holidays` } },
    robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    openGraph: {
      title: `كم باقي على رمضان والعيد والمناسبات القادمة؟`,
      description: `تصفح المناسبات القادمة مع عداد مباشر وروابط تفصيلية للأحداث الأكثر بحثاً.`,
      locale: 'ar_SA', type: 'website', url: `${SITE}/holidays`,
    },
  };
}

const DEFAULT_FILTER = normalizeHolidayFilter();

/* ── Page ────────────────────────────────────────────────────────────── */
export default async function HolidaysPage() {
  /* ── Schemas ──────────────────────────────────────────────────────── */
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'الرئيسية', url: SITE },
    { name: 'المناسبات', url: `${SITE}/holidays` },
  ]);
  const websiteSchema = {
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: `${SITE_BRAND} — عداد المواعيد`, url: SITE, inLanguage: 'ar',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE}/holidays?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  const orgSchema = {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: `${SITE_BRAND} — عداد المواعيد`, url: SITE,
    logo: { '@type': 'ImageObject', url: `${SITE}/icons/icon-512.png`, width: 512, height: 512 },
    description: 'منصة عربية متخصصة في العد التنازلي للمناسبات الإسلامية والوطنية والمدرسية في العالم العربي.',
    inLanguage: 'ar',
    areaServed: ['SA', 'EG', 'MA', 'DZ', 'AE', 'TN', 'KW', 'QA'],
    sameAs: [`${SITE}`],
    knowsAbout: ['التقويم الهجري', 'المناسبات الإسلامية', 'العد التنازلي', 'تقويم أم القرى', 'رمضان', 'عيد الفطر', 'عيد الأضحى'],
  };

  /* ── Date / year resolution ─────────────────────────────────────── */
  const [nowIso, defaultData] = await Promise.all([
    getCachedNowIso(),
    getInitialEvents(DEFAULT_FILTER),
  ]);
  const now = new Date(nowIso);
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
      label: 'كم الساعة الآن؟',
      description: 'راجع الوقت الحالي في مدينتك أو دولة أخرى عند متابعة العدادات المباشرة والمناسبات الدولية.',
    },
  ]);
  const featuredEventLinks = defaultData.events.slice(0, 12).map((event, index) => ({
    position: index + 1,
    href: `/holidays/${event.slug}`,
    title: event.name,
    description: `${event._formatted} — متبقي ${event._daysLeft} يوم`,
  }));
  const holidaysCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `المناسبات القادمة ${gr}`,
    url: `${SITE}/holidays`,
    inLanguage: 'ar',
    description: 'صفحة تجمع المناسبات القادمة مع عد تنازلي مباشر وروابط داخلية إلى صفحات الأحداث القابلة للفهرسة.',
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

      
      <main
        className="container pt-24 pb-20"
      >
        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <nav
          aria-label="breadcrumb"
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            fontSize: 'var(--text-sm)', color: 'var(--text-muted)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <Link href="/" style={{ color: 'var(--text-muted)' }}>الرئيسية</Link>
          <span aria-hidden>/</span>
          <span aria-current="page" style={{ color: 'var(--text-secondary)' }}>المناسبات</span>
        </nav>

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <header style={{ marginBottom: 'var(--space-12)' }} className='text-center'>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.9rem',
              borderRadius: '999px',
              background: 'var(--accent-soft)',
              border: '1px solid var(--border-accent)',
              fontSize: '0.78rem',
              color: 'var(--accent)',
              fontWeight: '700',
              marginBottom: '1rem',
            }}
          >
            <Calendar size={13} />
            عداد المواعيد
          </div>
          <h1
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-black)',
              color: 'var(--text-primary)',
              lineHeight: 'var(--leading-tight)',
            }}
          >
            كم باقي على{' '}
            <span style={{ color: 'var(--accent-alt)' }}>رمضان والعيد والمناسبات القادمة؟</span>
          </h1>
          <div className='flex justify-center'>
            <p
              style={{
                marginTop: 'var(--space-4)',
                color: 'var(--text-secondary)',
                maxWidth: '65ch',
                lineHeight: 'var(--leading-relaxed)',
                fontSize: 'var(--text-lg)',
              }}
            >
              تابع أهم المناسبات الإسلامية والوطنية والمدرسية في العالم العربي بدقة تامة،
              بالهجري والميلادي، مع عد تنازلي حي.
            </p>
          </div>

        </header>

        <AdTopBanner slotId="top-holidays" />

        <section
          aria-labelledby="featured-holidays-heading"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div
            className="card-nested"
            style={{
              padding: 'var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            <div>
              <h2
                id="featured-holidays-heading"
                style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                مناسبات قريبة يمكنك متابعتها الآن
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 'var(--leading-relaxed)',
                  maxWidth: '72ch',
                }}
              >
                اختر من هذه المناسبات القريبة لتصل بسرعة إلى صفحة كل مناسبة، ومعرفة
                التاريخ والمدة المتبقية والتفاصيل المهمة من دون الحاجة إلى البحث من جديد.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 'var(--space-3)',
              }}
            >
              {featuredEventLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--bg-surface-3)',
                    border: '1px solid var(--border-subtle)',
                    textDecoration: 'none',
                  }}
                >
                  <strong
                    style={{
                      display: 'block',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    {item.title}
                  </strong>
                  <span
                    style={{
                      display: 'block',
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)',
                      lineHeight: 'var(--leading-relaxed)',
                    }}
                  >
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── All events ─────────────────────────────────────────────── */}
        <section aria-labelledby="events-heading">
          <HolidaysClient
            initialEvents={defaultData.events}
            initialNextCursor={defaultData.nextCursor}
            initialTotal={defaultData.total}
            initialFilters={DEFAULT_FILTER}
          />
        </section>
        <AdInArticle slotId="mid-holidays-1" />
        <section className="mt-12">
          <GeoInternalLinks
            title="أدوات يومية مفيدة مع صفحة المناسبات"
            description="من يتابع رمضان أو العيد أو مناسبة قادمة يحتاج غالباً إلى أدوات مكمّلة مثل تاريخ اليوم، مواقيت الصلاة، والوقت الآن. جمعناها هنا لتصل إليها بسرعة."
            links={utilityLinks}
            ariaLabel="أدوات يومية مرتبطة بالمناسبات"
          />
        </section>
      </main>
      <HolidaysSections nowIso={nowIso} />
    </div>
  );
}

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
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';
import { normalizeHolidayFilter } from './holidays-filter-utils';

const SITE = getSiteUrl();

/* ── Dynamic metadata ────────────────────────────────────────────────── */
export async function generateMetadata() {
  const now = new Date(await getCachedNowIso());
  const gr = now.getFullYear();
  const hi = approxHijriYear(gr);
  return {
    title: `كم باقي على الأعياد والمناسبات القادمة ${gr} / ${hi}`,
    description: `دليل عربي شامل لمعرفة كم باقي على الأعياد والمناسبات الإسلامية والوطنية والمدرسية والاجتماعية، مع عد تنازلي مباشر ومواعيد بالهجري والميلادي وروابط تفصيلية لكل مناسبة.`,
    keywords: `كم باقي على المناسبات, كم باقي على الأعياد ${gr}, المناسبات القادمة ${gr}, المناسبات الإسلامية ${hi}, عداد المناسبات, العطل الرسمية ${gr}, المناسبات المدرسية, متى المناسبة القادمة`,
    alternates: { canonical: `${SITE}/holidays`, languages: { ar: `${SITE}/holidays` } },
    robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    openGraph: {
      title: `كم باقي على الأعياد والمناسبات القادمة ${gr}`,
      description: `تصفح المناسبات القادمة في العالم العربي مع العد التنازلي المباشر والتصنيف والصفحات التفصيلية لكل مناسبة.`,
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
            عداد{' '}
            <span style={{ color: 'var(--accent-alt)' }}>المواعيد</span>
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
      </main>
      <HolidaysSections nowIso={nowIso} />
    </div>
  );
}

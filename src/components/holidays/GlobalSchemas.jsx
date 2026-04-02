/**
 * GlobalSchemas — Holidays page
 *
 * v1 PROBLEMS:
 *   Only had a basic WebPage schema and BreadcrumbList — missed Google's
 *   E-E-A-T freshness signal (no dateModified), no FAQPage schema, no
 *   Event entities. These are the schemas Google actually uses for ranking.
 *
 * v2 IMPROVEMENTS using holidays-engine.js helpers:
 *
 *   1. buildWebPageSchema()   — adds dateModified (E-E-A-T freshness),
 *                               author Organization, and subject Event entity
 *   2. buildBreadcrumbSchema() — proper BreadcrumbList for rich snippets
 *   3. buildFAQSchema()       — FAQPage for "People also ask" boxes
 *                               (uses 8 high-volume questions from engine)
 *   4. ItemList schema        — signals this page is a curated list,
 *                               eligible for list carousel in SERPs
 *
 * NOTE: For a Server Component, pass `nowIso` from the parent page
 * (e.g. `new Date().toISOString()`) to populate dateModified.
 * Default fallback is the current build time.
 */

import {
  RELIGIOUS_HOLIDAYS,
  buildFAQSchema,
  buildBreadcrumbSchema,
  buildWebPageSchema,
  enrichEvent,
} from '@/lib/holidays-engine'
import { FAQ_ITEMS } from './data/faqItems'
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

/** Synthetic "page-level" event object for buildWebPageSchema / buildFAQSchema */
const PAGE_EVENT = enrichEvent({
  slug:        'holidays',
  name:        'المناسبات والأعياد الإسلامية والوطنية',
  seoTitle:    'عداد المواعيد — الأعياد والمناسبات الإسلامية والوطنية بالعد التنازلي',
  description: 'تقويم شامل للمناسبات الإسلامية والأعياد الدينية والعطل الوطنية مع عداد تنازلي دقيق بالتقويمين الهجري والميلادي',
  faqItems:    FAQ_ITEMS,
})

/** @param {{ nowIso?: string }} props */
export default function HolidaysGlobalSchemas({ nowIso }) {
  const nowStr = nowIso || new Date().toISOString()
  const nowDate = new Date(nowStr)

  /* 1. WebPage — E-E-A-T freshness + author + subject entity */
  const webPageSchema = buildWebPageSchema(
    PAGE_EVENT,
    nowDate,
    SITE_URL,
    nowStr,
  )
  // Override url to point to /holidays (not /holidays/holidays)
  webPageSchema.url = `${SITE_URL}/holidays`

  /* 2. BreadcrumbList */
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'الرئيسية', url: SITE_URL },
    { name: 'المناسبات والأعياد', url: `${SITE_URL}/holidays` },
  ])

  /* 3. FAQPage — 8 high-volume questions from the engine */
  const faqSchema = buildFAQSchema(PAGE_EVENT)

  /* 4. ItemList — signals a curated event list to Google */
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'المناسبات الإسلامية الكبرى',
    description: 'قائمة أبرز المناسبات والأعياد الإسلامية مرتّبة بالعد التنازلي',
    numberOfItems: RELIGIOUS_HOLIDAYS.length,
    itemListElement: RELIGIOUS_HOLIDAYS.slice(0, 8).map((ev, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: ev.name,
      url: `${SITE_URL}/holidays/${ev.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </>
  )
}

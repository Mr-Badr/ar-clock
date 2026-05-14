/**
 * GlobalSchemas — Holidays page
 *
 * Keep `/holidays` to a single FAQPage graph here. The page shell already emits
 * the page-level Organization/Breadcrumb/Collection schemas, and consolidating
 * FAQ output in one place avoids duplicate JSON-LD entities in Search Console.
 */

import { buildFAQSchema } from '@/lib/holidays-engine'
import { getFaqItems } from './data/faqItems'

export default async function HolidaysGlobalSchemas() {
  const faqItems = await getFaqItems()
  const faqSchema = buildFAQSchema({ faqItems })

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  )
}

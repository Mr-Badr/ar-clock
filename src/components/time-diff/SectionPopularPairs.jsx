/**
 * SectionPopularPairs — Most searched time-difference pairs
 *
 * Purpose: immediately below the search tool, shows the 12 most-searched
 * country pairs as quick-access cards. Each card is a direct internal link
 * to /time-difference/[from]/[to] — distributes PageRank + reduces bounce.
 *
 * SEO value:
 *   - Internal links with exact-match Arabic anchor text
 *   - Covers top search queries: "فرق التوقيت بين السعودية ومصر" etc.
 *   - itemList JSON-LD signals a curated list to Google
 *
 * Design: 2→3→4 col grid, each card with flag pair + label + live diff badge.
 * Live diff is a Client Component to avoid hydration issues.
 */

import Link from 'next/link'
import { Clock } from 'lucide-react'
import { SectionWrapper, SectionBadge } from '@/components/shared/primitives'
import { POPULAR_PAIRS }                from './data/popularPairs'
import PopularPairsLiveClient           from './mockups/PopularPairsLiveClient'

const H2_ID = 'h2-popular-pairs'

function PairsSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    'ItemList',
    name:       'أشهر فروق التوقيت المبحوثة',
    itemListElement: POPULAR_PAIRS.map((pair, i) => ({
      '@type':    'ListItem',
      position:   i + 1,
      name:       `فرق التوقيت بين ${pair.from.nameAr} و${pair.to.nameAr}`,
      url:        `https://waqt.app/time-difference/${pair.from.slug}/${pair.to.slug}`,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function SectionPopularPairs() {
  return (
    <SectionWrapper id="section-popular-pairs" headingId={H2_ID} subtle>
      <PairsSchema />

      <header className="mb-8 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <SectionBadge><Clock size={11} />أشهر المقارنات</SectionBadge>
            <h2
              id={H2_ID}
              className="text-2xl sm:text-3xl font-extrabold"
              style={{ color: 'var(--text-primary)' }}
            >
              فروق التوقيت{' '}
              <span
                style={{
                  background:           'var(--accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                  backgroundClip:       'text',
                }}
              >
                الأكثر بحثاً
              </span>
            </h2>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              اضغط على أي زوج لعرض فرق التوقيت الكامل، جدول التحويل، وأفضل وقت للاجتماع
            </p>
          </div>
        </div>
      </header>

      {/* Live client renders the actual current UTC diffs */}
      <PopularPairsLiveClient pairs={POPULAR_PAIRS} />

      {/* Static fallback list for SEO crawlers (hidden visually) */}
      <nav aria-label="روابط فروق التوقيت الشائعة" className="sr-only">
        <ul>
          {POPULAR_PAIRS.map((pair) => (
            <li key={`${pair.from.slug}-${pair.to.slug}`}>
              <Link href={`/time-difference/${pair.from.slug}/${pair.to.slug}`}>
                فرق التوقيت بين {pair.from.nameAr} و{pair.to.nameAr}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </SectionWrapper>
  )
}

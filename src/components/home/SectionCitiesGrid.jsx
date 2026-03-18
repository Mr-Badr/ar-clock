/**
 * SectionCitiesGrid — World clock city grid (Advanced SEO Optimized)
 *
 * - Dynamic keyword generation per city (long-tail SEO)
 * - Rich aria-label + title لكل رابط
 * - Hidden semantic block (sr-only)
 * - نفس UI 100% بدون تغيير
 */

import Link from 'next/link'
import { Globe2 } from 'lucide-react'
import SectionWrapper from './shared/SectionWrapper'
import SectionBadge from './shared/SectionBadge'
import { CITIES } from './data/cities'

const H2_ID = 'h2-cities'

/**
 * 🔥 Generate powerful SEO keywords per city
 */
function getCityKeywords(city) {
  return [
    `الوقت الآن في ${city.name}`,
    `الساعة الآن في ${city.name}`,
    `كم الساعة في ${city.name} الآن`,
    `التوقيت المحلي في ${city.name}`,
    `الوقت الحالي في ${city.name} ${city.country}`,
    `الساعة الآن في ${city.name} ${city.country}`,
    `كم الساعة الآن في ${city.name} ${city.country}`,
    `توقيت ${city.name} الآن`,
    `الوقت في ${city.name} الآن بتوقيت ${city.country}`,
    `معرفة الوقت الآن في ${city.name}`,
    `عرض الساعة الآن في ${city.name}`,
    `الوقت المباشر في ${city.name}`,
    `الساعة الدقيقة في ${city.name}`,
    `الوقت الرسمي في ${city.name} ${city.country}`,
    `التوقيت الحالي في ${city.name}`,
    `فرق التوقيت بين ${city.name} ومدن أخرى`,
    `توقيت ${city.country} الآن في ${city.name}`,
    `الوقت الآن ${city.name} UTC`,
  ]
}

export default function SectionCitiesGrid() {
  return (
    <SectionWrapper id="section-cities" headingId={H2_ID} subtle>

      {/* Header */}
      <div className="mb-8 space-y-3">
        <SectionBadge>
          <Globe2 size={11} />
          ساعة العالم
        </SectionBadge>

        <h2
          id={H2_ID}
          className="text-2xl sm:text-3xl font-extrabold"
          style={{ color: 'var(--text-primary)' }}
        >
          الوقت الآن والساعة في{' '}
          <span
            style={{
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            أشهر مدن العالم والعالم العربي
          </span>
        </h2>

        <p
          className="text-sm sm:text-base"
          style={{ color: 'var(--text-secondary)' }}
        >
          استعرض الوقت الآن في المدن الأكثر بحثًا مثل الرياض، دبي، القاهرة، لندن
          ونيويورك. يمكنك معرفة الساعة الحالية، فرق التوقيت، والتوقيت المحلي
          بدقة عالية.
        </p>

        {/* 🔥 Hidden SEO content */}
        <div className="sr-only">
          الوقت الآن في الرياض، الساعة الآن في دبي، كم الساعة في القاهرة الآن،
          التوقيت المحلي في إسطنبول، الوقت الحالي في لندن، الساعة في باريس الآن،
          فرق التوقيت بين الدول، توقيت غرينتش الآن، التوقيت العالمي الآن،
          موعد التوقيت الصيفي في الدول العربية.
        </div>
      </div>

      {/* Cities grid */}
      <ul
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 sm:gap-3"
        role="list"
        aria-label="الوقت الآن في مدن العالم"
      >
        {CITIES.map((city, i) => {
          const keywords = getCityKeywords(city)
          const keyword = keywords[i % keywords.length]

          return (
            <li key={city.slug}>
              <Link
                href={`/time-now/${city.slug}`}
                className="group flex flex-col items-center text-center rounded-2xl p-2.5 sm:p-3 min-h-[56px] transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                aria-label={`${keyword} — عرض الساعة الحالية وفرق التوقيت`}
                title={keyword}
              >
                <span
                  className="text-xl sm:text-2xl mb-1 leading-none"
                  aria-hidden="true"
                >
                  {city.flag}
                </span>

                <span
                  className="text-[11px] sm:text-xs font-bold leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {city.name}
                </span>

                <span
                  className="text-[10px] mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--accent-alt)' }}
                >
                  UTC {city.offset >= 0 ? `+${city.offset}` : city.offset}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* 🔥 Dynamic hidden keywords (very powerful) */}
      <div className="sr-only">
        {CITIES.map(city =>
          getCityKeywords(city).slice(0, 4).join('، ')
        ).join('، ')}
      </div>

    </SectionWrapper>
  )
}
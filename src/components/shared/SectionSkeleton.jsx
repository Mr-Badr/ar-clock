/**
 * SectionSkeleton
 * Loading state for home sections (Prayer Times, Holidays)
 * Matches SectionWrapper layout + pulse animation
 */

import { SectionWrapper } from './primitives'

export default function SectionSkeleton() {
  return (
    <SectionWrapper id="section-skeleton">
      <div className="section-skeleton" aria-hidden="true">
        <div className="section-skeleton__copy">
          <div className="skeleton-block section-skeleton__eyebrow" />
          <div className="section-skeleton__title-group">
            <div className="skeleton-block section-skeleton__title section-skeleton__title--wide" />
            <div className="skeleton-block section-skeleton__title section-skeleton__title--short" />
          </div>
          <div className="section-skeleton__rows">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="section-skeleton__row">
                <div className="skeleton-block section-skeleton__dot" />
                <div className="skeleton-block section-skeleton__text" />
              </div>
            ))}
          </div>
        </div>

        <div className="section-skeleton__media">
          <div className="skeleton-card section-skeleton__card" />
        </div>
      </div>
    </SectionWrapper>
  )
}

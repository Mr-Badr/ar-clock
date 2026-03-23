/**
 * SectionSkeleton
 * Loading state for home sections (Prayer Times, Holidays)
 * Matches SectionWrapper layout + pulse animation
 */

import { SectionWrapper } from './primitives'

export default function SectionSkeleton() {
  return (
    <SectionWrapper id="section-skeleton">
      <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16 animate-pulse">
        {/* Text column placeholder */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="h-6 w-24 rounded-full bg-gray-200" style={{ background: 'var(--bg-surface-2)' }} />
          <div className="space-y-3">
            <div className="h-10 w-3/4 rounded-xl" style={{ background: 'var(--bg-surface-2)' }} />
            <div className="h-10 w-1/2 rounded-xl" style={{ background: 'var(--bg-surface-1)' }} />
          </div>
          <div className="space-y-4 pt-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full" style={{ background: 'var(--bg-surface-1)' }} />
                <div className="h-4 w-5/6 rounded-lg" style={{ background: 'var(--bg-surface-1)' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Card column placeholder */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div 
            className="w-full max-w-sm aspect-[4/5] rounded-[2.5rem]" 
            style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}

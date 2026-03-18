/**
 * SectionWrapper
 * Consistent section shell with:
 * - overflow-hidden so glow blobs don't leak outside the section
 * - glow prop: renders OUTSIDE the container div (sibling) so overflow-hidden
 *   clips it correctly against the section edge, not the inner container
 * - headingId: wired to aria-labelledby for accessible landmark navigation
 * - subtle: applies var(--bg-subtle) background via inline style
 */

/** @param {{ id: string, children: React.ReactNode, className?: string, glow?: React.ReactNode, headingId?: string, subtle?: boolean }} props */
export default function SectionWrapper({ id, children, className = '', glow, headingId, subtle = false }) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`relative w-full overflow-hidden py-16 sm:py-20 lg:py-24 ${className}`}
      style={subtle ? { background: 'var(--bg-subtle)' } : undefined}
    >
      {/* Glow is a sibling of the container — stays within section bounds */}
      {glow}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {children}
      </div>
    </section>
  )
}

/** @param {{ id: string, children: React.ReactNode, className?: string, glow?: React.ReactNode, headingId?: string, subtle?: boolean }} props */
export default function SectionWrapper({ id, children, className = '', glow, headingId, subtle = false }) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`relative w-full overflow-hidden py-16 sm:py-20 lg:py-24 ${className}`}
      style={subtle ? { background: 'var(--bg-subtle)' } : undefined}
    >
      {glow}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {children}
      </div>
    </section>
  )
}

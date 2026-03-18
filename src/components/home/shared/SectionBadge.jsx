/**
 * SectionBadge
 * Small pill label shown above every section heading.
 * Uses accent-soft background + accent-alt text from the design system.
 *
 * @param {{ children: React.ReactNode }} props
 */
export default function SectionBadge({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        background: 'var(--accent-soft)',
        color: 'var(--accent-alt)',
        border: '1px solid var(--border-accent)',
      }}
    >
      {children}
    </span>
  )
}

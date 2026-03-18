/**
 * SectionDivider
 * A 1px horizontal gradient line used between every pair of sections.
 * Provides visual rhythm without hard borders.
 * role="separator" + aria-hidden keeps it out of the accessibility tree.
 */
export default function SectionDivider() {
  return (
    <div
      className="w-full h-px"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, var(--border-subtle) 20%, var(--border-default) 50%, var(--border-subtle) 80%, transparent 100%)',
      }}
      role="separator"
      aria-hidden="true"
    />
  )
}

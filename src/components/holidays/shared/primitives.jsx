// SectionDivider.jsx
export function SectionDivider() {
  return (
    <div
      className="w-full h-px"
      style={{ background: 'linear-gradient(90deg,transparent 0%,var(--border-subtle) 20%,var(--border-default) 50%,var(--border-subtle) 80%,transparent 100%)' }}
      role="separator"
      aria-hidden="true"
    />
  )
}

// SectionBadge.jsx
export function SectionBadge({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ background: 'var(--accent-soft)', color: 'var(--accent-alt)', border: '1px solid var(--border-accent)' }}
    >
      {children}
    </span>
  )
}

// FeatureItem.jsx
export function FeatureItem({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--accent-soft)' }} aria-hidden="true">
        <Icon size={13} style={{ color: 'var(--accent-alt)' }} />
      </span>
      <span className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</span>
    </li>
  )
}

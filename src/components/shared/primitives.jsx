// shared/primitives.jsx — SectionWrapper, SectionDivider, SectionBadge, FeatureItem

// ─── SectionWrapper ───────────────────────────────────────────────────────────
export function SectionWrapper({
  id,
  children,
  className,
  headingId,
  subtle,
  contentWidth,
  containerClassName,
}) {
  const resolvedClassName = className ?? '';
  const resolvedContentWidth = contentWidth ?? 'container';
  const resolvedContainerClassName = containerClassName ?? '';
  const isSubtle = subtle === true;
  const containerClasses =
    resolvedContentWidth === 'content-col'
      ? `content-col ${resolvedContainerClassName}`.trim()
      : `container ${resolvedContainerClassName}`.trim();

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`editorial-section section ${resolvedClassName}`.trim()}
      data-tone={isSubtle ? 'subtle' : 'plain'}
    >
      <div className={containerClasses}>
        {children}
      </div>
    </section>
  )
}

// ─── SectionDivider ───────────────────────────────────────────────────────────
export function SectionDivider() {
  return (
    <div
      className="section-divider"
      role="separator"
      aria-hidden="true"
    />
  )
}

// ─── SectionBadge ─────────────────────────────────────────────────────────────
export function SectionBadge({ children }) {
  return (
    <span
      className="section-kicker"
    >
      {children}
    </span>
  )
}

// ─── FeatureItem ──────────────────────────────────────────────────────────────
export function FeatureItem({ icon: Icon, children }) {
  return (
    <li className="feature-row">
      <span
        className="feature-row__icon"
        aria-hidden="true"
      >
        <Icon size={16} />
      </span>
      <span className="feature-row__text">
        {children}
      </span>
    </li>
  )
}

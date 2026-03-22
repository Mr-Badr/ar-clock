// src/components/date/DateBreadcrumb.tsx
// ─────────────────────────────────────────────────────────────────────────────
// FIXED:
//   • Old version used <ChevronLeft> which in RTL renders as → (wrong direction)
//   • RTL breadcrumb separator must point ‹ (leftward = "back in hierarchy")
//   • Added aria-current="page" on last item (accessibility)
//   • Uses new.css token classes exclusively
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function DateBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="مسار التصفح"
      className="flex items-center flex-wrap text-xs py-3 mb-2"
      style={{ color: 'var(--text-muted)', gap: '6px' }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center" style={{ gap: '6px' }}>
            {i > 0 && (
              // ‹ chevron — correct for RTL: visually separates right-to-left hierarchy
              <svg
                width="8" height="12" viewBox="0 0 8 12"
                fill="none" aria-hidden="true"
                style={{ color: 'var(--text-muted)', opacity: 0.45, flexShrink: 0 }}
              >
                <path
                  d="M6 1.5 L2 6 L6 10.5"
                  stroke="currentColor" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-accent font-medium hover:text-accent-alt transition-colors truncate"
                style={{ maxWidth: '130px' }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-secondary font-semibold truncate"
                style={{ maxWidth: '160px' }}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[], baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type':    'ListItem',
      position:   i + 1,
      name:       item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  };
}

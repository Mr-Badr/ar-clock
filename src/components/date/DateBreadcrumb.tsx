import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import styles from './DateBreadcrumb.module.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function DateBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="مسار التصفح"
      className={styles.nav}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className={styles.item}>
            {i > 0 && (
              <ChevronLeft className={styles.separator} size={13} strokeWidth={1.75} aria-hidden="true" />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={styles.link}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={styles.current}
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

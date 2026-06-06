import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {Array<{href: string, label: string, description?: string}>} [props.links]
 * @param {string} [props.ariaLabel]
 */
export default function GeoInternalLinks(props) {
  const title = props.title;
  const description = props.description;
  const links = Array.isArray(props.links) ? props.links : [];
  const ariaLabel = props.ariaLabel;
  const safeLinks = links.filter((link) => link?.href && link?.label);

  if (safeLinks.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <h2
        className="text-2xl font-bold mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h2>
      {description ? (
        <p
          className="mb-5"
          style={{
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            maxWidth: '72ch',
          }}
        >
          {description}
        </p>
      ) : null}

      <nav aria-label={ariaLabel || title}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {safeLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'grid',
                gap: '0.4rem',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                background: index === 0 ? 'var(--bg-surface-2)' : 'transparent',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <strong
                style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                {link.label}
              </strong>
              {link.description ? (
                <span style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {link.description}
                </span>
              ) : null}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'var(--accent-alt)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  marginTop: 'var(--space-1)',
                }}
              >
                افتح المسار
                <ArrowLeft size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

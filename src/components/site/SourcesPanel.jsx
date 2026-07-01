import Link from 'next/link';

import styles from './SourcesPanel.module.css';

/**
 * SourcesPanel — displays official sources for YMYL pages.
 * sources: Array<{ label: string, href: string, description?: string }>
 */
export default function SourcesPanel({ sources = [] }) {
  if (!sources?.length) return null;

  return (
    <div className={styles.panel} aria-labelledby="sources-panel-heading">
      <div className={styles.head}>
        <p className={styles.lead}>
          النتائج التقديرية مستندة إلى الأنظمة والقوانين الرسمية أدناه. للقرارات المالية والقانونية الحساسة، تحقق دائماً من الجهة الرسمية المختصة.
        </p>
      </div>

      <ol className={styles.list} aria-label="قائمة المصادر الرسمية">
        {sources.map((src, i) => (
          <li key={src.href} className={styles.item}>
            <a
              href={src.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={styles.link}
              aria-label={`${src.label} — مصدر خارجي`}
            >
              <span className={styles.num} aria-hidden="true">{i + 1}</span>
              <span className={styles.linkCopy}>
                <span className={styles.linkLabel}>{src.label}</span>
                {src.description ? (
                  <span className={styles.linkDesc}>{src.description}</span>
                ) : null}
              </span>
              <span className={styles.linkArrow} aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ol>

      <p className={styles.note}>
        وجدت خطأً أو معلومة تحتاج تحديثاً؟{' '}
        <Link href="/contact" className={styles.noteLink}>أرسل لنا تصحيحاً</Link>
      </p>
    </div>
  );
}

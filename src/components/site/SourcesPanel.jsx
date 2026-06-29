import Link from 'next/link';

import styles from './SourcesPanel.module.css';

/**
 * SourcesPanel — displays official sources for YMYL pages.
 * sources: Array<{ label: string, href: string, description?: string }>
 */
export default function SourcesPanel({ sources = [] }) {
  if (!sources?.length) return null;

  return (
    <section className={styles.panel} aria-labelledby="sources-panel-heading">
      <header className={styles.head}>
        <span className={styles.eyebrow}>المصادر والمراجع الرسمية</span>
        <h2 id="sources-panel-heading" className={styles.title}>
          مصادر البيانات المستخدمة في هذه الأداة
        </h2>
        <p className={styles.lead}>
          النتائج التقديرية مستندة إلى الأنظمة والقوانين المرجعية أدناه.
          للقرارات المالية والقانونية والصحية الحساسة، تحقق دائماً من الجهة الرسمية المختصة.
        </p>
      </header>

      <ol className={styles.list} aria-label="قائمة المصادر الرسمية">
        {sources.map((src) => (
          <li key={src.href} className={styles.item}>
            <a
              href={src.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={styles.link}
              aria-label={`${src.label} — مصدر خارجي`}
            >
              <span className={styles.linkIcon} aria-hidden="true">↗</span>
              <span className={styles.linkCopy}>
                <span className={styles.linkLabel}>{src.label}</span>
                {src.description ? (
                  <span className={styles.linkDesc}>{src.description}</span>
                ) : null}
              </span>
            </a>
          </li>
        ))}
      </ol>

      <p className={styles.note}>
        أرسل لنا{' '}
        <Link href="/contact" className={styles.noteLink}>تصحيحاً أو ملاحظة</Link>
        {' '}إذا وجدت بياناً يحتاج مراجعة أو تحديثاً.
      </p>
    </section>
  );
}

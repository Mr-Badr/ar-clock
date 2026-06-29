import Link from 'next/link';
import { ShieldCheck, CalendarDays, UserRound } from 'lucide-react';

import { getAuthor } from '@/data/site/authors';
import styles from './ReviewMeta.module.css';

const DATE_FORMATTER = new Intl.DateTimeFormat('ar-u-ca-gregory', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return DATE_FORMATTER.format(d);
}

/**
 * ReviewMeta — author/review strip for YMYL and content pages.
 *
 * Props:
 *   authorId     string  — key from authors.js (defaults to 'badr')
 *   reviewedAt   string  — ISO date of last review (e.g. '2026-06-01')
 *   reviewedBy   string  — optional reviewer name/team label
 *   publishedAt  string  — ISO date of first publish
 */
export default function ReviewMeta({
  authorId = 'badr',
  reviewedAt,
  reviewedBy,
  publishedAt,
}) {
  const author = getAuthor(authorId);
  const reviewDateLabel = formatDate(reviewedAt);
  const publishDateLabel = formatDate(publishedAt);

  return (
    <div className={styles.strip} role="complementary" aria-label="معلومات المراجعة والمصداقية">
      <div className={styles.item}>
        <UserRound size={15} className={styles.icon} aria-hidden="true" />
        <div className={styles.copy}>
          <span className={styles.label}>إعداد</span>
          <Link href={`/author/${author.id}`} className={styles.value}>
            {author.name}
          </Link>
          <span className={styles.detail}>{author.role}</span>
        </div>
      </div>

      {reviewedBy ? (
        <div className={styles.item}>
          <ShieldCheck size={15} className={styles.icon} aria-hidden="true" />
          <div className={styles.copy}>
            <span className={styles.label}>مراجعة</span>
            <span className={styles.value}>{reviewedBy}</span>
          </div>
        </div>
      ) : null}

      {reviewDateLabel ? (
        <div className={styles.item}>
          <CalendarDays size={15} className={styles.icon} aria-hidden="true" />
          <div className={styles.copy}>
            <span className={styles.label}>آخر مراجعة</span>
            <span className={styles.value}>{reviewDateLabel}</span>
          </div>
        </div>
      ) : null}

      {publishDateLabel && !reviewDateLabel ? (
        <div className={styles.item}>
          <CalendarDays size={15} className={styles.icon} aria-hidden="true" />
          <div className={styles.copy}>
            <span className={styles.label}>تاريخ النشر</span>
            <span className={styles.value}>{publishDateLabel}</span>
          </div>
        </div>
      ) : null}

      <Link href="/editorial-policy" className={styles.policyLink}>
        السياسة التحريرية
      </Link>
    </div>
  );
}

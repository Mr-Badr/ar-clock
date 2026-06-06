import Link from 'next/link';

import { getPopularTimeNowCountryLinks } from '@/lib/seo/popular-links';
import { logger, serializeError } from '@/lib/logger';
import styles from './TimeNowSupportSections.module.css';

function isValidRelatedCountry(country) {
  return Boolean(
    country
      && typeof country === 'object'
      && typeof country.href === 'string'
      && country.href.startsWith('/time-now/')
      && typeof country.label === 'string'
      && country.label.trim().length > 0,
  );
}

function buildFallbackDescription(currentCityAr) {
  if (currentCityAr) {
    return `ابدأ من وقت ${currentCityAr}، ثم افتح حاسبة فرق التوقيت لاختيار المدينة الثانية وتجنّب أخطاء التاريخ أو التوقيت الصيفي.`;
  }

  return 'عندما يكون هدفك اجتماعاً أو مكالمة أو سفراً، لا تكتفِ بحفظ فرق الساعات. افتح المقارنة واختر المكانين معاً.';
}

export async function RelatedSearches({ currentCountrySlug, currentCityAr }) {
  let related = [];
  try {
    const countryLinks = await getPopularTimeNowCountryLinks(20);
    related = Array.isArray(countryLinks)
      ? countryLinks
          .filter(isValidRelatedCountry)
          .filter((country) => country.countrySlug !== currentCountrySlug)
          .slice(0, 5)
      : [];
  } catch (error) {
    logger.warn('time-now-related-searches-failed', {
      currentCountrySlug,
      currentCityAr,
      error: serializeError(error),
    });
  }

  if (related.length === 0) {
    return (
      <section aria-labelledby="related-searches-heading" className={styles.section}>
        <h2 id="related-searches-heading" className={styles.heading}>
          مسار المقارنة الأسرع بعد معرفة الوقت
        </h2>

        <p className={styles.intro}>
          {buildFallbackDescription(currentCityAr)}
        </p>

        <div className={styles.grid}>
          <Link
            href="/time-difference"
            className={styles.linkCard}
            title="قارن الوقت بين مدينتين أو دولتين"
          >
            <span className={styles.linkLabel}>افتح حاسبة فرق التوقيت</span>
            <span className={styles.linkDescription}>
              اختر المكان الأول والمكان الثاني، ثم راجع الساعة المناسبة قبل تثبيت الموعد.
            </span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="related-searches-heading" className={styles.section}>
      <h2 id="related-searches-heading" className={styles.heading}>
        إذا كنت تقارن الوقت بين أكثر من بلد
      </h2>

      <p className={styles.intro}>
        اختر مساراً قريباً من نيتك الحالية بدلاً من الرجوع إلى فهرس طويل.
        {currentCityAr ? ` ابدأ من ${currentCityAr} ثم افتح البلد الذي تريد تنسيق موعده أو متابعة فرق الوقت معه.` : ' هذه الدول هي الأكثر استخداماً عند تنسيق السفر والعمل والمكالمات اليومية.'}
      </p>

      <div className={styles.grid}>
        {related.map((country, index) => (
          <Link
            key={country.href}
            href={country.href}
            className={`${styles.linkCard} ${index === 0 ? styles.linkCardPrimary : ''}`}
            title={country.description}
          >
            <span className={styles.linkLabel}>{country.label}</span>
            <span className={styles.linkDescription}>{country.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RelatedSearches;

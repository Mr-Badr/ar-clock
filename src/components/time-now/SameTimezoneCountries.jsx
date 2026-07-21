/**
 * components/time-now/SameTimezoneCountries.jsx
 * Pure server component — current UTC-offset countries grid with internal links.
 * Targets: "الدول في نفس التوقيت" keyword cluster + internal linking.
 */
import Link from 'next/link';
import CountryFlag from '@/components/shared/CountryFlag';
import styles from './TimeNowSupportSections.module.css';

function isValidCountry(country) {
  return Boolean(
    country
      && typeof country === 'object'
      && typeof country.country_slug === 'string'
      && country.country_slug.trim().length > 0
      && (country.country_name_ar || country.country_name_en),
  );
}

export function SameTimezoneCountries({ countries, utcOffset, currentCityAr }) {
  const safeCountries = Array.isArray(countries) ? countries.filter(isValidCountry) : [];

  if (safeCountries.length === 0) {
    return null;
  }
  const offsetLabel = utcOffset || 'الإزاحة الحالية';

  return (
    <section aria-labelledby="same-tz-heading" className={styles.section}>
      <h2 id="same-tz-heading" className={styles.heading}>
        دول تشترك اليوم في نفس الإزاحة ({offsetLabel})
      </h2>

      {currentCityAr && (
        <p className={styles.intro}>
          الدول التالية تشترك اليوم مع {currentCityAr} في نفس الإزاحة عن التوقيت العالمي. هذا يفيدك كبداية، لكن راجع حاسبة فرق التوقيت إذا كان الموعد بعد عدة أسابيع لأن بعض الدول تغيّر توقيتها موسمياً.
        </p>
      )}

      <div className={styles.countryGrid}>
        {safeCountries.map(c => (
          <Link
            key={c.country_slug}
            href={`/time-now/${c.country_slug}`}
            className={styles.countryCard}
            aria-label={`الوقت في ${c.country_name_ar || c.country_name_en}`}
          >
            <CountryFlag code={c.country_code} className={styles.flag} />
            <span className={styles.countryLabel}>{c.country_name_ar || c.country_name_en}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SameTimezoneCountries;

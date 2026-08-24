/**
 * components/time-now/SameTimezoneCountries.jsx
 * Pure server component — current UTC-offset countries with internal links.
 * Targets: "الدول في نفس التوقيت" keyword cluster + internal linking.
 *
 * These are countries, not generic links (owner, 2026-08-24) — shown as a
 * flag + name chip list instead of a plain bullet list, so the flag gives an
 * instant visual cue, and instead of the old bordered card grid (heavier
 * than the content needs).
 */
import Link from 'next/link';
import CountryFlag from '@/components/shared/CountryFlag';
import styles from './SameTimezoneCountries.module.css';

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
    <section aria-labelledby="same-tz-heading" className="date-section max-w-3xl">
      <h2 id="same-tz-heading" className="date-editorial-title">
        دول تشترك اليوم في نفس الإزاحة ({offsetLabel})
      </h2>
      {currentCityAr && (
        <p className="date-editorial-copy mb-4">
          الدول التالية تشترك اليوم مع {currentCityAr} في نفس الإزاحة عن التوقيت العالمي. هذا يفيدك كبداية، لكن راجع حاسبة فرق التوقيت إذا كان الموعد بعد عدة أسابيع لأن بعض الدول تغيّر توقيتها موسمياً.
        </p>
      )}
      <ul className={styles.chipList} aria-label={`دول تشترك في نفس إزاحة ${offsetLabel}`}>
        {safeCountries.map((c) => (
          <li key={c.country_slug}>
            <Link href={`/time-now/${c.country_slug}`} className={styles.chip}>
              {c.country_code ? (
                <CountryFlag code={c.country_code} className={styles.flag} />
              ) : null}
              {c.country_name_ar || c.country_name_en}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SameTimezoneCountries;

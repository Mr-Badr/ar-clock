import Link from 'next/link';

import styles from './GeoCityDirectory.module.css';

function normalizeCities(cities) {
  if (!Array.isArray(cities)) return [];

  const seen = new Set();

  return cities.filter((city) => {
    const citySlug = String(city?.city_slug || '').trim();
    const cityName = String(city?.name_ar || city?.name_en || '').trim();

    if (!citySlug || !cityName || seen.has(citySlug)) return false;
    seen.add(citySlug);
    return true;
  });
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {Array<{city_slug: string, name_ar?: string, name_en?: string}>} props.cities
 * @param {string} props.routeBase
 * @param {string} props.linkLabelPrefix
 * @param {string} props.ariaLabel
 * @param {number} [props.featuredCount=0] — always-visible cities shown above the collapsible (for SEO link authority)
 */
export default function GeoCityDirectory({
  title,
  description,
  cities,
  routeBase,
  linkLabelPrefix,
  ariaLabel,
  featuredCount = 0,
}) {
  const safeCities = normalizeCities(cities);

  if (safeCities.length === 0) {
    return (
      <div className={styles.emptyState} role="status">
        <strong>لم تتوفر قائمة المدن الآن</strong>
        <span>استخدم البحث أعلى الصفحة للوصول إلى المدينة المطلوبة مباشرة.</span>
      </div>
    );
  }

  const clampedFeatured = Math.min(Math.max(0, featuredCount), safeCities.length);
  const featuredCities = safeCities.slice(0, clampedFeatured);
  const restCities     = safeCities.slice(clampedFeatured);

  return (
    <div>
      <div className={styles.heading}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {featuredCities.length > 0 && (
        <nav aria-label={`أبرز مدن — ${ariaLabel || title}`}>
          <ul className={styles.featuredLinks}>
            {featuredCities.map((city) => {
              const cityName = city.name_ar || city.name_en;
              return (
                <li key={city.city_slug}>
                  <Link href={`${routeBase}/${city.city_slug}`}>
                    {linkLabelPrefix} {cityName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {restCities.length > 0 && (
        <details className={styles.directory}>
          <summary>
            {clampedFeatured > 0 ? 'مدن أخرى' : 'عرض دليل المدن الكامل'}
            <span>{restCities.length} مدينة</span>
          </summary>
          <nav aria-label={ariaLabel}>
            <ul className={styles.list}>
              {restCities.map((city) => {
                const cityName = city.name_ar || city.name_en;
                return (
                  <li key={city.city_slug}>
                    <Link href={`${routeBase}/${city.city_slug}`}>
                      {linkLabelPrefix} {cityName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </details>
      )}
    </div>
  );
}

import { getPopularTimeNowCountryLinks } from '@/lib/seo/popular-links';
import { logger, serializeError } from '@/lib/logger';
import { SiteDotLinkList } from '@/components/shared/SiteDotLinkList';

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

// Same plain dot-list pattern used everywhere (owner directive, 2026-08-13) — was its own
// bordered link-card grid before.
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
      <section aria-labelledby="related-searches-heading" className="date-section max-w-3xl">
        <h2 id="related-searches-heading" className="date-editorial-title">
          مسار المقارنة الأسرع بعد معرفة الوقت
        </h2>
        <p className="date-editorial-copy mb-4">{buildFallbackDescription(currentCityAr)}</p>
        <SiteDotLinkList
          items={[{
            href: '/time-difference',
            label: 'افتح حاسبة فرق التوقيت',
            description: 'اختر المكان الأول والمكان الثاني، ثم راجع الساعة المناسبة قبل تثبيت الموعد.',
          }]}
        />
      </section>
    );
  }

  return (
    <section aria-labelledby="related-searches-heading" className="date-section max-w-3xl">
      <h2 id="related-searches-heading" className="date-editorial-title">
        إذا كنت تقارن الوقت بين أكثر من بلد
      </h2>
      <p className="date-editorial-copy mb-4">
        اختر مساراً قريباً من نيتك الحالية بدلاً من الرجوع إلى فهرس طويل.
        {currentCityAr ? ` ابدأ من ${currentCityAr} ثم افتح البلد الذي تريد تنسيق موعده أو متابعة فرق الوقت معه.` : ' هذه الدول هي الأكثر استخداماً عند تنسيق السفر والعمل والمكالمات اليومية.'}
      </p>
      <SiteDotLinkList items={related} />
    </section>
  );
}

export default RelatedSearches;

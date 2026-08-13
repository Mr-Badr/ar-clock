import { SiteFaqAccordion } from '@/components/shared/SiteFaqAccordion';

function isValidFaqItem(item) {
  return Boolean(
    item
      && typeof item === 'object'
      && typeof item.q === 'string'
      && item.q.trim().length > 0
      && typeof item.a === 'string'
      && item.a.trim().length > 0,
  );
}

function buildFallbackFaq(placeLabelAr) {
  return [
    {
      q: `كيف أستخدم وقت ${placeLabelAr} بدون خطأ؟`,
      a: `ابدأ بالساعة الحية في أعلى الصفحة، ثم راجع المنطقة الزمنية والتاريخ المحلي قبل تثبيت موعد مع مدينة أخرى. إذا كان الموعد مستقبلياً، استخدم حاسبة فرق التوقيت لأن التوقيت الصيفي قد يغيّر الفارق.`,
    },
  ];
}

// Same FAQ pattern as /tools everywhere on the site (owner directive, 2026-08-13) — shadcn
// Accordion via SiteFaqAccordion, not a bespoke card-per-question list.
export function TimeNowFAQ({ placeLabelAr, introText, items }) {
  const safePlaceLabel = placeLabelAr || 'هذه الصفحة';
  const faqItems = Array.isArray(items) ? items.filter(isValidFaqItem) : [];
  const visibleItems = faqItems.length > 0 ? faqItems : buildFallbackFaq(safePlaceLabel);

  return (
    <section aria-labelledby="faq-h2" className="date-section max-w-3xl">
      <h2 id="faq-h2" className="date-editorial-title">
        أسئلة تساعدك على قراءة الوقت في {safePlaceLabel}
      </h2>
      <p className="date-editorial-copy mb-4">
        {introText || `إجابات مختصرة عن الساعة الان في ${safePlaceLabel}، المنطقة الزمنية، والتاريخ المحلي اليوم.`}
      </p>
      <SiteFaqAccordion items={visibleItems.map((item) => ({ question: item.q, answer: item.a }))} />
    </section>
  );
}

export default TimeNowFAQ;

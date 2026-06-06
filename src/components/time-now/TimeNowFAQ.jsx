
import styles from './TimeNowSupportSections.module.css';

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

export function TimeNowFAQ({ placeLabelAr, introText, items }) {
  const safePlaceLabel = placeLabelAr || 'هذه الصفحة';
  const faqItems = Array.isArray(items) ? items.filter(isValidFaqItem) : [];
  const visibleItems = faqItems.length > 0 ? faqItems : buildFallbackFaq(safePlaceLabel);

  return (
    <section aria-labelledby="faq-h2" className={styles.section}>
      <h2 id="faq-h2" className={styles.heading}>
        أسئلة تساعدك على قراءة الوقت في {safePlaceLabel}
      </h2>
      <p className={styles.intro}>
        {introText || `إجابات مختصرة عن الساعة الان في ${safePlaceLabel}، المنطقة الزمنية، والتاريخ المحلي اليوم.`}
      </p>

      <div className={styles.faqList}>
        {visibleItems.map((item, i) => (
          <details
            key={item.q || i}
            name="time-faq"
            className={styles.faqItem}
          >
            <summary className={styles.faqSummary}>
              <span className={styles.faqQuestion}>{item.q}</span>
              <span aria-hidden className={styles.faqChevron}>▼</span>
            </summary>
            <p className={styles.faqAnswer}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default TimeNowFAQ;

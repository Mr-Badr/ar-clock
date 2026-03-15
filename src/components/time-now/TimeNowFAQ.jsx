
/* ═══════════════════════════════════════════════════════════════════════
   TimeNowFAQ — pure server component, native <details>/<summary>
   Generates unique FAQ per city using template strings.
   FAQPage JSON-LD is rendered in the page file.
═══════════════════════════════════════════════════════════════════════ */

function buildFAQItems({ countryAr, cityAr, utcOffset, timezone, cityNameEn, countryNameEn }) {
  return [
    {
      q: `ما هو الوقت الان في ${cityAr}؟`,
      a: `الوقت الحالي في ${cityAr}، ${countryAr} يُعرض في أعلى هذه الصفحة بدقة حتى الثانية. يتم تحديثه تلقائياً وفق المنطقة الزمنية ${timezone} (${utcOffset}).`,
    },
    {
      q: `كم الساعة الان في ${cityAr}؟`,
      a: `الساعة الان في ${cityAr} تظهر في الساعة الرقمية أعلى الصفحة. ${cityAr} تتبع التوقيت ${utcOffset} وهو ${timezone}.`,
    },
    {
      q: `ما هي المنطقة الزمنية في ${cityAr}؟`,
      a: `${cityAr} تتبع المنطقة الزمنية ${timezone}، بإزاحة ${utcOffset} عن التوقيت العالمي المنسق (UTC).`,
    },
    {
      q: `ما هو التاريخ اليوم في ${cityAr}؟`,
      a: `التاريخ اليوم في ${cityAr} يظهر في الساعة الرقمية أعلى الصفحة بالتقويم الميلادي والهجري معاً. يتم تحديثه يومياً وفق المنطقة الزمنية ${timezone}.`,
    },
    {
      q: `هل ${countryAr} تطبق التوقيت الصيفي؟`,
      a: `يمكنك معرفة ذلك من قسم "معلومات المنطقة الزمنية" في هذه الصفحة. إذا كانت إزاحة يناير تختلف عن إزاحة يوليو فإن ${countryAr} تطبق التوقيت الصيفي، وإلا فلا.`,
    },
    {
      q: `ما الفرق الزمني بين ${cityAr} وتوقيت غرينتش (UTC)؟`,
      a: `${cityAr} تقع في المنطقة الزمنية ${utcOffset}، أي أنها تسبق / تتأخر عن توقيت غرينتش (UTC±0) بمقدار الإزاحة المذكورة.`,
    },
    {
      q: `what time is it in ${cityNameEn || cityAr}?`,
      a: `The current time in ${cityNameEn || cityAr}, ${countryNameEn || countryAr} is displayed at the top of this page, updated every second. ${cityNameEn || cityAr} follows the ${timezone} timezone (${utcOffset}).`,
    },
    {
      q: `كيف أعرف فرق التوقيت بين ${cityAr} ومدينة أخرى؟`,
      a: `يمكنك استخدام أداة "فرق التوقيت" في منصتنا لمقارنة وقت ${cityAr} مع أي مدينة في العالم بدقة.`,
    },
  ];
}

const SUMMARY_STYLE = {
  padding:        '0.875rem 1rem',
  cursor:         'pointer',
  fontSize:       'var(--text-sm)',
  fontWeight:     '700',
  color:          'var(--text-primary)',
  listStyle:      'none',
  display:        'flex',
  justifyContent: 'space-between',
  alignItems:     'center',
  gap:            '0.5rem',
  lineHeight:     '1.5',
  userSelect:     'none',
};

export function TimeNowFAQ({ countryAr, cityAr, utcOffset, timezone, cityNameEn, countryNameEn }) {
  const items = buildFAQItems({ countryAr, cityAr, utcOffset, timezone, cityNameEn, countryNameEn });

  return (
    <section aria-labelledby="faq-h2">
      <h2 id="faq-h2"
        style={{ margin:'0 0 1rem', fontSize:'var(--text-xl)', fontWeight:'800', color:'var(--text-primary)' }}
      >
        ❓ أسئلة شائعة — الوقت في {cityAr}
      </h2>
      <p style={{ margin:'0 0 1rem', fontSize:'var(--text-sm)', color:'var(--text-muted)', lineHeight:'1.7' }}>
        إجابات سريعة حول الساعة الان في {cityAr}، المنطقة الزمنية، والتاريخ اليوم.
      </p>

      <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
        {items.map((item, i) => (
          <details
            key={i}
            name="time-faq"
            style={{
              borderRadius: '0.875rem',
              border:       '1px solid var(--border-default)',
              background:   'var(--bg-surface-1)',
              overflow:     'hidden',
            }}
          >
            <summary style={SUMMARY_STYLE}>
              <span>{item.q}</span>
              <span aria-hidden style={{ fontSize:'0.7rem', color:'var(--accent-alt)', flexShrink:0, transition:'transform 0.2s' }}>▼</span>
            </summary>
            <p style={{
              margin:0, padding:'0 1rem 0.875rem',
              fontSize:'var(--text-sm)', color:'var(--text-secondary)',
              lineHeight:'1.75', borderTop:'1px solid var(--border-subtle)',
            }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>

      <style>{`
        details[name="time-faq"][open] summary span:last-child { transform: rotate(180deg); }
        details[name="time-faq"] summary::-webkit-details-marker { display:none; }
        details[name="time-faq"] summary::marker { display:none; }
        details[name="time-faq"]:hover { border-color: var(--border-accent) !important; }
      `}</style>
    </section>
  );
}

export default TimeNowFAQ;


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

export function TimeNowFAQ({ placeLabelAr, introText, items = [] }) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="faq-h2">
      <h2 id="faq-h2"
        style={{ margin:'0 0 1rem', fontSize:'var(--text-xl)', fontWeight:'800', color:'var(--text-primary)' }}
      >
        ❓ أسئلة شائعة — الوقت في {placeLabelAr}
      </h2>
      <p style={{ margin:'0 0 1rem', fontSize:'var(--text-sm)', color:'var(--text-muted)', lineHeight:'1.7' }}>
        {introText || `إجابات سريعة حول الساعة الان في ${placeLabelAr}، المنطقة الزمنية، والتاريخ اليوم.`}
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
              <span style={{ fontSize:'var(--text-sm)', fontWeight:'700', color:'var(--text-primary)' }}
              className="mt-1 mb-1">{item.q}</span>
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

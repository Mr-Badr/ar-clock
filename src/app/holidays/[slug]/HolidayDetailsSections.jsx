import { Suspense } from 'react';
import Link from 'next/link';
import CountryTable from './CountryTable';
import HistoricalTable from './HistoricalTable';
import RelatedEvents from './RelatedEvents';
import HolidayInternalLinks from './HolidayInternalLinks';

function QuickFactsTable({ facts }) {
  if (!facts?.length) return null;

  return (
    <div className="card-nested" style={{ overflow: 'hidden', padding: 0 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }} dir="rtl">
        <caption className="sr-only">معلومات سريعة</caption>
        <tbody>
          {facts.map((f, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'var(--bg-surface-3)' : 'var(--bg-surface-4)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th scope="row" style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)', textAlign: 'right', whiteSpace: 'nowrap', width: '40%' }}>{f.label}</th>
              <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>{f.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HolidayDetailsSections({
  slug,
  event,
  seo,
  pageModel,
  hijriYearNum,
  currentYear,
}) {
  const {
    meta,
    sections: {
      quickFacts = [],
      intentCards = [],
      about,
      recurringYears,
      engagement = [],
      faq = [],
      sources = [],
      relatedSlugs = [],
    },
  } = pageModel;
  const displayTitle = meta.displayTitle || event.name;

  return (
    <>
      {quickFacts.length > 0 && (
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>معلومات سريعة</h2>
          <QuickFactsTable facts={quickFacts} />
        </section>
      )}

      {intentCards.length > 0 && (
        <section style={{ marginBottom: 'var(--space-8)' }} aria-label="أبرز الإجراءات">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            {meta.intentHeading}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
            {intentCards.map((card, i) => (
              <div key={i} className="card-nested" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <span style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{card.icon}</span>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>{card.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', flex: 1 }}>{card.description}</p>
                <a href={card.ctaHref} className="btn" style={{ textAlign: 'center', padding: 'var(--space-2)', background: 'var(--bg-surface-4)', borderRadius: 'var(--radius-lg)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', textDecoration: 'none' }}>
                  {card.ctaText}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="section" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card__header">
          <h2 className="card__title">{about.heading}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {about.items.map((item, i) => (
            <div key={i}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>{item.heading}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-base)' }}>
                {item.content}
              </p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          {about.notes.map((note) => (
            <p key={note.id}>
              {note.kind === 'link' ? (
                <>
                  {note.label}:{' '}
                  <a href={note.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-link)' }}>
                    {note.text}
                  </a>
                </>
              ) : note.text}
            </p>
          ))}
        </div>
      </div>

      <CountryTable title={displayTitle} event={event} countryDates={seo.countryDates} />
      <HistoricalTable event={event} hijriYear={hijriYearNum} currentYear={currentYear} />

      {recurringYears && (
        <section style={{ marginTop: 'var(--space-8)' }} aria-labelledby="recurring-h">
          <h2 id="recurring-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            {displayTitle} — مواعيد السنوات
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
            {recurringYears.contextParagraph}
          </p>
          {recurringYears.sourceNote && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {recurringYears.sourceNote}
            </p>
          )}
        </section>
      )}

      {engagement.length > 0 && (
        <section style={{ marginTop: 'var(--space-10)' }} aria-labelledby="engagement-h">
          <h2 id="engagement-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>
            محتوى قابل للمشاركة
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            {engagement.map((item, index) => (
              <article key={`${item.type}-${index}`} className="card-nested" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  {item.subcategory || item.type}
                </span>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section style={{ marginTop: 'var(--space-10)' }} aria-labelledby="faq-h">
          <h2 id="faq-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>
            أسئلة شائعة
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {faq.map((faqItem, i) => {
              return (
              <details key={i} className="card-nested" style={{ padding: 'var(--space-4) var(--space-5)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', fontSize: 'var(--text-base)' }}>
                  <span>{faqItem.question}</span>
                  <span aria-hidden style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xl)', marginRight: 'var(--space-2)', flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ marginTop: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                  {faqItem.answer}
                </p>
              </details>
              );
            })}
          </div>
        </section>
      )}

      <HolidayInternalLinks
        event={event}
        displayTitle={displayTitle}
        currentYear={currentYear}
        hijriYearNum={hijriYearNum}
      />

      {sources.length > 0 && (
        <section style={{ marginTop: 'var(--space-10)' }} aria-labelledby="sources-h">
          <h2 id="sources-h" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
            المصادر والمراجع
          </h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', listStyle: 'none', padding: 0, margin: 0 }}>
            {sources.map((source, i) => (
              <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-link)' }}>
                <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Suspense fallback={
        <div style={{ marginTop: 'var(--space-12)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 'var(--space-3)' }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="alarm-item" style={{ height: '80px', opacity: 0.4 }} />)}
        </div>
      }>
        <RelatedEvents currentSlug={slug} relatedSlugs={relatedSlugs} />
      </Suspense>

      <div
        style={{
          marginTop: 'var(--space-16)',
          paddingTop: 'var(--space-10)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          اكتشف المزيد من المناسبات الإسلامية والوطنية والمدرسية
        </p>
        <Link
          href="/holidays"
          className="btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-8)',
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: 'var(--radius-2xl)',
            fontWeight: 'var(--font-semibold)',
            fontSize: 'var(--text-base)',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-accent)',
          }}
        >
          <span aria-hidden>←</span>
          كل المناسبات
        </Link>
      </div>
    </>
  );
}

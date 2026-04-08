import Link from 'next/link';

export function EconomyHero({ eyebrow, title, lead, metaPills = [], note = '' }) {
  return (
    <header className="economy-hero">
      <span className="economy-hero__eyebrow">{eyebrow}</span>
      <h1 className="economy-hero__title">{title}</h1>
      <p className="economy-hero__lead">{lead}</p>
      <div className="economy-hero__meta">
        {metaPills.map((pill) => (
          <span key={pill.label} className="economy-meta-pill">
            {pill.label}
          </span>
        ))}
      </div>
      {note ? <p className="economy-note">{note}</p> : null}
    </header>
  );
}

export function EconomySectionHeader({ title, lead }) {
  return (
    <div className="economy-section__header">
      <h2 className="economy-section__title">{title}</h2>
      {lead ? <p className="economy-section__lead">{lead}</p> : null}
    </div>
  );
}

export function EconomyBanner({ kicker, title, detail, tone = 'default', children = null }) {
  return (
    <section className="economy-banner" data-tone={tone}>
      <span className="economy-banner__kicker">{kicker}</span>
      <h2 className="economy-banner__title">{title}</h2>
      <p className="economy-banner__detail">{detail}</p>
      {children}
    </section>
  );
}

export function EconomyGuide({ sections }) {
  return (
    <div className="economy-guide-grid">
      {sections.map((section) => (
        <article key={section.title} className="economy-copy-card">
          <h3 className="economy-copy-card__title">{section.title}</h3>
          <p className="economy-copy-card__body">{section.body}</p>
        </article>
      ))}
    </div>
  );
}

export function EconomyFaq({ items }) {
  return (
    <div className="economy-faq-grid">
      {items.map((item) => (
        <details key={item.question} className="economy-faq-item">
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function EconomyTimeline({ timeline }) {
  return (
    <div className="economy-timeline">
      <div className="economy-timeline__track">
        {timeline.bars.map((bar) => (
          <div key={bar.id} className="economy-timeline__row">
            <span className="economy-timeline__label">{bar.nameAr}</span>
            <div className="economy-timeline__lane">
              {bar.segments.map((segment) => (
                <span
                  key={`${bar.id}-${segment.startPercent.toFixed(2)}`}
                  className="economy-timeline__segment"
                  data-tone={bar.tone}
                  style={{
                    insetInlineStart: `${segment.startPercent}%`,
                    width: `${segment.widthPercent}%`,
                  }}
                />
              ))}
              {bar.id === 'london' && timeline.overlapSegments.map((segment) => (
                <span
                  key={`overlap-${segment.startPercent.toFixed(2)}`}
                  className="economy-timeline__segment--overlap"
                  style={{
                    insetInlineStart: `${segment.startPercent}%`,
                    width: `${segment.widthPercent}%`,
                  }}
                />
              ))}
              <span
                className="economy-timeline__now"
                style={{ insetInlineStart: `${timeline.nowPercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="economy-timeline__hours">
        {timeline.hourLabels.map((item) => (
          <span key={`${item.label}-${item.positionPercent}`}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}

export function EconomyTable({ columns, rows }) {
  return (
    <table className="economy-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            {row.cells.map((cell, index) => (
              <td key={`${row.key}-${index}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function EconomyToolCards({ cards }) {
  return (
    <div className="economy-tool-grid">
      {cards.map((card) => {
        const content = (
          <>
            <span className="economy-tool-card__eyebrow">{card.eyebrow}</span>
            <h3 className="economy-tool-card__title">{card.title}</h3>
            <p className="economy-tool-card__body">{card.body}</p>
            <span className="economy-tool-card__cta">
              {card.isLive ? 'فتح الأداة' : 'قريباً ضمن نفس البنية'}
            </span>
          </>
        );

        if (!card.href) {
          return (
            <article key={card.title} className="economy-tool-card" data-disabled="true">
              {content}
            </article>
          );
        }

        return (
          <Link key={card.href} href={card.href} className="economy-tool-card">
            {content}
          </Link>
        );
      })}
    </div>
  );
}

export function EconomySourceTable({ rows }) {
  return (
    <div className="economy-source-table">
      <div className="economy-source-table__head">
        <span>السوق</span>
        <span>الحالة</span>
        <span>المصدر المباشر</span>
        <span>المرجع الرسمي</span>
        <span>آخر مزامنة</span>
      </div>

      {rows.map((row) => (
        <article key={row.id} className="economy-source-table__row">
          <div>
            <strong>{row.marketLabel}</strong>
            {row.note ? <p>{row.note}</p> : null}
          </div>
          <div>{row.modeLabel}</div>
          <div>
            {row.statusSource?.url ? (
              <a href={row.statusSource.url} target="_blank" rel="noreferrer">
                {row.statusSource.label}
              </a>
            ) : (
              <span>{row.statusSource?.label || '--'}</span>
            )}
          </div>
          <div className="economy-source-table__links">
            {row.officialSource?.url ? (
              <a href={row.officialSource.url} target="_blank" rel="noreferrer">
                {row.officialSource.label}
              </a>
            ) : (
              <span>--</span>
            )}
            {row.supportSource?.url ? (
              <a href={row.supportSource.url} target="_blank" rel="noreferrer">
                {row.supportSource.label}
              </a>
            ) : null}
          </div>
          <div>{row.syncLabel}</div>
        </article>
      ))}
    </div>
  );
}

export function EconomySourceLinks({ links }) {
  return (
    <div className="economy-source-links">
      {links.map((link) => (
        <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="economy-meta-pill">
          {link.label}
        </a>
      ))}
    </div>
  );
}

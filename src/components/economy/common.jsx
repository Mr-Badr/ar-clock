// components/economy/common.jsx
import Link from 'next/link';

import EconomyFaqAccordion from './EconomyFaqAccordion';

export function EconomyHero({ eyebrow, title, lead, metaPills = [], note = '' }) {
  return (
    <header className="economy-hero">
      <span className="economy-hero__eyebrow">{eyebrow}</span>
      <h1 className="economy-hero__title">{title}</h1>
      <p className="economy-hero__lead">{lead}</p>
      <div className="economy-hero__meta">
        {metaPills.map((pill) => (
          <span key={pill.label} className="economy-meta-pill">{pill.label}</span>
        ))}
      </div>
      {note ? <p className="economy-note">{note}</p> : null}
    </header>
  );
}

export function EconomySectionLabel({ badge, label }) {
  return (
    <div className="economy-section-label">
      <span className="economy-section-label__badge">{badge}</span>
      <span className="economy-section-label__text">{label}</span>
      <div className="economy-section-label__line" />
    </div>
  );
}

export function CountdownHero({ model }) {
  return (
    <section className="economy-countdown-hero" data-tone={model.tone}>
      <span className="economy-countdown-hero__eyebrow">العداد الحي</span>
      <div className="economy-countdown-hero__clock">{model.clockLabel}</div>
      <h2 className="economy-countdown-hero__title">{model.title}</h2>
      <p className="economy-countdown-hero__detail">{model.detail}</p>
      <div className="economy-countdown-hero__meta">
        <span className="economy-meta-pill">الافتتاح: {model.openLabel}</span>
        <span className="economy-meta-pill">الإغلاق: {model.closeLabel}</span>
      </div>
    </section>
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

export function EconomyStatCards({ cards = [] }) {
  if (!cards.length) return null;
  return (
    <div className="economy-kpi-rail">
      {cards.map((card) => (
        <article key={`${card.label}-${card.value}`} className="economy-kpi-card" data-tone={card.tone || 'default'}>
          <span className="economy-kpi-card__label">{card.label}</span>
          <strong className="economy-kpi-card__value">{card.value}</strong>
          <p className="economy-kpi-card__detail">{card.detail}</p>
        </article>
      ))}
    </div>
  );
}

export function EconomySpotlight({ model }) {
  if (!model) return null;
  return (
    <section className="economy-spotlight" data-tone={model.tone || 'default'}>
      <span className="economy-spotlight__eyebrow">{model.eyebrow}</span>
      <h2 className="economy-spotlight__title">{model.title}</h2>
      <p className="economy-spotlight__body">{model.body}</p>
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
  return <EconomyFaqAccordion items={items} />;
}

export function LiveSessionsStrip({ sessions, nowLabel }) {
  return (
    <section className="economy-strip">
      <div className="economy-strip__head">
        <h2 className="economy-strip__title">الجلسات الحية الآن</h2>
        <span className="economy-meta-pill">الآن: {nowLabel}</span>
      </div>
      <div className="economy-strip__grid">
        {sessions.map((session) => (
          <article key={session.id} className="economy-strip__item" data-tone={session.statusTone}>
            <strong>{session.nameAr}</strong>
            <span>{session.statusLabel}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function GoldActivityMeter({ score, label, tone = 'default' }) {
  return (
    <section className="economy-meter" data-tone={tone}>
      <div className="economy-meter__dial" style={{ '--score': `${score}` }}>
        <div className="economy-meter__inner">
          <strong>{score}</strong>
          <span>من 100</span>
        </div>
      </div>
      <div className="economy-meter__copy">
        <span className="economy-meter__eyebrow">مؤشر نشاط الذهب الآن</span>
        <h2 className="economy-meter__title">{label}</h2>
        <p className="economy-meter__detail">
          قراءة بصرية سريعة تساعدك على فهم إن كان الذهب في ذروة سيولة، أو نشاط متوسط، أو فترة خمول واضحة.
        </p>
      </div>
    </section>
  );
}

export function CityClockGrid({ cities }) {
  return (
    <div className="economy-city-grid">
      {cities.map((city) => (
        <article key={city.id} className="economy-city-card">
          <span className="economy-city-card__name">{city.cityNameAr}</span>
          <span className="economy-city-card__country">{city.countryNameAr}</span>
          <div className="economy-city-card__times">
            <div>
              <small>جرس الافتتاح</small>
              <strong>{city.openLabel}</strong>
            </div>
            <div>
              <small>جرس الإغلاق</small>
              <strong>{city.closeLabel}</strong>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function InsightCards({ cards }) {
  return (
    <div className="economy-guide-grid">
      {cards.map((card) => (
        <article key={card.title} className="economy-copy-card">
          <h3 className="economy-copy-card__title">{card.title}</h3>
          <p className="economy-copy-card__body">{card.body}</p>
          {card.href ? (
            <Link href={card.href} className="economy-tool-card__cta">{card.cta || 'فتح الأداة'}</Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function EconomyTimeline({ timeline, onHourClick = null, selectedHour = null }) {
  const hourButtons = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: String(hour).padStart(2, '0'),
  }));
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
                  style={{ insetInlineStart: `${segment.startPercent}%`, width: `${segment.widthPercent}%` }}
                />
              ))}
              {bar.id === 'london' && timeline.overlapSegments.map((segment) => (
                <span
                  key={`overlap-${segment.startPercent.toFixed(2)}`}
                  className="economy-timeline__segment--overlap"
                  style={{ insetInlineStart: `${segment.startPercent}%`, width: `${segment.widthPercent}%` }}
                />
              ))}
              <span className="economy-timeline__now" style={{ insetInlineStart: `${timeline.nowPercent}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="economy-timeline__hours">
        {timeline.hourLabels.map((item) => (
          <span key={`${item.label}-${item.positionPercent}`}>{item.label}</span>
        ))}
      </div>
      {onHourClick ? (
        <div className="economy-timeline__picker">
          {hourButtons.map((item) => (
            <button
              key={item.hour}
              type="button"
              className="economy-timeline__picker-button"
              data-active={selectedHour === item.hour}
              onClick={() => onHourClick(item.hour)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function HourDetailPanel({ point }) {
  if (!point) return null;
  return (
    <section className="economy-hour-panel">
      <div className="economy-hour-panel__head">
        <h3>{point.hourLabel}</h3>
        <span className="market-card__status" data-tone={point.band === 'peak' ? 'success' : point.band === 'active' ? 'warning' : 'info'}>
          {point.hint}
        </span>
      </div>
      <div className="economy-hour-panel__grid">
        <div><small>الجلسات</small><strong>{point.sessionsLabel}</strong></div>
        <div><small>أفضل الأزواج</small><strong>{point.bestPairs?.length ? point.bestPairs.join('، ') : 'لا توجد أولوية واضحة'}</strong></div>
        <div><small>الذهب</small><strong>{point.goldStatus}</strong></div>
      </div>
      <p className="economy-copy-card__body">{point.note}</p>
    </section>
  );
}

export function TradingProfileSelector({ options, selectedId, onSelect }) {
  return (
    <section className="economy-profile-selector">
      <h2 className="economy-section__title">اختر أسلوبك أولاً</h2>
      <div className="economy-profile-selector__grid">
        {options.map((option) => (
          <button key={option.id} type="button" className="economy-profile-selector__button"
            data-active={selectedId === option.id} onClick={() => onSelect(option.id)}>
            <strong>{option.icon} {option.label}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

export function CityComparisonWidget({ options, selectedId, onSelect, comparison }) {
  return (
    <section className="economy-comparison-card">
      <div className="economy-comparison-card__head">
        <h3>مقارنة مدينة أخرى</h3>
        <div className="economy-comparison-card__chips">
          {options.map((option) => (
            <button key={option.id} type="button" className="economy-comparison-card__chip"
              data-active={selectedId === option.id} onClick={() => onSelect(option.id)}>
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="economy-comparison-card__grid">
        <div><small>فرق التوقيت</small><strong>{comparison.timeDiffLabel}</strong></div>
        <div><small>ذروة مدينتك</small><strong>{comparison.viewerPeakLabel}</strong></div>
        <div><small>ذروة {comparison.compareCityNameAr}</small><strong>{comparison.comparePeakLabel}</strong></div>
      </div>
      <p className="economy-copy-card__body">{comparison.summary}</p>
    </section>
  );
}

export function EconomyTable({ columns, rows }) {
  return (
    <div className="economy-table-wrap">
      <table className="economy-table">
        <thead>
          <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              {row.cells.map((cell, i) => <td key={`${row.key}-${i}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
            <span className="economy-tool-card__cta">{card.isLive ? 'فتح الأداة' : 'قريباً ضمن نفس البنية'}</span>
          </>
        );
        if (!card.href) return <article key={card.title} className="economy-tool-card" data-disabled="true">{content}</article>;
        return <Link key={card.href} href={card.href} className="economy-tool-card">{content}</Link>;
      })}
    </div>
  );
}

export function EconomySourceTable({ rows }) {
  return (
    <div className="economy-source-table">
      <div className="economy-source-table__head">
        <span>السوق</span><span>الحالة</span><span>المصدر المباشر</span><span>المرجع الرسمي</span><span>آخر مزامنة</span>
      </div>
      {rows.map((row) => (
        <article key={row.id} className="economy-source-table__row">
          <div><strong>{row.marketLabel}</strong>{row.note ? <p>{row.note}</p> : null}</div>
          <div>{row.modeLabel}</div>
          <div>
            {row.statusSource?.url ? <a href={row.statusSource.url} target="_blank" rel="noreferrer">{row.statusSource.label}</a> : <span>{row.statusSource?.label || '--'}</span>}
          </div>
          <div className="economy-source-table__links">
            {row.officialSource?.url ? <a href={row.officialSource.url} target="_blank" rel="noreferrer">{row.officialSource.label}</a> : <span>--</span>}
            {row.supportSource?.url ? <a href={row.supportSource.url} target="_blank" rel="noreferrer">{row.supportSource.label}</a> : null}
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
        <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="economy-meta-pill">{link.label}</a>
      ))}
    </div>
  );
}
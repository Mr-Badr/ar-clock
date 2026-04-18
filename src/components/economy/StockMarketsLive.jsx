// components/economy/StockMarketsLive.jsx
'use client';

import Link from 'next/link';

import { Bank, ClockCounterClockwise, GlobeHemisphereWest, ArrowSquareOut, TrendUp } from '@phosphor-icons/react';

import AdInArticle from '@/components/ads/AdInArticle';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { buildStockMarketsPageModel } from '@/lib/economy/engine';

import { FAQ_ITEMS } from './data/faqItems';
import { useEconomyLiveModel } from './useEconomyLiveModel';
import {
  EconomyFaq,
  EconomyGuide,
  EconomyHero,
  EconomySectionHeader,
  EconomySectionLabel,
  EconomySpotlight,
  EconomyStatCards,
  EconomySourceTable,
  EconomyTable,
  EconomyToolCards,
} from './common';

/* ══════════════════════════════════════════════════════════════════
   CHART 1 — Global Sessions Timeline (24h SVG bar chart)
   Converts UTC market hours → viewer local time via getTimezoneOffset
   ══════════════════════════════════════════════════════════════════ */
const SESSIONS_UTC = [
  { id: 'tokyo',   nameAr: 'طوكيو',     utcStart: 0,    utcEnd: 6,     color: 'var(--success)'    },
  { id: 'hk',      nameAr: 'هونغ كونغ', utcStart: 1.5,  utcEnd: 8,     color: 'var(--info)'       },
  { id: 'dubai',   nameAr: 'دبي',        utcStart: 5.5,  utcEnd: 12,    color: 'var(--accent-alt)' },
  { id: 'london',  nameAr: 'لندن',       utcStart: 8,    utcEnd: 16.5,  color: 'var(--info)'       },
  { id: 'newyork', nameAr: 'نيويورك',    utcStart: 13.5, utcEnd: 20,    color: 'var(--warning)'    },
];

function SessionsTimelineChart() {
  const viewerOffset = -new Date().getTimezoneOffset() / 60;
  const nowH = new Date().getHours() + new Date().getMinutes() / 60;
  const nowPct = (nowH / 24) * 100;
  const toLocal = (utcH) => ((utcH + viewerOffset) % 24 + 24) % 24;
  const pct = (h) => (h / 24) * 100;
  const getSegments = (utcStart, utcEnd) => {
    const ls = toLocal(utcStart);
    const le = toLocal(utcEnd);
    if (le >= ls) return [{ s: ls, e: le }];
    return [{ s: ls, e: 24 }, { s: 0, e: le }];
  };

  return (
    <div className="economy-chart-card">
      <div className="economy-chart-card__header">
        <div>
          <h3 className="economy-chart-card__title">خريطة الجلسات — 24 ساعة</h3>
          <p className="economy-chart-card__subtitle">أوقات كل سوق محوّلة لتوقيتك المحلي · الخط العمودي = الآن</p>
        </div>
        <div className="economy-chart-card__legend">
          {[
            { label: 'آسيا',    color: 'var(--success)' },
            { label: 'الخليج',  color: 'var(--accent-alt)' },
            { label: 'أوروبا',  color: 'var(--info)' },
            { label: 'أمريكا',  color: 'var(--warning)' },
          ].map((item) => (
            <span key={item.label} className="economy-chart-card__legend-item">
              <span className="economy-chart-card__legend-dot" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="economy-sessions-chart">
        {SESSIONS_UTC.map((session) => {
          const segments = getSegments(session.utcStart, session.utcEnd);
          return (
            <div key={session.id} className="economy-sessions-chart__row">
              <span className="economy-sessions-chart__label">{session.nameAr}</span>
              <div className="economy-sessions-chart__track">
                {segments.map((seg, i) => (
                  <div
                    key={i}
                    className="economy-sessions-chart__bar"
                    style={{
                      insetInlineStart: `${pct(seg.s)}%`,
                      width: `${pct(seg.e - seg.s)}%`,
                      background: session.color,
                    }}
                  />
                ))}
                <div className="economy-sessions-chart__now" style={{ insetInlineStart: `${nowPct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="economy-sessions-chart__hours">
        {['00', '04', '08', '12', '16', '20', '24'].map((h) => <span key={h}>{h}</span>)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CHART 2 — Trading Activity Heat (24h bar chart)
   Based on known session overlaps (UTC) rotated to viewer local time
   ══════════════════════════════════════════════════════════════════ */
const ACTIVITY_UTC = [
  15, 12, 10, 8,  8,  18, 35, 45,  // 0-7   Tokyo, Gulf opening
  72, 78, 80, 75, 70, 85, 95, 98,  // 8-15  London open, NY/London overlap
  100,95, 88, 75, 55, 40, 28, 18,  // 16-23 NY session
];

function TradingActivityChart() {
  const viewerOffset = -new Date().getTimezoneOffset() / 60;
  const nowH = new Date().getHours();
  const localActivity = Array.from({ length: 24 }, (_, localHour) => {
    const utcH = ((localHour - viewerOffset) % 24 + 24) % 24;
    return ACTIVITY_UTC[Math.floor(utcH)];
  });
  const getBand = (s) => s >= 85 ? 'peak' : s >= 55 ? 'active' : s >= 25 ? 'warm' : 'cool';

  return (
    <div className="economy-chart-card">
      <div className="economy-chart-card__header">
        <div>
          <h3 className="economy-chart-card__title">نشاط التداول حسب الساعة</h3>
          <p className="economy-chart-card__subtitle">مؤشر السيولة المتوقعة بتوقيتك · بناءً على الجلسات المتداخلة</p>
        </div>
        <div className="economy-chart-card__legend">
          {[
            { band: 'peak',   label: 'ذروة التداول',  bg: 'var(--warning)' },
            { band: 'active', label: 'نشاط عالي',     bg: 'var(--success)' },
            { band: 'warm',   label: 'نشاط متوسط',    bg: 'var(--info)' },
            { band: 'cool',   label: 'هدوء السوق',    bg: 'var(--bg-surface-4)' },
          ].map((item) => (
            <span key={item.band} className="economy-chart-card__legend-item">
              <span className="economy-chart-card__legend-dot" style={{ background: item.bg, border: '1px solid var(--border-subtle)' }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="economy-activity-grid">
          {localActivity.map((score, hour) => (
            <div
              key={hour}
              className="economy-activity-bar"
              data-band={getBand(score)}
              title={`${String(hour).padStart(2,'0')}:00 — ${score}%`}
              style={{
                height: `${Math.max(score, 6)}%`,
                outline: hour === nowH ? '2px solid var(--text-primary)' : 'none',
                outlineOffset: '1px',
              }}
            />
          ))}
        </div>
        <div className="economy-activity-hours">
          {localActivity.map((_, hour) => (
            <span key={hour} style={{ opacity: hour % 4 === 0 ? 1 : 0 }}>
              {String(hour).padStart(2, '0')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Open Markets Donut — SVG arc
   ══════════════════════════════════════════════════════════════════ */
function MarketsDonut({ open, total }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const ratio = total > 0 ? open / total : 0;
  const filled = circ * ratio;
  return (
    <svg viewBox="0 0 100 100" width="90" height="90" style={{ flexShrink: 0 }}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg-surface-4)" strokeWidth="10" />
      <circle cx="50" cy="50" r={r} fill="none"
        stroke={open > 0 ? 'var(--success)' : 'var(--text-muted)'}
        strokeWidth="10"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="900"
        fill="var(--text-primary)" fontFamily="var(--font-heading)">{open}</text>
      <text x="50" y="62" textAnchor="middle" fontSize="9" fill="var(--text-muted)">من {total}</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   QUICK STATUS PANEL — 3 major markets
   ══════════════════════════════════════════════════════════════════ */
function MarketStatusPanel({ majorBoards }) {
  const targets = [
    { id: 'us', nameAr: 'السوق الأمريكي', flag: '🇺🇸' },
    { id: 'uk', nameAr: 'بورصة لندن',     flag: '🇬🇧' },
    { id: 'sa', nameAr: 'تداول السعودي',  flag: '🇸🇦' },
  ];
  return (
    <div className="economy-status-grid">
      {targets.map(({ id, nameAr, flag }) => {
        const board = majorBoards.find((b) => b.id === id);
        if (!board) return null;
        const tone = board.statusTone;
        const isOpen = tone === 'success';
        const isPre  = tone === 'warning';
        return (
          <div key={id} className="economy-status-card" data-tone={tone}>
            <div className="economy-status-card__bar" />
            <div className="economy-status-card__top">
              <span className="economy-status-card__flag">{flag}</span>
              <div className="economy-status-card__header-end">
                {isOpen && <span className="economy-live-dot" />}
                {isPre  && <span className="economy-live-dot economy-live-dot--warning" />}
                <span className="market-card__status" data-tone={tone}>{board.statusLabel}</span>
              </div>
            </div>
            <div>
              <div className="economy-status-card__name">{nameAr}</div>
              <div className="economy-status-card__status-label">{board.statusLabel}</div>
            </div>
            <div className="economy-status-card__countdown">
              {board.countdownLabel || board.marketTimeLabel || '—'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ARAB MARKETS SUMMARY — donut + progress bar
   ══════════════════════════════════════════════════════════════════ */
function ArabMarketsSummary({ model }) {
  const { arabMarketsOpenCount: open, arabMarketsTotal: total, arabMarketsOpenNames: names } = model;
  const pct = total > 0 ? (open / total) * 100 : 0;
  return (
    <div className="economy-arab-summary" data-tone={open > 0 ? 'success' : 'default'}>
      <div className="economy-arab-summary__row">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <MarketsDonut open={open} total={total} />
          <div>
            <span className="economy-section-label__text">ملخص الخليج</span>
            <div style={{ marginTop: 'var(--space-1)' }}>
              <span className="economy-arab-summary__count">{open}</span>
              <span className="economy-arab-summary__of">من {total} مفتوح</span>
            </div>
            <p className="economy-arab-summary__names" style={{ marginTop: 'var(--space-2)' }}>
              {names.length > 0
                ? <><span style={{ color: 'var(--text-muted)' }}>المفتوح حالياً: </span><strong>{names.join('، ')}</strong></>
                : 'لا توجد بورصة عربية مفتوحة الآن ضمن الساعات الاعتيادية'}
            </p>
          </div>
        </div>
        {open > 0 && (
          <span className="economy-live-badge" style={{ alignSelf: 'flex-start' }}>
            <span className="economy-live-dot" />
            نشط
          </span>
        )}
      </div>
      <div className="economy-progress-track">
        <div className="economy-progress-fill" data-tone={open > 0 ? 'success' : 'default'} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TRUST SECTION
   ══════════════════════════════════════════════════════════════════ */
function TrustSection({ summary, points }) {
  return (
    <div className="economy-trust">
      <div className="economy-trust__header">
        <span className="economy-trust__kicker">ثقة البيانات</span>
        <h2 className="economy-trust__title">طبقة مجانية واضحة وحدودها معلنة</h2>
        <p className="economy-trust__lead">{summary}</p>
      </div>
      <div className="economy-trust__grid">
        {points.map((point) => (
          <div key={point.title} className="economy-trust__item">
            <h3 className="economy-trust__item-title">{point.title}</h3>
            <p className="economy-trust__item-body">{point.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   EXCHANGE CARD — premium (uses new CSS classes)
   ══════════════════════════════════════════════════════════════════ */
function ExchangeCard({ card }) {
  const tone = card.statusTone || 'default';
  const isOpen = tone === 'success';
  const isPre  = tone === 'warning';

  return (
    <article className="market-card" data-tone={tone}>
      <div className="market-card__accent-bar" />
      <div className="market-card__body">
        {/* Header */}
        <div className="market-card__top">
          <div className="market-card__title-wrap">
            <h3 className="market-card__title">{card.flag} {card.nameAr}</h3>
            <p className="market-card__subtitle">{card.cityNameAr} · {card.referenceIndex}</p>
          </div>
          <span className="market-card__status" data-tone={tone}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {isOpen && <span className="economy-live-dot" style={{ '--economy-pulse-color': 'var(--success)', width: '6px', height: '6px' }} />}
            {isPre  && <span className="economy-live-dot economy-live-dot--warning" style={{ width: '6px', height: '6px' }} />}
            {card.statusLabel}
          </span>
        </div>

        {/* Countdown hero */}
        <div className="market-card__countdown">
          <div>
            <div className="market-card__countdown-prefix">{card.countdownPrefix}</div>
            <div className="market-card__countdown-value">{card.countdownLabel}</div>
          </div>
          <div className="market-card__countdown-aside">
            <div className="market-card__countdown-aside-label">الوقت في السوق</div>
            <div className="market-card__countdown-aside-value">{card.marketTimeLabel}</div>
          </div>
        </div>

        {/* 2×2 metrics */}
        <dl className="market-card__metrics-grid">
          {[
            { label: 'يفتح بتوقيتك', value: card.openLabel },
            { label: 'يغلق بتوقيتك', value: card.closeLabel },
            { label: 'العملة',        value: card.localCurrency },
            { label: 'السيولة',       value: card.liquidityTierLabel },
          ].map(({ label, value }) => (
            <div key={label} className="market-card__metric-cell">
              <dt>{label}</dt>
              <dd>{value || '—'}</dd>
            </div>
          ))}
        </dl>

        {/* Footnotes */}
        {(card.phaseLabel || card.catalystLabel || card.note || card.trustNote || card.sourceLabel) && (
          <div className="market-card__footnotes">
            {card.phaseLabel    && <p className="market-card__footnote">المرحلة: {card.phaseLabel}</p>}
            {card.catalystLabel && <p className="market-card__footnote">محركات المتابعة: {card.catalystLabel}</p>}
            {card.note          && <p className="market-card__footnote">{card.note}</p>}
            {card.trustNote     && <p className="market-card__footnote">{card.trustNote}</p>}
            {card.sourceLabel   && (
              <p className="market-card__footnote">
                مصدر الحالة:{' '}
                {card.sourceUrl
                  ? <a href={card.sourceUrl} target="_blank" rel="noreferrer">{card.sourceLabel}</a>
                  : card.sourceLabel}
                {card.syncLabel ? ` · ${card.syncLabel}` : ''}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SESSION DEEP DIVE
   ══════════════════════════════════════════════════════════════════ */
function SessionDeepDive({ model }) {
  return (
    <div className="economy-session-detail">
      <div className="economy-session-card">
        <div className="economy-session-card__header">
          <div>
            <h2 className="economy-session-card__title">🇺🇸 السوق الأمريكي من مدينتك</h2>
            <p className="economy-session-card__subtitle">متى تجلس فعلياً أمام الشاشة؟</p>
          </div>
          <span className="economy-session-card__icon"><GlobeHemisphereWest size={22} weight="duotone" /></span>
        </div>
        <dl className="economy-session-card__metrics">
          {[
            { label: 'جرس الافتتاح',          value: model.usFocus.openLabel },
            { label: 'الساعة الأولى',          value: model.usFocus.firstHourLabel },
            { label: 'ذروة التداخل مع لندن',   value: model.usFocus.overlapLabel },
            { label: 'جرس الإغلاق',            value: model.usFocus.closeLabel },
          ].map(({ label, value }) => (
            <div key={label} className="economy-session-card__row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="economy-session-card">
        <div className="economy-session-card__header">
          <div>
            <h2 className="economy-session-card__title">جلسات ما قبل وما بعد السوق</h2>
            <p className="economy-session-card__subtitle">Pre-market / After-hours</p>
          </div>
          <span className="economy-session-card__icon"><ClockCounterClockwise size={22} weight="duotone" /></span>
        </div>
        <dl className="economy-session-card__metrics">
          {[
            { label: 'ما قبل السوق',    value: model.extendedHours.premarketLabel },
            { label: 'ما بعد الإغلاق', value: model.extendedHours.afterhoursLabel },
          ].map(({ label, value }) => (
            <div key={label} className="economy-session-card__row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {model.extendedHours.note && (
          <p className="economy-session-card__note">{model.extendedHours.note}</p>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TADAWUL DETAIL CARD
   ══════════════════════════════════════════════════════════════════ */
function TadawulDetailCard({ detail }) {
  return (
    <div className="economy-session-card" style={{
      background: 'linear-gradient(160deg, color-mix(in srgb, var(--accent-soft) 35%, var(--bg-surface-2)) 0%, var(--bg-surface-1) 100%)',
      borderColor: 'var(--border-accent)',
    }}>
      <div className="economy-session-card__header">
        <div>
          <h2 className="economy-session-card__title">🇸🇦 تداول السعودي — تفصيل الجلسات</h2>
          <p className="economy-session-card__subtitle">ما قبل الافتتاح · الجلسة الرئيسية · ما بعد الإغلاق</p>
        </div>
        <span className="market-card__status" data-tone="success"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="economy-live-dot" style={{ width: 6, height: 6 }} />
          {detail.statusLabel}
        </span>
      </div>
      <div className="economy-phases">
        {[
          { label: 'ما قبل الافتتاح', value: detail.premarketLabel,  tone: 'warning' },
          { label: 'الجلسة الرئيسية', value: detail.regularLabel,    tone: 'success' },
          { label: 'ما بعد الإغلاق',  value: detail.afterhoursLabel, tone: 'info' },
        ].map(({ label, value, tone }) => (
          <div key={label} className="economy-phase-card" data-tone={tone}>
            <div className="economy-phase-card__label">{label}</div>
            <div className="economy-phase-card__value">{value}</div>
          </div>
        ))}
      </div>
      <div className="market-card__footnotes">
        <p className="market-card__footnote">{detail.note}</p>
        <p className="market-card__footnote">أيام التحقق للعطل: {detail.holidaysLabel}</p>
        <p className="market-card__footnote">
          المرجع الرسمي:{' '}
          <a href={detail.sourceUrl} target="_blank" rel="noreferrer">
            Saudi Exchange <ArrowSquareOut size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </a>
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MARKET BOARD — Premium Exchange Display
   Pattern: 1 featured hero + compact 2-col grid
   ══════════════════════════════════════════════════════════════════ */

// Region metadata for each exchange id
const REGION_MAP = {
  us: { region: 'americas', label: 'AMERICAS' },
  uk: { region: 'europe',   label: 'EUROPE'   },
  de: { region: 'europe',   label: 'EUROPE'   },
  jp: { region: 'asia',     label: 'ASIA-PAC' },
  hk: { region: 'asia',     label: 'ASIA-PAC' },
  cn: { region: 'asia',     label: 'ASIA-PAC' },
  fr: { region: 'europe',   label: 'EUROPE'   },
  ch: { region: 'europe',   label: 'EUROPE'   },
  sa: { region: 'gulf',     label: 'GULF'     },
  ae: { region: 'gulf',     label: 'GULF'     },
  kw: { region: 'gulf',     label: 'GULF'     },
  qa: { region: 'gulf',     label: 'GULF'     },
  bh: { region: 'gulf',     label: 'GULF'     },
  om: { region: 'gulf',     label: 'GULF'     },
  eg: { region: 'arab',     label: 'N.AFRICA' },
  ma: { region: 'arab',     label: 'N.AFRICA' },
};
const getRegion = (id) => REGION_MAP[String(id).toLowerCase()] || { region: 'americas', label: 'GLOBAL' };

// Typical session length in hours per exchange — for arc progress
const SESSION_HOURS = {
  us: 6.5, uk: 8.5, jp: 6.5, de: 8.5, hk: 6.5,
  fr: 8.5, sa: 5.25, ae: 5.5, kw: 5.5, qa: 6, eg: 5.5, bh: 5.5,
};

// Parse "HH:MM:SS" countdown label → seconds
const parseCountdown = (label) => {
  if (!label) return 0;
  const m = String(label).match(/(\d+):(\d+):(\d+)/);
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0;
};

// Compute session progress 0–1 for open markets
const sessionProgress = (card) => {
  if (card.statusTone !== 'success') return 0;
  const total = (SESSION_HOURS[String(card.id).toLowerCase()] || 6.5) * 3600;
  const rem   = parseCountdown(card.countdownLabel);
  return Math.max(0, Math.min(1, 1 - rem / total));
};

/* ── SESSION PROGRESS ARC (SVG) ────────────────────────────────── */
function SessionArc({ progress, tone }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const color = tone === 'success' ? 'var(--success)' : tone === 'warning' ? 'var(--warning)' : 'var(--text-muted)';
  const pct = Math.round(progress * 100);
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" aria-label={`${pct}% من الجلسة`}>
      {/* Track */}
      <circle cx="30" cy="30" r={r} fill="none" stroke="var(--bg-surface-4)" strokeWidth="5" />
      {/* Fill */}
      <circle cx="30" cy="30" r={r} fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${circ * progress} ${circ * (1 - progress)}`}
        strokeLinecap="round"
        transform="rotate(-90 30 30)"
        style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x="30" y="27" textAnchor="middle" fontSize="11" fontWeight="700"
        fill={color} fontFamily="var(--font-heading)">{pct}%</text>
      <text x="30" y="39" textAnchor="middle" fontSize="8"
        fill="var(--text-muted)">منقضي</text>
    </svg>
  );
}

/* ── FEATURED EXCHANGE CARD (full-width horizontal 3-panel) ────── */
function FeaturedExchangeCard({ card }) {
  const { region, label: regionLabel } = getRegion(card.id);
  const tone    = card.statusTone || 'default';
  const isOpen  = tone === 'success';
  const isPre   = tone === 'warning';
  const progress = sessionProgress(card);

  return (
    <article className="market-card--featured" data-tone={tone}>

      {/* Panel 1 — Identity */}
      <div className="market-card__panel market-card__panel--identity">
        <span className="market-card__featured-flag">{card.flag}</span>
        <h3 className="market-card__featured-name">{card.nameAr}</h3>
        <p className="market-card__featured-exchange">{card.cityNameAr} · {card.referenceIndex}</p>
        <div className="market-card__featured-tags">
          <span className="market-region-badge" data-region={region}>{regionLabel}</span>
          <span className="market-card__status" data-tone={tone}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {isOpen && <span className="economy-live-dot" style={{ width: 6, height: 6 }} />}
            {isPre  && <span className="economy-live-dot economy-live-dot--warning" style={{ width: 6, height: 6 }} />}
            {card.statusLabel}
          </span>
        </div>
      </div>

      {/* Panel 2 — Countdown (hero center) */}
      <div className="market-card__panel market-card__panel--countdown">
        <div className="market-card__featured-prefix">{card.countdownPrefix}</div>
        {(() => {
          const m = String(card.countdownLabel || '').match(/^(\d+):(\d+):(\d+)$/);
          if (m) {
            return (
              <div className="market-card__featured-clock" data-tone={tone}>
                <div className="market-card__clock-seg market-card__clock-seg--lg">
                  <span className="market-card__clock-num market-card__clock-num--lg">{m[1]}</span>
                  <span className="market-card__clock-lbl market-card__clock-lbl--pill">ساعة</span>
                </div>
                <span className="market-card__clock-colon market-card__clock-colon--lg" aria-hidden="true">:</span>
                <div className="market-card__clock-seg market-card__clock-seg--lg">
                  <span className="market-card__clock-num market-card__clock-num--lg">{m[2]}</span>
                  <span className="market-card__clock-lbl market-card__clock-lbl--pill">دقيقة</span>
                </div>
                <span className="market-card__clock-colon market-card__clock-colon--lg" aria-hidden="true">:</span>
                <div className="market-card__clock-seg market-card__clock-seg--lg">
                  <span className="market-card__clock-num market-card__clock-num--lg">{m[3]}</span>
                  <span className="market-card__clock-lbl market-card__clock-lbl--pill">ثانية</span>
                </div>
              </div>
            );
          }
          return <div className="market-card__featured-countdown">{card.countdownLabel}</div>;
        })()}
        <div className="market-card__featured-market-time">{card.marketTimeLabel}</div>
        {isOpen && progress > 0.01 && (
          <div className="market-card__arc-wrap">
            <SessionArc progress={progress} tone={tone} />
          </div>
        )}
        {!isOpen && (
          <div style={{ marginTop: 'var(--space-1)' }}>
            <span className="market-card__status" data-tone={tone}
              style={{ fontSize: 'var(--text-xs)' }}>
              {card.statusLabel}
            </span>
          </div>
        )}
      </div>

      {/* Panel 3 — Session details */}
      <div className="market-card__panel market-card__panel--details">
        <dl className="market-card__details-grid">
          {[
            { label: 'يفتح بتوقيتك',  value: card.openLabel },
            { label: 'يغلق بتوقيتك',  value: card.closeLabel },
            { label: 'العملة المحلية', value: card.localCurrency },
            { label: 'السيولة',        value: card.liquidityTierLabel },
          ].map(({ label, value }) => (
            <div key={label} className="market-card__detail-cell">
              <dt>{label}</dt>
              <dd>{value || '—'}</dd>
            </div>
          ))}
        </dl>

        {/* Footnotes */}
        {(card.phaseLabel || card.catalystLabel || card.note || card.sourceLabel) && (
          <div style={{ display: 'grid', gap: '0.25rem', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)' }}>
            {card.phaseLabel    && <p className="market-card__featured-footnote">المرحلة: {card.phaseLabel}</p>}
            {card.catalystLabel && <p className="market-card__featured-footnote">محركات: {card.catalystLabel}</p>}
            {card.note          && <p className="market-card__featured-footnote">{card.note}</p>}
            {card.sourceLabel   && (
              <p className="market-card__featured-footnote">
                المصدر:{' '}
                {card.sourceUrl
                  ? <a href={card.sourceUrl} target="_blank" rel="noreferrer">{card.sourceLabel}</a>
                  : card.sourceLabel}
              </p>
            )}
          </div>
        )}
      </div>

    </article>
  );
}

/* ── COMPACT EXCHANGE CARD (horizontal row for the 2-col grid) ─── */
function CompactExchangeCard({ card }) {
  const { region, label: regionLabel } = getRegion(card.id);
  const tone   = card.statusTone || 'default';
  const isOpen = tone === 'success';
  const isPre  = tone === 'warning';

  return (
    <article className="market-card--compact" data-tone={tone}>

      {/* Flag zone */}
      <div className="market-card__compact-flag" aria-hidden="true">{card.flag}</div>

      {/* Identity zone */}
      <div className="market-card__compact-identity">
        <span className="market-card__compact-name">{card.nameAr}</span>
        <span className="market-card__compact-exchange">{card.cityNameAr} · {card.referenceIndex}</span>
        <div className="market-card__compact-tags">
          <span className="market-region-badge" data-region={region}>{regionLabel}</span>
          <span className="market-card__status" data-tone={tone}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: 'var(--text-xs)', padding: '0.2rem 0.55rem' }}>
            {isOpen && <span className="economy-live-dot" style={{ width: 5, height: 5 }} />}
            {isPre  && <span className="economy-live-dot economy-live-dot--warning" style={{ width: 5, height: 5 }} />}
            {card.statusLabel}
          </span>
        </div>
      </div>

      {/* Countdown / times zone */}
      <div className="market-card__compact-right">
        {(() => {
          const m = String(card.countdownLabel || '').match(/^(\d+):(\d+):(\d+)$/);
          if (m) {
            return (
              <div className="market-card__compact-clock" data-tone={tone}>
                <div className="market-card__clock-seg">
                  <span className="market-card__clock-num">{m[1]}</span>
                  <span className="market-card__clock-lbl">ساعة</span>
                </div>
                <span className="market-card__clock-colon" aria-hidden="true">:</span>
                <div className="market-card__clock-seg">
                  <span className="market-card__clock-num">{m[2]}</span>
                  <span className="market-card__clock-lbl">دقيقة</span>
                </div>
                <span className="market-card__clock-colon" aria-hidden="true">:</span>
                <div className="market-card__clock-seg">
                  <span className="market-card__clock-num">{m[3]}</span>
                  <span className="market-card__clock-lbl">ثانية</span>
                </div>
              </div>
            );
          }
          return <div className="market-card__compact-countdown">{card.countdownLabel}</div>;
        })()}
        <div className="market-card__compact-times">
          <span className="market-card__compact-time-item">
            <span style={{ opacity: 0.5 }}>↑</span>
            <strong>{card.openLabel}</strong>
          </span>
          <span className="market-card__compact-time-item" style={{ opacity: 0.6 }}>·</span>
          <span className="market-card__compact-time-item">
            <span style={{ opacity: 0.5 }}>↓</span>
            <strong>{card.closeLabel}</strong>
          </span>
        </div>
      </div>

    </article>
  );
}

/* ── MARKET BOARD: featured + compact grid ─────────────────────── */
function MarketBoard({ cards = [] }) {
  if (!cards.length) return null;
  const [featured, ...rest] = cards;
  return (
    <div className="economy-market-board">
      <FeaturedExchangeCard card={featured} />
      {rest.length > 0 && (
        <div className="economy-market-compact-grid">
          {rest.map((card) => (
            <CompactExchangeCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════════════════ */
export default function StockMarketsLive({ initialViewer, initialNowIso }) {
  const model = useEconomyLiveModel(buildStockMarketsPageModel, initialViewer, initialNowIso);

  if (!model) {
    return (
      <div className="economy-stack">
        <EconomyHero
          eyebrow={<><Bank size={16} weight="duotone" /> هل البورصات العالمية مفتوحة الآن؟</>}
          title="نحمّل توقيت البورصات العالمية من مدينتك"
          lead="بعد تحديد منطقتك الزمنية نعرض حالة أمريكا ولندن وتداول السعودي الآن، مع أوقات الافتتاح والإغلاق والجلسات الموسعة مباشرةً بتوقيتك المحلي."
          metaPills={[{ label: 'جارٍ تحديد توقيتك الحالي' }]}
        />
      </div>
    );
  }

  return (
    <div className="economy-stack">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <header className="economy-hero">
        <div className="economy-live-row">
          <span className="economy-hero__eyebrow">
            <Bank size={16} weight="duotone" />
            هل البورصات العالمية مفتوحة الآن؟
          </span>
          <span className="economy-live-badge">
            <span className="economy-live-dot" />
            مباشر · {model.nowLabel}
          </span>
        </div>
        <h1 className="economy-hero__title">
          هل البورصات العالمية مفتوحة الآن من{' '}
          <span style={{ color: 'var(--accent-alt)' }}>{model.viewer.label}</span>
          ؟
        </h1>
        <p className="economy-hero__lead">
          هذه الصفحة تجيب بسرعة عن الأسئلة التي يكررها المستخدم العربي يومياً: هل السوق الأمريكي مفتوح الآن، متى تفتح لندن، هل تداول السعودي يعمل حالياً، وما الفرق بين الجلسة الرسمية والجلسات الموسعة؟ كل ذلك محسوب من منطقتك الزمنية الحقيقية من دون خدمة مدفوعة.
        </p>
        <div className="economy-hero__meta">
          {[model.viewer.sublabel, model.todayLabel, 'المصدر: الساعات الاعتيادية الرسمية']
            .filter(Boolean)
            .map((l) => <span key={l} className="economy-meta-pill">{l}</span>)}
        </div>
        {model.viewer.notice && <p className="economy-note">{model.viewer.notice}</p>}
      </header>

      {/* ── KPI RAIL ─────────────────────────────────────────────── */}
      <EconomyStatCards cards={model.signalCards} />
      {model.spotlight && <EconomySpotlight model={model.spotlight} />}

      {/* ── AD ───────────────────────────────────────────────────── */}
      <AdTopBanner slotId="top-economy-stock-markets" />

      {/* ── SESSIONS CHART ───────────────────────────────────────── */}
      <section className="economy-section">
        <EconomySectionLabel badge={<TrendUp size={13} weight="duotone" />} label="خريطة الجلسات العالمية" />
        <SessionsTimelineChart />
      </section>

      {/* ── QUICK STATUS ─────────────────────────────────────────── */}
      <section className="economy-section">
        <EconomySectionLabel badge="◎" label="جواب فوري — هل السوق مفتوح الآن؟" />
        <MarketStatusPanel majorBoards={model.majorBoards} />
      </section>

      {/* ── ARAB SUMMARY ─────────────────────────────────────────── */}
      <ArabMarketsSummary model={model} />

      {/* ── TRUST ─────────────────────────────────────────────────── */}
      <TrustSection summary={model.trustSummary} points={model.trustPoints || []} />

      {/* ══ GLOBAL MARKETS ═══════════════════════════════════════ */}
      <section className="economy-section">
        <EconomySectionLabel badge="01" label="البورصات العالمية الكبرى" />
        <div className="economy-section__header">
          <h2 className="economy-section__title">البورصات العالمية</h2>
          <p className="economy-section__lead">
            السوق الأول يُعرض كبطاقة تفصيلية مع مؤشر الجلسة المنقضية — والأسواق الأخرى في عرض مضغوط سريع القراءة.
            كل الأوقات محوّلة لتوقيتك المحلي.
          </p>
        </div>
        <MarketBoard cards={model.globalCards} />
      </section>

      {/* ══ ARAB MARKETS ═════════════════════════════════════════ */}
      <section className="economy-section">
        <EconomySectionLabel badge="02" label="البورصات العربية والخليجية" />
        <div className="economy-section__header">
          <h2 className="economy-section__title">البورصات العربية</h2>
          <p className="economy-section__lead">
            أسواق الخليج والمنطقة العربية مجمّعة في لوحة واحدة مع تصنيف إقليمي وتحويل تلقائي لتوقيتك.
          </p>
        </div>
        <MarketBoard cards={model.arabCards} />
      </section>

      {/* ── SOURCE TABLE ─────────────────────────────────────────── */}
      {(model.sourceRows || []).length > 0 && (
        <section className="economy-section">
          <EconomySectionLabel badge="📊" label="مصادر البيانات" />
          <EconomySectionHeader
            title="من أين تأتي البيانات؟"
            lead="هذه اللوحة تبيّن مصدر الحالة المباشرة، والمرجع الرسمي لساعات التداول، وآخر مزامنة مرئية."
          />
          <EconomySourceTable rows={model.sourceRows} />
        </section>
      )}

      {/* ── AD MID ───────────────────────────────────────────────── */}
      <AdInArticle slotId="mid-economy-stock-markets" />

      {/* ── ACTIVITY CHART ───────────────────────────────────────── */}
      <section className="economy-section">
        <EconomySectionLabel badge="03" label="نشاط التداول" />
        <TradingActivityChart />
      </section>

      {/* ── SESSION DEEP DIVE ─────────────────────────────────────── */}
      <section className="economy-section">
        <EconomySectionLabel badge="04" label="عمق الجلسة" />
        <SessionDeepDive model={model} />
      </section>

      {/* ── TADAWUL DETAIL ───────────────────────────────────────── */}
      <section className="economy-section">
        <TadawulDetailCard detail={model.tadawulDetail} />
      </section>

      {/* ── WEEKLY SNAPSHOT ──────────────────────────────────────── */}
      <section className="economy-section">
        <EconomySectionLabel badge="📅" label="جدول الأسبوع" />
        <EconomySectionHeader
          title="أيام المتابعة خلال الأسبوع"
          lead="الأيام التي تُتابع فيها هذه الصفحة خلال الأسبوع الحالي بتوقيتك."
        />
        <EconomyTable
          columns={['اليوم', 'التاريخ']}
          rows={model.weeklySnapshot.map((item) => ({ key: item.label, cells: [item.label, item.dateLabel] }))}
        />
      </section>

      {/* ── ARAB HOLIDAYS ────────────────────────────────────────── */}
      <section className="economy-section">
        <EconomySectionHeader
          title="عطل مرجعية للبورصات العربية"
          lead="أشهر العطل الثابتة عالية البحث، مع تذكير واضح بضرورة التحقق من كل بورصة عند العطل المتغيرة."
        />
        <EconomyTable
          columns={['البورصة', 'التاريخ الميلادي', 'التاريخ الهجري', 'اسم العطلة', 'الحالة']}
          rows={model.arabHolidayRows}
        />
      </section>

      {/* ── GUIDE ────────────────────────────────────────────────── */}
      <section className="economy-section">
        <EconomySectionHeader
          title="دليل مختصر للمستثمر العربي"
          lead="شرح عربي واضح يربط الافتتاح والإغلاق والجلسات الموسعة بساعة المستخدم المحلية ومصدر البيانات."
        />
        <EconomyGuide sections={model.guideSections} />
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="economy-section">
        <EconomySectionHeader
          title="أسئلة شائعة"
          lead="الإجابات التالية تختصر أشهر أسئلة البورصات العالمية بلغة مباشرة مناسبة للمستخدم العربي."
        />
        <EconomyFaq items={model.faqItems || FAQ_ITEMS.stockMarkets} />
      </section>

      {/* ── TOOLS ────────────────────────────────────────────────── */}
      <section className="economy-section">
        <EconomySectionHeader
          title="أدوات مرتبطة"
          lead="للمستخدم الذي يريد أكثر من جواب نعم أو لا، أضفنا أدوات مرتبطة تساعده على قراءة السوق بصرياً."
        />
        <EconomyToolCards cards={model.relatedTools} />
      </section>

      {/* ── DISCLAIMER ───────────────────────────────────────────── */}
      <div className="economy-banner" data-tone="default">
        <p className="economy-banner__detail">{model.disclaimer}</p>
        <div className="economy-source-links">
          <Link href="/disclaimer" className="economy-meta-pill">إخلاء المسؤولية</Link>
        </div>
      </div>

    </div>
  );
}

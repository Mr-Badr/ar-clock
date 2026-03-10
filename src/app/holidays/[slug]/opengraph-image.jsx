/**
 * app/holidays/[slug]/opengraph-image.jsx
 * Dynamic OG image — server-side via next/og, Edge Runtime.
 *
 * Supported dimensions:
 *   Default  1200×630  — Twitter/X, Facebook, WhatsApp, Telegram, LinkedIn
 *   Square   1200×1200 — Google Discover, Instagram link previews (pass ?sq=1)
 *
 * Usage in metadata:
 *   openGraph: { images: [{ url: `/holidays/${slug}/opengraph-image`, width:1200, height:630 }] }
 *   twitter:   { card: 'summary_large_image', images: [`/holidays/${slug}/opengraph-image`] }
 *
 * Square variant (Google Discover / Instagram):
 *   <img src="/holidays/eid-al-fitr/opengraph-image?sq=1" />
 */
import { ImageResponse } from 'next/og';
import {
  ALL_EVENTS, enrichEvent,
  getNextEventDate, getTimeRemaining,
  formatGregorianAr, resolveEventMeta,
} from '@/lib/holidays-engine';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';

export const runtime = 'edge';
export const contentType = 'image/png';

// Default size — overridden per-request below
export const size = { width: 1200, height: 630 };

/* Category tokens */
const CAT_COLOR = {
  islamic: '#4ECDC4',
  national: '#3B82F6',
  school: '#F59E0B',
  holidays: '#10B981',
  astronomy: '#8B5CF6',
  business: '#6B7280',
};
const CAT_LABEL = {
  islamic: 'إسلامي', national: 'وطني', school: 'مدرسي',
  holidays: 'إجازة', astronomy: 'فلكي', business: 'أعمال',
};
const CAT_EMOJI = {
  islamic: '🌙', national: '🏳️', school: '📚',
  holidays: '🏖️', astronomy: '🌍', business: '💼',
};

/* Urgency palette for days number */
function daysColor(days, accent) {
  if (days <= 3) return '#EF4444';
  if (days <= 14) return '#F59E0B';
  return accent;
}

export default async function Image({ params, searchParams }) {
  const { slug } = params;

  /* ── Square variant for Google Discover / Instagram ── */
  const isSquare = searchParams?.sq === '1';
  const W = 1200;
  const H = isSquare ? 1200 : 630;

  /* ── Unknown slug fallback ── */
  const raw = ALL_EVENTS.find(e => e.slug === slug);
  if (!raw) {
    return new ImageResponse(
      <div style={{
        width: '100%', height: '100%',
        background: '#0F1117',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ color: '#4ECDC4', fontSize: 48, fontWeight: 800 }}>وقت — عداد المواعيد</span>
      </div>,
      { width: W, height: H },
    );
  }

  /* ── Data ── */
  const event = enrichEvent(raw);
  const resolved = await resolveAllHijriEvents([event]);
  const nowMs = Date.now();
  const target = getNextEventDate(event, resolved, nowMs);
  const rem = getTimeRemaining(target, nowMs);
  const seo = resolveEventMeta(event, target);
  const dateStr = formatGregorianAr(target);
  const accent = CAT_COLOR[event.category] || '#4ECDC4';
  const emoji = CAT_EMOJI[event.category] || '📅';
  const daysFg = daysColor(rem.days, accent);

  /* ── Title — prefer short name; fall back to event.name ── */
  const titleText = seo.seoTitle.length > 52 ? event.name : seo.seoTitle;

  /* ══════════════════════════════════════════════════════════════════════
     WIDE (1200×630) — optimised for Twitter, Facebook, WhatsApp, Telegram
     ══════════════════════════════════════════════════════════════════════ */
  if (!isSquare) {
    return new ImageResponse(
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg,#0F1117 0%,#1A1F2E 55%,#0F1117 100%)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'system-ui,-apple-system,sans-serif',
        position: 'relative', overflow: 'hidden',
        direction: 'rtl',
      }}>
        {/* Right accent strip */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 8, background: accent }} />

        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '-80px', right: '80px',
          width: 360, height: 360, borderRadius: '50%',
          background: accent, opacity: 0.07,
        }} />

        {/* Content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 60px 44px 60px',
        }}>

          {/* Top: category chip + site brand */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.06)', borderRadius: 24,
              padding: '8px 18px', border: `1px solid ${accent}44`,
            }}>
              <span style={{ fontSize: 20 }}>{emoji}</span>
              <span style={{ color: accent, fontSize: 15, fontWeight: 600 }}>
                {CAT_LABEL[event.category] || 'مناسبة'}
              </span>
            </div>
            <span style={{ color: '#4A5568', fontSize: 14, fontWeight: 500 }}>وقت — عداد المواعيد</span>
          </div>

          {/* Middle: event name + date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              fontSize: 60, fontWeight: 800, color: '#F7FAFC',
              lineHeight: 1.1,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {titleText}
            </div>
            <div style={{ color: '#718096', fontSize: 21, fontWeight: 400 }}>{dateStr}</div>
          </div>

          {/* Bottom: days number + HMS detail (if close) + watermark */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>

            {/* Days hero */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{
                fontSize: 108, fontWeight: 900, color: daysFg,
                lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              }}>
                {rem.days}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 14 }}>
                <span style={{ fontSize: 26, color: '#A0AEC0', fontWeight: 600 }}>يوم</span>
                <span style={{ fontSize: 15, color: '#718096' }}>متبقي</span>
              </div>
            </div>

            {/* Hours + minutes when ≤ 3 days */}
            {rem.days <= 3 && (
              <div style={{ display: 'flex', gap: 16, paddingBottom: 10 }}>
                {[
                  { n: String(rem.hours).padStart(2, '0'), label: 'ساعة' },
                  { n: String(rem.minutes).padStart(2, '0'), label: 'دقيقة' },
                ].map(({ n, label }) => (
                  <div key={label} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    background: 'rgba(255,255,255,0.05)', borderRadius: 12,
                    padding: '10px 18px', border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <span style={{ fontSize: 34, fontWeight: 800, color: accent }}>{n}</span>
                    <span style={{ fontSize: 12, color: '#718096', marginTop: 4 }}>{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* URL watermark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
              <span style={{ fontSize: 14, color: '#A0AEC0' }}>waqt.app</span>
            </div>
          </div>
        </div>
      </div>,
      { width: W, height: H },
    );
  }

  /* ══════════════════════════════════════════════════════════════════════
     SQUARE (1200×1200) — Google Discover cards, Instagram link preview
     Centred layout with larger days number
     ══════════════════════════════════════════════════════════════════════ */
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg,#0F1117 0%,#1A1F2E 60%,#0F1117 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'system-ui,-apple-system,sans-serif',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      gap: 36, direction: 'rtl', padding: '64px 72px',
    }}>
      {/* Accent glow */}
      <div style={{
        position: 'absolute', top: 80, right: 80,
        width: 480, height: 480, borderRadius: '50%',
        background: accent, opacity: 0.07,
      }} />

      {/* Bottom strip */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, background: accent }} />

      {/* Category chip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'rgba(255,255,255,0.07)', borderRadius: 32,
        padding: '10px 24px', border: `1px solid ${accent}44`,
      }}>
        <span style={{ fontSize: 28 }}>{emoji}</span>
        <span style={{ color: accent, fontSize: 18, fontWeight: 600 }}>{CAT_LABEL[event.category] || 'مناسبة'}</span>
      </div>

      {/* Event name */}
      <div style={{
        fontSize: 68, fontWeight: 800, color: '#F7FAFC',
        lineHeight: 1.1, textAlign: 'center',
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>
        {titleText}
      </div>

      {/* Days */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 160, fontWeight: 900, color: daysFg, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {rem.days}
        </span>
        <span style={{ fontSize: 36, color: '#A0AEC0', fontWeight: 600 }}>يوم متبقي</span>
      </div>

      {/* Date */}
      <div style={{
        fontSize: 24, color: '#718096', fontWeight: 400,
        padding: '10px 28px', borderRadius: 999,
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
      }}>
        {dateStr}
      </div>

      {/* Watermark */}
      <span style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: '#4A5568', fontSize: 16, opacity: 0.5 }}>
        waqt.app
      </span>
    </div>,
    { width: W, height: H },
  );
}
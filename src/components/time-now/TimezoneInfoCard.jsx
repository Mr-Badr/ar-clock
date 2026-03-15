import React from 'react';

/**
 * TimezoneInfoCard — Rich SEO-focused timezone information section.
 * Shows: IANA name, UTC offset, DST status, current date in both calendars,
 * continent, UTC offset neighbours, and useful conversions.
 * Pure server component — no JS in the browser.
 *
 * Requires nowIso prop (ISO string from getCachedNowIso()) so that
 * new Date() is never called at the module level during prerender.
 */

/* ─── Helpers ─────────────────────────────────────────────────────── */
function getTimezoneMeta(tz, nowDate) {
  if (!tz || !nowDate) return {};
  try {
    const now = nowDate;

    const offsetStr = new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' })
      .formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? '';

    const tzNameAr = new Intl.DateTimeFormat('ar', { timeZone: tz, timeZoneName: 'long' })
      .formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? '';

    const tzNameEn = new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'long' })
      .formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? '';

    const jan = new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' })
      .formatToParts(new Date(now.getFullYear(), 0, 15)).find(p => p.type === 'timeZoneName')?.value ?? '';
    const jul = new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' })
      .formatToParts(new Date(now.getFullYear(), 6, 15)).find(p => p.type === 'timeZoneName')?.value ?? '';

    const hasDST = jan !== jul;
    const dstLabel = hasDST
      ? `نعم — صيف (${jul}) / شتاء (${jan})`
      : 'لا — التوقيت ثابت طوال العام';

    const dateAr = new Intl.DateTimeFormat('ar', {
      timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }).format(now);

    const dateEn = new Intl.DateTimeFormat('en', {
      timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }).format(now);

    let hijriDate = '—';
    try {
      hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        timeZone: tz, year: 'numeric', month: 'long', day: 'numeric',
      }).format(now);
    } catch {}

    const timeStr = new Intl.DateTimeFormat('ar', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    }).format(now);

    const [continent] = tz.split('/');
    const continentAr = {
      Africa: 'أفريقيا', America: 'الأمريكتان', Asia: 'آسيا',
      Atlantic: 'المحيط الأطلسي', Australia: 'أستراليا',
      Europe: 'أوروبا', Indian: 'المحيط الهندي', Pacific: 'المحيط الهادئ',
      Etc: 'ثابتة',
    }[continent] ?? continent;

    return { offsetStr, tzNameAr, tzNameEn, hasDST, dstLabel, dateAr, dateEn, hijriDate, timeStr, continentAr };
  } catch { return {}; }
}

/* ─── Info Row ─────────────────────────────────────────────────────── */
function InfoRow({ label, value, valueEn }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '0.2rem',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      background: 'var(--bg-surface-1)',
      border: '1px solid var(--border-subtle)',
    }}>
      <span style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {label}
      </span>
      <strong style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.3 }}>
        {value}
      </strong>
      {valueEn && (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', direction: 'ltr', textAlign: 'right' }}>
          {valueEn}
        </span>
      )}
    </div>
  );
}

/* ─── Component ────────────────────────────────────────────────────── */
export default function TimezoneInfoCard({ ianaTimezone, countryAr, cityAr, utcOffset, nowIso }) {
  const nowDate = nowIso ? new Date(nowIso) : null;
  const m = getTimezoneMeta(ianaTimezone, nowDate);

  return (
    <div
      className="max-w-4xl mx-auto"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--text-primary)' }}>
        🌐 معلومات المنطقة الزمنية
      </h2>

      {/* Primary grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.6rem',
      }}>
        <InfoRow label="الدولة"                  value={countryAr}           />
        {cityAr && <InfoRow label="العاصمة / المدينة" value={cityAr}             />}
        <InfoRow label="المنطقة الزمنية (IANA)"  value={ianaTimezone}        valueEn={ianaTimezone} />
        <InfoRow label="إزاحة GMT"               value={m.offsetStr ?? utcOffset} />
        <InfoRow label="اسم التوقيت"             value={m.tzNameAr}          valueEn={m.tzNameEn} />
        <InfoRow label="القارة / المنطقة"        value={m.continentAr}       />
        <InfoRow label="التوقيت الصيفي (DST)"   value={m.dstLabel}          />
      </div>

      {/* Dates section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '0.6rem',
      }}>
        <InfoRow label="التاريخ الميلادي الان"   value={m.dateAr}            valueEn={m.dateEn} />
        <InfoRow label="التاريخ الهجري الان"     value={m.hijriDate}         />
        <InfoRow label="الوقت الحالي"            value={m.timeStr}           />
      </div>

      {/* Descriptive prose for SEO */}
      <p style={{
        margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)',
        lineHeight: '1.8', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem',
      }}>
        تتبع {countryAr} المنطقة الزمنية <strong style={{ color: 'var(--text-secondary)' }}>{ianaTimezone}</strong>،{' '}
        وهي <strong style={{ color: 'var(--text-secondary)' }}>{m.offsetStr ?? utcOffset}</strong> من التوقيت العالمي المنسق (UTC/GMT).
        {' '}{m.hasDST
          ? `تطبّق ${countryAr} التوقيت الصيفي (Daylight Saving Time)، حيث تختلف الإزاحة بين الصيف والشتاء.`
          : `لا تطبّق ${countryAr} التوقيت الصيفي، لذا يبقى الوقت ثابتاً طوال العام.`
        }
        {' '}اسم التوقيت الرسمي: <strong style={{ color: 'var(--text-secondary)' }}>{m.tzNameEn}</strong>.
      </p>
    </div>
  );
}

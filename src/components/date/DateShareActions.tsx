'use client';
// src/components/date/DateShareActions.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REDESIGNED:
//   • Uses .btn .btn-surface CSS classes — hover works correctly
//   • Added permalink copy (links to permanent date page)
//   • Success states with check icon + CSS class swap
//   • .ics download preserved and improved
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';

interface Props {
  hijriFormatted: string;
  gregorianFormatted: string;
  hijriIso: string;
  gregorianIso: string;
  pageUrl: string;
}

export function DateShareActions({ hijriFormatted, gregorianFormatted, hijriIso, gregorianIso, pageUrl }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [icsOk, setIcsOk] = useState(false);

  async function copy(key: string, text: string) {
    try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
    setCopied(key);
    setTimeout(() => setCopied(null), 2200);
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${gregorianFormatted} — ${hijriFormatted}`, url: pageUrl });
        return;
      } catch { /* cancelled */ }
    }
    await copy('url', pageUrl);
  }

  function downloadIcs() {
    const iso = gregorianIso.replace(/-/g, '');
    const ts = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    const body = [
      'BEGIN:VCALENDAR', 'VERSION:2.0',
      'PRODID:-//Miqatona//HijriDate//AR',
      'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${ts}-${iso}@miqatona.com`,
      `DTSTAMP:${ts}`,
      `DTSTART;VALUE=DATE:${iso}`,
      `SUMMARY:${hijriFormatted}`,
      `DESCRIPTION:الهجري: ${hijriFormatted}\\nالميلادي: ${gregorianFormatted}`,
      `URL:${pageUrl}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
    a.download = `date-${gregorianIso}.ics`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 200);
    setIcsOk(true);
    setTimeout(() => setIcsOk(false), 2200);
  }

  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="خيارات المشاركة">

      {/* Copy full */}
      <button
        className={`btn btn-sm ${copied === 'full' ? 'btn-secondary' : 'btn-surface'}`}
        onClick={() => copy('full', `${gregorianFormatted} — ${hijriFormatted}`)}
        title="نسخ التاريخ الكامل"
      >
        {copied === 'full' ? '✓ تم النسخ' : '📋 نسخ التاريخ'}
      </button>

      {/* Copy Hijri */}
      <button
        className={`btn btn-sm ${copied === 'hijri' ? 'btn-secondary' : 'btn-surface'}`}
        onClick={() => copy('hijri', hijriFormatted)}
        title="نسخ التاريخ الهجري فقط"
      >
        {copied === 'hijri' ? '✓ تم' : '🌙 الهجري فقط'}
      </button>

      {/* Copy permalink */}
      <button
        className={`btn btn-sm ${copied === 'url' ? 'btn-secondary' : 'btn-surface'}`}
        onClick={() => copy('url', pageUrl)}
        title="نسخ رابط الصفحة الدائمة"
      >
        {copied === 'url' ? '✓ تم نسخ الرابط' : '🔗 نسخ الرابط'}
      </button>

      {/* Share */}
      <button className="btn btn-sm btn-surface" onClick={share} title="مشاركة الصفحة">
        📤 مشاركة
      </button>

      {/* ICS calendar */}
      <button
        className={`btn btn-sm ${icsOk ? 'btn-secondary' : 'btn-surface'}`}
        onClick={downloadIcs}
        title="إضافة إلى التقويم"
      >
        {icsOk ? '✓ تمت الإضافة' : '📅 إضافة للتقويم'}
      </button>

    </div>
  );
}

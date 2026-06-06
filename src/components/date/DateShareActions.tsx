'use client';

import { useState } from 'react';
import { CalendarPlus, Check, Clipboard, Link as LinkIcon, Share2 } from 'lucide-react';
import styles from './DateShareActions.module.css';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fullDateText = hijriIso
    ? `${gregorianFormatted}، ${hijriFormatted} (${hijriIso})`
    : `${gregorianFormatted}، ${hijriFormatted}`;

  async function copy(key: string, text: string) {
    setErrorMessage(null);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2200);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'تعذر نسخ النص من المتصفح.');
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: fullDateText, url: pageUrl });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : 'تعذرت مشاركة الصفحة من المتصفح.');
        return;
      }
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
      `DESCRIPTION:الهجري: ${hijriFormatted}${hijriIso ? ` (${hijriIso})` : ''}\\nالميلادي: ${gregorianFormatted}`,
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
    <div className={styles.group} role="group" aria-label="خيارات المشاركة">
      <button
        className={`btn btn-sm ${styles.button} ${copied === 'full' ? 'btn-secondary' : 'btn-surface'}`}
        onClick={() => copy('full', fullDateText)}
        title="نسخ التاريخ الكامل"
      >
        {copied === 'full' ? <Check size={15} /> : <Clipboard size={15} />}
        {copied === 'full' ? 'تم النسخ' : 'نسخ التاريخ'}
      </button>

      <button
        className={`btn btn-sm ${styles.button} ${copied === 'hijri' ? 'btn-secondary' : 'btn-surface'}`}
        onClick={() => copy('hijri', hijriFormatted)}
        title="نسخ التاريخ الهجري فقط"
      >
        {copied === 'hijri' ? <Check size={15} /> : <Clipboard size={15} />}
        {copied === 'hijri' ? 'تم النسخ' : 'الهجري فقط'}
      </button>

      <button
        className={`btn btn-sm ${styles.button} ${copied === 'url' ? 'btn-secondary' : 'btn-surface'}`}
        onClick={() => copy('url', pageUrl)}
        title="نسخ رابط الصفحة الدائمة"
      >
        {copied === 'url' ? <Check size={15} /> : <LinkIcon size={15} />}
        {copied === 'url' ? 'تم نسخ الرابط' : 'نسخ الرابط'}
      </button>

      <button className={`btn btn-sm btn-surface ${styles.button}`} onClick={share} title="مشاركة الصفحة">
        <Share2 size={15} />
        مشاركة
      </button>

      <button
        className={`btn btn-sm ${styles.button} ${icsOk ? 'btn-secondary' : 'btn-surface'}`}
        onClick={downloadIcs}
        title="إضافة إلى التقويم"
      >
        {icsOk ? <Check size={15} /> : <CalendarPlus size={15} />}
        {icsOk ? 'تمت الإضافة' : 'إضافة للتقويم'}
      </button>

      {errorMessage && (
        <p className={`${styles.status} ${styles.statusError}`} role="status">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

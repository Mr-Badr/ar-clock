"use client";

import { useEffect, useState } from 'react';
import { Backpack, CalendarPlus, Flag, Moon, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { NumberTicker } from '@/components/ui/number-ticker';
import { computeSchoolCalendarStatus, SCHOOL_CALENDAR_EVENTS } from '@/lib/calculators/saudi-school-calendar';

function formatIcsDate(iso) {
  return iso.replace(/-/g, '');
}

function buildIcsFile() {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//miqatona.com//Saudi School Calendar 1448//AR',
    'CALSCALE:GREGORIAN',
  ];
  for (const event of SCHOOL_CALENDAR_EVENTS) {
    const endDate = new Date(event.endIso);
    endDate.setDate(endDate.getDate() + 1); // ICS DTEND is exclusive
    const endIso = endDate.toISOString().split('T')[0];
    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.slug}-1448@miqatona.com`,
      `DTSTART;VALUE=DATE:${formatIcsDate(event.startIso)}`,
      `DTEND;VALUE=DATE:${formatIcsDate(endIso)}`,
      `SUMMARY:${event.type}${event.estimated ? ' (تقديري)' : ''}`,
      `DESCRIPTION:${event.rule}`,
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function downloadIcs() {
  const content = buildIcsFile();
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'التقويم-الدراسي-السعودي-1448.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success('تم تحميل ملف التقويم — أضفه لتطبيق التقويم في جوالك');
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function SaudiSchoolCalendarTool() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setStatus(computeSchoolCalendarStatus(new Date()));
  }, []);

  const shareText = status?.nextEvent
    ? `باقي ${status.daysToNext} يوم على ${status.nextEvent.type} — التقويم الدراسي السعودي 1448`
    : '';

  return (
    <div aria-label="التقويم الدراسي السعودي 1448">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Flag size={14} weight="bold" /> السعودية 1448هـ <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      {status ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
            <AnimatedCircularProgressBar
              className="tool-v2-progress-ring"
              value={status.yearProgressPercent}
              gaugePrimaryColor="var(--green)"
              gaugeSecondaryColor="var(--green-subtle)"
            />
            <div style={{ textAlign: 'center' }}>
              <span className="tool-v2-result-label">من العام الدراسي مكتمل</span>
            </div>
          </div>

          {status.nextEvent ? (
            <div className="tool-v2-breakdown-list">
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label"><Backpack size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> القادم: {status.nextEvent.type}</span>
                <span className="tool-v2-breakdown-value">
                  <NumberTicker value={status.daysToNext} className="tool-v2-ticker tool-v2-ticker--accent" /> يوم
                </span>
              </div>
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label">التاريخ</span>
                <span className="tool-v2-breakdown-value">{status.nextEvent.dateLabel}</span>
              </div>
            </div>
          ) : (
            <div className="tool-v2-note-strip">
              <Moon size={15} weight="fill" />
              <span>انتهى العام الدراسي 1448 — بانتظار جدول العام القادم.</span>
            </div>
          )}

          <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-4)' }}>
            <Backpack size={14} weight="bold" />
            <span>كل مواعيد العام الدراسي</span>
          </div>
          <div className="tool-v2-timeline">
            {SCHOOL_CALENDAR_EVENTS.map((event) => (
              <div key={event.slug} className={`tool-v2-timeline-item${status.nextEvent?.slug === event.slug ? ' is-current' : ''}`}>
                <span className="tool-v2-timeline-dot" aria-hidden="true" />
                <div>
                  <div className="tool-v2-timeline-title">{event.type}</div>
                  <div className="tool-v2-timeline-desc">{event.dateLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="tool-v2-action-row">
        <button type="button" className="tool-v2-action-btn" onClick={downloadIcs}>
          <CalendarPlus size={18} weight="bold" /> إضافة للتقويم (.ics)
        </button>
        <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('التقويم الدراسي السعودي 1448', shareText)} disabled={!status?.nextEvent}>
          <ShareNetwork size={18} weight="bold" /> مشاركة
        </button>
      </div>
    </div>
  );
}

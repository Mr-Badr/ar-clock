"use client";

import { useEffect, useMemo, useState } from 'react';
import { Briefcase, CalendarBlank, Info, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { calculateWorkingDays, formatNumber, WORKING_DAYS_COUNTRIES } from '@/lib/calculators/engine';

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function addDaysIso(iso, days) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function WorkingDaysTool() {
  const [country, setCountry] = useState('sa');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const start = todayIso();
    setStartDate(start);
    setEndDate(addDaysIso(start, 30));
  }, []);

  const result = useMemo(() => calculateWorkingDays({ startDate, endDate, country }), [startDate, endDate, country]);

  const shareText = result.isValid
    ? `حاسبة أيام العمل بين تاريخين\nإجمالي الأيام: ${formatNumber(result.totalDays)}\nأيام العمل الفعلية: ${formatNumber(result.workingDays)}\nأيام العطلة الأسبوعية: ${formatNumber(result.weekendDays)}`
    : '';

  return (
    <div aria-label="حاسبة أيام العمل بين تاريخين">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code={country} /> {WORKING_DAYS_COUNTRIES[country]?.label} <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>دولة العمل</label>
        <div className="guide-v2-checker-options" role="group" aria-label="اختر دولة العمل">
          {Object.entries(WORKING_DAYS_COUNTRIES).map(([code, c]) => (
            <button key={code} type="button" className={`guide-v2-checker-chip${country === code ? ' is-active' : ''}`} aria-pressed={country === code} onClick={() => setCountry(code)}>
              <CountryFlag code={code} /> {c.label}
            </button>
          ))}
        </div>
        <p className="tool-v2-field-hint"><Info size={12} weight="bold" style={{ verticalAlign: '-1px' }} /> عطلة نهاية الأسبوع: <strong>{WORKING_DAYS_COUNTRIES[country]?.weekendLabel}</strong></p>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="wd-start">من تاريخ</label>
          <input id="wd-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="wd-end">إلى تاريخ</label>
          <input id="wd-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>
      <p className="tool-v2-field-hint">يشمل الحساب يومي البداية والنهاية معاً.</p>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">أيام العمل الفعلية</span>
            <div className="tool-v2-result-value">{formatNumber(result.workingDays)}</div>
            <div className="tool-v2-result-meta">من أصل {formatNumber(result.totalDays)} يوماً · {formatNumber(result.weekendDays)} يوم عطلة أسبوعية</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><CalendarBlank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> إجمالي الأيام (شامل البداية والنهاية)</span><span className="tool-v2-breakdown-value">{formatNumber(result.totalDays)} يوم</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><Briefcase size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> أيام العمل الفعلية</span><span className="tool-v2-breakdown-value">{formatNumber(result.workingDays)} يوم</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><CalendarBlank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> أيام العطلة الأسبوعية</span><span className="tool-v2-breakdown-value">{formatNumber(result.weekendDays)} يوم</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">عدد الأسابيع الكاملة</span><span className="tool-v2-breakdown-value">{formatNumber(result.fullWeeks)} أسبوع{result.remainderDays > 0 ? ` + ${result.remainderDays} يوم` : ''}</span></div>
          </div>

          {result.reversed ? (
            <div className="tool-v2-note-strip">
              <Info size={15} weight="fill" />
              <span>لاحظنا أن تاريخ البداية بعد تاريخ النهاية، فعكسنا الترتيب تلقائياً للحساب.</span>
            </div>
          ) : null}

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>هذه الحاسبة تحسب أيام العمل باستثناء عطلة نهاية الأسبوع الرسمية فقط. الإجازات الرسمية والمناسبات الوطنية غير مستثناة تلقائياً — راجع <a href="/holidays" style={{ textDecoration: 'underline' }}>صفحة المناسبات</a> للتحقق من أي إجازة رسمية تقع ضمن الفترة المحددة.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة أيام العمل بين تاريخين', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <CalendarBlank size={28} weight="duotone" />
          <p>اختر تاريخ البداية والنهاية لحساب أيام العمل الفعلية.</p>
        </div>
      )}
    </div>
  );
}

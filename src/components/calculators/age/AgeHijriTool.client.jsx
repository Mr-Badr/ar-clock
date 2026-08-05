"use client";

import { useEffect, useMemo, useState } from 'react';
import { CalendarBlank, Info, MoonStars, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';
import BirthInputTool, { resolveBirthInput } from '@/components/calculators/age/BirthInputTool.client';
import { buildAgeSnapshot, formatAgeNumber, getTodayIso } from '@/lib/calculators/age';
import { HIJRI_MONTHS_INFO } from '@/lib/calculators/age-data';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function AgeHijriTool() {
  const [calendar, setCalendar] = useState('gregorian');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [birthHijri, setBirthHijri] = useState({ day: '12', month: '9', year: '1415' });
  const [todayIso, setTodayIso] = useState(null);

  useEffect(() => { setTodayIso(getTodayIso()); }, []);

  const normalized = useMemo(() => resolveBirthInput(calendar, birthIso, birthHijri), [calendar, birthIso, birthHijri]);
  const result = useMemo(() => {
    if (!normalized.isValid || !todayIso) return null;
    return buildAgeSnapshot({ birthDateIso: normalized.iso, targetDateIso: todayIso });
  }, [normalized, todayIso]);

  const highlightedMonth = result?.isValid ? result.hijri.birth?.monthNameAr : '';
  const shareText = result?.isValid
    ? `عمري بالميلادي ${result.ageLabel} — وبالهجري تقريباً ${formatAgeNumber(result.hijri.yearsApprox)} سنة`
    : '';

  return (
    <div aria-label="حاسبة العمر الهجري">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><MoonStars size={14} weight="bold" /> هجري وميلادي معاً <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <BirthInputTool calendar={calendar} onCalendarChange={setCalendar} gregorianValue={birthIso} onGregorianChange={setBirthIso} hijriValue={birthHijri} onHijriChange={setBirthHijri} />

      {result?.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">بالميلادي</span><span className="tool-v2-breakdown-value">{result.ageLabel}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">بالهجري تقريباً</span><span className="tool-v2-breakdown-value">{formatAgeNumber(result.hijri.yearsApprox)} سنة</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الفرق التراكمي</span><span className="tool-v2-breakdown-value">{formatAgeNumber(result.hijri.yearsApprox - result.years)} سنة</span></div>
          </div>

          <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-4)' }}>
            <CalendarBlank size={14} weight="bold" />
            <span>عرض مزدوج للتاريخ</span>
          </div>
          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">تاريخ الميلاد الميلادي</span><span className="tool-v2-breakdown-value">{result.birthDateLabel}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">تاريخ الميلاد الهجري</span><span className="tool-v2-breakdown-value">{result.hijri.birth?.formatted?.ar || 'غير متاح'}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الشهر الهجري</span><span className="tool-v2-breakdown-value">{result.hijri.birth?.monthNameAr || '—'}</span></div>
          </div>

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>السنة الهجرية أقصر من الميلادية بنحو 10-11 يوماً، لذلك يظهر عمرك الهجري أكبر تدريجياً كلما تقدمت في العمر.</span>
          </div>

          <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-4)' }}>
            <MoonStars size={14} weight="bold" />
            <span>الشهور الهجرية</span>
          </div>
          <div className="tool-v2-table-wrap">
            <table className="tool-v2-table">
              <tbody>
                {HIJRI_MONTHS_INFO.map((item) => (
                  <tr key={item.month} style={highlightedMonth === item.month ? { fontWeight: 700, color: 'var(--green-text)' } : undefined}>
                    <td>{item.month}{highlightedMonth === item.month ? ' ← شهر ميلادك' : ''}</td>
                    <td>{item.kind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة العمر الهجري', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <MoonStars size={28} weight="duotone" />
          <p>أدخل تاريخ ميلادك لمعرفة عمرك بالهجري والميلادي معاً.</p>
        </div>
      )}
    </div>
  );
}

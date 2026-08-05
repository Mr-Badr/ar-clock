"use client";

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Confetti, Info, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';
import BirthInputTool, { resolveBirthInput } from '@/components/calculators/age/BirthInputTool.client';
import { buildBirthdayProfile, formatAgeNumber, getTodayIso } from '@/lib/calculators/age';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function BirthdayDetailsTool() {
  const [calendar, setCalendar] = useState('gregorian');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [birthHijri, setBirthHijri] = useState({ day: '12', month: '9', year: '1415' });
  const [todayIso, setTodayIso] = useState(null);

  useEffect(() => { setTodayIso(getTodayIso()); }, []);

  const normalized = useMemo(() => resolveBirthInput(calendar, birthIso, birthHijri), [birthIso, birthHijri, calendar]);
  const result = useMemo(() => {
    if (!normalized.isValid || !todayIso) return null;
    return buildBirthdayProfile({ birthDateIso: normalized.iso, targetDateIso: todayIso });
  }, [normalized, todayIso]);

  const shareText = result?.isValid
    ? `وُلدت يوم ${result.birthWeekday}، ${result.birthDateLabel} — جيل ${result.personal.generation.label}`
    : '';

  return (
    <div aria-label="بطاقة يوم الميلاد">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Confetti size={14} weight="bold" /> بلا أبراج ولا تنجيم <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <BirthInputTool calendar={calendar} onCalendarChange={setCalendar} gregorianValue={birthIso} onGregorianChange={setBirthIso} hijriValue={birthHijri} onHijriChange={setBirthHijri} />

      {result?.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">وُلدت يوم</span>
            <div className="tool-v2-result-value">{result.birthWeekday}</div>
            <div className="tool-v2-result-meta">{result.birthDateLabel} · {result.hijri?.birth?.formatted?.ar || '—'} · {result.personal.season}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">يوم السنة</span><span className="tool-v2-breakdown-value">{formatAgeNumber(result.personal.dayOfYear, { maximumFractionDigits: 0 })}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">جيلك</span><span className="tool-v2-breakdown-value">{result.personal.generation.label}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">نصف عيد الميلاد القادم</span><span className="tool-v2-breakdown-value">{result.personal.halfBirthdayLabel} ({result.personal.halfBirthdayWeekday})</span></div>
          </div>

          <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-4)' }}>
            <CheckCircle size={14} weight="bold" />
            <span>حقائق سريعة عن تاريخك</span>
          </div>
          <div className="tool-v2-addon-list">
            <div className="tool-v2-addon-row"><CheckCircle size={14} weight="fill" style={{ color: 'var(--green-text)' }} /> <span>فصل الميلاد: {result.personal.season}</span></div>
            <div className="tool-v2-addon-row"><CheckCircle size={14} weight="fill" style={{ color: 'var(--green-text)' }} /> <span>{result.isWeekend ? 'وُلدت في عطلة نهاية الأسبوع.' : 'يوم الميلاد كان ضمن أيام الأسبوع المعتادة.'}</span></div>
            <div className="tool-v2-addon-row"><CheckCircle size={14} weight="fill" style={{ color: 'var(--green-text)' }} /> <span>{result.bornInLeapYear ? 'سنة الميلاد كانت سنة كبيسة.' : 'سنة الميلاد لم تكن كبيسة.'}</span></div>
          </div>

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>هذه الصفحة عملية فقط ولا تعتمد على الأبراج أو التنجيم — كل رقم هنا محسوب من التقويم مباشرة.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('بطاقة يوم الميلاد', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Confetti size={28} weight="duotone" />
          <p>أدخل تاريخ ميلادك لمعرفة يوم ميلادك وجيلك وحقائق أخرى عن تاريخك.</p>
        </div>
      )}
    </div>
  );
}

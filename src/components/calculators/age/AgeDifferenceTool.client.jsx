"use client";

import { useEffect, useMemo, useState } from 'react';
import { ArrowsLeftRight, Info, ShareNetwork, UsersThree } from '@phosphor-icons/react';
import { toast } from 'sonner';
import BirthInputTool, { resolveBirthInput } from '@/components/calculators/age/BirthInputTool.client';
import { buildAgeDifference, formatAgeNumber, getTodayIso } from '@/lib/calculators/age';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function AgeDifferenceTool() {
  const [firstName, setFirstName] = useState('أحمد');
  const [secondName, setSecondName] = useState('سارة');
  const [firstCalendar, setFirstCalendar] = useState('gregorian');
  const [secondCalendar, setSecondCalendar] = useState('gregorian');
  const [firstBirthIso, setFirstBirthIso] = useState('1985-04-08');
  const [secondBirthIso, setSecondBirthIso] = useState('1990-06-16');
  const [firstHijri, setFirstHijri] = useState({ day: '', month: '', year: '' });
  const [secondHijri, setSecondHijri] = useState({ day: '', month: '', year: '' });
  const [todayIso, setTodayIso] = useState(null);

  useEffect(() => { setTodayIso(getTodayIso()); }, []);

  const firstInput = useMemo(() => resolveBirthInput(firstCalendar, firstBirthIso, firstHijri), [firstBirthIso, firstCalendar, firstHijri]);
  const secondInput = useMemo(() => resolveBirthInput(secondCalendar, secondBirthIso, secondHijri), [secondBirthIso, secondCalendar, secondHijri]);

  const result = useMemo(() => {
    if (!todayIso || !firstInput.isValid || !secondInput.isValid) return null;
    return buildAgeDifference({
      firstBirthDateIso: firstInput.iso,
      secondBirthDateIso: secondInput.iso,
      targetDateIso: todayIso,
      firstName: firstName || 'الشخص الأول',
      secondName: secondName || 'الشخص الثاني',
    });
  }, [firstInput, secondInput, firstName, secondName, todayIso]);

  const shareText = result?.isValid
    ? `فرق العمر بين ${firstName} و${secondName}: ${result.gapLabel} — ${result.older.name} أكبر سناً`
    : '';

  return (
    <div aria-label="حاسبة فرق العمر بين شخصين">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><UsersThree size={14} weight="bold" /> بالهجري والميلادي <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="age-diff-first-name">اسم الشخص الأول</label>
          <input id="age-diff-first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="age-diff-second-name">اسم الشخص الثاني</label>
          <input id="age-diff-second-name" value={secondName} onChange={(e) => setSecondName(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-mini-block-head"><span>{firstName || 'الشخص الأول'}</span></div>
      <BirthInputTool calendar={firstCalendar} onCalendarChange={setFirstCalendar} gregorianValue={firstBirthIso} onGregorianChange={setFirstBirthIso} hijriValue={firstHijri} onHijriChange={setFirstHijri} />

      <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-3)' }}><span>{secondName || 'الشخص الثاني'}</span></div>
      <BirthInputTool calendar={secondCalendar} onCalendarChange={setSecondCalendar} gregorianValue={secondBirthIso} onGregorianChange={setSecondBirthIso} hijriValue={secondHijri} onHijriChange={setSecondHijri} />

      {result?.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">فرق العمر</span>
            <div className="tool-v2-result-value">{result.gapLabel}</div>
            <div className="tool-v2-result-meta"><ArrowsLeftRight size={13} weight="bold" style={{ verticalAlign: '-2px' }} /> {result.older.name} أكبر سناً من {result.younger.name}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">{firstName}</span><span className="tool-v2-breakdown-value">{result.firstAge.ageLabel} — {result.firstAge.birthDateLabel}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">{secondName}</span><span className="tool-v2-breakdown-value">{result.secondAge.ageLabel} — {result.secondAge.birthDateLabel}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">إجمالي الفارق بالأيام</span><span className="tool-v2-breakdown-value">{formatAgeNumber(result.totalDays, { maximumFractionDigits: 0 })} يوم</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الجيل</span><span className="tool-v2-breakdown-value">{result.sharedGenerationLabel}</span></div>
          </div>

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>{result.sameGeneration ? `${firstName} و${secondName} ينتميان لنفس الجيل.` : `${firstName} و${secondName} ينتميان لجيلين مختلفين.`}</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة فرق العمر', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <UsersThree size={28} weight="duotone" />
          <p>أدخل تاريخي ميلاد صحيحين لحساب الفارق بينهما.</p>
        </div>
      )}
    </div>
  );
}

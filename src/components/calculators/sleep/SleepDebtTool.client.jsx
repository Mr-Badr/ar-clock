"use client";

import { useMemo, useState } from 'react';
import { CalendarBlank, MoonStars, ShareNetwork, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { calculateSleepDebt } from '@/lib/sleep/calculator';

const DAY_LABELS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function SleepDebtTool() {
  const [age, setAge] = useState('25');
  const [dailyHours, setDailyHours] = useState(['6.5', '6.5', '6.5', '6.5', '6.5', '8', '8']);

  function updateDay(index, value) {
    setDailyHours((current) => current.map((item, i) => (i === index ? value : item)));
  }

  const result = useMemo(() => calculateSleepDebt({ age, actualByDay: dailyHours }), [age, dailyHours]);

  const shareText = result.isValid
    ? `دين النوم: ${result.debtHours} ساعة — ${result.status}`
    : '';

  return (
    <div aria-label="حاسبة دين النوم">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CalendarBlank size={14} weight="bold" /> على مدار الأسبوع كامل <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="debt-age">العمر</label>
        <input id="debt-age" type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>ساعات نومك خلال الأسبوع</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
          {DAY_LABELS.map((label, index) => (
            <div key={label} className="tool-v2-field" style={{ marginBottom: 0 }}>
              <label htmlFor={`debt-day-${index}`} style={{ fontSize: '0.8rem' }}>{label}</label>
              <input id={`debt-day-${index}`} type="number" inputMode="decimal" step="0.5" value={dailyHours[index]} onChange={(e) => updateDay(index, e.target.value)} />
            </div>
          ))}
        </div>
      </div>
      <p className="tool-v2-field-hint">التعب أحياناً لا يأتي من ليلة واحدة، بل من تراكم ساعات ناقصة على عدة أيام.</p>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">دين النوم</span>
            <div className="tool-v2-result-value">{result.debtHours} ساعة</div>
            <div className="tool-v2-result-meta">{result.status}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الاحتياج الأسبوعي</span><span className="tool-v2-breakdown-value">{result.weeklyNeed} ساعة</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">النوم الفعلي الأسبوعي</span><span className="tool-v2-breakdown-value">{result.weeklyActual} ساعة</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">المتوسط اليومي</span><span className="tool-v2-breakdown-value">{result.averageSleep} ساعة</span></div>
          </div>

          <div className="tool-v2-note-strip">
            {result.debtHours > 0 ? <Warning size={15} weight="fill" /> : <MoonStars size={15} weight="fill" />}
            <span>{result.recoveryPlan}</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة دين النوم', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <MoonStars size={28} weight="duotone" />
          <p>أدخل ساعات نومك خلال الأسبوع لمعرفة دين النوم المتراكم.</p>
        </div>
      )}
    </div>
  );
}

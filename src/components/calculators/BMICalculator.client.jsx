"use client";

import { useMemo, useState } from 'react';
import { Heartbeat, Lightning, Scales, ShareNetwork, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';

import { calculateBMI, formatNumber } from '@/lib/calculators/engine';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'خامل', desc: 'لا رياضة تقريباً' },
  { value: 'light', label: 'خفيف', desc: '1–3 أيام في الأسبوع' },
  { value: 'moderate', label: 'متوسط', desc: '3–5 أيام في الأسبوع' },
  { value: 'active', label: 'نشيط', desc: '6–7 أيام في الأسبوع' },
  { value: 'veryActive', label: 'رياضي', desc: 'تمرين مرتين يومياً' },
];

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function BMICalculator() {
  const [weight, setWeight] = useState('75');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');

  const result = useMemo(
    () => calculateBMI({ weightKg: weight, heightCm: height, age, gender, activityLevel }),
    [weight, height, age, gender, activityLevel],
  );

  const shareText = result.isValid
    ? `مؤشر كتلة جسمي BMI: ${result.bmi}\nالتصنيف: ${result.categoryAr}\nالوزن المثالي: ${result.idealMin}–${result.idealMax} كجم`
    : '';

  const bmiPointerLeft = result.isValid ? `${result.bmiPercent}%` : '0%';

  return (
    <div aria-label="حاسبة مؤشر كتلة الجسم">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Scales size={14} weight="bold" /> مؤشر الجسم <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>الجنس</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="الجنس">
          <button type="button" className={`tool-v2-chip${gender === 'male' ? ' is-active' : ''}`} onClick={() => setGender('male')}>ذكر</button>
          <button type="button" className={`tool-v2-chip${gender === 'female' ? ' is-active' : ''}`} onClick={() => setGender('female')}>أنثى</button>
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="bmi-weight">الوزن (كجم)</label>
          <input id="bmi-weight" type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="75" />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="bmi-height">الطول (سم)</label>
          <input id="bmi-height" type="number" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" />
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="bmi-age">
          العمر (للسعرات)
          <span className="tool-v2-option-hint">اختياري — يُستخدم فقط لحساب السعرات اليومية</span>
        </label>
        <input id="bmi-age" type="number" inputMode="decimal" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" />
      </div>

      <div className="tool-v2-field">
        <label>مستوى النشاط</label>
        <div className="tool-v2-choice-list">
          {ACTIVITY_LEVELS.map((level) => {
            const active = activityLevel === level.value;
            return (
              <label key={level.value} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`bmi-activity-${level.value}`}>
                <input
                  type="radio"
                  id={`bmi-activity-${level.value}`}
                  name="bmi-activity"
                  checked={active}
                  onChange={() => setActivityLevel(level.value)}
                />
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{level.label}</span>
                  <span className="tool-v2-choice-desc">{level.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">مؤشر كتلة الجسم (BMI)</span>
            <div className="tool-v2-result-value">{result.bmi}</div>
            <div className="tool-v2-result-meta">{result.categoryAr}</div>
          </div>

          <div className="tool-v2-hbar-list" style={{ margin: 'var(--space-3) 0' }}>
            <div className="tool-v2-hbar-row">
              <span className="tool-v2-hbar-label">نقص</span>
              <div className="tool-v2-hbar-track">
                <div className="tool-v2-hbar-fill" style={{ width: bmiPointerLeft, background: 'var(--blue)' }} />
              </div>
              <span className="tool-v2-hbar-label">سمنة</span>
            </div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label"><Scales size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> الوزن المثالي لطولك</span>
              <span className="tool-v2-breakdown-value">{result.idealMin}–{result.idealMax} كجم</span>
            </div>
            {result.weightDiff !== 0 && (
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label"><Warning size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> {result.weightDiff > 0 ? 'يجب إنقاص' : 'يُنصح بزيادة'}</span>
                <span className="tool-v2-breakdown-value">{Math.abs(result.weightDiff)} كجم</span>
              </div>
            )}
            {result.tdee && (
              <>
                <div className="tool-v2-breakdown-row">
                  <span className="tool-v2-breakdown-label"><Heartbeat size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> معدل الأيض الأساسي (BMR)</span>
                  <span className="tool-v2-breakdown-value">{formatNumber(result.bmr)} كالوري</span>
                </div>
                <div className="tool-v2-breakdown-row">
                  <span className="tool-v2-breakdown-label"><Lightning size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> السعرات اليومية للمحافظة</span>
                  <span className="tool-v2-breakdown-value">{formatNumber(result.tdee)} كالوري</span>
                </div>
              </>
            )}
          </div>

          <div className="tool-v2-note-strip">
            <Warning size={15} weight="fill" />
            <span>BMI مؤشر استرشادي — يُنصح باستشارة متخصص تغذية للتقييم الكامل.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة BMI', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Scales size={28} weight="duotone" />
          <p>أدخل وزنك وطولك لحساب مؤشر كتلة الجسم.</p>
        </div>
      )}
    </div>
  );
}

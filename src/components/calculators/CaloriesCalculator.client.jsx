"use client";

import { useMemo, useState } from 'react';
import { Fire, ShareNetwork, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';

import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';
import { ACTIVITY_LEVELS, GOALS, calculateCaloriesAndTDEE } from '@/lib/calculators/calories';

function fmt(n) { return Math.round(n).toLocaleString('ar-SA-u-nu-latn'); }
function fmtDec(n, d = 1) { return n.toLocaleString('ar-SA-u-nu-latn', { minimumFractionDigits: d, maximumFractionDigits: d }); }

const GENDER_OPTIONS = [
  { value: 'male', label: 'ذكر' },
  { value: 'female', label: 'أنثى' },
];

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function CaloriesCalculator() {
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('75');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('30');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');

  const result = useMemo(
    () => calculateCaloriesAndTDEE({ gender, weight, height, age, activityLevel, goal }),
    [gender, weight, height, age, activityLevel, goal],
  );

  const shareText = result.isValid
    ? `حاسبة السعرات الحرارية:\nالمعدل الأيضي: ${fmt(result.bmr)} kcal\nاحتياجك اليومي (TDEE): ${fmt(result.tdee)} kcal\nهدفك: ${fmt(result.targetCalories)} kcal/يوم\nBMI: ${fmtDec(result.bmi)} — ${result.bmiCategory.label}`
    : '';

  return (
    <div aria-label="حاسبة السعرات الحرارية والطاقة اليومية">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Fire size={14} weight="bold" /> السعرات <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>الجنس</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="الجنس">
          {GENDER_OPTIONS.map((g) => (
            <button key={g.value} type="button" className={`tool-v2-chip${gender === g.value ? ' is-active' : ''}`} onClick={() => setGender(g.value)}>{g.label}</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="cal-weight">الوزن (كغ)</label>
          <input id="cal-weight" type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="75" />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="cal-height">الطول (سم)</label>
          <input id="cal-height" type="number" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" />
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="cal-age">العمر</label>
        <input id="cal-age" type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="cal-activity">مستوى النشاط</label>
        <PremiumSelect
          id="cal-activity"
          value={activityLevel}
          onChange={setActivityLevel}
          options={ACTIVITY_LEVELS.map((l) => ({ value: l.value, label: l.label }))}
        />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="cal-goal">هدفك</label>
        <PremiumSelect
          id="cal-goal"
          value={goal}
          onChange={setGoal}
          options={GOALS.map((g) => ({ value: g.value, label: g.label }))}
        />
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">احتياجك اليومي لتحقيق الهدف</span>
            <div className="tool-v2-result-value">{fmt(result.targetCalories)} kcal</div>
            <div className="tool-v2-result-meta">{result.goalLabel}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">معدل الأيض الأساسي (BMR)</span>
              <span className="tool-v2-breakdown-value">{fmt(result.bmr)} kcal</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">الإنفاق اليومي الكلي (TDEE)</span>
              <span className="tool-v2-breakdown-value">{fmt(result.tdee)} kcal</span>
            </div>
            {result.goalDelta !== 0 && (
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label">التعديل للهدف</span>
                <span className="tool-v2-breakdown-value" style={{ color: result.goalDelta < 0 ? 'var(--green-text)' : 'var(--blue-text)' }}>
                  {result.goalDelta > 0 ? '+' : ''}{result.goalDelta} kcal
                </span>
              </div>
            )}
          </div>

          <div className="tool-v2-mini-block-head">
            <Fire size={14} weight="bold" />
            <span>توزيع المغذيات الكبرى (مقترح)</span>
          </div>
          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">بروتين (30%)</span><span className="tool-v2-breakdown-value">{fmt(result.protein)} غرام/يوم</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">كربوهيدرات (40%)</span><span className="tool-v2-breakdown-value">{fmt(result.carbs)} غرام/يوم</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">دهون (30%)</span><span className="tool-v2-breakdown-value">{fmt(result.fat)} غرام/يوم</span></div>
          </div>

          <div className="tool-v2-mini-block-head">
            <span>مؤشر كتلة الجسم (BMI)</span>
          </div>
          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">BMI</span>
              <span className="tool-v2-breakdown-value" style={{ color: result.bmiCategory.color }}>{fmtDec(result.bmi)} — {result.bmiCategory.label}</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">الوزن المثالي (تقديري)</span>
              <span className="tool-v2-breakdown-value">{fmtDec(result.idealWeightMin)}–{fmtDec(result.idealWeightMax)} كغ</span>
            </div>
          </div>

          <div className="tool-v2-note-strip">
            <Warning size={15} weight="fill" />
            <span>هذه تقديرات عامة — استشر متخصص تغذية لخطة دقيقة تناسب حالتك الصحية.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة السعرات الحرارية اليومية', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Fire size={28} weight="duotone" />
          <p>أدخل بياناتك لحساب احتياجك اليومي من السعرات الحرارية.</p>
        </div>
      )}
    </div>
  );
}

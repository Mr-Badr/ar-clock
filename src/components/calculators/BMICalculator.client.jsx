"use client";

import { useMemo, useState } from 'react';
import { Heartbeat, Lightning, Scales, Warning } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import {
  calculateBMI,
  formatNumber,
} from '@/lib/calculators/engine';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'خامل', desc: 'لا رياضة تقريباً' },
  { value: 'light', label: 'خفيف', desc: '1–3 أيام/أسبوع' },
  { value: 'moderate', label: 'متوسط', desc: '3–5 أيام/أسبوع' },
  { value: 'active', label: 'نشيط', desc: '6–7 أيام/أسبوع' },
  { value: 'veryActive', label: 'رياضي', desc: 'مرتين يومياً' },
];

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
    <div className="calc-app bmi-tool" aria-label="حاسبة مؤشر كتلة الجسم">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card">
            <div className="calc-esb-form-body">

              {/* Gender */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>الجنس</Label>
                </div>
                <div className="bmi-gender-row">
                  <button
                    type="button"
                    className={`bmi-gender-btn${gender === 'male' ? ' is-active' : ''}`}
                    onClick={() => setGender('male')}
                  >
                    ذكر
                  </button>
                  <button
                    type="button"
                    className={`bmi-gender-btn${gender === 'female' ? ' is-active' : ''}`}
                    onClick={() => setGender('female')}
                  >
                    أنثى
                  </button>
                </div>
              </div>

              {/* Weight & Height */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>الوزن والطول</Label>
                </div>
                <div className="bmi-measurement-row">
                  <div>
                    <Label htmlFor="bmi-weight" className="calc-hint">الوزن (كجم)</Label>
                    <div className="calc-esb-money-row">
                      <Input
                        id="bmi-weight"
                        inputMode="decimal"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="75"
                      />
                      <span className="calc-esb-currency">كجم</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bmi-height" className="calc-hint">الطول (سم)</Label>
                    <div className="calc-esb-money-row">
                      <Input
                        id="bmi-height"
                        inputMode="decimal"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="175"
                      />
                      <span className="calc-esb-currency">سم</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Age */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label htmlFor="bmi-age">العمر (للسعرات)</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="bmi-age"
                    inputMode="decimal"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="30"
                  />
                  <span className="calc-esb-currency">سنة</span>
                </div>
                <p className="calc-hint">اختياري — يُستخدم فقط لحساب السعرات اليومية</p>
              </div>

              {/* Activity level */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label>مستوى النشاط</Label>
                </div>
                <div className="bmi-activity-grid">
                  {ACTIVITY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      className={`bmi-activity-btn${activityLevel === level.value ? ' is-active' : ''}`}
                      onClick={() => setActivityLevel(level.value)}
                    >
                      <span className="bmi-activity-label">{level.label}</span>
                      <span className="bmi-activity-desc">{level.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel bmi-result" aria-live="polite">
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--bh">❤️ مؤشر الجسم</span>
                <span className="calc-esb-live-dot bmi-live-dot" aria-hidden="true" />
              </div>

              {/* BMI value */}
              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">مؤشر كتلة الجسم (BMI)</span>
                <div className={`calc-esb-amount-value bmi-value--${result.category}`}>
                  {result.bmi}
                </div>
                <div className="calc-esb-amount-meta">
                  <span className={`bmi-category-badge bmi-category-badge--${result.category}`}>
                    {result.categoryAr}
                  </span>
                </div>
              </div>

              {/* BMI scale */}
              <div className="bmi-scale-wrap">
                <div className="bmi-scale-track">
                  <div className="bmi-scale-segment bmi-scale-segment--underweight" />
                  <div className="bmi-scale-segment bmi-scale-segment--normal" />
                  <div className="bmi-scale-segment bmi-scale-segment--overweight" />
                  <div className="bmi-scale-segment bmi-scale-segment--obese1" />
                  <div className="bmi-scale-segment bmi-scale-segment--obese2" />
                  <div
                    className="bmi-scale-pointer"
                    style={{ left: bmiPointerLeft }}
                    aria-hidden="true"
                  />
                </div>
                <div className="bmi-scale-labels">
                  <span>نقص</span>
                  <span>مثالي</span>
                  <span>زيادة</span>
                  <span>سمنة</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <Scales size={14} weight="bold" />
                    الوزن المثالي لطولك
                  </span>
                  <strong>{result.idealMin}–{result.idealMax} كجم</strong>
                </div>
                {result.weightDiff !== 0 && (
                  <div className="calc-esb-brow">
                    <span className="calc-icon-label">
                      <Warning size={14} weight="bold" />
                      {result.weightDiff > 0 ? 'يجب إنقاص' : 'يُنصح بزيادة'}
                    </span>
                    <strong>{Math.abs(result.weightDiff)} كجم</strong>
                  </div>
                )}
                {result.tdee && (
                  <>
                    <div className="calc-esb-brow">
                      <span className="calc-icon-label">
                        <Heartbeat size={14} weight="bold" />
                        معدل الأيض الأساسي (BMR)
                      </span>
                      <strong>{formatNumber(result.bmr)} كالوري</strong>
                    </div>
                    <div className="calc-esb-brow calc-esb-brow--total">
                      <span className="calc-icon-label">
                        <Lightning size={14} weight="bold" />
                        السعرات اليومية للمحافظة
                      </span>
                      <strong>{formatNumber(result.tdee)} كالوري</strong>
                    </div>
                  </>
                )}
              </div>

              <div className="bmi-disclaimer">
                BMI مؤشر استرشادي — يُنصح باستشارة متخصص تغذية للتقييم الكامل.
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة BMI"
                shareText={shareText}
              />

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Scales size={28} weight="duotone" />
              <p>أدخل وزنك وطولك لحساب مؤشر كتلة الجسم.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from 'react';
import { Fire, Warning } from '@phosphor-icons/react';
import {
  ACTIVITY_LEVELS,
  GOALS,
  calculateCaloriesAndTDEE,
} from '@/lib/calculators/calories';
import {
  CalcInput as Input,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

function fmt(n) { return Math.round(n).toLocaleString('ar-SA-u-nu-latn'); }
function fmtDec(n, d = 1) { return n.toLocaleString('ar-SA-u-nu-latn', { minimumFractionDigits: d, maximumFractionDigits: d }); }

const GENDER_OPTIONS = [
  { value: 'male',   label: 'ذكر' },
  { value: 'female', label: 'أنثى' },
];

export default function CaloriesCalculator() {
  const [gender,        setGender]        = useState('male');
  const [weight,        setWeight]        = useState('75');
  const [height,        setHeight]        = useState('175');
  const [age,           setAge]           = useState('30');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal,          setGoal]          = useState('maintain');

  const result = useMemo(
    () => calculateCaloriesAndTDEE({ gender, weight, height, age, activityLevel, goal }),
    [gender, weight, height, age, activityLevel, goal],
  );

  const shareText = result.isValid
    ? `حاسبة السعرات الحرارية:\nالمعدل الأيضي: ${fmt(result.bmr)} kcal\nاحتياجك اليومي (TDEE): ${fmt(result.tdee)} kcal\nهدفك: ${fmt(result.targetCalories)} kcal/يوم\nBMI: ${fmtDec(result.bmi)} — ${result.bmiCategory.label}`
    : '';

  return (
    <div className="calc-app calories-tool" aria-label="حاسبة السعرات الحرارية والطاقة اليومية">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Gender */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>الجنس</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {GENDER_OPTIONS.map((g) => (
                    <button
                      key={g.value}
                      className={`ci-coverage-tab${gender === g.value ? ' is-active' : ''}`}
                      onClick={() => setGender(g.value)}
                      type="button"
                    >
                      <span className="ci-tab-label">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight + Height */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>الوزن والطول</Label>
                </div>
                <div className="cal-wh-row">
                  <div className="calc-esb-money-row">
                    <Input id="cal-weight" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="75" />
                    <span className="calc-esb-currency">كغ</span>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input id="cal-height" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" />
                    <span className="calc-esb-currency">سم</span>
                  </div>
                </div>
              </div>

              {/* Age */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label htmlFor="cal-age">العمر</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input id="cal-age" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" />
                  <span className="calc-esb-currency">سنة</span>
                </div>
              </div>

              {/* Activity level */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label>مستوى النشاط</Label>
                </div>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_LEVELS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Goal */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">5</span>
                  <Label>هدفك</Label>
                </div>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GOALS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge" style={{ color: 'var(--amber)', borderColor: 'color-mix(in srgb, var(--amber) 40%, transparent)', background: 'color-mix(in srgb, var(--amber) 8%, transparent)' }}>
                  🔥 السعرات
                </span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Target calories hero */}
              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">احتياجك اليومي لتحقيق الهدف</span>
                <div className="calc-esb-amount-value" style={{ color: 'var(--amber)' }}>
                  {fmt(result.targetCalories)} kcal
                </div>
                <div className="calc-esb-amount-meta">
                  <span>{result.goalLabel}</span>
                </div>
              </div>

              {/* Metabolism breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>معدل الأيض الأساسي (BMR)</span>
                  <strong>{fmt(result.bmr)} kcal</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>الإنفاق اليومي الكلي (TDEE)</span>
                  <strong>{fmt(result.tdee)} kcal</strong>
                </div>
                {result.goalDelta !== 0 && (
                  <div className="calc-esb-brow">
                    <span>التعديل للهدف</span>
                    <strong style={{ color: result.goalDelta < 0 ? 'var(--green-text)' : 'var(--blue-text)' }}>
                      {result.goalDelta > 0 ? '+' : ''}{result.goalDelta} kcal
                    </strong>
                  </div>
                )}
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>هدف السعرات اليومي</span>
                  <strong>{fmt(result.targetCalories)} kcal</strong>
                </div>
              </div>

              {/* Macros */}
              <div className="ci-factors">
                <div className="ci-factors-title">توزيع المغذيات الكبرى (مقترح)</div>
                {[
                  { label: 'بروتين (30%)', value: result.protein, unit: 'غرام' },
                  { label: 'كربوهيدرات (40%)', value: result.carbs, unit: 'غرام' },
                  { label: 'دهون (30%)', value: result.fat, unit: 'غرام' },
                ].map((m) => (
                  <div key={m.label} className="ci-factor-row ci-factor-row--2col">
                    <span className="ci-factor-label">{m.label}</span>
                    <span className="ci-factor-effect">{fmt(m.value)} {m.unit}/يوم</span>
                  </div>
                ))}
              </div>

              {/* BMI */}
              <div className="ci-factors" style={{ marginTop: 'var(--spacing-2)' }}>
                <div className="ci-factors-title">مؤشر كتلة الجسم (BMI)</div>
                <div className="ci-factor-row ci-factor-row--2col">
                  <span className="ci-factor-label">BMI</span>
                  <span className="ci-factor-effect" style={{ color: result.bmiCategory.color }}>
                    {fmtDec(result.bmi)} — {result.bmiCategory.label}
                  </span>
                </div>
                <div className="ci-factor-row ci-factor-row--2col">
                  <span className="ci-factor-label">الوزن المثالي (تقديري)</span>
                  <span className="ci-factor-effect">
                    {fmtDec(result.idealWeightMin)} – {fmtDec(result.idealWeightMax)} كغ
                  </span>
                </div>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة السعرات الحرارية اليومية"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>هذه تقديرات عامة — استشر متخصص تغذية لخطة دقيقة تناسب حالتك الصحية.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Fire size={32} weight="duotone" />
              <p>أدخل بياناتك لحساب احتياجك اليومي من السعرات الحرارية.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

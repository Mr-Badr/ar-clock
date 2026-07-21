"use client";

import { useMemo, useState } from 'react';
import { ChartBar, Info, ListNumbers, Warning } from '@phosphor-icons/react';

import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { calculateBasicStatistics, formatNumber } from '@/lib/calculators/engine';

const EXAMPLE = '85, 90, 78, 92, 88, 76, 95, 89';

function fmt(v) {
  if (v === null || v === undefined) return '—';
  return formatNumber(v, { maximumFractionDigits: 3 });
}

export default function StandardDeviationCalculator() {
  const [raw, setRaw] = useState(EXAMPLE);
  const [mode, setMode] = useState('sample'); // 'sample' | 'population'

  const stats = useMemo(() => calculateBasicStatistics(raw), [raw]);

  const stdDev = mode === 'sample' ? stats.sampleStdDev : stats.populationStdDev;
  const variance = mode === 'sample' ? stats.sampleVariance : stats.populationVariance;

  const shareText = stats.isValid
    ? `حاسبة الانحراف المعياري\nعدد القيم: ${stats.count}\nالوسط الحسابي: ${fmt(stats.mean)}\nالانحراف المعياري (${mode === 'sample' ? 'عينة' : 'مجتمع'}): ${fmt(stdDev)}\nالوسيط: ${fmt(stats.median)}\nالمدى: ${fmt(stats.range)}`
    : '';

  return (
    <div className="calc-app sd-tool" aria-label="حاسبة الانحراف المعياري والإحصاء الأساسي">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="sd-values">القيم (افصل بينها بفاصلة أو مسافة)</Label>
                </div>
                <textarea
                  id="sd-values"
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                  placeholder={EXAMPLE}
                  rows={3}
                  className="input calc-input sd-textarea"
                  dir="ltr"
                />
                <p className="calc-hint">
                  مثال جاهز: درجات {stats.isValid ? stats.count : 8} طلاب في اختبار. استبدل الأرقام
                  بقيمك الخاصة.
                </p>
              </div>

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>نوع البيانات</Label>
                </div>
                <div className="calc-kbd-row">
                  <button
                    type="button"
                    className={`chip calc-chip-button${mode === 'sample' ? ' is-active' : ''}`}
                    onClick={() => setMode('sample')}
                  >
                    عينة (n−1)
                  </button>
                  <button
                    type="button"
                    className={`chip calc-chip-button${mode === 'population' ? ' is-active' : ''}`}
                    onClick={() => setMode('population')}
                  >
                    المجتمع الكامل (n)
                  </button>
                </div>
                <p className="calc-hint">
                  {mode === 'sample'
                    ? 'اختر هذا إذا كانت بياناتك عيّنة من مجموعة أكبر (الحالة الأشيع في الأبحاث والاختبارات).'
                    : 'اختر هذا فقط إذا كانت بياناتك تمثل كل المجتمع الإحصائي، لا عيّنة منه.'}
                </p>
              </div>

            </CardContent>
          </Card>

          {stats.isValid && (
            <div className="calc-esb-sidebar-facts">
              <div className="calc-esb-fact">
                <ListNumbers size={15} weight="bold" />
                <span>عدد القيم: <strong>{stats.count}</strong></span>
              </div>
              <div className="calc-esb-fact">
                <ChartBar size={15} weight="bold" />
                <span>المدى: <strong>{fmt(stats.range)}</strong></span>
              </div>
              <div className="calc-esb-fact">
                <Info size={15} weight="bold" />
                <span>المنوال: <strong>{stats.modes.length ? stats.modes.map(fmt).join('، ') : 'لا يوجد'}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {stats.isValid ? (
            <div className="calc-esb-result-panel sd-result" aria-live="polite">

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">
                  الانحراف المعياري ({mode === 'sample' ? 'عينة' : 'مجتمع'})
                </span>
                <div className="calc-esb-amount-value">{fmt(stdDev)}</div>
                <div className="calc-esb-amount-meta">
                  <span>التباين {fmt(variance)}</span>
                  <span className="calc-esb-sep">·</span>
                  <span>الوسط الحسابي {fmt(stats.mean)}</span>
                </div>
              </div>

              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>الوسط الحسابي (Mean)</span>
                  <strong>{fmt(stats.mean)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>الوسيط (Median)</span>
                  <strong>{fmt(stats.median)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>أصغر قيمة / أكبر قيمة</span>
                  <strong>{fmt(stats.min)} / {fmt(stats.max)}</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>مجموع مربعات الانحرافات Σ(x−x̄)²</span>
                  <strong>{fmt(stats.sumSquaredDeviations)}</strong>
                </div>
              </div>

              {/* Worked-example breakdown table — the real differentiator */}
              <div className="sd-breakdown-wrap">
                <p className="sd-breakdown-title">خطوات الحل: انحراف كل قيمة عن الوسط</p>
                <div className="sd-breakdown-table-scroll">
                  <table className="calc-info-table sd-breakdown-table">
                    <thead>
                      <tr>
                        <th>x</th>
                        <th>x − x̄</th>
                        <th>(x − x̄)²</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.breakdown.map((row, i) => (
                        <tr key={i}>
                          <td>{fmt(row.x)}</td>
                          <td dir="ltr">{row.deviation >= 0 ? `+${fmt(row.deviation)}` : fmt(row.deviation)}</td>
                          <td>{fmt(row.squaredDeviation)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="calc-hint" style={{ marginTop: 'var(--space-2)' }}>
                  {mode === 'sample'
                    ? `القسمة على n−1 = ${stats.count - 1} (تصحيح بيسل)، ثم الجذر التربيعي.`
                    : `القسمة على n = ${stats.count}، ثم الجذر التربيعي.`}
                </p>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة الانحراف المعياري"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>النتيجة تقديرية بدقة حتى 3 خانات عشرية — كافية لمعظم أغراض الدراسة والتحليل.</span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Warning size={28} weight="duotone" />
              <p>أدخل قيمتين على الأقل (مفصولتين بفاصلة أو مسافة) لحساب الإحصاء.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

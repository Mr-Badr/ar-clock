"use client";

import { useMemo, useState } from 'react';
import { CheckCircle, Plus, Target, Trash, WarningCircle } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { calculateWeightedGrade, formatNumber } from '@/lib/calculators/engine';

let rowIdCounter = 0;
function nextRowId() {
  rowIdCounter += 1;
  return `row-${rowIdCounter}`;
}

const DEFAULT_ROWS = [
  { id: nextRowId(), name: 'أعمال الفصل', weight: '40', score: '87.5' },
  { id: nextRowId(), name: 'الاختبار النهائي', weight: '60', score: '' },
];

export default function WeightedGradeCalculator() {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [targetGrade, setTargetGrade] = useState('60');

  function updateRow(id, field, value) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    if (rows.length >= 6) return;
    setRows((prev) => [...prev, { id: nextRowId(), name: `مكون ${prev.length + 1}`, weight: '', score: '' }]);
  }

  function removeRow(id) {
    if (rows.length <= 2) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const result = useMemo(
    () => calculateWeightedGrade({ components: rows, targetGrade }),
    [rows, targetGrade],
  );

  const shareText = result.isValid
    ? `حاسبة الدرجة النهائية بالأوزان\nدرجتك الحالية: ${formatNumber(result.currentGrade)}%\n${
        result.pendingWeight > 0
          ? `تحتاج ${formatNumber(result.neededScore)}% في الجزء المتبقي (${formatNumber(result.pendingWeight)}%) للوصول إلى ${formatNumber(result.targetGrade)}%`
          : ''
      }`
    : '';

  return (
    <div className="calc-app weighted-grade-tool" aria-label="حاسبة الدرجة النهائية بالأوزان">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card">
            <div className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>مكونات الدرجة (الوزن والدرجة من 100)</Label>
                </div>

                <div className="weighted-grade-rows">
                  {rows.map((row, idx) => (
                    <div key={row.id} className="weighted-grade-row">
                      <Input
                        aria-label={`اسم المكون ${idx + 1}`}
                        value={row.name}
                        onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                        placeholder="اسم المكون"
                        className="weighted-grade-name-input"
                      />
                      <Input
                        aria-label={`وزن المكون ${idx + 1}`}
                        inputMode="decimal"
                        value={row.weight}
                        onChange={(e) => updateRow(row.id, 'weight', e.target.value)}
                        placeholder="الوزن %"
                        className="weighted-grade-weight-input"
                      />
                      <Input
                        aria-label={`درجة المكون ${idx + 1}`}
                        inputMode="decimal"
                        value={row.score}
                        onChange={(e) => updateRow(row.id, 'score', e.target.value)}
                        placeholder="لم تُعلن بعد"
                        className="weighted-grade-score-input"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length <= 2}
                        aria-label="حذف المكون"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button type="button" variant="outline" className="calc-button" onClick={addRow} disabled={rows.length >= 6}>
                  <Plus size={14} weight="bold" /> أضف مكوناً
                </Button>

                <p className="calc-hint">
                  أدخل الدرجة كنسبة مئوية من 100 (مثال: حصلت على 35 من 40 → أدخل 87.5). اترك خانة
                  الدرجة فارغة للمكونات التي لم تُعلن نتيجتها بعد (عادة الاختبار النهائي). مجموع
                  الأوزان يجب أن يساوي 100.
                </p>
                {result.weightMismatch && (
                  <p className="calc-hint" style={{ color: 'var(--amber-text)' }}>
                    <WarningCircle size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                    {' '}مجموع الأوزان الحالي {formatNumber(result.totalWeight)}%، وليس 100% — تحقق من الأوزان قبل الاعتماد على النتيجة.
                  </p>
                )}
              </div>

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="wg-target">الدرجة المستهدفة</Label>
                </div>
                <Input
                  id="wg-target"
                  inputMode="decimal"
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                  placeholder="60"
                />
                <p className="calc-hint">مثال: 60 للنجاح، 85 لتقدير جيد جداً، 90 لتقدير ممتاز</p>
              </div>

            </div>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel weighted-grade-result" aria-live="polite">
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--sa">
                  <Target size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} /> الدرجة النهائية بالأوزان
                </span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">درجتك المضمونة حتى الآن</span>
                <div className="calc-esb-amount-value">{formatNumber(result.currentGrade)}%</div>
                <div className="calc-esb-amount-meta">
                  <span>{formatNumber(result.earnedPoints)} نقطة من أصل {formatNumber(result.gradedWeight)}% مُعلنة</span>
                  {result.pendingWeight > 0 && (
                    <>
                      <span className="calc-esb-sep">·</span>
                      <span>{formatNumber(result.pendingWeight)}% متبقٍ</span>
                    </>
                  )}
                </div>
              </div>

              {result.pendingWeight > 0 ? (
                result.alreadySecured ? (
                  <div className="calc-success">
                    <CheckCircle size={16} weight="bold" style={{ display: 'inline', verticalAlign: '-2px' }} />
                    {' '}حصلت بالفعل على {formatNumber(result.targetGrade)}% حتى لو حصلت على صفر في الجزء المتبقي.
                  </div>
                ) : result.isAchievable ? (
                  <div className="calc-esb-breakdown">
                    <div className="calc-esb-brow calc-esb-brow--total">
                      <span>الدرجة المطلوبة في الجزء المتبقي ({formatNumber(result.pendingWeight)}%)</span>
                      <strong>{formatNumber(result.neededScore)}%</strong>
                    </div>
                  </div>
                ) : (
                  <div className="calc-warning">
                    <WarningCircle size={16} weight="bold" style={{ display: 'inline', verticalAlign: '-2px' }} />
                    {' '}تحتاج {formatNumber(result.neededScore)}% في الجزء المتبقي، وهذا أعلى من 100% — الوصول إلى {formatNumber(result.targetGrade)}% غير ممكن بالوزن المتبقي الحالي.
                  </div>
                )
              ) : (
                <p className="calc-hint">جميع المكونات مُعلنة — هذه درجتك النهائية الفعلية.</p>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة الدرجة النهائية بالأوزان"
                shareText={shareText}
              />

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Target size={28} weight="duotone" />
              <p>أدخل وزن ودرجة مكوناتك لحساب درجتك النهائية.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

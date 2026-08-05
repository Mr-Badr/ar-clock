"use client";

import { useMemo, useState } from 'react';
import { CheckCircle, Plus, ShareNetwork, Target, Trash, WarningCircle } from '@phosphor-icons/react';
import { toast } from 'sonner';

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

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

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
    <div aria-label="حاسبة الدرجة النهائية بالأوزان">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Target size={14} weight="bold" /> الدرجة النهائية بالأوزان <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>
          مكونات الدرجة (الوزن والدرجة من 100)
          <span className="tool-v2-option-hint">اترك خانة الدرجة فارغة للمكونات غير المُعلنة بعد (عادة الاختبار النهائي)</span>
        </label>

        <div className="tool-v2-rebar-rows">
          {rows.map((row, idx) => (
            <div key={row.id} className="tool-v2-rebar-row--3col">
              <div className="tool-v2-rebar-row-field">
                <label htmlFor={`wg-name-${row.id}`}>اسم المكون</label>
                <input id={`wg-name-${row.id}`} value={row.name} onChange={(e) => updateRow(row.id, 'name', e.target.value)} placeholder={`مكون ${idx + 1}`} />
              </div>
              <div className="tool-v2-rebar-row-field">
                <label htmlFor={`wg-weight-${row.id}`}>الوزن %</label>
                <input id={`wg-weight-${row.id}`} type="number" inputMode="decimal" value={row.weight} onChange={(e) => updateRow(row.id, 'weight', e.target.value)} placeholder="الوزن %" />
              </div>
              <div className="tool-v2-rebar-row-field">
                <label htmlFor={`wg-score-${row.id}`}>الدرجة</label>
                <input id={`wg-score-${row.id}`} type="number" inputMode="decimal" value={row.score} onChange={(e) => updateRow(row.id, 'score', e.target.value)} placeholder="لم تُعلن" />
              </div>
              <button
                type="button"
                className="tool-v2-rebar-row-remove"
                onClick={() => removeRow(row.id)}
                disabled={rows.length <= 2}
                aria-label="حذف المكون"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>

        <button type="button" className="tool-v2-add-row-btn" onClick={addRow} disabled={rows.length >= 6}>
          <Plus size={16} weight="bold" /> أضف مكوناً
        </button>

        <p className="tool-v2-option-hint">
          أدخل الدرجة كنسبة مئوية من 100 (مثال: حصلت على 35 من 40 → أدخل 87.5). مجموع الأوزان يجب أن يساوي 100.
        </p>
        {result.weightMismatch && (
          <p className="tool-v2-option-hint" style={{ color: 'var(--amber-text)' }}>
            <WarningCircle size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
            {' '}مجموع الأوزان الحالي {formatNumber(result.totalWeight)}%، وليس 100% — تحقق من الأوزان قبل الاعتماد على النتيجة.
          </p>
        )}
      </div>

      <div className="tool-v2-field">
        <label htmlFor="wg-target">الدرجة المستهدفة</label>
        <input id="wg-target" type="number" inputMode="decimal" value={targetGrade} onChange={(e) => setTargetGrade(e.target.value)} placeholder="60" />
        <span className="tool-v2-option-hint">مثال: 60 للنجاح، 85 لتقدير جيد جداً، 90 لتقدير ممتاز</span>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">درجتك المضمونة حتى الآن</span>
            <div className="tool-v2-result-value">{formatNumber(result.currentGrade)}%</div>
            <div className="tool-v2-result-meta">
              {formatNumber(result.earnedPoints)} نقطة من أصل {formatNumber(result.gradedWeight)}% مُعلنة
              {result.pendingWeight > 0 ? ` — ${formatNumber(result.pendingWeight)}% متبقٍ` : ''}
            </div>
          </div>

          {result.pendingWeight > 0 ? (
            result.alreadySecured ? (
              <div className="tool-v2-note-strip">
                <CheckCircle size={15} weight="fill" />
                <span>حصلت بالفعل على {formatNumber(result.targetGrade)}% حتى لو حصلت على صفر في الجزء المتبقي.</span>
              </div>
            ) : result.isAchievable ? (
              <div className="tool-v2-breakdown-list">
                <div className="tool-v2-breakdown-row">
                  <span className="tool-v2-breakdown-label">الدرجة المطلوبة في الجزء المتبقي ({formatNumber(result.pendingWeight)}%)</span>
                  <span className="tool-v2-breakdown-value">{formatNumber(result.neededScore)}%</span>
                </div>
              </div>
            ) : (
              <div className="tool-v2-note-strip">
                <WarningCircle size={15} weight="fill" />
                <span>تحتاج {formatNumber(result.neededScore)}% في الجزء المتبقي، وهذا أعلى من 100% — الوصول إلى {formatNumber(result.targetGrade)}% غير ممكن بالوزن المتبقي الحالي.</span>
              </div>
            )
          ) : (
            <div className="tool-v2-note-strip">
              <CheckCircle size={15} weight="fill" />
              <span>جميع المكونات مُعلنة — هذه درجتك النهائية الفعلية.</span>
            </div>
          )}

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة الدرجة النهائية بالأوزان', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Target size={28} weight="duotone" />
          <p>أدخل وزن ودرجة مكوناتك لحساب درجتك النهائية.</p>
        </div>
      )}
    </div>
  );
}

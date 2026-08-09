"use client";

import { useMemo, useState } from 'react';
import { ChartBar, ShareNetwork, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';

import { calculateBasicStatistics, formatNumber } from '@/lib/calculators/engine';

const EXAMPLE = '85, 90, 78, 92, 88, 76, 95, 89';

function fmt(v) {
  if (v === null || v === undefined) return '—';
  return formatNumber(v, { maximumFractionDigits: 3 });
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
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
    <div aria-label="حاسبة الانحراف المعياري والإحصاء الأساسي">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><ChartBar size={14} weight="bold" /> إحصاء أساسي <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sd-values">القيم (افصل بينها بفاصلة أو مسافة)</label>
        <textarea
          id="sd-values"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={EXAMPLE}
          rows={3}
          dir="ltr"
          style={{ width: '100%', resize: 'vertical' }}
        />
        <span className="tool-v2-option-hint">مثال جاهز: درجات {stats.isValid ? stats.count : 8} طلاب في اختبار. استبدل الأرقام بقيمك الخاصة.</span>
      </div>

      <div className="tool-v2-field">
        <label>نوع البيانات</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="نوع البيانات">
          <button type="button" className={`tool-v2-chip${mode === 'sample' ? ' is-active' : ''}`} onClick={() => setMode('sample')}>عينة (n−1)</button>
          <button type="button" className={`tool-v2-chip${mode === 'population' ? ' is-active' : ''}`} onClick={() => setMode('population')}>المجتمع الكامل (n)</button>
        </div>
        <span className="tool-v2-option-hint">
          {mode === 'sample'
            ? 'اختر هذا إذا كانت بياناتك عيّنة من مجموعة أكبر (الحالة الأشيع في الأبحاث والاختبارات).'
            : 'اختر هذا فقط إذا كانت بياناتك تمثل كل المجتمع الإحصائي، لا عيّنة منه.'}
        </span>
      </div>

      {stats.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">الانحراف المعياري ({mode === 'sample' ? 'عينة' : 'مجتمع'})</span>
            <div className="tool-v2-result-value">{fmt(stdDev)}</div>
            <div className="tool-v2-result-meta">التباين {fmt(variance)} — الوسط الحسابي {fmt(stats.mean)}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">عدد القيم</span><span className="tool-v2-breakdown-value">{stats.count}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الوسيط (Median)</span><span className="tool-v2-breakdown-value">{fmt(stats.median)}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">المنوال (Mode)</span><span className="tool-v2-breakdown-value">{stats.modes.length ? stats.modes.map(fmt).join('، ') : 'لا يوجد'}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">أصغر / أكبر قيمة</span><span className="tool-v2-breakdown-value">{fmt(stats.min)} / {fmt(stats.max)}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">المدى (Range)</span><span className="tool-v2-breakdown-value">{fmt(stats.range)}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">مجموع مربعات الانحرافات Σ(x−x̄)²</span><span className="tool-v2-breakdown-value">{fmt(stats.sumSquaredDeviations)}</span></div>
          </div>

          <div className="tool-v2-mini-block-head">
            <span>خطوات الحل: انحراف كل قيمة عن الوسط</span>
          </div>
          <div className="tool-v2-table-wrap">
            <table className="tool-v2-table">
              <thead><tr><th>x</th><th>x − x̄</th><th>(x − x̄)²</th></tr></thead>
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
          <p className="tool-v2-option-hint">
            {mode === 'sample'
              ? `القسمة على n−1 = ${stats.count - 1} (تصحيح بيسل)، ثم الجذر التربيعي.`
              : `القسمة على n = ${stats.count}، ثم الجذر التربيعي.`}
          </p>

          <div className="tool-v2-note-strip">
            <Warning size={15} weight="fill" />
            <span>النتيجة تقديرية بدقة حتى 3 خانات عشرية — كافية لمعظم أغراض الدراسة والتحليل.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة الانحراف المعياري', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل قيمتين على الأقل (مفصولتين بفاصلة أو مسافة) لحساب الإحصاء.</p>
        </div>
      )}
    </div>
  );
}

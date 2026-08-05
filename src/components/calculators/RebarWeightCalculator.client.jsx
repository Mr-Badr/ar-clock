"use client";

import { useState } from 'react';
import {
  CaretDown,
  Hash,
  Info,
  Plus,
  Ruler,
  Share as ShareIcon,
  Trash,
  Warning,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  REBAR_DIAMETERS,
  REBAR_TYPICAL_USE,
  REBAR_WEIGHT_PER_METER,
  calcRebarWeight,
  fmt,
} from '@/lib/calculators/building/constants';

function FieldHint({ text }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="tool-v2-field-hint-btn" aria-label="توضيح">
            <Info size={14} weight="bold" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

async function shareResult(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return;
    } catch {
      // user cancelled — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast.success('تم نسخ النتيجة إلى الحافظة');
  } catch {
    toast.error('تعذر نسخ النتيجة');
  }
}

export default function RebarWeightCalculator() {
  const [diameter, setDiameter] = useState(16);
  const [rows, setRows] = useState([{ length: 12, count: 100 }]);
  const [showTable, setShowTable] = useState(false);

  function updateRow(index, field, value) {
    const parsed = Math.max(0, Number(value) || 0);
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: parsed } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, { length: 12, count: 1 }]);
  }

  function removeRow(index) {
    setRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  const totalLengthM = rows.reduce((sum, r) => sum + r.length * r.count, 0);
  const result = calcRebarWeight(diameter, totalLengthM);
  const hasInput = totalLengthM > 0;

  const shareText = hasInput
    ? `وزن حديد التسليح: ${fmt(result.totalKg, 1)} كجم (${fmt(result.totalTons, 3)} طن)\nقطر ${diameter} ملم — إجمالي الطول ${fmt(totalLengthM, 1)} متر\nوزن المتر الطولي: ${fmt(result.weightPerMeter, 3)} كجم/م`
    : '';

  return (
    <div aria-label="حاسبة وزن حديد التسليح">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" /> حسب القطر
        </span>
      </div>

      <div className="tool-v2-field">
        <label>
          قطر السيخ (مم)
          <FieldHint text="اختر القطر كما يظهر في المخطط الإنشائي أو جدول التفريد — الوزن يتغير بسرعة مع القطر لأنه مربّع في المعادلة." />
        </label>
        <div className="tool-v2-option-list tool-v2-option-list--grid">
          {REBAR_DIAMETERS.map((d) => (
            <button
              key={d}
              type="button"
              className={`tool-v2-chip${diameter === d ? ' is-active' : ''}`}
              aria-pressed={diameter === d}
              onClick={() => setDiameter(d)}
            >
              ⌀{d}
            </button>
          ))}
        </div>
        <span className="tool-v2-option-hint">{REBAR_TYPICAL_USE[diameter]}</span>
      </div>

      <div className="tool-v2-field">
        <label>
          أطوال الأسياخ وعددها
          <FieldHint text="أضف كل طول مختلف على حدة مع عدد الأسياخ لهذا الطول — الحاسبة تجمعها كلها." />
        </label>
        <div className="tool-v2-rebar-rows">
          {rows.map((row, index) => (
            <div key={index} className="tool-v2-rebar-row">
              <div className="tool-v2-rebar-row-field">
                <label htmlFor={`rebar-len-${index}`}>الطول (م)</label>
                <input
                  id={`rebar-len-${index}`}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={row.length}
                  onChange={(e) => updateRow(index, 'length', e.target.value)}
                />
              </div>
              <div className="tool-v2-rebar-row-field">
                <label htmlFor={`rebar-count-${index}`}>العدد</label>
                <input
                  id={`rebar-count-${index}`}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={row.count}
                  onChange={(e) => updateRow(index, 'count', e.target.value)}
                />
              </div>
              <button
                type="button"
                className="tool-v2-rebar-row-remove"
                onClick={() => removeRow(index)}
                disabled={rows.length === 1}
                aria-label={`حذف السطر ${index + 1}`}
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="tool-v2-add-row-btn" onClick={addRow}>
          <Plus size={16} weight="bold" /> إضافة طول آخر
        </button>
      </div>

      {hasInput ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">الوزن الإجمالي</span>
            <div className="tool-v2-result-value">{fmt(result.totalKg, 1)} كجم</div>
            <div className="tool-v2-result-meta">أو {fmt(result.totalTons, 3)} طن</div>
          </div>

          <div className="tool-v2-mini-block-head">
            <Ruler size={14} weight="bold" />
            <span>تفاصيل الحساب</span>
          </div>
          <div className="tool-v2-timeline">
            <div className="tool-v2-milestone is-past">
              <span className="tool-v2-milestone-marker" aria-hidden="true"><Ruler size={12} weight="bold" /></span>
              <span className="tool-v2-milestone-body">
                <strong className="tool-v2-milestone-label">إجمالي الطول</strong>
                <span className="tool-v2-milestone-sub">مجموع كل الأسياخ قبل تحويلها لوزن</span>
              </span>
              <span className="tool-v2-milestone-value">{fmt(totalLengthM, 1)} م</span>
            </div>
            <div className="tool-v2-milestone is-past">
              <span className="tool-v2-milestone-marker" aria-hidden="true"><Hash size={12} weight="bold" /></span>
              <span className="tool-v2-milestone-body">
                <strong className="tool-v2-milestone-label">يعادل بطول 12م القياسي</strong>
                <span className="tool-v2-milestone-sub">تحويل تقريبي مفيد عند الشراء</span>
              </span>
              <span className="tool-v2-milestone-value">{fmt(result.barsOf12m)} سيخ</span>
            </div>
            <div className="tool-v2-milestone is-past">
              <span className="tool-v2-milestone-marker" aria-hidden="true"><Warning size={12} weight="bold" /></span>
              <span className="tool-v2-milestone-body">
                <strong className="tool-v2-milestone-label">وزن المتر الطولي لقطر {diameter}</strong>
                <span className="tool-v2-milestone-sub">القطر² ÷ 162 (تقريب هندسي معتمد)</span>
              </span>
              <span className="tool-v2-milestone-value">{fmt(result.weightPerMeter, 3)} كجم/م</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل طولاً وعدداً صحيحين لسيخ واحد على الأقل.</p>
        </div>
      )}

      <div className="tool-v2-tool-collapse">
        <button
          type="button"
          className="tool-v2-tool-collapse-toggle"
          onClick={() => setShowTable((v) => !v)}
          aria-expanded={showTable}
        >
          <span>جدول أوزان الحديد لكل الأقطار</span>
          <CaretDown size={16} weight="bold" style={{ transform: showTable ? 'rotate(180deg)' : undefined, transition: 'transform .15s' }} />
        </button>
        {showTable && (
          <div className="tool-v2-tool-collapse-body">
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr><th>القطر</th><th>وزن المتر (كجم/م)</th><th>الاستخدام الشائع</th></tr>
                </thead>
                <tbody>
                  {REBAR_DIAMETERS.map((d) => (
                    <tr key={d}>
                      <td>⌀{d} مم</td>
                      <td>{fmt(REBAR_WEIGHT_PER_METER[d], 3)}</td>
                      <td>{REBAR_TYPICAL_USE[d]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="tool-v2-action-row">
        <button
          type="button"
          className="tool-v2-action-btn is-primary"
          onClick={() => shareResult('حاسبة وزن حديد التسليح', shareText)}
          disabled={!hasInput}
        >
          <ShareIcon size={18} weight="bold" /> مشاركة
        </button>
      </div>
    </div>
  );
}

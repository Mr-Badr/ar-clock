"use client";

import { useMemo, useState } from 'react';
import { GraduationCap, Info, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';

import { convertGpaToPercent, GPA_SYSTEMS, getGpaClassification } from '@/lib/calculators/gpa';

const SYSTEM_IDS = ['scale5', 'scale4', 'scale20', 'scale10', 'scale100'];

function formatNum(n) {
  const rounded = Math.round(n * 100) / 100;
  return rounded.toLocaleString('ar-SA-u-nu-latn', { maximumFractionDigits: 2 });
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function GpaToPercentCalculator() {
  const [systemId, setSystemId] = useState('scale5');
  const [gpaValue, setGpaValue] = useState('');

  const system = GPA_SYSTEMS[systemId];

  const result = useMemo(() => {
    if (!gpaValue) return null;
    return convertGpaToPercent(gpaValue, systemId);
  }, [gpaValue, systemId]);

  const classification = useMemo(() => {
    if (!result?.isValid) return null;
    return getGpaClassification(parseFloat(gpaValue), systemId);
  }, [result, gpaValue, systemId]);

  const scalePercent = result?.isValid
    ? Math.min(100, Math.max(0, (parseFloat(gpaValue) / system.max) * 100))
    : 0;

  const shareText = result?.isValid
    ? `المعدل ${gpaValue} من ${system.max} (${system.label}) = ${formatNum(result.percent)}%\nالتصنيف: ${classification?.label ?? ''}`
    : '';

  return (
    <div aria-label="تحويل المعدل إلى نسبة مئوية">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><GraduationCap size={14} weight="bold" /> تحويل المعدل <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>نظام المعدل</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="نظام المعدل">
          {SYSTEM_IDS.map((sid) => (
            <button key={sid} type="button" className={`tool-v2-chip${systemId === sid ? ' is-active' : ''}`} onClick={() => setSystemId(sid)}>{GPA_SYSTEMS[sid].label}</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="gpa-input">المعدل التراكمي</label>
        <input id="gpa-input" type="number" inputMode="decimal" dir="ltr" value={gpaValue} onChange={(e) => setGpaValue(e.target.value)} placeholder={`0 – ${system.max}`} />
        <span className="tool-v2-option-hint">أدخل معدلك بين 0 و{system.max} — يقبل الأرقام العشرية مثل 4.67 أو 3.5.</span>
      </div>

      {result?.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">النسبة المئوية المكافئة</span>
            <div className="tool-v2-result-value">{formatNum(result.percent)}%</div>
            {classification ? <div className="tool-v2-result-meta">{classification.label} · {classification.labelEn}</div> : null}
          </div>

          <div className="tool-v2-hbar-list" style={{ margin: 'var(--space-3) 0' }}>
            <div className="tool-v2-hbar-row">
              <span className="tool-v2-hbar-label">0</span>
              <div className="tool-v2-hbar-track"><div className="tool-v2-hbar-fill" style={{ width: `${scalePercent}%`, background: 'var(--blue)' }} /></div>
              <span className="tool-v2-hbar-label">{system.max}</span>
            </div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">المعدل المُدخل</span><span className="tool-v2-breakdown-value">{formatNum(parseFloat(gpaValue))} / {system.max}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">النسبة المئوية</span><span className="tool-v2-breakdown-value">{formatNum(result.percent)}%</span></div>
          </div>

          {system.grades?.length > 0 && (
            <>
              <div className="tool-v2-mini-block-head"><span>سلّم الدرجات — {system.label}</span></div>
              <div className="tool-v2-breakdown-list">
                {system.grades.map((g) => (
                  <div key={g.label} className="tool-v2-breakdown-row">
                    <span className="tool-v2-breakdown-label">{g.label} ({g.points})</span>
                    <span className="tool-v2-breakdown-value">{g.percent}%</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>
              {(systemId === 'scale5' || systemId === 'scale4')
                ? 'التحويل تقريبي ويعتمد جدول تعادل شائعاً — بعض الجامعات تستخدم جداولها الرسمية الخاصة، فتحقق منها إن كان التحويل لغرض رسمي.'
                : 'التحويل خطي مباشر (القيمة ÷ الحد الأقصى × 100) — الأنسب لهذا النظام.'}
            </span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('نتيجة تحويل المعدل إلى نسبة مئوية', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <GraduationCap size={28} weight="duotone" />
          <p>اختر نظام المعدل وأدخل قيمته لمعرفة النسبة المئوية المكافئة والتصنيف فوراً.</p>
        </div>
      )}
    </div>
  );
}

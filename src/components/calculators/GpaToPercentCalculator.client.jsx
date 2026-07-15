"use client";

import { useMemo, useState } from 'react';
import { ChartBar, GraduationCap, Info } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import { convertGpaToPercent, GPA_SYSTEMS, getGpaClassification } from '@/lib/calculators/gpa';

const SYSTEM_IDS = ['scale5', 'scale4', 'scale20', 'scale10', 'scale100'];

function formatNum(n) {
  const rounded = Math.round(n * 100) / 100;
  return rounded.toLocaleString('ar-SA-u-nu-latn', { maximumFractionDigits: 2 });
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
    <div className="calc-app gpa-pct-tool" aria-label="تحويل المعدل إلى نسبة مئوية">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card">
            <div className="calc-esb-form-body">

              {/* System selector */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>نظام المعدل</Label>
                </div>
                <div className="calc-kbd-row">
                  {SYSTEM_IDS.map((sid) => (
                    <button
                      key={sid}
                      type="button"
                      className={`chip calc-chip-button${systemId === sid ? ' is-active' : ''}`}
                      onClick={() => setSystemId(sid)}
                      aria-pressed={systemId === sid}
                    >
                      {GPA_SYSTEMS[sid].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* GPA input */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="gpa-input">المعدل التراكمي</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="gpa-input"
                    inputMode="decimal"
                    dir="ltr"
                    value={gpaValue}
                    onChange={(e) => setGpaValue(e.target.value)}
                    placeholder={`0 – ${system.max}`}
                  />
                  <span className="calc-esb-currency">من {system.max}</span>
                </div>
                <p className="calc-hint">أدخل معدلك بين 0 و{system.max} — يقبل الأرقام العشرية مثل 4.67 أو 3.5.</p>
              </div>

            </div>
          </div>

          {/* Sidebar quick facts */}
          <div className="calc-esb-sidebar-facts">
            <div className="calc-esb-fact">
              <GraduationCap size={15} weight="bold" />
              <span>النظام: <strong>{system.label}</strong></span>
            </div>
            <div className="calc-esb-fact">
              <ChartBar size={15} weight="bold" />
              <span>الحد الأقصى: <strong>{system.max}</strong></span>
            </div>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result?.isValid ? (
            <div className="calc-esb-result-panel gpa-pct-result" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge gpa-pct-badge">
                  <GraduationCap size={13} weight="bold" /> تحويل المعدل
                </span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">النسبة المئوية المكافئة</span>
                <div className={`calc-esb-amount-value gpa-value--${classification?.level ?? 'good'}`}>
                  {formatNum(result.percent)}%
                </div>
                {classification && (
                  <span className={`gpa-class-badge gpa-class-badge--${classification.level}`}>
                    {classification.label} · {classification.labelEn}
                  </span>
                )}
              </div>

              {/* Position on scale */}
              <div className="gpa-pct-scale">
                <div className="gpa-pct-scale-track">
                  <div
                    className={`gpa-pct-scale-fill gpa-pct-scale-fill--${classification?.level ?? 'good'}`}
                    style={{ width: `${scalePercent}%` }}
                  />
                  <div
                    className={`gpa-pct-scale-marker gpa-pct-scale-marker--${classification?.level ?? 'good'}`}
                    style={{ insetInlineStart: `${scalePercent}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="gpa-pct-scale-labels">
                  <span>0</span>
                  <span>{system.max}</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>المعدل المُدخل</span>
                  <strong>{formatNum(parseFloat(gpaValue))} / {system.max}</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>النسبة المئوية</span>
                  <strong>{formatNum(result.percent)}%</strong>
                </div>
              </div>

              {/* Grade table for the selected system, if available */}
              {system.grades?.length > 0 && (
                <div className="gpa-pct-grades">
                  <p className="pregnancy-milestones-title">سلّم الدرجات — {system.label}</p>
                  {system.grades.map((g) => (
                    <div key={g.label} className="gpa-pct-grade-row">
                      <span className="gpa-pct-grade-label">{g.label}</span>
                      <span className="gpa-pct-grade-points">{g.points}</span>
                      <span className="gpa-pct-grade-pct">{g.percent}%</span>
                    </div>
                  ))}
                </div>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة تحويل المعدل إلى نسبة مئوية"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Info size={14} weight="fill" />
                <span>
                  {(systemId === 'scale5' || systemId === 'scale4')
                    ? 'التحويل تقريبي ويعتمد جدول تعادل شائعاً — بعض الجامعات تستخدم جداولها الرسمية الخاصة، فتحقق منها إن كان التحويل لغرض رسمي.'
                    : 'التحويل خطي مباشر (القيمة ÷ الحد الأقصى × 100) — الأنسب لهذا النظام.'}
                </span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <GraduationCap size={28} weight="duotone" />
              <p>اختر نظام المعدل وأدخل قيمته لمعرفة النسبة المئوية المكافئة والتصنيف فوراً.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

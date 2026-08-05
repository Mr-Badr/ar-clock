"use client";

import { useMemo, useState } from 'react';
import { Drop, Flask, Info, ShieldWarning, Warning } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fmt } from '@/lib/calculators/building/constants';

const FORMS = [
  { id: 'liquid', label: 'مبيد سائل مركّز', unit: 'مل', desc: 'يُخفَّف بالماء بنسبة محددة على الملصق.', icon: Drop, color: 'blue' },
  { id: 'powder', label: 'مبيد مسحوق (WP)', unit: 'غرام', desc: 'يُذاب بالماء بوزن محدد على الملصق.', icon: Flask, color: 'amber' },
];

const TANK_SIZES = [1, 5, 16, 20];

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

export default function PesticideDosageCalculator() {
  const [formId, setFormId] = useState('liquid');
  const [dosageRate, setDosageRate] = useState('');
  const [tankSize, setTankSize] = useState('16');
  const [area, setArea] = useState('');
  const [sprayRate, setSprayRate] = useState('100'); // mL of mixed solution per m², editable

  const form = FORMS.find((f) => f.id === formId);
  const rate = Math.max(0, Number(dosageRate) || 0);
  const tank = Math.max(0, Number(tankSize) || 0);
  const hasInput = rate > 0 && tank > 0;

  const result = useMemo(() => {
    if (!hasInput) return null;
    const concentratePerTank = rate * tank;
    const areaNum = Math.max(0, Number(area) || 0);
    const sprayRateNum = Math.max(0, Number(sprayRate) || 0);
    let tanksNeeded = null;
    let totalConcentrate = null;
    let totalSolutionLiters = null;
    if (areaNum > 0 && sprayRateNum > 0) {
      totalSolutionLiters = (areaNum * sprayRateNum) / 1000;
      tanksNeeded = Math.ceil(totalSolutionLiters / tank);
      totalConcentrate = tanksNeeded * concentratePerTank;
    }
    return { concentratePerTank, tanksNeeded, totalConcentrate, totalSolutionLiters };
  }, [rate, tank, area, sprayRate, hasInput]);

  return (
    <div aria-label="حاسبة جرعة وتخفيف المبيد">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" /> حسب ملصق منتجك
        </span>
      </div>

      <div className="tool-v2-field">
        <label>شكل المبيد</label>
        <div className="tool-v2-choice-list">
          {FORMS.map((f) => {
            const Icon = f.icon;
            const active = formId === f.id;
            return (
              <label key={f.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`form-${f.id}`}>
                <input type="radio" id={`form-${f.id}`} name="pesticide-form" checked={active} onChange={() => setFormId(f.id)} />
                <span className={`tool-v2-choice-icon tool-v2-choice-icon--${f.color}`} aria-hidden="true">
                  <Icon size={18} weight="bold" />
                </span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{f.label}</span>
                  <span className="tool-v2-choice-desc">{f.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dosage-rate">
          معدل الجرعة من ملصق منتجك ({form.unit} لكل لتر ماء)
          <FieldHint text="الملصق هو القانون — استخدم الرقم المكتوب فعلياً على عبوة المبيد الذي تستخدمه، لا رقماً عاماً." />
        </label>
        <input id="dosage-rate" type="number" inputMode="decimal" min="0" step="0.1" placeholder="مثلاً 5" value={dosageRate} onChange={(e) => setDosageRate(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>سعة خزان الرشاش (لتر)</label>
        <div className="guide-v2-checker-options" role="group" aria-label="سعة الخزان">
          {TANK_SIZES.map((s) => (
            <button key={s} type="button" className={`guide-v2-checker-chip${Number(tankSize) === s ? ' is-active' : ''}`} aria-pressed={Number(tankSize) === s} onClick={() => setTankSize(String(s))}>
              {s} لتر
            </button>
          ))}
        </div>
        <input id="tank-size" type="number" inputMode="decimal" min="0" step="0.5" value={tankSize} onChange={(e) => setTankSize(e.target.value)} aria-label="سعة خزان مخصصة" style={{ marginTop: 8 }} />
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="dosage-area">المساحة المراد رشها (م² — اختياري)</label>
          <input id="dosage-area" type="number" inputMode="decimal" min="0" step="1" value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="spray-rate">
            معدل الرش (مل محلول/م²)
            <FieldHint text="قيمة مبدئية شائعة للرش الخفيف العام — عدّلها حسب إرشادات المبيد ونوع الرشاش المستخدم." />
          </label>
          <input id="spray-rate" type="number" inputMode="decimal" min="0" step="10" value={sprayRate} onChange={(e) => setSprayRate(e.target.value)} />
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">كمية المركّز لكل خزان كامل</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{fmt(result.concentratePerTank, result.concentratePerTank < 10 ? 1 : 0)}</span>
                <span className="tool-v2-result-stat-label">{form.unit}</span>
              </span>
              <span className="tool-v2-result-stat-sep" aria-hidden="true">×</span>
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{fmt(tank)}</span>
                <span className="tool-v2-result-stat-label">لتر خزان</span>
              </span>
            </div>
          </div>

          {result.tanksNeeded !== null ? (
            <div className="tool-v2-breakdown-list">
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label">إجمالي محلول الرش اللازم</span>
                <span className="tool-v2-breakdown-value">{fmt(result.totalSolutionLiters, 1)} لتر</span>
              </div>
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label">عدد خزانات الرشاش الكاملة</span>
                <span className="tool-v2-breakdown-value">{result.tanksNeeded}</span>
              </div>
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label">إجمالي المركّز المطلوب لكل المساحة</span>
                <span className="tool-v2-breakdown-value">{fmt(result.totalConcentrate, 1)} {form.unit}</span>
              </div>
            </div>
          ) : null}

          <div className="tool-v2-note-strip">
            <ShieldWarning size={15} weight="fill" />
            <span>هذه أداة حسابية مساعدة فقط — الملصق المطبوع على عبوة المبيد هو المرجع الملزم دائماً لمعدل الجرعة وتعليمات السلامة.</span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل معدل الجرعة من ملصق منتجك وسعة الخزان.</p>
        </div>
      )}
    </div>
  );
}

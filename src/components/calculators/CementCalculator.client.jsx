"use client";

import { useState } from 'react';
import { Drop, Info, Mountains, Share as ShareIcon, Warning, Waves } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MIX_GRADES, calcConcrete, fmt } from '@/lib/calculators/building/constants';

const GRADE_META = {
  M15: { color: 'blue', desc: 'أعمال بسيطة وغير إنشائية — أرضيات وممرات خفيفة.' },
  M20: { color: 'green', desc: 'الاختيار الأنسب للمباني السكنية العادية — أعمدة وكمرات.', badge: 'الأكثر استخداماً' },
  M25: { color: 'amber', desc: 'أساسات وقواعد تتحمل وزناً أكبر.' },
  M30: { color: 'red', desc: 'منشآت ثقيلة وجسور تحتاج متانة عالية.' },
};

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

export default function CementCalculator() {
  const [volumeM3, setVolumeM3] = useState('10');
  const [grade, setGrade] = useState('M20');
  const [bagWeight, setBagWeight] = useState(50);
  const [wastePct, setWastePct] = useState('5');

  const volume = Math.max(0, Number(volumeM3) || 0);
  const waste = Math.max(0, Number(wastePct) || 0);
  const hasInput = volume > 0;
  const result = hasInput ? calcConcrete(volume, grade, bagWeight, waste / 100) : null;
  const selectedGrade = MIX_GRADES.find((g) => g.key === grade);

  const shareText = result
    ? `حاسبة الأسمنت: ${fmt(result.bags)} كيس (${fmt(result.cementKg)} كجم) لخرسانة ${volume} م³ — عيار ${selectedGrade?.label}`
    : '';

  return (
    <div aria-label="حاسبة الأسمنت والخرسانة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><span className="tool-v2-live-dot" aria-hidden="true" /> للصبات الخرسانية</span>
      </div>

      <div className="tool-v2-note-strip">
        <Info size={15} weight="fill" />
        <span>مخصصة لخرسانة الصبات (الأسمنت والرمل والحصى والماء). للمونة أو اللياسة، استخدم النتيجة كمرجع عام فقط.</span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="cement-volume">
          حجم الخرسانة (م³)
          <FieldHint text="الطول × العرض × السماكة بعد تحويل كل الأبعاد إلى متر." />
        </label>
        <input
          id="cement-volume"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.1"
          value={volumeM3}
          onChange={(e) => setVolumeM3(e.target.value)}
          placeholder="10"
        />
      </div>

      <div className="tool-v2-field">
        <label>
          عيار الخرسانة
          <FieldHint text="اختر العيار حسب نوع العنصر الإنشائي (قاعدة، عمود، سقف) لا حسب السعر فقط." />
        </label>
        <div className="tool-v2-choice-list">
          {MIX_GRADES.map((g) => {
            const meta = GRADE_META[g.key];
            const active = grade === g.key;
            return (
              <label key={g.key} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`grade-${g.key}`}>
                <input
                  type="radio"
                  id={`grade-${g.key}`}
                  name="concrete-grade"
                  checked={active}
                  onChange={() => setGrade(g.key)}
                />
                <span className={`tool-v2-choice-icon tool-v2-choice-icon--${meta.color}`} aria-hidden="true">
                  <Mountains size={18} weight="bold" />
                </span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">
                    {g.label}
                    {meta.badge ? <span className="tool-v2-choice-badge">{meta.badge}</span> : null}
                  </span>
                  <span className="tool-v2-choice-desc">{meta.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="cement-bag">وزن الكيس (كجم)</label>
          <select id="cement-bag" value={bagWeight} onChange={(e) => setBagWeight(Number(e.target.value))}>
            <option value={50}>50 كجم (قياسي)</option>
            <option value={42.5}>42.5 كجم</option>
          </select>
        </div>
        <div className="tool-v2-field">
          <label htmlFor="cement-waste">
            نسبة الهدر (%)
            <FieldHint text="هامش إضافي لتغطية النقل والانسكاب — 5% يكفي لصبة صغيرة منظمة، 10% أنسب لموقع أصعب." />
          </label>
          <input
            id="cement-waste"
            type="number"
            inputMode="decimal"
            min="0"
            max="30"
            value={wastePct}
            onChange={(e) => setWastePct(e.target.value)}
          />
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">إجمالي الأسمنت</span>
            <div className="tool-v2-result-value">{fmt(result.bags)} كيس</div>
            <div className="tool-v2-result-meta">{fmt(result.cementKg)} كجم — {selectedGrade?.label}</div>
          </div>

          <div className="tool-v2-mini-block-head">
            <span>بقية مكونات الخلطة</span>
          </div>
          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-icon tool-v2-breakdown-icon--amber"><Waves size={14} weight="bold" /></span>
              <span className="tool-v2-breakdown-label">الرمل</span>
              <span className="tool-v2-breakdown-value">{fmt(result.sandM3, 1)} م³</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-icon tool-v2-breakdown-icon--blue"><Mountains size={14} weight="bold" /></span>
              <span className="tool-v2-breakdown-label">الحصى / الزلط</span>
              <span className="tool-v2-breakdown-value">{fmt(result.gravelM3, 1)} م³</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-icon tool-v2-breakdown-icon--green"><Drop size={14} weight="bold" /></span>
              <span className="tool-v2-breakdown-label">الماء</span>
              <span className="tool-v2-breakdown-value">{fmt(result.waterL)} لتر</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل حجم خرسانة أكبر من صفر.</p>
        </div>
      )}

      <div className="tool-v2-action-row">
        <button
          type="button"
          className="tool-v2-action-btn is-primary"
          onClick={() => shareResult('حاسبة الأسمنت والخرسانة', shareText)}
          disabled={!result}
        >
          <ShareIcon size={18} weight="bold" /> مشاركة
        </button>
      </div>
    </div>
  );
}

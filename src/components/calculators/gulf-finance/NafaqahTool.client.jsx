"use client";

import { useMemo, useState } from 'react';
import { Info, Scales, ShareNetwork, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { computeNafaqahEstimate } from '@/lib/calculators/nafaqah';

function formatSar(value) {
  return `${Math.round(value).toLocaleString('ar-SA-u-nu-latn')} ريال`;
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function NafaqahTool() {
  const [incomeInput, setIncomeInput] = useState('');
  const [debtsInput, setDebtsInput] = useState('');
  const [childrenInput, setChildrenInput] = useState('1');
  const [includeWife, setIncludeWife] = useState('yes');

  const income = parseFloat(incomeInput.replace(/,/g, '')) || 0;
  const debts = parseFloat(debtsInput.replace(/,/g, '')) || 0;
  const children = parseInt(childrenInput, 10) || 0;

  const result = useMemo(() => {
    if (income <= 0) return null;
    return computeNafaqahEstimate({
      payerMonthlyIncome: income,
      monthlyDebts: debts,
      childrenCount: children,
      includeWifeMaintenance: includeWife === 'yes',
    });
  }, [income, debts, children, includeWife]);

  const shareText = result ? `تقدير النفقة الشهرية: ${formatSar(result.totalLow)} — ${formatSar(result.totalHigh)}` : '';

  return (
    <div aria-label="حاسبة تقدير النفقة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Scales size={14} weight="bold" /> تقدير تقريبي <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="nafaqah-income">الدخل الشهري للمنفق (ريال)</label>
        <input id="nafaqah-income" type="text" inputMode="decimal" placeholder="مثال: 8000" value={incomeInput} onChange={(e) => setIncomeInput(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="nafaqah-debts">الالتزامات الشهرية الثابتة (أقساط، إيجار، ديون)</label>
        <input id="nafaqah-debts" type="text" inputMode="decimal" placeholder="مثال: 1500 (اتركه فارغاً إن لم يوجد)" value={debtsInput} onChange={(e) => setDebtsInput(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="nafaqah-children">عدد الأولاد المستحقين للنفقة</label>
        <input id="nafaqah-children" type="number" inputMode="numeric" min="0" max="15" value={childrenInput} onChange={(e) => setChildrenInput(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>هل تشمل التقدير نفقة الزوجة؟</label>
        <div className="tool-v2-option-list">
          <label className={`tool-v2-option-row${includeWife === 'yes' ? ' is-active' : ''}`} htmlFor="nafaqah-wife-yes">
            <input type="radio" id="nafaqah-wife-yes" name="nafaqah-wife" checked={includeWife === 'yes'} onChange={() => setIncludeWife('yes')} />
            <span>نعم</span>
          </label>
          <label className={`tool-v2-option-row${includeWife === 'no' ? ' is-active' : ''}`} htmlFor="nafaqah-wife-no">
            <input type="radio" id="nafaqah-wife-no" name="nafaqah-wife" checked={includeWife === 'no'} onChange={() => setIncludeWife('no')} />
            <span>لا</span>
          </label>
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">إجمالي النفقة الشهرية التقديرية</span>
            <div className="tool-v2-result-value" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)' }}>{formatSar(result.totalLow)} — {formatSar(result.totalHigh)}</div>
            <div className="tool-v2-result-meta">
              {result.children > 0 ? `نفقة الأولاد: ${formatSar(result.childLow)} — ${formatSar(result.childHigh)}. ` : ''}
              {result.includeWifeMaintenance ? `نفقة الزوجة: ${formatSar(result.wifeLow)} — ${formatSar(result.wifeHigh)}.` : ''}
            </div>
          </div>

          {result.isCapped ? (
            <div className="tool-v2-note-strip">
              <Warning size={15} weight="fill" />
              <span>تم تقييد الحد الأعلى تلقائياً بحيث لا يتجاوز 50% من إجمالي دخل المنفق ({formatSar(result.cap)}).</span>
            </div>
          ) : null}

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>القاضي هو من يحدد المبلغ النهائي فعلياً بناءً على تفاصيل القضية الكاملة (حالة المنفق المادية، مصادر دخله الأخرى، سكنه، وظروف الأسرة تحديداً) — هذه الأداة تعطيك نطاقاً تقريبياً للتخطيط فقط، وليست بديلاً عن استشارة قانونية أو حكم المحكمة.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة تقدير النفقة', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Scales size={28} weight="duotone" />
          <p>أدخل الدخل الشهري لعرض النطاق التقديري للنفقة.</p>
        </div>
      )}
    </div>
  );
}

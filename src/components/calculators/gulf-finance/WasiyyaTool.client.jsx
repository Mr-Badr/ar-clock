"use client";

import { useMemo, useState } from 'react';
import { Info, Scales, ShareNetwork, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { computeWasiyya } from '@/lib/calculators/wasiyya';

const CURRENCIES = [
  { id: 'SAR', label: 'ريال سعودي' },
  { id: 'AED', label: 'درهم إماراتي' },
  { id: 'KWD', label: 'دينار كويتي' },
  { id: 'QAR', label: 'ريال قطري' },
  { id: 'EGP', label: 'جنيه مصري' },
];

function formatMoney(value, currency) {
  return value.toLocaleString('ar-SA-u-nu-latn', { style: 'currency', currency, maximumFractionDigits: 0 });
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function WasiyyaTool() {
  const [currency, setCurrency] = useState('SAR');
  const [netEstateInput, setNetEstateInput] = useState('');
  const [desiredBequestInput, setDesiredBequestInput] = useState('');

  const netEstate = parseFloat(netEstateInput.replace(/,/g, '')) || 0;
  const desiredBequest = parseFloat(desiredBequestInput.replace(/,/g, '')) || 0;

  const result = useMemo(() => {
    if (netEstate <= 0) return null;
    return computeWasiyya({ netEstate, desiredBequest });
  }, [netEstate, desiredBequest]);

  const shareText = result ? `أقصى ما يجوز أن توصي به: ${formatMoney(result.oneThird, currency)}` : '';

  return (
    <div aria-label="حاسبة الوصية الشرعية">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Scales size={14} weight="bold" /> الحد الأقصى للوصية <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="wasiyya-currency">العملة</label>
        <select id="wasiyya-currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {CURRENCIES.map((cur) => (<option key={cur.id} value={cur.id}>{cur.label}</option>))}
        </select>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="wasiyya-estate">صافي التركة (بعد الديون ومصاريف الجنازة)</label>
        <input id="wasiyya-estate" type="text" inputMode="decimal" placeholder="مثال: 900000" value={netEstateInput} onChange={(e) => setNetEstateInput(e.target.value)} />
        <p className="tool-v2-field-hint">نفس قيمة "التركة الإجمالية" المستخدمة في حاسبة الميراث — أصولك مطروحاً منها ديونك ومصاريف تجهيزك ودفنك.</p>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="wasiyya-desired">المبلغ الذي ترغب في الوصية به (اختياري)</label>
        <input id="wasiyya-desired" type="text" inputMode="decimal" placeholder="مثال: 200000" value={desiredBequestInput} onChange={(e) => setDesiredBequestInput(e.target.value)} />
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">أقصى ما يجوز أن توصي به (ثلث التركة)</span>
            <div className="tool-v2-result-value">{formatMoney(result.oneThird, currency)}</div>
            <div className="tool-v2-result-meta">الثلثان الباقيان ({formatMoney(result.twoThirds, currency)}) حق ثابت للورثة الشرعيين ولا يجوز التصرف فيهما بالوصية.</div>
          </div>

          {result.hasDesired ? (
            <div className="tool-v2-note-strip">
              {result.isWithinLimit ? <Info size={15} weight="fill" /> : <Warning size={15} weight="fill" />}
              <span>
                {result.isWithinLimit
                  ? `المبلغ الذي حددته (${formatMoney(result.desired, currency)}) لا يتجاوز الثلث، فتنفذ الوصية به كاملاً دون الحاجة لموافقة الورثة.`
                  : `المبلغ الذي حددته (${formatMoney(result.desired, currency)}) يتجاوز الثلث بمقدار ${formatMoney(result.excessAmount, currency)}. تُنفَّذ الوصية في حدود الثلث (${formatMoney(result.oneThird, currency)}) تلقائياً، أما الزيادة فلا تنفذ إلا برضا جميع الورثة البالغين الرشداء بعد الوفاة.`}
              </span>
            </div>
          ) : null}

          <div className="tool-v2-note-strip">
            <Scales size={15} weight="fill" />
            <span>عن سعد بن أبي وقاص رضي الله عنه أن النبي ﷺ قال له لما أراد أن يوصي بأكثر من الثلث: "الثلث، والثلث كثير؛ إنك أن تذر ورثتك أغنياء خير من أن تذرهم عالة يتكففون الناس" (متفق عليه). والوصية لوارث شرعي أصلاً لا تصح إلا برضا باقي الورثة، بصرف النظر عن المبلغ.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة الوصية الشرعية', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Scales size={28} weight="duotone" />
          <p>أدخل صافي قيمة التركة لعرض الحد الأقصى المسموح للوصية.</p>
        </div>
      )}
    </div>
  );
}

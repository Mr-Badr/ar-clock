"use client";

import { useMemo, useState } from 'react';
import { Baby, ShareNetwork, Sparkle } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { computeAqiqahCost, PRICE_TIERS } from '@/lib/calculators/aqiqah';

const AMOUNT_FORMATTER = new Intl.NumberFormat('ar-SA-u-nu-latn');

function formatSar(value) {
  return `${AMOUNT_FORMATTER.format(Math.round(value))} ريال`;
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function AqiqahTool() {
  const [boys, setBoys] = useState('1');
  const [girls, setGirls] = useState('0');
  const [tierId, setTierId] = useState('standard');

  const result = useMemo(() => {
    try { return computeAqiqahCost({ boys, girls, tierId }); }
    catch { return null; }
  }, [boys, girls, tierId]);

  const shareText = result
    ? `تكلفة العقيقة: ${result.totalSheep} ${result.totalSheep === 1 ? 'رأس' : 'رؤوس'} — ${formatSar(result.totalCost)}`
    : '';

  return (
    <div aria-label="حاسبة تكلفة العقيقة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Baby size={14} weight="bold" /> السعودية — أسعار السوق <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="aqiqah-boys">عدد الذكور</label>
          <input id="aqiqah-boys" type="number" inputMode="numeric" min="0" max="10" value={boys} onChange={(e) => setBoys(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="aqiqah-girls">عدد الإناث</label>
          <input id="aqiqah-girls" type="number" inputMode="numeric" min="0" max="10" value={girls} onChange={(e) => setGirls(e.target.value)} />
        </div>
      </div>
      <p className="tool-v2-field-hint">للتوأم أو أكثر من مولود، أدخل العدد الفعلي لكل جنس.</p>

      <div className="tool-v2-field">
        <label>مستوى السعر</label>
        <div className="tool-v2-option-list">
          {PRICE_TIERS.map((tier) => (
            <label key={tier.id} className={`tool-v2-option-row${tierId === tier.id ? ' is-active' : ''}`} htmlFor={`aqiqah-tier-${tier.id}`}>
              <input type="radio" id={`aqiqah-tier-${tier.id}`} name="aqiqah-tier" checked={tierId === tier.id} onChange={() => setTierId(tier.id)} />
              <span>{tier.label}<span className="tool-v2-option-hint">{formatSar(tier.pricePerHead)} للرأس — {tier.note}</span></span>
            </label>
          ))}
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">
              {result.totalSheep} {result.totalSheep === 1 ? 'رأس' : 'رؤوس'} مطلوبة
              {result.boysCount > 0 && result.girlsCount > 0 ? ` (${result.sheepForBoys} للذكور + ${result.sheepForGirls} للإناث)` : ''}
            </span>
            <div className="tool-v2-result-value">{formatSar(result.totalCost)}</div>
            <div className="tool-v2-result-meta">بمستوى "{result.tier.label}" — نطاق كامل: {formatSar(result.costRange.min)} إلى {formatSar(result.costRange.max)}</div>
          </div>

          <div className="tool-v2-note-strip">
            <Sparkle size={15} weight="fill" />
            <span>العقيقة عن المولود الذكر شاتان، وعن الأنثى شاة واحدة (حديث عائشة رضي الله عنها، رواه الترمذي وأبو داود). الأفضل ذبحها في اليوم السابع من الولادة، فإن تعذر ففي الرابع عشر أو الحادي والعشرين، ولا حرج في تأخيرها بعد ذلك.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة تكلفة العقيقة', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Baby size={28} weight="duotone" />
          <p>أدخل عدد المواليد لعرض عدد الذبائح والتكلفة التقديرية.</p>
        </div>
      )}
    </div>
  );
}

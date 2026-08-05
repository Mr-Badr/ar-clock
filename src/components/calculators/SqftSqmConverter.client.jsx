"use client";

import { useState } from 'react';
import { ArrowsLeftRight, Share as ShareIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { COMMON_SQFT_VALUES, fmt, sqftToSqm, sqmToSqft } from '@/lib/calculators/building/constants';

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

export default function SqftSqmConverter() {
  const [direction, setDirection] = useState('sqft-to-sqm');
  const [value, setValue] = useState('1000');

  const num = Math.max(0, Number(value) || 0);
  const isSqftToSqm = direction === 'sqft-to-sqm';
  const result = isSqftToSqm ? sqftToSqm(num) : sqmToSqft(num);
  const hasInput = num > 0;

  const fromUnit = isSqftToSqm ? 'قدم²' : 'م²';
  const toUnit = isSqftToSqm ? 'م²' : 'قدم²';

  const shareText = hasInput
    ? `${fmt(num)} ${fromUnit} = ${fmt(result, 2)} ${toUnit}`
    : '';

  function toggleDirection() {
    setDirection((d) => (d === 'sqft-to-sqm' ? 'sqm-to-sqft' : 'sqft-to-sqm'));
  }

  return (
    <div aria-label="محول قدم مربع ومتر مربع">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" /> تحويل دقيق 100%
        </span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sqft-sqm-value">القيمة بـ{fromUnit}</label>
        <input
          id="sqft-sqm-value"
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="1000"
        />
      </div>

      <button type="button" className="tool-v2-swap-btn" onClick={toggleDirection}>
        <span className="tool-v2-swap-btn-icon" aria-hidden="true">
          <ArrowsLeftRight size={13} weight="bold" />
        </span>
        عكس الاتجاه — التحويل من {toUnit} إلى {fromUnit}
      </button>

      {hasInput ? (
        <div className="tool-v2-result-hero" aria-live="polite" style={{ marginTop: 'var(--space-4)' }}>
          <span className="tool-v2-result-label">النتيجة</span>
          <div className="tool-v2-result-value">{fmt(result, 2)} {toUnit}</div>
          <div className="tool-v2-result-meta">{fmt(num)} {fromUnit} = {fmt(result, 2)} {toUnit}</div>
        </div>
      ) : null}

      <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-5)' }}>
        <span>القيم الأكثر بحثاً</span>
      </div>
      <div className="tool-v2-table-wrap">
        <table className="tool-v2-table">
          <thead>
            <tr><th>قدم مربع</th><th>متر مربع</th></tr>
          </thead>
          <tbody>
            {COMMON_SQFT_VALUES.map((sqft) => (
              <tr key={sqft}>
                <td>{fmt(sqft)}</td>
                <td>{fmt(sqftToSqm(sqft), 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tool-v2-action-row">
        <button
          type="button"
          className="tool-v2-action-btn is-primary"
          onClick={() => shareResult('محول قدم مربع ومتر مربع', shareText)}
          disabled={!hasInput}
        >
          <ShareIcon size={18} weight="bold" /> مشاركة
        </button>
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { Drop, Warning } from '@phosphor-icons/react';
import { calculateEgyptWaterBill } from '@/lib/calculators/electricity-bill';
import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

function fmt(n, dec = 2) {
  return n.toLocaleString('ar-EG-u-nu-latn', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

const PRESETS = [
  { label: 'شخص واحد',   m3: 4  },
  { label: 'أسرة صغيرة', m3: 10 },
  { label: 'أسرة متوسطة', m3: 18 },
  { label: 'أسرة كبيرة', m3: 28 },
];

export default function EgyptWaterBillCalculator() {
  const [m3Input, setM3Input] = useState('');

  const m3     = parseFloat(m3Input) || 0;
  const result = useMemo(() => (m3 > 0 ? calculateEgyptWaterBill(m3) : null), [m3]);

  const shareText = result
    ? `فاتورة المياه مصر\nالاستهلاك: ${m3} م³\nإجمالي الفاتورة: ${fmt(result.total)} ج.م`
    : '';

  return (
    <div className="calc-app eg-water-tool" aria-label="حاسبة فاتورة المياه مصر">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="eg-water-m3">الاستهلاك الشهري (متر مكعب)</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="eg-water-m3"
                    inputMode="decimal"
                    value={m3Input}
                    onChange={(e) => setM3Input(e.target.value)}
                    placeholder="15"
                  />
                  <span className="calc-esb-currency">م³</span>
                </div>
                <p className="calc-hint">الرقم موجود في فاتورة الشركة القابضة للمياه والصرف الصحي.</p>
              </div>

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>اختيار سريع</Label>
                </div>
                <div className="eg-elec-presets">
                  {PRESETS.map((p) => (
                    <button
                      key={p.m3}
                      className={`eg-elec-preset${m3 === p.m3 ? ' is-active' : ''}`}
                      onClick={() => setM3Input(String(p.m3))}
                      type="button"
                    >
                      <span className="eg-preset-label">{p.label}</span>
                      <span className="eg-preset-kwh">{p.m3} م³</span>
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--eg">🇪🇬 مصر</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">إجمالي فاتورة المياه الشهرية</span>
                <div className="calc-esb-amount-value">{fmt(result.total)} ج.م</div>
                <div className="calc-esb-amount-meta">
                  <span>{m3} م³ — شاملة الصرف الصحي والضريبة</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="calc-esb-breakdown">
                {result.tierBreakdown.map((t, i) => (
                  <div key={i} className="calc-esb-brow">
                    <span>
                      {t.from}–{t.to} م³
                      <span className="calc-hint"> × {fmt(t.rate, 2)} ج.م/م³</span>
                    </span>
                    <strong>{fmt(t.charge)} ج.م</strong>
                  </div>
                ))}
                <div className="calc-esb-brow">
                  <span>رسوم الصرف الصحي (65%)</span>
                  <strong>{fmt(result.sewageCharge)} ج.م</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>الرسم التنظيمي</span>
                  <strong>{fmt(result.regFee)} ج.م</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>ضريبة القيمة المضافة 14%</span>
                  <strong>{fmt(result.vat)} ج.م</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>الإجمالي</span>
                  <strong>{fmt(result.total)} ج.م</strong>
                </div>
              </div>

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>تقدير بناءً على تعريفة الشركة القابضة للمياه (HCWW) — تختلف أسعار المحافظات قليلاً.</span>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة فاتورة المياه مصر"
                shareText={shareText}
              />
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Drop size={32} weight="duotone" />
              <p>أدخل استهلاكك الشهري بالمتر المكعب أو اختر نموذجاً جاهزاً.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

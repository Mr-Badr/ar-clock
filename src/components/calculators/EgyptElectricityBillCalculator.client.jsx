'use client';

import { useMemo, useState } from 'react';
import { Lightning, Warning } from '@phosphor-icons/react';
import {
  calculateEgyptElectricityBill,
  getEgyptConsumptionCategory,
} from '@/lib/calculators/electricity-bill';
import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

function fmt(n, dec = 2) {
  return n.toLocaleString('ar-EG-u-nu-latn', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

const PRESETS = [
  { label: 'غرفة واحدة',    kwh: 50  },
  { label: 'شقة صغيرة',     kwh: 150 },
  { label: 'شقة عادية',     kwh: 300 },
  { label: 'شقة كبيرة',     kwh: 500 },
  { label: 'فيلا / منزل',   kwh: 900 },
];

export default function EgyptElectricityBillCalculator() {
  const [kWhInput, setKWhInput] = useState('');

  const kWh    = parseFloat(kWhInput) || 0;
  const result = useMemo(() => (kWh > 0 ? calculateEgyptElectricityBill(kWh) : null), [kWh]);
  const cat    = result ? getEgyptConsumptionCategory(kWh) : null;

  const shareText = result
    ? `فاتورة الكهرباء مصر\nالاستهلاك: ${kWh} kWh\nإجمالي الفاتورة: ${fmt(result.total)} ج.م`
    : '';

  return (
    <div className="calc-app eg-elec-tool" aria-label="حاسبة فاتورة الكهرباء مصر">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="eg-elec-kwh">الاستهلاك الشهري (كيلوواط ساعة)</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="eg-elec-kwh"
                    inputMode="decimal"
                    value={kWhInput}
                    onChange={(e) => setKWhInput(e.target.value)}
                    placeholder="300"
                  />
                  <span className="calc-esb-currency">kWh</span>
                </div>
                <p className="calc-hint">الرقم موجود في فاتورتك الشهرية من شركة توزيع الكهرباء.</p>
              </div>

              {/* Quick presets */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>اختيار سريع</Label>
                </div>
                <div className="eg-elec-presets">
                  {PRESETS.map((p) => (
                    <button
                      key={p.kwh}
                      className={`eg-elec-preset${kWh === p.kwh ? ' is-active' : ''}`}
                      onClick={() => setKWhInput(String(p.kwh))}
                      type="button"
                    >
                      <span className="eg-preset-label">{p.label}</span>
                      <span className="eg-preset-kwh">{p.kwh} kWh</span>
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
                {cat && (
                  <span className="eg-elec-cat" style={{ color: cat.color }}>{cat.label}</span>
                )}
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">إجمالي الفاتورة الشهرية</span>
                <div className="calc-esb-amount-value">{fmt(result.total)} ج.م</div>
                <div className="calc-esb-amount-meta">
                  <span>{kWh.toLocaleString('ar-EG-u-nu-latn')} كيلوواط ساعة</span>
                </div>
              </div>

              {/* Tier breakdown */}
              <div className="calc-esb-breakdown">
                {result.tierBreakdown.map((t, i) => (
                  <div key={i} className="calc-esb-brow">
                    <span>
                      {t.from}–{t.to} kWh
                      <span className="calc-hint"> × {fmt(t.rate, 2)} ج.م/kWh</span>
                    </span>
                    <strong>{fmt(t.charge)} ج.م</strong>
                  </div>
                ))}
                <div className="calc-esb-brow">
                  <span>رسوم الخدمة الثابتة</span>
                  <strong>{fmt(result.serviceCharge)} ج.م</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>الإجمالي (بدون ضريبة — معفى)</span>
                  <strong>{fmt(result.total)} ج.م</strong>
                </div>
              </div>

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>تقدير بناءً على تعريفة هيئة تنظيم الكهرباء (EGYPTERA) — راجع فاتورتك الفعلية للرقم الدقيق.</span>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة فاتورة الكهرباء مصر"
                shareText={shareText}
              />
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Lightning size={32} weight="duotone" />
              <p>أدخل استهلاكك الشهري بالكيلوواط ساعة أو اختر نموذجاً جاهزاً.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

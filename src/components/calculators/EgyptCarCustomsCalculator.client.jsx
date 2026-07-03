"use client";

import { useMemo, useState } from 'react';
import { Car, Warning } from '@phosphor-icons/react';
import {
  CC_OPTIONS,
  FUEL_TYPES,
  ORIGIN_TYPES,
  calculateEgyptCarCustoms,
} from '@/lib/calculators/egypt-car-customs';
import {
  CalcInput as Input,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

function fmt(n) {
  return Math.round(n).toLocaleString('ar-EG');
}

export default function EgyptCarCustomsCalculator() {
  const [carValue, setCarValue] = useState('500000');
  const [ccBand,   setCcBand]   = useState('le1600');
  const [origin,   setOrigin]   = useState('non-eu');
  const [fuelType, setFuelType] = useState('petrol');

  const result = useMemo(
    () => calculateEgyptCarCustoms({ carValue, ccBand, origin, fuelType }),
    [carValue, ccBand, origin, fuelType],
  );

  const isHybridOrEv = fuelType !== 'petrol';

  const shareText = result.isValid
    ? `جمارك السيارة (مصر):\nقيمة CIF: ${fmt(result.cif)} ج.م\nإجمالي الرسوم: ${fmt(result.totalDuties)} ج.م\nتكلفة الاستيراد الكاملة: ${fmt(result.total)} ج.م\nالنسبة الفعلية: ${result.effectiveRate}%`
    : '';

  return (
    <div className="calc-app egypt-customs-tool" aria-label="حاسبة جمارك السيارات مصر">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Car value */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="ec-value">قيمة السيارة (CIF)</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="ec-value"
                    inputMode="numeric"
                    value={carValue}
                    onChange={(e) => setCarValue(e.target.value)}
                    placeholder="500000"
                  />
                  <span className="calc-esb-currency">ج.م</span>
                </div>
                <p className="calc-hint">سعر الشراء + الشحن + التأمين حتى ميناء الوصول (CIF). إذا كنت تشتري من الخارج، اجمع ثمن السيارة + تكلفة الشحن + التأمين.</p>
              </div>

              {/* Fuel type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>نوع الوقود</Label>
                </div>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FUEL_TYPES.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isHybridOrEv && (
                  <p className="calc-hint ci-hint-warning">
                    نظام الهجين/الكهربائي يختلف عن نظام المحرك العادي — تحقق من قرار الإعفاء الأحدث.
                  </p>
                )}
              </div>

              {/* CC band — petrol only */}
              {!isHybridOrEv && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">3</span>
                    <Label>حجم المحرك</Label>
                  </div>
                  <Select value={ccBand} onValueChange={setCcBand}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CC_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Origin */}
              {!isHybridOrEv && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">4</span>
                    <Label>بلد الصنع</Label>
                  </div>
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ORIGIN_TYPES.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {origin === 'eu' && (
                    <p className="calc-hint">
                      السيارات الأوروبية تستفيد من إعفاء جمركي 0% بموجب اتفاقية الشراكة مصر–الاتحاد الأوروبي.
                    </p>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--eg">🇪🇬 مصر</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">إجمالي تكلفة الاستيراد</span>
                <div className="calc-esb-amount-value">{fmt(result.total)} ج.م</div>
                <div className="calc-esb-amount-meta">
                  <span>الرسوم فقط: {fmt(result.totalDuties)} ج.م ({result.effectiveRate}% من القيمة)</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="calc-esb-breakdown">
                {result.breakdown.map((row) => (
                  <div key={row.label} className="calc-esb-brow">
                    <span>
                      {row.label}
                      <span className="calc-hint"> ({row.pct}%)</span>
                    </span>
                    <strong>{fmt(row.amount)} ج.م</strong>
                  </div>
                ))}
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>الإجمالي (CIF + جميع الرسوم)</span>
                  <strong>{fmt(result.total)} ج.م</strong>
                </div>
              </div>

              {/* EU saving highlight */}
              {origin === 'eu' && !isHybridOrEv && (
                <div className="calc-success" style={{ marginTop: 'var(--spacing-3)' }}>
                  وفّرت {fmt(result.cif * (ccBand === 'le1600' ? 0.40 : 1.35))} ج.م بفضل الإعفاء الجمركي الأوروبي.
                </div>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة جمارك السيارات مصر"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>الأرقام تقديرية — المصدر النهائي: مصلحة الجمارك المصرية. تحقق قبل الشراء.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Car size={32} weight="duotone" />
              <p>أدخل قيمة السيارة (CIF) لحساب الرسوم الجمركية.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

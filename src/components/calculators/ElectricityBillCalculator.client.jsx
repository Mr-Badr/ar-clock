'use client';

import { useState, useMemo } from 'react';
import {
  calculateSaudiElectricityBill,
  calculateUAEElectricityBill,
  formatBillAmount,
  getConsumptionCategory,
} from '@/lib/calculators/electricity-bill';

const COUNTRIES = [
  { id: 'sa', label: 'السعودية 🇸🇦', placeholder: '2000', unit: 'kWh' },
  { id: 'ae', label: 'الإمارات 🇦🇪', placeholder: '1500', unit: 'kWh' },
];

const PRESETS_SA = [800, 1500, 2500, 4000, 6000];
const PRESETS_AE = [500, 1000, 2000, 3500, 5000];

export default function ElectricityBillCalculator() {
  const [country, setCountry] = useState('sa');
  const [kWhInput, setKWhInput] = useState('');

  const kWh = parseFloat(kWhInput) || 0;

  const result = useMemo(() => {
    if (kWh <= 0) return null;
    return country === 'sa'
      ? calculateSaudiElectricityBill(kWh)
      : calculateUAEElectricityBill(kWh);
  }, [country, kWh]);

  const category = result ? getConsumptionCategory(kWh, country) : null;
  const presets = country === 'sa' ? PRESETS_SA : PRESETS_AE;

  function handleCountryChange(c) {
    setCountry(c);
    setKWhInput('');
  }

  return (
    <div className="electricity-calc space-y-5">
      {/* Country */}
      <div>
        <label className="block text-sm font-medium mb-2">الدولة</label>
        <div className="flex gap-2">
          {COUNTRIES.map(c => (
            <button
              key={c.id}
              onClick={() => handleCountryChange(c.id)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${country === c.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted border-border'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Consumption Input */}
      <div>
        <label className="block text-sm font-medium mb-2">استهلاك الشهر (kWh)</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            step="50"
            value={kWhInput}
            onChange={e => setKWhInput(e.target.value)}
            placeholder={`مثال: ${COUNTRIES.find(c => c.id === country)?.placeholder}`}
            className="w-full border rounded-lg px-3 py-2 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-16"
            dir="ltr"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">kWh</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          ستجد الاستهلاك مطبوعاً على فاتورتك أو في التطبيق الرسمي.
        </p>
      </div>

      {/* Presets */}
      <div>
        <label className="block text-xs text-muted-foreground mb-2">استهلاك شائع</label>
        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setKWhInput(String(p))}
              className={`px-3 py-1 rounded text-xs border transition-colors ${kWh === p ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted hover:bg-muted/70 border-border'}`}
            >
              {p.toLocaleString('ar-SA')} kWh
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-xl border overflow-hidden">
          {/* Total */}
          <div className="bg-primary/5 px-5 py-5 text-center border-b">
            <div className="text-xs text-muted-foreground mb-1">إجمالي الفاتورة المتوقعة</div>
            <div className="text-4xl font-bold text-primary tabular-nums">
              {formatBillAmount(result.total, result.currency)}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full" style={{ background: category.color + '20', color: category.color }}>
              <span>●</span> استهلاك {category.label}
            </div>
          </div>

          {/* Breakdown */}
          <div className="divide-y bg-card">
            {/* Tier breakdown */}
            {result.tierBreakdown.map((tier, i) => (
              <div key={i} className="flex justify-between items-center px-5 py-3 text-sm">
                <span className="text-muted-foreground">
                  {tier.consumed.toLocaleString('ar-SA')} kWh × {tier.rate} {result.currency}
                </span>
                <span className="font-medium">{formatBillAmount(tier.charge, result.currency)}</span>
              </div>
            ))}

            {result.distributionCharge > 0 && (
              <div className="flex justify-between items-center px-5 py-3 text-sm">
                <span className="text-muted-foreground">رسوم التوزيع</span>
                <span>{formatBillAmount(result.distributionCharge, result.currency)}</span>
              </div>
            )}

            {result.fuelSurcharge > 0 && (
              <div className="flex justify-between items-center px-5 py-3 text-sm">
                <span className="text-muted-foreground">رسوم الوقود (تقريبية)</span>
                <span>{formatBillAmount(result.fuelSurcharge, result.currency)}</span>
              </div>
            )}

            <div className="flex justify-between items-center px-5 py-3 text-sm">
              <span className="text-muted-foreground">رسوم الاشتراك الشهري</span>
              <span>{formatBillAmount(result.serviceCharge, result.currency)}</span>
            </div>

            <div className="flex justify-between items-center px-5 py-3 text-sm bg-muted/30">
              <span className="font-medium">المجموع قبل الضريبة</span>
              <span className="font-medium">{formatBillAmount(result.subtotal, result.currency)}</span>
            </div>

            <div className="flex justify-between items-center px-5 py-3 text-sm">
              <span className="text-muted-foreground">
                ضريبة القيمة المضافة ({country === 'sa' ? '15%' : '5%'})
              </span>
              <span>{formatBillAmount(result.vat, result.currency)}</span>
            </div>

            <div className="flex justify-between items-center px-5 py-4 font-bold bg-primary/5">
              <span>الإجمالي</span>
              <span className="text-primary text-lg">{formatBillAmount(result.total, result.currency)}</span>
            </div>
          </div>

          {/* UAE fuel note */}
          {result.fuelSurchargeNote && (
            <div className="px-5 py-3 text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/30 border-t border-amber-200">
              ⚠ {result.fuelSurchargeNote}
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      {result && kWh > 3000 && country === 'sa' && (
        <div className="text-xs bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 text-blue-800 dark:text-blue-300 space-y-1">
          <strong className="block">نصائح لتخفيض الفاتورة:</strong>
          <p>• استبدل مكيفات الهواء القديمة بأخرى ذات كفاءة ٥ نجوم (توفر حتى 40%)</p>
          <p>• اضبط الحرارة على 24°م بدلاً من 20°م (توفر 8% لكل درجة)</p>
          <p>• استخدم طباخ الغاز بدلاً من الكهربائي لتقليل الاستهلاك</p>
        </div>
      )}
    </div>
  );
}

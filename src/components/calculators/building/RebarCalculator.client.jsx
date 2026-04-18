'use client';

import { useState } from 'react';
import { Hash, Plus, Ruler, Scaling, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { calcRebarWeight, REBAR_DIAMETERS, REBAR_TYPICAL_USE, fmt } from '@/lib/calculators/building/constants';

export default function RebarCalculator() {
  const [diameter, setDiameter] = useState(16);
  const [lengthInputGroup, setLengthInputGroup] = useState([{ length: 1, count: 100 }]);

  const updateGroup = (index, field, val) => {
    const newGroups = [...lengthInputGroup];
    newGroups[index][field] = parseFloat(val) || 0;
    setLengthInputGroup(newGroups);
  };

  const addGroup = () => setLengthInputGroup([...lengthInputGroup, { length: 12, count: 1 }]);
  const removeGroup = (index) => {
    if (lengthInputGroup.length > 1) {
      const newGroups = [...lengthInputGroup];
      newGroups.splice(index, 1);
      setLengthInputGroup(newGroups);
    }
  };

  const totalLengthM = lengthInputGroup.reduce((acc, g) => acc + (g.length * g.count), 0);
  const results = calcRebarWeight(diameter, totalLengthM);

  return (
    <div
      className="calc-app-grid grid gap-8 lg:grid-cols-12"
      style={{ '--calc-accent': '#EF4444' }}
    >
      <div className="lg:col-span-5 space-y-6">
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title text-xl">مواصفات الحديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="calc-field">
              <div className="calc-field-row">
                <Label className="calc-label">قطر السيخ (ملم)</Label>
                <span className="calc-hint rounded-md bg-base px-2 py-1">
                  {REBAR_TYPICAL_USE[diameter]}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {REBAR_DIAMETERS.map((d) => (
                  <Button
                    key={d}
                    type="button"
                    onClick={() => setDiameter(d)}
                    variant="outline"
                    size="sm"
                    className={`calc-chip-button chip min-w-[56px] ${diameter === d ? 'is-active' : ''}`}
                  >
                    ⌀{d}
                  </Button>
                ))}
              </div>
              <p className="calc-hint">اختر القطر أولاً لأن وزن المتر الطولي يتغير مباشرة حسبه.</p>
            </div>

            <div className="calc-field">
              <div className="calc-field-row border-b border-accent/10 pb-2">
                <Label className="calc-label">أسياخ التقطيع</Label>
                <span className="calc-hint">أدخل الأطوال المختلفة وعدد كل طول</span>
              </div>

              <div className="space-y-3">
                {lengthInputGroup.map((group, index) => (
                  <div key={index} className="calc-grid-2 items-end rounded-2xl border border-accent/10 bg-base p-3">
                    <div className="calc-field">
                      <Label className="calc-label text-xs">الطول (متر)</Label>
                      <Input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={group.length}
                        onChange={(e) => updateGroup(index, 'length', e.target.value)}
                        className="calc-input text-center"
                      />
                    </div>
                    <div className="calc-field">
                      <Label className="calc-label text-xs">العدد</Label>
                      <Input
                        type="number"
                        min="1"
                        value={group.count}
                        onChange={(e) => updateGroup(index, 'count', e.target.value)}
                        className="calc-input text-center"
                      />
                    </div>
                    <div className="flex justify-end sm:col-span-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGroup(index)}
                        disabled={lengthInputGroup.length === 1}
                        className="calc-button"
                      >
                        <X size={16} />
                        حذف السطر
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={addGroup}
                variant="outline"
                className="calc-button w-full border-dashed"
              >
                <Plus size={16} />
                إضافة مقاس آخر
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <Card className="calc-result-card h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <CardHeader className="pb-2 border-b border-accent/10">
            <CardTitle className="calc-card-title text-base">الوزن النهائي</CardTitle>
          </CardHeader>

          <CardContent className="pt-8 space-y-8">
            <div className="flex flex-col items-center justify-center text-center">
              <h4 className="text-sm text-text-secondary font-medium mb-2">إجمالي الوزن</h4>
              <div className="flex items-end justify-center mb-2">
                <span className="text-5xl font-black text-primary mr-2" style={{ fontFamily: 'var(--font-ibm-plex-sans-arabic)' }}>
                  {fmt(results.totalKg, 1)}
                </span>
                <span className="text-xl text-text-secondary font-medium pb-1">كجم</span>
              </div>
              {results.totalTons >= 0.1 && (
                <div className="text-sm font-medium text-text-primary px-4 py-1 bg-accent/5 rounded-full inline-block">
                  أو {fmt(results.totalTons, 3)} طن
                </div>
              )}
            </div>

            <div className="calc-metric-grid calc-grid-2 mt-6 pt-6 border-t border-accent/10">
              <div className="calc-metric-card">
                <div className="calc-metric-card__label">
                  <Ruler size={15} />
                  إجمالي الأطوال الحقيقية
                </div>
                <div className="calc-metric-card__value">{fmt(totalLengthM, 1)} متر</div>
                <div className="calc-metric-card__note">مجموع كل أطوال الأسياخ قبل تحويلها إلى وزن.</div>
              </div>

              <div className="calc-metric-card">
                <div className="calc-metric-card__label">
                  <Hash size={15} />
                  يعادل (طول 12م القياسي)
                </div>
                <div className="calc-metric-card__value">{fmt(results.barsOf12m)} سيخ</div>
                <div className="calc-metric-card__note">تحويل تقريبي مفيد عند الشراء أو طلب التسعير.</div>
              </div>
            </div>

            <div className="calc-note">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <Scaling size={15} />
                  وزن المتر الطولي لقطر {diameter} ملم
                </span>
                <strong className="font-mono">{fmt(results.weightPerMeter, 3)} كجم/م</strong>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

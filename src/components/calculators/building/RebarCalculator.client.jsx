'use client';

import { useState } from 'react';
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
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5 space-y-6">
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title text-xl">مواصفات الحديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>قطر السيخ (ملم)</Label>
                <span className="text-xs text-text-secondary bg-base px-2 py-1 rounded-md">
                  {REBAR_TYPICAL_USE[diameter]}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {REBAR_DIAMETERS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiameter(d)}
                    className={`flex-1 min-w-[50px] py-2 px-1 rounded-lg text-sm font-bold transition-all border ${
                      diameter === d
                        ? 'border-primary bg-primary text-on-accent'
                        : 'border-accent/20 bg-accent/5 hover:bg-accent/10'
                    }`}
                  >
                    ⌀{d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-accent/10 pb-2">
                <Label>أسياخ التقطيع</Label>
              </div>

              <div className="space-y-3">
                {lengthInputGroup.map((group, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">الطول (متر)</Label>
                      <Input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={group.length}
                        onChange={(e) => updateGroup(index, 'length', e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <span className="mb-2 text-text-secondary">×</span>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">العدد</Label>
                      <Input
                        type="number"
                        min="1"
                        value={group.count}
                        onChange={(e) => updateGroup(index, 'count', e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <button
                      onClick={() => removeGroup(index)}
                      disabled={lengthInputGroup.length === 1}
                      className="h-10 px-3 flex items-center justify-center rounded-md bg-accent/10 hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-30"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={addGroup}
                className="w-full py-2 text-sm text-primary font-medium border border-primary border-dashed rounded-lg hover:bg-primary/5 transition-colors"
              >
                + إضافة مقاس آخر
              </button>
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

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-accent/10">
              <div className="flex flex-col justify-center p-4 bg-base rounded-xl border border-accent/10 text-center">
                <span className="text-xs text-text-secondary mb-1">إجمالي الأطوال الحقيقية</span>
                <span className="font-bold text-lg">{fmt(totalLengthM, 1)} متر</span>
              </div>
              
              <div className="flex flex-col justify-center p-4 bg-base rounded-xl border border-accent/10 text-center">
                <span className="text-xs text-text-secondary mb-1">يعادل (طول 12م القياسي)</span>
                <span className="font-bold text-lg">{fmt(results.barsOf12m)} سيخ</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg text-sm text-text-primary px-4">
              <span>وزن المتر الطولي لقطر {diameter} ملم</span>
              <span className="font-bold font-mono">{fmt(results.weightPerMeter, 3)} كجم/م</span>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

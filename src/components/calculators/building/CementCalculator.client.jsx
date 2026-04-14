'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calcConcrete, MIX_GRADES, fmt } from '@/lib/calculators/building/constants';

export default function CementCalculator() {
  const [tab, setTab] = useState('concrete'); // concrete, mortar, plaster
  const [volumeM3, setVolumeM3] = useState(10);
  const [grade, setGrade] = useState('M20');
  const [bagWeight, setBagWeight] = useState(50);
  const [wastePct, setWastePct] = useState(5);

  const results = calcConcrete(volumeM3, grade, bagWeight, wastePct / 100);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5 space-y-6">
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title text-xl">مدخلات الحساب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={tab} onValueChange={setTab} className="w-full" dir="rtl">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="concrete">خرسانة</TabsTrigger>
                <TabsTrigger value="mortar">مونة بناء</TabsTrigger>
                <TabsTrigger value="plaster">لياسة / بياض</TabsTrigger>
              </TabsList>

              <TabsContent value="concrete" className="space-y-6">
                <div className="space-y-2">
                  <Label>حجم الخرسانة (متر مكعب m³)</Label>
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={volumeM3}
                    onChange={(e) => setVolumeM3(parseFloat(e.target.value) || 0)}
                    className="font-bold text-lg"
                  />
                  <p className="text-xs text-text-secondary">الطول × العرض × السماكة</p>
                </div>

                <div className="space-y-2">
                  <Label>عيار الخرسانة (المتانة)</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder="اختر العيار" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      {MIX_GRADES.map((g) => (
                        <SelectItem key={g.key} value={g.key}>
                          <div className="flex flex-col text-right">
                            <span className="font-bold">{g.label}</span>
                            <span className="text-xs text-text-secondary">{g.use}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="mortar">
                <div className="p-4 bg-accent/10 rounded-lg text-center text-sm text-text-secondary">
                  قريباً: حاسبة مونة البناء التفصيلية (للطوب والبلك).
                </div>
              </TabsContent>

              <TabsContent value="plaster">
                <div className="p-4 bg-accent/10 rounded-lg text-center text-sm text-text-secondary">
                  قريباً: حاسبة اللياسة والبياض الداخلي والخارجي.
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-accent/10">
              <div className="space-y-2">
                <Label>وزن الكيس (كجم)</Label>
                <Select value={bagWeight.toString()} onValueChange={(val) => setBagWeight(parseInt(val))}>
                  <SelectTrigger dir="rtl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="50">50 كجم (قياسي)</SelectItem>
                    <SelectItem value="42.5">42.5 كجم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>نسبة الهدر (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={wastePct}
                  onChange={(e) => setWastePct(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <Card className="calc-result-card h-full">
          <CardHeader className="pb-2 border-b border-accent/10">
            <CardTitle className="calc-card-title text-base flex justify-between items-center">
              <span>الكميات المطلوبة</span>
              <span className="text-xs font-normal text-text-secondary bg-base px-2 py-1 rounded-md">
                شامل {wastePct}% هدر
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            
            <div className="text-center space-y-2">
              <h4 className="text-sm text-text-secondary font-medium">الأسمنت</h4>
              <div className="text-5xl font-black text-primary" style={{ fontFamily: 'var(--font-ibm-plex-sans-arabic)' }}>
                {fmt(results.bags)}
                <span className="text-xl text-text-secondary ml-2 font-medium">كيس</span>
              </div>
              <p className="text-sm font-medium text-text-primary px-3 py-1 bg-accent/5 rounded-full inline-block">
                الإجمالي: {fmt(results.cementKg)} كجم
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-base rounded-xl border border-accent/10">
                <span className="text-2xl mb-2">🏖️</span>
                <span className="text-xs text-text-secondary mb-1">الرمل</span>
                <span className="font-bold text-lg">{fmt(results.sandM3, 1)} م³</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 bg-base rounded-xl border border-accent/10">
                <span className="text-2xl mb-2">🪨</span>
                <span className="text-xs text-text-secondary mb-1">الحصى / الزلط</span>
                <span className="font-bold text-lg">{fmt(results.gravelM3, 1)} م³</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 bg-base rounded-xl border border-accent/10">
                <span className="text-2xl mb-2">💧</span>
                <span className="text-xs text-text-secondary mb-1">الماء</span>
                <span className="font-bold text-lg">{fmt(results.waterL)} لتر</span>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

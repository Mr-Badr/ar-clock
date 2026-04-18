'use client';

import { useState } from 'react';
import { Droplets, Package, Triangle, Waves } from 'lucide-react';
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
    <div
      className="calc-app-grid grid gap-8 lg:grid-cols-12"
      style={{ '--calc-accent': '#8B5CF6' }}
    >
      <div className="lg:col-span-5 space-y-6">
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title text-xl">مدخلات الحساب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={tab} onValueChange={setTab} className="w-full" dir="rtl">
              <TabsList className="calc-tabs-list mb-6 grid w-full grid-cols-3">
                <TabsTrigger value="concrete" className="calc-tabs-trigger">
                  <span className="calc-tabs-copy">
                    <span>خرسانة</span>
                    <span>الصبة والخلطة</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="mortar" className="calc-tabs-trigger">
                  <span className="calc-tabs-copy">
                    <span>مونة</span>
                    <span>قريباً</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="plaster" className="calc-tabs-trigger">
                  <span className="calc-tabs-copy">
                    <span>لياسة</span>
                    <span>قريباً</span>
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="concrete" className="calc-tabs-panel space-y-6">
                <div className="calc-field">
                  <Label className="calc-label">حجم الخرسانة (متر مكعب m³)</Label>
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={volumeM3}
                    onChange={(e) => setVolumeM3(parseFloat(e.target.value) || 0)}
                    className="calc-input text-lg font-bold"
                  />
                  <p className="calc-hint">الطول × العرض × السماكة بعد تحويل الأبعاد إلى متر.</p>
                </div>

                <div className="calc-field">
                  <Label className="calc-label">عيار الخرسانة (المتانة)</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger dir="rtl" className="calc-select-trigger">
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
                  <p className="calc-hint">اختر العيار بحسب نوع العنصر الإنشائي لا بحسب السعر فقط.</p>
                </div>
              </TabsContent>

              <TabsContent value="mortar" className="calc-tabs-panel">
                <div className="calc-note text-center">
                  قريباً: حاسبة مونة البناء التفصيلية (للطوب والبلك).
                </div>
              </TabsContent>

              <TabsContent value="plaster" className="calc-tabs-panel">
                <div className="calc-note text-center">
                  قريباً: حاسبة اللياسة والبياض الداخلي والخارجي.
                </div>
              </TabsContent>
            </Tabs>

            <div className="calc-grid-2 pt-4">
              <div className="calc-field">
                <Label className="calc-label">وزن الكيس (كجم)</Label>
                <Select value={bagWeight.toString()} onValueChange={(val) => setBagWeight(parseFloat(val))}>
                  <SelectTrigger dir="rtl" className="calc-select-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="50">50 كجم (قياسي)</SelectItem>
                    <SelectItem value="42.5">42.5 كجم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="calc-field">
                <Label className="calc-label">نسبة الهدر (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={wastePct}
                  onChange={(e) => setWastePct(parseFloat(e.target.value) || 0)}
                  className="calc-input"
                />
                <p className="calc-hint">أضف هامش هدر بسيط إذا كانت الصبة تتضمن نقل أو تقطيع أو ظروف تنفيذ أصعب.</p>
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
              <h4 className="text-sm text-text-secondary font-medium">إجمالي الأسمنت</h4>
              <div className="text-5xl font-black text-primary" style={{ fontFamily: 'var(--font-ibm-plex-sans-arabic)' }}>
                {fmt(results.bags)}
                <span className="text-xl text-text-secondary ml-2 font-medium">كيس</span>
              </div>
              <p className="text-sm font-medium text-text-primary px-3 py-1 bg-accent/5 rounded-full inline-block">
                الإجمالي: {fmt(results.cementKg)} كجم
              </p>
            </div>

            <div className="calc-metric-grid calc-grid-3">
              <div className="calc-metric-card">
                <div className="calc-metric-card__label">
                  <Waves size={15} />
                  الرمل
                </div>
                <div className="calc-metric-card__value">{fmt(results.sandM3, 1)} م³</div>
                <div className="calc-metric-card__note">الكمية التقديرية للرمل ضمن الخلطة المختارة.</div>
              </div>

              <div className="calc-metric-card">
                <div className="calc-metric-card__label">
                  <Triangle size={15} />
                  الحصى / الزلط
                </div>
                <div className="calc-metric-card__value">{fmt(results.gravelM3, 1)} م³</div>
                <div className="calc-metric-card__note">الكمية الحجمية التقديرية بعد إضافة الهدر.</div>
              </div>

              <div className="calc-metric-card">
                <div className="calc-metric-card__label">
                  <Droplets size={15} />
                  الماء
                </div>
                <div className="calc-metric-card__value">{fmt(results.waterL)} لتر</div>
                <div className="calc-metric-card__note">تقدير مبدئي قابل للتعديل حسب الرطوبة وظروف التنفيذ.</div>
              </div>
            </div>

            <div className="calc-note">
              <div className="calc-metric-card__label">
                <Package size={15} />
                ملاحظة تنفيذية
              </div>
              <div className="mt-2">
                هذه الحاسبة تعطيك تقديراً سريعاً قبل الشراء أو الطلب. إذا كانت الصبة إنشائية مهمة، فالمخطط والإشراف الهندسي يبقيان المرجع النهائي.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

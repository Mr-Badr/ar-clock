'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calcBuildingCost, FINISH_LEVELS, BUILDING_TYPES, formatCurrency, fmt } from '@/lib/calculators/building/constants';
import { COUNTRY_LIST, getCountryBySlug } from '@/lib/calculators/building/country-data';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

/**
 * Total Building Cost Calculator Client Component
 * Used in /calculators/building and /calculators/building/[country]
 */
export default function BuildingCostCalculator({ preSelectedCountrySlug = 'saudi-arabia' }) {
  // State
  const [countrySlug, setCountrySlug] = useState(preSelectedCountrySlug);
  const [areaM2, setAreaM2] = useState(250);
  const [floors, setFloors] = useState(2);
  const [finishLevel, setFinishLevel] = useState('standard');
  const [buildingType, setBuildingType] = useState('villa');
  const [regionMultiplier, setRegionMultiplier] = useState(1.0);

  // Derived Data
  const currentCountry = getCountryBySlug(countrySlug) || COUNTRY_LIST[0];

  const results = calcBuildingCost(
    areaM2,
    floors,
    finishLevel,
    currentCountry,
    buildingType,
    regionMultiplier
  );

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* ─── Controls Panel (Left/Top) ─────────────── */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title text-xl">مواصفات المبنى</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Country & Region Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الدولة</Label>
                <Select value={countrySlug} onValueChange={(val) => {
                  setCountrySlug(val);
                  // Reset region to default when country changes
                  setRegionMultiplier(1.0);
                }}>
                  <SelectTrigger dir="rtl">
                    <SelectValue placeholder="اختر الدولة" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {COUNTRY_LIST.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.flag} {c.nameShort}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>المنطقة / المدينة</Label>
                <Select
                  value={regionMultiplier.toString()}
                  onValueChange={(val) => setRegionMultiplier(parseFloat(val))}
                >
                  <SelectTrigger dir="rtl">
                    <SelectValue placeholder="اختر المنطقة" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {Object.entries(currentCountry.regions || {}).map(([key, data]) => (
                      <SelectItem key={key} value={data.m.toString()}>
                        {data.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Area Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>مساحة الطابق (م²)</Label>
                <span className="font-bold text-primary">{fmt(areaM2)} م²</span>
              </div>
              <Slider
                min={50}
                max={2000}
                step={10}
                value={[areaM2]}
                onValueChange={([val]) => setAreaM2(val)}
                className="py-4"
              />
            </div>

            {/* Floors */}
            <div className="space-y-2">
              <Label>عدد الطوابق</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={floors}
                  onChange={(e) => setFloors(parseInt(e.target.value) || 1)}
                  className="w-24 text-center font-bold"
                />
                <span className="text-sm text-text-secondary">أدوار</span>
              </div>
            </div>

            {/* Building Type */}
            <div className="space-y-2">
              <Label>نوع المبنى</Label>
              <div className="flex flex-wrap gap-2">
                {BUILDING_TYPES.map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setBuildingType(type.key)}
                    className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                      buildingType === type.key
                        ? 'bg-primary text-base font-bold shadow-sm'
                        : 'bg-accent/5 hover:bg-accent/10'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Finish Level */}
            <div className="space-y-2">
              <Label>مستوى التشطيب</Label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {FINISH_LEVELS.map((level) => (
                  <button
                    key={level.key}
                    onClick={() => setFinishLevel(level.key)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      finishLevel === level.key
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent bg-accent/5 hover:bg-accent/10'
                    }`}
                  >
                    <span className="text-2xl mb-1">{level.emoji}</span>
                    <span className="text-sm font-bold">{level.label}</span>
                    <span className="text-xs text-text-secondary">{level.subLabel}</span>
                  </button>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* ─── Results Panel (Right/Bottom) ──────────── */}
      <div className="lg:col-span-7 space-y-6">

        {/* Main Cost Highlight */}
        <Card className="calc-result-card relative overflow-hidden">
          {/* Subtle background glow based on finish level */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-lg font-medium text-text-secondary">التكلفة الإجمالية التقديرية</h3>
            
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl lg:text-5xl font-black text-primary" style={{ fontFamily: 'var(--font-ibm-plex-sans-arabic)' }}>
                {formatCurrency(results.midCost, currentCountry.symbol)}
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-3 text-sm text-text-secondary font-medium px-4 py-2 bg-base rounded-full">
                <span>تتراوح بين</span>
                <span className="font-bold text-text-primary">{fmt(results.minCost)}</span>
                <span>إلى</span>
                <span className="font-bold text-text-primary">{fmt(results.maxCost)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-accent/10">
              <div className="flex flex-col items-center">
                <span className="text-sm text-text-secondary">إجمالي المساحة المبنية</span>
                <span className="text-xl font-bold">{fmt(results.totalArea)} م²</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-text-secondary">متوسط تكلفة المتر</span>
                <span className="text-xl font-bold">{formatCurrency(results.costPerM2Mid, currentCountry.symbol)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Chart & Table */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="calc-surface-card">
            <CardHeader className="pb-2">
              <CardTitle className="calc-card-title text-base text-center">توزيع التكلفة</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={results.breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {results.breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value, currentCountry.symbol)}
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'white', color: 'black', boxShadow: 'var(--shadow-md)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="calc-surface-card">
            <CardHeader className="pb-2">
              <CardTitle className="calc-card-title text-base text-center">تفصيل بنود العمل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                {results.breakdown.map((item, index) => (
                  <div key={item.key} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `var(--chart-${(index % 5) + 1})` }} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold">{formatCurrency(item.value, '')}</span>
                      <span className="text-xs text-text-secondary">{item.pct}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Estimates (Cement & Rebar) */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="calc-surface-card bg-accent/5 border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-xl mb-2">🧱</div>
              <span className="text-sm text-text-secondary mb-1">الأسمنت (تقديري)</span>
              <span className="text-xl font-bold">{fmt(results.cementBags)} {currentCountry.cementUnit}</span>
            </CardContent>
          </Card>
          
          <Card className="calc-surface-card bg-accent/5 border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-xl mb-2">🏗️</div>
              <span className="text-sm text-text-secondary mb-1">الحديد (تقديري)</span>
              <span className="text-xl font-bold">{fmt(results.rebarTons, 1)} {currentCountry.rebarUnit}</span>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

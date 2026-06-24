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
export default function BuildingCostCalculator({ preSelectedCountrySlug }) {
  const safeCountries = Array.isArray(COUNTRY_LIST) ? COUNTRY_LIST : [];
  const resolvedCountrySlug = preSelectedCountrySlug ?? 'saudi-arabia';
  // State
  const [countrySlug, setCountrySlug] = useState(resolvedCountrySlug);
  const [areaM2, setAreaM2] = useState(250);
  const [floors, setFloors] = useState(2);
  const [finishLevel, setFinishLevel] = useState('standard');
  const [buildingType, setBuildingType] = useState('villa');
  const [regionMultiplier, setRegionMultiplier] = useState(1.0);

  // Derived Data
  const currentCountry = getCountryBySlug(countrySlug) || safeCountries[0];

  if (!currentCountry) {
    return (
      <div className="calc-warning" role="status">
        لا توجد بيانات دول كافية لتشغيل حاسبة تكلفة البناء الآن. يمكنك الرجوع إلى شرح الصفحة، ثم إعادة المحاولة عند اكتمال بيانات السوق.
      </div>
    );
  }

  const results = calcBuildingCost(
    areaM2,
    floors,
    finishLevel,
    currentCountry,
    buildingType,
    regionMultiplier
  );
  const safeBreakdown = Array.isArray(results?.breakdown) ? results.breakdown : [];

  return (
    <div className="calc-app-grid calc-building-tool">
      {/* ─── Controls Panel (Left/Top) ─────────────── */}
      <div className="space-y-6">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title text-xl">مواصفات المبنى</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">

            {/* Country & Region Selectors */}
            <div className="calc-grid-2">
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
                    {safeCountries.map((c) => (
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
                <Label id="building-area-label">مساحة الطابق (م²)</Label>
                <span className="font-bold text-primary">{fmt(areaM2)} م²</span>
              </div>
              <Slider
                aria-labelledby="building-area-label"
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
              <Label htmlFor="building-floors">عدد الطوابق</Label>
              <div className="calc-building-inline-field">
                <Input
                  id="building-floors"
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
              <div className="calc-building-choice-grid calc-building-choice-grid--types">
                {BUILDING_TYPES.map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    aria-pressed={buildingType === type.key}
                    onClick={() => setBuildingType(type.key)}
                    className={`calc-building-choice-card calc-building-choice-card--compact ${
                      buildingType === type.key
                        ? 'is-active'
                        : ''
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
              <div className="calc-building-choice-grid calc-building-choice-grid--finish">
                {FINISH_LEVELS.map((level) => (
                  <button
                    key={level.key}
                    type="button"
                    aria-pressed={finishLevel === level.key}
                    onClick={() => setFinishLevel(level.key)}
                    className={`calc-building-choice-card ${
                      finishLevel === level.key
                        ? 'is-active'
                        : ''
                    }`}
                  >
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
      <div className="calc-results-panel">

        {/* Main Cost Highlight */}
        <Card className="calc-surface-card calc-result-card relative overflow-hidden">
          {/* Subtle background glow based on finish level */}
          <CardContent className="p-8 text-center space-y-4" aria-live="polite">
            <h3 className="text-lg font-medium text-text-secondary">التكلفة الإجمالية التقديرية</h3>
            
            <div className="flex flex-col items-center justify-center">
              <div className="calc-result-value">
                {formatCurrency(results.midCost, currentCountry.symbol)}
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-base px-4 py-2 text-sm font-medium text-text-secondary">
                <span>تتراوح بين</span>
                <span className="font-bold text-text-primary">{fmt(results.minCost)}</span>
                <span>إلى</span>
                <span className="font-bold text-text-primary">{fmt(results.maxCost)}</span>
              </div>
            </div>

            <div className="calc-metric-grid calc-grid-2 calc-result-metrics">
              <div className="calc-metric-card text-center">
                <span className="calc-metric-card__label justify-center">إجمالي المساحة المبنية</span>
                <span className="calc-metric-card__value">{fmt(results.totalArea)} م²</span>
              </div>
              <div className="calc-metric-card text-center">
                <span className="calc-metric-card__label justify-center">متوسط تكلفة المتر</span>
                <span className="calc-metric-card__value">{formatCurrency(results.costPerM2Mid, currentCountry.symbol)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Chart & Table */}
        <div className="calc-grid-2 calc-building-breakdown-grid">
          <Card className="calc-surface-card">
            <CardHeader className="pb-2">
              <CardTitle className="calc-card-title text-base text-center">توزيع التكلفة</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {safeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value, currentCountry.symbol)}
                    contentStyle={{
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)',
                      backgroundColor: 'var(--bg-surface-1)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                      direction: 'rtl',
                    }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    labelStyle={{ color: 'var(--text-secondary)' }}
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
                {safeBreakdown.map((item, index) => (
                  <div key={item.key} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`calc-chart-swatch calc-chart-swatch--${(index % 5) + 1}`} />
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
        <div className="calc-grid-2 calc-building-quick-grid">
          <Card className="calc-surface-card bg-[var(--bg-surface-2)] border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-text-secondary mb-1">الأسمنت (تقديري)</span>
              <span className="text-xl font-bold">{fmt(results.cementBags)} {currentCountry.cementUnit}</span>
            </CardContent>
          </Card>
          
          <Card className="calc-surface-card bg-[var(--bg-surface-2)] border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-text-secondary mb-1">الحديد (تقديري)</span>
              <span className="text-xl font-bold">{fmt(results.rebarTons, 1)} {currentCountry.rebarUnit}</span>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

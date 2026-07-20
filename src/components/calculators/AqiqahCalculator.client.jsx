"use client";

import { useMemo, useState } from 'react';
import { Baby, Info, Sparkle } from '@phosphor-icons/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { computeAqiqahCost, PRICE_TIERS } from '@/lib/calculators/aqiqah';

const AMOUNT_FORMATTER = new Intl.NumberFormat('ar-SA-u-nu-latn');

function formatSar(value) {
  return `${AMOUNT_FORMATTER.format(Math.round(value))} ريال`;
}

export default function AqiqahCalculator() {
  const [boys, setBoys] = useState('1');
  const [girls, setGirls] = useState('0');
  const [tierId, setTierId] = useState('standard');

  const result = useMemo(() => {
    try {
      return computeAqiqahCost({ boys, girls, tierId });
    } catch {
      return null;
    }
  }, [boys, girls, tierId]);

  return (
    <div className="calc-app aqiqah-tool" aria-label="حاسبة تكلفة العقيقة">
      <div className="calc-app-grid age-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">عدد المواليد ونوع الذبيحة</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="aqiqah-newborn-row">
              <div className="calc-esb-field">
                <Label htmlFor="aqiqah-boys">عدد الذكور</Label>
                <Input
                  id="aqiqah-boys"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="10"
                  value={boys}
                  onChange={(event) => setBoys(event.target.value)}
                  aria-label="عدد الذكور"
                />
              </div>
              <div className="calc-esb-field">
                <Label htmlFor="aqiqah-girls">عدد الإناث</Label>
                <Input
                  id="aqiqah-girls"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="10"
                  value={girls}
                  onChange={(event) => setGirls(event.target.value)}
                  aria-label="عدد الإناث"
                />
              </div>
            </div>
            <p className="calc-hint">للتوأم أو أكثر من مولود، أدخل العدد الفعلي لكل جنس.</p>

            <div className="calc-esb-field" style={{ marginTop: '1rem' }}>
              <Label>مستوى السعر</Label>
              <RadioGroup value={tierId} onValueChange={setTierId} className="calc-esb-radio-row">
                {PRICE_TIERS.map((tier) => (
                  <label key={tier.id} className="calc-esb-radio-card">
                    <RadioGroupItem value={tier.id} />
                    <span className="calc-esb-radio-copy">
                      <strong>{tier.label}</strong>
                      <span>{formatSar(tier.pricePerHead)} للرأس — {tier.note}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel" aria-live="polite">
          {result ? (
            <>
              <Card className="calc-surface-card aqiqah-result-card">
                <CardHeader>
                  <div className="calc-esb-result-header">
                    <span className="calc-esb-country-badge calc-esb-country-badge--kw">
                      <Baby size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                      {' '}السعودية
                    </span>
                    <span className="calc-esb-live-dot" aria-hidden="true" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="calc-metric-card">
                    <div className="calc-metric-card__label">
                      {result.totalSheep} {result.totalSheep === 1 ? 'رأس' : 'رؤوس'} مطلوبة
                      {result.boysCount > 0 && result.girlsCount > 0
                        ? ` (${result.sheepForBoys} للذكور + ${result.sheepForGirls} للإناث)`
                        : ''}
                    </div>
                    <div className="calc-metric-card__value">{formatSar(result.totalCost)}</div>
                    <div className="calc-metric-card__note">
                      <Info size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                      {' '}بمستوى "{result.tier.label}" — نطاق كامل بحسب الجودة: {formatSar(result.costRange.min)} إلى {formatSar(result.costRange.max)}.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">
                    <Sparkle size={16} weight="bold" style={{ display: 'inline', verticalAlign: '-2px', marginInlineEnd: '4px' }} />
                    الأساس الشرعي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="calc-metric-card__note">
                    العقيقة عن المولود الذكر شاتان، وعن الأنثى شاة واحدة (حديث عائشة رضي الله عنها، رواه الترمذي وأبو داود). الأفضل ذبحها في اليوم السابع من الولادة، فإن تعذر ففي الرابع عشر أو الحادي والعشرين، ولا حرج في تأخيرها بعد ذلك.
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="calc-metric-card">
              <div className="calc-metric-card__note">
                <Baby size={14} weight="bold" style={{ display: 'inline', verticalAlign: '-2px' }} />
                {' '}أدخل عدد المواليد لعرض عدد الذبائح والتكلفة التقديرية.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

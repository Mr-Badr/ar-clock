"use client";

import CountryFlag from '@/components/shared/CountryFlag';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ARAB_CURRENCIES, QUICK_CURRENCY_CODES, REGION_LABELS, groupCurrenciesByRegion } from '@/lib/shared/arab-currencies';

// Shared 22-country picker for both Zakat calculators — quick chips for the 6 Gulf countries +
// Egypt (this site's historical core audience + the single highest-volume keyword found, زكاة
// الذهب), plus a region-grouped select for the full ARAB_CURRENCIES list. A flat 22-entry chip row
// (the pattern every other tool-v2 calculator uses) doesn't scale past ~7 options.
export default function ZakatCountryPicker({ countryCode, onChange }) {
  const groups = groupCurrenciesByRegion();
  const regionOrder = ['gulf', 'peninsula', 'north-africa', 'levant', 'horn'];

  return (
    <div>
      <div className="guide-v2-checker-options" role="group" aria-label="دول مقترحة">
        {QUICK_CURRENCY_CODES.map((code) => {
          const c = ARAB_CURRENCIES.find((cur) => cur.code === code);
          return (
            <button
              key={code}
              type="button"
              className={`guide-v2-checker-chip${countryCode === code ? ' is-active' : ''}`}
              aria-pressed={countryCode === code}
              onClick={() => onChange(code)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <CountryFlag code={c.code} label={c.country} />
              {c.country}
            </button>
          );
        })}
      </div>

      <div className="tool-v2-field zakat-country-select" style={{ marginTop: 'var(--space-2)' }}>
        <label htmlFor="zakat-country-full">أو اختر أي دولة عربية أخرى</label>
        <Select value={countryCode} onValueChange={onChange} dir="rtl">
          <SelectTrigger id="zakat-country-full" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regionOrder.map((region) => (
              <SelectGroup key={region}>
                <SelectLabel>{REGION_LABELS[region]}</SelectLabel>
                {(groups[region] || []).map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <CountryFlag code={c.code} label={c.country} />
                      {c.country}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from 'react';

import { CalcSelectTrigger as SelectTrigger } from '@/components/calculators/controls.client';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import {
  DEFAULT_GLOBAL_CURRENCY,
  getCurrencyOptions,
  sanitizeCurrencyCode,
} from '@/lib/calculators/currency-options';

const DEFAULT_STORAGE_KEY = 'miqatona-global-currency';

export function usePreferredCurrency({
  defaultCurrency = DEFAULT_GLOBAL_CURRENCY,
  storageKey = DEFAULT_STORAGE_KEY,
} = {}) {
  const [currency, setCurrency] = useState(defaultCurrency);
  const options = useMemo(() => getCurrencyOptions('ar'), []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setCurrency(sanitizeCurrencyCode(stored, defaultCurrency));
    } catch {}
  }, [defaultCurrency, storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, currency);
    } catch {}
  }, [currency, storageKey]);

  return {
    currency,
    setCurrency: (nextCurrency) => setCurrency(sanitizeCurrencyCode(nextCurrency, defaultCurrency)),
    options,
  };
}

export default function CalculatorCurrencyField({
  currency,
  onChange,
  options,
  label = 'العملة',
  hint = 'اختر العملة التي تريد عرض النتائج المالية بها.',
  id = 'calculator-currency',
}) {
  return (
    <div className="calc-field">
      <div className="calc-field-row">
        <Label className="calc-label" htmlFor={id}>{label}</Label>
        <span className="calc-hint">{hint}</span>
      </div>
      <Select value={currency} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(options || getCurrencyOptions('ar')).map((option) => (
            <SelectItem key={option.code} value={option.code}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

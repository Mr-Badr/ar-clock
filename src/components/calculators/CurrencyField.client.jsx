"use client";

import { useEffect, useMemo, useState } from 'react';

import { CalcSelectTrigger as SelectTrigger } from '@/components/calculators/controls.client';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import {
  DEFAULT_GLOBAL_CURRENCY,
  QUICK_CURRENCY_CODES,
  getCurrencyOptions,
  sanitizeCurrencyCode,
} from '@/lib/calculators/currency-options';

const DEFAULT_STORAGE_KEY = 'miqatona-global-currency';

function warnCurrencyPreferenceIssue(error, context) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('currency-preference-storage-failed', { context, error });
  }
}

function getQuickOptions(options) {
  const optionMap = new Map(options.map((option) => [option.code, option]));
  return QUICK_CURRENCY_CODES.map((code) => optionMap.get(code)).filter(Boolean);
}

export function usePreferredCurrency(config) {
  const defaultCurrency = config?.defaultCurrency ?? DEFAULT_GLOBAL_CURRENCY;
  const storageKey = config?.storageKey ?? DEFAULT_STORAGE_KEY;
  const [currency, setCurrency] = useState(defaultCurrency);
  const options = useMemo(() => getCurrencyOptions('ar'), []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setCurrency(sanitizeCurrencyCode(stored, defaultCurrency));
    } catch (error) {
      warnCurrencyPreferenceIssue(error, 'read');
    }
  }, [defaultCurrency, storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, currency);
    } catch (error) {
      warnCurrencyPreferenceIssue(error, 'write');
    }
  }, [currency, storageKey]);

  return {
    currency,
    setCurrency: (nextCurrency) => setCurrency(sanitizeCurrencyCode(nextCurrency, defaultCurrency)),
    options,
  };
}

export default function CalculatorCurrencyField(props) {
  const currency = props.currency;
  const onChange = props.onChange;
  const optionList = props.options || getCurrencyOptions('ar');
  const label = props.label ?? 'العملة';
  const hint = props.hint ?? 'اختر العملة التي تريد عرض النتائج المالية بها. نحفظ اختيارك لهذه الحاسبة والحاسبات المالية الأخرى.';
  const id = props.id ?? 'calculator-currency';
  const quickOptions = getQuickOptions(optionList);

  return (
    <div className="calc-field">
      <div className="calc-field-row">
        <Label className="calc-label" htmlFor={id}>{label}</Label>
        <span className="calc-hint">{hint}</span>
      </div>
      {quickOptions.length ? (
        <div className="calc-currency-quick" aria-label="عملات شائعة">
          {quickOptions.map((option) => {
            const isActive = option.code === currency;

            return (
              <button
                key={option.code}
                type="button"
                className={`calc-currency-chip${isActive ? ' is-active' : ''}`}
                onClick={() => onChange(option.code)}
                aria-pressed={isActive}
                aria-label={`اختر ${option.label}`}
              >
                {option.code}
              </button>
            );
          })}
        </div>
      ) : null}
      <Select value={currency} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {optionList.map((option) => (
            <SelectItem key={option.code} value={option.code}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

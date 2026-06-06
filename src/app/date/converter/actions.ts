// src/app/date/converter/actions.ts
'use server';

import { convertDate } from '@/lib/date-adapter';
import type { ConvertDateResult, ConversionMethod } from '@/lib/date-adapter';
import { logger, serializeError } from '@/lib/logger';

interface ConverterActionResult {
  success: boolean;
  result?: ConvertDateResult;
  error?: string;
}

type ConvertDateDirection = 'hijri-to-gregorian' | 'gregorian-to-hijri';

const SUPPORTED_METHODS = new Set<ConversionMethod>(['umalqura', 'civil', 'astronomical']);

function isSupportedDirection(value: string): value is ConvertDateDirection {
  return value === 'gregorian-to-hijri' || value === 'hijri-to-gregorian';
}

function validateConversionInput(
  direction: ConvertDateDirection,
  year: number,
  month: number,
  day: number,
  method: ConversionMethod
): void {
  if (!isSupportedDirection(direction)) {
    throw new TypeError(`Unsupported conversion direction: ${direction}`);
  }

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new TypeError(`Date parts must be integers: year=${year}, month=${month}, day=${day}`);
  }

  if (month < 1 || month > 12) {
    throw new RangeError(`Month is out of supported range: ${month}`);
  }

  if (day < 1 || day > 31) {
    throw new RangeError(`Day is out of supported range: ${day}`);
  }

  if (!SUPPORTED_METHODS.has(method)) {
    throw new TypeError(`Unsupported conversion method: ${method}`);
  }
}

function toActionErrorMessage(error: unknown): string {
  if (error instanceof RangeError && error.message.includes('out of supported range')) {
    return 'التاريخ خارج النطاق المدعوم (1924-2077 م / 1343-1500 هـ).';
  }

  if (error instanceof TypeError) {
    return 'بيانات التحويل غير مكتملة أو غير صحيحة. راجع اليوم والشهر والسنة وطريقة الحساب.';
  }

  if (error instanceof Error && error.message === 'Invalid date input') {
    return 'التاريخ المدخل غير صحيح. تأكد من اليوم والشهر والسنة ثم أعد المحاولة.';
  }

  return 'تعذر تحويل التاريخ بسبب خطأ غير متوقع. جرّب تاريخاً آخر أو أعد المحاولة بعد لحظات.';
}

export async function convertDateAction(
  direction: ConvertDateDirection,
  year: number,
  month: number,
  day: number,
  method: ConversionMethod
): Promise<ConverterActionResult> {
  'use cache';

  try {
    validateConversionInput(direction, year, month, day, method);

    const toCalendar = direction === 'gregorian-to-hijri' ? 'hijri' : 'gregorian';
    const isoString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const result = convertDate({ date: isoString, toCalendar, method });
    return { success: true, result };
  } catch (error: unknown) {
    logger.warn('date-converter-action-failed', {
      direction,
      year,
      month,
      day,
      method,
      error: serializeError(error),
    });

    return {
      success: false,
      error: toActionErrorMessage(error),
    };
  }
}

// src/app/date/converter/actions.ts
'use server';

import { convertDate } from '@/lib/date-adapter';
import type { ConvertDateResult, ConversionMethod } from '@/lib/date-adapter';

interface ConverterActionResult {
  success: boolean;
  result?: ConvertDateResult;
  error?: string;
}

export async function convertDateAction(
  direction: 'hijri-to-gregorian' | 'gregorian-to-hijri',
  year: number,
  month: number,
  day: number,
  method: ConversionMethod = 'umalqura'
): Promise<ConverterActionResult> {
  'use cache';

  try {
    const toCalendar = direction === 'gregorian-to-hijri' ? 'hijri' : 'gregorian';
    const isoString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const result = convertDate({ date: isoString, toCalendar, method });
    return { success: true, result };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message?.includes('out of supported range')
        ? 'التاريخ خارج النطاق المدعوم (1924-2077 م / 1343-1500 هـ).'
        : 'حدث خطأ في التحويل. تأكد من صحة التاريخ.',
    };
  }
}

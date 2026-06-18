import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { logError } from '@/lib/observability';

let ogArabicFontsPromise = null;

function getOgFontPath(filename) {
  return path.join(process.cwd(), 'src', 'assets', 'fonts', filename);
}

function serializeFontError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return {
    message: String(error),
  };
}

function readOgArabicFonts() {
  return Promise.all([
    readFile(getOgFontPath('NotoSansArabic-Regular.ttf')),
    readFile(getOgFontPath('NotoSansArabic-Bold.ttf')),
    readFile(getOgFontPath('NotoSans-Regular.ttf')),
    readFile(getOgFontPath('NotoSans-Bold.ttf')),
  ]).then(([regularFontData, boldFontData, latinRegularFontData, latinBoldFontData]) => [
    {
      name: 'Noto Sans Arabic',
      data: regularFontData,
      style: 'normal',
      weight: 400,
    },
    {
      name: 'Noto Sans Arabic',
      data: boldFontData,
      style: 'normal',
      weight: 700,
    },
    {
      name: 'Noto Sans',
      data: latinRegularFontData,
      style: 'normal',
      weight: 400,
    },
    {
      name: 'Noto Sans',
      data: latinBoldFontData,
      style: 'normal',
      weight: 700,
    },
  ]);
}

export function getOgArabicFonts() {
  if (!ogArabicFontsPromise) {
    ogArabicFontsPromise = readOgArabicFonts().catch((error) => {
      ogArabicFontsPromise = null;
      throw error;
    });
  }

  return ogArabicFontsPromise;
}

export async function getSafeOgArabicFonts(context) {
  try {
    return await getOgArabicFonts();
  } catch (error) {
    logError('og-font-load-failed', {
      ...context,
      error: serializeFontError(error),
    });

    return [];
  }
}

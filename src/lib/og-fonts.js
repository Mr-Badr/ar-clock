import { readFile } from 'node:fs/promises';
import path from 'node:path';

let ogArabicFontsPromise = null;

function getOgFontPath(filename) {
  return path.join(process.cwd(), 'src', 'assets', 'fonts', filename);
}

export function getOgArabicFonts() {
  if (!ogArabicFontsPromise) {
    ogArabicFontsPromise = Promise.all([
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

  return ogArabicFontsPromise;
}

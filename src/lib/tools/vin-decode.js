// Universal VIN structure decode — works for ANY ISO 3779-compliant VIN worldwide, no external
// data needed. Distinct from the NHTSA vPIC live lookup (only reliable for North-American-market
// vehicles) — this always returns something, even for a Japan/Korea/Europe-direct-import VIN.

// WMI (World Manufacturer Identifier) region table — keyed by the FIRST character only, since a
// full 3-char WMI database has thousands of entries. Deliberately conservative: single-character
// codes that map to one dominant, well-known country are named directly; codes shared across
// several countries are labeled as a region, not a false-precise single country guess.
const WMI_REGION = {
  1: 'الولايات المتحدة الأمريكية', 4: 'الولايات المتحدة الأمريكية', 5: 'الولايات المتحدة الأمريكية',
  2: 'كندا',
  3: 'المكسيك',
  6: 'أستراليا',
  7: 'نيوزيلندا',
  8: 'الأرجنتين', 9: 'البرازيل',
  J: 'اليابان',
  K: 'كوريا الجنوبية',
  L: 'الصين',
  M: 'الهند / إندونيسيا',
  N: 'تركيا',
  R: 'الإمارات / تايوان (حسب الحرف الثاني)',
  S: 'المملكة المتحدة',
  T: 'سويسرا / التشيك',
  V: 'فرنسا / إسبانيا',
  W: 'ألمانيا',
  X: 'روسيا / هولندا',
  Y: 'السويد / فنلندا / بلجيكا',
  Z: 'إيطاليا',
};

// SAE J853 / ISO 3779 model-year code — a 30-year repeating cycle. I/O/Q/U/Z/0 never appear as
// year codes (I/O/Q are banned from VINs entirely to avoid confusion with 1/0).
const YEAR_CODES = 'ABCDEFGHJKLMNPRSTVWXY123456789';
function decodeModelYear(vin) {
  const code = vin[9];
  const index = YEAR_CODES.indexOf(code);
  if (index === -1) return null;
  const baseYear = 1980 + index;
  // Position 7 (0-indexed 6) disambiguates the 30-year cycle: digit → older cycle, letter → newer.
  const pos7 = vin[6];
  const isNewerCycle = /[A-Z]/.test(pos7);
  return isNewerCycle ? baseYear + 30 : baseYear;
}

// North American check-digit algorithm (position 9, 0-indexed 8) — only meaningful for VINs
// built to the North American standard; a non-matching result for a Euro/Asia-market VIN is
// expected and NOT necessarily an invalid VIN, so this is surfaced as an informational note,
// never a hard "invalid" error.
const TRANSLIT = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
function checkDigitValid(vin) {
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const ch = vin[i];
    const value = /[0-9]/.test(ch) ? Number(ch) : TRANSLIT[ch];
    if (value === undefined) return null;
    sum += value * WEIGHTS[i];
  }
  const remainder = sum % 11;
  const expected = remainder === 10 ? 'X' : String(remainder);
  return expected === vin[8];
}

export function decodeVinStructure(rawVin) {
  const vin = rawVin.trim().toUpperCase();
  if (vin.length !== 17) return { valid: false, reason: 'رقم الشاصي يجب أن يتكون من 17 حرفاً ورقماً بالضبط' };
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return { valid: false, reason: 'رقم الشاصي يحتوي على حرف غير صالح — لا يُستخدم حرف I أو O أو Q في أي رقم شاصي حول العالم' };
  }

  const wmi = vin.slice(0, 3);
  const region = WMI_REGION[vin[0]] || null;
  const modelYear = decodeModelYear(vin);
  const checkDigitOk = checkDigitValid(vin);
  const serial = vin.slice(11);

  return {
    valid: true,
    vin,
    wmi,
    region,
    modelYear,
    checkDigitOk,
    serial,
  };
}

/**
 * spectrumCities.js
 * Cities positioned on the UTC offset axis for SectionTimezoneSpectrum.
 *
 * ACCURACY NOTES (verified against IANA tz database, March 2026):
 *
 * Morocco (الرباط): Standard = UTC+0 (WET). DST = UTC+1 (WEST), applied approx
 *   March–October except during Ramadan. The spectrum shows the STANDARD offset
 *   = UTC+0, consistent with how all other DST countries are displayed.
 *   Source: Africa/Casablanca IANA — WET (UTC+0) is the base/standard.
 *   (Previously wrong: was utc:1 which is the DST/summer value)
 *
 * Syria (not in spectrum): Abolished DST October 2022, now permanently UTC+3.
 *   Reflected in arabTimezones.js.
 *
 * Turkey (إسطنبول): Permanently UTC+3 since 2016 (abolished DST). ✅
 * Algeria (الجزائر): UTC+1, no DST. ✅
 * Tunisia (تونس): UTC+1, no DST. ✅
 * Libya (طرابلس): UTC+2, no DST. ✅
 * Iran (طهران): UTC+3:30 standard, applies DST → UTC+4:30 in summer. ✅
 *
 * LANE SYSTEM:
 *   laneIndex: 0 = lowest (closest to bar), higher = further up
 *   Cities at the same UTC offset share laneIndex space via different indices
 *   to prevent visual overlap.
 */

export const SPECTRUM_CITIES = [
  // UTC−5
  { nameAr: 'نيويورك',   flag: '🇺🇸', utc: -5,  arab: false, slug: 'united-states',           laneIndex: 0 },
  // UTC−3
  { nameAr: 'ريو',        flag: '🇧🇷', utc: -3,  arab: false, slug: 'brazil',                  laneIndex: 0 },

  // UTC+0
  // FIX: Morocco standard = UTC+0 (WET), not UTC+1 (was showing DST/summer offset)
  { nameAr: 'لندن',       flag: '🇬🇧', utc:  0,  arab: false, slug: 'united-kingdom',          laneIndex: 0 },
  { nameAr: 'موريتانيا',  flag: '🇲🇷', utc:  0,  arab: true,  slug: 'mauritania',              laneIndex: 1 },
  { nameAr: 'الرباط',     flag: '🇲🇦', utc:  0,  arab: true,  slug: 'morocco',                 laneIndex: 2 },

  // UTC+1 — Algeria, Tunisia, Paris (Morocco removed from here, moved to UTC+0)
  { nameAr: 'الجزائر',    flag: '🇩🇿', utc:  1,  arab: true,  slug: 'algeria',                 laneIndex: 0 },
  { nameAr: 'تونس',       flag: '🇹🇳', utc:  1,  arab: true,  slug: 'tunisia',                 laneIndex: 1 },
  { nameAr: 'باريس',      flag: '🇫🇷', utc:  1,  arab: false, slug: 'france',                  laneIndex: 2 },

  // UTC+2
  { nameAr: 'القاهرة',    flag: '🇪🇬', utc:  2,  arab: true,  slug: 'egypt',                   laneIndex: 0 },
  { nameAr: 'طرابلس',     flag: '🇱🇾', utc:  2,  arab: true,  slug: 'libya',                   laneIndex: 1 },
  { nameAr: 'عمّان',      flag: '🇯🇴', utc:  2,  arab: true,  slug: 'jordan',                  laneIndex: 2 },
  { nameAr: 'بيروت',      flag: '🇱🇧', utc:  2,  arab: true,  slug: 'lebanon',                 laneIndex: 3 },

  // UTC+3
  // All Gulf countries + Turkey at UTC+3.
  // Turkey: permanently UTC+3 since 2016 (no DST). ✅
  // Syria: abolished DST 2022, now UTC+3 permanently — not shown in spectrum
  //        (added to arabTimezones.js at UTC+3)
  { nameAr: 'الرياض',     flag: '🇸🇦', utc:  3,  arab: true,  slug: 'saudi-arabia',            laneIndex: 0 },
  { nameAr: 'الكويت',     flag: '🇰🇼', utc:  3,  arab: true,  slug: 'kuwait',                  laneIndex: 1 },
  { nameAr: 'بغداد',      flag: '🇮🇶', utc:  3,  arab: true,  slug: 'iraq',                    laneIndex: 2 },
  { nameAr: 'الدوحة',     flag: '🇶🇦', utc:  3,  arab: true,  slug: 'qatar',                   laneIndex: 3 },
  { nameAr: 'إسطنبول',    flag: '🇹🇷', utc:  3,  arab: false, slug: 'turkey',                  laneIndex: 4 },

  // UTC+3.5 — Iran standard (applies DST → UTC+4.5 in summer)
  { nameAr: 'طهران',      flag: '🇮🇷', utc:  3.5, arab: false, slug: 'iran',                   laneIndex: 0 },

  // UTC+4
  { nameAr: 'دبي',         flag: '🇦🇪', utc:  4,  arab: true,  slug: 'united-arab-emirates',   laneIndex: 0 },
  { nameAr: 'مسقط',        flag: '🇴🇲', utc:  4,  arab: true,  slug: 'oman',                    laneIndex: 1 },

  // UTC+5.5 — India (no DST)
  { nameAr: 'مومباي',      flag: '🇮🇳', utc:  5.5, arab: false, slug: 'india',                  laneIndex: 0 },

  // UTC+8 — China (no DST, nationwide)
  { nameAr: 'بكين',        flag: '🇨🇳', utc:  8,  arab: false, slug: 'china',                   laneIndex: 0 },

  // UTC+9 — Japan (no DST)
  { nameAr: 'طوكيو',       flag: '🇯🇵', utc:  9,  arab: false, slug: 'japan',                   laneIndex: 0 },
]

/*
 * Axis range: -6 to +10
 * Rightmost city: Tokyo at UTC+9.
 * +10 shows on axis for completeness but has no pin — gives visual breathing room.
 */
export const AXIS_MIN   = -6
export const AXIS_MAX   = 10
export const AXIS_RANGE = AXIS_MAX - AXIS_MIN   // 16

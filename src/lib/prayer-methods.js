/**
 * lib/prayer-methods.js
 *
 * Mapping of ISO country codes → Adhan.js calculation methods + default madhab.
 *
 * ── MADHAB (Asr calculation) ───────────────────────────────────────────────────
 *  Adhan.js only accepts two values for CalculationParameters.madhab:
 *    'Shafi'  → Asr when shadow = 1× object height  (Shafi, Maliki, Hanbali)
 *    'Hanafi' → Asr when shadow = 2× object height  (Hanafi — typically 45–90 min later)
 *
 *  Maliki and Hanbali use the identical Asr formula as Shafi inside Adhan.js.
 *  The `defaultMadhab` field drives the Adhan.js engine and must be 'Shafi' or 'Hanafi'.
 *  The `school` field is UI-only — it reflects the real dominant fiqh school of the country
 *  and maps to a MADHAB_INFO key for display purposes.
 *
 * ── VALID Adhan.js CalculationMethod names ────────────────────────────────────
 *  MuslimWorldLeague | Egyptian | Karachi | UmmAlQura | Dubai
 *  MoonsightingCommittee | NorthAmerica | Kuwait | Qatar | Singapore
 *  Tehran | Turkey | Other
 *
 *  ⚠ 'Gulf' does NOT exist in Adhan.js — use 'Dubai' for Gulf-region countries.
 *     Omitting this causes CalculationMethod[undefined]() → silent wrong results.
 */

/**
 * @typedef {'Shafi'|'Maliki'|'Hanbali'|'Hanafi'} SchoolKey
 * @typedef {'Shafi'|'Hanafi'} AdhanMadhab  — the only values Adhan.js accepts
 *
 * @typedef {{
 *   name:          string,       — Adhan.js CalculationMethod key
 *   label:         string,       — Arabic display label for UI
 *   defaultMadhab: AdhanMadhab, — passed to Adhan.js engine (Shafi|Hanafi only)
 *   school:        SchoolKey,    — real dominant fiqh school (for MADHAB_INFO lookup)
 * }} CountryMethod
 */

/** @type {Record<string, CountryMethod>} */
export const PRAYER_METHODS = {

  // ── Arabian Peninsula ──────────────────────────────────────────────────────
  SA: { name: 'UmmAlQura',             label: 'أم القرى — المملكة العربية السعودية',       defaultMadhab: 'Shafi',  school: 'Hanbali' },
  AE: { name: 'Dubai',                 label: 'هيئة الإمارات للمواصفات — دبي',             defaultMadhab: 'Shafi',  school: 'Maliki'  },
  QA: { name: 'Qatar',                 label: 'وزارة الأوقاف — قطر',                       defaultMadhab: 'Shafi',  school: 'Hanbali' },
  KW: { name: 'Kuwait',                label: 'وزارة الأوقاف — الكويت',                    defaultMadhab: 'Shafi',  school: 'Hanbali' },
  // FIX: 'Gulf' does not exist in Adhan.js → 'Dubai' (same Fajr/Isha angles, correct for Gulf region)
  OM: { name: 'Dubai',                 label: 'سلطنة عُمان',                               defaultMadhab: 'Shafi',  school: 'Shafi'   },
  BH: { name: 'Dubai',                 label: 'البحرين',                                   defaultMadhab: 'Shafi',  school: 'Maliki'  },
  YE: { name: 'Dubai',                 label: 'اليمن',                                     defaultMadhab: 'Shafi',  school: 'Shafi'   },

  // ── North Africa ───────────────────────────────────────────────────────────
  EG: { name: 'Egyptian',              label: 'الهيئة المصرية العامة للمساحة',             defaultMadhab: 'Shafi',  school: 'Shafi'   },
  // FIX: 'Maliki' is not valid in Adhan.js → defaultMadhab must be 'Shafi'; school field carries the real school for the UI
  MA: { name: 'Egyptian',              label: 'وزارة الأوقاف المغربية',                   defaultMadhab: 'Shafi',  school: 'Maliki'  },
  DZ: { name: 'Egyptian',              label: 'وزارة الشؤون الدينية — الجزائر',            defaultMadhab: 'Shafi',  school: 'Maliki'  },
  TN: { name: 'Egyptian',              label: 'وزارة الشؤون الدينية — تونس',               defaultMadhab: 'Shafi',  school: 'Maliki'  },
  LY: { name: 'Egyptian',              label: 'ليبيا',                                     defaultMadhab: 'Shafi',  school: 'Maliki'  },
  SD: { name: 'Egyptian',              label: 'السودان',                                   defaultMadhab: 'Shafi',  school: 'Maliki'  },
  MR: { name: 'Egyptian',              label: 'موريتانيا',                                 defaultMadhab: 'Shafi',  school: 'Maliki'  },

  // ── Levant & Iraq ─────────────────────────────────────────────────────────
  JO: { name: 'MuslimWorldLeague',     label: 'رابطة العالم الإسلامي — الأردن',            defaultMadhab: 'Shafi',  school: 'Shafi'   },
  LB: { name: 'MuslimWorldLeague',     label: 'رابطة العالم الإسلامي — لبنان',             defaultMadhab: 'Shafi',  school: 'Shafi'   },
  SY: { name: 'MuslimWorldLeague',     label: 'رابطة العالم الإسلامي — سوريا',             defaultMadhab: 'Shafi',  school: 'Shafi'   },
  IQ: { name: 'MuslimWorldLeague',     label: 'رابطة العالم الإسلامي — العراق',            defaultMadhab: 'Hanafi', school: 'Hanafi'  },
  PS: { name: 'Egyptian',              label: 'فلسطين',                                    defaultMadhab: 'Shafi',  school: 'Shafi'   },

  // ── South Asia ────────────────────────────────────────────────────────────
  PK: { name: 'Karachi',               label: 'جامعة العلوم الإسلامية — كراتشي',           defaultMadhab: 'Hanafi', school: 'Hanafi'  },
  IN: { name: 'Karachi',               label: 'الهند — كراتشي',                            defaultMadhab: 'Hanafi', school: 'Hanafi'  },
  BD: { name: 'Karachi',               label: 'بنغلاديش — كراتشي',                         defaultMadhab: 'Hanafi', school: 'Hanafi'  },
  AF: { name: 'Karachi',               label: 'أفغانستان',                                 defaultMadhab: 'Hanafi', school: 'Hanafi'  },

  // ── Turkey & Central Asia ─────────────────────────────────────────────────
  TR: { name: 'Turkey',                label: 'رئاسة الشؤون الدينية التركية (Diyanet)',    defaultMadhab: 'Hanafi', school: 'Hanafi'  },
  AZ: { name: 'Turkey',                label: 'أذربيجان',                                  defaultMadhab: 'Hanafi', school: 'Hanafi'  },
  UZ: { name: 'MuslimWorldLeague',     label: 'أوزبكستان',                                 defaultMadhab: 'Hanafi', school: 'Hanafi'  },
  KZ: { name: 'MuslimWorldLeague',     label: 'كازاخستان',                                 defaultMadhab: 'Hanafi', school: 'Hanafi'  },

  // ── Southeast Asia ────────────────────────────────────────────────────────
  SG: { name: 'Singapore',             label: 'مجلس علماء سنغافورة (MUIS)',               defaultMadhab: 'Shafi',  school: 'Shafi'   },
  // FIX: MY & ID corrected from MuslimWorldLeague → Singapore.
  //      JAKIM (Malaysia) and Kemenag (Indonesia) both use Fajr 20°, Isha 18° — matching the Singapore method.
  MY: { name: 'Singapore',             label: 'JAKIM — ماليزيا',                           defaultMadhab: 'Shafi',  school: 'Shafi'   },
  ID: { name: 'Singapore',             label: 'كيمناغ — إندونيسيا',                        defaultMadhab: 'Shafi',  school: 'Shafi'   },
  BN: { name: 'Singapore',             label: 'بروناي',                                    defaultMadhab: 'Shafi',  school: 'Shafi'   },

  // ── Iran ──────────────────────────────────────────────────────────────────
  // Tehran method: Fajr 17.7°, Isha 14°, Maghrib at 4.5° below horizon.
  IR: { name: 'Tehran',                label: 'معهد الجيوفيزياء — جامعة طهران',            defaultMadhab: 'Shafi',  school: 'Shafi'   },

  // ── Western Countries (Muslim minorities) ─────────────────────────────────
  US: { name: 'NorthAmerica',          label: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)', defaultMadhab: 'Shafi',  school: 'Shafi'   },
  CA: { name: 'NorthAmerica',          label: 'كندا — ISNA',                               defaultMadhab: 'Shafi',  school: 'Shafi'   },
  GB: { name: 'MoonsightingCommittee', label: 'لجنة رؤية الهلال — المملكة المتحدة',       defaultMadhab: 'Shafi',  school: 'Shafi'   },
  FR: { name: 'MuslimWorldLeague',     label: 'فرنسا — رابطة العالم الإسلامي',            defaultMadhab: 'Shafi',  school: 'Shafi'   },
  DE: { name: 'MuslimWorldLeague',     label: 'ألمانيا — رابطة العالم الإسلامي',          defaultMadhab: 'Shafi',  school: 'Shafi'   },
  ES: { name: 'MuslimWorldLeague',     label: 'إسبانيا — رابطة العالم الإسلامي',          defaultMadhab: 'Shafi',  school: 'Maliki'  },
  IT: { name: 'MuslimWorldLeague',     label: 'إيطاليا — رابطة العالم الإسلامي',          defaultMadhab: 'Shafi',  school: 'Shafi'   },
  NL: { name: 'MuslimWorldLeague',     label: 'هولندا — رابطة العالم الإسلامي',           defaultMadhab: 'Shafi',  school: 'Shafi'   },
  BE: { name: 'MuslimWorldLeague',     label: 'بلجيكا — رابطة العالم الإسلامي',           defaultMadhab: 'Shafi',  school: 'Shafi'   },
  // FIX: AU corrected from NorthAmerica (ISNA) → MuslimWorldLeague (correct for Australia/Oceania)
  AU: { name: 'MuslimWorldLeague',     label: 'أستراليا — رابطة العالم الإسلامي',         defaultMadhab: 'Shafi',  school: 'Shafi'   },
};

/**
 * Get the calculation method config for a given ISO country code.
 *
 * @param {string} countryCode - ISO 3166-1 alpha-2 (e.g. 'MA', 'SA')
 * @returns {CountryMethod}
 */
export function getMethodByCountry(countryCode) {
  const code = countryCode?.toUpperCase();
  return PRAYER_METHODS[code] ?? {
    name:          'MuslimWorldLeague',
    label:         'رابطة العالم الإسلامي (افتراضي)',
    defaultMadhab: 'Shafi',
    school:        'Shafi',
  };
}

/**
 * All valid Adhan.js calculation methods for the user-facing method selector.
 * FIX: 'Gulf' removed — it does not exist in Adhan.js and would silently fail.
 */
export const ALL_METHODS = [
  { value: 'MuslimWorldLeague',     label: 'رابطة العالم الإسلامي (MWL)'                  },
  { value: 'UmmAlQura',             label: 'أم القرى — السعودية'                           },
  { value: 'Egyptian',              label: 'الهيئة المصرية العامة للمساحة'                 },
  { value: 'Karachi',               label: 'جامعة العلوم الإسلامية — كراتشي'               },
  { value: 'Dubai',                 label: 'هيئة الإمارات للمواصفات — دبي'                 },
  { value: 'Qatar',                 label: 'وزارة الأوقاف — قطر'                           },
  { value: 'Kuwait',                label: 'وزارة الأوقاف — الكويت'                        },
  { value: 'MoonsightingCommittee', label: 'لجنة رؤية الهلال (Moonsighting.com)'           },
  { value: 'NorthAmerica',          label: 'ISNA — أمريكا الشمالية'                        },
  { value: 'Singapore',             label: 'مجلس علماء سنغافورة (MUIS)'                   },
  { value: 'Turkey',                label: 'رئاسة الشؤون الدينية التركية (Diyanet)'        },
  { value: 'Tehran',                label: 'معهد الجيوفيزياء — طهران'                      },
];

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MADHAB_INFO — Fiqh schools display data, used by the MadhabSelector UI.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * All four Sunni madhabs are fully supported. Here is the complete fiqh picture
 * so this is never misunderstood:
 *
 *  PRAYER   │ Shafi  │ Maliki │ Hanbali │ Hanafi
 *  ─────────┼────────┼────────┼─────────┼────────────────────────────────────
 *  Fajr     │ same   │ same   │ same    │ same   (true dawn — no difference)
 *  Dhuhr    │ same   │ same   │ same    │ same   (after zenith — no difference)
 *  Asr      │ × 1    │ × 1    │ × 1     │ × 2    ← THE ONLY CALCULABLE DIFFERENCE
 *  Maghrib  │ same   │ same   │ same    │ same   (at sunset — no difference)
 *  Isha     │ same   │ same   │ same    │ same   (red twilight — no difference)
 *
 *  Maliki note: preferred Asr ends when sun turns yellow (before × 2); emergency
 *  time extends to sunset. The START time is still shadow × 1 — identical to
 *  Shafi and Hanbali. This is a fiqh ruling on delay, not a calculation difference.
 *
 *  Hanbali note: delaying Asr past shadow × 2 is considered sinful (haram) but
 *  the salat remains valid. The START time is still shadow × 1.
 *
 * `computesAs` is the value passed to Adhan.js Madhab enum.
 * Maliki → 'Shafi' and Hanbali → 'Shafi' are NOT workarounds — they are the
 * fiqh-accurate mapping. No external library or API supports a separate Maliki
 * or Hanbali parameter because no separate calculation exists.
 *
 * Usage in engine:
 *   const schoolKey = country.school ?? country.defaultMadhab;
 *   const madhab    = MADHAB_INFO[schoolKey]?.computesAs ?? 'Shafi';
 *   params.madhab   = Madhab[madhab];  // Madhab.Shafi or Madhab.Hanafi
 */
export const MADHAB_INFO = {

  /**
   * Shafi — المذهب الشافعي
   * Dominant in: Egypt, Syria, Jordan, East Africa, SE Asia
   */
  Shafi: {
    label:       'الشافعي',
    computesAs:  'Shafi',
    asrRule:     'ظل الشيء = طوله (× 1)',
    description: 'وقت العصر يبدأ حين يصبح ظل الشيء مساوياً لطوله (× 1). '
               + 'هذا هو القول المعتمد عند الشافعية، وهو المتبع في مصر وسوريا والأردن وكثير من دول جنوب شرق آسيا.',
    countries:   ['مصر', 'سوريا', 'الأردن', 'ماليزيا', 'إندونيسيا', 'سنغافورة', 'بروناي', 'اليمن'],
  },

  /**
   * Maliki — المذهب المالكي
   * Dominant in: All of North Africa, West Africa, parts of Gulf
   *
   * Asr calculation = shadow × 1 — IDENTICAL to Shafi.
   * computesAs: 'Shafi' is the correct fiqh-accurate mapping, not a workaround.
   *
   * The Maliki school distinguishes two Asr windows:
   *   وقت الاختيار (preferred) — from shadow × 1 until sun turns yellow (safra')
   *   وقت الضرورة (emergency)  — from sun turning yellow until sunset
   * Both windows begin at the same START time as all other madhabs.
   */
  Maliki: {
    label:       'المالكي',
    computesAs:  'Shafi',
    asrRule:     'ظل الشيء = طوله (× 1)',
    description: 'وقت العصر يبدأ حين يصبح ظل الشيء مساوياً لطوله (× 1)، '
               + 'وهو مطابق لحساب الشافعية تماماً. '
               + 'يُفرّق المالكية بين وقت الاختيار (حتى اصفرار الشمس) ووقت الضرورة (حتى الغروب)، '
               + 'غير أن توقيت البداية المحسوب هو نفسه. '
               + 'المذهب المالكي هو المذهب الرسمي في المغرب والجزائر وتونس وليبيا وسائر دول شمال وغرب أفريقيا.',
    countries:   ['المغرب', 'الجزائر', 'تونس', 'ليبيا', 'السودان', 'موريتانيا', 'السنغال', 'مالي', 'الإمارات', 'البحرين'],
  },

  /**
   * Hanbali — المذهب الحنبلي
   * Dominant in: Saudi Arabia, Qatar, Kuwait
   *
   * Asr calculation = shadow × 1 — IDENTICAL to Shafi and Maliki.
   * computesAs: 'Shafi' is the correct fiqh-accurate mapping, not a workaround.
   *
   * The Hanbali school holds that delaying Asr past shadow × 2 is sinful (haram),
   * while the salat remains valid. The START time is still shadow × 1.
   */
  Hanbali: {
    label:       'الحنبلي',
    computesAs:  'Shafi',
    asrRule:     'ظل الشيء = طوله (× 1)',
    description: 'وقت العصر يبدأ حين يصبح ظل الشيء مساوياً لطوله (× 1)، '
               + 'وهو مطابق لحساب الشافعية والمالكية تماماً. '
               + 'يرى الحنابلة أن تأخير العصر حتى يصبح الظل ضعف الطول محرّم وإن صحّت الصلاة. '
               + 'المذهب الحنبلي هو المذهب الرسمي في المملكة العربية السعودية وقطر والكويت.',
    countries:   ['المملكة العربية السعودية', 'قطر', 'الكويت'],
  },

  /**
   * Hanafi — المذهب الحنفي
   * Dominant in: Turkey, Pakistan, India, Bangladesh, Central Asia, Iraq
   *
   * This is the ONLY madhab with a different Asr start time.
   * Asr = shadow × 2 — typically 45–90 min later than the other three schools.
   */
  Hanafi: {
    label:       'الحنفي',
    computesAs:  'Hanafi',
    asrRule:     'ظل الشيء = ضعف طوله (× 2)',
    description: 'وقت العصر يبدأ حين يصبح ظل الشيء ضعف طوله (× 2). '
               + 'هذا هو المذهب الوحيد من المذاهب الأربعة الذي يختلف في توقيت العصر، '
               + 'ويؤخره عادةً بـ 45–90 دقيقة مقارنةً بالمذاهب الأخرى. '
               + 'هو المذهب الرسمي في تركيا وباكستان والهند وبنغلاديش وأفغانستان والعراق وآسيا الوسطى.',
    countries:   ['تركيا', 'باكستان', 'الهند', 'بنغلاديش', 'أفغانستان', 'العراق', 'أوزبكستان', 'كازاخستان'],
  },
};
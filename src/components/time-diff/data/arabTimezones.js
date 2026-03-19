/**
 * arabTimezones.js
 * Complete timezone reference:
 *   – All 22 Arab League members
 *   – Key neighbours (Turkey, Iran, Russia, Ethiopia, Eritrea, Kenya, Azerbaijan, Georgia, Afghanistan, etc.)
 *   – European diaspora hubs (UK, FR, DE, ES, IT, NL, BE, SE, CH, AT, DK, NO, PT, GR, RO, PL, UA)
 *   – Sub-Saharan Africa (Nigeria, Senegal, Mali, Niger, Chad, South Africa, Tanzania, Uganda, etc.)
 *   – South & South-East Asia (Pakistan, India, Sri Lanka, Bangladesh, Thailand, Vietnam,
 *     Malaysia, Singapore, Philippines, Indonesia, China, HK, Japan, South Korea)
 *   – Central Asia (Uzbekistan, Kazakhstan)
 *   – Americas (USA × 2, Canada, Mexico, Brazil, Argentina)
 *   – Oceania (Australia – Sydney)
 *
 * ═══════════════════════════════════════════════════════════════
 * ACCURACY NOTES (verified vs IANA tz database, March 2026):
 * ═══════════════════════════════════════════════════════════════
 * Jordan:        BUG FIX – was UTC+2/DST. Permanently UTC+3 since Feb 2022
 *                (Cabinet Decision No. 8/2022). IANA: Asia/Amman.
 * Syria:         Abolished DST Oct 2022 → UTC+3 permanent. IANA: Asia/Damascus.
 * Morocco:       UTC+0 standard; DST UTC+1 ~Mar–Oct, EXCEPT during Ramadan.
 * Egypt:         DST restored April 2023 (UTC+2 standard, UTC+3 summer).
 * Turkey:        Permanently UTC+3 since Oct 2016, no DST.
 * Russia/Moscow: Permanently UTC+3 since Oct 26 2014, no DST.
 * Iran:          UTC+3:30 standard, UTC+4:30 DST — still observes DST.
 * Brazil:        DST abolished permanently April 2019. São Paulo = UTC-3 year-round.
 * Argentina:     No DST since 1993. UTC-3 permanent.
 * Pakistan:      DST abolished 2009. UTC+5 year-round.
 * Azerbaijan:    DST abolished 2016. UTC+4 year-round.
 * Georgia:       DST abolished 2005. UTC+4 year-round.
 * Australia/Syd: AEST UTC+10 (standard, Apr–Oct), AEDT UTC+11 (DST, Oct–Apr).
 *
 * group field:
 *   'arab'      = Arab League member (22 countries)
 *   'neighbour' = geographic / cultural neighbour
 *   'africa'    = sub-Saharan Africa / large Muslim population
 *   'europe'    = European diaspora hub
 *   'asia'      = South / South-East / East / Central Asia
 *   'americas'  = Americas + Oceania
 *
 * dstNote: true  = observes Daylight Saving Time (+1 h in summer)
 * utc: standard (winter) offset in decimal hours (-8, 3.5, 5.5 …)
 */

export const ARAB_TIMEZONES = [

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC-8 — Pacific USA
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'أمريكا - لوس أنجلوس',  flag: '🇺🇸', utc: -8,  utcLabel: 'UTC-8',    tz: 'America/Los_Angeles',            dstNote: true,  capital: 'لوس أنجلوس',  group: 'americas' },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC-6 — Central Time (Mexico)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'المكسيك',               flag: '🇲🇽', utc: -6,  utcLabel: 'UTC-6',    tz: 'America/Mexico_City',            dstNote: true,  capital: 'مكسيكو سيتي', group: 'americas' },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC-5 — Eastern USA + Canada
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'أمريكا - نيويورك',      flag: '🇺🇸', utc: -5,  utcLabel: 'UTC-5',    tz: 'America/New_York',               dstNote: true,  capital: 'نيويورك',     group: 'americas' },
  { nameAr: 'كندا - تورنتو',          flag: '🇨🇦', utc: -5,  utcLabel: 'UTC-5',    tz: 'America/Toronto',                dstNote: true,  capital: 'تورنتو',      group: 'americas' },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC-3 — South America
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'البرازيل - ساو باولو',  flag: '🇧🇷', utc: -3,  utcLabel: 'UTC-3',    tz: 'America/Sao_Paulo',              dstNote: false, capital: 'برازيليا',    group: 'americas' }, // DST abolished 2019
  { nameAr: 'الأرجنتين',             flag: '🇦🇷', utc: -3,  utcLabel: 'UTC-3',    tz: 'America/Argentina/Buenos_Aires', dstNote: false, capital: 'بوينس آيرس', group: 'americas' }, // no DST since 1993

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+0 — West Africa + Western Europe + Arab Maghreb
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'المغرب',                flag: '🇲🇦', utc: 0,   utcLabel: 'UTC+0',    tz: 'Africa/Casablanca',              dstNote: true,  capital: 'الرباط',      group: 'arab'     }, // DST except Ramadan
  { nameAr: 'موريتانيا',             flag: '🇲🇷', utc: 0,   utcLabel: 'UTC+0',    tz: 'Africa/Nouakchott',              dstNote: false, capital: 'نواكشوط',     group: 'arab'     },
  { nameAr: 'السنغال',               flag: '🇸🇳', utc: 0,   utcLabel: 'UTC+0',    tz: 'Africa/Dakar',                   dstNote: false, capital: 'داكار',       group: 'africa'   },
  { nameAr: 'مالي',                  flag: '🇲🇱', utc: 0,   utcLabel: 'UTC+0',    tz: 'Africa/Bamako',                  dstNote: false, capital: 'باماكو',      group: 'africa'   },
  { nameAr: 'غينيا',                 flag: '🇬🇳', utc: 0,   utcLabel: 'UTC+0',    tz: 'Africa/Conakry',                 dstNote: false, capital: 'كوناكري',     group: 'africa'   },
  { nameAr: 'غامبيا',                flag: '🇬🇲', utc: 0,   utcLabel: 'UTC+0',    tz: 'Africa/Banjul',                  dstNote: false, capital: 'بانجول',      group: 'africa'   },
  { nameAr: 'المملكة المتحدة',       flag: '🇬🇧', utc: 0,   utcLabel: 'UTC+0',    tz: 'Europe/London',                  dstNote: true,  capital: 'لندن',        group: 'europe'   },
  { nameAr: 'البرتغال',              flag: '🇵🇹', utc: 0,   utcLabel: 'UTC+0',    tz: 'Europe/Lisbon',                  dstNote: true,  capital: 'لشبونة',      group: 'europe'   },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+1 — West/Central Africa + Central Europe + Arab Maghreb
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'الجزائر',               flag: '🇩🇿', utc: 1,   utcLabel: 'UTC+1',    tz: 'Africa/Algiers',                 dstNote: false, capital: 'الجزائر',     group: 'arab'     },
  { nameAr: 'تونس',                  flag: '🇹🇳', utc: 1,   utcLabel: 'UTC+1',    tz: 'Africa/Tunis',                   dstNote: false, capital: 'تونس',        group: 'arab'     },
  { nameAr: 'نيجيريا',               flag: '🇳🇬', utc: 1,   utcLabel: 'UTC+1',    tz: 'Africa/Lagos',                   dstNote: false, capital: 'أبوجا',       group: 'africa'   },
  { nameAr: 'النيجر',                flag: '🇳🇪', utc: 1,   utcLabel: 'UTC+1',    tz: 'Africa/Niamey',                  dstNote: false, capital: 'نيامي',       group: 'africa'   },
  { nameAr: 'تشاد',                  flag: '🇹🇩', utc: 1,   utcLabel: 'UTC+1',    tz: 'Africa/Ndjamena',                dstNote: false, capital: 'نجامينا',     group: 'africa'   },
  { nameAr: 'الكاميرون',             flag: '🇨🇲', utc: 1,   utcLabel: 'UTC+1',    tz: 'Africa/Douala',                  dstNote: false, capital: 'ياوندي',      group: 'africa'   },
  { nameAr: 'فرنسا',                 flag: '🇫🇷', utc: 1,   utcLabel: 'UTC+1',    tz: 'Europe/Paris',                   dstNote: true,  capital: 'باريس',       group: 'europe'   },
  { nameAr: 'ألمانيا',               flag: '🇩🇪', utc: 1,   utcLabel: 'UTC+1',    tz: 'Europe/Berlin',                  dstNote: true,  capital: 'برلين',       group: 'europe'   },
  { nameAr: 'إسبانيا',               flag: '🇪🇸', utc: 1,   utcLabel: 'UTC+1',    tz: 'Europe/Madrid',                  dstNote: true,  capital: 'مدريد',       group: 'europe'   },
  { nameAr: 'إيطاليا',               flag: '🇮🇹', utc: 1,   utcLabel: 'UTC+1',    tz: 'Europe/Rome',                    dstNote: true,  capital: 'روما',        group: 'europe'   },
  { nameAr: 'هولندا',                flag: '🇳🇱', utc: 1,   utcLabel: 'UTC+1',    tz: 'Europe/Amsterdam',               dstNote: true,  capital: 'أمستردام',    group: 'europe'   },
  { nameAr: 'بلجيكا',                flag: '🇧🇪', utc: 1,   utcLabel: 'UTC+1',    tz: 'Europe/Brussels',                dstNote: true,  capital: 'بروكسل',      group: 'europe'   },
  { nameAr: 'السويد',                flag: '🇸🇪', utc: 1,   utcLabel: 'UTC+1',    tz: 'Europe/Stockholm',               dstNote: true,  capital: 'ستوكهولم',    group: 'europe'   },
  { nameAr: 'سويسرا',                flag: '🇨🇭', utc: 1,   utcLabel: 'UTC+1',    tz: 'Europe/Zurich',                  dstNote: true,  capital: 'برن',         group: 'europe'   },
  { nameAr: 'النمسا',                flag: '🇦🇹', utc: 1,   utcLabel: 'UTC+1',    tz: 'Europe/Vienna',                  dstNote: true,  capital: 'فيينا',       group: 'europe'   },
  { nameAr: 'الدنمارك',              flag: '🇩🇰', utc: 1,   utcLabel: 'UTC+1',    tz: 'Europe/Copenhagen',              dstNote: true,  capital: 'كوبنهاغن',    group: 'europe'   },
  { nameAr: 'النرويج',               flag: '🇳🇴', utc: 1,   utcLabel: 'UTC+1',    tz: 'Europe/Oslo',                    dstNote: true,  capital: 'أوسلو',       group: 'europe'   },
  { nameAr: 'بولندا',                flag: '🇵🇱', utc: 1,   utcLabel: 'UTC+1',    tz: 'Europe/Warsaw',                  dstNote: true,  capital: 'وارسو',       group: 'europe'   },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+2 — Eastern Europe + East/South Africa + Arab Levant
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'مصر',                   flag: '🇪🇬', utc: 2,   utcLabel: 'UTC+2',    tz: 'Africa/Cairo',                   dstNote: true,  capital: 'القاهرة',     group: 'arab'     }, // DST restored 2023
  { nameAr: 'ليبيا',                 flag: '🇱🇾', utc: 2,   utcLabel: 'UTC+2',    tz: 'Africa/Tripoli',                 dstNote: false, capital: 'طرابلس',      group: 'arab'     },
  { nameAr: 'لبنان',                 flag: '🇱🇧', utc: 2,   utcLabel: 'UTC+2',    tz: 'Asia/Beirut',                    dstNote: true,  capital: 'بيروت',       group: 'arab'     },
  { nameAr: 'فلسطين',                flag: '🇵🇸', utc: 2,   utcLabel: 'UTC+2',    tz: 'Asia/Gaza',                      dstNote: true,  capital: 'رام الله',    group: 'arab'     },
  { nameAr: 'جنوب أفريقيا',          flag: '🇿🇦', utc: 2,   utcLabel: 'UTC+2',    tz: 'Africa/Johannesburg',            dstNote: false, capital: 'بريتوريا',    group: 'africa'   },
  { nameAr: 'زمبابوي',               flag: '🇿🇼', utc: 2,   utcLabel: 'UTC+2',    tz: 'Africa/Harare',                  dstNote: false, capital: 'هراري',       group: 'africa'   },
  { nameAr: 'اليونان',               flag: '🇬🇷', utc: 2,   utcLabel: 'UTC+2',    tz: 'Europe/Athens',                  dstNote: true,  capital: 'أثينا',       group: 'europe'   },
  { nameAr: 'رومانيا',               flag: '🇷🇴', utc: 2,   utcLabel: 'UTC+2',    tz: 'Europe/Bucharest',               dstNote: true,  capital: 'بوخارست',     group: 'europe'   },
  { nameAr: 'أوكرانيا',              flag: '🇺🇦', utc: 2,   utcLabel: 'UTC+2',    tz: 'Europe/Kyiv',                    dstNote: true,  capital: 'كييف',        group: 'europe'   },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+3 — Gulf + East Africa + Russia + Turkey
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'السعودية',              flag: '🇸🇦', utc: 3,   utcLabel: 'UTC+3',    tz: 'Asia/Riyadh',                    dstNote: false, capital: 'الرياض',      group: 'arab'     },
  { nameAr: 'الكويت',                flag: '🇰🇼', utc: 3,   utcLabel: 'UTC+3',    tz: 'Asia/Kuwait',                    dstNote: false, capital: 'الكويت',      group: 'arab'     },
  { nameAr: 'قطر',                   flag: '🇶🇦', utc: 3,   utcLabel: 'UTC+3',    tz: 'Asia/Qatar',                     dstNote: false, capital: 'الدوحة',      group: 'arab'     },
  { nameAr: 'البحرين',               flag: '🇧🇭', utc: 3,   utcLabel: 'UTC+3',    tz: 'Asia/Bahrain',                   dstNote: false, capital: 'المنامة',     group: 'arab'     },
  { nameAr: 'العراق',                flag: '🇮🇶', utc: 3,   utcLabel: 'UTC+3',    tz: 'Asia/Baghdad',                   dstNote: false, capital: 'بغداد',       group: 'arab'     },
  { nameAr: 'الأردن',                flag: '🇯🇴', utc: 3,   utcLabel: 'UTC+3',    tz: 'Asia/Amman',                     dstNote: false, capital: 'عمّان',       group: 'arab'     }, // FIX: UTC+3 permanent since Feb 2022
  { nameAr: 'اليمن',                 flag: '🇾🇪', utc: 3,   utcLabel: 'UTC+3',    tz: 'Asia/Aden',                      dstNote: false, capital: 'صنعاء',       group: 'arab'     },
  { nameAr: 'الصومال',               flag: '🇸🇴', utc: 3,   utcLabel: 'UTC+3',    tz: 'Africa/Mogadishu',               dstNote: false, capital: 'مقديشو',      group: 'arab'     },
  { nameAr: 'السودان',               flag: '🇸🇩', utc: 3,   utcLabel: 'UTC+3',    tz: 'Africa/Khartoum',                dstNote: false, capital: 'الخرطوم',     group: 'arab'     },
  { nameAr: 'جيبوتي',                flag: '🇩🇯', utc: 3,   utcLabel: 'UTC+3',    tz: 'Africa/Djibouti',                dstNote: false, capital: 'جيبوتي',      group: 'arab'     },
  { nameAr: 'جزر القمر',             flag: '🇰🇲', utc: 3,   utcLabel: 'UTC+3',    tz: 'Indian/Comoro',                  dstNote: false, capital: 'موروني',      group: 'arab'     },
  { nameAr: 'سوريا',                 flag: '🇸🇾', utc: 3,   utcLabel: 'UTC+3',    tz: 'Asia/Damascus',                  dstNote: false, capital: 'دمشق',        group: 'arab'     }, // DST abolished Oct 2022
  { nameAr: 'تركيا',                 flag: '🇹🇷', utc: 3,   utcLabel: 'UTC+3',    tz: 'Europe/Istanbul',                dstNote: false, capital: 'إسطنبول',     group: 'neighbour'},
  { nameAr: 'روسيا - موسكو',         flag: '🇷🇺', utc: 3,   utcLabel: 'UTC+3',    tz: 'Europe/Moscow',                  dstNote: false, capital: 'موسكو',       group: 'neighbour'}, // permanent UTC+3 since Oct 2014
  { nameAr: 'إثيوبيا',               flag: '🇪🇹', utc: 3,   utcLabel: 'UTC+3',    tz: 'Africa/Addis_Ababa',             dstNote: false, capital: 'أديس أبابا',  group: 'africa'   },
  { nameAr: 'كينيا',                 flag: '🇰🇪', utc: 3,   utcLabel: 'UTC+3',    tz: 'Africa/Nairobi',                 dstNote: false, capital: 'نيروبي',      group: 'africa'   },
  { nameAr: 'إريتريا',               flag: '🇪🇷', utc: 3,   utcLabel: 'UTC+3',    tz: 'Africa/Asmara',                  dstNote: false, capital: 'أسمرة',       group: 'africa'   }, // Arab League observer
  { nameAr: 'تنزانيا',               flag: '🇹🇿', utc: 3,   utcLabel: 'UTC+3',    tz: 'Africa/Dar_es_Salaam',           dstNote: false, capital: 'دودوما',      group: 'africa'   },
  { nameAr: 'أوغندا',                flag: '🇺🇬', utc: 3,   utcLabel: 'UTC+3',    tz: 'Africa/Kampala',                 dstNote: false, capital: 'كمبالا',      group: 'africa'   },
  { nameAr: 'مدغشقر',                flag: '🇲🇬', utc: 3,   utcLabel: 'UTC+3',    tz: 'Indian/Antananarivo',            dstNote: false, capital: 'أنتاناناريفو', group: 'africa'  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+3:30 — Iran
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'إيران',                 flag: '🇮🇷', utc: 3.5, utcLabel: 'UTC+3:30', tz: 'Asia/Tehran',                    dstNote: true,  capital: 'طهران',       group: 'neighbour'},

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+4 — Gulf + Caucasus
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'الإمارات',              flag: '🇦🇪', utc: 4,   utcLabel: 'UTC+4',    tz: 'Asia/Dubai',                     dstNote: false, capital: 'أبوظبي',      group: 'arab'     },
  { nameAr: 'عُمان',                 flag: '🇴🇲', utc: 4,   utcLabel: 'UTC+4',    tz: 'Asia/Muscat',                    dstNote: false, capital: 'مسقط',        group: 'arab'     },
  { nameAr: 'أذربيجان',              flag: '🇦🇿', utc: 4,   utcLabel: 'UTC+4',    tz: 'Asia/Baku',                      dstNote: false, capital: 'باكو',        group: 'neighbour'}, // DST abolished 2016
  { nameAr: 'جورجيا',                flag: '🇬🇪', utc: 4,   utcLabel: 'UTC+4',    tz: 'Asia/Tbilisi',                   dstNote: false, capital: 'تبليسي',      group: 'neighbour'}, // DST abolished 2005
  { nameAr: 'أرمينيا',               flag: '🇦🇲', utc: 4,   utcLabel: 'UTC+4',    tz: 'Asia/Yerevan',                   dstNote: false, capital: 'يريفان',      group: 'neighbour'},
  { nameAr: 'موريشيوس',              flag: '🇲🇺', utc: 4,   utcLabel: 'UTC+4',    tz: 'Indian/Mauritius',               dstNote: false, capital: 'بورت لويس',   group: 'africa'   },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+4:30 — Afghanistan
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'أفغانستان',             flag: '🇦🇫', utc: 4.5, utcLabel: 'UTC+4:30', tz: 'Asia/Kabul',                     dstNote: false, capital: 'كابول',       group: 'neighbour'},

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+5 — Pakistan + Central Asia
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'باكستان',               flag: '🇵🇰', utc: 5,   utcLabel: 'UTC+5',    tz: 'Asia/Karachi',                   dstNote: false, capital: 'إسلام آباد',  group: 'asia'     }, // DST abolished 2009
  { nameAr: 'أوزبكستان',             flag: '🇺🇿', utc: 5,   utcLabel: 'UTC+5',    tz: 'Asia/Tashkent',                  dstNote: false, capital: 'طشقند',       group: 'neighbour'},
  { nameAr: 'كازاخستان',             flag: '🇰🇿', utc: 5,   utcLabel: 'UTC+5',    tz: 'Asia/Almaty',                    dstNote: false, capital: 'أستانا',      group: 'neighbour'},
  { nameAr: 'طاجيكستان',             flag: '🇹🇯', utc: 5,   utcLabel: 'UTC+5',    tz: 'Asia/Dushanbe',                  dstNote: false, capital: 'دوشانبه',     group: 'neighbour'},
  { nameAr: 'تركمانستان',            flag: '🇹🇲', utc: 5,   utcLabel: 'UTC+5',    tz: 'Asia/Ashgabat',                  dstNote: false, capital: 'عشق آباد',    group: 'neighbour'},

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+5:30 — India + Sri Lanka
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'الهند',                 flag: '🇮🇳', utc: 5.5, utcLabel: 'UTC+5:30', tz: 'Asia/Kolkata',                   dstNote: false, capital: 'نيودلهي',     group: 'asia'     },
  { nameAr: 'سريلانكا',              flag: '🇱🇰', utc: 5.5, utcLabel: 'UTC+5:30', tz: 'Asia/Colombo',                   dstNote: false, capital: 'كولومبو',     group: 'asia'     },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+6 — Bangladesh + Kyrgyzstan
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'بنغلاديش',              flag: '🇧🇩', utc: 6,   utcLabel: 'UTC+6',    tz: 'Asia/Dhaka',                     dstNote: false, capital: 'دكا',         group: 'asia'     },
  { nameAr: 'قيرغيزستان',            flag: '🇰🇬', utc: 6,   utcLabel: 'UTC+6',    tz: 'Asia/Bishkek',                   dstNote: false, capital: 'بيشكيك',      group: 'neighbour'},

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+7 — South-East Asia
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'إندونيسيا',             flag: '🇮🇩', utc: 7,   utcLabel: 'UTC+7',    tz: 'Asia/Jakarta',                   dstNote: false, capital: 'جاكرتا',      group: 'asia'     }, // WIB – Java/Sumatra
  { nameAr: 'تايلاند',               flag: '🇹🇭', utc: 7,   utcLabel: 'UTC+7',    tz: 'Asia/Bangkok',                   dstNote: false, capital: 'بانكوك',      group: 'asia'     },
  { nameAr: 'فيتنام',                flag: '🇻🇳', utc: 7,   utcLabel: 'UTC+7',    tz: 'Asia/Ho_Chi_Minh',               dstNote: false, capital: 'هانوي',       group: 'asia'     },
  { nameAr: 'كمبوديا',               flag: '🇰🇭', utc: 7,   utcLabel: 'UTC+7',    tz: 'Asia/Phnom_Penh',                dstNote: false, capital: 'بنوم بنه',    group: 'asia'     },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+8 — East & South-East Asia
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'الصين',                 flag: '🇨🇳', utc: 8,   utcLabel: 'UTC+8',    tz: 'Asia/Shanghai',                  dstNote: false, capital: 'بكين',        group: 'asia'     },
  { nameAr: 'ماليزيا',               flag: '🇲🇾', utc: 8,   utcLabel: 'UTC+8',    tz: 'Asia/Kuala_Lumpur',              dstNote: false, capital: 'كوالالمبور',  group: 'asia'     },
  { nameAr: 'سنغافورة',              flag: '🇸🇬', utc: 8,   utcLabel: 'UTC+8',    tz: 'Asia/Singapore',                 dstNote: false, capital: 'سنغافورة',    group: 'asia'     },
  { nameAr: 'الفلبين',               flag: '🇵🇭', utc: 8,   utcLabel: 'UTC+8',    tz: 'Asia/Manila',                    dstNote: false, capital: 'مانيلا',      group: 'asia'     },
  { nameAr: 'هونغ كونغ',             flag: '🇭🇰', utc: 8,   utcLabel: 'UTC+8',    tz: 'Asia/Hong_Kong',                 dstNote: false, capital: 'هونغ كونغ',   group: 'asia'     },
  { nameAr: 'تايوان',                flag: '🇹🇼', utc: 8,   utcLabel: 'UTC+8',    tz: 'Asia/Taipei',                    dstNote: false, capital: 'تايبيه',      group: 'asia'     },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+9 — East Asia
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'اليابان',               flag: '🇯🇵', utc: 9,   utcLabel: 'UTC+9',    tz: 'Asia/Tokyo',                     dstNote: false, capital: 'طوكيو',       group: 'asia'     },
  { nameAr: 'كوريا الجنوبية',        flag: '🇰🇷', utc: 9,   utcLabel: 'UTC+9',    tz: 'Asia/Seoul',                     dstNote: false, capital: 'سيول',        group: 'asia'     },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTC+10 — Australia (Eastern)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { nameAr: 'أستراليا - سيدني',      flag: '🇦🇺', utc: 10,  utcLabel: 'UTC+10',   tz: 'Australia/Sydney',               dstNote: true,  capital: 'سيدني',       group: 'americas' }, // AEST+1=AEDT in Oct–Apr

]

// ─────────────────────────────────────────────────────────────────
// Helper: builds utcLabel from numeric offset
//   -8   → 'UTC-8'
//   0    → 'UTC+0'
//   3.5  → 'UTC+3:30'
//   4.5  → 'UTC+4:30'
//   5.5  → 'UTC+5:30'
//   10   → 'UTC+10'
// ─────────────────────────────────────────────────────────────────
export function buildUtcLabel(utc) {
  const sign  = utc < 0 ? '-' : '+'
  const abs   = Math.abs(utc)
  const hours = Math.floor(abs)
  const mins  = Math.round((abs - hours) * 60)
  return mins === 0
    ? `UTC${sign}${hours}`
    : `UTC${sign}${hours}:${String(mins).padStart(2, '0')}`
}

// All unique UTC offsets in geographic order (west → east)
const UTC_OFFSETS = [-8, -6, -5, -3, 0, 1, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8, 9, 10]

// Group by UTC offset for the table display in SectionArabTimezones
export const TIMEZONE_GROUPS = UTC_OFFSETS
  .map((utc) => ({
    utc,
    utcLabel: buildUtcLabel(utc),
    countries: ARAB_TIMEZONES.filter((c) => c.utc === utc),
  }))
  .filter((g) => g.countries.length > 0)
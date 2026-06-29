/**
 * popularPairs.js
 * High-demand time-difference pairs for Arabic search.
 * Sorted roughly by estimated search volume (Gulf → Levant → Maghreb → diaspora).
 *
 * Slug format: {country-slug}-{city-slug}
 * e.g. /time-difference/saudi-arabia-riyadh/egypt-cairo
 *
 * Adding a pair here automatically:
 *   1. Adds it to generateStaticParams (prerendered page)
 *   2. Adds it to the sitemap (SEO indexable)
 */

export const POPULAR_PAIRS = [
  // ── Tier 1: Gulf hub → Arab world (highest Arabic search volume) ────────────
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    labelAr: 'السعودية ↔ مصر',
    volume: 'الأعلى بحثاً',
  },
  {
    from: { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    labelAr: 'الإمارات ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'الكويت',   flag: '🇰🇼', slug: 'kuwait-kuwait-city',              tz: 'Asia/Kuwait'          },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    labelAr: 'الكويت ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'الدوحة',   flag: '🇶🇦', slug: 'qatar-doha',                      tz: 'Asia/Qatar'           },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    labelAr: 'قطر ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'مسقط',     flag: '🇴🇲', slug: 'oman-muscat',                     tz: 'Asia/Muscat'          },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    labelAr: 'عُمان ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'المنامة',  flag: '🇧🇭', slug: 'bahrain-manama',                  tz: 'Asia/Bahrain'         },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    labelAr: 'البحرين ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'بغداد',    flag: '🇮🇶', slug: 'iraq-baghdad',                    tz: 'Asia/Baghdad'         },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    labelAr: 'العراق ↔ مصر',
    volume: null,
  },

  // ── Tier 1b: Saudi ↔ Gulf neighbours ────────────────────────────────────────
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    labelAr: 'السعودية ↔ الإمارات',
    volume: null,
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'الدوحة',   flag: '🇶🇦', slug: 'qatar-doha',                      tz: 'Asia/Qatar'           },
    labelAr: 'السعودية ↔ قطر',
    volume: null,
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'الكويت',   flag: '🇰🇼', slug: 'kuwait-kuwait-city',              tz: 'Asia/Kuwait'          },
    labelAr: 'السعودية ↔ الكويت',
    volume: null,
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'المنامة',  flag: '🇧🇭', slug: 'bahrain-manama',                  tz: 'Asia/Bahrain'         },
    labelAr: 'السعودية ↔ البحرين',
    volume: null,
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'مسقط',     flag: '🇴🇲', slug: 'oman-muscat',                     tz: 'Asia/Muscat'          },
    labelAr: 'السعودية ↔ عُمان',
    volume: null,
  },
  {
    from: { nameAr: 'الكويت',   flag: '🇰🇼', slug: 'kuwait-kuwait-city',              tz: 'Asia/Kuwait'          },
    to:   { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    labelAr: 'الكويت ↔ الإمارات',
    volume: null,
  },
  {
    from: { nameAr: 'مسقط',     flag: '🇴🇲', slug: 'oman-muscat',                     tz: 'Asia/Muscat'          },
    to:   { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    labelAr: 'عُمان ↔ الإمارات',
    volume: null,
  },

  // ── Tier 2: Gulf → London / Europe (business + diaspora) ────────────────────
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'لندن',     flag: '🇬🇧', slug: 'united-kingdom-london',           tz: 'Europe/London'        },
    labelAr: 'السعودية ↔ لندن',
    volume: null,
  },
  {
    from: { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    to:   { nameAr: 'لندن',     flag: '🇬🇧', slug: 'united-kingdom-london',           tz: 'Europe/London'        },
    labelAr: 'الإمارات ↔ لندن',
    volume: null,
  },
  {
    from: { nameAr: 'الكويت',   flag: '🇰🇼', slug: 'kuwait-kuwait-city',              tz: 'Asia/Kuwait'          },
    to:   { nameAr: 'لندن',     flag: '🇬🇧', slug: 'united-kingdom-london',           tz: 'Europe/London'        },
    labelAr: 'الكويت ↔ لندن',
    volume: null,
  },
  {
    from: { nameAr: 'الدوحة',   flag: '🇶🇦', slug: 'qatar-doha',                      tz: 'Asia/Qatar'           },
    to:   { nameAr: 'لندن',     flag: '🇬🇧', slug: 'united-kingdom-london',           tz: 'Europe/London'        },
    labelAr: 'قطر ↔ لندن',
    volume: null,
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'باريس',    flag: '🇫🇷', slug: 'france-paris',                    tz: 'Europe/Paris'         },
    labelAr: 'السعودية ↔ فرنسا',
    volume: null,
  },
  {
    from: { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    to:   { nameAr: 'باريس',    flag: '🇫🇷', slug: 'france-paris',                    tz: 'Europe/Paris'         },
    labelAr: 'الإمارات ↔ فرنسا',
    volume: null,
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'برلين',    flag: '🇩🇪', slug: 'germany-berlin',                  tz: 'Europe/Berlin'        },
    labelAr: 'السعودية ↔ ألمانيا',
    volume: null,
  },
  {
    from: { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    to:   { nameAr: 'برلين',    flag: '🇩🇪', slug: 'germany-berlin',                  tz: 'Europe/Berlin'        },
    labelAr: 'الإمارات ↔ ألمانيا',
    volume: null,
  },

  // ── Tier 2b: Gulf → Americas ─────────────────────────────────────────────────
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'نيويورك',  flag: '🇺🇸', slug: 'united-states-new-york-city',     tz: 'America/New_York'     },
    labelAr: 'السعودية ↔ أمريكا',
    volume: null,
  },
  {
    from: { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    to:   { nameAr: 'نيويورك',  flag: '🇺🇸', slug: 'united-states-new-york-city',     tz: 'America/New_York'     },
    labelAr: 'الإمارات ↔ أمريكا',
    volume: null,
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'تورنتو',   flag: '🇨🇦', slug: 'canada-toronto',                  tz: 'America/Toronto'      },
    labelAr: 'السعودية ↔ كندا',
    volume: null,
  },
  {
    from: { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    to:   { nameAr: 'نيويورك',  flag: '🇺🇸', slug: 'united-states-new-york-city',     tz: 'America/New_York'     },
    labelAr: 'مصر ↔ أمريكا',
    volume: null,
  },
  {
    from: { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    to:   { nameAr: 'تورنتو',   flag: '🇨🇦', slug: 'canada-toronto',                  tz: 'America/Toronto'      },
    labelAr: 'مصر ↔ كندا',
    volume: null,
  },

  // ── Tier 3: Levant ↔ Arab world ──────────────────────────────────────────────
  {
    from: { nameAr: 'بيروت',    flag: '🇱🇧', slug: 'lebanon-beirut',                  tz: 'Asia/Beirut'          },
    to:   { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    labelAr: 'لبنان ↔ السعودية',
    volume: null,
  },
  {
    from: { nameAr: 'بيروت',    flag: '🇱🇧', slug: 'lebanon-beirut',                  tz: 'Asia/Beirut'          },
    to:   { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    labelAr: 'لبنان ↔ الإمارات',
    volume: null,
  },
  {
    from: { nameAr: 'بيروت',    flag: '🇱🇧', slug: 'lebanon-beirut',                  tz: 'Asia/Beirut'          },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    labelAr: 'لبنان ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'بيروت',    flag: '🇱🇧', slug: 'lebanon-beirut',                  tz: 'Asia/Beirut'          },
    to:   { nameAr: 'لندن',     flag: '🇬🇧', slug: 'united-kingdom-london',           tz: 'Europe/London'        },
    labelAr: 'لبنان ↔ لندن',
    volume: null,
  },
  {
    from: { nameAr: 'بيروت',    flag: '🇱🇧', slug: 'lebanon-beirut',                  tz: 'Asia/Beirut'          },
    to:   { nameAr: 'باريس',    flag: '🇫🇷', slug: 'france-paris',                    tz: 'Europe/Paris'         },
    labelAr: 'لبنان ↔ فرنسا',
    volume: null,
  },
  {
    from: { nameAr: 'عمّان',    flag: '🇯🇴', slug: 'jordan-amman',                    tz: 'Asia/Amman'           },
    to:   { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    labelAr: 'الأردن ↔ السعودية',
    volume: null,
  },
  {
    from: { nameAr: 'عمّان',    flag: '🇯🇴', slug: 'jordan-amman',                    tz: 'Asia/Amman'           },
    to:   { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    labelAr: 'الأردن ↔ الإمارات',
    volume: null,
  },
  {
    from: { nameAr: 'عمّان',    flag: '🇯🇴', slug: 'jordan-amman',                    tz: 'Asia/Amman'           },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    labelAr: 'الأردن ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'عمّان',    flag: '🇯🇴', slug: 'jordan-amman',                    tz: 'Asia/Amman'           },
    to:   { nameAr: 'لندن',     flag: '🇬🇧', slug: 'united-kingdom-london',           tz: 'Europe/London'        },
    labelAr: 'الأردن ↔ لندن',
    volume: null,
  },
  {
    from: { nameAr: 'بغداد',    flag: '🇮🇶', slug: 'iraq-baghdad',                    tz: 'Asia/Baghdad'         },
    to:   { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    labelAr: 'العراق ↔ السعودية',
    volume: null,
  },
  {
    from: { nameAr: 'بغداد',    flag: '🇮🇶', slug: 'iraq-baghdad',                    tz: 'Asia/Baghdad'         },
    to:   { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    labelAr: 'العراق ↔ الإمارات',
    volume: null,
  },
  {
    from: { nameAr: 'بغداد',    flag: '🇮🇶', slug: 'iraq-baghdad',                    tz: 'Asia/Baghdad'         },
    to:   { nameAr: 'لندن',     flag: '🇬🇧', slug: 'united-kingdom-london',           tz: 'Europe/London'        },
    labelAr: 'العراق ↔ لندن',
    volume: null,
  },

  // ── Tier 4: Maghreb ──────────────────────────────────────────────────────────
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'الرباط',   flag: '🇲🇦', slug: 'morocco-rabat',                   tz: 'Africa/Casablanca'    },
    labelAr: 'السعودية ↔ المغرب',
    volume: null,
  },
  {
    from: { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    to:   { nameAr: 'الرباط',   flag: '🇲🇦', slug: 'morocco-rabat',                   tz: 'Africa/Casablanca'    },
    labelAr: 'مصر ↔ المغرب',
    volume: null,
  },
  {
    from: { nameAr: 'الجزائر',  flag: '🇩🇿', slug: 'algeria-algiers',                 tz: 'Africa/Algiers'       },
    to:   { nameAr: 'باريس',    flag: '🇫🇷', slug: 'france-paris',                    tz: 'Europe/Paris'         },
    labelAr: 'الجزائر ↔ فرنسا',
    volume: null,
  },
  {
    from: { nameAr: 'الجزائر',  flag: '🇩🇿', slug: 'algeria-algiers',                 tz: 'Africa/Algiers'       },
    to:   { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    labelAr: 'الجزائر ↔ السعودية',
    volume: null,
  },
  {
    from: { nameAr: 'تونس',     flag: '🇹🇳', slug: 'tunisia-tunis',                   tz: 'Africa/Tunis'         },
    to:   { nameAr: 'باريس',    flag: '🇫🇷', slug: 'france-paris',                    tz: 'Europe/Paris'         },
    labelAr: 'تونس ↔ فرنسا',
    volume: null,
  },
  {
    from: { nameAr: 'تونس',     flag: '🇹🇳', slug: 'tunisia-tunis',                   tz: 'Africa/Tunis'         },
    to:   { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    labelAr: 'تونس ↔ السعودية',
    volume: null,
  },
  {
    from: { nameAr: 'الرباط',   flag: '🇲🇦', slug: 'morocco-rabat',                   tz: 'Africa/Casablanca'    },
    to:   { nameAr: 'باريس',    flag: '🇫🇷', slug: 'france-paris',                    tz: 'Europe/Paris'         },
    labelAr: 'المغرب ↔ باريس',
    volume: null,
  },
  {
    from: { nameAr: 'الرباط',   flag: '🇲🇦', slug: 'morocco-rabat',                   tz: 'Africa/Casablanca'    },
    to:   { nameAr: 'مدريد',    flag: '🇪🇸', slug: 'spain-madrid',                    tz: 'Europe/Madrid'        },
    labelAr: 'المغرب ↔ إسبانيا',
    volume: null,
  },
  {
    from: { nameAr: 'الرباط',   flag: '🇲🇦', slug: 'morocco-rabat',                   tz: 'Africa/Casablanca'    },
    to:   { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    labelAr: 'المغرب ↔ السعودية',
    volume: null,
  },

  // ── Tier 5: Egypt ↔ Europe / diaspora ────────────────────────────────────────
  {
    from: { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    to:   { nameAr: 'لندن',     flag: '🇬🇧', slug: 'united-kingdom-london',           tz: 'Europe/London'        },
    labelAr: 'مصر ↔ بريطانيا',
    volume: null,
  },
  {
    from: { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    to:   { nameAr: 'باريس',    flag: '🇫🇷', slug: 'france-paris',                    tz: 'Europe/Paris'         },
    labelAr: 'مصر ↔ فرنسا',
    volume: null,
  },
  {
    from: { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    to:   { nameAr: 'برلين',    flag: '🇩🇪', slug: 'germany-berlin',                  tz: 'Europe/Berlin'        },
    labelAr: 'مصر ↔ ألمانيا',
    volume: null,
  },

  // ── Tier 6: Gulf → Asia (expat workers) ──────────────────────────────────────
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'نيودلهي',  flag: '🇮🇳', slug: 'india-new-delhi',                 tz: 'Asia/Kolkata'         },
    labelAr: 'السعودية ↔ الهند',
    volume: null,
  },
  {
    from: { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    to:   { nameAr: 'نيودلهي',  flag: '🇮🇳', slug: 'india-new-delhi',                 tz: 'Asia/Kolkata'         },
    labelAr: 'الإمارات ↔ الهند',
    volume: null,
  },
  {
    from: { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    to:   { nameAr: 'سنغافورة', flag: '🇸🇬', slug: 'singapore-singapore',             tz: 'Asia/Singapore'       },
    labelAr: 'الإمارات ↔ سنغافورة',
    volume: null,
  },

  // ── Tier 7: Sudan + Syria diaspora ───────────────────────────────────────────
  {
    from: { nameAr: 'الخرطوم',  flag: '🇸🇩', slug: 'sudan-khartoum',                  tz: 'Africa/Khartoum'      },
    to:   { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    labelAr: 'السودان ↔ السعودية',
    volume: null,
  },
  {
    from: { nameAr: 'الخرطوم',  flag: '🇸🇩', slug: 'sudan-khartoum',                  tz: 'Africa/Khartoum'      },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    labelAr: 'السودان ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'دمشق',     flag: '🇸🇾', slug: 'syria-damascus',                  tz: 'Asia/Damascus'        },
    to:   { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    labelAr: 'سوريا ↔ السعودية',
    volume: null,
  },
  {
    from: { nameAr: 'دمشق',     flag: '🇸🇾', slug: 'syria-damascus',                  tz: 'Asia/Damascus'        },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    labelAr: 'سوريا ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'دمشق',     flag: '🇸🇾', slug: 'syria-damascus',                  tz: 'Asia/Damascus'        },
    to:   { nameAr: 'برلين',    flag: '🇩🇪', slug: 'germany-berlin',                  tz: 'Europe/Berlin'        },
    labelAr: 'سوريا ↔ ألمانيا',
    volume: null,
  },

  // ── Tier 8: Turkey (Arab tourism + diaspora) ─────────────────────────────────
  {
    from: { nameAr: 'إسطنبول',  flag: '🇹🇷', slug: 'turkey-istanbul',                 tz: 'Europe/Istanbul'      },
    to:   { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',             tz: 'Asia/Riyadh'          },
    labelAr: 'تركيا ↔ السعودية',
    volume: null,
  },
  {
    from: { nameAr: 'إسطنبول',  flag: '🇹🇷', slug: 'turkey-istanbul',                 tz: 'Europe/Istanbul'      },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                     tz: 'Africa/Cairo'         },
    labelAr: 'تركيا ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'إسطنبول',  flag: '🇹🇷', slug: 'turkey-istanbul',                 tz: 'Europe/Istanbul'      },
    to:   { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',      tz: 'Asia/Dubai'           },
    labelAr: 'تركيا ↔ الإمارات',
    volume: null,
  },
]

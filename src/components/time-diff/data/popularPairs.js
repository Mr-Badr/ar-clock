/**
 * popularPairs.js
 * The 12 most-searched time-difference pairs in Arabic search.
 * Sorted by estimated search volume.
 *
 * slug format mirrors /time-difference/[from]/[to] route
 * e.g. /time-difference/saudi-arabia-riyadh/egypt-cairo
 */

export const POPULAR_PAIRS = [
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',          tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                  tz: 'Africa/Cairo'         },
    labelAr: 'السعودية ↔ مصر',
    volume: 'الأعلى بحثاً',
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',          tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'الرباط',   flag: '🇲🇦', slug: 'morocco-rabat',                tz: 'Africa/Casablanca'    },
    labelAr: 'السعودية ↔ المغرب',
    volume: null,
  },
  {
    from: { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',   tz: 'Asia/Dubai'           },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                  tz: 'Africa/Cairo'         },
    labelAr: 'الإمارات ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',          tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'لندن',     flag: '🇬🇧', slug: 'united-kingdom-london',        tz: 'Europe/London'        },
    labelAr: 'السعودية ↔ لندن',
    volume: null,
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',          tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',   tz: 'Asia/Dubai'           },
    labelAr: 'السعودية ↔ الإمارات',
    volume: null,
  },
  {
    from: { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                  tz: 'Africa/Cairo'         },
    to:   { nameAr: 'الرباط',   flag: '🇲🇦', slug: 'morocco-rabat',                tz: 'Africa/Casablanca'    },
    labelAr: 'مصر ↔ المغرب',
    volume: null,
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',          tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'عمّان',    flag: '🇯🇴', slug: 'jordan-amman',                 tz: 'Asia/Amman'           },
    labelAr: 'السعودية ↔ الأردن',
    volume: null,
  },
  {
    from: { nameAr: 'دبي',      flag: '🇦🇪', slug: 'united-arab-emirates-dubai',   tz: 'Asia/Dubai'           },
    to:   { nameAr: 'لندن',     flag: '🇬🇧', slug: 'united-kingdom-london',        tz: 'Europe/London'        },
    labelAr: 'الإمارات ↔ لندن',
    volume: null,
  },
  {
    from: { nameAr: 'الكويت',   flag: '🇰🇼', slug: 'kuwait-kuwait-city',           tz: 'Asia/Kuwait'          },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                  tz: 'Africa/Cairo'         },
    labelAr: 'الكويت ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',          tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'باريس',    flag: '🇫🇷', slug: 'france-paris',                 tz: 'Europe/Paris'         },
    labelAr: 'السعودية ↔ فرنسا',
    volume: null,
  },
  {
    from: { nameAr: 'بغداد',    flag: '🇮🇶', slug: 'iraq-baghdad',                 tz: 'Asia/Baghdad'         },
    to:   { nameAr: 'القاهرة',  flag: '🇪🇬', slug: 'egypt-cairo',                  tz: 'Africa/Cairo'         },
    labelAr: 'العراق ↔ مصر',
    volume: null,
  },
  {
    from: { nameAr: 'الرياض',   flag: '🇸🇦', slug: 'saudi-arabia-riyadh',          tz: 'Asia/Riyadh'          },
    to:   { nameAr: 'نيويورك',  flag: '🇺🇸', slug: 'united-states-new-york-city',  tz: 'America/New_York'     },
    labelAr: 'السعودية ↔ أمريكا',
    volume: null,
  },
]

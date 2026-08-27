/**
 * fuel-prices-data.js — base/fallback data for every fuel-price page. Each country's `grades[]`
 * entries carry a `sourceKey` — the exact field name openvan.camp's API uses for that grade
 * (see fuel-prices-live.js) — so the live layer knows how to map its response onto our grades.
 *
 * Every country here has a confirmed free LIVE path via openvan.camp (see fuel-prices-live.js's
 * header for what was rejected and why: oilpriceapi.com's Gulf retail line never worked;
 * fuel.abbara.dev mislabels its own data). If a country's live fetch ever fails, these numbers
 * are the fallback shown, honestly labeled as such (never as "live").
 *
 * `changeFromLastMonth: null` means "not available this reading" — render as "—", never a
 * fabricated zero. A real, sourced `0` means "confirmed unchanged."
 *
 * Values below were verified directly against the live API (2026-08-25) — for Saudi Arabia and
 * UAE specifically, they also matched independent research (Aramco/UAE Fuel Price Committee
 * announcements, cross-checked via WebFetch) exactly. Treat this file as a snapshot, not
 * hand-maintained — the live path is primary for every country; nothing here needs monthly edits.
 */

export const FUEL_PRICE_DATA = {
  sa: {
    countryCode: 'sa',
    countryName: 'السعودية',
    currency: 'ريال',
    currencyCode: 'SAR',
    effectiveMonth: 'أغسطس',
    authority: 'أرامكو السعودية',
    mechanism: 'تعلن أرامكو السعودية أسعار الوقود المحلي شهرياً، وتُطبَّق الأسعار الجديدة اعتباراً من اليوم الأول من كل شهر ميلادي.',
    sourceUrl: 'https://www.aramco.com/en/what-we-do/energy-products/retail-fuels',
    sourceLabel: 'أرامكو السعودية — صفحة الوقود بالتجزئة الرسمية',
    grades: [
      { grade: '91', label: 'بنزين 91', sourceKey: 'gasoline', price: 2.18, changeFromLastMonth: 0 },
      { grade: '95', label: 'بنزين 95', sourceKey: 'gasoline_premium', price: 2.33, changeFromLastMonth: 0 },
      { grade: '98', label: 'بنزين 98', sourceKey: 'gasoline_super', price: 4.49, changeFromLastMonth: 0.2 },
      { grade: 'diesel', label: 'ديزل', sourceKey: 'diesel', price: 1.79, changeFromLastMonth: 0 },
    ],
  },
  ae: {
    countryCode: 'ae',
    countryName: 'الإمارات',
    currency: 'درهم',
    currencyCode: 'AED',
    effectiveMonth: 'أغسطس',
    authority: 'لجنة أسعار الوقود الإماراتية',
    mechanism: 'تضم لجنة أسعار الوقود ممثلين عن وزارة الطاقة والبنية التحتية وشركات النفط الكبرى، وتُعلن أسعار الشهر القادم في آخر يوم من الشهر الحالي — آلية معتمدة منذ أغسطس 2015 لربط الأسعار المحلية بحركة أسعار خام برنت العالمية.',
    sourceUrl: 'https://www.wam.ae/en/article/17clghp-uae-fuel-price-committee-announces-prices-for',
    sourceLabel: 'وكالة أنباء الإمارات (وام) — إعلان لجنة أسعار الوقود',
    grades: [
      { grade: '91', label: 'بنزين E-Plus 91', sourceKey: 'gasoline_regular', price: 3.41, changeFromLastMonth: 0.2 },
      { grade: '95', label: 'بنزين Special 95', sourceKey: 'gasoline', price: 3.49, changeFromLastMonth: 0.2 },
      { grade: '98', label: 'بنزين Super 98', sourceKey: 'gasoline_super', price: 3.6, changeFromLastMonth: 0.2 },
      { grade: 'diesel', label: 'ديزل', sourceKey: 'diesel', price: 3.8, changeFromLastMonth: 0.2 },
    ],
  },
  kw: {
    countryCode: 'kw',
    countryName: 'الكويت',
    currency: 'دينار',
    currencyCode: 'KWD',
    effectiveMonth: 'أغسطس',
    authority: 'مؤسسة البترول الكويتية (KNPC)',
    mechanism: 'تحدد مؤسسة البترول الكويتية أسعار الوقود المحلي شهرياً بالتنسيق مع وزارة النفط.',
    sourceUrl: 'https://www.knpc.com/en',
    sourceLabel: 'مؤسسة البترول الكويتية — الموقع الرسمي',
    grades: [
      { grade: '91', label: 'بنزين 91', sourceKey: 'gasoline', price: 0.0989, changeFromLastMonth: 0 },
      { grade: '98', label: 'بنزين ممتاز (Super)', sourceKey: 'gasoline_super', price: 0.2094, changeFromLastMonth: 0 },
      { grade: 'diesel', label: 'ديزل', sourceKey: 'diesel', price: 0.115, changeFromLastMonth: 0 },
    ],
  },
  qa: {
    countryCode: 'qa',
    countryName: 'قطر',
    currency: 'ريال',
    currencyCode: 'QAR',
    effectiveMonth: 'أغسطس',
    authority: 'ووقود (مؤسسة قطر للوقود)',
    mechanism: 'تعلن ووقود (مؤسسة قطر للوقود) أسعار البنزين والديزل شهرياً، بالتنسيق مع وزارة التجارة والصناعة.',
    sourceUrl: 'https://www.woqod.com.qa/',
    sourceLabel: 'ووقود — الموقع الرسمي',
    grades: [
      { grade: '91', label: 'بنزين ممتاز (Premium)', sourceKey: 'gasoline', price: 2, changeFromLastMonth: -0.0122 },
      { grade: '95', label: 'بنزين سوبر (Super)', sourceKey: 'gasoline_premium', price: 2.1, changeFromLastMonth: 0 },
      { grade: 'diesel', label: 'ديزل', sourceKey: 'diesel', price: 2.05, changeFromLastMonth: 0 },
    ],
  },
  bh: {
    countryCode: 'bh',
    countryName: 'البحرين',
    currency: 'دينار',
    currencyCode: 'BHD',
    effectiveMonth: 'أغسطس',
    authority: 'شركة نفط البحرين (Bapco)',
    mechanism: 'تحدد شركة نفط البحرين أسعار الوقود المحلي بالتنسيق مع وزارة الطاقة والبيئة والشؤون الزراعية شهرياً، غالباً بما يتماشى مع أسعار دول الخليج المجاورة.',
    sourceUrl: 'https://www.bapco.net/',
    sourceLabel: 'شركة نفط البحرين (Bapco) — الموقع الرسمي',
    grades: [
      { grade: '91', label: 'بنزين 91', sourceKey: 'gasoline', price: 0.2208, changeFromLastMonth: 0 },
      { grade: '95', label: 'بنزين 95', sourceKey: 'gasoline_premium', price: 0.24, changeFromLastMonth: 0 },
      { grade: '98', label: 'بنزين 98', sourceKey: 'gasoline_super', price: 0.3054, changeFromLastMonth: 0 },
      { grade: 'diesel', label: 'ديزل', sourceKey: 'diesel', price: 0.2121, changeFromLastMonth: 0 },
    ],
  },
  om: {
    countryCode: 'om',
    countryName: 'عُمان',
    currency: 'ريال',
    currencyCode: 'OMR',
    effectiveMonth: 'أغسطس',
    authority: 'أُو كيو (OQ) ووزارة الطاقة والمعادن',
    mechanism: 'تعتمد عُمان آلية تسعير تلقائية للوقود منذ 2016، تُراجع شهرياً وتربط السعر المحلي بمتوسط أسعار السوق العالمي.',
    sourceUrl: 'https://www.oq.com/',
    sourceLabel: 'أُو كيو (OQ) — الموقع الرسمي',
    grades: [
      { grade: '91', label: 'بنزين Mogas 91', sourceKey: 'gasoline_regular', price: 0.2293, changeFromLastMonth: 0 },
      { grade: '95', label: 'بنزين Mogas 95', sourceKey: 'gasoline', price: 0.2393, changeFromLastMonth: 0 },
      { grade: '98', label: 'بنزين Ultimax 98', sourceKey: 'gasoline_premium', price: 0.4118, changeFromLastMonth: 0 },
      { grade: 'diesel', label: 'ديزل', sourceKey: 'diesel', price: 0.2585, changeFromLastMonth: 0 },
    ],
  },
  eg: {
    countryCode: 'eg',
    countryName: 'مصر',
    currency: 'جنيه',
    currencyCode: 'EGP',
    effectiveMonth: 'أغسطس',
    authority: 'مجلس الوزراء المصري ووزارة البترول',
    mechanism: 'تراجع لجنة التسعير التلقائي التابعة لمجلس الوزراء المصري أسعار الوقود دورياً (كل عدة أشهر عادة، وليس بالضرورة شهرياً)، بالربط مع متوسط أسعار النفط العالمية.',
    sourceUrl: 'https://www.petroleum.gov.eg/ar',
    sourceLabel: 'وزارة البترول والثروة المعدنية المصرية',
    grades: [
      { grade: '80', label: 'بنزين 80', sourceKey: 'gasoline_regular', price: 20.75, changeFromLastMonth: 0 },
      { grade: '92', label: 'بنزين 92', sourceKey: 'gasoline', price: 22.25, changeFromLastMonth: 0 },
      { grade: '95', label: 'بنزين 95', sourceKey: 'gasoline_premium', price: 24, changeFromLastMonth: 0 },
      { grade: 'diesel', label: 'سولار (ديزل)', sourceKey: 'diesel', price: 20.5, changeFromLastMonth: 0 },
    ],
  },
  ma: {
    countryCode: 'ma',
    countryName: 'المغرب',
    currency: 'درهم',
    currencyCode: 'MAD',
    effectiveMonth: 'أغسطس',
    authority: null,
    // Deliberately different from every other country here: Morocco liberalized fuel pricing in
    // 2015 — there is NO government body announcing a monthly price anymore. Distributors set
    // their own retail prices based on import costs and international market movement, which is
    // why `authority` is null and the copy must never claim a government-set monthly price for
    // Morocco (verified via WebSearch, 2026-08-25 — real news coverage of the 2015 deregulation
    // and its ongoing consumer-price consequences).
    mechanism: 'حرّرت المغرب أسعار المحروقات منذ ديسمبر 2015 — لا توجد جهة حكومية واحدة تعلن سعراً شهرياً ثابتاً. كل شركة توزيع تحدد سعرها بناءً على تكلفة الاستيراد وحركة الأسعار العالمية، لذلك قد يختلف السعر قليلاً بين المحطات ويتغير أكثر من مرة في الشهر.',
    sourceUrl: 'https://en.hespress.com/',
    sourceLabel: 'هسبريس — رصد أسعار المحروقات في المغرب',
    grades: [
      { grade: 'gasoline', label: 'بنزين (Essence)', sourceKey: 'gasoline', price: 15.128, changeFromLastMonth: -0.0857 },
      { grade: 'diesel', label: 'غازوال (ديزل)', sourceKey: 'diesel', price: 14.4331, changeFromLastMonth: 0.1771 },
    ],
  },
  jo: {
    countryCode: 'jo',
    countryName: 'الأردن',
    currency: 'دينار',
    currencyCode: 'JOD',
    effectiveMonth: 'أغسطس',
    authority: 'وزارة الطاقة والثروة المعدنية الأردنية',
    mechanism: 'تراجع وزارة الطاقة والثروة المعدنية الأردنية أسعار المشتقات النفطية شهرياً وفق معادلة مرتبطة بمتوسط أسعار النفط العالمية.',
    sourceUrl: 'https://www.memr.gov.jo/',
    sourceLabel: 'وزارة الطاقة والثروة المعدنية الأردنية',
    grades: [
      { grade: '90', label: 'بنزين 90', sourceKey: 'gasoline', price: 1, changeFromLastMonth: 0 },
      { grade: '95', label: 'بنزين ممتاز 95', sourceKey: 'gasoline_premium', price: 1.31, changeFromLastMonth: 0 },
      { grade: '98', label: 'بنزين سوبر 98', sourceKey: 'gasoline_super', price: 1.46, changeFromLastMonth: 0 },
      { grade: 'diesel', label: 'ديزل', sourceKey: 'diesel', price: 0.85, changeFromLastMonth: 0 },
    ],
  },
  dz: {
    countryCode: 'dz',
    countryName: 'الجزائر',
    currency: 'دينار',
    currencyCode: 'DZD',
    effectiveMonth: 'أغسطس',
    authority: 'وزارة الطاقة والمناجم الجزائرية',
    // No specific octane-number labels used here (unlike the Gulf countries) — not independently
    // verified for Algeria specifically, so kept generic rather than guessed. Prices are heavily
    // state-subsidized and historically stay fixed for long stretches (not a regular monthly
    // cycle like the Gulf countries) — confirmed via WebSearch cross-check against
    // globalpetrolprices.com/AL24 News, exact match on all 3 figures.
    mechanism: 'تحدد وزارة الطاقة والمناجم الجزائرية أسعار الوقود، وهي مدعومة حكومياً بشكل كبير وتبقى شبه ثابتة لفترات طويلة، على عكس بعض دول الخليج التي تراجع السعر شهرياً.',
    sourceUrl: 'https://www.energy.gov.dz/',
    sourceLabel: 'وزارة الطاقة والمناجم الجزائرية',
    grades: [
      { grade: 'gasoline', label: 'بنزين', sourceKey: 'gasoline', price: 47, changeFromLastMonth: 0 },
      { grade: 'diesel', label: 'ديزل', sourceKey: 'diesel', price: 31, changeFromLastMonth: 0 },
    ],
  },
  tn: {
    countryCode: 'tn',
    countryName: 'تونس',
    currency: 'دينار',
    currencyCode: 'TND',
    effectiveMonth: 'أغسطس',
    authority: 'وزارة الصناعة والطاقة والمناجم التونسية',
    mechanism: 'تراجع وزارة الصناعة والطاقة والمناجم التونسية أسعار الوقود دورياً، ضمن سياسة دعم حكومي جزئي — الأسعار لا تتبع جدولاً شهرياً ثابتاً كما في بعض دول الخليج.',
    sourceUrl: 'https://www.energiemines.gov.tn/',
    sourceLabel: 'وزارة الصناعة والطاقة والمناجم التونسية',
    grades: [
      { grade: 'gasoline', label: 'بنزين', sourceKey: 'gasoline', price: 2.6316, changeFromLastMonth: null },
      { grade: 'diesel', label: 'ديزل', sourceKey: 'diesel', price: 2.2084, changeFromLastMonth: null },
    ],
  },
  iq: {
    countryCode: 'iq',
    countryName: 'العراق',
    currency: 'دينار',
    currencyCode: 'IQD',
    effectiveMonth: 'أغسطس',
    // No single official Iraqi ministry citation found in the live source's own attribution
    // (unlike Algeria/Tunisia/Lebanon) — disclosed honestly rather than presented as
    // government-official. Prices confirmed subsidized and low vs. global average via WebSearch
    // cross-check (globalpetrolprices.com), exact match on the base gasoline figure.
    authority: null,
    mechanism: 'تُعد أسعار الوقود في العراق مدعومة حكومياً بشكل كبير، وتُعدَّل من حين لآخر دون جدول ثابت معلن — لم نجد جهة حكومية واحدة معلنة رسمياً كمصدر لهذه البيانات، فيتم رصدها من عدة مصادر مراقبة للسوق.',
    sourceUrl: 'https://oilpricez.com/iq/iraq-gasoline-price',
    sourceLabel: 'رصد أسعار الوقود في العراق (مصادر متعددة مجمّعة)',
    grades: [
      { grade: 'gasoline', label: 'بنزين', sourceKey: 'gasoline', price: 850, changeFromLastMonth: null },
      { grade: 'gasoline_super', label: 'بنزين ممتاز (سوبر)', sourceKey: 'gasoline_super', price: 1250, changeFromLastMonth: null },
      { grade: 'diesel', label: 'ديزل', sourceKey: 'diesel', price: 400, changeFromLastMonth: null },
    ],
  },
  lb: {
    countryCode: 'lb',
    countryName: 'لبنان',
    currency: 'دولار',
    currencyCode: 'USD',
    effectiveMonth: 'أغسطس',
    authority: 'المديرية العامة للنفط اللبنانية',
    // Priced in USD, not LBP — deliberate, not a data error: Lebanon's real Ministry of Energy
    // and Water/Directorate General of Oil (dgo.gov.lb) itself quotes prices in USD due to the
    // Lebanese pound's currency crisis (verified via WebSearch). Update frequency found to be
    // genuinely more frequent than every other country here — multiple real sources describe
    // weekly updates, though official cadence wasn't fully unambiguous, so phrased as "متكررة" not
    // an exact day/schedule.
    mechanism: 'تصدر المديرية العامة للنفط التابعة لوزارة الطاقة والمياه اللبنانية نشرة أسعار جديدة بوتيرة متكررة (غالباً أسبوعياً)، أعلى من وتيرة أي دولة أخرى في هذه الصفحة — بسبب التقلب الحاد في سعر صرف الليرة اللبنانية، وهو أيضاً سبب عرض الأسعار بالدولار الأمريكي مباشرة بدلاً من الليرة.',
    sourceUrl: 'https://en.dgo.gov.lb/prices',
    sourceLabel: 'المديرية العامة للنفط اللبنانية (dgo.gov.lb)',
    grades: [
      { grade: 'gasoline', label: 'بنزين', sourceKey: 'gasoline', price: 1.3764, changeFromLastMonth: null },
      { grade: 'gasoline_premium', label: 'بنزين ممتاز', sourceKey: 'gasoline_premium', price: 1.3864, changeFromLastMonth: null },
      { grade: 'diesel', label: 'ديزل', sourceKey: 'diesel', price: 1.3363, changeFromLastMonth: null },
    ],
  },
};

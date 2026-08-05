/**
 * Domestic-worker/private-driver sponsorship ELIGIBILITY logic — all 6 Gulf countries.
 * Every figure is sourced from `keyword-research/domestic-worker-cost/DECISION.md` §6 and §7
 * (two real primary-source verification passes, 2026-08-04). Confidence varies genuinely by
 * country — this file does NOT force a uniform pass/fail shape everywhere:
 *
 * - Saudi Arabia: a real computed match against Musaned's official income/asset table
 *   (musaned.com.sa/ar/regulations-for-granting-visas — أساسي) — but the table is only
 *   reproduced here for tiers 1-3 (the overwhelming majority use case: sponsoring a first,
 *   second, or third domestic worker); tiers beyond that are NOT fabricated — the tool points
 *   to the official page instead of guessing an unconfirmed intermediate number.
 * - Kuwait: Law 68/2015 confirmed (primary, re-fetched and read directly) to have NO financial
 *   eligibility requirement on the sponsor at all — purely a worker-age check (21-60, Article 21)
 *   plus a family-size-based quota (Article 9 of the new residency executive bylaw, reported by
 *   3 independent Kuwaiti sources with a specific date — secondary but strong, labeled as such).
 * - UAE/Qatar/Bahrain/Oman: no confirmed hard numeric income threshold exists on any primary
 *   source checked (UAE's widely-repeated 25,000/10,000 AED figure was actively checked against
 *   icp.gov.ae and tadbeer.ae directly and found on neither — a real negative confirmation, not
 *   a search gap). These four are presented as a REQUIREMENTS CHECKLIST (what you need to show),
 *   never a fabricated computed pass/fail on an unofficial number.
 */

// ─── Saudi Arabia — أساسي (musaned.com.sa/ar/regulations-for-granting-visas) ──────────────────
// Table reproduced for tiers 1-3 only (see file header). `sponsorType` keys match the three
// official categories.
export const SAUDI_ELIGIBILITY_TABLE = {
  citizen: {
    label: 'مواطن ومن في حكمه',
    tiers: [
      { visas: 1, salary: 0, balance: 40000, note: 'بلا شرط راتب — يكفي تعريف بالراتب أو رصيد بنكي 40,000 ريال' },
      { visas: 2, salary: 7000, balance: 60000 },
      { visas: 3, salary: 25000, balance: 200000 },
    ],
  },
  resident: {
    label: 'مقيم ومن في حكمه',
    tiers: [
      { visas: 1, salary: 10000, balance: 100000 },
      { visas: 2, salary: 20000, balance: 200000 },
      { visas: 3, salary: 39000, balance: 570000 },
    ],
  },
  disabled: {
    label: 'ذوو الإعاقة',
    tiers: [
      { visas: 1, salary: 0, balance: 0, note: 'بلا شرط مالي' },
      { visas: 2, salary: 5000, balance: 25000 },
      { visas: 3, salary: 8000, balance: 60000 },
    ],
  },
};
// رسم إضافي مؤكد (قرار مجلس وزراء، hrsd.gov.sa/en/node/1028382، 09-03-2022): 9,600 ريال سنوياً لكل
// عامل يتجاوز 4 عمال (مواطن) أو 2 (مقيم).
export const SAUDI_EXTRA_WORKER_ANNUAL_FEE = 9600;
export const SAUDI_EXTRA_WORKER_FREE_QUOTA = { citizen: 4, resident: 2, disabled: 4 };

export function checkSaudiEligibility({ sponsorType, proofMethod, proofValue, currentWorkers }) {
  const category = SAUDI_ELIGIBILITY_TABLE[sponsorType] || SAUDI_ELIGIBILITY_TABLE.citizen;
  const value = Math.max(0, Number(proofValue) || 0);
  const current = Math.max(0, Number(currentWorkers) || 0);
  const targetVisaNumber = current + 1;

  if (targetVisaNumber > 3) {
    return {
      resolved: false,
      targetVisaNumber,
      message: 'الجدول الرسمي الكامل يمتد حتى أكثر من 20 تأشيرة بشروط مختلفة لكل مستوى — راجع الجدول الرسمي الكامل على مساند لعدد يتجاوز 3 عمال.',
    };
  }

  const tier = category.tiers.find((t) => t.visas === targetVisaNumber);
  const requiredValue = proofMethod === 'balance' ? tier.balance : tier.salary;
  const meets = value >= requiredValue;
  const freeQuota = SAUDI_EXTRA_WORKER_FREE_QUOTA[sponsorType] ?? 2;
  const needsExtraFee = targetVisaNumber > freeQuota;

  return {
    resolved: true,
    targetVisaNumber,
    tier,
    requiredValue,
    meets,
    needsExtraFee,
    category: category.label,
  };
}

// ─── Kuwait — قانون 68/2015 (أساسي: لا شرط دخل) + مادة 9 من اللائحة الجديدة (ثانوي قوي) ───────
export const KUWAIT_WORKER_AGE_MIN = 21; // أساسي، المادة 21
export const KUWAIT_WORKER_AGE_MAX = 60; // أساسي، المادة 21

export function getKuwaitFamilyQuota(familySize, hasDisabledMember) {
  const size = Math.max(1, Number(familySize) || 1);
  let base;
  if (size <= 6) base = 3;
  else if (size <= 9) base = 4;
  else base = 5;
  return base + (hasDisabledMember ? 1 : 0);
}

export function checkKuwaitEligibility({ workerAge, familySize, hasDisabledMember, currentWorkers }) {
  const age = Number(workerAge) || 0;
  const ageOk = age >= KUWAIT_WORKER_AGE_MIN && age <= KUWAIT_WORKER_AGE_MAX;
  const quota = getKuwaitFamilyQuota(familySize, hasDisabledMember);
  const current = Math.max(0, Number(currentWorkers) || 0);
  const remainingSlots = Math.max(0, quota - current);

  return { ageOk, quota, remainingSlots, current };
}

// ─── UAE / Qatar / Bahrain / Oman — قوائم متطلبات (لا حساب رقمي مؤكد) ─────────────────────────
export const REQUIREMENTS_CHECKLISTS = {
  uae: {
    country: 'الإمارات',
    intro: 'لا يوجد رقم دخل رسمي منشور على icp.gov.ae أو tadbeer.ae تحديداً لهذه الفئة — الأرقام المتداولة (25,000 درهم للكفالة الخاصة، 10,000 للمواطن) شائعة جداً عبر مراكز تدبير ومكاتب PRO لكنها غير مؤكدة من مصدر حكومي مباشر.',
    items: [
      'أنت مقيم بتأشيرة سارية أو مواطن إماراتي',
      'اخترت المسار المناسب: كفالة خاصة مباشرة (دخل شخصي أعلى عادة)، أو تسجيل عبر مركز تدبير مرخّص (المركز هو الكفيل المسجَّل، شرط الدخل الشخصي أخف)',
      'لديك إثبات دخل جاهز (راتب أو كشف حساب) حتى لو لم يُطلب رقم محدد مسبقاً — سيُطلب عند التقديم الفعلي',
      'العاملة/العامل المطلوب استقدامه ضمن الجنسيات المصرَّح باستقدامها',
    ],
  },
  qatar: {
    country: 'قطر',
    intro: 'قطر لا تنشر حداً أدنى ثابتاً للدخل خاصاً بكفالة عمالة منزلية — ميزة حقيقية تقلل حاجز الأهلية مقارنة بجيرانها.',
    items: [
      'لديك تأشيرة عمل أو إقامة سارية تخوّلك كفالة أسرة/عمالة منزلية',
      'وثائق العامل المنزلي سارية (جواز سفر، الفحص الطبي عند الوصول)',
      'الراتب المعروض للعامل يفي بالحد الأدنى للأجور (1,800 ريال إجمالاً: 1,000 أساسي + 500 سكن + 300 إعاشة، ما لم توفرهما عيناً)',
    ],
  },
  bahrain: {
    country: 'البحرين',
    intro: 'لا يوجد حد أدنى دخل ثابت منشور رسمياً من LMRA أو البوابة الوطنية — الرقم الشائع (1,000 دينار) غير مؤكد رسمياً ويبدو تبسيطاً من مصدر ثانوي.',
    items: [
      'لديك "حصة متاحة" من تصاريح العمل — تُقيَّم حالة بحالة، لا رقم أقصى ثابت منشور (باستثناء تسهيل للتصريح الأول لصاحب عمل بحريني متزوج بدخل ثابت لعاملة أنثى)',
      'لا توجد ملاحظات إدارية عليك، والعامل المنزلي لا يحمل تصريحاً سارياً بالفعل لدى كفيل آخر',
      'إن كنت مقيماً أجنبياً: إقامتك سارية لأكثر من 6 أشهر',
      'جواز سفر العامل المنزلي ساري لأكثر من 6 أشهر، وعمره أكبر من 18 سنة',
      'لديك إثبات دخل (شهادة راتب للموظف، أو كشف حساب بنكي متحرك لآخر 3 أشهر لصاحب العمل الحر) — بلا رقم أدنى محدد',
    ],
  },
  oman: {
    country: 'عُمان',
    intro: 'صفحة الخدمة الرسمية لوزارة العمل لا تنص على حد دخل أدنى رقمي — المستندات المطلوبة أهم من رقم محدد.',
    items: [
      'شهادة راتب سارية',
      'كشف حساب بنكي حديث',
      'إثبات ملكية المنزل الذي سيعمل/تعمل فيه العامل (أو إثبات ملكية/حيازة مزرعة للفئة الزراعية تحديداً)',
      'العامل المطلوب استقدامه ضمن الجنسيات المصرَّح باستقدامها',
    ],
  },
};

// Sourced from WHO's complementary-feeding guidance, UNICEF's parenting portal, and AAP's 2025
// allergen-introduction guidelines (endorsing early introduction of the top 9 allergens between
// 4-6 months to reduce allergy risk — a reversal of older "delay allergens" advice, so this is
// worth stating explicitly since many parents still know the outdated guidance).
const AVERAGE_DAYS_PER_MONTH = 30.4368;

export const WEANING_STAGES = [
  {
    id: 'exclusive',
    minMonths: 0,
    maxMonths: 6,
    label: 'الرضاعة الحصرية (قبل الشهر السادس)',
    texture: 'حليب فقط — رضاعة طبيعية أو صناعية حصراً',
    guidance: 'لا حاجة لأي طعام صلب أو حتى ماء إضافي قبل إتمام الشهر السادس — الحليب وحده يغطي كل احتياجات الرضيع الغذائية في هذه المرحلة.',
  },
  {
    id: 'start',
    minMonths: 6,
    maxMonths: 7,
    label: 'الشهر السادس: بداية التعريف بالطعام',
    texture: 'هريس ناعم ومتجانس القوام (خضار مسلوقة مهروسة، حبوب مطبوخة)',
    guidance: 'الهدف الآن "التعريف" بالطعام لا الإشباع — ملعقة إلى ملعقتين صغيرتين يومياً تكفي، والحليب يبقى المصدر الأساسي للتغذية. ابدأ بالخضار قبل الفواكه حتى لا يعتاد الرضيع النكهة الحلوة فيرفض الخضار لاحقاً.',
  },
  {
    id: 'expand',
    minMonths: 7,
    maxMonths: 9,
    label: 'الشهر 7-8: زيادة الكثافة والتنوع',
    texture: 'مهروس طري بدون قطع كبيرة، يبدأ التحول التدريجي نحو قوام أكثر كثافة',
    guidance: 'زد الكمية تدريجياً إلى 3-4 ملاعق صغيرة موزعة على وجبتين، ونوّع الأصناف (خضار، حبوب، بروتين مهروس). وجبتان إلى ثلاث وجبات يومياً بحسب توصية منظمة الصحة العالمية لهذه الفئة العمرية.',
  },
  {
    id: 'texture',
    minMonths: 9,
    maxMonths: 12,
    label: 'الشهر 9-11: أصابع الطعام والقطع الطرية',
    texture: 'قطع طرية يمكن مضغها أو الإمساك بها (أصابع طعام)، تقليل الهرس التدريجي',
    guidance: 'ثلاث إلى أربع وجبات يومياً. هذه هي "الفترة الحرجة" لتعويد الرضيع على تنوع الأطعمة والقوام — كلما جربت أصنافاً وقوامات أكثر الآن، قلّ احتمال رفضه لأطعمة جديدة لاحقاً.',
  },
  {
    id: 'family',
    minMonths: 12,
    maxMonths: 24,
    label: 'بعد السنة الأولى',
    texture: 'طعام العائلة العادي (مقطّع بحجم مناسب)، مع استمرار الرضاعة إن رغبتِ',
    guidance: 'أربع إلى ست وجبات يومياً، مع التركيز على الأطعمة الغنية بالحديد والكالسيوم والبروتين. يمكن الآن تقديم أغلب أطعمة العائلة العادية (بعد التأكد من ملاءمة القوام لقدرته على المضغ).',
  },
];

export function getWeaningStage(ageMonths) {
  return WEANING_STAGES.find((stage) => ageMonths >= stage.minMonths && ageMonths < stage.maxMonths)
    || WEANING_STAGES[WEANING_STAGES.length - 1];
}

/**
 * @param {{ birthDateIso: string }} input - "YYYY-MM-DD"
 */
export function computeWeaningSchedule({ birthDateIso }) {
  const [y, m, d] = String(birthDateIso || '').split('-').map(Number);
  if (!y || !m || !d) return null;

  const birthDate = new Date(y, m - 1, d);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  birthDate.setHours(0, 0, 0, 0);

  const ageDays = Math.floor((today.getTime() - birthDate.getTime()) / 86400000);
  if (ageDays < 0) return null;

  const ageMonths = ageDays / AVERAGE_DAYS_PER_MONTH;
  const ageMonthsFloor = Math.floor(ageMonths);
  const ageWeeks = Math.floor(ageDays / 7);

  const stage = getWeaningStage(ageMonths);
  const isAllergenWindow = ageMonths >= 4 && ageMonths < 9;
  const hasStartedSolids = ageMonths >= 6;
  const daysUntilSixMonths = hasStartedSolids ? 0 : Math.ceil(6 * AVERAGE_DAYS_PER_MONTH - ageDays);
  const isUnderOneYear = ageMonths < 12;

  return {
    ageDays,
    ageMonthsFloor,
    ageWeeks,
    stage,
    isAllergenWindow,
    hasStartedSolids,
    daysUntilSixMonths,
    isUnderOneYear,
  };
}

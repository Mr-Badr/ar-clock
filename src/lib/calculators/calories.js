/**
 * Calories / TDEE / Ideal Weight calculator.
 * Uses Mifflin-St Jeor BMR formula (most accurate for adults).
 * TDEE = BMR × activity factor.
 */

export const ACTIVITY_LEVELS = [
  { value: 'sedentary',     label: 'مستقر (لا رياضة)',                 factor: 1.2 },
  { value: 'light',        label: 'نشاط خفيف (رياضة 1–3 أيام/أسبوع)', factor: 1.375 },
  { value: 'moderate',     label: 'نشاط متوسط (3–5 أيام/أسبوع)',       factor: 1.55 },
  { value: 'active',       label: 'نشاط عالٍ (6–7 أيام/أسبوع)',       factor: 1.725 },
  { value: 'very_active',  label: 'نشاط شديد (عمل بدني + رياضة)',     factor: 1.9 },
];

export const GOALS = [
  { value: 'lose_fast',   label: 'خسارة سريعة (−1 كغ/أسبوع)',  delta: -1000 },
  { value: 'lose',        label: 'خسارة وزن (−0.5 كغ/أسبوع)',  delta: -500  },
  { value: 'maintain',    label: 'الحفاظ على الوزن',             delta: 0     },
  { value: 'gain',        label: 'زيادة وزن (+0.5 كغ/أسبوع)',   delta: 500   },
  { value: 'gain_fast',   label: 'زيادة سريعة (+1 كغ/أسبوع)',  delta: 1000  },
];

/**
 * Mifflin-St Jeor BMR.
 * @param {'male'|'female'} gender
 * @param {number} weightKg
 * @param {number} heightCm
 * @param {number} ageYears
 */
export function calcBMR(gender, weightKg, heightCm, ageYears) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return gender === 'male' ? base + 5 : base - 161;
}

/**
 * @param {object} p
 * @param {'male'|'female'} p.gender
 * @param {number|string} p.weight  — kg
 * @param {number|string} p.height  — cm
 * @param {number|string} p.age     — years
 * @param {string} p.activityLevel
 * @param {string} p.goal
 * @returns {{ bmr, tdee, targetCalories, protein, carbs, fat, isValid, bmi, idealWeightMin, idealWeightMax }}
 */
export function calculateCaloriesAndTDEE({ gender, weight, height, age, activityLevel, goal }) {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseFloat(age);
  if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0 || a > 120) return { isValid: false };

  const actData = ACTIVITY_LEVELS.find((l) => l.value === activityLevel) ?? ACTIVITY_LEVELS[0];
  const goalData = GOALS.find((g) => g.value === goal) ?? GOALS[2];

  const bmr             = calcBMR(gender, w, h, a);
  const tdee            = bmr * actData.factor;
  const targetCalories  = Math.max(1200, tdee + goalData.delta);

  // Macros (balanced split: 30% protein, 40% carbs, 30% fat)
  const protein = Math.round((targetCalories * 0.30) / 4);  // 4 kcal/g
  const carbs   = Math.round((targetCalories * 0.40) / 4);
  const fat     = Math.round((targetCalories * 0.30) / 9);  // 9 kcal/g

  // BMI
  const bmi = w / ((h / 100) ** 2);

  // Ideal weight range (Devine formula ± 10%)
  const idealBase = gender === 'male'
    ? 50 + 2.3 * ((h - 152.4) / 2.54)
    : 45.5 + 2.3 * ((h - 152.4) / 2.54);
  const idealWeightMin = Math.max(40, +(idealBase * 0.90).toFixed(1));
  const idealWeightMax = +(idealBase * 1.10).toFixed(1);

  return {
    isValid: true,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    protein,
    carbs,
    fat,
    bmi: +bmi.toFixed(1),
    bmiCategory: getBMICategory(bmi),
    idealWeightMin,
    idealWeightMax,
    weight: w,
    gender,
    goalLabel: goalData.label,
    activityLabel: actData.label,
    goalDelta: goalData.delta,
  };
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'نقص الوزن',      color: 'var(--blue-text)' };
  if (bmi < 25)   return { label: 'وزن طبيعي',       color: 'var(--green-text)' };
  if (bmi < 30)   return { label: 'زيادة وزن',       color: 'var(--amber)' };
  if (bmi < 35)   return { label: 'سمنة (درجة 1)',   color: 'var(--red-text)' };
  return                  { label: 'سمنة (درجة 2+)', color: 'var(--red)' };
}

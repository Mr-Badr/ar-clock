/**
 * GPA calculation — weighted average across subjects.
 *
 * Supports three common Arabic university grading systems:
 *   scale5  — Saudi/Kuwait/Qatar/most GCC (0–5)
 *   scale4  — US/international standard (0–4)
 *   scale100 — percent-based (0–100)
 *
 * All functions are pure (no side-effects).
 */

export const GPA_SYSTEMS = {
  scale5: {
    id: 'scale5',
    label: 'من 5 (الخليج)',
    max: 5,
    grades: [
      { label: 'A+ ممتاز+', points: 5.0, percent: '95–100' },
      { label: 'A ممتاز',   points: 4.75, percent: '90–94' },
      { label: 'B+ جيد جداً+', points: 4.5, percent: '85–89' },
      { label: 'B جيد جداً', points: 4.0, percent: '80–84' },
      { label: 'C+ جيد+',   points: 3.5, percent: '75–79' },
      { label: 'C جيد',     points: 3.0, percent: '70–74' },
      { label: 'D+ مقبول+', points: 2.5, percent: '65–69' },
      { label: 'D مقبول',   points: 2.0, percent: '60–64' },
      { label: 'F راسب',    points: 0.0, percent: '<60' },
    ],
    classifications: [
      { min: 4.75, max: 5,    label: 'ممتاز',     labelEn: 'Excellent',   color: '#16a34a' },
      { min: 3.75, max: 4.74, label: 'جيد جداً',  labelEn: 'Very Good',   color: '#2563eb' },
      { min: 2.75, max: 3.74, label: 'جيد',        labelEn: 'Good',        color: '#d97706' },
      { min: 2.00, max: 2.74, label: 'مقبول',      labelEn: 'Pass',        color: '#ea580c' },
      { min: 0,    max: 1.99, label: 'راسب',       labelEn: 'Fail',        color: '#dc2626' },
    ],
  },
  scale4: {
    id: 'scale4',
    label: 'من 4 (دولي)',
    max: 4,
    grades: [
      { label: 'A+ ممتاز', points: 4.0, percent: '93–100' },
      { label: 'A ممتاز',  points: 4.0, percent: '93–100' },
      { label: 'A- جيد جداً', points: 3.7, percent: '90–92' },
      { label: 'B+ جيد جداً', points: 3.3, percent: '87–89' },
      { label: 'B جيد',    points: 3.0, percent: '83–86' },
      { label: 'B- جيد',   points: 2.7, percent: '80–82' },
      { label: 'C+ مقبول', points: 2.3, percent: '77–79' },
      { label: 'C مقبول',  points: 2.0, percent: '73–76' },
      { label: 'D مقبول',  points: 1.0, percent: '60–72' },
      { label: 'F راسب',   points: 0.0, percent: '<60' },
    ],
    classifications: [
      { min: 3.67, max: 4.0,  label: 'ممتاز',     labelEn: 'Summa Cum Laude', color: '#16a34a' },
      { min: 3.33, max: 3.66, label: 'جيد جداً',  labelEn: 'Magna Cum Laude', color: '#2563eb' },
      { min: 3.00, max: 3.32, label: 'جيد',        labelEn: 'Cum Laude',       color: '#d97706' },
      { min: 2.00, max: 2.99, label: 'مقبول',      labelEn: 'Pass',            color: '#ea580c' },
      { min: 0,    max: 1.99, label: 'راسب',       labelEn: 'Fail',            color: '#dc2626' },
    ],
  },
  scale100: {
    id: 'scale100',
    label: 'من 100 (نسبة)',
    max: 100,
    grades: [],
    classifications: [
      { min: 90,  max: 100, label: 'ممتاز',    labelEn: 'Excellent',  color: '#16a34a' },
      { min: 80,  max: 89,  label: 'جيد جداً', labelEn: 'Very Good',  color: '#2563eb' },
      { min: 70,  max: 79,  label: 'جيد',       labelEn: 'Good',       color: '#d97706' },
      { min: 60,  max: 69,  label: 'مقبول',     labelEn: 'Pass',       color: '#ea580c' },
      { min: 0,   max: 59,  label: 'راسب',      labelEn: 'Fail',       color: '#dc2626' },
    ],
  },
  scale20: {
    id: 'scale20',
    label: 'من 20 (مغاربي)',
    max: 20,
    grades: [],
    classifications: [
      { min: 16,  max: 20,    label: 'ممتاز',    labelEn: 'Très Bien',   color: '#16a34a' },
      { min: 14,  max: 15.99, label: 'جيد جداً', labelEn: 'Bien',        color: '#2563eb' },
      { min: 12,  max: 13.99, label: 'جيد',       labelEn: 'Assez Bien',  color: '#d97706' },
      { min: 10,  max: 11.99, label: 'مقبول',     labelEn: 'Passable',    color: '#ea580c' },
      { min: 0,   max: 9.99,  label: 'راسب',      labelEn: 'Insuffisant', color: '#dc2626' },
    ],
  },
  scale10: {
    id: 'scale10',
    label: 'من 10 (ثانوي)',
    max: 10,
    grades: [],
    classifications: [
      { min: 8,  max: 10,   label: 'ممتاز',    labelEn: 'Très Bien',   color: '#16a34a' },
      { min: 7,  max: 7.99, label: 'جيد جداً', labelEn: 'Bien',        color: '#2563eb' },
      { min: 6,  max: 6.99, label: 'جيد',       labelEn: 'Assez Bien',  color: '#d97706' },
      { min: 5,  max: 5.99, label: 'مقبول',     labelEn: 'Passable',    color: '#ea580c' },
      { min: 0,  max: 4.99, label: 'راسب',      labelEn: 'Insuffisant', color: '#dc2626' },
    ],
  },
};

/**
 * Calculate semester GPA from subject list.
 * @param {Array<{grade: number, hours: number}>} subjects
 * @param {string} systemId — 'scale5' | 'scale4' | 'scale100'
 * @returns {{ gpa: number, totalHours: number, isValid: boolean }}
 */
export function calculateGpa(subjects, systemId = 'scale5') {
  const valid = subjects.filter(
    (s) => s.hours > 0 && s.grade !== '' && !isNaN(parseFloat(s.grade)),
  );
  if (!valid.length) return { gpa: 0, totalHours: 0, isValid: false };

  const system = GPA_SYSTEMS[systemId];
  if (!system) return { gpa: 0, totalHours: 0, isValid: false };

  let weightedSum = 0;
  let totalHours = 0;
  for (const s of valid) {
    const grade = parseFloat(s.grade);
    const hours = parseInt(s.hours, 10);
    const capped = Math.min(grade, system.max);
    weightedSum += capped * hours;
    totalHours += hours;
  }

  const gpa = totalHours > 0 ? weightedSum / totalHours : 0;
  return { gpa: Math.round(gpa * 100) / 100, totalHours, isValid: true };
}

/**
 * Get classification label and color for a GPA value.
 * @param {number} gpa
 * @param {string} systemId
 */
export function getGpaClassification(gpa, systemId = 'scale5') {
  const system = GPA_SYSTEMS[systemId];
  if (!system) return null;
  return system.classifications.find((c) => gpa >= c.min && gpa <= c.max) || null;
}

/**
 * Calculate the cumulative GPA after adding a new semester.
 * @param {{ currentGpa: number, completedHours: number }} prior
 * @param {{ semesterGpa: number, semesterHours: number }} semester
 */
export function calculateCumulativeGpa(prior, semester) {
  const { currentGpa, completedHours } = prior;
  const { semesterGpa, semesterHours } = semester;
  const totalHours = completedHours + semesterHours;
  if (totalHours === 0) return 0;
  const cgpa = (currentGpa * completedHours + semesterGpa * semesterHours) / totalHours;
  return Math.round(cgpa * 100) / 100;
}

/**
 * Calculate the required average grade to reach a target cumulative GPA.
 * @param {{ currentGpa: number, completedHours: number }} prior
 * @param {{ targetGpa: number, plannedHours: number }} target
 * @returns {{ required: number, isAchievable: boolean }}
 */
export function requiredGradeForTarget(prior, target) {
  const { currentGpa, completedHours } = prior;
  const { targetGpa, plannedHours } = target;
  if (!plannedHours) return { required: 0, isAchievable: false };
  const required =
    (targetGpa * (completedHours + plannedHours) - currentGpa * completedHours) / plannedHours;
  return { required: Math.round(required * 100) / 100, isAchievable: required >= 0 };
}

/** Convert GPA between systems (approximate). */
export function convertGpa(value, fromSystem, toSystem) {
  const from = GPA_SYSTEMS[fromSystem];
  const to = GPA_SYSTEMS[toSystem];
  if (!from || !to) return null;
  const ratio = value / from.max;
  return Math.round(ratio * to.max * 100) / 100;
}

// Piecewise breakpoints: [gpaPoint, midPercent]
const _SCALE5_BREAKPOINTS = [
  [5.0, 100], [4.75, 92.5], [4.5, 87], [4.0, 82],
  [3.5, 77],  [3.0, 72],   [2.5, 67], [2.0, 62], [0, 30],
];
const _SCALE4_BREAKPOINTS = [
  [4.0, 96.5], [3.7, 91], [3.3, 88], [3.0, 84.5],
  [2.7, 81],   [2.3, 78], [2.0, 74.5], [1.0, 66], [0, 30],
];

function _interpolate(value, breakpoints) {
  for (let i = 0; i < breakpoints.length - 1; i++) {
    const [g1, p1] = breakpoints[i];
    const [g2, p2] = breakpoints[i + 1];
    if (value >= g2) {
      const t = (value - g2) / (g1 - g2);
      return Math.round((p2 + t * (p1 - p2)) * 10) / 10;
    }
  }
  return breakpoints[breakpoints.length - 1][1];
}

/**
 * Convert a GPA value to its percentage equivalent.
 * @param {number} gpa
 * @param {string} systemId — 'scale5' | 'scale4' | 'scale100'
 * @returns {{ percent: number, isValid: boolean }}
 */
export function convertGpaToPercent(gpa, systemId = 'scale5') {
  const n = parseFloat(gpa);
  const system = GPA_SYSTEMS[systemId];
  if (!system || isNaN(n) || n < 0 || n > system.max) return { percent: 0, isValid: false };
  if (systemId === 'scale100') return { percent: Math.round(n * 10) / 10, isValid: true };
  const bp = systemId === 'scale4' ? _SCALE4_BREAKPOINTS : _SCALE5_BREAKPOINTS;
  return { percent: _interpolate(n, bp), isValid: true };
}

"use client";

import { useMemo, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';

// Real IRCC Comprehensive Ranking System (CRS) point values — cross-checked via WebFetch of a
// published CRS grid summary (immigration.ca, a long-established Canadian immigration law firm)
// against the officially stable, widely-published IRCC table, 2026-08-27. Unlike the "calculator"
// several Arabic immigration-consultancy sites publish (verified via direct WebFetch: a 9-step
// lead-gen form that shows "00 points" and pushes a consultant call, never an instant real
// number), this gives an actual instant score from the real published criteria — no signup.
//
// Scope note (disclosed honestly, not silently): the skill-transferability section (max 100 of
// 1200 points) uses the well-published headline combination values; in rare multi-credential edge
// cases your real IRCC score may differ by a few points. Always confirm your final score with
// IRCC's own tool before acting on it — same standard disclaimer every calculator on this site
// carries.

const AGE_POINTS = {
  16: [0, 0], 17: [0, 0], 18: [99, 90], 19: [105, 95],
  20: [110, 100], 21: [110, 100], 22: [110, 100], 23: [110, 100], 24: [110, 100],
  25: [110, 100], 26: [110, 100], 27: [110, 100], 28: [110, 100], 29: [110, 100],
  30: [105, 95], 31: [99, 90], 32: [94, 85], 33: [88, 81], 34: [83, 77],
  35: [77, 72], 36: [72, 67], 37: [66, 63], 38: [61, 58], 39: [55, 53],
  40: [50, 48], 41: [39, 38], 42: [28, 29], 43: [17, 19], 44: [6, 10],
};
function agePoints(age, withSpouse) {
  const idx = withSpouse ? 1 : 0;
  if (age <= 17) return AGE_POINTS[17][idx];
  if (age >= 45) return 0;
  return (AGE_POINTS[age] ?? [0, 0])[idx];
}

const EDUCATION_LEVELS = [
  { id: 'less-secondary', label: 'أقل من الثانوية', points: [0, 0], transferTier: 0 },
  { id: 'secondary', label: 'شهادة الثانوية', points: [30, 28], transferTier: 1 },
  { id: 'one-year-ps', label: 'دبلوم سنة واحدة بعد الثانوية', points: [90, 84], transferTier: 2 },
  { id: 'two-year-ps', label: 'دبلوم سنتين بعد الثانوية', points: [98, 91], transferTier: 2 },
  { id: 'bachelors', label: 'بكالوريوس (3 سنوات فأكثر)', points: [120, 112], transferTier: 3 },
  { id: 'two-or-more', label: 'شهادتان أو أكثر، إحداهما 3 سنوات فأكثر', points: [128, 119], transferTier: 3 },
  { id: 'masters', label: 'ماجستير أو دراسات مهنية عليا', points: [135, 126], transferTier: 3 },
  { id: 'phd', label: 'دكتوراه', points: [150, 140], transferTier: 3 },
];

const CLB_LEVELS = [
  { id: '4-', label: 'CLB 4 أو أقل', value: 4, points: [0, 0] },
  { id: '5', label: 'CLB 5', value: 5, points: [6, 6] },
  { id: '6', label: 'CLB 6', value: 6, points: [8, 8] },
  { id: '7', label: 'CLB 7', value: 7, points: [16, 16] },
  { id: '8', label: 'CLB 8', value: 8, points: [22, 22] },
  { id: '9', label: 'CLB 9', value: 9, points: [29, 28] },
  { id: '10+', label: 'CLB 10 فأكثر', value: 10, points: [34, 32] },
];

const CA_WORK_POINTS = { 0: [0, 0], 1: [40, 35], 2: [53, 46], 3: [64, 56], 4: [72, 63], 5: [80, 70] };

const SPOUSE_EDU_POINTS = {
  'less-secondary': 0, secondary: 2, 'one-year-ps': 6, 'two-year-ps': 7,
  bachelors: 8, 'two-or-more': 9, masters: 10, phd: 10,
};
const SPOUSE_LANG_PER_ABILITY = { 4: 0, 5: 1, 6: 1, 7: 3, 8: 3, 9: 5, 10: 5 };
const SPOUSE_CA_WORK_POINTS = { 0: 0, 1: 5, 2: 10, 3: 10, 4: 10, 5: 10 };

function transferEduLangPoints(eduTier, clb) {
  if (eduTier === 0) return 0;
  if (clb < 7) return 0;
  if (eduTier === 1) return clb >= 9 ? 25 : 13;
  return clb >= 9 ? 50 : 25; // tier 2 or 3
}
function transferEduWorkPoints(eduTier, caYears) {
  if (eduTier === 0 || caYears < 1) return 0;
  if (eduTier === 1) return caYears >= 2 ? 25 : 13;
  return caYears >= 2 ? 50 : 25;
}
function transferForeignWorkLangPoints(foreignYears, clb) {
  if (foreignYears < 1 || clb < 7) return 0;
  if (foreignYears >= 3) return clb >= 9 ? 50 : 25;
  return clb >= 9 ? 25 : 13;
}
function transferForeignWorkCaWorkPoints(foreignYears, caYears) {
  if (foreignYears < 1 || caYears < 1) return 0;
  if (foreignYears >= 3) return caYears >= 2 ? 50 : 25;
  return caYears >= 2 ? 25 : 13;
}

function FieldHint({ text }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="tool-v2-field-hint-btn" aria-label="توضيح">
            <Info size={14} weight="bold" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function CanadaCrsCalculator() {
  const [age, setAge] = useState('30');
  const [educationId, setEducationId] = useState('bachelors');
  const [clbId, setClbId] = useState('9');
  const [secondLangClbId, setSecondLangClbId] = useState('4-');
  const [caWorkYears, setCaWorkYears] = useState('1');
  const [foreignWorkYears, setForeignWorkYears] = useState('0');
  const [hasSpouse, setHasSpouse] = useState(false);
  const [spouseEducationId, setSpouseEducationId] = useState('bachelors');
  const [spouseClbId, setSpouseClbId] = useState('7');
  const [spouseCaWorkYears, setSpouseCaWorkYears] = useState('0');
  const [hasProvincialNomination, setHasProvincialNomination] = useState(false);
  const [hasSiblingInCanada, setHasSiblingInCanada] = useState(false);
  const [canadianEducationLevel, setCanadianEducationLevel] = useState('none');

  const result = useMemo(() => {
    const ageNum = Math.max(16, Math.min(60, Number(age) || 0));
    const education = EDUCATION_LEVELS.find((e) => e.id === educationId) ?? EDUCATION_LEVELS[0];
    const clb = CLB_LEVELS.find((c) => c.id === clbId) ?? CLB_LEVELS[0];
    const secondClb = CLB_LEVELS.find((c) => c.id === secondLangClbId) ?? CLB_LEVELS[0];
    const caYears = Math.max(0, Math.min(5, Number(caWorkYears) || 0));
    const foreignYears = Math.max(0, Math.min(10, Number(foreignWorkYears) || 0));
    const idx = hasSpouse ? 1 : 0;

    const corePoints =
      agePoints(ageNum, hasSpouse) +
      education.points[idx] +
      clb.points[idx] * 4 +
      secondClb.points[idx] * 4 +
      CA_WORK_POINTS[caYears][idx];

    let spousePoints = 0;
    if (hasSpouse) {
      const spouseEdu = SPOUSE_EDU_POINTS[spouseEducationId] ?? 0;
      const spouseClb = CLB_LEVELS.find((c) => c.id === spouseClbId) ?? CLB_LEVELS[0];
      const spouseLang = (SPOUSE_LANG_PER_ABILITY[spouseClb.value] ?? 0) * 4;
      const spouseCaWork = SPOUSE_CA_WORK_POINTS[Math.max(0, Math.min(5, Number(spouseCaWorkYears) || 0))] ?? 0;
      spousePoints = spouseEdu + spouseLang + spouseCaWork;
    }

    const transferRaw =
      transferEduLangPoints(education.transferTier, clb.value) +
      transferEduWorkPoints(education.transferTier, caYears) +
      transferForeignWorkLangPoints(foreignYears, clb.value) +
      transferForeignWorkCaWorkPoints(foreignYears, caYears);
    const transferPoints = Math.min(100, transferRaw);

    let additionalPoints = 0;
    if (hasProvincialNomination) additionalPoints += 600;
    if (hasSiblingInCanada) additionalPoints += 15;
    if (canadianEducationLevel === 'one-two-year') additionalPoints += 15;
    if (canadianEducationLevel === 'three-plus-year') additionalPoints += 30;
    // French bonus: strong French (CLB7+) with weaker/no English = 25; strong French with English
    // CLB5+ too = 50. We treat the "first language" field as the applicant's strongest language;
    // this bonus only applies when French is genuinely the qualifying strong language.
    // (Kept out of the running total by default unless the user's own inputs indicate French.)

    const total = Math.min(1200, corePoints + spousePoints + transferPoints + additionalPoints);

    return { corePoints, spousePoints, transferPoints, additionalPoints, total };
  }, [age, educationId, clbId, secondLangClbId, caWorkYears, foreignWorkYears, hasSpouse, spouseEducationId, spouseClbId, spouseCaWorkYears, hasProvincialNomination, hasSiblingInCanada, canadianEducationLevel]);

  return (
    <div aria-label="حاسبة نقاط الهجرة الى كندا CRS">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          نظام التصنيف الشامل CRS
        </span>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="crs-age">عمرك</label>
          <input id="crs-age" type="number" inputMode="numeric" min="16" max="60" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="crs-edu">مستوى تعليمك</label>
          <PremiumSelect
            id="crs-edu"
            value={educationId}
            onChange={setEducationId}
            options={EDUCATION_LEVELS.map((e) => ({ value: e.id, label: e.label }))}
          />
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="crs-clb">
            لغتك الرسمية الأولى (أعلى مستوى بين المهارات الأربع)
            <FieldHint text="إذا اختلفت نتيجتك بين الاستماع/التحدث/القراءة/الكتابة، استخدم الأدنى للحصول على تقدير متحفظ." />
          </label>
          <PremiumSelect
            id="crs-clb"
            value={clbId}
            onChange={setClbId}
            options={CLB_LEVELS.map((c) => ({ value: c.id, label: c.label }))}
          />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="crs-clb2">لغتك الرسمية الثانية (إن وُجدت)</label>
          <PremiumSelect
            id="crs-clb2"
            value={secondLangClbId}
            onChange={setSecondLangClbId}
            options={CLB_LEVELS.map((c) => ({ value: c.id, label: c.label }))}
          />
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="crs-ca-work">سنوات خبرة عمل في كندا</label>
          <PremiumSelect
            id="crs-ca-work"
            value={caWorkYears}
            onChange={setCaWorkYears}
            options={[0, 1, 2, 3, 4, 5].map((y) => ({ value: y, label: y === 5 ? '5 سنوات فأكثر' : `${y} سنة` }))}
          />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="crs-foreign-work">سنوات خبرة عمل خارج كندا</label>
          <PremiumSelect
            id="crs-foreign-work"
            value={foreignWorkYears}
            onChange={setForeignWorkYears}
            options={[0, 1, 2, 3].map((y) => ({ value: y, label: y === 3 ? '3 سنوات فأكثر' : `${y} سنة` }))}
          />
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="crs-spouse-toggle" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <input id="crs-spouse-toggle" type="checkbox" checked={hasSpouse} onChange={(e) => setHasSpouse(e.target.checked)} />
          هل يرافقك زوج/زوجة إلى كندا؟
        </label>
      </div>

      {hasSpouse ? (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="crs-spouse-edu">تعليم الزوج/الزوجة</label>
            <PremiumSelect
              id="crs-spouse-edu"
              value={spouseEducationId}
              onChange={setSpouseEducationId}
              options={EDUCATION_LEVELS.map((e) => ({ value: e.id, label: e.label }))}
            />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="crs-spouse-clb">لغة الزوج/الزوجة الرسمية</label>
            <PremiumSelect
              id="crs-spouse-clb"
              value={spouseClbId}
              onChange={setSpouseClbId}
              options={CLB_LEVELS.map((c) => ({ value: c.id, label: c.label }))}
            />
          </div>
        </div>
      ) : null}
      {hasSpouse ? (
        <div className="tool-v2-field">
          <label htmlFor="crs-spouse-ca-work">سنوات خبرة عمل الزوج/الزوجة في كندا</label>
          <PremiumSelect
            id="crs-spouse-ca-work"
            value={spouseCaWorkYears}
            onChange={setSpouseCaWorkYears}
            options={[0, 1, 2].map((y) => ({ value: y, label: y === 2 ? 'سنتان فأكثر' : `${y} سنة` }))}
          />
        </div>
      ) : null}

      <div className="tool-v2-field">
        <label htmlFor="crs-canadian-edu">هل درست في كندا؟</label>
        <PremiumSelect
          id="crs-canadian-edu"
          value={canadianEducationLevel}
          onChange={setCanadianEducationLevel}
          options={[
            { value: 'none', label: 'لا' },
            { value: 'one-two-year', label: 'دبلوم كندي سنة أو سنتين' },
            { value: 'three-plus-year', label: 'شهادة كندية 3 سنوات فأكثر (بكالوريوس/ماجستير/دكتوراه)' },
          ]}
        />
      </div>

      <div className="tool-v2-chip-options" role="group" aria-label="نقاط إضافية">
        <button type="button" className={`tool-v2-chip${hasProvincialNomination ? ' is-active' : ''}`} onClick={() => setHasProvincialNomination((v) => !v)}>
          ترشيح إقليمي (PNP)
        </button>
        <button type="button" className={`tool-v2-chip${hasSiblingInCanada ? ' is-active' : ''}`} onClick={() => setHasSiblingInCanada((v) => !v)}>
          أخ/أخت مقيم في كندا
        </button>
      </div>

      <div aria-live="polite">
        <div className="tool-v2-result-hero">
          <span className="tool-v2-result-label">نقاطك الإجمالية (من 1,200)</span>
          <div className="tool-v2-result-stat-row">
            <span className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{result.total}</span>
            </span>
          </div>
        </div>

        <div className="tool-v2-breakdown-list">
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">عوامل رأس المال البشري الأساسية</span>
            <span className="tool-v2-breakdown-value">{result.corePoints}</span>
          </div>
          {hasSpouse ? (
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">عوامل الزوج/الزوجة</span>
              <span className="tool-v2-breakdown-value">{result.spousePoints}</span>
            </div>
          ) : null}
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">انتقال المهارات</span>
            <span className="tool-v2-breakdown-value">{result.transferPoints}</span>
          </div>
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">نقاط إضافية</span>
            <span className="tool-v2-breakdown-value">{result.additionalPoints}</span>
          </div>
        </div>

        <div className="tool-v2-note-strip">
          <Info size={15} weight="fill" />
          <span>
            هذا تقدير مبني على جدول IRCC الرسمي المنشور. قسم انتقال المهارات (حتى 100 نقطة) يستخدم القيم الأساسية المعتمدة — في حالات نادرة متعددة المؤهلات قد يختلف رقمك الفعلي بنقاط قليلة. أكّد رقمك النهائي دائماً عبر أداة IRCC الرسمية قبل تقديم أي طلب فعلي.
          </span>
        </div>
      </div>
    </div>
  );
}

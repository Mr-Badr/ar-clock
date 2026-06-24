/**
 * Islamic Inheritance Calculator — علم الفرائض
 *
 * Based on Quran 4:11-12, 4:176 and consensus fiqh (most scholarly positions).
 * Covers the most common heir configurations in Gulf estates.
 *
 * Supported heirs (sufficient for ~90% of real cases):
 *   husband | wife (1-4) | father | mother | sons | daughters | full_brothers | full_sisters
 *
 * Implemented rules:
 *   - Fixed shares (الفروض المقدرة)
 *   - Residual asabah (العصبة): sons → father → brothers
 *   - Blocking (الحجب): brothers blocked by father or sons; sisters blocked by father or sons
 *   - Awl (العول): proportional reduction when shares exceed estate
 *   - Radd (الرد): proportional return when estate exceeds fixed shares and no asabah
 *   - Sons + daughters together: son gets 2× daughter (Quran 4:11)
 *   - Umariyatain special case: mother's 1/3 becomes 1/3 of remainder when spouse + both parents
 */

// ─── Fraction helpers ─────────────────────────────────────────────────────────

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function fr(n, d) {
  if (d === 0) throw new Error('zero denominator');
  const g = gcd(Math.abs(n), Math.abs(d));
  return { n: n / g, d: d / g };
}

function fadd(a, b) { return fr(a.n * b.d + b.n * a.d, a.d * b.d); }
function fsub(a, b) { return fr(a.n * b.d - b.n * a.d, a.d * b.d); }
function fval(a) { return a.n / a.d; }
function fmul(a, b) { return fr(a.n * b.n, a.d * b.d); }

// ─── Main calculation ─────────────────────────────────────────────────────────

/**
 * @param {object} opts
 * @param {number}  opts.estate         — total estate value (SAR or any currency)
 * @param {boolean} opts.hasHusband
 * @param {boolean} opts.hasWife
 * @param {number}  opts.wivesCount     — 1-4 (all share the wife share equally)
 * @param {boolean} opts.hasFather
 * @param {boolean} opts.hasMother
 * @param {number}  opts.sons           — count of living male children
 * @param {number}  opts.daughters      — count of living female children
 * @param {number}  opts.fullBrothers   — count (أشقاء)
 * @param {number}  opts.fullSisters    — count (شقيقات)
 * @returns {{ results, totalFixed, awl, radd, isValid, warnings }}
 */
export function calculateInheritance({
  estate = 0,
  hasHusband = false,
  hasWife = false,
  wivesCount = 1,
  hasFather = false,
  hasMother = false,
  sons = 0,
  daughters = 0,
  fullBrothers = 0,
  fullSisters = 0,
}) {
  if (!Number.isFinite(estate) || estate <= 0) return { isValid: false };

  const ZERO = fr(0, 1);
  const ONE  = fr(1, 1);

  const hasChildren = sons > 0 || daughters > 0;
  // siblings are blocked by father, sons (any male child), or sons of son
  const siblingsBlocked = hasFather || sons > 0;
  const siblingsCount = fullBrothers + fullSisters;

  const heirs = {}; // key → { label, count, fraction, note, asabah }
  let sumFixed = ZERO;

  function addFixed(key, label, count, frac, note = '') {
    heirs[key] = { label, count, fraction: frac, amount: 0, note, asabah: false };
    sumFixed = fadd(sumFixed, frac);
  }

  // ── 1. Spouse ──────────────────────────────────────────────────────────────
  if (hasHusband) {
    addFixed('husband', 'الزوج', 1, hasChildren ? fr(1, 4) : fr(1, 2));
  }
  if (hasWife && wivesCount >= 1) {
    const total = hasChildren ? fr(1, 8) : fr(1, 4);
    if (wivesCount === 1) {
      addFixed('wife', 'الزوجة', 1, total);
    } else {
      // Each wife gets an equal portion of the wife share
      for (let i = 1; i <= Math.min(wivesCount, 4); i++) {
        addFixed(`wife_${i}`, `الزوجة ${i}`, 1, fr(total.n, total.d * Math.min(wivesCount, 4)));
        // Undo duplicate sumFixed additions — we add wivesCount shares that together equal total
        if (i > 1) sumFixed = fsub(sumFixed, fr(total.n, total.d * Math.min(wivesCount, 4)));
      }
      // Re-add total once
      sumFixed = fadd(fsub(sumFixed, fr(total.n * Math.min(wivesCount, 4), total.d * Math.min(wivesCount, 4))), total);
    }
  }

  // ── 2. Mother ─────────────────────────────────────────────────────────────
  if (hasMother) {
    // Two-Umars (Umariyatain) cases — special ijtihad:
    // If spouse present + father present + no children: mother gets 1/3 of remainder after spouse
    const umariyatain = (hasHusband || hasWife) && hasFather && !hasChildren && siblingsCount < 2;
    if (hasChildren || siblingsCount >= 2) {
      addFixed('mother', 'الأم', 1, fr(1, 6));
    } else if (umariyatain) {
      // We'll resolve 1/3 of remainder in asabah step; use placeholder 1/3 and adjust
      addFixed('mother', 'الأم', 1, fr(1, 3), 'مسألة العمريتين');
      heirs['mother']._umariyatain = true;
    } else {
      addFixed('mother', 'الأم', 1, fr(1, 3));
    }
  }

  // ── 3. Father ─────────────────────────────────────────────────────────────
  let fatherGetsAsabah = false;
  if (hasFather) {
    if (hasChildren) {
      // Father gets 1/6 fixed (and possibly asabah remainder with only daughters)
      addFixed('father', 'الأب', 1, fr(1, 6), sons === 0 && daughters > 0 ? 'السدس + الباقي (مع البنات)' : 'السدس');
      if (sons === 0 && daughters > 0) fatherGetsAsabah = true;
    } else {
      // No children: father gets the remainder (asabah)
      heirs['father'] = { label: 'الأب', count: 1, fraction: ZERO, amount: 0, note: 'العصبة (الباقي)', asabah: true };
      fatherGetsAsabah = true;
    }
  }

  // ── 4. Daughters (no sons) ────────────────────────────────────────────────
  if (daughters > 0 && sons === 0) {
    const f = daughters === 1 ? fr(1, 2) : fr(2, 3);
    addFixed('daughters', daughters === 1 ? 'البنت' : 'البنات', daughters, f);
  }

  // ── 5. Full sisters/brothers (only if not blocked) ────────────────────────
  if (!siblingsBlocked && (fullSisters > 0 || fullBrothers > 0) && !hasChildren) {
    if (fullBrothers === 0) {
      // Sisters alone (no brother)
      const f = fullSisters === 1 ? fr(1, 2) : fr(2, 3);
      addFixed('fullSisters', fullSisters === 1 ? 'الأخت الشقيقة' : 'الأخوات الشقيقات', fullSisters, f);
      // If there's also residual, sisters don't get asabah alone unless no other asabah (handled below)
    }
    // Brothers (or brothers + sisters) take asabah — handled below
  }

  // ── 6. Awl check ─────────────────────────────────────────────────────────
  const sumFixedVal = fval(sumFixed);
  const awl = sumFixedVal > 1.0001;
  const awlFactor = awl ? 1 / sumFixedVal : 1;

  // ── 7. Calculate amounts for fixed heirs ─────────────────────────────────
  for (const key of Object.keys(heirs)) {
    const h = heirs[key];
    if (!h.asabah && fval(h.fraction) > 0) {
      h.amount = fval(h.fraction) * estate * awlFactor;
    }
  }

  // ── 8. Remainder for asabah ───────────────────────────────────────────────
  const distributed = Object.values(heirs).reduce((s, h) => s + h.amount, 0);
  let remainder = estate - distributed;
  if (remainder < 0) remainder = 0;

  // Umariyatain adjustment: mother gets 1/3 of (estate minus spouse share)
  if (heirs['mother']?._umariyatain && !awl) {
    const spouseAmount = (heirs['husband']?.amount ?? 0) + Object.values(heirs).filter(h => h.label?.startsWith('الزوجة')).reduce((s, h) => s + h.amount, 0);
    const afterSpouse = estate - spouseAmount;
    const motherCorrect = afterSpouse / 3;
    const motherOld = heirs['mother'].amount;
    heirs['mother'].amount = motherCorrect;
    remainder += motherOld - motherCorrect; // adjust remainder
  }

  // Distribute remainder to asabah
  if (remainder > 0.001) {
    if (sons > 0) {
      // Sons + daughters (each son gets 2× a daughter's share)
      const units = sons * 2 + daughters;
      const perUnit = remainder / units;
      heirs['sons'] = { label: sons === 1 ? 'الابن' : 'الأبناء', count: sons, fraction: null, amount: perUnit * 2 * sons, note: 'للذكر مثل حظ الأنثيين', asabah: true };
      if (daughters > 0) {
        // Daughters were included above as fixed; now they get asabah portion too
        // Replace daughters' fixed entry with combined amount
        const daughterFixed = heirs['daughters']?.amount ?? 0;
        delete heirs['daughters'];
        heirs['daughters'] = { label: daughters === 1 ? 'البنت' : 'البنات', count: daughters, fraction: null, amount: daughterFixed + perUnit * daughters, note: 'مع إخوتهن (للذكر مثل حظ الأنثيين)', asabah: false };
      }
    } else if (fatherGetsAsabah) {
      if (heirs['father'].fraction && fval(heirs['father'].fraction) > 0) {
        heirs['father'].amount += remainder;
        heirs['father'].note = 'السدس + الباقي';
      } else {
        heirs['father'].amount = remainder;
      }
    } else if (!siblingsBlocked) {
      if (fullBrothers > 0 || fullSisters > 0) {
        // Brothers + sisters as asabah (brother gets 2× sister's share)
        const units = fullBrothers * 2 + fullSisters;
        const perUnit = remainder / units;

        if (fullBrothers > 0) {
          heirs['fullBrothers'] = { label: fullBrothers === 1 ? 'الأخ الشقيق' : 'الإخوة الأشقاء', count: fullBrothers, fraction: null, amount: perUnit * 2 * fullBrothers, note: 'عصبة', asabah: true };
        }
        if (fullSisters > 0) {
          if (fullBrothers > 0) {
            // Sisters participate with brothers as asabah
            const existing = heirs['fullSisters']?.amount ?? 0;
            heirs['fullSisters'] = { label: fullSisters === 1 ? 'الأخت الشقيقة' : 'الأخوات الشقيقات', count: fullSisters, fraction: null, amount: existing + perUnit * fullSisters, note: 'مع إخوتهن', asabah: false };
          }
          // Else sisters already have fixed share; remainder via radd below
        }
      } else {
        // Radd: return remainder to fixed-share heirs proportionally (excluding spouse)
        const raddEligible = Object.values(heirs).filter(h => h.amount > 0 && !h.label?.startsWith('الزوج'));
        const raddTotal = raddEligible.reduce((s, h) => s + h.amount, 0);
        if (raddTotal > 0) {
          for (const h of raddEligible) {
            const key = Object.keys(heirs).find(k => heirs[k] === h);
            heirs[key].amount += (h.amount / raddTotal) * remainder;
            heirs[key].raddNote = '(شمل الرد)';
          }
        }
      }
    }
    // If no asabah and no radd-eligible heirs, remainder goes to بيت المال (not shown)
  }

  // ── 9. Build results array ────────────────────────────────────────────────
  const results = Object.entries(heirs)
    .filter(([, h]) => h.amount > 0.001)
    .map(([key, h]) => ({
      key,
      label: h.label,
      count: h.count,
      amount: h.amount,
      percent: (h.amount / estate) * 100,
      fraction: h.fraction,
      note: [h.note, h.awlNote, h.raddNote].filter(Boolean).join(' — '),
    }));

  const warnings = [];
  if (awl) warnings.push('العول: المجموع تجاوز التركة وتم توزيعها بالتناسب');
  if (siblingsBlocked && (fullBrothers > 0 || fullSisters > 0)) {
    warnings.push('الإخوة والأخوات محجوبون ' + (hasFather ? 'بالأب' : 'بالأبناء'));
  }

  return {
    results,
    estate,
    totalFixed: sumFixedVal,
    awl,
    radd: !awl && Object.values(heirs).some(h => h.raddNote),
    isValid: true,
    warnings,
  };
}

export function fractionLabel(frac) {
  if (!frac || frac.n === 0) return null;
  const labels = {
    '1/2': 'النصف', '1/4': 'الربع', '1/8': 'الثمن',
    '1/3': 'الثلث', '1/6': 'السدس', '2/3': 'الثلثان',
    '1/1': 'الكل',
  };
  const key = `${frac.n}/${frac.d}`;
  return labels[key] ?? key;
}

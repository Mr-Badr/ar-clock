// Pure calculation logic for the bill-splitter tool.
// Two modes:
//  - equal: total amount / people count, with optional tip% and VAT%
//  - itemized: each item assigned to one or more specific people (or "everyone"),
//    tip and VAT distributed proportionally to each person's item subtotal — the
//    real differentiator vs. competitors that only support even/manual splitting.

function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const normalized = value.replace(/[,\s]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((toNumber(value) + Number.EPSILON) * factor) / factor;
}

export function calculateEqualSplit({ totalAmount, peopleCount, tipPercent = 0, vatPercent = 0 }) {
  const total = Math.max(0, toNumber(totalAmount));
  const count = Math.max(1, Math.round(toNumber(peopleCount) || 1));
  const tip = Math.max(0, toNumber(tipPercent));
  const vat = Math.max(0, toNumber(vatPercent));

  if (!total) {
    return { isValid: false };
  }

  const tipAmount = round(total * (tip / 100));
  const vatAmount = round(total * (vat / 100));
  const grandTotal = round(total + tipAmount + vatAmount);
  const perPerson = round(grandTotal / count);
  // last person absorbs the rounding remainder so the split always sums exactly
  const remainder = round(grandTotal - perPerson * count);

  return {
    isValid: true,
    subtotal: round(total),
    tipAmount,
    vatAmount,
    grandTotal,
    peopleCount: count,
    perPerson,
    remainder,
    shares: Array.from({ length: count }, (_, index) => ({
      index,
      amount: index === count - 1 ? round(perPerson + remainder) : perPerson,
    })),
  };
}

// people: [{ id, name }]
// items: [{ id, name, price, assignedTo: string[] | 'all' }]
export function calculateItemizedSplit({ people = [], items = [], tipPercent = 0, vatPercent = 0, payerId = null }) {
  const validPeople = people.filter((p) => p && p.id);
  if (validPeople.length === 0 || items.length === 0) {
    return { isValid: false };
  }

  const tip = Math.max(0, toNumber(tipPercent));
  const vat = Math.max(0, toNumber(vatPercent));

  const subtotalByPerson = Object.fromEntries(validPeople.map((p) => [p.id, 0]));
  let itemsSubtotal = 0;

  for (const item of items) {
    const price = Math.max(0, toNumber(item.price));
    if (!price) continue;
    itemsSubtotal += price;

    const assignees =
      !item.assignedTo || item.assignedTo === 'all' || (Array.isArray(item.assignedTo) && item.assignedTo.length === 0)
        ? validPeople.map((p) => p.id)
        : item.assignedTo;

    const share = price / assignees.length;
    for (const personId of assignees) {
      if (subtotalByPerson[personId] === undefined) continue;
      subtotalByPerson[personId] += share;
    }
  }

  const tipTotal = round(itemsSubtotal * (tip / 100));
  const vatTotal = round(itemsSubtotal * (vat / 100));
  const grandTotal = round(itemsSubtotal + tipTotal + vatTotal);

  const extraRate = itemsSubtotal > 0 ? (tipTotal + vatTotal) / itemsSubtotal : 0;

  const perPerson = validPeople.map((person) => {
    const itemsShare = subtotalByPerson[person.id] || 0;
    const extra = round(itemsShare * extraRate);
    const total = round(itemsShare + extra);
    return {
      id: person.id,
      name: person.name,
      itemsShare: round(itemsShare),
      extraShare: extra,
      total,
      owesPayer: payerId && person.id !== payerId ? total : 0,
    };
  });

  // fix rounding drift so the sum of per-person totals exactly equals grandTotal
  const sumTotals = perPerson.reduce((sum, p) => sum + p.total, 0);
  const drift = round(grandTotal - sumTotals);
  if (drift !== 0 && perPerson.length > 0) {
    const last = perPerson[perPerson.length - 1];
    last.total = round(last.total + drift);
    if (payerId && last.id !== payerId) last.owesPayer = last.total;
  }

  return {
    isValid: true,
    itemsSubtotal: round(itemsSubtotal),
    tipAmount: tipTotal,
    vatAmount: vatTotal,
    grandTotal,
    people: perPerson,
    payerId,
  };
}

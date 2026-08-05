// Shared Gulf country/currency list for any HVAC calculator that shows a money amount. The
// calculator math itself is currency-agnostic (the user always types their own real tariff/price
// in their own currency) — this only changes the displayed label, so it never needs to guess or
// hardcode a specific country's utility tariff (those change often and differ wildly between
// heavily-subsidized Gulf markets — not something to state as a fixed default number).
export const GULF_CURRENCIES = [
  { code: 'sa', country: 'السعودية', short: 'ريال' },
  { code: 'ae', country: 'الإمارات', short: 'درهم' },
  { code: 'kw', country: 'الكويت', short: 'دينار' },
  { code: 'qa', country: 'قطر', short: 'ريال قطري' },
  { code: 'bh', country: 'البحرين', short: 'دينار' },
  { code: 'om', country: 'عُمان', short: 'ريال عماني' },
];

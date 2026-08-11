// Per-country Zakat al-Fitr reference amounts — explicitly a *starting suggestion*, never
// authoritative. Every figure here is announced fresh each year by the relevant country's fatwa
// authority based on that year's local staple-food price, so these must be re-verified every
// Ramadan (see the `year` field) or the on-page banner correctly reads as stale. This is exactly
// the kind of time-sensitive figure the project's standing rule warns against hardcoding as fixed
// truth — used only as an editable placeholder, never a bound default value.
export const FITR_REFERENCE = [
  { code: 'ma', amount: 25, year: 2026, source: { label: 'المجلس العلمي الأعلى (المغرب)', url: 'https://www.habous.gov.ma' } },
  { code: 'eg', amount: 30, year: 2026, note: 'حد أدنى', source: { label: 'دار الإفتاء المصرية', url: 'https://www.dar-alifta.org' } },
  { code: 'dz', amount: 170, year: 2026, source: { label: 'وزارة الشؤون الدينية (الجزائر)', url: 'https://www.raya.ps/news/1213726.html' } },
  { code: 'tn', amount: 2, year: 2026, source: { label: 'مفتي الجمهورية التونسية', url: 'https://www.raya.ps/news/1213727.html' } },
  { code: 'jo', amount: 1.8, year: 2026, note: '180 قرش', source: { label: 'دار الإفتاء الأردنية', url: 'https://www.raya.ps/news/1213728.html' } },
  { code: 'iq', amount: 3000, year: 2026, source: { label: 'الوقف السني (العراق)', url: 'https://www.raya.ps/news/1212682.html' } },
];

export function getFitrReference(code) {
  return FITR_REFERENCE.find((r) => r.code === code) ?? null;
}

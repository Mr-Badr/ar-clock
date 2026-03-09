function normalizeArabic(s = '') {
  if (!s) return '';
  return s
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/(^|\s)ال/g, '$1')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

const cityFullName = "الدار البيضاء";
const cityAr = normalizeArabic(cityFullName);

const query1 = "دار بيضاء";
const nq1 = normalizeArabic(query1);

const query2 = "الرباط";
const nq2 = normalizeArabic(query2);

console.log("City:", cityAr);
console.log("Q1:", nq1, "Match:", cityAr.includes(nq1));

const city2 = normalizeArabic("رباط");
console.log("City2:", city2);
console.log("Q2:", nq2, "Match:", city2.includes(nq2));

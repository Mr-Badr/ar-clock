function normalizeArabic(s = '') {
  if (!s) return '';
  return s
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
    .replace(/^ال/, '') // strip definite article so الرباط matches رباط
    .toLowerCase()
    .trim();
}

console.log(normalizeArabic("الرباط"));
console.log(normalizeArabic("رباط"));
console.log("الرباط".replace(/^\u0627\u0644/, ''));

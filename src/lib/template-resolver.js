const TOKEN_RE = /\{\{\s*([\w.]+)\s*\}\}/g;

function scalar(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

export function resolveTemplate(template, context) {
  if (!template || typeof template !== 'string') return template;
  return template.replace(TOKEN_RE, (full, key) => {
    if (!(key in context)) return full;
    return scalar(context[key]);
  });
}

export function buildTemplateContext(base = {}) {
  const yearRaw = Number(base.year);
  const year = Number.isFinite(yearRaw) ? yearRaw : new Date().getFullYear();
  const hijriRaw = Number(base.hijriYear);
  const hijriYear = Number.isFinite(hijriRaw) ? hijriRaw : year;

  return {
    ...base,
    year,
    hijriYear,
    nextYear: year + 1,
  };
}


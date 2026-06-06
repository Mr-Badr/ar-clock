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

export function buildTemplateContext(base) {
  const contextBase = base && typeof base === 'object' ? base : {};
  const yearRaw = Number(contextBase.year);
  const hasYear = Number.isFinite(yearRaw);
  const year = hasYear ? yearRaw : '';
  const hijriRaw = Number(contextBase.hijriYear);
  const hijriYear = Number.isFinite(hijriRaw) ? hijriRaw : year;

  return {
    ...contextBase,
    year,
    hijriYear,
    nextYear: hasYear ? year + 1 : '',
  };
}

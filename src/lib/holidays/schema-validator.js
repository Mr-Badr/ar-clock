const REQUIRED = {
  Event: ['@type', 'name', 'startDate', 'description', 'url'],
  WebPage: ['@type', 'name', 'description', 'url', 'dateModified'],
  FAQPage: ['@type', 'mainEntity'],
  BreadcrumbList: ['@type', 'itemListElement'],
};

export function validateSchemaShape(schema) {
  if (!schema || typeof schema !== 'object') return ['schema_not_object'];
  const type = schema['@type'];
  const required = REQUIRED[type];
  if (!required) return [];
  return required.filter((field) => !schema[field]).map((field) => `missing_${field}`);
}


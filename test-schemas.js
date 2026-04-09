import fs from 'fs';
import { enrichEvent, buildWebPageSchema, buildFAQSchema } from './src/lib/holidays-engine.js';
import { getFaqItems } from './src/components/holidays/data/faqItems.js';

async function run() {
  const faqItems = await getFaqItems();
  const pageEvent = enrichEvent({
    slug:        'holidays',
    name:        'المناسبات والأعياد الإسلامية والوطنية',
    seoTitle:    'عداد المواعيد — الأعياد والمناسبات الإسلامية والوطنية بالعد التنازلي',
    description: 'تقويم شامل للمناسبات الإسلامية والأعياد الدينية والعطل الوطنية مع عداد تنازلي دقيق بالتقويمين الهجري والميلادي',
    faqItems,
  });
  console.log("FAQ:");
  console.log(JSON.stringify(buildFAQSchema(pageEvent), null, 2));
}
run();

import { replaceTokens } from '@/lib/holidays-engine';
import { getHolidayCategoryById } from '@/lib/holidays/taxonomy';
import {
  ensureCountryContextSentence,
  localizeEventLabel,
} from '@/lib/holidays/display';

function toPlainText(value) {
  if (!value) return '';
  return String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeQuickFacts(quickFacts) {
  if (Array.isArray(quickFacts)) {
    return quickFacts.filter((item) => item?.label && item?.value);
  }
  if (!quickFacts || typeof quickFacts !== 'object') return [];
  return Object.entries(quickFacts)
    .filter(([label, value]) => label && value)
    .map(([label, value]) => ({ label, value: String(value) }));
}

function normalizeAboutItems({ event, seo, tokenContext }) {
  if (seo.aboutEvent && typeof seo.aboutEvent === 'object') {
    return Object.entries(seo.aboutEvent)
      .filter(([heading, content]) => heading && content)
      .map(([heading, content]) => ({
        heading,
        content: toPlainText(replaceTokens(content, tokenContext)),
      }));
  }

  const items = [];
  if (seo.about?.heading || seo.about?.paragraphs?.length) {
    items.push({
      heading: seo.about?.heading || `عن ${event.name}`,
      content: toPlainText((seo.about?.paragraphs || []).join(' ')),
    });
  }
  if (seo.history) {
    items.push({ heading: 'التاريخ والخلفية', content: toPlainText(seo.history) });
  }
  if (seo.significance) {
    items.push({ heading: 'الأهمية والفضل', content: toPlainText(seo.significance) });
  }
  if (items.length === 0 && (seo.details || seo.description)) {
    items.push({ heading: `عن ${event.name}`, content: toPlainText(seo.details || seo.description) });
  }
  return items;
}

function buildAboutNotes({ event, calInfo, nowIso }) {
  const notes = [];
  if (event.type === 'hijri') {
    notes.push({
      id: 'source',
      kind: 'link',
      label: 'المصدر',
      href: 'https://aladhan.com',
      text: `AlAdhan API — ${calInfo?.label || 'أم القرى'}`,
    });
    if (calInfo?.localSighting) {
      notes.push({ id: 'variance', kind: 'text', text: 'قد يختلف الموعد بيوم بناءً على رؤية الهلال في بعض الدول.' });
    }
    notes.push({ id: 'refresh', kind: 'text', text: 'يُحدَّث تلقائياً كل 12 ساعة من المصدر الرسمي.' });
  }
  if (event.type === 'estimated') {
    notes.push({ id: 'estimated', kind: 'text', text: 'هذا التاريخ تقديري وقد يتغير بقرار رسمي.' });
  }
  if (event.type === 'monthly') {
    notes.push({ id: 'monthly', kind: 'text', text: 'يتكرر هذا الموعد كل شهر وفق نمط الصرف أو الاستحقاق المعتمد.' });
  }
  if (event.type === 'fixed') {
    notes.push({ id: 'fixed', kind: 'text', text: 'هذا التاريخ ثابت في التقويم الميلادي كل عام.' });
  }
  notes.push({
    id: 'updated-at',
    kind: 'text',
    text: `آخر تحديث: ${new Date(nowIso).toLocaleDateString('ar-SA-u-nu-latn')}`,
  });
  return notes;
}

function normalizeFaqItems(faqItems) {
  return (faqItems || [])
    .map((item) => ({
      question: item.q || item.question || '',
      answer: item.a || item.answer || '',
    }))
    .filter((item) => item.question && item.answer);
}

function normalizeEngagementItems(seo) {
  return (seo.engagementContent || [])
    .filter((item) => item?.text)
    .map((item) => ({
      text: toPlainText(item.text),
      type: item.type || 'fact',
      subcategory: item.subcategory || '',
    }));
}

function normalizeRelatedSlugs(event, seo) {
  const fromSeo = Array.isArray(seo.relatedSlugs) ? seo.relatedSlugs : [];
  const fromEvent = Array.isArray(event.relatedSlugs) ? event.relatedSlugs : [];
  return Array.from(new Set([...fromSeo, ...fromEvent].filter(Boolean))).filter((slug) => slug !== event.slug);
}

export function buildHolidayPageModel(input) {
  const {
    event,
    seo,
    quickFacts,
    faqItems,
    tokenContext,
    calInfo,
    nowIso,
  } = input;

  const category = getHolidayCategoryById(event.category);
  const aboutItems = normalizeAboutItems({ event, seo, tokenContext });
  const intentHeadingTemplate = category?.intentHeading || 'استعد لـ{{eventName}}';
  const displayTitle = localizeEventLabel(
    toPlainText(replaceTokens(seo?.seoMeta?.h1 || event.name, tokenContext)),
    event,
  );
  const answerSummary = ensureCountryContextSentence(
    toPlainText(replaceTokens(seo.answerSummary || '', tokenContext)),
    event,
  );

  return {
    meta: {
      categoryLabel: category?.label || event.category,
      categoryIcon: category?.icon || '📅',
      intentHeading: replaceTokens(intentHeadingTemplate, tokenContext),
      displayTitle,
    },
    hero: {
      titleLead: 'كم باقي على',
      title: displayTitle || event.name,
      answerSummary,
    },
    sections: {
      quickFacts: normalizeQuickFacts(quickFacts),
      intentCards: Array.isArray(seo.intentCards) ? seo.intentCards : [],
      about: {
        heading: `عن ${displayTitle || event.name}`,
        items: aboutItems,
        notes: buildAboutNotes({ event, calInfo, nowIso }),
      },
      recurringYears: seo.recurringYears || null,
      engagement: normalizeEngagementItems(seo),
      faq: normalizeFaqItems(faqItems),
      sources: Array.isArray(event.sources) ? event.sources : [],
      relatedSlugs: normalizeRelatedSlugs(event, seo),
    },
  };
}

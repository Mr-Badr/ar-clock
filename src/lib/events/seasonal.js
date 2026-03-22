/**
 * src/lib/events/seasonal.js
 * Seasonal and generic events (not country-specific).
 * These events have no _countryCode — they are universal.
 */

export const SEASONAL_EVENTS = [
  {
    id: 'new-year', slug: 'new-year', name: 'رأس السنة الميلادية', type: 'fixed', month: 1, day: 1, category: 'holidays',
    seoTitle: 'كم باقي على رأس السنة الميلادية {{nextYear}} — عد تنازلي',
    description: 'بداية العام الميلادي الجديد 1 يناير {{nextYear}}م.',
    keywords: ['كم باقي على {{nextYear}}', 'عد تنازلي رأس السنة', '1 يناير {{nextYear}}', 'رأس السنة {{nextYear}}'],
    faqItems: [{ q: 'كم باقي على رأس السنة {{nextYear}}؟', a: '1 يناير {{nextYear}}.' }],
  },
  {
    id: 'summer', slug: 'summer-season', name: 'بداية فصل الصيف', type: 'fixed', month: 6, day: 21, category: 'astronomy',
    seoTitle: 'موعد بداية فصل الصيف {{year}} — الانقلاب الصيفي',
    description: 'الانقلاب الصيفي 21 يونيو — بداية الصيف فلكياً.',
    keywords: ['بداية الصيف {{year}}', 'موعد الصيف فلكياً', 'الانقلاب الصيفي {{year}}'],
    faqItems: [{ q: 'كم باقي على الصيف {{year}}؟', a: '21 يونيو {{year}}.' }],
  },
  {
    id: 'winter', slug: 'winter-season', name: 'بداية فصل الشتاء', type: 'fixed', month: 12, day: 21, category: 'astronomy',
    seoTitle: 'موعد بداية فصل الشتاء {{year}} — الانقلاب الشتوي',
    description: 'الانقلاب الشتوي 21 ديسمبر — بداية الشتاء فلكياً.',
    keywords: ['بداية الشتاء {{year}}', 'الانقلاب الشتوي {{year}}', 'موعد الشتاء فلكياً'],
    faqItems: [{ q: 'كم باقي على الشتاء {{year}}؟', a: '21 ديسمبر {{year}}.' }],
  },
  {
    id: 'spring', slug: 'spring-season', name: 'بداية فصل الربيع', type: 'fixed', month: 3, day: 20, category: 'astronomy',
    seoTitle: 'موعد بداية فصل الربيع {{year}} — الاعتدال الربيعي',
    description: 'الاعتدال الربيعي 20 مارس — بداية الربيع فلكياً.',
    keywords: ['بداية الربيع {{year}}', 'الاعتدال الربيعي {{year}}'],
    faqItems: [{ q: 'كم باقي على الربيع {{year}}؟', a: '20 مارس {{year}}.' }],
  },
  {
    id: 'autumn', slug: 'autumn-season', name: 'بداية فصل الخريف', type: 'fixed', month: 9, day: 22, category: 'astronomy',
    seoTitle: 'موعد بداية فصل الخريف {{year}} — الاعتدال الخريفي',
    description: 'الاعتدال الخريفي 22 سبتمبر — بداية الخريف فلكياً.',
    keywords: ['بداية الخريف {{year}}', 'الاعتدال الخريفي {{year}}'],
    faqItems: [{ q: 'كم باقي على الخريف {{year}}؟', a: '22 سبتمبر {{year}}.' }],
  },
  {
    id: 'spring-vac', slug: 'spring-vacation', name: 'عطلة الربيع المدرسية', type: 'estimated', date: '{{year}}-03-29', category: 'school',
    seoTitle: 'موعد عطلة الربيع المدرسية {{year}}',
    description: 'إجازة الربيع المدرسية — تاريخ تقديري قد يتغير بقرار رسمي.',
    keywords: ['عطلة الربيع {{year}}', 'إجازة الربيع المدرسية {{year}}'],
    faqItems: [{ q: 'كم باقي على عطلة الربيع {{year}}؟', a: '~29 مارس {{year}}. قد يتغير بقرار رسمي.' }],
  },
  {
    id: 'summer-vac', slug: 'summer-vacation', name: 'بداية الإجازة الصيفية', type: 'estimated', date: '{{year}}-06-11', category: 'school',
    seoTitle: 'متى الإجازة الصيفية {{year}} — بداية إجازة الصيف',
    description: 'بداية الإجازة الصيفية للعام الدراسي 2025–{{year}}.',
    keywords: ['الإجازة الصيفية {{year}}', 'بداية الإجازة الصيفية {{year}}', 'عطلة الصيف {{year}}'],
    faqItems: [{ q: 'كم باقي على الإجازة الصيفية {{year}}؟', a: '~يونيو {{year}}. التواريخ تقديرية حسب الدولة.' }],
  },
  {
    id: 'back-to-school', slug: 'back-to-school', name: 'الدخول المدرسي', type: 'estimated', date: '{{year}}-09-20', category: 'school',
    seoTitle: 'موعد الدخول المدرسي {{year}} — بداية الدراسة',
    description: 'الدخول المدرسي التقديري للعام الدراسي {{year}}–{{nextYear}}.',
    keywords: ['الدخول المدرسي {{year}}', 'بداية الدراسة {{year}}', 'موعد الدراسة {{year}}'],
    faqItems: [{ q: 'كم باقي على الدراسة {{year}}؟', a: '~سبتمبر {{year}}. يتفاوت بحسب كل دولة.' }],
  },
];

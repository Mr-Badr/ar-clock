import { CALCULATOR_HUBS, CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { FEATURED_COUNTDOWN_LINKS } from '@/lib/seo/popular-links';
import { ALL_GUIDES } from '@/lib/guides/data';

const calculatorHubHrefs = new Set(CALCULATOR_HUBS.map((hub) => hub.href));

const TIME_AND_DATE_ITEMS = [
  {
    href: '/time-now',
    title: 'كم الساعة الآن في مدينتك؟',
    description: 'الوقت الحالي حسب المدينة والدولة مع صفحات محلية قابلة للفهرسة.',
  },
  {
    href: '/mwaqit-al-salat',
    title: 'مواقيت الصلاة اليوم',
    description: 'مواعيد الفجر والظهر والعصر والمغرب والعشاء حسب المدينة.',
  },
  {
    href: '/time-difference',
    title: 'فرق التوقيت بين مدينتين',
    description: 'اعرف من يسبق الآن وكم ساعة الفرق بين أي مدينتين.',
  },
  {
    href: '/date',
    title: 'التاريخ اليوم والتحويل',
    description: 'بوابة التاريخ الهجري والميلادي والمحولات والجداول اليومية.',
  },
  {
    href: '/date/converter',
    title: 'محول التاريخ الهجري والميلادي',
    description: 'حوّل التاريخ بسرعة بين الهجري والميلادي مع عرض واضح للنتيجة.',
  },
  {
    href: '/date/today/hijri',
    title: 'التاريخ الهجري اليوم',
    description: 'اعرف التاريخ الهجري الحالي اليوم مع الصياغة العربية المباشرة.',
  },
  {
    href: '/date/today/gregorian',
    title: 'التاريخ الميلادي اليوم',
    description: 'صفحة مباشرة للتاريخ الميلادي اليوم بصياغة جاهزة للمستخدم العربي.',
  },
];

const ECONOMY_ITEMS = [
  {
    href: '/economie',
    title: 'الاقتصاد الحي',
    description: 'مدخل موحد لأوقات الأسواق والذهب والفوركس والبورصات العالمية.',
  },
  {
    href: '/economie/market-hours',
    title: 'ساعات الأسواق والتداول',
    description: 'بوابة تجمع أدوات السوق الأمريكي والذهب والفوركس والبورصات.',
  },
  {
    href: '/economie/us-market-open',
    title: 'متى يفتح السوق الأمريكي اليوم؟',
    description: 'جواب مباشر بالعربية مع العد التنازلي ووقت الافتتاح بتوقيتك.',
  },
  {
    href: '/economie/gold-market-hours',
    title: 'هل الذهب مفتوح الآن؟',
    description: 'أوقات تداول الذهب من مدينتك مع أفضل نافذة للسيولة.',
  },
  {
    href: '/economie/forex-sessions',
    title: 'متى تبدأ جلسة لندن ونيويورك اليوم؟',
    description: 'جلسات الفوركس الأربع والنافذة الذهبية بتوقيتك المحلي.',
  },
  {
    href: '/economie/stock-markets',
    title: 'هل البورصات العالمية مفتوحة الآن؟',
    description: 'أمريكا ولندن والخليج في صفحة واحدة مع أوقات الفتح والإغلاق.',
  },
  {
    href: '/economie/market-clock',
    title: 'أين السيولة الأعلى الآن؟',
    description: 'ساعة سوق بصرية تكشف النشاط والسيولة داخل يومك المحلي.',
  },
  {
    href: '/economie/best-trading-time',
    title: 'ما أفضل وقت للتداول اليوم؟',
    description: 'أفضل نافذة اليوم لتداول الفوركس والذهب بحسب مدينتك.',
  },
];

const CALCULATOR_HUB_ITEMS = CALCULATOR_HUBS.map((hub) => ({
  href: hub.href,
  title: hub.title,
  description: hub.description,
}));

const CALCULATOR_TOOL_ITEMS = CALCULATOR_ROUTES
  .filter((route) => !calculatorHubHrefs.has(route.href))
  .map((route) => ({
    href: route.href,
    title: route.title,
    description: route.description,
  }));

const GUIDE_ITEMS = ALL_GUIDES.map((guide) => ({
  href: guide.href,
  title: guide.metaTitle || guide.title,
  description: guide.description,
}));

const HOLIDAY_ITEMS = [
  {
    href: '/holidays',
    title: 'العدادات والمناسبات القادمة',
    description: 'بوابة العدادات والمناسبات الموسمية والأعياد والإجازات.',
  },
  ...FEATURED_COUNTDOWN_LINKS.slice(0, 6).map((item) => ({
    href: item.href,
    title: item.label,
    description: 'صفحة عد تنازلي ومعلومة سريعة عن الموعد القادم.',
  })),
];

const COMPANY_ITEMS = [
  {
    href: '/about',
    title: 'من نحن',
    description: 'تعرف على فكرة ميقاتنا ومنهجه ومن يخدمه هذا المنتج.',
  },
  {
    href: '/editorial-policy',
    title: 'السياسة التحريرية',
    description: 'كيف نكتب ونراجع وننشر المحتوى والأدوات داخل الموقع.',
  },
  {
    href: '/contact',
    title: 'اتصل بنا',
    description: 'قنوات التواصل والاستفسارات والملاحظات.',
  },
  {
    href: '/privacy',
    title: 'سياسة الخصوصية',
    description: 'كيف نتعامل مع البيانات والملفات التقنية وحقوق المستخدم.',
  },
  {
    href: '/terms',
    title: 'شروط الاستخدام',
    description: 'الشروط المنظمة لاستخدام الأدوات والمحتوى داخل الموقع.',
  },
  {
    href: '/disclaimer',
    title: 'إخلاء المسؤولية',
    description: 'ملاحظات مهمة حول حدود الاستخدام والدقة والسياق.',
  },
];

export const SITE_DIRECTORY_SECTIONS = [
  {
    id: 'time',
    title: 'الوقت والتاريخ والمواعيد',
    description: 'الأدوات الأساسية التي تجيب عن الوقت الآن، الصلاة، فرق التوقيت، والتاريخ اليوم.',
    items: TIME_AND_DATE_ITEMS,
  },
  {
    id: 'calculators-hubs',
    title: 'مسارات الحاسبات',
    description: 'بوابات تجمع الأدوات المتقاربة حسب نية البحث، لا حسب اسم الحاسبة فقط.',
    items: CALCULATOR_HUB_ITEMS,
  },
  {
    id: 'calculators-tools',
    title: 'الحاسبات الفردية',
    description: 'الحاسبات نفسها: العمر، المال، البناء، النسب، القروض، الطوارئ، والديون.',
    items: CALCULATOR_TOOL_ITEMS,
  },
  {
    id: 'economy',
    title: 'أدوات الاقتصاد الحي',
    description: 'الذهب، السوق الأمريكي، جلسات الفوركس، البورصات، وساعة السيولة.',
    items: ECONOMY_ITEMS,
  },
  {
    id: 'guides',
    title: 'الأدلة العملية',
    description: 'صفحات شرح وتوجيه تدعم الحاسبات وتلتقط أسئلة long-tail التعليمية.',
    items: GUIDE_ITEMS,
  },
  {
    id: 'holidays',
    title: 'المناسبات والعدادات',
    description: 'صفحات العد التنازلي والمواسم والأعياد والصفحات الأكثر زيارة في هذا المسار.',
    items: HOLIDAY_ITEMS,
  },
  {
    id: 'company',
    title: 'الصفحات الأساسية',
    description: 'الصفحات التعريفية والتحريرية والقانونية والتواصل.',
    items: COMPANY_ITEMS,
  },
];

export const SITE_DIRECTORY_COUNTS = {
  sections: SITE_DIRECTORY_SECTIONS.length,
  items: SITE_DIRECTORY_SECTIONS.reduce((sum, section) => sum + section.items.length, 0),
  calculators: CALCULATOR_HUB_ITEMS.length + CALCULATOR_TOOL_ITEMS.length,
  economy: ECONOMY_ITEMS.length,
  guides: GUIDE_ITEMS.length,
};

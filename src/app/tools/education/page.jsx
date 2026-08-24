import Link from 'next/link';

import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import { HubGuideSection, HubFaq, buildHubFaqSchema } from '@/components/tools-v2/HubGuideSection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

function findRoute(slug) {
  const route = CALCULATOR_ROUTES.find((item) => item.slug === slug);
  if (!route) {
    throw new Error(`education hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Built 2026-08-04: this tool was already live with zero hub discoverability. Originally a
// single-tool hub — gpa/gpa-to-percent/weighted-grade/standard-deviation were EXCLUDED from
// PROMOTION after a real competitive audit found the GPA tools dominated by 9+ competitors
// including official university pages (gpa) and a global calculator giant (rapidtables.org,
// weighted-grade) — see keyword-research/health-education-hubs/DECISION.md. saudi-school-calendar
// survives as featured because our own page already ranks (confirmed directly in the SERP check).
// 2026-08-05: those excluded tools were still migrated off the retired /calculators/* path (owner
// directive — no /calculators path should exist at all) and are listed here as a real group so
// they get a genuine internal link for crawl/indexing purposes — listing ≠ new SEO investment,
// no new content was written for them, they were only relocated and re-skinned.
const TYPE_GROUPS = [
  {
    code: 'calendar',
    name: 'التقويم الدراسي',
    note: '',
    slugs: ['saudi-school-calendar'],
  },
  {
    code: 'student-tools',
    name: 'أدوات الطلاب',
    note: '',
    slugs: ['gpa', 'gpa-to-percent', 'weighted-grade', 'standard-deviation'],
  },
];

const FAQ_ITEMS = [
  {
    question: 'أي أداة أستخدم لمعدلي: GPA أم النسبة المئوية؟',
    answer: 'إذا كانت جامعتك أو مدرستك تعتمد نظام النقاط (عادة من 4 أو 5)، استخدم حاسبة GPA مباشرة بإدخال درجاتك وساعات كل مقرر. إذا كان لديك بالفعل معدل GPA وتحتاج تحويله إلى نسبة مئوية (مثلاً لتقديم على منحة أو جهة تطلب النسبة)، استخدم حاسبة تحويل GPA إلى نسبة بدلاً من إعادة الحساب من الصفر.',
  },
  {
    question: 'ما الفرق بين المعدل العادي والمعدل الموزون (Weighted GPA)؟',
    answer: 'المعدل العادي يعامل كل مقرر بنفس الوزن بغض النظر عن صعوبته أو عدد ساعاته، بينما المعدل الموزون يضاعف تأثير المقررات الأصعب (مثل المقررات المتقدمة) أو الأعلى في عدد الساعات المعتمدة. إن كانت مدرستك أو جامعتك تفرّق بين مستويات المقررات في حساب المعدل، فأنت تحتاج حاسبة المعدل الموزون تحديداً، لا الحاسبة العادية.',
  },
  {
    question: 'كيف أحول معدل GPA من نظام 4.0 إلى نظام 5.0 أو العكس؟',
    answer: 'الأنظمة المختلفة (4.0 الأمريكي الشائع، 5.0 المستخدم في بعض الجامعات العربية) ليست مجرد ضرب بسيط في نسبة ثابتة — التحويل الدقيق يعتمد على جدول تقدير الجامعة المحدد (كيف تُترجم كل درجة حرفية إلى نقاط في كل نظام). استخدم حاسبة تحويل GPA إلى نسبة كخطوة وسيطة موثوقة، وارجع دائماً لجدول جامعتك الرسمي عند وجود فرق مهم في القرار (كالتقديم على منحة).',
  },
  {
    question: 'لماذا أحتاج حاسبة الانحراف المعياري في سياق دراسي؟',
    answer: 'الانحراف المعياري يفيدك عملياً في فهم مدى تشتت درجاتك أو درجات دفعتك حول المتوسط — مفيد خصوصاً إذا كنت تقارن أداءك بمعدل الشعبة، أو تحلل بيانات لمشروع بحثي أو تكليف إحصائي. أدخل مجموعة الدرجات في الحاسبة لتحصل على المتوسط والانحراف المعياري مباشرة دون حساب يدوي.',
  },
  {
    question: 'هل التقويم الدراسي السعودي هنا يشمل كل الإجازات؟',
    answer: 'نعم — بداية العام الدراسي، إجازة نصف العام، بداية الفصل الثاني، ونهاية العام، مع عداد تنازلي حي لكل موعد قادم حتى لا تحتاج متابعته يدوياً على تقويم ورقي أو تطبيق منفصل.',
  },
];

function ToolLink({ slug }) {
  const route = findRoute(slug);
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={route.href}>
            <span className="tool-v2-dot" aria-hidden="true">•</span>
            <span className="tool-v2-link-text">{route.shortLabel || route.title}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>{route.description}</TooltipContent>
      </Tooltip>
    </li>
  );
}

export const metadata = buildCanonicalMetadata({
  title: 'التقويم الدراسي السعودي وأدوات الطلاب',
  description: 'التقويم الدراسي السعودي الكامل: بداية الدراسة، الإجازات، والعودة — مع عد تنازلي لكل إجازة.',
  keywords: [
    'التقويم الدراسي السعودي',
    'بداية الدراسة في السعودية',
    'اجازات المدارس السعودية',
    'حاسبة المعدل التراكمي',
    'تحويل المعدل الى نسبة مئوية',
  ],
  url: `${SITE_URL}/tools/education`,
});

export default function EducationCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التعليم', item: `${SITE_URL}/tools/education` },
    ],
  };
  const faqSchema = buildHubFaqSchema(FAQ_ITEMS);

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-education-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3 2 8l10 5 10-5-10-5ZM4 10.5V16c0 1.5 3.5 4 8 4s8-2.5 8-4v-5.5" />
              </svg>
            </span>
            <h1>التعليم والتقويم الدراسي</h1>
          </div>
          <p>
            التقويم الدراسي السعودي الكامل — بداية العام، كل الإجازات، وعد تنازلي حي لكل موعد.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> أداة مرتبطة مباشرة</span>
          </div>
        </div>

        <TooltipProvider>
          <div className="tool-v2-type-groups">
            {TYPE_GROUPS.map((group) => (
              <div key={group.code} className="tool-v2-type-group">
                <h2>{group.name}</h2>
                {group.note ? <p className="tool-v2-type-group-note">{group.note}</p> : null}
                <ul className="tool-v2-tool-link-list">
                  {group.slugs.map((slug) => (
                    <ToolLink key={slug} slug={slug} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TooltipProvider>

        <HubGuideSection id="how-to-choose" title="أي أداة تختار حسب سؤالك؟">
          <p>
            إذا كانت جامعتك تعتمد نظام النقاط، ابدأ بحاسبة المعدل التراكمي (GPA) وأدخل درجاتك
            وساعات كل مقرر. إذا كان لديك معدل جاهز وتحتاج تحويله إلى نسبة مئوية لجهة تطلب ذلك،
            انتقل إلى حاسبة تحويل GPA إلى نسبة مباشرة بدل إعادة الحساب. أما إذا كانت مقرراتك
            تختلف في وزنها أو صعوبتها ضمن نظام تقييم جامعتك، فحاسبة المعدل الموزون هي الأدق. وإذا
            كنت تحلل مجموعة درجات (لك أو لدفعتك) وتحتاج فهم مدى تشتتها، فحاسبة الانحراف المعياري
            تعطيك ذلك مباشرة.
          </p>
        </HubGuideSection>

        <HubGuideSection id="hub-faq" title="الأسئلة الشائعة">
          <HubFaq items={FAQ_ITEMS} />
        </HubGuideSection>
      </div>
    </main>
  );
}

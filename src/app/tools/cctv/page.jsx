import Link from 'next/link';

import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import { HubGuideSection } from '@/components/tools-v2/HubGuideSection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

function findRoute(slug) {
  const route = CALCULATOR_ROUTES.find((item) => item.slug === slug);
  if (!route) {
    throw new Error(`cctv hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Narrow, deliberately small hub (2026-08-03) — "كاميرات المراقبة" itself is a huge but
// brand/retailer-owned keyword space (512k/mo, only 10% low-competition). This hub does NOT
// compete for that term; it picks off the one genuine calculator gap (NVR/DVR storage sizing,
// zero Arabic interactive competitor found) plus a short buying guide for the remaining
// non-calculator seed keywords. See keyword-research/narrow-tools-2026-08-03/DECISION.md §1.
// Explicitly flagged: this container does NOT mean the category passed the full 5-check Hub
// Gate (docs/PLAN.md §15) as a strategic category — it's the minimal required container for
// one validated tool, not a commitment to build 30+ CCTV pages.
const FEATURED_SLUGS = ['cctv-nvr-storage-calculator', 'cctv-buying-guide'];

const TYPE_GROUPS = [
  {
    code: 'tools',
    name: 'الأدوات',
    note: 'قبل شراء أي قرص أو NVR — اعرف السعة الحقيقية التي تحتاجها.',
    slugs: ['cctv-nvr-storage-calculator'],
  },
  {
    code: 'articles',
    name: 'المقالات',
    note: '',
    slugs: ['cctv-buying-guide'],
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
  title: 'حاسبة سعة تخزين كاميرات المراقبة ودليل الاختيار',
  description:
    'احسب سعة التخزين المطلوبة لكاميرات المراقبة (NVR/DVR) حسب عدد الكاميرات ودقتها وأيام الاحتفاظ، مع دليل اختيار كاميرات مراقبة عملي.',
  keywords: [
    'حاسبة سعة تخزين كاميرات المراقبة',
    'كاميرات المراقبة المنزلية',
    'كاميرا سلكية ام لاسلكية',
    'اسعار كاميرات المراقبة',
    'افضل هارد ديسك لكاميرات المراقبة',
  ],
  url: `${SITE_URL}/tools/cctv`,
});

export default function CctvCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'كاميرات المراقبة', item: `${SITE_URL}/tools/cctv` },
    ],
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolTopAdSlot slotId="top-cctv-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 8h11l5-3v14l-5-3H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
              </svg>
            </span>
            <h1>كاميرات المراقبة</h1>
          </div>
          <p>
            كم تيرابايت تحتاج فعلياً لتسجيل كاميراتك، وكيف تختار النوع المناسب لمنزلك — أداة
            حسابية حقيقية بدل التخمين، ودليل اختيار مختصر.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> صفحات مرتبطة مباشرة</span>
          </div>
        </div>

        <div className="tool-v2-featured-row">
          {FEATURED_SLUGS.map((slug) => {
            const route = findRoute(slug);
            return (
              <Link key={slug} href={route.href} className="tool-v2-featured-tool">
                <span className="tool-v2-ft-ic" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
                  </svg>
                </span>
                <span>
                  <b>{route.shortLabel || route.title}</b>
                  <span>{route.badge}</span>
                </span>
              </Link>
            );
          })}
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

        <HubGuideSection id="storage-vs-cameras" title="ابدأ بالتخزين، لا بعدد الكاميرات فقط">
          <p>
            كثيرون يشترون الكاميرات أولاً ثم يفاجؤون بامتلاء القرص الصلب خلال أيام قليلة —
            الترتيب الأصح هو تحديد كم يوماً تريد الاحتفاظ بالتسجيلات أولاً، ثم حساب السعة اللازمة
            لعدد كاميراتك ودقتها، ثم اختيار قرص أكبر من الحد الأدنى المحسوب بهامش أمان. الدقة
            الأعلى والترميز الأقدم (H.264 بدل H.265) يضاعفان المساحة المطلوبة بسرعة دون أن يلاحظ
            المستخدم ذلك عند الشراء الأولي.
          </p>
          <p>
            التخزين المحلي (على قرص داخل جهاز NVR أو DVR في منزلك) يمنحك تسجيلات لا تعتمد على
            اتصال إنترنت مستمر ولا اشتراك شهري متكرر، بخلاف التخزين السحابي الذي يحفظ اللقطات
            خارج الموقع فيبقى متاحاً حتى لو سُرق جهاز التسجيل نفسه أو تعطّل. كثير من الأنظمة
            الحديثة تدعم الخيارين معاً — احسب سعة قرصك المحلي أولاً في الأداة أدناه بغض النظر عن
            قرارك بشأن التخزين السحابي الإضافي.
          </p>
        </HubGuideSection>
      </div>
    </main>
  );
}

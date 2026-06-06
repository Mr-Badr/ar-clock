import Link from 'next/link';
import {
  ArrowLeft,
  Calculator,
  Clock3,
  Landmark,
  Search,
} from 'lucide-react';

import CtaLink from '@/components/shared/CtaLink';
import { FeatureItem, SectionBadge, SectionWrapper } from '@/components/shared/primitives';
import { buildDiscoveryViewModel } from '@/lib/site/discovery';
import { getSiteUrl } from '@/lib/site-config';

const H2_ID = 'h2-start-here';
const SITE_URL = getSiteUrl();

export default function SectionStartHere() {
  const viewModel = buildDiscoveryViewModel('');
  const featuredItems = Array.isArray(viewModel.featuredItems)
    ? viewModel.featuredItems.slice(0, 4)
    : [];

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'مسارات البدء السريعة في ميقاتنا',
    itemListElement: featuredItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <SectionWrapper
      id="section-start-here"
      headingId={H2_ID}
      subtle
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="home-start-layout grid items-start gap-8 lg:grid-cols-[0.98fr_1.02fr] lg:gap-12">
        <div className="media-split__content home-start-copy">
          <SectionBadge>
            <Search size={11} />
            اختر أقرب نتيجة لما تحتاجه
          </SectionBadge>

          <h2
            id={H2_ID}
            className="section-title"
          >
            ابدأ من السؤال، لا من قائمة طويلة
          </h2>

          <p className="feature-copy">
            اختر أقرب نية لك الآن: معرفة الوقت، تنظيم الصلاة، تحويل التاريخ، أو استخدام حاسبة يومية.
            كل مسار يبدأ بالنتيجة ثم يضع الشرح والمصدر والخطوة التالية في مكانها.
          </p>

          <ul className="feature-list" role="list" aria-label="كيف تستفيد من هذه المنطقة">
            <FeatureItem icon={Clock3}>
              للجواب اللحظي، ابدأ من <strong>الوقت الان</strong> أو <strong>مواقيت الصلاة</strong>.
            </FeatureItem>
            <FeatureItem icon={Calculator}>
              للحسابات، افتح الأداة أولاً ثم راجع المثال والافتراضات من نفس الصفحة.
            </FeatureItem>
            <FeatureItem icon={Landmark}>
              للمواعيد الرسمية أو الدينية أو المالية، راجع طريقة الحساب قبل الاعتماد النهائي.
            </FeatureItem>
          </ul>

          <div className="action-row">
            <CtaLink href="/fahras">افتح استكشف الصفحات</CtaLink>
            <Link
              href="/time-now"
              className="text-link"
            >
              ابدأ من الوقت الان
            </Link>
          </div>
        </div>

        <div className="home-start-choices space-y-4">
          <nav className="home-start-primary-list" aria-label="مسارات البداية المقترحة">
            {featuredItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="section-card-link home-start-link group"
              >
                <span className="home-start-link__number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="home-start-link__body">
                  <div className="home-start-link__meta">
                    <span>
                      {item.badge || item.sectionTitle || 'مسار سريع'}
                    </span>
                  </div>

                  <h3 className="section-card-title home-start-link__title">
                    {item.title}
                  </h3>
                  <p className="section-card-copy home-start-link__copy">
                    {item.description}
                  </p>
                </div>

                <span className="section-card-action home-start-link__action">
                  ابدأ
                  <ArrowLeft size={15} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </SectionWrapper>
  );
}

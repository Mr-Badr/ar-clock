// app/time-difference/converter/page.jsx
import './converter.css';
import Link from 'next/link';
import { Suspense } from 'react';
import TimezoneConverterTool from './TimezoneConverterTool.client';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'محوّل المناطق الزمنية — قارن ٢ إلى ٤ مدن بالتزامن | ميقاتنا',
  description:
    'أداة تفاعلية لمقارنة الوقت في ٢–٤ مدن عربية وعالمية دفعةً واحدة. حرّك شريط الوقت لمعرفة ساعات الدوام المشتركة وأفضل وقت للاتصال أو الاجتماع.',
  url: `${SITE_URL}/time-difference/converter`,
  keywords: [
    'محول المناطق الزمنية',
    'مقارنة التوقيت بين مدن',
    'الوقت في عدة مدن',
    'فرق التوقيت',
    'حاسبة التوقيت',
    'وقت الاتصال المناسب',
    'مناطق زمنية عربية',
    'time zone converter arabic',
  ],
});

const toolSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'محوّل المناطق الزمنية',
  url: `${SITE_URL}/time-difference/converter`,
  description: 'قارن الوقت في ٢–٤ مدن عربية وعالمية بالتزامن. يحتسب التوقيت الصيفي تلقائياً.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  inLanguage: 'ar',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const USAGE_TIPS = [
  {
    title: 'قبل الاتصال',
    body: 'تحقق أن الطرف الآخر في ساعات الدوام (المظللة بالأخضر) قبل الضغط على زر الاتصال.',
  },
  {
    title: 'للاجتماعات الدولية',
    body: 'أضف مدن المشاركين الأربعة ثم حرّك الشريط لتجد نافذة تقع داخل وقت العمل للجميع.',
  },
  {
    title: 'مع التوقيت الصيفي',
    body: 'الأداة تحتسب DST تلقائياً. لا حاجة لتعديل يدوي عند تغيير الساعة الصيفية في أوروبا أو أمريكا.',
  },
];

export default function ConverterPage() {
  return (
    <>
      <JsonLd data={toolSchema} />

      <main dir="rtl" lang="ar">
        <div className="container">
          <AdTopBanner />

          <header style={{ paddingBlock: 'var(--space-8) var(--space-4)' }}>
            <nav aria-label="مسار التنقل" style={{ marginBottom: 'var(--space-3)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Link href="/">الرئيسية</Link>
              {' › '}
              <Link href="/time-difference">فرق التوقيت</Link>
              {' › '}
              <span>المحوّل</span>
            </nav>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
              محوّل المناطق الزمنية
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '55ch', lineHeight: 1.7 }}>
              اختر حتى أربع مدن عربية أو عالمية وقارن أوقاتها في لحظة واحدة.
              حرّك الشريط أو استخدم الأسهم لمعرفة النافذة المناسبة للاتصال أو الاجتماع.
            </p>
          </header>

          <section aria-label="أداة مقارنة المناطق الزمنية" style={{ marginBottom: 'var(--space-8)' }}>
            <Suspense fallback={<div style={{ minHeight: '16rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>تحميل الأداة...</div>}>
              <TimezoneConverterTool />
            </Suspense>
          </section>

          <AdInArticle />

          {/* Usage tips */}
          <section aria-labelledby="usage-heading" style={{ marginBlock: 'var(--space-8)' }}>
            <h2 id="usage-heading" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              كيف تستخدم المحوّل
            </h2>
            <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {USAGE_TIPS.map((tip) => (
                <div
                  key={tip.title}
                  style={{
                    padding: 'var(--space-4)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--surface)',
                  }}
                >
                  <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 'var(--space-2)' }}>
                    {tip.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    {tip.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading" style={{ marginBlock: 'var(--space-8)' }}>
            <h2 id="faq-heading" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              أسئلة شائعة
            </h2>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                {
                  q: 'كيف تحتسب الأداة التوقيت الصيفي (DST)؟',
                  a: 'تعتمد الأداة على واجهة Intl.DateTimeFormat المضمّنة في المتصفح، وهي تقرأ قواعد التوقيت الصيفي لكل منطقة زمنية IANA تلقائياً بحسب التاريخ الحالي. لذلك تتغير الأوفست تلقائياً عند تحويل الساعة في مارس أو أكتوبر.',
                },
                {
                  q: 'ما الفرق بين هذه الأداة وصفحة فرق التوقيت؟',
                  a: 'صفحة فرق التوقيت تركّز على مدينتين بالتفصيل مع جدول تحويل شامل وساعة حية. أما المحوّل هنا فيتيح رؤية ٢–٤ مدن في لقطة واحدة، وهو أنسب للمقارنة السريعة قبل الاتصال أو تحديد موعد اجتماع.',
                },
                {
                  q: 'هل يمكنني مقارنة مدن لا تقع في العالم العربي؟',
                  a: 'نعم. القائمة تشمل مدناً أوروبية وأمريكية وأسترالية إلى جانب المدن العربية، لأن أبرز حالات الاستخدام هي التواصل بين المغترب العربي وذويه في بلده الأصلي.',
                },
              ].map(({ q, a }) => (
                <div key={q}>
                  <dt style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 'var(--space-1)' }}>{q}</dt>
                  <dd style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, marginInlineStart: 0 }}>{a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Internal links */}
          <section aria-labelledby="related-heading" style={{ marginBlock: 'var(--space-6)' }}>
            <h2 id="related-heading" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--text-muted)' }}>
              أدوات ذات صلة
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {[
                { href: '/time-difference', label: 'فرق التوقيت بين مدينتين' },
                { href: '/time-now', label: 'الوقت الآن في أي مدينة' },
                { href: '/mwaqit-al-salat', label: 'مواقيت الصلاة' },
                { href: '/date/converter', label: 'تحويل التاريخ هجري / ميلادي' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    background: 'var(--surface)',
                    transition: 'border-color 0.15s',
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>

          <AdMultiplex />
        </div>
      </main>
    </>
  );
}

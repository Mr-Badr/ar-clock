import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { AUTHORS, buildPersonSchema } from '@/data/site/authors';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

export async function generateStaticParams() {
  return Object.keys(AUTHORS).map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const author = AUTHORS[id];
  if (!author) return {};
  return buildCanonicalMetadata({
    title: `${author.name} — ${author.role} في ميقاتنا`,
    description: author.bio,
    url: `${SITE_URL}/author/${id}`,
  });
}

export default async function AuthorPage({ params }) {
  const { id } = await params;
  const author = AUTHORS[id];
  if (!author) notFound();

  const personSchema = buildPersonSchema(id);

  const COVER_LABELS = {
    finance: 'الحاسبات المالية',
    time: 'الوقت الان',
    prayer: 'مواقيت الصلاة',
    date: 'التاريخ والتقويم',
    holidays: 'المناسبات والأعياد',
    health: 'الحاسبات الصحية',
    calculators: 'الحاسبات العامة',
  };

  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-base text-primary">
      <JsonLd data={personSchema} />

      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">

        {/* Back link */}
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          من نحن
        </Link>

        {/* Author header */}
        <div className="flex items-start gap-5 mb-10">
          <div
            className="flex-shrink-0 w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground border border-border overflow-hidden"
            aria-hidden="true"
          >
            {/* Show initials if no photo */}
            {author.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-primary mb-1">{author.name}</h1>
            <p className="text-sm font-semibold text-accent-alt mb-1">{author.role}</p>
            <p className="text-sm text-muted-foreground">{author.credentials}</p>
          </div>
        </div>

        {/* Bio */}
        <section aria-labelledby="author-bio-heading" className="mb-10">
          <h2 id="author-bio-heading" className="text-lg font-bold mb-3">نبذة</h2>
          <p className="text-base leading-relaxed text-secondary">{author.bio}</p>
        </section>

        {/* Coverage areas */}
        {author.covers?.length ? (
          <section aria-labelledby="author-covers-heading" className="mb-10">
            <h2 id="author-covers-heading" className="text-lg font-bold mb-3">أقسام المراجعة</h2>
            <ul className="flex flex-wrap gap-2">
              {author.covers.map((area) => (
                <li
                  key={area}
                  className="px-3 py-1.5 rounded-md text-sm font-medium border border-border bg-muted text-secondary"
                >
                  {COVER_LABELS[area] || area}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Contact + sameAs */}
        <section aria-labelledby="author-contact-heading" className="mb-10">
          <h2 id="author-contact-heading" className="text-lg font-bold mb-3">التواصل</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="text-muted-foreground">البريد: </span>
              <a href={`mailto:${author.email}`} className="underline text-accent-alt hover:opacity-80">
                {author.email}
              </a>
            </li>
            {author.sameAs?.filter(Boolean).map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-accent-alt hover:opacity-80">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Methodology */}
        <section aria-labelledby="author-method-heading" className="mb-10">
          <h2 id="author-method-heading" className="text-lg font-bold mb-3">منهجية العمل</h2>
          <div className="space-y-3 text-base leading-relaxed text-secondary">
            <p>
              يعتمد بدر الدين في كل أداة أو صفحة محتوى على مصادر بيانات أولية قبل الكتابة: القوانين والأنظمة الرسمية للجهات الحكومية، والبيانات الجغرافية الموثّقة من قواعد بيانات مفتوحة المصدر كـ GeoNames، وخوارزميات حساب أوقات الصلاة المُحكَّمة علمياً. لا يُنشر أي رقم في أداة مالية أو صحية دون مقارنته بحاسبات الجهات الرسمية للدولة المعنية.
            </p>
            <p>
              أدوات الوقت ومواقيت الصلاة تعتمد على حزمة Adhan الحسابية المُشار إليها في الأدبيات العلمية، مع بيانات مناطق زمنية محدّثة من قاعدة IANA tzdata. أدوات التقويم الهجري تعتمد معيار أم القرى المعمول به رسمياً في المملكة العربية السعودية، مع إشارة صريحة عند وجود اختلافات بين الدول.
            </p>
            <p>
              كل حاسبة مالية — من مكافأة نهاية الخدمة إلى الزكاة إلى ضريبة القيمة المضافة — مصحوبة بروابط للمصادر التشريعية الأصلية حتى يتمكن المستخدم من التحقق بنفسه. النتائج تُقدَّم كتقديرات إرشادية لا كحكم قانوني نهائي، ويُصرَّح بذلك بوضوح في كل صفحة.
            </p>
          </div>
        </section>

        {/* Tools authored */}
        <section aria-labelledby="author-tools-heading" className="mb-10">
          <h2 id="author-tools-heading" className="text-lg font-bold mb-3">أبرز الأدوات التي أشرف عليها</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              { href: '/calculators/end-of-service-benefits', label: 'حاسبة مكافأة نهاية الخدمة السعودية' },
              { href: '/calculators/uae-end-of-service', label: 'حاسبة مكافأة نهاية الخدمة الإمارات' },
              { href: '/calculators/zakat', label: 'حاسبة الزكاة' },
              { href: '/calculators/salary', label: 'حاسبة الراتب' },
              { href: '/calculators/pregnancy', label: 'حاسبة الحمل' },
              { href: '/calculators/gpa', label: 'حاسبة المعدل التراكمي GPA' },
              { href: '/mwaqit-al-salat', label: 'مواقيت الصلاة' },
              { href: '/holidays', label: 'صفحات المناسبات والأعياد' },
            ].map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30 hover:bg-muted transition-colors text-primary hover:text-accent-alt"
                >
                  <ArrowLeft size={12} className="text-accent-alt flex-shrink-0" />
                  {tool.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Update policy */}
        <section aria-labelledby="author-update-heading" className="mb-10">
          <h2 id="author-update-heading" className="text-lg font-bold mb-3">دورة مراجعة المحتوى</h2>
          <p className="text-base leading-relaxed text-secondary">
            يخضع محتوى ميقاتنا لمراجعات دورية مُجدوَلة: الأدوات المالية تُراجع فور صدور أي تعديل تشريعي، وصفحات المناسبات تُحدَّث سنوياً مع تغيُّر المواعيد، وبيانات المناطق الزمنية تتابع إصدارات tzdata عند حدوث تغييرات رسمية. أي قارئ يكتشف خطأً يمكنه التواصل عبر البريد الإلكتروني وسيُعالَج الأمر في أسرع وقت ممكن مع الإشارة للمصدر الصحيح.
          </p>
        </section>

        {/* Editorial policy note */}
        <div className="p-4 rounded-lg border border-border bg-muted/40 text-sm text-secondary leading-relaxed">
          <strong className="text-primary">ملاحظة شفافية:</strong>{' '}
          يُراجع المؤلف المحتوى والبيانات المصدرية بشكل دوري. للاطلاع على معايير الدقة وآلية التحديث والإبلاغ عن خطأ،
          راجع{' '}
          <Link href="/editorial-policy" className="underline text-accent-alt hover:opacity-80">
            السياسة التحريرية
          </Link>.
        </div>
      </div>
    </main>
  );
}

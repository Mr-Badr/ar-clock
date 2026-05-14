import CountryTable from './CountryTable';
import { getHolidayPageCountryDates } from '@/lib/holidays/page-data';
import { logError } from '@/lib/observability';

function SectionCard({ title, description, children }) {
  return (
    <section style={{ marginTop: 'var(--space-8)' }} aria-labelledby="country-h">
      <h2
        id="country-h"
        style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        مواعيد {title} حسب الدولة
      </h2>
      <div
        className="card-nested"
        style={{
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}

export function CountryDatesSectionFallback({ title }) {
  return (
    <SectionCard
      title={title}
      description="جار تجهيز مقارنة المواعيد بين الدول. يمكنك متابعة العد التنازلي والمحتوى الأساسي الآن، وسيظهر هذا القسم فور اكتماله."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} aria-hidden="true">
        {[1, 2, 3].map((row) => (
          <div
            key={row}
            style={{
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-surface-3)',
              border: '1px solid var(--border-subtle)',
              opacity: 0.65,
            }}
          />
        ))}
      </div>
    </SectionCard>
  );
}

function CountryDatesSectionError({ title }) {
  return (
    <SectionCard
      title={title}
      description="تعذر تحميل مقارنة الدول في هذه اللحظة، لكن تفاصيل المناسبة والعد التنازلي ما زالا يعملان بشكل طبيعي."
    >
      <p
        style={{
          margin: 0,
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
        }}
      >
        أعد تحميل الصفحة لاحقاً إذا كنت تحتاج هذه المقارنة التفصيلية.
      </p>
    </SectionCard>
  );
}

export default async function CountryDatesSection({ slug, title, event }) {
  try {
    const countryDates = await getHolidayPageCountryDates(slug);
    if (!countryDates?.length) return null;

    return <CountryTable title={title} event={event} countryDates={countryDates} />;
  } catch (error) {
    logError('holiday-country-dates-section-failed', {
      slug,
      canonicalSlug: event?.__canonicalSlug || event?.slug || null,
      message: error?.message || String(error),
    });
    return <CountryDatesSectionError title={title || event?.name || 'المناسبة'} />;
  }
}

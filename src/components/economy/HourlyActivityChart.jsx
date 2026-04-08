export default function HourlyActivityChart({ chart, title = 'خريطة النشاط اليومي' }) {
  return (
    <div className="economy-activity-card">
      <div className="economy-section__header">
        <h3 className="economy-section__title">{title}</h3>
        <p className="economy-section__lead">
          كل عمود يلخص الساعة المحلية لديك. الارتفاع الأكبر يعني تداخلاً أكبر بين الجلسات وسيولة أعلى.
        </p>
      </div>

      <div className="economy-activity-chart" role="img" aria-label={title}>
        {chart.points.map((point) => (
          <div key={point.key} className="economy-activity-chart__column">
            <div className="economy-activity-chart__value">{point.score}</div>
            <div
              className="economy-activity-chart__bar"
              data-band={point.band}
              style={{ '--bar-height': `${Math.max((point.score / chart.maxScore) * 100, point.score > 0 ? 18 : 8)}%` }}
              title={`${point.hourLabel} — ${point.hint} — ${point.sessionsLabel}`}
            />
            <div className="economy-activity-chart__hour">{point.hourLabel}</div>
          </div>
        ))}
      </div>

      <div className="economy-activity-chart__legend">
        <span data-band="quiet">هدوء</span>
        <span data-band="warm">تداخل متوسط</span>
        <span data-band="active">نشاط مرتفع</span>
        <span data-band="peak">ذروة السيولة</span>
      </div>
    </div>
  );
}

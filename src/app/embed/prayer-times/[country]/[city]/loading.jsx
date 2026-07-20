const PRAYER_LABELS = ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'];

export default function Loading() {
  return (
    <div className="embed-prayer-widget" aria-hidden="true">
      <div className="embed-prayer-widget__header">
        <span className="embed-prayer-widget__city">···</span>
      </div>
      <ul className="embed-prayer-widget__list">
        {PRAYER_LABELS.map((label) => (
          <li key={label} className="embed-prayer-widget__row">
            <span className="embed-prayer-widget__label">{label}</span>
            <span className="embed-prayer-widget__time">--:--</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

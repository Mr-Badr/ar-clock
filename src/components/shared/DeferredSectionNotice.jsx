export default function DeferredSectionNotice({
  title,
  description,
}) {
  return (
    <div className="deferred-section-notice">
      <div className="deferred-section-notice__badge">
        تم عرض الجزء الأساسي أولاً
      </div>
      <h2 className="deferred-section-notice__title">
        {title}
      </h2>
      <p className="deferred-section-notice__description">
        {description}
      </p>
    </div>
  );
}

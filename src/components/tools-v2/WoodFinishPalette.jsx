// Plain presentational color-swatch grid — a new visual pattern for this hub (distinct from the
// icon-grid/chart/SVG-diagram patterns used elsewhere). Server-renderable, no interactivity
// needed. Colors are illustrative representations of real, commonly-named wood finish tones (not
// exact paint-brand codes), used purely as a visual reference, not the site's own theme palette —
// a legitimate exception to the CSS-variable-only rule since these ARE the content being shown.
const FINISHES = [
  { name: 'عسلي دافئ', hex: '#C68642', note: 'الأشيع للأثاث الكلاسيكي، يبرز تجعيد ألياف الخشب الطبيعي' },
  { name: 'رمادي مغسول', hex: '#A6A29B', note: 'الاتجاه العصري الأبرز حالياً، يعطي مظهراً هادئاً ومحايداً' },
  { name: 'بني غامق كلاسيكي', hex: '#3E2723', note: 'فخامة تقليدية، يناسب الديكور الكلاسيكي والمكاتب' },
  { name: 'أبيض مغسول', hex: '#E7DFD3', note: 'مظهر ريفي فاتح (Scandinavian)، يوسّع الغرف الصغيرة بصرياً' },
  { name: 'أسود مطفي', hex: '#2B2A28', note: 'جريء وعصري جداً، يبرز أكثر في تفاصيل معدنية مجاورة' },
];

export default function WoodFinishPalette() {
  return (
    <div className="guide-v2-palette-grid">
      {FINISHES.map((f) => (
        <div className="guide-v2-palette-card" key={f.name}>
          <span className="guide-v2-palette-swatch" style={{ background: f.hex }} aria-hidden="true" />
          <p className="guide-v2-palette-name">{f.name}</p>
          <p className="guide-v2-palette-note">{f.note}</p>
        </div>
      ))}
    </div>
  );
}

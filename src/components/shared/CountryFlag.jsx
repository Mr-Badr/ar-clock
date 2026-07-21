/**
 * Renders an ISO 3166-1 alpha-2 country flag as an SVG background (via the
 * `flag-icons` package), not a Unicode flag emoji. Emoji flags depend on the
 * viewer's OS/browser shipping a font that can shape two regional-indicator
 * codepoints into one flag glyph — many Linux browser setups don't, and
 * silently fall back to rendering the two letters side by side, which reads
 * exactly like the raw country code. This component never depends on that.
 */
export default function CountryFlag({ code, className = '', square = false, label = '' }) {
  if (!code || code.length !== 2) return null;
  const cc = code.toLowerCase();
  const classes = ['fi', `fi-${cc}`, square ? 'fis' : '', className].filter(Boolean).join(' ');

  return label ? (
    <span className={classes} role="img" aria-label={label} />
  ) : (
    <span className={classes} aria-hidden="true" />
  );
}

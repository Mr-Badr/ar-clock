/**
 * watchAdFill — reliably detect an unfilled AdSense slot so it can be collapsed.
 *
 * WHY THIS EXISTS
 * ───────────────
 * AdSense sets `data-ad-status="unfilled"` on the <ins> element when there is no
 * ad to serve. A bare MutationObserver attached *after* `adsbygoogle.push({})`
 * misses the change when AdSense writes the attribute immediately (a very common
 * case on low-fill Arabic/MENA inventory). The slot then keeps its reserved
 * height and shows a blank white iframe indefinitely.
 *
 * This helper closes that gap with three layers:
 *   1. Synchronous check — the attribute may already be present.
 *   2. MutationObserver — catches the normal async write.
 *   3. Timeout fallbacks — catch writes the observer missed (race / reused node).
 *
 * Call AFTER `push({})`. Returns a cleanup function that tears everything down.
 */
export function watchAdFill(
  ins: HTMLElement | null,
  onUnfilled: () => void,
): () => void {
  if (!ins) return () => {};

  let settled = false;
  const timers: ReturnType<typeof setTimeout>[] = [];
  let observer: MutationObserver | null = null;

  const finish = () => {
    if (settled) return;
    settled = true;
    if (observer) observer.disconnect();
    timers.forEach(clearTimeout);
    onUnfilled();
  };

  const check = () => {
    if (settled) return;
    const status = ins.getAttribute("data-ad-status");
    if (status === "unfilled") finish();
  };

  // 1. Immediate check — attribute may already be set.
  check();
  if (settled) return () => {};

  // 2. Observe async writes.
  observer = new MutationObserver(check);
  observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });

  // 3. Fallback polls for writes the observer raced past.
  timers.push(setTimeout(check, 1500));
  timers.push(setTimeout(check, 4000));

  return () => {
    if (observer) observer.disconnect();
    timers.forEach(clearTimeout);
  };
}

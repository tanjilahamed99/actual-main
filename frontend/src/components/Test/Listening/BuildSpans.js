export function buildSpans(text, highlights) {
  if (!highlights || !highlights.length)
    return [{ text, highlighted: false, highlightId: null }];
  const pts = new Set([0, text.length]);
  highlights.forEach((h) => {
    pts.add(Math.max(0, h.start));
    pts.add(Math.min(text.length, h.end));
  });
  const arr = Array.from(pts).sort((a, b) => a - b);
  return arr.slice(0, -1).map((start, i) => {
    const end = arr[i + 1];
    const match = highlights.find((h) => h.start <= start && h.end >= end);
    return {
      text: text.slice(start, end),
      highlighted: !!match,
      highlightId: match?.id ?? null,
    };
  });
}

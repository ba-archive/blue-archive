/**
 * Ending-title font size from character count.
 * Keeps the default size up to softMaxChars, then shrinks toward minRem.
 * CJK / fullwidth glyphs count as wider than Latin.
 */
export function calcEndingTitleFontSizeRem(
  text: string,
  options: {
    baseRem?: number;
    minRem?: number;
    softMaxChars?: number;
    shrinkPerChar?: number;
  } = {}
): number {
  const baseRem = options.baseRem ?? 1.6;
  const minRem = options.minRem ?? 0.9;
  const softMaxChars = options.softMaxChars ?? 30;
  const shrinkPerChar = options.shrinkPerChar ?? 0.028;

  const visualLen = endingTitleVisualLength(text);
  if (visualLen <= softMaxChars) return baseRem;

  return Math.max(minRem, baseRem - (visualLen - softMaxChars) * shrinkPerChar);
}

/** Approximate on-screen width weight for ending titles. */
export function endingTitleVisualLength(text: string): number {
  let len = 0;
  for (const ch of text.trim()) {
    if (/\s/.test(ch)) {
      len += 0.35;
      continue;
    }
    // CJK ideographs / kana / fullwidth forms are wider than Latin.
    if (/[\u3000-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/.test(ch)) {
      len += 1.6;
      continue;
    }
    len += 1;
  }
  return len;
}

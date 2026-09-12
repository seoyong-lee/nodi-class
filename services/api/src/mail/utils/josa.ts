/**
 * Pick Korean object particle 을/를 based on the final grapheme of `word`.
 * Hangul: jongseong (받침) → 을, otherwise → 를.
 * Latin / digit endings use common Korean readings.
 */
export function eulReul(word: string): '을' | '를' {
  const trimmed = word.trim();
  if (!trimmed) return '를';

  const last = [...trimmed].at(-1)!;

  if (/[0-9]/.test(last)) {
    // 0,1,3,6,7,8 → 받침; 2,4,5,9 → 없음 (Korean digit readings)
    return '013678'.includes(last) ? '을' : '를';
  }

  if (/[A-Za-z]/.test(last)) {
    const ch = last.toLowerCase();
    // Approximate English letter readings that end with a consonant sound in KO
    return 'lmnr'.includes(ch) ? '을' : '를';
  }

  const code = last.codePointAt(0)!;
  // Hangul syllables AC00–D7A3
  if (code < 0xac00 || code > 0xd7a3) {
    return '를';
  }
  const jong = (code - 0xac00) % 28;
  return jong === 0 ? '를' : '을';
}

export function withEulReul(word: string): string {
  return `${word}${eulReul(word)}`;
}

/**
 * Deterministic red-flag check that runs on every user message, so the
 * emergency notice never depends on the model's reply.
 */
const PATTERNS: RegExp[] = [
  /chest (pain|tightness|pressure)/i,
  /(can'?t|cannot|trouble|difficulty|hard to) breath/i,
  /short(ness)? of breath/i,
  /\bstroke\b|face (is )?droop|slurred speech|one side .*(numb|weak)/i,
  /(severe|heavy|won'?t stop|uncontrolled) bleed/i,
  /unconscious|passed out|not breathing|unresponsive/i,
  /seizure|convuls/i,
  /overdos|poison/i,
  /suicid|kill myself|end my life|self[- ]harm|hurt myself/i,
  /throat (is )?(swelling|closing)|anaphyla/i,
];

export function isEmergency(text: string): boolean {
  return PATTERNS.some((p) => p.test(text));
}

export function isSelfHarm(text: string): boolean {
  return /suicid|kill myself|end my life|self[- ]harm|hurt myself/i.test(text);
}

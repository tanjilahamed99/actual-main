// src/lib/writingVocab.js

export const VOCAB_HINTS = {
  good: ["beneficial", "advantageous", "favourable", "constructive"],
  bad: ["detrimental", "adverse", "harmful", "unfavourable"],
  big: ["substantial", "considerable", "significant", "sizeable"],
  small: ["marginal", "negligible", "modest", "slight"],
  important: ["crucial", "vital", "essential", "paramount"],
  many: ["numerous", "a multitude of", "a plethora of"],
  people: ["individuals", "citizens", "the general public"],
  thing: ["aspect", "factor", "element", "phenomenon"],
  think: ["believe", "contend", "maintain", "assert"],
  show: ["demonstrate", "illustrate", "indicate", "reveal"],
  get: ["obtain", "acquire", "receive"],
  help: ["assist", "facilitate", "contribute to"],
  because: ["owing to the fact that", "as a result of", "since"],
  but: ["however", "nevertheless", "converse", "on the other hand"],
  also: ["moreover", "furthermore", "in addition"],
  very: ["extremely", "exceptionally", "remarkably"],
  a: ["one", "a single"],
  kids: ["children", "youngsters", "minors"],
  old: ["elderly", "senior", "aged"],
  job: ["occupation", "profession", "employment"],
  money: ["funds", "capital", "financial resources"],
  want: ["desire", "wish", "aspire to"],
  need: ["require", "necessitate"],
  use: ["utilise", "employ", "apply"],
  make: ["create", "produce", "generate"],
  problem: ["issue", "challenge", "obstacle", "difficulty"],
  idea: ["notion", "concept", "proposal"],
  reason: ["rationale", "justification", "motivation"],
  result: ["outcome", "consequence", "implication"],
  effect: ["impact", "influence", "consequence"],
  happy: ["content", "satisfied", "delighted", "pleased"],
  sad: ["unhappy", "miserable", "dejected"],
};

/**
 * Given text, return hits where a word could be upgraded.
 */
export function suggestVocab(text) {
  if (!text || !text.trim()) return [];
  const hits = [];

  for (const [word, alts] of Object.entries(VOCAB_HINTS)) {
    // Match whole words, case-insensitive
    const rx = new RegExp(`\\b${word}\\b`, "gi");
    let m;
    while ((m = rx.exec(text)) !== null) {
      hits.push({
        word: m[0],
        index: m.index,
        suggestions: alts.slice(0, 3),
      });
      if (hits.length > 40) return hits; // stop runaway
    }
  }
  return hits;
}
// src/lib/writingVocab.js

/**
 * Vocabulary upgrade dictionary for IELTS Writing feedback.
 *
 * Layout: each key is a word the student might write.
 * Each value is an array of stronger, more academic alternatives.
 *
 * Ordering matters — the first 3 are shown to the student.
 */

export const VOCAB_HINTS = {
  // ─────────────────────────────────────────────
  // GENERAL QUALITY / DEGREE
  // ─────────────────────────────────────────────
  good: ["beneficial", "advantageous", "favourable", "constructive", "commendable"],
  bad: ["detrimental", "adverse", "harmful", "unfavourable", "damaging"],
  great: ["significant", "substantial", "considerable", "remarkable"],
  nice: ["pleasant", "agreeable", "delightful", "wonderful"],
  amazing: ["remarkable", "extraordinary", "impressive", "striking"],
  awesome: ["impressive", "remarkable", "exceptional"],
  terrible: ["appalling", "dreadful", "dire", "atrocious"],
  awful: ["dreadful", "appalling", "dire"],
  okay: ["acceptable", "adequate", "satisfactory", "reasonable"],
  fine: ["acceptable", "adequate", "satisfactory"],
  perfect: ["flawless", "impeccable", "ideal"],
  huge: ["enormous", "immense", "vast", "colossal"],
  big: ["substantial", "considerable", "significant", "sizeable", "major"],
  large: ["substantial", "extensive", "considerable"],
  tiny: ["minute", "minuscule", "negligible"],
  small: ["marginal", "negligible", "modest", "slight", "minor"],
  little: ["minimal", "slight", "modest"],
  lots: ["numerous", "a great deal of", "a substantial amount of"],
  many: ["numerous", "a multitude of", "a plethora of", "a considerable number of"],
  much: ["considerable", "substantial", "a great deal of"],
  few: ["a small number of", "a handful of", "scarce"],
  some: ["several", "a number of", "certain"],
  very: ["extremely", "exceptionally", "remarkably", "particularly"],
  really: ["genuinely", "truly", "particularly"],
  totally: ["entirely", "completely", "wholly"],
  completely: ["entirely", "wholly", "utterly"],
  extremely: ["exceptionally", "extraordinarily", "profoundly"],
  quite: ["fairly", "relatively", "somewhat"],
  pretty: ["fairly", "relatively", "reasonably"],

  // ─────────────────────────────────────────────
  // QUANTITY & AMOUNT
  // ─────────────────────────────────────────────
  amount: ["quantity", "volume", "proportion", "extent"],
  number: ["quantity", "figure", "total"],
  increase: ["rise", "grow", "escalate", "surge", "soar"],
  decrease: ["decline", "reduce", "diminish", "drop", "fall"],
  grow: ["expand", "increase", "develop", "flourish"],
  rise: ["climb", "ascend", "increase", "surge"],
  fall: ["decline", "drop", "plummet", "plunge"],
  more: ["additional", "further", "greater", "an increased number of"],
  less: ["fewer", "reduced", "diminished"],
  enough: ["sufficient", "adequate", "ample"],
  plenty: ["abundance", "ample supply", "a wealth of"],
  none: ["no", "zero", "not any"],

  // ─────────────────────────────────────────────
  // IMPORTANCE & VALUE
  // ─────────────────────────────────────────────
  important: ["crucial", "vital", "essential", "paramount", "fundamental"],
  crucial: ["critical", "essential", "pivotal", "indispensable"],
  necessary: ["essential", "imperative", "requisite", "vital"],
  useful: ["beneficial", "advantageous", "valuable", "effective"],
  helpful: ["beneficial", "advantageous", "constructive"],
  valuable: ["precious", "invaluable", "significant"],
  useless: ["futile", "ineffective", "pointless", "unproductive"],
  harmful: ["detrimental", "damaging", "injurious", "deleterious"],
  dangerous: ["hazardous", "perilous", "risky", "precarious"],
  safe: ["secure", "protected", "risk-free"],
  effective: ["efficacious", "productive", "potent", "successful"],
  powerful: ["potent", "influential", "formidable"],
  weak: ["feeble", "fragile", "ineffective", "tenuous"],

  // ─────────────────────────────────────────────
  // PEOPLE
  // ─────────────────────────────────────────────
  people: ["individuals", "citizens", "the general public", "the population"],
  person: ["individual", "citizen", "human being"],
  kids: ["children", "youngsters", "minors", "youth"],
  child: ["youngster", "minor", "young person"],
  children: ["youngsters", "minors", "the younger generation"],
  old: ["elderly", "senior", "aged", "older"],
  elderly: ["senior citizens", "the elderly", "aged people"],
  young: ["youthful", "adolescent", "juvenile"],
  teenagers: ["adolescents", "youths", "young people"],
  students: ["learners", "pupils", "scholars"],
  teachers: ["educators", "instructors", "tutors"],
  parents: ["guardians", "caregivers", "mothers and fathers"],
  workers: ["employees", "the workforce", "labourers"],
  boss: ["employer", "manager", "supervisor"],
  leaders: ["policymakers", "authorities", "governors"],
  'people who': ["those who", "individuals who"],

  // ─────────────────────────────────────────────
  // MONEY & ECONOMY
  // ─────────────────────────────────────────────
  money: ["funds", "capital", "financial resources", "revenue"],
  rich: ["wealthy", "affluent", "prosperous", "well-off"],
  poor: ["impoverished", "underprivileged", "disadvantaged", "deprived"],
  cost: ["expense", "expenditure", "price", "outlay"],
  cheap: ["affordable", "inexpensive", "economical", "budget-friendly"],
  expensive: ["costly", "pricey", "exorbitant", "high-priced"],
  pay: ["compensate", "remunerate", "reimburse"],
  buy: ["purchase", "acquire", "procure"],
  sell: ["trade", "market", "vend"],
  job: ["occupation", "profession", "employment", "career"],
  work: ["employment", "labour", "occupation", "profession"],
  earn: ["generate income", "receive", "make a living"],
  profit: ["gain", "return", "financial benefit", "yield"],
  tax: ["levy", "duty", "tariff", "tribute"],

  // ─────────────────────────────────────────────
  // THINKING & SAYING
  // ─────────────────────────────────────────────
  think: ["believe", "contend", "maintain", "assert", "argue"],
  believe: ["maintain", "contend", "hold the view that", "assert"],
  feel: ["perceive", "sense", "consider"],
  say: ["state", "assert", "declare", "claim", "contend"],
  said: ["stated", "asserted", "declared", "maintained"],
  tell: ["inform", "notify", "advise"],
  talk: ["discuss", "converse", "communicate"],
  speak: ["communicate", "express", "articulate"],
  explain: ["clarify", "elaborate", "illustrate", "outline"],
  describe: ["depict", "portray", "outline", "characterise"],
  show: ["demonstrate", "illustrate", "indicate", "reveal", "exhibit"],
  prove: ["demonstrate", "establish", "verify", "substantiate"],
  suggest: ["propose", "recommend", "advocate", "put forward"],
  argue: ["contend", "assert", "maintain", "posit"],
  agree: ["concur", "consent", "be in favour of"],
  disagree: ["dissent", "oppose", "object to", "take issue with"],
  mention: ["refer to", "note", "cite", "allude to"],
  ask: ["inquire", "query", "request"],
  answer: ["respond", "reply", "address"],

  // ─────────────────────────────────────────────
  // CONNECTORS & TRANSITIONS
  // ─────────────────────────────────────────────
  but: ["however", "nevertheless", "conversely", "on the other hand"],
  and: ["moreover", "furthermore", "in addition", "as well as"],
  also: ["moreover", "furthermore", "in addition", "additionally"],
  because: ["owing to the fact that", "as a result of", "since", "given that"],
  so: ["therefore", "consequently", "as a result", "thus"],
  then: ["subsequently", "following this", "afterwards"],
  but: ["however", "nevertheless", "conversely", "on the contrary"],
  however: ["nevertheless", "nonetheless", "conversely"],
  finally: ["ultimately", "in conclusion", "lastly"],
  first: ["firstly", "to begin with", "initially"],
  second: ["secondly", "furthermore", "in addition"],
  last: ["finally", "lastly", "ultimately"],
  'for example': ["for instance", "to illustrate", "as an example", "namely"],
  like: ["such as", "for instance", "for example"],
  'in conclusion': ["to conclude", "in summary", "to sum up", "in short"],
  'in short': ["briefly", "in summary", "to put it briefly"],

  // ─────────────────────────────────────────────
  // CHANGE & DEVELOPMENT
  // ─────────────────────────────────────────────
  change: ["alter", "modify", "transform", "shift", "adjust"],
  changed: ["altered", "transformed", "modified", "shifted"],
  improve: ["enhance", "upgrade", "advance", "ameliorate", "refine"],
  improved: ["enhanced", "upgraded", "refined", "advanced"],
  develop: ["evolve", "progress", "advance", "mature"],
  develop: ["cultivate", "foster", "nurture", "advance"],
  become: ["transform into", "evolve into", "turn into"],
  start: ["commence", "initiate", "begin", "embark on"],
  started: ["commenced", "initiated", "began"],
  finish: ["complete", "conclude", "finalise"],
  stop: ["cease", "halt", "discontinue", "terminate"],
  end: ["conclude", "terminate", "cease"],
  continue: ["persist", "proceed", "carry on", "sustain"],
  keep: ["maintain", "retain", "preserve", "sustain"],

  // ─────────────────────────────────────────────
  // PROBLEMS & SOLUTIONS
  // ─────────────────────────────────────────────
  problem: ["issue", "challenge", "obstacle", "difficulty", "predicament"],
  problem: ["dilemma", "quandary", "predicament", "complication"],
  trouble: ["difficulty", "predicament", "adversity"],
  issue: ["concern", "matter", "problem", "challenge"],
  challenge: ["obstacle", "hurdle", "difficulty", "impediment"],
  solution: ["remedy", "resolution", "answer", "measure"],
  solve: ["resolve", "address", "tackle", "remedy", "rectify"],
  fix: ["repair", "resolve", "remedy", "rectify"],
  cause: ["bring about", "give rise to", "trigger", "precipitate"],
  caused: ["brought about", "triggered", "prompted", "induced"],
  prevent: ["avert", "forestall", "preclude", "avoid"],
  reduce: ["diminish", "curtail", "alleviate", "mitigate", "lessen"],
  avoid: ["evade", "circumvent", "avert", "sidestep"],

  // ─────────────────────────────────────────────
  // IDEAS & CONCEPTS
  // ─────────────────────────────────────────────
  idea: ["notion", "concept", "proposal", "conception"],
  thought: ["idea", "notion", "reflection", "consideration"],
  opinion: ["view", "viewpoint", "perspective", "stance"],
  belief: ["conviction", "view", "position", "principle"],
  fact: ["reality", "truth", "verity"],
  reason: ["rationale", "justification", "motivation", "basis"],
  result: ["outcome", "consequence", "implication", "ramification"],
  effect: ["impact", "influence", "consequence", "repercussion"],
  purpose: ["aim", "objective", "goal", "intention"],
  aim: ["objective", "goal", "target", "aspiration"],

  // ─────────────────────────────────────────────
  // SOCIETY & CULTURE
  // ─────────────────────────────────────────────
  society: ["community", "civilisation", "the public", "the populace"],
  culture: ["tradition", "heritage", "customs", "way of life"],
  tradition: ["custom", "heritage", "convention", "practice"],
  modern: ["contemporary", "current", "present-day", "cutting-edge"],
  old: ["traditional", "ancient", "historic", "long-standing"],
  new: ["novel", "innovative", "contemporary", "fresh"],
  technology: ["innovation", "digital tools", "tech", "modern advancement"],

  // ─────────────────────────────────────────────
  // FEELINGS & ATTITUDES
  // ─────────────────────────────────────────────
  happy: ["content", "satisfied", "delighted", "pleased", "elated"],
  sad: ["unhappy", "miserable", "dejected", "despondent"],
  angry: ["furious", "irate", "enraged", "indignant"],
  afraid: ["fearful", "apprehensive", "anxious", "alarmed"],
  worry: ["concern", "anxiety", "apprehension", "unease"],
  love: ["adore", "cherish", "value greatly"],
  like: ["enjoy", "appreciate", "be fond of", "relish"],
  hate: ["detest", "loathe", "abhor", "despise"],
  want: ["desire", "wish", "aspire to", "crave"],
  need: ["require", "necessitate", "demand"],

  // ─────────────────────────────────────────────
  // DOING & MAKING
  // ─────────────────────────────────────────────
  do: ["perform", "execute", "undertake", "carry out"],
  make: ["create", "produce", "generate", "manufacture", "craft"],
  made: ["created", "produced", "generated", "constructed"],
  use: ["utilise", "employ", "apply", "leverage"],
  used: ["utilised", "employed", "applied"],
  get: ["obtain", "acquire", "receive", "attain"],
  got: ["obtained", "acquired", "received", "secured"],
  give: ["provide", "offer", "supply", "furnish"],
  take: ["obtain", "seize", "acquire", "secure"],
  put: ["place", "position", "deposit", "set"],
  find: ["discover", "locate", "uncover", "identify"],
  keep: ["retain", "maintain", "preserve", "sustain"],
  let: ["allow", "permit", "enable"],
  allow: ["permit", "authorise", "enable", "sanction"],
  help: ["assist", "facilitate", "contribute to", "aid"],
  try: ["attempt", "endeavour", "strive", "seek"],
  try: ["undertake", "venture", "make an effort"],
  choose: ["select", "opt for", "elect", "pick"],
  pick: ["select", "choose", "opt for"],
  add: ["incorporate", "include", "append", "supplement"],
  remove: ["eliminate", "eradicate", "delete", "excise"],
  build: ["construct", "establish", "develop", "create"],
  destroy: ["demolish", "devastate", "obliterate", "ruin"],

  // ─────────────────────────────────────────────
  // COMMON VERBS IN ACADEMIC WRITING
  // ─────────────────────────────────────────────
  look: ["examine", "observe", "inspect", "scrutinise"],
  see: ["observe", "perceive", "notice", "witness"],
  hear: ["listen to", "perceive", "be informed of"],
  know: ["be aware of", "recognise", "understand", "comprehend"],
  learn: ["acquire knowledge of", "grasp", "master", "absorb"],
  teach: ["instruct", "educate", "train", "mentor"],
  study: ["research", "investigate", "examine", "analyse"],
  read: ["peruse", "review", "examine", "scan"],
  write: ["compose", "draft", "author", "pen"],
  speak: ["communicate", "express", "articulate", "voice"],
  live: ["reside", "dwell", "inhabit"],
  die: ["pass away", "perish", "succumb to"],
  happen: ["occur", "take place", "transpire", "come about"],
  cause: ["trigger", "precipitate", "give rise to", "prompt"],
  allow: ["permit", "enable", "authorise", "sanction"],
  need: ["require", "demand", "necessitate"],
  seem: ["appear", "give the impression of"],
  become: ["turn into", "evolve into", "grow into"],

  // ─────────────────────────────────────────────
  // "VERY + ADJECTIVE" — collapse into single stronger words
  // ─────────────────────────────────────────────
  "very big": ["enormous", "immense", "colossal", "vast"],
  "very small": ["tiny", "minuscule", "microscopic"],
  "very good": ["excellent", "outstanding", "exceptional"],
  "very bad": ["atrocious", "dreadful", "abysmal"],
  "very important": ["crucial", "vital", "essential", "paramount"],
  "very happy": ["delighted", "elated", "ecstatic"],
  "very sad": ["devastated", "heartbroken", "despondent"],
  "very angry": ["furious", "livid", "enraged"],
  "very tired": ["exhausted", "fatigued", "drained"],
  "very interesting": ["fascinating", "captivating", "intriguing"],
  "very difficult": ["arduous", "formidable", "challenging"],
  "very easy": ["effortless", "simple", "straightforward"],
  "very often": ["frequently", "regularly", "routinely"],
  "very quickly": ["rapidly", "swiftly", "promptly"],
  "very slowly": ["gradually", "sluggishly", "leisurely"],
  "very tired": ["weary", "exhausted", "drained"],
  "a lot of": ["a great deal of", "numerous", "a substantial amount of"],
  "a lot": ["considerably", "significantly", "substantially"],
  "kind of": ["somewhat", "rather", "to some extent"],
  "sort of": ["somewhat", "rather", "to some extent"],
  "lots of": ["numerous", "a great many", "a large number of"],

  // ─────────────────────────────────────────────
  // EDUCATION (IELTS favorite)
  // ─────────────────────────────────────────────
  school: ["educational institution", "academy", "learning centre"],
  teacher: ["educator", "instructor", "tutor", "mentor"],
  student: ["pupil", "learner", "scholar", "undergraduate"],
  learn: ["acquire knowledge", "study", "grasp", "absorb"],
  teach: ["instruct", "educate", "train", "mentor"],
  degree: ["qualification", "academic credential", "diploma"],
  class: ["lesson", "session", "seminar", "lecture"],

  // ─────────────────────────────────────────────
  // HEALTH (IELTS favorite)
  // ─────────────────────────────────────────────
  healthy: ["wholesome", "nutritious", "beneficial to health"],
  unhealthy: ["detrimental to health", "harmful", "deleterious"],
  sick: ["ill", "unwell", "ailing", "infirm"],
  ill: ["unwell", "ailing", "afflicted"],
  cure: ["treat", "remedy", "heal", "alleviate"],
  treat: ["administer care to", "attend to", "heal"],
  prevent: ["avert", "forestall", "preclude"],

  // ─────────────────────────────────────────────
  // ENVIRONMENT (IELTS favorite)
  // ─────────────────────────────────────────────
  pollution: ["contamination", "environmental degradation"],
  waste: ["dispose of", "squander", "misuse"],
  save: ["conserve", "preserve", "protect", "safeguard"],
  damage: ["harm", "impair", "degrade", "deteriorate"],
  protect: ["preserve", "conserve", "safeguard", "shield"],
  clean: ["pristine", "unpolluted", "uncontaminated"],
  dirty: ["contaminated", "polluted", "filthy"],

  // ─────────────────────────────────────────────
  // GOVERNMENT & POLICY (IELTS favorite)
  // ─────────────────────────────────────────────
  government: ["authorities", "administration", "policymakers", "the state"],
  law: ["legislation", "regulation", "statute", "act"],
  rule: ["regulation", "guideline", "directive", "policy"],
  help: ["assist", "aid", "support", "subsidise"],
  spend: ["allocate", "invest", "devote", "expend"],
  decide: ["determine", "resolve", "conclude", "settle on"],
  ban: ["prohibit", "forbid", "outlaw", "interdict"],

  // ─────────────────────────────────────────────
  // SIMPLE ADJECTIVES
  // ─────────────────────────────────────────────
  easy: ["effortless", "simple", "straightforward", "uncomplicated"],
  hard: ["arduous", "difficult", "challenging", "formidable"],
  difficult: ["arduous", "challenging", "demanding", "formidable"],
  simple: ["straightforward", "elementary", "uncomplicated"],
  complex: ["intricate", "complicated", "multifaceted", "elaborate"],
  clear: ["evident", "apparent", "obvious", "lucid"],
  obvious: ["evident", "apparent", "self-evident", "palpable"],
  true: ["accurate", "correct", "valid", "veracious"],
  false: ["inaccurate", "erroneous", "invalid", "unfounded"],
  right: ["correct", "accurate", "appropriate", "proper"],
  wrong: ["incorrect", "erroneous", "mistaken", "improper"],
  fast: ["rapid", "swift", "speedy", "prompt"],
  slow: ["gradual", "sluggish", "leisurely"],
  quiet: ["silent", "tranquil", "hushed", "subdued"],
  loud: ["deafening", "boisterous", "resounding"],
  beautiful: ["exquisite", "stunning", "magnificent", "breathtaking"],
  ugly: ["unsightly", "hideous", "grotesque"],
  clean: ["pristine", "immaculate", "spotless"],
  dirty: ["filthy", "grimy", "squalid"],

  // ─────────────────────────────────────────────
  // TALK ABOUT DATA & TRENDS (Task 1 in Writing)
  // ─────────────────────────────────────────────
  'went up': ["increased", "rose", "climbed", "surged"],
  'went down': ["decreased", "declined", "dropped", "plummeted"],
  stayed: ["remained stable", "stabilised", "plateaued", "levelled off"],
  changed: ["fluctuated", "varied", "shifted", "altered"],
  peak: ["reach a peak", "peak at", "climax"],
  low: ["reach a low", "bottom out", "hit a trough"],
  about: ["approximately", "roughly", "around", "circa"],
  almost: ["nearly", "virtually", "practically"],
  double: ["twice as many", "double the number of"],
  half: ["50%", "half the proportion of"],

  // ─────────────────────────────────────────────
  // COMMON MISTAKES (words students write that hurt band)
  // ─────────────────────────────────────────────
  gonna: ["going to"],
  wanna: ["want to"],
  gotta: ["have to"],
  kinda: ["kind of", "somewhat"],
  stuff: ["material", "items", "things", "content"],
  things: ["matters", "aspects", "elements", "phenomena"],
  guy: ["person", "individual", "man"],
  guys: ["people", "individuals"],
  ok: ["acceptable", "satisfactory", "adequate"],
  yeah: ["yes", "indeed", "certainly"],
  super: ["extremely", "highly", "very"],
  totally: ["entirely", "completely", "wholly"],
};

/**
 * Given text, return hits where a word or phrase could be upgraded.
 * Multi-word keys (e.g. "very big") are matched first.
 */
export function suggestVocab(text) {
  if (!text || !text.trim()) return [];
  const hits = [];

  // Sort keys by length so multi-word phrases win over their parts
  const keys = Object.keys(VOCAB_HINTS).sort(
    (a, b) => b.length - a.length,
  );

  const used = new Array(text.length).fill(false);

  for (const word of keys) {
    // Escape regex chars in the key (handles things like "a lot of")
    const esc = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(`\\b${esc}\\b`, "gi");

    let m;
    while ((m = rx.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;

      // Skip if this range overlaps a longer phrase we already matched
      let overlap = false;
      for (let i = start; i < end; i++) if (used[i]) overlap = true;
      if (overlap) continue;

      for (let i = start; i < end; i++) used[i] = true;

      hits.push({
        word: m[0],
        index: start,
        suggestions: VOCAB_HINTS[word].slice(0, 3),
      });

      if (hits.length > 60) {
        return hits.sort((a, b) => a.index - b.index);
      }
    }
  }

  return hits.sort((a, b) => a.index - b.index);
}
export const QUESTION_TYPES = [
  { value: "short", label: "Short-answer / sentence completion" },
  { value: "tfng", label: "True / False / Not Given" },
  { value: "mcq", label: "Multiple choice (single answer)" },
  { value: "multiChoiceMCQ", label: "Multiple choice (select multiple)" },
  { value: "headings", label: "Matching headings" },
  { value: "summary_complete", label: "Summary completion" },
  { value: "matrix_match", label: "Matching information" },
  { value: "para_match_drag", label: "Matching from word list (drag)" },
  { value: "matchAnswer", label: "Match answer" },
  {
    value: "summary_complete_drag",
    label: "Summary completion (drag word list)",
  },
  { value: "sentence_ending", label: "Sentence ending (select)" },
];

export const QUESTION_TEMPLATES = {
  short: {
    type: "short",
    heading: "Questions 0–0",
    title: "Answer the questions below.",
    sub: "Choose no more than THREE WORDS AND/OR A NUMBER from the passage for each answer.",
    bulletPoint: true,
    questionTitle: "",
    themeTitle: "",
    items: [{ n: 0, text: "", afterText: "" }],
  },
  tfng: {
    type: "tfng",
    heading: "Questions 0–0",
    title:
      "Do the following statements agree with the information in the text?",
    sub: "Choose TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    optionLabels: {
      TRUE: "if the statement agrees with the information",
      FALSE: "if the statement contradicts the information",
      "NOT GIVEN": "if there is no information on this",
    },
    items: [{ n: 0, text: "" }],
  },
  mcq: {
    type: "mcq",
    heading: "Questions 0–0",
    title: "Choose the correct letter, A, B, C or D.",
    items: [
      {
        n: 0,
        text: "",
        options: [
          { id: "A", text: "" },
          { id: "B", text: "" },
          { id: "C", text: "" },
          { id: "D", text: "" },
        ],
      },
    ],
  },
  multiChoiceMCQ: {
    type: "multiChoiceMCQ",
    heading: "Questions 0–0",
    title: "Write your answers in boxes 0-0 on your answer sheet.",
    sub: "Choose THREE letters A-F.",
    items: [{ n: [0, 0], q: "", opts: ["", "", ""] }],
  },
  headings: {
    type: "headings",
    heading: "Questions 0–0",
    title:
      "Choose the correct heading for each paragraph from the list of headings below. Write the correct number i-x in boxes 0-0 on your answer sheet.",
    sub: "Reading Passage has X paragraphs A-X.",
    items: [{ n: 0, label: "Paragraph A" }],
  },
  summary_complete: {
    type: "summary_complete",
    heading: "Questions 0–0",
    title:
      "Complete the following summary of the paragraphs of Reading Passage",
    sub: "Choose no more than THREE WORDS AND/OR A NUMBER from the passage for each answer.",
    items: [{ text: " " }, { n: 0 }, { text: " " }],
  },
  matrix_match: {
    type: "matrix_match",
    heading: "Questions 0–0",
    title: "Reading Passage has eight paragraphs, A–H.",
    sub: "Which paragraph contains the following information?",
    note: "NB You may use any letter more than once.",
    optionsList: {
      heading: "",
      optionHide: true,
      options: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }],
    },
    items: [{ n: 0, text: "" }],
  },
  para_match_drag: {
    type: "para_match_drag",
    heading: "Questions 0–0",
    title: "Complete the summary using the list of words, A-I, below.",
    sub: "Write the correct letter, A-I, in boxes 0-0 on your answer sheet.",
    optionsList: {
      heading: "",
      options: [
        { id: "A", text: "" },
        { id: "B", text: "" },
      ],
    },
    items: [{ n: 0, text: "" }],
  },
  matchAnswer: {
    type: "matchAnswer",
    heading: "Questions 0–0",
    sub: "",
    options: { A: "", B: "", C: "" },
    items: [{ num: 0, q: "" }],
  },
  summary_complete_drag: {
    type: "summary_complete_drag",
    heading: "Questions 0–0",
    title: "Complete the summary using the list of words, A-H, below.",
    wordList: {
      heading: "Word list",
      options: [
        { id: "A", text: "" },
        { id: "B", text: "" },
      ],
    },
    items: [{ text: " " }, { n: 0 }, { text: " " }],
  },
  sentence_ending: {
    type: "sentence_ending",
    heading: "Questions 0–0",
    title: "Complete each sentence with the correct ending, A-G, below.",
    sub: "Write the correct letter, A-G, in boxes 0-0 on your answer sheet.",
    endingsList: {
      heading: "List of endings",
      options: [
        { id: "A", text: "" },
        { id: "B", text: "" },
      ],
    },
    items: [{ n: 0, text: "" }],
  },
};

export function emptyPassage(n) {
  return {
    id: n,
    label: `Passage ${n}`,
    title: "",
    subtitle: "",
    text: "",
    headingsList: null,
    paragraphQuestions: null,
    questions: [],
  };
}

const demoQuestion = {
  // also name matching, need only to show the optionsList
  // and items, no need to show the question title and sub
  InformationMatching: {
    type: "matrix_match",
    heading: "Questions 0–0",
    title: "Reading Passage 2 has eight paragraphs, A–H.",
    sub: "Which paragraph contains the following information?",
    note: "NB You may use any letter more than once.",
    optionsList: {
      heading: "List of Mapmakers",
      optionHide: true,
      options: [
        { id: "A" },
        { id: "B" },
        { id: "C" },
        { id: "D" },
        { id: "E" },
        { id: "F" },
        { id: "G" },
        { id: "H" },
      ],
    },
    items: [
      {
        n: 0,
        text: "",
      },
    ],
  },
  true_false: {
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
    items: [
      {
        n: 0,
        text: "",
      },
    ],
  },
  short: {
    type: "short",
    heading: "Questions 0–0",
    title: "Answer the questions below.",
    sub: "Choose no more than THREE WORDS AND/OR A NUMBER from the passage for each answer.",
    bulletPoint: true,
    questionTitle: "",
    themeTitle: "",
    items: [
      {
        n: 0,
        text: "",
        afterText: "",
      },
    ],
  },
  MCQ: {
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
    title: "Write your answers in boxes 34-35 on your answer sheet.",
    sub: "Choose THREE letters A-F.",
    items: [
      {
        n: [0, 0],
        q: "",
        opts: ["", "", ""],
      },
    ],
  },
  SummaryCompletion: {
    type: "summary_complete",
    heading: "Questions 0–0",
    title:
      "Complete the following summary of the paragraphs of Reading Passage",
    sub: "Choose no more than THREE WORDS AND/OR A NUMBER from the passage for each answer.",
    items: [
      {
        text: " ",
      },
      { n: 36 },
      {
        text: " ",
      },
      { n: 37 },
      { text: "  " },
      { n: 38 },
      {
        text: " ",
      },
      { n: 39 },
      {
        text: " ",
      },
      { n: 40 },
      {
        text: "  ",
      },
    ],
  },
  para_match_drag: {
    type: "para_match_drag",
    heading: "Questions 0–0",
    title: "Complete the summary using the list of words, A-I, below.",
    sub: "Write the correct letter, A-I, in boxes 32-35 on your answer sheet.",
    optionsList: {
      heading: "The Text of A New Voyage Round the World",
      options: [
        { id: "A", text: "" },
        { id: "B", text: "" },
        { id: "C", text: "" },
        { id: "D", text: "" },
        { id: "E", text: "" },
        { id: "F", text: "" },
        { id: "G", text: "" },
        { id: "H", text: "" },
        { id: "I", text: "" },
      ],
    },

    items: [
      {
        n: 32,
        text: "",
      },
    ],
  },
  matchAnswer: {
    type: "matchAnswer",
    heading: "Questions 0–0",
    sub: "",
    options: {
      A: "",
      B: "",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: ".",
    },
    items: [{ num: 0, q: "" }],
  },
  headings: {
    type: "headings",
    heading: "Questions 0–0",
    title:
      "Choose the correct heading for each paragraph from the list of headings below. Write the correct number i-x in boxes 14-20 on your answer sheet.",
    sub: "Reading Passage 2 has seven paragraphs A-G.",

    items: [
      { n: 14, label: "Paragraph A" },
      { n: 15, label: "Paragraph B" },
      { n: 16, label: "Paragraph C" },
      { n: 17, label: "Paragraph D" },
      { n: 18, label: "Paragraph E" },
      { n: 19, label: "Paragraph F" },
      { n: 20, label: "Paragraph G" },
    ],
  },
};

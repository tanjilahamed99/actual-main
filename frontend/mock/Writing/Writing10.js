export const WRITING10_PART = [
  {
    label: "Part 1",
    subtitle: "Spend ~20 min. Write at least 150 words.",
    subtitleFull:
      "You should spend about 20 minutes on this task. Write at least 150 words.",
    minWords: 150,
    hasCharts: true,
    prompt: `You should spend about 20 minutes on this task. Write at least 150 words.\n\nThe diagram below illustrates how paper is produced from wood. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
  },
  {
    label: "Part 2",
    subtitle: "Spend ~40 min. Write at least 250 words.",
    subtitleFull:
      "You should spend about 40 minutes on this task. Write at least 250 words.",
    minWords: 250,
    hasCharts: false,
    prompt: `Some people think that governments should invest more money in public transport rather than building new roads.\n\nTo what extent do you agree or disagree with this statement?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.`,
  },
];

export const WRITING10_PROCESS = {
  title: "How paper is made from wood",
  rows: [
    [
      { n: 1, icon: "tree", label: "Grow trees", sub: "(Plantation)" },
      { n: 2, icon: "logs", label: "Fell trees", sub: "(Logging)" },
      { n: 3, icon: "chipper", label: "Chip into pieces" },
    ],
    [
      { n: 6, icon: "bleach", label: "Bleach pulp", sub: "(remove colour)" },
      { n: 5, icon: "press", label: "Press out water" },
      { n: 4, icon: "cook", label: "Cook chips", sub: "(to make pulp)" },
    ],
    [
      { n: 7, icon: "dry", label: "Dry into sheets" },
      { n: 8, icon: "roll", label: "Roll onto reels" },
      { n: 9, icon: "cut", label: "Cut into paper" },
    ],
  ],
};
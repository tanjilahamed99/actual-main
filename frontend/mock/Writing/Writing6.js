// Cambridge-style Task 1 — Fairtrade-labelled coffee and tea sales, 2000 & 2005

export const WRITING6_PART = [
  {
    label: "Part 1",
    subtitle: "Spend ~20 min. Write at least 150 words.",
    subtitleFull:
      "You should spend about 20 minutes on this task. Write at least 150 words.",
    minWords: 150,
    hasCharts: true,
    prompt: `The tables below give information about sales of Fairtrade-labelled coffee and tea in five European countries in 2000 and 2005.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
  },
  {
    label: "Part 2",
    subtitle: "Spend ~40 min. Write at least 250 words.",
    subtitleFull:
      "You should spend about 40 minutes on this task. Write at least 250 words.",
    minWords: 250,
    hasCharts: false,
    prompt: `Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future, such as those related to science and technology.\n\nDiscuss both these views and give your own opinion.`,
  },
];

export const WRITING6_TABLE_COFFEE = {
  title: "Sales of Fairtrade-labelled coffee (2000 & 2005)",
  columns: ["Coffee", "2000 (millions of euros)", "2005 (millions of euros)"],
  rows: [
    ["UK", 2.2, 26],
    ["Switzerland", 4, 8.5],
    ["Belgium", 1.3, 2.4],
    ["Denmark", 2.5, 3.1],
    ["Sweden", 1.1, 1.6],
  ],
};

export const WRITING6_TABLE_TEA = {
  title: "Sales of Fairtrade-labelled tea (2000 & 2005)",
  columns: ["Tea", "2000 (millions of euros)", "2005 (millions of euros)"],
  rows: [
    ["UK", 19, 52],
    ["Denmark", 2.6, 1.2],
    ["Switzerland", 1.4, 6.8],
    ["Sweden", 2.1, 1.4],
    ["Belgium", 0.8, 5.3],
  ],
};
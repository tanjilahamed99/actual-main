export const WRITING9_PART = [
  {
    label: "Part 1",
    subtitle: "Spend ~20 min. Write at least 150 words.",
    subtitleFull:
      "You should spend about 20 minutes on this task. Write at least 150 words.",
    minWords: 150,
    hasCharts: true,
    prompt: `The chart below illustrates the value of a country's exports across several categories during 2018 and 2019. The accompanying table shows the percentage change in each export category in 2019 compared with 2018.\n\nSummarise the information by selecting and reporting the main features and make comparisons where relevant.`,
  },
  {
    label: "Part 2",
    subtitle: "Spend ~40 min. Write at least 250 words.",
    subtitleFull:
      "You should spend about 40 minutes on this task. Write at least 250 words.",
    minWords: 250,
    hasCharts: false,
    prompt: `Some people say that the main environmental problem of our time is the loss of particular species of plants and animals. Others say that there are more important environmental problems.\n\nDiscuss both these views and give your own opinion.`,
  },
];

export const WRITING9_BAR = {
  title: "Export Earnings (2018–2019)",
  xLabels: [
    "Machinery",
    "Textiles",
    "Timber and pulp",
    "Seafood products",
    "Chemicals",
  ],
  yMax: 70,
  yStep: 10,
  yUnit: "$ billions",
  xUnit: "Product Category",
  series: [
    { label: "2018", pattern: "dark", values: [58, 44, 33, 22, 18] },
    { label: "2019", pattern: "solid", values: [61, 39, 34, 24, 21] },
  ],
};

export const WRITING9_CHANGE = {
  title: "Percentage change in values (2018–2019)",
  rows: [
    { label: "Machinery", direction: "up", value: 5.2 },
    { label: "Textiles", direction: "down", value: 11.4 },
    { label: "Timber and pulp", direction: "up", value: 3.03 },
    { label: "Seafood products", direction: "up", value: 9.1 },
    { label: "Chemicals", direction: "up", value: 16.7 },
  ],
};

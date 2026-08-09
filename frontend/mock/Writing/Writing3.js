// Task 1 prompt matches the reference image (jobs by sector, US, 1960–2020)
export const WRITING3_PART = [
  {
    label: "Part 1",
    subtitle: "Spend ~20 min. Write at least 150 words.",
    subtitleFull:
      "You should spend about 20 minutes on this task. Write at least 150 words.",
    minWords: 150,
    hasCharts: true,
    prompt: `The graph below gives information about the number of jobs in four sectors of the economy in the US between 1960 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
  },
  {
    label: "Part 2",
    subtitle: "Spend ~40 min. Write at least 250 words.",
    subtitleFull:
      "You should spend about 40 minutes on this task. Write at least 250 words.",
    minWords: 250,
    hasCharts: false,
    prompt: `The best way to provide enough homes in large cities is to build tall apartment blocks.\n\nTo what extent do you agree or disagree with this statement? \n\n Give reasons for your answer and include any relevant examples from your own knowledge or experience.

`,
  },
];

export const WRITING3_LINE = {
  title: "Number of jobs in four sectors of the economy in the US, 1960-2020",
  xLabels: ["1960", "1980", "2000", "2020"],
  yMax: 25,
  yStep: 5,
  yUnit: "Jobs in millions",
  xUnit: "Year",
  series: [
    {
      label: "Manufacturing",
      style: "solid",
      marker: "circle",
      filled: false,
      values: [15, 20, 17, 13],
    },
    {
      label: "Retail",
      style: "dashed",
      marker: "triangle",
      filled: false,
      values: [6, 10, 15, 15.5],
    },
    {
      label: "Agriculture",
      style: "dashdot",
      marker: "square",
      filled: true,
      values: [2, 5, 3, 1.5],
    },
    {
      label: "Healthcare",
      style: "dotted",
      marker: "diamond",
      filled: false,
      values: [5.5, 6, 11, 15],
    },
  ],
};

export const WRITING7_PART = [
  {
    label: "Part 1",
    subtitle: "Spend ~20 min. Write at least 150 words.",
    subtitleFull:
      "You should spend about 20 minutes on this task. Write at least 150 words.",
    minWords: 150,
    hasCharts: true,
    prompt: `The bar chart below shows the percentage of Australian men and women in different age groups who did regular physical activity in 2010.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
  },
  {
    label: "Part 2",
    subtitle: "Spend ~40 min. Write at least 250 words.",
    subtitleFull:
      "You should spend about 40 minutes on this task. Write at least 250 words.",
    minWords: 250,
    hasCharts: false,
    prompt: `Some people believe that it is good to share as much information as possible in scientific research, business and the academic world. Others believe that some information is too important or too valuable to be shared freely.\n\nDiscuss both these view and give your own opinion.`,
  },
];

export const WRITING7_BAR = {
  title: "Percentage of Australian men and women doing regular physical activity: 2010",
  xLabels: ["15 to 24", "25 to 34", "35 to 44", "45 to 54", "55 to 64", "65 and over"],
  yMax: 60,
  yStep: 10,
  yUnit: "Percentage (%)",
  xUnit: "Age group",
  series: [
    {
      label: "Male",
      pattern: "hatched",
      values: [52.8, 42.2, 39.5, 43.1, 45.1, 46.7],
    },
    {
      label: "Female",
      pattern: "dark",
      values: [47.7, 48.9, 52.5, 53.3, 53.0, 47.1],
    },
  ],
};
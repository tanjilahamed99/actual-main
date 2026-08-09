// Cambridge-style Task 1 — Social centre activity participation, Melbourne 2000–2020

export const WRITING4_PART = [
  {
    label: "Part 1",
    subtitle: "Spend ~20 min. Write at least 150 words.",
    subtitleFull:
      "You should spend about 20 minutes on this task. Write at least 150 words.",
    minWords: 150,
    hasCharts: true,
    prompt: `The graph below gives information on the numbers of participants for different activities at one social centre in Melbourne, Australia for the period 2000 to 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
  },
  {
    label: "Part 2",
    subtitle: "Spend ~40 min. Write at least 250 words.",
    subtitleFull:
      "You should spend about 40 minutes on this task. Write at least 250 words.",
    minWords: 250,
    hasCharts: false,
    prompt: `Some people think that competition at work, at school and in daily life is a good thing. Others believe that we should try to cooperate more, rather than competing against each other.\n\nDiscuss both these views and give your own opinion.`,
  },
];

export const WRITING4_LINE = {
  title: "Number of participants, by activity 2000–2020",
  xLabels: ["2000", "2005", "2010", "2015", "2020"],
  yMax: 70,
  yStep: 10,
  yUnit: "Number of participants",
  xUnit: "Year",
  series: [
    {
      label: "Film club",
      style: "solid",
      marker: "circle",
      filled: false,
      values: [64, 62, 60, 64, 66],
    },
    {
      label: "Martial arts",
      style: "dashed",
      marker: "triangle",
      filled: false,
      values: [36, 32, 38, 35, 35],
    },
    {
      label: "Amateur dramatics",
      style: "dotted",
      marker: "diamond",
      filled: true,
      values: [26, 28, 20, 15, 7],
    },
    {
      label: "Table tennis",
      style: "dashdot",
      marker: "square",
      filled: false,
      values: [16, 20, 20, 36, 53],
    },
    {
      label: "Musical performances",
      style: "solid",
      marker: "cross",
      filled: false,
      values: [0, 0, 12, 15, 18],
    },
  ],
};

// Cambridge-style Task 1 — Australian household energy use & greenhouse gas emissions

export const WRITING5_PART = [
  {
    label: "Part 1",
    subtitle: "Spend ~20 min. Write at least 150 words.",
    subtitleFull:
      "You should spend about 20 minutes on this task. Write at least 150 words.",
    minWords: 150,
    hasCharts: true,
    prompt: `The first chart below shows how energy is used in an average Australian household. The second chart shows the greenhouse gas emissions which result from this energy use.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
  },
  {
    label: "Part 2",
    subtitle: "Spend ~40 min. Write at least 250 words.",
    subtitleFull:
      "You should spend about 40 minutes on this task. Write at least 250 words.",
    minWords: 250,
    hasCharts: false,
    prompt: `It is important for children to learn the difference between right and wrong at an early age. Punishment is necessary to help them learn this distinction.\n\nTo what extent do you agree or disagree with this opinion?\n\nWhat sort of punishment should parents and teachers be allowed to use to teach good behavior to children?`,
  },
];

export const WRITING5_PIE_ENERGY = {
  title: "Australian household energy use",
  segments: [
    { label: "Water heating", value: 30, color: "#e8e8e8", pattern: "hatched" },
    { label: "Heating", value: 42, color: "#f2f2f2", pattern: "solid" },
    { label: "Cooling", value: 2, color: "#181818", pattern: "solid" },
    { label: "Lighting", value: 4, color: "#303030", pattern: "cross" },
    { label: "Other appliances", value: 15, color: "#a0a0a0", pattern: "dotted" },
    { label: "Refrigeration", value: 7, color: "#5f7a72", pattern: "solid" },
  ],
};

export const WRITING5_PIE_EMISSIONS = {
  title: "Australian household greenhouse gas emissions",
  segments: [
    { label: "Water heating", value: 32, color: "#e8e8e8", pattern: "hatched" },
    { label: "Heating", value: 15, color: "#f2f2f2", pattern: "solid" },
    { label: "Cooling", value: 3, color: "#181818", pattern: "solid" },
    { label: "Lighting", value: 8, color: "#303030", pattern: "cross" },
    { label: "Other appliances", value: 28, color: "#a0a0a0", pattern: "dotted" },
    { label: "Refrigeration", value: 14, color: "#5f7a72", pattern: "solid" },
  ],
};
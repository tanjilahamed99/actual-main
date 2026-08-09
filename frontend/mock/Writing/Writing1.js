export const WRITING1_PART = [
  {
    label: "Part 1",
    subtitle: "Spend ~20 min. Write at least 150 words.",
    subtitleFull:
      "You should spend about 20 minutes on this task. Write at least 150 words.",
    minWords: 150,
    hasCharts: true,
    prompt: `The two pie charts below show the main sources of energy and greenhouse gas emissions from Australian households.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
  },
  {
    label: "Part 2",
    subtitle: "Spend ~40 min. Write at least 250 words.",
    subtitleFull:
      "You should spend about 40 minutes on this task. Write at least 250 words.",
    minWords: 250,
    hasCharts: false,
    prompt: `It is important for children to learn the difference between right and wrong at an early age. Punishment is necessary to help them learn this distinction.\n\nTo what extent do you agree or disagree with this opinion?\n\nWhat sort of punishment should parents and teachers be allowed to use to teach good behaviour to children?`,
  },
];

export const WRITING1_PIE_ENERGY = {
  title: "Australian household energy use",
  segments: [
    { label: "Heating", value: 42, color: "#c0c0c0", pattern: "solid" },
    { label: "Water heating", value: 30, color: "#e8e8e8", pattern: "hatched" },
    { label: "Other appliances", value: 15, color: "#a0a0a0", pattern: "dotted" },
    { label: "Refrigeration", value: 7, color: "#606060", pattern: "cross" },
    { label: "Lighting", value: 4, color: "#303030", pattern: "solid" },
    { label: "Cooling", value: 2, color: "#181818", pattern: "solid" },
  ],
};

export const WRITING1_PIE_EMISSIONS = {
  title: "Australian household greenhouse gas emissions",
  segments: [
    { label: "Water heating", value: 32, color: "#e8e8e8", pattern: "hatched" },
    { label: "Other appliances", value: 28, color: "#a0a0a0", pattern: "dotted" },
    { label: "Heating", value: 15, color: "#c0c0c0", pattern: "solid" },
    { label: "Refrigeration", value: 14, color: "#606060", pattern: "cross" },
    { label: "Lighting", value: 8, color: "#303030", pattern: "solid" },
    { label: "Cooling", value: 3, color: "#181818", pattern: "solid" },
  ],
};
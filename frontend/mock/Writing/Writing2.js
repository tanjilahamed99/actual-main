// Cambridge IELTS 12 Academic Writing Test 1

export const WRITING2_PART = [
  {
    label: "Part 1",
    subtitle: "Spend ~20 min. Write at least 150 words.",
    subtitleFull:
      "You should spend about 20 minutes on this task. Write at least 150 words.",
    minWords: 150,
    hasCharts: true,
    prompt: `The chart and table below show the results of a survey of library users at a university.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
  },
  {
    label: "Part 2",
    subtitle: "Spend ~40 min. Write at least 250 words.",
    subtitleFull:
      "You should spend about 40 minutes on this task. Write at least 250 words.",
    minWords: 250,
    hasCharts: false,
    prompt: `Some people argue that primary schools focus too much on formal learning.\n\nTo what extent do you agree with this opinion?\n\nHow important do you think it is for children to play as well as learn in the primary school classroom?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.`,
  },
];

export const WRITING2_CHARTS = [
  {
    title: "Percentage of food budget spent on restaurant meals – 1979",
    segments: [
      {
        label: "Fresh vegetables",
        value: 27,
        color: "#c0c0c0",
        pattern: "solid",
      },
      { label: "Meat & fish", value: 26, color: "#e8e8e8", pattern: "hatched" },
      {
        label: "Dairy products",
        value: 15,
        color: "#a0a0a0",
        pattern: "dotted",
      },
      {
        label: "Frozen/tinned food",
        value: 10,
        color: "#606060",
        pattern: "cross",
      },
      {
        label: "Restaurant meals",
        value: 11,
        color: "#303030",
        pattern: "solid",
      },
      { label: "Other", value: 11, color: "#181818", pattern: "solid" },
    ],
  },
  {
    title: "Percentage of food budget spent on restaurant meals – 2009",
    segments: [
      {
        label: "Fresh vegetables",
        value: 22,
        color: "#c0c0c0",
        pattern: "solid",
      },
      { label: "Meat & fish", value: 21, color: "#e8e8e8", pattern: "hatched" },
      {
        label: "Dairy products",
        value: 13,
        color: "#a0a0a0",
        pattern: "dotted",
      },
      {
        label: "Frozen/tinned food",
        value: 9,
        color: "#606060",
        pattern: "cross",
      },
      {
        label: "Restaurant meals",
        value: 23,
        color: "#303030",
        pattern: "solid",
      },
      { label: "Other", value: 12, color: "#181818", pattern: "solid" },
    ],
  },
];

// Pie chart segments — reuses your existing PieChart component as-is
export const LIBRARY_PIE = {
  title: "Categories of library users",
  segments: [
    {
      label: "Full-time undergraduate",
      value: 44,
      color: "#f2f2f2",
      pattern: "hatched",
    },
    {
      label: "Full-time postgraduate",
      value: 25,
      color: "#9c9c9c",
      pattern: "solid",
    },
    {
      label: "Part-time postgraduate",
      value: 16,
      color: "#e0e0e0",
      pattern: "cross",
    },
    {
      label: "Distance learning (all courses)",
      value: 8,
      color: "#1c1c1c",
      pattern: "solid",
    },
    { label: "Academic staff", value: 7, color: "#ffffff", pattern: "dotted" },
  ],
};

// Table — new shape, rendered by TableChart below
export const LIBRARY_TABLE = {
  title: "Library user satisfaction (%)",
  columns: ["", "Very satisfied", "Fairly satisfied", "Not satisfied"],
  rows: [
    ["Library opening hours", 65, 35, 0],
    ["Helpfulness of staff", 95, 5, 0],
    ["Availability of books", 50, 40, 10],
    ["Availability of journals", 45, 35, 20],
    ["Reliability of wi-fi", 48, 33, 19],
  ],
};

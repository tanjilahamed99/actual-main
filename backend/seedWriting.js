const mongoose = require("mongoose");
const dotenv = require("dotenv");
const WritingTest = require("./src/models/WritingTest");

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// ── Reusable Part 2 prompts (Task 2 themes) ──
const P2 = {
  punishment:
    "It is important for children to learn the difference between right and wrong at an early age. Punishment is necessary to help them learn this distinction.\n\nTo what extent do you agree or disagree with this opinion?\n\nWhat sort of punishment should parents and teachers be allowed to use to teach good behaviour to children?",
  community:
    "Some people believe that unpaid community service should be a compulsory part of high school programmes.\n\nTo what extent do you agree or disagree?",
  university:
    "Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future, such as those related to science and technology.\n\nDiscuss both these views and give your own opinion.",
  language:
    "Some experts believe that it is better for children to begin learning a foreign language at primary school rather than secondary school.\n\nDo the advantages of this outweigh the disadvantages?",
  houseHistory:
    "In some countries, more and more people are becoming interested in finding out about the history of the house or building they live in.\n\nWhat are the reasons for this? How can people research this?",
  choices:
    "Some people believe that nowadays we have too many choices.\n\nTo what extent do you agree or disagree with this statement?",
  sportsFacilities:
    "Some people say that the best way to improve public health is by increasing the number of sports facilities. Others, however, say that this would have little effect on public health and that other measures are required.\n\nDiscuss both these views and give your own opinion.",
  socialMedia:
    "Many people believe that social networking sites (such as Facebook) have had a huge negative impact on both individuals and society.\n\nTo what extent do you agree?",
  studyTill18:
    "Some people believe that it is a good idea to continue studying until you are at least 18 years old. Others believe that it is better to start work at an earlier age.\n\nDiscuss both these views and give your own opinion.",
  artsVsSports:
    "Some people think that governments should spend more money on sports and cultural activities rather than on promoting the arts.\n\nDiscuss both these views and give your own opinion.",
  environment:
    "Climate change is one of the biggest challenges facing the world today. Some people argue that individuals can do little to help, and only governments and large companies can make a real difference.\n\nTo what extent do you agree or disagree?",
  technology:
    "Some people believe that technological developments such as artificial intelligence will bring more harm than good to society.\n\nTo what extent do you agree or disagree?",
  remoteWork:
    "Working from home has become increasingly common in recent years. Some people think this is a positive development, while others believe it has more disadvantages.\n\nDiscuss both these views and give your own opinion.",
  healthcare:
    "Some people believe that healthcare should be free for everyone, while others argue that individuals should pay for their own medical treatment.\n\nDiscuss both these views and give your own opinion.",
  educationCost:
    "In many countries, the cost of university education is rising. Some people think the government should pay for all university tuition, while others believe students should pay.\n\nDiscuss both views and give your opinion.",
  advertising:
    "Some people think that advertising encourages us to buy things we do not really need, while others believe it is a useful source of information.\n\nDiscuss both these views and give your own opinion.",
  cityLife:
    "More and more people are moving from rural areas to cities. What are the causes of this trend, and what problems does it create?",
  tourism:
    "Tourism is now a major industry in many countries. Some people believe it brings benefits, while others feel it causes harm to local cultures and environments.\n\nDiscuss both these views and give your own opinion.",
  crime:
    "Some people believe that the best way to reduce crime is to give longer prison sentences. Others, however, think there are better alternative ways of reducing crime.\n\nDiscuss both these views and give your own opinion.",
  news:
    "Some people think that the news media has become too influential in modern society and that this is a negative development.\n\nTo what extent do you agree or disagree?",
  family:
    "In many countries today, family relationships are changing. Some people believe this is a positive trend, while others think it has negative consequences.\n\nDiscuss both these views and give your own opinion.",
};

// ── Reusable Part 1 templates per chart kind ──
const P1_PIE = {
  subtitle: "Spend ~20 min. Write at least 150 words.",
  subtitleFull:
    "You should spend about 20 minutes on this task. Write at least 150 words.",
  minWords: 150,
  hasCharts: true,
};

const P1_BAR = { ...P1_PIE };
const P1_LINE = { ...P1_PIE };
const P1_TABLE = { ...P1_PIE };
const P1_PROCESS = { ...P1_PIE };
const P1_MAP = { ...P1_PIE };
const P1_CHANGE = { ...P1_PIE };

const P2_TEMPLATE = {
  label: "Part 2",
  subtitle: "Spend ~40 min. Write at least 250 words.",
  subtitleFull:
    "You should spend about 40 minutes on this task. Write at least 250 words.",
  minWords: 250,
  hasCharts: false,
  charts: [],
};

// helper to build a part-2 part object
const p2 = (prompt) => ({ ...P2_TEMPLATE, prompt });

// helper to build a part-1 part object
const p1 = (label, prompt, charts, extra = {}) => ({
  label,
  ...P1_PIE,
  ...extra,
  prompt,
  charts,
});

// =====================================================================
// CHART LIBRARY — one entry per "kind", cycled across test numbers
// =====================================================================

// ── PIE variants (7) ──
const PIE_CHARTS = [
  {
    prompt:
      "The two pie charts below show the main sources of energy and greenhouse gas emissions from Australian households.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    charts: [
      {
        kind: "pie",
        title: "Australian household energy use",
        segments: [
          { label: "Heating", value: 42, color: "#c0c0c0", pattern: "solid" },
          { label: "Water heating", value: 30, color: "#e8e8e8", pattern: "hatched" },
          { label: "Other appliances", value: 15, color: "#a0a0a0", pattern: "dotted" },
          { label: "Refrigeration", value: 7, color: "#606060", pattern: "cross" },
          { label: "Lighting", value: 4, color: "#303030", pattern: "solid" },
          { label: "Cooling", value: 2, color: "#181818", pattern: "solid" },
        ],
      },
      {
        kind: "pie",
        title: "Australian household greenhouse gas emissions",
        segments: [
          { label: "Water heating", value: 32, color: "#e8e8e8", pattern: "hatched" },
          { label: "Other appliances", value: 28, color: "#a0a0a0", pattern: "dotted" },
          { label: "Heating", value: 15, color: "#c0c0c0", pattern: "solid" },
          { label: "Refrigeration", value: 14, color: "#606060", pattern: "cross" },
          { label: "Lighting", value: 8, color: "#303030", pattern: "solid" },
          { label: "Cooling", value: 3, color: "#181818", pattern: "solid" },
        ],
      },
    ],
  },
  {
    prompt:
      "The pie chart below shows the main reasons why agricultural land becomes less productive.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "pie",
        title: "Causes of worldwide land degradation",
        segments: [
          { label: "Over-grazing", value: 35, color: "#c0c0c0", pattern: "solid" },
          { label: "Deforestation", value: 30, color: "#a0a0a0", pattern: "hatched" },
          { label: "Over-cultivation", value: 28, color: "#888888", pattern: "dotted" },
          { label: "Other", value: 7, color: "#606060", pattern: "cross" },
        ],
      },
    ],
  },
  {
    prompt:
      "The pie charts below show the average household expenditures in a country in 1950 and 2010.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "pie",
        title: "Household expenditure in 1950",
        segments: [
          { label: "Housing", value: 72, color: "#c0c0c0", pattern: "solid" },
          { label: "Food", value: 12, color: "#a0a0a0", pattern: "hatched" },
          { label: "Health care", value: 5, color: "#888888", pattern: "dotted" },
          { label: "Education", value: 6, color: "#606060", pattern: "cross" },
          { label: "Transport", value: 5, color: "#303030", pattern: "solid" },
        ],
      },
      {
        kind: "pie",
        title: "Household expenditure in 2010",
        segments: [
          { label: "Housing", value: 22, color: "#c0c0c0", pattern: "solid" },
          { label: "Food", value: 34, color: "#a0a0a0", pattern: "hatched" },
          { label: "Health care", value: 8, color: "#888888", pattern: "dotted" },
          { label: "Education", value: 17, color: "#606060", pattern: "cross" },
          { label: "Transport", value: 19, color: "#303030", pattern: "solid" },
        ],
      },
    ],
  },
  {
    prompt:
      "The pie chart below shows the proportion of different categories of waste produced in a city.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "pie",
        title: "Categories of waste produced in a city",
        segments: [
          { label: "Paper", value: 28, color: "#c0c0c0", pattern: "solid" },
          { label: "Food", value: 26, color: "#a0a0a0", pattern: "hatched" },
          { label: "Plastic", value: 18, color: "#888888", pattern: "dotted" },
          { label: "Glass", value: 12, color: "#606060", pattern: "cross" },
          { label: "Metal", value: 9, color: "#303030", pattern: "solid" },
          { label: "Other", value: 7, color: "#181818", pattern: "solid" },
        ],
      },
    ],
  },
  {
    prompt:
      "The two pie charts show the proportion of men and women in different occupational sectors in a country.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "pie",
        title: "Men by sector",
        segments: [
          { label: "Manufacturing", value: 34, color: "#c0c0c0", pattern: "solid" },
          { label: "Construction", value: 22, color: "#a0a0a0", pattern: "hatched" },
          { label: "Services", value: 26, color: "#888888", pattern: "dotted" },
          { label: "Education", value: 8, color: "#606060", pattern: "cross" },
          { label: "Health", value: 10, color: "#303030", pattern: "solid" },
        ],
      },
      {
        kind: "pie",
        title: "Women by sector",
        segments: [
          { label: "Manufacturing", value: 14, color: "#c0c0c0", pattern: "solid" },
          { label: "Construction", value: 5, color: "#a0a0a0", pattern: "hatched" },
          { label: "Services", value: 34, color: "#888888", pattern: "dotted" },
          { label: "Education", value: 22, color: "#606060", pattern: "cross" },
          { label: "Health", value: 25, color: "#303030", pattern: "solid" },
        ],
      },
    ],
  },
  {
    prompt:
      "The pie chart below shows the proportion of energy generated from different sources in a country in 2020.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "pie",
        title: "Energy generation by source, 2020",
        segments: [
          { label: "Coal", value: 38, color: "#c0c0c0", pattern: "solid" },
          { label: "Natural gas", value: 24, color: "#a0a0a0", pattern: "hatched" },
          { label: "Nuclear", value: 18, color: "#888888", pattern: "dotted" },
          { label: "Hydro", value: 11, color: "#606060", pattern: "cross" },
          { label: "Wind", value: 6, color: "#303030", pattern: "solid" },
          { label: "Solar", value: 3, color: "#181818", pattern: "solid" },
        ],
      },
    ],
  },
  {
    prompt:
      "The pie charts below show the types of books sold by a bookstore in two different years.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "pie",
        title: "Book sales by category, 2005",
        segments: [
          { label: "Fiction", value: 44, color: "#c0c0c0", pattern: "solid" },
          { label: "Non-fiction", value: 26, color: "#a0a0a0", pattern: "hatched" },
          { label: "Children's", value: 18, color: "#888888", pattern: "dotted" },
          { label: "Reference", value: 12, color: "#606060", pattern: "cross" },
        ],
      },
      {
        kind: "pie",
        title: "Book sales by category, 2015",
        segments: [
          { label: "Fiction", value: 30, color: "#c0c0c0", pattern: "solid" },
          { label: "Non-fiction", value: 22, color: "#a0a0a0", pattern: "hatched" },
          { label: "Children's", value: 34, color: "#888888", pattern: "dotted" },
          { label: "Reference", value: 14, color: "#606060", pattern: "cross" },
        ],
      },
    ],
  },
];

// ── BAR variants (7) ──
const BAR_CHARTS = [
  {
    prompt:
      "The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    charts: [
      {
        kind: "bar",
        title: "Percentage of households in owned and rented accommodation, 1918–2011",
        xLabels: ["1918", "1939", "1953", "1961", "1971", "1981", "1991", "2001", "2011"],
        yMax: 100,
        yStep: 20,
        yUnit: "Percentage of households (%)",
        xUnit: "Year",
        series: [
          { label: "Owned", pattern: "dark", values: [23, 32, 40, 43, 50, 58, 67, 69, 64] },
          { label: "Rented", pattern: "hatched", values: [77, 68, 60, 57, 50, 42, 33, 31, 36] },
        ],
      },
    ],
  },
  {
    prompt:
      "The bar chart below shows the numbers of male and female research students studying six computer-related subjects at a UK university in 2011.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "bar",
        title: "Male and female research students by subject, 2011",
        xLabels: ["Psychology", "Computer Science", "Mathematics", "Engineering", "Physics", "Chemistry"],
        yMax: 250,
        yStep: 50,
        yUnit: "Number of students",
        xUnit: "Subject",
        series: [
          { label: "Male", pattern: "dark", values: [75, 200, 100, 150, 120, 90] },
          { label: "Female", pattern: "hatched", values: [180, 50, 60, 40, 70, 110] },
        ],
      },
    ],
  },
  {
    prompt:
      "The bar chart below shows the average monthly rainfall in three cities over a year.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "bar",
        title: "Average monthly rainfall in three cities (mm)",
        xLabels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
        yMax: 200,
        yStep: 40,
        yUnit: "Rainfall (mm)",
        xUnit: "Month",
        series: [
          { label: "City A", pattern: "dark", values: [80, 100, 140, 120, 90, 60] },
          { label: "City B", pattern: "hatched", values: [40, 60, 90, 150, 170, 110] },
          { label: "City C", pattern: "dotted", values: [120, 100, 80, 60, 50, 70] },
        ],
      },
    ],
  },
  {
    prompt:
      "The bar chart below shows the percentage of people using different modes of transport to commute to work in four countries.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "bar",
        title: "Commute mode by country (%)",
        xLabels: ["Car", "Bus", "Train", "Bicycle", "Walking"],
        yMax: 70,
        yStep: 10,
        yUnit: "Percentage (%)",
        xUnit: "Mode",
        series: [
          { label: "Country A", pattern: "dark", values: [50, 20, 15, 8, 7] },
          { label: "Country B", pattern: "hatched", values: [30, 25, 30, 10, 5] },
          { label: "Country C", pattern: "dotted", values: [20, 40, 20, 15, 5] },
          { label: "Country D", pattern: "cross", values: [10, 30, 40, 15, 5] },
        ],
      },
    ],
  },
  {
    prompt:
      "The bar chart below shows the number of international students enrolled in universities in four countries in 2010 and 2020.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "bar",
        title: "International student enrolment (thousands)",
        xLabels: ["USA", "UK", "Australia", "Canada"],
        yMax: 1000,
        yStep: 200,
        yUnit: "Students (thousands)",
        xUnit: "Country",
        series: [
          { label: "2010", pattern: "dark", values: [700, 400, 250, 200] },
          { label: "2020", pattern: "hatched", values: [900, 500, 450, 400] },
        ],
      },
    ],
  },
  {
    prompt:
      "The bar chart below shows the average hours spent per week on various leisure activities by age group.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "bar",
        title: "Weekly leisure hours by age group",
        xLabels: ["TV", "Internet", "Sports", "Reading", "Socialising"],
        yMax: 30,
        yStep: 5,
        yUnit: "Hours per week",
        xUnit: "Activity",
        series: [
          { label: "18–30", pattern: "dark", values: [10, 25, 8, 3, 15] },
          { label: "31–50", pattern: "hatched", values: [15, 20, 5, 5, 10] },
          { label: "51–70", pattern: "dotted", values: [25, 8, 3, 8, 6] },
        ],
      },
    ],
  },
  {
    prompt:
      "The bar chart below shows the production of three different crops in a country from 2000 to 2020 (in millions of tonnes).\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "bar",
        title: "Crop production (millions of tonnes)",
        xLabels: ["2000", "2005", "2010", "2015", "2020"],
        yMax: 100,
        yStep: 20,
        yUnit: "Millions of tonnes",
        xUnit: "Year",
        series: [
          { label: "Wheat", pattern: "dark", values: [40, 50, 55, 60, 70] },
          { label: "Rice", pattern: "hatched", values: [30, 35, 40, 45, 55] },
          { label: "Maize", pattern: "dotted", values: [20, 25, 30, 35, 45] },
        ],
      },
    ],
  },
];

// ── LINE variants (7) ──
const LINE_CHARTS = [
  {
    prompt:
      "The graph below shows the quantities of goods transported in the UK between 1974 and 2002 by four different modes of transport.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    charts: [
      {
        kind: "line",
        title: "Goods transported in the UK, 1974–2002 (million tonnes)",
        xLabels: ["1974", "1978", "1982", "1986", "1990", "1994", "1998", "2002"],
        yMax: 120,
        yStep: 20,
        yUnit: "Million tonnes",
        xUnit: "Year",
        series: [
          { label: "Road", marker: "circle", style: "solid", filled: true, values: [70, 79, 82, 90, 98, 105, 108, 112] },
          { label: "Water", marker: "triangle", style: "dashed", filled: false, values: [40, 45, 48, 52, 55, 58, 60, 62] },
          { label: "Rail", marker: "square", style: "dotted", filled: false, values: [40, 38, 36, 35, 34, 33, 34, 35] },
          { label: "Pipeline", marker: "diamond", style: "solid", filled: false, values: [5, 7, 10, 15, 20, 22, 24, 23] },
        ],
      },
    ],
  },
  {
    prompt:
      "The graph below shows the proportion of the population aged 65 and over between 1940 and 2040 in three different countries.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "line",
        title: "Proportion of population aged 65 and over (1940–2040)",
        xLabels: ["1940", "1960", "1980", "2000", "2020", "2040"],
        yMax: 30,
        yStep: 5,
        yUnit: "Percentage (%)",
        xUnit: "Year",
        series: [
          { label: "USA", marker: "circle", style: "solid", filled: true, values: [9, 10, 12, 14, 18, 23] },
          { label: "Sweden", marker: "square", style: "dashed", filled: false, values: [7, 12, 15, 18, 20, 25] },
          { label: "Japan", marker: "triangle", style: "dotted", filled: false, values: [5, 6, 9, 15, 22, 28] },
        ],
      },
    ],
  },
  {
    prompt:
      "The line graph below shows the average temperature in three cities over a year.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "line",
        title: "Average temperature in three cities (°C)",
        xLabels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
        yMax: 40,
        yStep: 10,
        yUnit: "Temperature (°C)",
        xUnit: "Month",
        series: [
          { label: "City A", marker: "circle", style: "solid", filled: true, values: [10, 14, 20, 28, 24, 15] },
          { label: "City B", marker: "square", style: "dashed", filled: false, values: [5, 8, 15, 22, 18, 10] },
          { label: "City C", marker: "triangle", style: "dotted", filled: false, values: [20, 24, 30, 35, 30, 25] },
        ],
      },
    ],
  },
  {
    prompt:
      "The line graph below shows the number of visitors to three museums in a European city from 2010 to 2020.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "line",
        title: "Museum visitors (thousands)",
        xLabels: ["2010", "2012", "2014", "2016", "2018", "2020"],
        yMax: 100,
        yStep: 20,
        yUnit: "Visitors (thousands)",
        xUnit: "Year",
        series: [
          { label: "Museum A", marker: "circle", style: "solid", filled: true, values: [50, 60, 70, 80, 90, 40] },
          { label: "Museum B", marker: "square", style: "dashed", filled: false, values: [30, 35, 40, 45, 50, 20] },
          { label: "Museum C", marker: "triangle", style: "dotted", filled: false, values: [20, 25, 30, 35, 40, 15] },
        ],
      },
    ],
  },
  {
    prompt:
      "The line graph below shows the unemployment rate in four countries over a 20-year period.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "line",
        title: "Unemployment rate (%)",
        xLabels: ["2000", "2005", "2010", "2015", "2020"],
        yMax: 15,
        yStep: 3,
        yUnit: "Percentage (%)",
        xUnit: "Year",
        series: [
          { label: "Country A", marker: "circle", style: "solid", filled: true, values: [5, 6, 10, 7, 12] },
          { label: "Country B", marker: "square", style: "dashed", filled: false, values: [4, 5, 8, 6, 9] },
          { label: "Country C", marker: "triangle", style: "dotted", filled: false, values: [7, 8, 12, 10, 14] },
          { label: "Country D", marker: "diamond", style: "dashdot", filled: false, values: [3, 4, 6, 5, 7] },
        ],
      },
    ],
  },
  {
    prompt:
      "The line graph below shows the percentage of households with internet access in three countries from 2000 to 2020.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "line",
        title: "Households with internet access (%)",
        xLabels: ["2000", "2005", "2010", "2015", "2020"],
        yMax: 100,
        yStep: 20,
        yUnit: "Percentage (%)",
        xUnit: "Year",
        series: [
          { label: "Country A", marker: "circle", style: "solid", filled: true, values: [20, 50, 70, 85, 95] },
          { label: "Country B", marker: "square", style: "dashed", filled: false, values: [10, 30, 55, 75, 90] },
          { label: "Country C", marker: "triangle", style: "dotted", filled: false, values: [5, 15, 35, 60, 80] },
        ],
      },
    ],
  },
  {
    prompt:
      "The line graph below shows the number of cars sold by three manufacturers from 2015 to 2021 (in thousands).\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "line",
        title: "Cars sold by manufacturer (thousands)",
        xLabels: ["2015", "2016", "2017", "2018", "2019", "2020", "2021"],
        yMax: 500,
        yStep: 100,
        yUnit: "Cars (thousands)",
        xUnit: "Year",
        series: [
          { label: "Maker A", marker: "circle", style: "solid", filled: true, values: [200, 250, 300, 350, 400, 350, 420] },
          { label: "Maker B", marker: "square", style: "dashed", filled: false, values: [150, 180, 220, 260, 300, 280, 330] },
          { label: "Maker C", marker: "triangle", style: "dotted", filled: false, values: [100, 120, 140, 160, 180, 170, 200] },
        ],
      },
    ],
  },
];

// ── TABLE variants (7) ──
const TABLE_CHARTS = [
  {
    prompt:
      "The table below gives information about underground railway systems in six cities.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    charts: [
      {
        kind: "table",
        title: "Underground railway systems in six cities",
        columns: ["City", "Date opened", "Kilometres of route", "Passengers per year (in millions)"],
        rows: [
          ["London", "1863", "394", "775"],
          ["Paris", "1900", "199", "1191"],
          ["Tokyo", "1927", "155", "1927"],
          ["Washington DC", "1976", "126", "144"],
          ["Kyoto", "1981", "11", "45"],
          ["Los Angeles", "2001", "28", "50"],
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the number of employees in five departments of a company in 2015 and 2020.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "table",
        title: "Employees by department",
        columns: ["Department", "2015", "2020"],
        rows: [
          ["Sales", "120", "180"],
          ["Marketing", "80", "90"],
          ["Engineering", "150", "210"],
          ["HR", "40", "45"],
          ["Finance", "60", "75"],
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the average monthly expenditure of a family in four categories over three years.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "table",
        title: "Average monthly expenditure ($)",
        columns: ["Category", "2018", "2019", "2020"],
        rows: [
          ["Housing", "800", "850", "900"],
          ["Food", "400", "420", "450"],
          ["Transport", "200", "220", "250"],
          ["Leisure", "150", "180", "200"],
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the number of international students enrolled in five universities in a country in 2019.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "table",
        title: "International students by university, 2019",
        columns: ["University", "Undergraduate", "Postgraduate", "Total"],
        rows: [
          ["University A", "1200", "800", "2000"],
          ["University B", "900", "600", "1500"],
          ["University C", "700", "500", "1200"],
          ["University D", "1500", "1000", "2500"],
          ["University E", "400", "300", "700"],
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the percentage of people using different social media platforms in 2018 and 2022.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "table",
        title: "Social media usage (%)",
        columns: ["Platform", "2018", "2022"],
        rows: [
          ["Platform A", "72", "65"],
          ["Platform B", "58", "70"],
          ["Platform C", "45", "55"],
          ["Platform D", "30", "40"],
          ["Platform E", "20", "35"],
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the number of hospital admissions by age group in a country in 2015 and 2020.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "table",
        title: "Hospital admissions by age group (thousands)",
        columns: ["Age group", "2015", "2020"],
        rows: [
          ["0–17", "120", "130"],
          ["18–34", "200", "220"],
          ["35–54", "350", "380"],
          ["55–74", "500", "560"],
          ["75+", "400", "450"],
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the production and consumption of electricity in five countries in 2020 (in TWh).\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "table",
        title: "Electricity production and consumption, 2020 (TWh)",
        columns: ["Country", "Production", "Consumption", "Difference"],
        rows: [
          ["Country A", "5000", "4800", "200"],
          ["Country B", "3500", "3600", "-100"],
          ["Country C", "2800", "2700", "100"],
          ["Country D", "2000", "2200", "-200"],
          ["Country E", "1500", "1400", "100"],
        ],
      },
    ],
  },
];

// ── PROCESS variants (7) ──
const PROCESS_CHARTS = [
  {
    prompt:
      "The diagram below shows the process of making paper from wood.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "process",
        title: "How paper is made from wood",
        rows: [
          [
            { n: 1, icon: "tree", label: "Trees harvested", sub: "Bark removed" },
            { n: 2, icon: "logs", label: "Logs cut", sub: "Into chips" },
            { n: 3, icon: "chipper", label: "Chipping", sub: "Smaller pieces" },
            { n: 4, icon: "cook", label: "Digestion", sub: "Chemical pulp" },
          ],
          [
            { n: 5, icon: "press", label: "Pressing", sub: "Water removed" },
            { n: 6, icon: "bleach", label: "Bleaching", sub: "Whitened" },
            { n: 7, icon: "dry", label: "Drying", sub: "Hot air" },
            { n: 8, icon: "roll", label: "Rolling", sub: "Finished paper" },
          ],
        ],
      },
    ],
  },
  {
    prompt:
      "The diagram below shows the process of making chocolate from cocoa beans.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "process",
        title: "How chocolate is made",
        rows: [
          [
            { n: 1, icon: "tree", label: "Cocoa harvested", sub: "Pods opened" },
            { n: 2, icon: "dry", label: "Beans dried", sub: "Sun-dried" },
            { n: 3, icon: "cook", label: "Roasting", sub: "150°C" },
            { n: 4, icon: "cut", label: "Winnowing", sub: "Shells removed" },
          ],
          [
            { n: 5, icon: "press", label: "Grinding", sub: "Cocoa mass" },
            { n: 6, icon: "cook", label: "Conching", sub: "Smooth" },
            { n: 7, icon: "roll", label: "Tempering", sub: "Cooled" },
            { n: 8, icon: "roll", label: "Moulding", sub: "Bars formed" },
          ],
        ],
      },
    ],
  },
  {
    prompt:
      "The diagram below shows the process of recycling plastic bottles.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "process",
        title: "Plastic bottle recycling process",
        rows: [
          [
            { n: 1, icon: "logs", label: "Collection", sub: "Bins" },
            { n: 2, icon: "chipper", label: "Sorting", sub: "By type" },
            { n: 3, icon: "cut", label: "Shredding", sub: "Flakes" },
            { n: 4, icon: "cook", label: "Washing", sub: "Cleaned" },
          ],
          [
            { n: 5, icon: "dry", label: "Drying", sub: "Moisture out" },
            { n: 6, icon: "cook", label: "Melting", sub: "Pellets" },
            { n: 7, icon: "press", label: "Moulding", sub: "New bottles" },
            { n: 8, icon: "roll", label: "Packaging", sub: "Shipped" },
          ],
        ],
      },
    ],
  },
  {
    prompt:
      "The diagram below shows the process of making cement and concrete for building.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "process",
        title: "How cement and concrete are made",
        rows: [
          [
            { n: 1, icon: "logs", label: "Limestone mined", sub: "Raw material" },
            { n: 2, icon: "chipper", label: "Crushing", sub: "Small pieces" },
            { n: 3, icon: "cook", label: "Kiln heating", sub: "1500°C" },
            { n: 4, icon: "dry", label: "Cooling", sub: "Clinker" },
          ],
          [
            { n: 5, icon: "press", label: "Grinding", sub: "Cement powder" },
            { n: 6, icon: "cook", label: "Mixing", sub: "Sand + water" },
            { n: 7, icon: "press", label: "Pouring", sub: "Into moulds" },
            { n: 8, icon: "dry", label: "Curing", sub: "Concrete set" },
          ],
        ],
      },
    ],
  },
  {
    prompt:
      "The diagram below shows the process of producing olive oil.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "process",
        title: "How olive oil is produced",
        rows: [
          [
            { n: 1, icon: "tree", label: "Olives harvested", sub: "By hand" },
            { n: 2, icon: "logs", label: "Leaves removed", sub: "Washing" },
            { n: 3, icon: "chipper", label: "Crushing", sub: "Paste" },
            { n: 4, icon: "press", label: "Pressing", sub: "Oil extracted" },
          ],
          [
            { n: 5, icon: "cook", label: "Centrifuging", sub: "Separation" },
            { n: 6, icon: "dry", label: "Filtering", sub: "Impurities out" },
            { n: 7, icon: "roll", label: "Bottling", sub: "Sealed" },
            { n: 8, icon: "roll", label: "Distribution", sub: "To shops" },
          ],
        ],
      },
    ],
  },
  {
    prompt:
      "The diagram below shows the process of treating water for drinking.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "process",
        title: "Water treatment process",
        rows: [
          [
            { n: 1, icon: "logs", label: "Collection", sub: "Reservoir" },
            { n: 2, icon: "chipper", label: "Screening", sub: "Large debris" },
            { n: 3, icon: "cook", label: "Coagulation", sub: "Chemicals added" },
            { n: 4, icon: "press", label: "Sedimentation", sub: "Solids settle" },
          ],
          [
            { n: 5, icon: "dry", label: "Filtration", sub: "Fine filters" },
            { n: 6, icon: "bleach", label: "Disinfection", sub: "Chlorine" },
            { n: 7, icon: "roll", label: "Storage", sub: "Clean tank" },
            { n: 8, icon: "roll", label: "Distribution", sub: "To homes" },
          ],
        ],
      },
    ],
  },
  {
    prompt:
      "The diagram below shows the process of manufacturing glass from sand.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "process",
        title: "How glass is manufactured",
        rows: [
          [
            { n: 1, icon: "logs", label: "Sand mined", sub: "Raw material" },
            { n: 2, icon: "chipper", label: "Crushing", sub: "Fine powder" },
            { n: 3, icon: "cook", label: "Melting", sub: "1700°C" },
            { n: 4, icon: "press", label: "Shaping", sub: "Moulded" },
          ],
          [
            { n: 5, icon: "dry", label: "Cooling", sub: "Annealing" },
            { n: 6, icon: "cut", label: "Cutting", sub: "To size" },
            { n: 7, icon: "roll", label: "Polishing", sub: "Smooth finish" },
            { n: 8, icon: "roll", label: "Packing", sub: "For sale" },
          ],
        ],
      },
    ],
  },
];

// ── MAP variants (7) ──
const MAP_CHARTS = [
  {
    prompt:
      "The two maps below show an island, before and after the construction of some tourist facilities.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      { kind: "map", titleBefore: "Island — before", titleAfter: "Island — after" },
    ],
  },
  {
    prompt:
      "The two maps below show the town centre of a coastal town in 1990 and 2010.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      { kind: "map", titleBefore: "Town centre — 1990", titleAfter: "Town centre — 2010" },
    ],
  },
  {
    prompt:
      "The two maps below show the layout of a university campus in 2000 and 2020.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      { kind: "map", titleBefore: "Campus — 2000", titleAfter: "Campus — 2020" },
    ],
  },
  {
    prompt:
      "The two maps below show a village before and after the construction of a new residential area.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      { kind: "map", titleBefore: "Village — before", titleAfter: "Village — after" },
    ],
  },
  {
    prompt:
      "The two maps below show a harbour area in 1980 and today.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      { kind: "map", titleBefore: "Harbour — 1980", titleAfter: "Harbour — today" },
    ],
  },
  {
    prompt:
      "The two maps below show a city park before and after redevelopment.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      { kind: "map", titleBefore: "Park — before", titleAfter: "Park — after" },
    ],
  },
  {
    prompt:
      "The two maps below show a small town before and after a new shopping centre was built.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      { kind: "map", titleBefore: "Town — before", titleAfter: "Town — after" },
    ],
  },
];

// ── CHANGE TABLE variants (8) ──
const CHANGE_TABLE_CHARTS = [
  {
    prompt:
      "The table below shows the percentage change in the number of international students graduating from universities in different Canadian provinces between 2001 and 2006.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "change_table",
        title: "Percentage change in international graduates, 2001–2006",
        rows: [
          { label: "Ontario", value: 25, direction: "up" },
          { label: "British Columbia", value: 18, direction: "up" },
          { label: "Quebec", value: 12, direction: "up" },
          { label: "Alberta", value: 4, direction: "down" },
          { label: "Manitoba", value: 9, direction: "up" },
          { label: "Nova Scotia", value: 3, direction: "down" },
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the percentage change in the number of tourists visiting five regions between 2015 and 2020.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "change_table",
        title: "Percentage change in tourist numbers, 2015–2020",
        rows: [
          { label: "Europe", value: 15, direction: "up" },
          { label: "Asia", value: 28, direction: "up" },
          { label: "North America", value: 6, direction: "up" },
          { label: "South America", value: 8, direction: "down" },
          { label: "Africa", value: 20, direction: "up" },
          { label: "Oceania", value: 5, direction: "down" },
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the percentage change in sales of five product categories between 2018 and 2021.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "change_table",
        title: "Percentage change in sales, 2018–2021",
        rows: [
          { label: "Electronics", value: 32, direction: "up" },
          { label: "Clothing", value: 12, direction: "up" },
          { label: "Furniture", value: 5, direction: "down" },
          { label: "Toys", value: 18, direction: "up" },
          { label: "Books", value: 2, direction: "down" },
          { label: "Sports", value: 22, direction: "up" },
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the percentage change in the number of cars registered in six cities between 2010 and 2020.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "change_table",
        title: "Percentage change in car registrations, 2010–2020",
        rows: [
          { label: "City A", value: 18, direction: "up" },
          { label: "City B", value: 7, direction: "down" },
          { label: "City C", value: 25, direction: "up" },
          { label: "City D", value: 12, direction: "up" },
          { label: "City E", value: 4, direction: "down" },
          { label: "City F", value: 10, direction: "up" },
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the percentage change in the number of employees in six industries between 2015 and 2020.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "change_table",
        title: "Percentage change in employment, 2015–2020",
        rows: [
          { label: "Manufacturing", value: 6, direction: "down" },
          { label: "Technology", value: 30, direction: "up" },
          { label: "Healthcare", value: 15, direction: "up" },
          { label: "Retail", value: 3, direction: "down" },
          { label: "Education", value: 8, direction: "up" },
          { label: "Hospitality", value: 12, direction: "down" },
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the percentage change in the number of visits to different types of museums between 2019 and 2022.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "change_table",
        title: "Percentage change in museum visits, 2019–2022",
        rows: [
          { label: "Art museum", value: 14, direction: "down" },
          { label: "History museum", value: 5, direction: "up" },
          { label: "Science museum", value: 22, direction: "up" },
          { label: "Natural history", value: 3, direction: "down" },
          { label: "War museum", value: 8, direction: "up" },
          { label: "Children's museum", value: 18, direction: "up" },
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the percentage change in the amount of renewable energy produced in six countries between 2015 and 2020.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "change_table",
        title: "Percentage change in renewable energy production, 2015–2020",
        rows: [
          { label: "Country A", value: 42, direction: "up" },
          { label: "Country B", value: 18, direction: "up" },
          { label: "Country C", value: 9, direction: "down" },
          { label: "Country D", value: 35, direction: "up" },
          { label: "Country E", value: 12, direction: "up" },
          { label: "Country F", value: 5, direction: "down" },
        ],
      },
    ],
  },
  {
    prompt:
      "The table below shows the percentage change in the number of online shoppers in six countries between 2019 and 2022.\n\nSummarise the information by selecting and reporting the main features.",
    charts: [
      {
        kind: "change_table",
        title: "Percentage change in online shoppers, 2019–2022",
        rows: [
          { label: "Country A", value: 20, direction: "up" },
          { label: "Country B", value: 8, direction: "down" },
          { label: "Country C", value: 15, direction: "up" },
          { label: "Country D", value: 28, direction: "up" },
          { label: "Country E", value: 6, direction: "up" },
          { label: "Country F", value: 3, direction: "down" },
        ],
      },
    ],
  },
];

// =====================================================================
// BUILDER — interleave chart kinds across 50 tests
// =====================================================================
function buildTests() {
  const pieCount = 0,
    barCount = 0,
    lineCount = 0,
    tableCount = 0,
    processCount = 0,
    mapCount = 0,
    changeCount = 0;
  const counters = {
    pie: 0,
    bar: 0,
    line: 0,
    table: 0,
    process: 0,
    map: 0,
    change_table: 0,
  };

  // ordered cycling pattern across 50 tests
  // one entry per test number 1..50 → which chart kind
  const kindSequence = [
    "pie", "bar", "line", "table", "process", "map", "change_table",
    "pie", "bar", "line", "table", "process", "map", "change_table",
    "pie", "bar", "line", "table", "process", "map", "change_table",
    "pie", "bar", "line", "table", "process", "map", "change_table",
    "pie", "bar", "line", "table", "process", "map", "change_table",
    "pie", "bar", "line", "table", "process", "map", "change_table",
    "pie", "bar", "line", "table", "process", "map", "change_table",
    "change_table",
  ];

  const pools = {
    pie: PIE_CHARTS,
    bar: BAR_CHARTS,
    line: LINE_CHARTS,
    table: TABLE_CHARTS,
    process: PROCESS_CHARTS,
    map: MAP_CHARTS,
    change_table: CHANGE_TABLE_CHARTS,
  };

  const p2Prompts = Object.values(P2);

  const tests = [];
  for (let i = 0; i < 50; i++) {
    const kind = kindSequence[i];
    const pool = pools[kind];
    const idx = counters[kind] % pool.length;
    counters[kind]++;

    const chartDef = pool[idx];
    const p2Prompt = p2Prompts[i % p2Prompts.length];

    tests.push({
      testNumber: i + 1,
      title: `Academic Writing Test ${i + 1}`,
      priority: "main",
      status: "published",
      parts: [
        p1("Part 1", chartDef.prompt, chartDef.charts),
        p2(p2Prompt),
      ],
    });
  }
  return tests;
}

const writingTests = buildTests();

async function seedDB() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await WritingTest.find({ testNumber: { $lte: 50 } });
    if (existing.length > 0) {
      console.log(
        `🗑️  Deleting ${existing.length} existing writing tests (1–50)...`,
      );
      await WritingTest.deleteMany({ testNumber: { $lte: 50 } });
    }

    console.log(`🚀 Inserting ${writingTests.length} writing tests...`);
    await WritingTest.insertMany(writingTests);
    console.log("🎉 Successfully inserted all writing tests!");

    await mongoose.disconnect();
    console.log("🔌 Disconnected");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seedDB();
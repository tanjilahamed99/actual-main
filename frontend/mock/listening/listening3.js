export const listening3Answers = {
  1: "warehouse",
  2: "Hitcher",
  3: "supermarket",
  4: "bakery",
  5: "ARW204",
  6: "adverts",
  7: "newspaper",
  8: "agency",
  9: "tutors",
  10: "feedback",
  11: "A",
  12: "B",
  13: "C",
  14: "A",
  15: "B",
  16: "C",
  17: "B",
  18: "E",
  19: "H",
  20: "G",
  21: "A",
  22: "B",
  23: "A",
  24: "C",
  25: "B",
  26: "C",
  27: ["B", "E"],
  28: ["B", "E"],
  29: ["A", "D"],
  30: ["A", "D"],
  31: "transportation",
  32: "clean",
  33: "information",
  34: "residents",
  35: "bonus",
  36: "visitors",
  37: "communication",
  38: "sleep",
  39: "plastic",
  40: "planning",
};

export const listening3Questions = {
  section1: {
    questions: [
      {
        type: "tableGap",
        heading: "Questions 1–5",
        sub: "Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
        title: "Complete the notes below.",
        themeTitle: "Ceramics",
        tableGapFill: {
          part: "Part 1",
          qRange: "1–5",
          instruction: "Complete the table below.",
          sub: "Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
          title: "JOB HUNTING",
          headers: [
            "Company's name",
            "Job details",
            "Reference Number",
            "Contact",
          ],
          rows: [
            {
              cells: [
                // Col 1 — company name (plain)
                { text: "Example\nPOWER\n(manufacturing company)" },

                // Col 2 — job details with bullet + gap inline
                {
                  lines: [
                    {
                      bullet: "•",
                      parts: [
                        { text: "work in a " },
                        { gap: 1 },
                        { text: " section" },
                      ],
                    },
                  ],
                },

                // Col 3 — reference number (plain)
                { text: "SW35FT" },

                // Col 4 — contact with gap inline
                {
                  lines: [
                    {
                      parts: [{ text: "Jane " }, { gap: 2 }],
                    },
                  ],
                },
              ],
            },

            {
              cells: [
                // Col 1
                { text: "COTTON\n(grocery company)" },

                // Col 2 — 3 bullets, "work" has 2 sub-bullets each with a gap
                {
                  lines: [
                    {
                      bullet: "•",
                      parts: [{ text: "good pay" }],
                    },
                    {
                      bullet: "•",
                      parts: [{ text: "work" }],
                      // sub-items indented under this bullet
                      subLines: [
                        {
                          prefix: "– in",
                          parts: [{ gap: 3 }, { text: " office" }],
                        },
                        {
                          prefix: "– in a",
                          parts: [{ gap: 4 }],
                        },
                      ],
                    },
                    {
                      bullet: "•",
                      parts: [{ text: "chance of promotion" }],
                    },
                  ],
                },

                // Col 3 — only a gap
                {
                  lines: [
                    {
                      parts: [{ gap: 5 }],
                    },
                  ],
                },

                // Col 4
                { text: "go to office" },
              ],
            },
          ],
        },
      },
      {
        type: "gaps",
        heading: "Questions 6–10",
        title: "Complete the gap below.",
        sub: "Write ONE WORD ONLY in each gap.",
        questionTitle: "Notes on Jobs",
        bulletPoint: true,
        items: [
          {
            num: 6,
            label: "Local jobs can be found in the",
          },
          {
            num: 7,
            label: "Buy the",
            afterText: "to get one free magazine (Job Plus)",
          },
          {
            num: 'example',
            label: "Fell stress and spend a lot of time looking for jobs",
          },
          {
            num: 8,
            label: "Advisable to go to an",
            afterText:
              "instead of the recruitment seminar • Bring a student card (10% discount)",
          },
          {
            num: 'example',
            label: "Bring a student card (10% discount)",
          },
          {
            num: 9,
            label: "Referee: one of the",
            afterText: "(if not)",
          },
          {
            num: 'example',
            label: "Intend to take art course",
          },
          {
            num: 10,
            label: "Fill out a",
            afterText: "form at the end of the course",
          },
        ],
      },
    ],
  },
  section2: {
    questions: [
      {
        type: "mcq",
        heading: "Questions 11–15",
        title: "Choose the correct letter, A, B or C.",
        items: [
          {
            n: 11,
            q: "The reason why David is replacing Jane is that",
            opts: [
              "she is unwell.",
              "she is very busy.",
              "she is inexperienced.",
            ],
          },
          {
            n: 12,
            q: "According to the speaker, what is the problem for the museum currently?",
            opts: ["lack of staff", "lack of publicity", "lack of money"],
          },
          {
            n: 13,
            q: "Why were the thieves able to successfully steal the statue?",
            opts: [
              "The security device is outdated.",
              "The security guard is not well-trained.",
              "They knew what they were searching for.",
            ],
          },
          {
            n: 14,
            q: "In order to improve security, they are going to",
            opts: [
              "get more closed-circuit television cameras.",
              "hire more security guards",
              "buy more computers.",
            ],
          },
          {
            n: 15,
            q: "What kind of librarian are they looking for?",
            opts: ["responsible", "experienced", "highly-trained"],
          },
        ],
      },
      {
        type: "map",
        heading: "Questions 16–20",
        title: "Choose the correct letter, A, B or C.",
        mapLabel: {
          part: "Part 2",
          qRange: "16–20",
          instruction:
            "Label the map below. Write the correct letter, A–H, next to questions 16–20.",
          title: "City Museum",

          // Built-in SVG map config — describes rooms by letter with position
          mapConfig: {
            width: 560,
            height: 320,
            rooms: [
              {
                id: "G",
                x: 30,
                y: 30,
                w: 90,
                h: 60,
                shape: "rect",
                label: "G",
              },
              {
                id: "D",
                x: 180,
                y: 30,
                w: 90,
                h: 60,
                shape: "rect",
                label: "D",
              },
              {
                id: "H",
                x: 380,
                y: 30,
                w: 100,
                h: 70,
                shape: "rect",
                label: "H",
              },
              {
                id: "B",
                x: 30,
                y: 140,
                w: 90,
                h: 70,
                shape: "oval",
                label: "B",
              },
              // Sculpture (fixed label, not a gap)
              {
                id: "Sculpture",
                x: 185,
                y: 130,
                w: 140,
                h: 80,
                shape: "rect",
                label: "Sculpture",
                fixed: true,
              },
              {
                id: "F",
                x: 380,
                y: 150,
                w: 90,
                h: 60,
                shape: "rect",
                label: "F",
              },
              // Study centre (fixed label)
              {
                id: "StudyCentre",
                x: 20,
                y: 250,
                w: 110,
                h: 45,
                shape: "rect",
                label: "Study centre",
                fixed: true,
              },
              {
                id: "C",
                x: 175,
                y: 250,
                w: 90,
                h: 45,
                shape: "rect",
                label: "C",
              },
              // Entrance (fixed label)
              {
                id: "Entrance",
                x: 310,
                y: 250,
                w: 90,
                h: 45,
                shape: "rect",
                label: "Entrance",
                fixed: true,
              },
              {
                id: "A",
                x: 415,
                y: 250,
                w: 55,
                h: 45,
                shape: "rect",
                label: "A",
              },
              {
                id: "E",
                x: 485,
                y: 250,
                w: 55,
                h: 45,
                shape: "rect",
                label: "E",
              },
            ],
            // Arrow pointing up at entrance
            entranceArrow: { x: 355, y: 305 },
          },

          // The 5 gap items — students write A–H
          items: [
            { n: 16, label: "Box Office" },
            { n: 17, label: "Children's Room" },
            { n: 18, label: "Cafe" },
            { n: 19, label: "Multimedia Room" },
            { n: 20, label: "Showroom" },
          ],
          options: ["A", "B", "C", "D", "E", "F", "G", "H"],
        },
      },
    ],
  },
  section3: {
    questions: [
      {
        type: "mcq",
        heading: "Questions 21–26",
        title: "Choose the correct letter, A, B or C.",
        questionTitle: "Willows Studies",
        items: [
          {
            n: 21,
            q: "What field is Willows currently focused on?",
            opts: [
              "Specialising in one product",
              "making a variety of products",
              "adding a lot of retial outlet",
            ],
          },
          {
            n: 22,
            q: "How did the students feel about the software?",
            opts: [
              "The professor contacted the company.",
              "An article was read in a newspaper",
              "A student work their part-time during the vacations.",
            ],
          },
          {
            n: 23,
            q: "How did the student fell about the software",
            opts: [
              "It's not easy to predict.",
              "It's slow for drawing designs",
              "It had a good interface.",
            ],
          },
          {
            n: 24,
            q: "How did the students find out about the effects of the software on the company?",
            opts: [
              "They went to the IT department.",
              "They talked with the manager.",
              "They inspected the accounts.",
            ],
          },
          {
            n: 25,
            q: "The reason why the students have a face-to-face interview alone is that",
            opts: [
              "they could prepare for exams.",
              "there will be less disturbance.",
              "it's less realistic.",
            ],
          },
          {
            n: 26,
            q: "How did the two students perform in the exam?",
            opts: [
              "very disappointing",
              "significantly good",
              "above the average",
            ],
          },
        ],
      },
      {
        type: "multipleAnswer",
        heading: "Questions 27–30",
        title: "Choose THREE letters, A-D.",
        items: [
          {
            n: [27, 28],
            q: "In which TWO will the new system affect the company?",
            opts: [
              "gain more profit",
              "employ more new staff",
              "increase sales",
              "reduce production time",
              "cut labour casts",
            ],
          },
          {
            n: [29, 30],
            q: "Which TWO effect will the new system have on new clients?",
            opts: [
              "getting more involved in the design",
              "obtaining more contacts",
              "linking at home to do online work",
              "wasting less time",
              "decreasing labour costs",
            ],
          },
        ],
      },
    ],
  },
  section4: {
    questions: [
      {
        type: "gaps",
        heading: "Questions 31–40",
        title: "Complete the gap below.",
        sub: "Write ONE WORD ONLY in each gap.",
        questionTitle: "A Survey Research",
        themeTitle: "Results of the Questionnaire",
        bulletPoint: true,
        items: [
          {
            num: 31,
            label:
              "• The patients preferred to choose the hospital because of the free ",
            afterText: "service provided.",
          },
          {
            num: 32,
            label: "• Most patients wished the hospital to be",
          },
          {
            num: 33,
            label: "• Patients were concerned about prior",
            afterText: "about the hospital treatment.",
          },
        ],
      },
      {
        type: "gaps",
        themeTitle: "Action in the next year",
        bulletPoint: true,
        items: [
          {
            num: 34,
            label: "improvements on website for local",
            afterText: "as well as hospital medical staff",
          },
          {
            num: "example",
            label: "incentive to motivate the numbers of staff",
          },
          {
            num: 35,
            label: "extra",
            afterText: "for staff's success in work",
          },
          {
            num: 36,
            label: "considering the opinions of the",
          },
          {
            num: 37,
            label: "improving the effectiveness of",
            afterText: "between patients, doctors and staff",
          },
          {
            num: "example",
            label: "first-come-first-served system",
          },
        ],
      },
      {
        type: "gaps",
        themeTitle: "Recommendation",
        bulletPoint: true,
        items: [
          {
            num: 38,
            label:
              "A new unit would be built for those who are suffering from ",
          },
          {
            num: 39,
            label: "A new ward would be proposed to those in need of",
            afterText: "surgery",
          },
          {
            num: "example",
            label: "The equipment is advanced enough to do with the treatments",
          },
          {
            num: 40,
            label: "More effective",
            afterText: "is needed to improve the efficiency of communication.",
          },
        ],
      },
    ],
  },
};

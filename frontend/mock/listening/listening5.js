export const listening5Answers = {
  1: "B",
  2: "B",
  3: "A",
  4: "mixed salad",
  5: "greek salad",
  6: "bread with herbs",
  7: "cheese with peppers",
  8: "27 August",
  9: "15",
  10: "David.hamill@worthing",

  11: "C",
  12: "A",
  13: "1956",
  14: "11",
  15: "same year",
  16: "6",
  17: "17 year",
  18: "14",
  19: "1970",
  20: "tournament",

  21: "workshops",
  22: "well-respected",
  23: "seminars",
  24: "genetics",
  25: "newsletter",
  26: "flying fish",
  27: "wednesday 6 june",
  28: ["D", "F", "G"],
  29: ["D", "F", "G"],
  30: ["D", "F", "G"],
  
  31: "your weight",
  32: "wrongly think",
  33: "five portions",
  34: "protein",
  35: "oily fish",
  36: "muscles",
  37: "appliances",
  38: "30 minutes",
  39: "structured",
  40: "high physical stresses",
};

export const listening5Questions = {
  section1: {
    questions: [
      {
        type: "mcq",
        heading: "Questions 1–3",
        title: "Choose the correct letter, A, B or C.",
        items: [
          {
            n: 1,
            q: "How many bottles of wine do you have to buy to get one free",
            opts: ["one", "three", "four"],
          },
          {
            n: 2,
            q: "Which type of wine do Davids friends prefer",
            opts: ["French", "Italian", "Spanish"],
          },
          {
            n: 3,
            q: "What is the price of the champagne",
            opts: ["€20", "€35", "€25"],
          },
        ],
      },
      {
        type: "gaps",
        heading: "Questions 4–10",
        title: "Complete the gap below.",
        sub: "Write NO MORE THAN THREE WORDS AND/OR A NUMBER in each gap.",
        questionTitle: "Belluci's Restaurant -  Sam's suggestions:",
        themeTitle: "Would go best with the Lasagna:",
        bulletPoint: true,
        items: [
          {
            num: 4,
            label: "",
          },
          {
            num: 5,
            label: "",
          },
        ],
      },
      {
        type: "gaps",
        themeTitle: "Other side dishes that Sam mentions:",
        bulletPoint: true,
        items: [
          {
            num: 6,
            label: "",
            afterText:"with"
          },
          {
            num: 7,
            label: "",
            afterText:"with"
          },
        ],
      },
      {
        type: "gaps",
        themeTitle: "Customer details",
        bulletPoint: true,
        items: [
          {
            num: "example",
            label: "Booking made on - 5th August",
          },
          {
            num: 8,
            label: "Date when customers will be at the restaurant –",
          },
          {
            num: "example",
            label: "Time - 7 pm",
          },
          {
            num: 9,
            label: "Number of people –",
          },
          {
            num: 10,
            label: "Email address – ",
            afterText:".com"
          },
          {
            num: "example",
            label: "Customer phone number - 014453336451",
          },
          {
            num: "example",
            label: "Customer willing to have emails send to them - Yes",
          },
        ],
      },
    ],
  },
  section2: {
    questions: [
      {
        type: "mcq",
        heading: "Questions 11–12",
        title: "Choose the correct letter, A, B or C.",
        items: [
          {
            n: 11,
            q: "How did the players hit the ball when the game first launched in the 12th century",
            opts: ["with a bat", "with a racquet", "with their bare hand"],
          },
          {
            n: 12,
            q: "In the 16 century what kind of people found tennis most appealing",
            opts: ["royal families", "wealthy merchants", "everyday people"],
          },
        ],
      },
      {
        type: "tableGap",
        heading: "Questions 13–20",
        sub: "Write NO MORE THAN THREE WORD AND/OR A NUMBER for each answer.",
        title: "Complete the notes below.",
        themeTitle: "Ceramics",
        tableGapFill: {
          title: "",
          headers: [
            "Tennis player",
            "Year born",
            "Nationality",
            "Number of major titles won",
            "Interesting fact",
          ],
          rows: [
            {
              cells: [
                { text: "Bjorn Borg" },
                {
                  lines: [
                    {
                      parts: [{ gap: 13 }],
                    },
                  ],
                },
                {
                  text: "Swedish",
                },
                {
                  lines: [
                    {
                      parts: [{ gap: 14 }],
                    },
                  ],
                },
                {
                  lines: [
                    {
                      parts: [
                        { text: "Won both Wimbledon and French Open in" },
                        { gap: 15 },
                        { text: "more then once" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              cells: [
                { text: "Boris Backer" },
                {
                  text: "1967",
                },
                {
                  text: "German",
                },
                {
                  lines: [
                    {
                      parts: [{ gap: 16 }],
                    },
                  ],
                },
                {
                  lines: [
                    {
                      parts: [
                        {
                          text: "The youngest ever male Grand Slam singles campion at",
                        },
                        { gap: 17 },
                        { text: "months" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              cells: [
                { text: "Pete Sampras" },
                {
                  text: "1971",
                },
                {
                  text: "American",
                },
                {
                  lines: [
                    {
                      parts: [{ gap: 18 }],
                    },
                  ],
                },
                {
                  text: "He started hitting tennis balls at the age of 3",
                },
              ],
            },
            {
              cells: [
                { text: "Andre Agassi" },
                {
                  lines: [
                    {
                      parts: [{ gap: 19 }],
                    },
                  ],
                },
                {
                  text: "American",
                },
                {
                  text: "8",
                },
                {
                  lines: [
                    {
                      parts: [
                        { text: "His first" },
                        { gap: 20 },
                        { text: "was in La Quinta" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
  },
  section3: {
    questions: [
      {
        type: "tableGap",
        heading: "Questions 21–27",
        sub: "Write NO MORE THAN THREE WORD AND/OR A NUMBER for each answer.",
        title: "Complete the notes below.",
        themeTitle: "College conference",
        tableGapFill: {
          title: "",
          headers: ["Speakers", "Administration and organization"],
          rows: [
            {
              cells: [
                {
                  lines: [
                    {
                      parts: [
                        {
                          text: "Professor Harman - good at running",
                        },
                        { gap: 21 },
                      ],
                    },
                  ],
                },
                {
                  text: "Invitations to all speakers have to be typed on the schools headed paper",
                },
              ],
            },
            {
              cells: [
                {
                  lines: [
                    {
                      parts: [
                        {
                          text: "Mr. Steve Bishop --",
                        },
                        { gap: 22 },
                        {
                          text: "among many Universities in England",
                        },
                      ],
                    },
                  ],
                },
                {
                  lines: [
                    {
                      parts: [
                        {
                          text: "The Photographer will take picture for the school",
                        },
                        { gap: 25 },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              cells: [
                {
                  lines: [
                    {
                      parts: [
                        {
                          text: "Sandra Bolton will give some Drama",
                        },
                        { gap: 23 },
                      ],
                    },
                  ],
                },
                {
                  lines: [
                    {
                      parts: [
                        {
                          text: "The caterers are called",
                        },
                        { gap: 26 },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              cells: [
                {
                  text: "Mr. Max Wallington will give lecture about Shakespeare",
                },
                {
                  text: "The conference will be in the main college hall and rooms 10, 11, 12 and 13",
                },
              ],
            },
            {
              cells: [
                {
                  lines: [
                    {
                      parts: [
                        {
                          text: "Sean O`Brien has done a lot of work in the filed of",
                        },
                        { gap: 24 },
                      ],
                    },
                  ],
                },
                {
                  lines: [
                    {
                      parts: [
                        {
                          text: "The date of the next meeting will be on",
                        },
                        { gap: 27 },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              cells: [
                {
                  text: "Geoff O`Hara has a lot of knowledge about Albert Einstein",
                },
              ],
            },
          ],
        },
      },
      {
        type: "multipleAnswer",
        heading: "Questions 28–30",
        title: "Choose THREE letters, A-G.",
        items: [
          {
            n: [28, 29, 30],
            q: "What Three rules given to them by the headmaster to do the students have to follow during the conference",
            opts: [
              "make sure they tidy up the hall and rooms after the conference",
              "provide cleaners for he conference",
              "provide lunch for the speakers",
              "make record of what each student at the conference wants to study at University",
              "make a record of what each student at the conference is studying now",
              "make a record of all the students who attend the conference",
              "help organize the travel arrangements for the speakers",
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
        sub: "Write NO MORE THAN THREE WORDS in each gap.",
        items: [
          {
            num: 31,
            label: "To calculate your body mass index you should first take",
            afterText: "in kilograms and divide it by your height in metres ",
          },
        ],
      },
      {
        type: "gaps",
        themeTitle: "Healthy diets",
        bulletPoint: true,
        items: [
          {
            num: "example",
            label:
              "It is important to eat starchy foods with fruit and vegetables",
          },
          {
            num: 32,
            label: "There are people who",
            afterText: "that starchy foods are fattening",
          },
          {
            num: 33,
            label: "Eat a minimum of",
            afterText: "of fruit and vegetables a day",
          },
          {
            num: 34,
            label: "People tend to eat too much",
            afterText: "and you only need a certain amount to keep healthy",
          },
          {
            num: 35,
            label: "People say that",
            afterText: "can help protect against heart disease",
          },
          {
            num: 36,
            label: "Exercise is good for us because: It tones our",
          },
          {
            num: 37,
            label: "We do less exercise because we have domestic",
            afterText: "to do things for us",
          },
          {
            num: 38,
            label: "Adults should do at least",
            afterText: "moderate intensity physical activity five days a week",
          },
          {
            num: 39,
            label: "A physical activity can be: A",
            afterText: "activity",
          },
          {
            num: 40,
            label: "Activities that produce",
            afterText: "on the bones are necessary",
          },
        ],
      },
    ],
  },
};

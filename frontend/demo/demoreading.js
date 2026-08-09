export const DemoReadingTest = [
  {
    id: 1,
    type: "reading",
    priority: "demo",
    title: "Demo Reading test-1",
    answers: {
      1: "location",
      2: "policies",
      3: "government",
      4: "incomes",
      5: "land",
      6: "suburban",
      7: "FALSE",
      8: "TRUE",
      9: "NOT GIVEN",
      10: "FALSE",
      11: "TRUE",
      12: "NOT GIVEN",
      13: "TRUE",

      14: "v",
      15: "i",
      16: "vi",
      17: "x",
      18: "ix",
      19: "iv",
      20: "ii",
      21: "TRUE",
      22: "TRUE",
      23: "NOT GIVEN",
      24: ["C", "D", "E"],
      25: ["C", "D", "E"],
      26: ["C", "D", "E"],

      27: "half-yawns",
      28: "sneeze",
      29: "fixed action pattern",
      30: "6 seconds",
      31: "68 seconds",
      32: "long yawns",
      33: "B",
      34: "C",
      35: "D",
      36: "C",
      37: "B",
      38: "TRUE",
      39: "NOT GIVEN",
      40: "TRUE",
    },
    questions: [
      {
        id: 1,
        label: "Passage 1",
        title: "How to find your way out of a food desert",
        subtitle:
          "Ordinary citizens have been using the internet to draw attention to the lack of healthy eating options in inner cities.",
        text: `Over the last few months, a survey has been carried out of over 200 greengrocers and convenience stores in Crown Heights, a neighborhood in Brooklyn, New York. As researchers from the Brooklyn Food Association enter the details, colorful dots appear on their online map, which display the specific location of each of the food stores in a handful of central Brooklyn neighborhoods. Clicking on a dot will show you the store's name and whether it carries fresh fruit and vegetables, wholegrain bread, low-fat dairy and other healthy options.

The researchers plan eventually to survey the entire borough of Brooklyn. ‘We want to get to a more specific and detailed description of what that looks like’, says Jeffrey Heehs, who leads the project. He hopes it will help residents find fresh food in urban areas where the stores sell mostly packaged snacks or fast food, areas otherwise known as food deserts. The aim of the project is also to assist government officials in assessing food availability, and in forming future policies about what kind of food should be sold and where.

In fact, the Brooklyn project represents the intersection of two growing trends: mapping fresh food markets in US cities, and private citizens creating online maps of local neighborhood features. According to Michael Goodchild, a geographer at the University of California at Santa Barbara, citizen map makers may make maps because there is no good government map, or to record problems such as burned-out traffic lights.

According to recent studies, people at higher risk of chronic disease and who receive minimal incomes for the work they do, frequently live in neighborhoods located in food deserts. But how did these food deserts arise? Linda Alwitt and Thomas Donley, marketing researchers at DePaul University in Chicago, found that supermarkets often can’t afford the amount of land required for their stores in cities. City planning researcher Cliff Guy and colleagues at the University of Leeds in the UK found in 2004 that smaller urban groceries tend to close due to competition from suburban supermarkets.

As fresh food stores leave a neighborhood, residents find it harder to eat well and stay healthy. Food deserts are linked with lower local health outcomes, and they may be a driving force in the health disparities between lower-income and affluent people in the US. Until recently, the issue attracted little national attention, and received no ongoing funding for research.

Now, more US cities are becoming aware of their food landscapes. Last year, the United States Department of Agriculture launched a map of where food stores are located in all the US counties. Mari Gallagher, who runs a private consulting firm, says her researchers have mapped food stores and related them to health statistics for the cities of Detroit, Chicago, Cincinnati and Washington, D.c. These maps help cities identify where food deserts are and, occasionally, have documented that people living in food deserts have higher rates of diet-related diseases.

The Brooklyn project differs in that it’s run by a local core of five volunteers who have worked on the project for the past year, rather than trained, academic researchers. To gather data, they simply go to individual stores with pre-printed surveys in hand, and once the storekeeper's permission has been obtained, check off boxes on their list against the products for sole in the store. Their approach to data collection and research has been made possible by technologies such as mapping software and GPS-related smart phones, Google Maps and OpenStreeMap, an open-source online map with a history of involvement in social issues. Like Brooklyn Food Association volunteers, many citizen online map makers use maps to bring local problems to official attention, Goodchild says. Heehs, the mapping project leader, says that after his group gathers more data, it will compare neighborhoods, come up with solutions to address local needs, and then present them to New York City officials. Their website hasn’t caught them much local or official attention yet, however. It was launched only recently, but its creators haven’t yet set up systems to see who’s looking at it.

Experts who visited the Brooklyn group’s site were optimistic but cautious. ‘This kind of detailed information could be very useful’ says Michele Ver Ploeg, an economist for the Department of Agriculture. To make the map more helpful to both residents and policy makers, she would like to see price data for healthy products, too. Karen Ansel, a registered dietician and a spokesperson for the American Dietetic Association, found the site confusing to navigate. ‘That said, with this information in place the group has the tools to build a more user-friendly site that could be ... very helpful to consumers’, she says. ‘The group also should ensure their map is available to those who don’t have internet access at home’, she adds. In fact, a significant proportion of Brooklyn residents don’t have internet access at home and 8 percent rely on dial-up service, instead of high-speed internet access, according to Gretchen Maneval, director of Brooklyn College’s Center for the study of Brooklyn. ‘It’s still very much a work in progress’, Heehs says of the online map. They’ll start advertising it online and by email to other community groups, such as urban food garden associations, next month. He also hopes warmer days in the spring will draw out fresh volunteers to spread awareness and to finish surveying, as they have about two-thirds of Brooklyn left to cover.`,
        questions: [
          {
            type: "short",
            heading: "Questions 1–6",
            title: "Complete the notes below.",
            sub: "Choose ONE WORD ONLY from the passage for each answer.",
            questionTitle: "Data on food deserts and their effects on health",
            themeTitle: "The Brooklyn Food Association",
            bulletPoint: true,
            items: [
              {
                n: 1,
                text: "The online map provides users with a store’s name",
                afterText: "and details of its produce.",
              },
              {
                n: 2,
                text: "One goal of the mapping project is to help develop new",
                afterText: "on food.",
              },
              {
                n: 3,
                text: "Citizen maps are sometimes made when",
                afterText: "maps are unsatisfactory..",
              },
            ],
          },
          {
            type: "short",
            themeTitle: "Reasons for the development of food deserts",
            bulletPoint: true,
            items: [
              {
                n: 4,
                text: "New research suggests that people living in food deserts often have low",
              },
              {
                n: 5,
                text: "Some supermarkets are unable to buy enough",
                afterText: " inside cities for their stores",
              },
              {
                n: 6,
                text: "Small grocery stores in cities often cannot cope with supermarket",
              },
            ],
          },
          {
            type: "tfng",
            heading: "Questions 7–13",
            title:
              "Do the following statements agree with the information given in Reading Passage 1?",
            sub: "In boxes on your answer sheet, write",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            optionLabels: {
              TRUE: "if the statement agrees with the information",
              FALSE: "if the statement contradicts the information",
              "NOT GIVEN": "if there is no information on this",
            },
            items: [
              {
                n: 7,
                text: "A group of professional researchers are in charge of the Brooklyn project.",
              },
              {
                n: 8,
                text: "The Brooklyn project team carries out their assessment of stores without the owner’s knowledge",
              },
              {
                n: 9,
                text: "The Brooklyn project has experienced technical difficulties setting up the website",
              },
              {
                n: 10,
                text: "The city government has taken a considerable interest in the Brooklyn project website",
              },
              {
                n: 11,
                text: " Michele Ver Ploeg believes the Brooklyn project website should contain additional information",
              },
              {
                n: 12,
                text: "The rate of internet use in Brooklyn is unlikely to increase in the near future",
              },
              {
                n: 13,
                text: "Jeffrey Heehs would like more people to assist with the Brooklyn project research",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        label: "Passage 2",
        title: "William Gilbert and Magnetism",
        subtitle: "The history of the Magnetism.",
        text: `[Paragraph A] The 16th and 17th centuries saw two great pioneers of modern science: Galileo and Gilbert. The impact of their findings is eminent. Gilbert was the first modern scientist, also the accredited father of the science of electricity and magnetism, an Englishman of learning and a physician at the court of Elizabeth. Prior to him, all that was known of electricity and magnetism was what the ancients knew, nothing more than that the lodestone possessed magnetic properties and that amber and jet, when rubbed, would attract bits of paper or other substances of small specific gravity. However, he is less well known than he deserves.

[Paragraph B] Gilbert’s birth pre-dated Galileo. Born in an eminent local family in Colchester County in the UK, on May 24, 1544, he went to grammar school, and then studied medicine at St John’s College, Cambridge, graduating in 1573. Later he travelled in the continent and eventually settled down in London.

[Paragraph C] He was a very successful and eminent doctor. All this culminated in his election to the president of the Royal Science Society. He was also appointed personal physician to the Queen (Elizabeth I), and later knighted by the Queen. He faithfully served her until her death. However, he didn’t outlive the Queen for long and died on November 30, 1603, only a few months after his appointment as personal physician to King James.

[Paragraph D] Gilbert was first interested in chemistry but later changed his focus due to the large portion of mysticism of alchemy involved (such as the transmutation of metal). He gradually developed his interest in physics after the great minds of the ancient, particularly about the knowledge the ancient Greeks had about lodestones, strange minerals with the power to attract iron. In the meantime, Britain became a major seafaring nation in 1588 when the Spanish Armada was defeat­ed, opening the way to British settlement of America. British ships depended on the magnetic compass, yet no one understood why it worked. Did the Pole Star attract it, as Columbus once speculated; or was there a magnetic mountain at the pole, as described in Odyssey, which ships would never approach, because the sail­ors thought its pull would yank out all their iron nails and fittings? For nearly 20 years, William Gilbert conducted ingenious experiments to understand magnet­ism. His works include On the Magnet, Magnetic Bodies, and the Great Magnet of the Earth.

[Paragraph E] Gilbert’s discovery was so important to modern physics. He investigated the nature of magnetism and electricity. He even coined the word “electric”. Though the early beliefs of magnetism were also largely entangled with superstitions such as that rubbing garlic on lodestone can neutralise its magnetism, one example being that sailors even believed the smell of garlic would even interfere with the action of compass, which is why helmsmen were forbidden to eat it near a ship’s compass. Gilbert also found that metals can be magnetised by rubbing mater­ials such as fur, plastic or the like on them. He named the ends of a magnet “north pole” and “south pole”. The magnetic poles can attract or repel, depending on polarity. In addition, however, ordinary iron is always attracted to a magnet. Though he started to study the relationship between magnetism and electricity, sadly he didn’t complete it. His research of static electricity using amber and jet only demonstrated that objects with electrical charges can work like magnets attracting small pieces of paper and stuff. It is a French guy named du Fay that discovered that there are actually two electrical charges, positive and negative.

[Paragraph F] He also questioned the traditional astronomical beliefs. Though a Copernican, he didn’t express in his quintessential beliefs whether the earth is at the centre of the universe or in orbit around the sun. However, he believed that stars are not equidistant from the earth but have their own earth-like planets orbiting around them. The earth itself is like a giant magnet, which is also why compasses always point north. They spin on an axis that is aligned with the earth’s polarity. He even likened the polarity of the magnet to the polarity of the earth and built an entire magnetic philosophy on this analogy. In his explanation, magnetism is the soul of the earth. Thus a perfectly spherical lodestone, when aligned with the earth’s poles, would wobble all by itself in 24 hours. Further, he also believed that the sun and other stars wobble just like the earth does around a crystal core, and speculated that the moon might also be a magnet caused to orbit by its magnetic attraction to the earth. This was perhaps the first proposal that a force might cause a heavenly orbit.

[Paragraph G] His research method was revolutionary in that he used experiments rather than pure logic and reasoning like the ancient Greek philosophers did. It was a new attitude towards scientific investigation. Until then, scientific experiments were not in fashion. It was because of this scientific attitude, together with his contri­bution to our knowledge of magnetism, that a unit of magneto motive force, also known as magnetic potential, was named Gilbert in his honour. His approach of careful observation and experimentation rather than the authoritative opinion or deductive philosophy of others had laid the very foundation for modern science.`,
        headingsList: [
          { id: "i", text: "Early years of Gilbert" },
          {
            id: "ii",
            text: "What was new about his scientific research method",
          },
          { id: "iii", text: "The development of chemistry" },
          { id: "iv", text: "Questioning traditional astronomy" },
          { id: "v", text: "	Pioneers of the early science" },
          { id: "vi", text: "Professional and social recognition" },
          {
            id: "vii",
            text: "Becoming the president of the Royal Science Society",
          },
          { id: "viii", text: "The great works of Gilbert" },
          { id: "ix", text: "	His discovery about magnetism" },
          { id: "x", text: "His change of focus" },
        ],
        paragraphQuestions: {
          A: 14,
          B: 15,
          C: 16,
          D: 17,
          E: 18,
          F: 19,
          G: 20,
        },
        questions: [
          {
            type: "headings",
            heading: "Questions 14–20",
            title:
              "Choose the correct heading for each paragraph from the list of headings below. Write the correct number i-x in boxes 14-20 on your answer sheet.",
            sub: "Reading Passage 2 has seven paragraphs A-G.",

            items: [
              { n: 14, label: "Paragraph A" },
              { n: 15, label: "Paragraph B" },
              { n: 16, label: "Paragraph C" },
              { n: 17, label: "Paragraph D" },
              { n: 18, label: "Paragraph E" },
              { n: 19, label: "Paragraph F" },
              { n: 20, label: "Paragraph G" },
            ],
          },
          {
            type: "tfng",
            heading: "Questions 21–23",
            title:
              "Do the following statements agree with the information given in Reading Passage 2?",
            sub: "In boxes on your answer sheet, write",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            optionLabels: {
              TRUE: "if the statement agrees with the information",
              FALSE: "if the statement contradicts the information",
              "NOT GIVEN": "if there is no information on this",
            },
            items: [
              {
                n: 21,
                text: "He is less famous than he should be.",
              },
              {
                n: 22,
                text: "He was famous as a doctor before he was employed by the Queen.",
              },
              {
                n: 23,
                text: "He lost faith in the medical theories of his time.",
              },
            ],
          },
          {
            type: "multiChoiceMCQ",
            heading: "Questions 24–26",
            title: "Write your answers in boxes 11-13 on your answer sheet.",
            sub: "Choose THREE letters A-F.",
            items: [
              {
                n: [24, 25, 26],
                q: "Which THREE of the following are parts of Gilbert’s discovery?",
                opts: [
                  "Metal can be transformed into another.",
                  "Garlic can remove magnetism.",
                  "Metals can be magnetised.",
                  "The earth wobbles on its axis.",
                  "There are two charges of electricity.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: 3,
        label: "Passage 3",
        title: "Yawning",
        subtitle:
          "How and why we yarn still presents problems for researchers in an area which has only recently been opened up to study",
        text: `When Robert R Provine began studying yawning in the 1960s, it was difficult for him to convince research students of the merits of 'yawning science1. Although it may appear quirky to some, Provine's decision to study yawning was a logical extension of his research in developmental neuroscience.

The verb 'to yawn' is derived from the Old English ganien or ginian, meaning to gape or open wide. But in addition to gaping jaws, yawning has significant features that are easy to observe and analyse. Provine 'collected' yawns to study by using a variation of the contagion response*. He asked people to 'think about yawning' and, once they began to yawn to depress a button and that would record from the start of the yawn to the exhalation at its end.

Provine's early discoveries can be summanized as follows: the yawn is highly stereotyped but not invariant in its duration and form. It is an excellent example of the instinctive 'fixed action pattern' of classical animal-behavior study, or ethology. It is not a reflex (short-duration, rapid, proportional response to a simple stimulus), but, once started, a yawn progresses with the inevitability of a sneeze. The standard yawn runs its course over about six seconds on average, but its duration can range from about three seconds to much longer than the average. There are no half-yawns: this is an example of the typical intensity of fixed action patterns and a reason why you cannot stifle yawns. Just like a cough, yawns can come in bouts with a highly variable inter-yawn interval, which is generally about 68 seconds but rarely more than 70. There is no relation between yawn frequency and duration: producers of short or long yawns do not compensate by yawning more or less often. Furthermore, Provine's hypotheses about the form and function of yawning can be tested by three informative yawn variants which can be used to look at the roles of the nose, the mouth and the jaws.

i) The closed nose yawn

Subjects are asked to pinch their nose closed when they feel themselves start to yawn. Most subjects report being able to perform perfectly normal closed nose yawns. This indicates that the inhalation at the onset of a yawn, and the exhalation at its end, need not involve the nostrils - the mouth provides a sufficient airway.

ii) The clenched teeth yawn

Subjects are asked to clench their teeth when they feel themselves start to yawn but allow themselves to inhale normally through their open lips and clenched teeth. This variant gives one the sensation of being stuck mid­yawn. This shows that gaping of the jaws is an essential component of the fixed action pattern of the yawn, and unless it is accomplished, the program (or pattern) will not run to completion. The yawn is also shown to be more than a deep breath, because, unlike normal breathing, inhalation and exhalation cannot be performed so well through the clenched teeth as through the nose.

iii) The nose yawn 

This variant tests the adequacy of the nasal airway to sustain a yawn. Unlike normal breathing, which can be performed equally well through mouth or nose, yawning is impossible via nasal inhalation alone. As with the clenched teeth yawn, the nose yawn provides the unfulfilling sensation of being stuck in mid-yawn. Exhalation, on the other hand, can be accomplished equally well through nose or mouth. Through thin methodology Provine demonstrated that inhalation through the oral airway and the gaping of jaws are necessary for normal yawns. The motor program for yawning will not run to completion without feedback that these parts of the program have been accomplished.

But yawning is a powerful, generalized movement that involves much more than airway maneuvres and jaw-gaping. When yawning you also stretch your facial muscles, tilt your head back, narrow or close your eyes, produce tears, salivate, open the Eustachian tubes of your middle ear and perform many other, yet unspecified, cardiovascular and respiratory acts. Perhaps the yawn shares components with other behaviour. For example, in the yawn a kind of 'slow sneeze1 or is the sneeze a 'fast yawn'? Both share common respiratory and other features including jaw gaping, eye closing and head tilting.

Yawning and stretching share properties and may be performed together as parts of a global motor complex. Studies by J I p deVries et al. in the early 1980s, charting movement in the developing foet US using ultrasound, observed a link between yawning and stretching. The most extraordinary demonstration of the yawn-stretch linkage occurs in many people paralyzed on one side of their body because of brain damage caused by a stroke, the prominent British neurologist Sir Francis Walshe noted in 1923 that when these people yawn, they are startled and mystified to observe that their otherwise paralyzed arm rises and flexes automatically in what neurologists term an 'associated response'. Yawning apparently activates undamaged, unconsciously controlled connections between the brain and the motor system, causing the paralyzed limb to move. It is not known whether the associated response is a positive prognosis for recovery, nor whether yawning is therapeutic for prevention of muscular deterioration.

Provine speculated that, in general, yawning may have many functions, and selecting a single function from the available options may be an unrealistic goal. Yawning appears to be associated with a change of behavioral state, switching from one activity to another. Yawning is also a reminder that ancient and unconscious behavior linking US to the animal world lurks beneath the veneer of culture, rationality and language.`,
        questions: [
          {
            type: "summary_complete",
            heading: "Questions 27–32",
            title:
              "Choose THREE WORDS AND/OR A NUMBER from the passage for each answer.",
            sub: "Complete the notes below.",
            themeTitle: "Provine's early findings on yawns",
            items: [
              {
                text: "Through his observation of yawns, Province was able to confirm that ",
              },
              { n: 27 },
              {
                text: " do not exist. Just like a ",
              },
              { n: 28 },
              {
                text: " , yawns cannot be interrupted after they have begun. This is because yawns occur as a ",
              },
              { n: 29 },
              {
                text: ", rather than a stimulus response as was previously thought. In measuring the time taken to yawn, provive found that a typical yawn lasts about ",
              },
              { n: 30 },
              {
                text: ".. He also found that it is a common for people to yawn a number of times in quick succession with the yawns usually being around  ",
              },
              { n: 31 },
              {
                text: "  apart. When studying whether length and rate were connected. Province concluded that people who yawn less do not necessarily produce ",
              },
              { n: 32 },
              {
                text: " to make up for this. ",
              },
            ],
          },
          {
            type: "mcq",
            heading: "Questions 33–37",
            title: "Choose the correct letter, A, B, C or D.",
            sub: "Write the correct letter in boxes on your answer sheet.",
            items: [
              {
                n: 33,
                text: "What did Provine conclude from his 'closed nose yawn1 experiment?",
                options: [
                  {
                    id: "A",
                    text: "Ending a yawn requires use of the nostrils.",
                  },
                  {
                    id: "B",
                    text: "You can yawn without breathing through your nose",
                  },
                  {
                    id: "C",
                    text: "Breathing through the nose produces a silent yawn.",
                  },
                  {
                    id: "D",
                    text: "The role of the nose in yawning needs further investigation.",
                  },
                ],
              },
              {
                n: 34,
                text: "Provine's clenched teeth yawn's experiment shows that?",
                options: [
                  {
                    id: "A",
                    text: "yawning is unconnected with fatigue.",
                  },
                  {
                    id: "B",
                    text: "a yawn is the equivalent of a deep intake of breath.",
                  },
                  {
                    id: "C",
                    text: "you have to be able to open your mouth wide to yawn.",
                  },
                  {
                    id: "D",
                    text: "breathing with the teeth together is as efficient as through the nose.",
                  },
                ],
              },
              {
                n: 35,
                text: "The nose yawn experiment was used to test weather yawning",
                options: [
                  {
                    id: "A",
                    text: "can be stopped after it has stated",
                  },
                  {
                    id: "B",
                    text: "is the result of motor programming",
                  },
                  {
                    id: "C",
                    text: "involves both inhalation and exhalation.",
                  },
                  {
                    id: "D",
                    text: "can be accomplished only through the nose.",
                  },
                ],
              },
              {
                n: 36,
                text: "In people paralyzed on one side because of brain damage",
                options: [
                  {
                    id: "A",
                    text: "yawning may involve only one side of the face.",
                  },
                  {
                    id: "B",
                    text: "the yawing response indicates that recovery is likely",
                  },
                  {
                    id: "C",
                    text: "movement in paralysed arm is stimulated by yawming",
                  },
                  {
                    id: "D",
                    text: "yawning can be used as an example to prevent muscle wasting.",
                  },
                ],
              },
              {
                n: 37,
                text: "In the last paragraph, the writer concludes that",
                options: [
                  {
                    id: "A",
                    text: "yawning is a sign of boredom.",
                  },
                  {
                    id: "B",
                    text: "we yawn is spite of the development of our species",
                  },
                  {
                    id: "C",
                    text: "yawning is a more passive activity than we Imagine",
                  },
                  {
                    id: "D",
                    text: "we are stimulated to yawn when our brain activity is low.",
                  },
                ],
              },
            ],
          },
          {
            type: "tfng",
            heading: "Questions 38–40",
            title:
              "Do the following statements agree with the claims of the writer in Reading Passage 3?",
            sub: "In boxes on your answer sheet, write",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            optionLabels: {
              YES: "if the statement agrees with the claims of the writer",
              NO: "if the statement contradicts the claims of the writer",
              "NOT GIVEN":
                "if it is impossible to say what the writer thinks about this",
            },
            items: [
              {
                n: 38,
                text: "Research students were initially reluctant to appreciate the value of Provine's",
              },
              {
                n: 39,
                text: "When foetuses yawn and stretch they are learning how to control movement.",
              },
              {
                n: 40,
                text: "According to Provine, referring to only one function is probably inadequate to explain why people yawn.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    type: "reading",
    priority: "demo",
    title: "Demo Reading test-2",
    answers: {
      1: "religious ceremonies",
      2: "fidelity",
      3: "two kisses",
      4: "400 years",
      5: "swine flu",
      6: "social contacts",
      7: "germs or bacteria",
      8: "TRUE",
      9: "FALSE",
      10: "NOT GIVEN",
      11: "TRUE",
      12: "TRUE",
      13: "FALSE",
      14: "D",
      15: "C",
      16: "G",
      17: "A",
      18: "H",
      19: "E",
      20: "A",
      21: "NOT GIVEN",
      22: "TRUE",
      23: "NOT GIVEN",
      24: "threat",
      25: "scientists",
      26: "sanctuaries",
      27: "C",
      28: "C",
      29: "NOT GIVEN",
      30: "FALSE",
      31: "TRUE",
      32: "TRUE",
      33: "NOT GIVEN",
      34: ["C", "E"],
      35: ["C", "E"],
      36: "COMPLEXITY",
      37: "EVOLUTION AND ECONOMICS",
      38: "COMPLEX ADAPTIVE SYSTEMS",
      39: "RANDOM GENETIC MUTATIONS",
      40: "PERMUTATIONS",
    },
    questions: [
      {
        id: 1,
        label: "Passage 1",
        title:
          "Why Do We Touch Strangers So Much? A History Of The Handshake Offers Clues",
        subtitle:
          "For thousands of years, the handshake has been used for different purposes. ",
        text: `There is a lot that can be conveyed in a handshake, a kiss, or a hug. Throughout history, such a greeting was used to signal friendship, finalize a business transaction, or indicate religious devotion. Touching strangers, however, can also transmit other, less beneficial shared outcomes—like disease outbreaks.
As fears about COVID-19, or coronavirus, mount, France has warned its citizens to pause their famous cheek kisses, and across the world, business deals are being sealed with an elbow bump. But with histories tracing back thousands of years, both greetings are likely too entrenched to be so easily halted.

A popular theory on the handshake’s origin is that it began as a gesture of peace. Grasping hands proved one was not holding a weapon—and shaking them was a way to ensure a partner had nothing hiding up their sleeve. So far, there has not been any reliable evidence to prove this assumption. Throughout the ancient world, the handshake appears on vases, gravestones, and stone slabs in scenes of weddings, gods making deals, young warriors departing for war, and the newly dead’s arrival to the afterlife. In the literary canon, it stretches to the Iliad and the Odyssey.

The handshake’s catch-all utility, used in friendship, romance, and business alike, makes interpretation difficult. “The handshake continues to be a popular image today because we too see it as a complex and ambiguous motif,” writes art historian Glenys Davies in an analysis of its use in classical art.

In America, it is likely that the handshake’s popularity was propelled by 18th century Quakers. In their efforts to eschew the hierarchy and social rank, they found the handshake a more democratic form of greeting to the then-common bow, curtsy, or hat doffing. “In their place, Quakers put the practice of the handshake, extended to everyone regardless of station, as we still do,” writes historian Michael Zuckerman.

There may be a scientific explanation for its lasting power. In a 2015 study, researchers in Israel filmed handshakes between hundreds of strangers and found nearly a quarter of participants sniffed their hands afterwards. They theorized that a handshake might be unconsciously used to detect chemical signals, and possibly as a means of communication—just as other animals do by smelling each other.

The kiss-as-greeting has a similarly rich history. It was incorporated into early Christianity and used in religious ceremonies. “In his Epistle to the Romans, St. Paul instructed followers to ‘salute one another with a holy kiss,’” writes Andy Scott in the book One Kiss or Two: In Search of the Perfect Greeting. In the Middle Ages, a kiss was used as a sign of fidelity and to seal agreements like property transfers.

Today, a swift kiss on the cheek known in French as “la bise,” is a standard greeting in much of the world. The word may have originated with the Romans, who had a different term for each type of kiss and called the polite version “basium.” In Paris, two kisses are common. In Provence expect three, and four is the norm in the Loire Valley. The cheek kiss is also common in countries like Egypt, where three kisses is customary, Latin America, and the Philippines. It is thought that during the plague in the 14th century, la bise may have stopped and was not revived again until 400 years later, after the French Revolution. In 2009, la bise was temporarily paused as swine flu became a concern. At the end of February, the French Health Minister advised against it as the coronavirus cases increased. “The reduction in social contacts of a physical nature is advised,” he said. “That includes the practice of the bise.”

In her book Don’t Look, Don’t Touch, behavioural scientist Val Curtis of the London School of Hygiene and Tropical Medicine, says that one possible reason for the kiss and handshake as a greeting is to signify that the other person is trusted enough to share germs with. Because of this, the practice can go in and out of style depending on public health concerns.

In a 1929 study, a nurse named Leila Given wrote an article in the American Journal of Nursing lamenting the loss of the last generation’s “finger-tipping and the high handshake” customs in favour of a handshake. She warned that hands “are agents of bacterial transfer” and cited early studies showing that a handshake could easily spread germs. In conclusion, she recommended that Americans adopt the Chinese custom at the time of shaking one’s own hands together when greeting a friend. “At least our bacteria would then stay at home,” she wrote.`,
        questions: [
          {
            type: "short",
            heading: "Questions 1–7",
            title: "Answer the questions below.",
            sub: "Choose no more than THREE WORDS AND/OR A NUMBER from the passage for each answer.",
            bulletPoint: true,
            questionTitle: "The history of cheek kissing",
            items: [
              {
                n: 1,
                text: "In the past, Christian used cheek kisses in",
              },
              {
                n: 2,
                text: "In the Middle Age, the kiss-as-greeting was used to show",
                afterText: "or used in making agreements",
              },
              {
                n: 3,
                text: "It is common for people in Paris to exchange",
              },
              {
                n: 4,
                text: "People believe that in the 14th century, the cheek kiss might have been paused and it remained so for",
              },
              {
                n: 5,
                text: "In 2009, due to",
                afterText: "cheek kisses were also stopped for a while.",
              },
              {
                n: 6,
                text: "What did French Health Minister advise people to avoid to prevent the spread of coronavirus?",
              },
              {
                n: 7,
                text: "What can be transferred from a handshake?",
              },
            ],
          },
          {
            type: "tfng",
            heading: "Questions 8–13",
            title:
              "Do the following statements agree with the information given in Reading Passage 1?",
            sub: "In boxes on your answer sheet, write",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            optionLabels: {
              TRUE: "if the statement agrees with the information",
              FALSE: "if the statement contradicts the information",
              "NOT GIVEN": "if there is no information on this",
            },
            items: [
              {
                n: 8,
                text: "Shaking hands is an indicator of hospitality.",
              },
              {
                n: 9,
                text: "Evidence showed that the handshake started as a sign of peace.",
              },
              {
                n: 10,
                text: "When shaking hands, people often rolled up their sleeves.",
              },
              {
                n: 11,
                text: "The use of a handshake in different situations can be unpredictable.",
              },
              {
                n: 12,
                text: "In America, handshakes became prevalent because they represented equality and freedom.",
              },
              {
                n: 13,
                text: "A research conducted in 2015 showed that exactly 25% of participants smelled their hands after a handshake.",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        label: "Passage 2",
        title: "Chinstrap Penguin Population In The Last 50 Years",
        subtitle: "",
        text: `
A

The chinstrap penguin has a cap of black plumage, a white face, and a continuous band of black feathers extending from one side of the head to the other, the “chinstrap.” The northern part of the Antarctic Peninsula, several Antarctic and subantarctic islands, and the uninhabited Balleny Islands between Antarctica and New Zealand are the habitats of the species.

B

Antarctic penguin colonies in some parts of the Antarctic have declined over the last 50 years, mostly because of climate change, researchers say. The colonies of chinstrap penguins, also known as ringed or bearded penguins, have dramatically dropped since they were last surveyed almost 50 years ago, scientists discovered. The findings became surprising because, until now, the chinstraps have been deemed of “least concern” by the International Union for Conservation of Nature (IUCN). “We really didn’t know what to expect, and then we found this huge decline on Elephant Island,” Noah Strycker, an ornithologist and penguin researcher at Stony Brook University, told CNN from Greenpeace’s Esperanza ship in the Antarctic. “It’s a little bit worrying as it means that something is shifting in the ecosystem and the fall in penguin numbers is reflecting that shift.”

C

Every colony of Elephant Island, which is a crucial penguin habitat northeast of the Antarctic Peninsula, when surveyed, experienced a population fall, as per the independent researchers who joined a Greenpeace expedition to the region. Elephant Island was last surveyed in 1971, and there were 122,550 pairs of penguins across all colonies. However, the recent count revealed just 52,786 pairs with a drop of almost 60%. On Elephant Island, the size of the population change varied from colony to colony, and the most significant decline was recorded at a colony known as Chinstrap Camp, which is 77%.

D

Just the days after temperatures hit an all-time high in the Antarctic with 18.3 Celsius (64.94 Fahrenheit) recorded on February 6, the latest study is published. The previous high 17.5 C (63.5 F) was recorded in March 2015. Scientists recorded the temperature at Argentina’s Esperanza research station, according to the meteorological agency of the country.

E

The reduced sea ice and warmer oceans due to climate change have led to less krill, the main component of the penguins’ diet. “Climate change is probably the underlying factor, and the effects are rippling through the food chain,” Strycker said. “Penguins, seals, and whales all depend on krill, which depends on ice. So if climate change affects the ice, that impacts on everything else.” Heather J. Lynch, associate professor of ecology and evolution at New York’s Stony Brook University and one of the expedition’s research leads, said: “Such significant declines in penguin numbers suggest that the Southern Ocean’s ecosystem has fundamentally changed in the last 50 years and that the impacts of this are rippling up the food web to species like chinstrap penguins.” She added that “while several factors may have a role to play, all the evidence we have pointed to climate change as being responsible for the changes we are seeing.”

F

However, some good news was also there, as the researchers reported an increase in gentoo penguins population in neighbouring colonies, beyond Elephant Island. “It’s interesting, as a tale of two penguins on the Antarctic Peninsula,” said Strycker. “Gentoo is a species from further north and they appear to be colonizing the area and are actually increasing in numbers.”

G

The Greenpeace ship Esperanza has been documenting the threat to the oceans worldwide and taking the scientists for travelling abroad. For the first time, the Low Island in the South Shetland Islands, north of the Antarctic Peninsula, has been surveyed properly. The manual and drone techniques are used by the researchers, from Stony Brook and Northeastern University in Boston, to survey a series of significant but relatively unknown colonies of chinstrap penguin here. The results are, however, not yet available. Greenpeace has been campaigning for the three Antarctic sanctuaries that it would establish to offer protection to many of the colonies surveyed. These would be off-limits to humans.

H

Louisa Casson, Greenpeace Oceans Campaigner, said in a statement: “Penguins are an iconic species, but this new research shows how the climate emergency is decimating their numbers and having far-reaching impacts on wildlife in the most remote corners of Earth. This is a critical year for our oceans. “Governments must respond to the science and agree on a strong Global Ocean Treaty at the United Nations this spring that can create a network of ocean sanctuaries to protect marine life and help these creatures adapt to our rapidly changing climate.”`,
        questions: [
          {
            type: "matrix_match",
            heading: "Questions 14–20",
            title: "Reading Passage 2 has eight paragraphs, A–H.",
            sub: "Which paragraph contains the following information?",
            note: "NB You may use any letter more than once.",
            optionsList: {
              heading: "List of Mapmakers",
              optionHide: true,
              options: [
                { id: "A" },
                { id: "B" },
                { id: "C" },
                { id: "D" },
                { id: "E" },
                { id: "F" },
                { id: "G" },
                { id: "H" },
              ],
            },
            items: [
              {
                n: 14,
                text: "the highest temperatures ever recorded in Antarctica.",
              },
              {
                n: 15,
                text: "the difference between current and past records on penguin population.",
              },
              { n: 16, text: "places where people cannot go to." },
              { n: 17, text: "places where chinstrap penguins live." },
              { n: 18, text: "measures to protect ocean species." },
              {
                n: 19,
                text: "factors contributing to the decline in the amount of food available.",
              },
              {
                n: 20,
                text: "description of a specific species expanding its territory.",
              },
            ],
          },
          {
            type: "tfng",
            heading: "Questions 21–23",
            title:
              "Do the following statements agree with the information in the text?",
            sub: "Choose TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            optionLabels: {
              TRUE: "if the statement agrees with the information",
              FALSE: "if the statement contradicts the information",
              "NOT GIVEN": "if there is no information on this",
            },
            items: [
              {
                n: 21,
                text: "The IUCN showed little concern about the fall in penguin numbers.",
              },
              {
                n: 22,
                text: "Climate change is a reason for the changes in the food chain of chinstrap penguins.",
              },
              {
                n: 23,
                text: "Gentoo penguins are not affected by climate change.",
              },
            ],
          },
          {
            type: "short",
            heading: "Questions 24–26",
            title: "Answer the questions below.",
            sub: "Choose no more than THREE WORDS AND/OR A NUMBER from the passage for each answer.",
            bulletPoint: true,
            questionTitle: "The Greenpeace ship has been used to : ",
            items: [
              {
                n: 24,
                text: "record the",
                afterText: "to marine life over the world.",
              },
              { n: 25, text: "carry the", afterText: "overseas." },
              {
                n: 26,
                text: "Build",
                afterText: "to protect many surveyed colonies.",
              },
            ],
          },
        ],
      },
      {
        id: 3,
        label: "Passage 3",
        title: "Economic Evolution",
        subtitle: "",
        text: `{A} Living along the Orinoco River that borders Brazil and Venezuela are the Yanomami people, hunter-gatherers whose average annual income has been estimated at the equivalent of $90 per person per year. Living along the Hudson River that borders New York State and New Jersey are the Manhattan people, consumer traders whose average annual income has been estimated at $36,000 per person per year. That dramatic difference of 400 times, however, pales in comparison to the differences in Stock Keeping Units (SKUs, a measure of the number of types of retail products available), which has been estimated at 300 for the Yanomami and 10 billion for the Manhattans, a difference of 33 million times.

{B} How did this happen? According to economist Eric D. Beinhocker, who published these calculations in his revelatory work The Origin of Wealth (Harvard Business School Press, 2006), the explanation is to be found in complexity theory. Evolution and economics are not just analogous to each other, but they are actually two forms of a larger phenomenon called complex adaptive systems, in which individual elements, parts or agents interact, then process information and adapt their behaviour to changing conditions. Immune systems, ecosystems, language, the law and the Internet are all examples of complex adaptive systems.

{C} In biological evolution, nature selects from the variation produced by random genetic mutations and the mixing of parental genes. Out of that process of cumulative selection emerges complexity and diversity. In economic evolution, our material economy proceeds through the production and selection of numerous permutations of countless products. Those 10 billion products in the Manhattan village represent only those variations that made it to market, after which there is a cumulative selection by consumers in the marketplace for those deemed most useful: VHS over Betamax, DVDs over VHS, CDs over vinyl records, flip phones over brick phones, computers over typewriters, Google over Altavista, SUVs over station wagons, paper books over e-books (still), and Internet news over network news (soon). Those that are purchased “survive” and “reproduce” into the future through repetitive use and remanufacturing.

{D} As with living organisms and ecosystems, the economy looks designed—so just as Humans naturally deduce the existence of a top-down intelligent designer, humans also (understandably) infer that a top-down government designer is needed in nearly every aspect of the economy. But just as living organisms are shaped from the bottom up by natural selection, the economy is moulded from the bottom up by the invisible hand. The correspondence between evolution and economics is not perfect, because some top-down institutional rules and laws are needed to provide a structure within which free and fair trade can occur. But too much top-down interference into the marketplace makes trade neither free nor fair. When such attempts have been made in the past, they have failed—because markets are far too complex, interactive and autocatalytic to be designed from the top down. In his 1922 book, Socialism, Ludwig Von Mises spelt out the reasons why most notably the problem of “economic calculation” in a planned socialist economy. In capitalism, prices are in constant and rapid flux and are determined from below by individuals freely exchanging in the marketplace. Money is a means of exchange, and prices are the information people use to guide their choices. Von Mises demonstrated that socialist economies depend on capitalist economies to determine what prices should be assigned to goods and services. And they do so cumbersomely and inefficiently. Relatively free markets are, ultimately, the only way to find out what buyers are willing to pay and what sellers are willing to accept.

{E} Economics helps to explain how Yanomami-like hunter-gatherers evolved into Manhattan-like consumer traders. In the Nineteenth century French economist Frédéric Bastiat well captured the principle: “Where goods do not cross frontiers, armies will.” In addition to being fierce warriors, the Yanomami are also sophisticated traders, and the more they trade the less they fight. The reason is that trade is a powerful social adhesive that creates political alliances. One village cannot go to another village and announce that they are worried about being conquered by a third, more powerful village—that would reveal weakness. Instead, they mask the real motives for alliance through trade and reciprocal feasting. And, as a result, not only gain military protection but also initiate a system of trade that—in the long run—leads to an increase in both wealth and SKUs. 

{F} Free and fair trade occurs in societies where most individuals interact in ways that provide mutual benefit. The necessary rules weren’t generated by wise men in a sacred temple or lawmakers in congress, but rather evolved over generations and were widely accepted and practised before the law was ever written. Laws that fail this test are ignored. If enforcement becomes too onerous, there is rebellion. Yet the concept that human interaction must, and can be controlled by a higher force is universal. Interestingly, there is no widespread agreement on who the “higher force” is. Religious people ascribe good behaviour to God’s law. They cannot conceive of an orderly society of atheists. Secular people credit the government. They consider anarchy to be synonymous with barbarity. Everyone seems to agree on the concept that an orderly society requires an omnipotent force. Yet, everywhere there is evidence that this is not so. An important distinction between spontaneous social order and social anarchy is that the former is developed by work and investment, under the rule of law and with a set of evolved morals while the latter is chaos. The classical liberal tradition of von Mises and Hayek never makes the claim that the complete absence of top-down rules leads to the optimal social order. It simply says we should be sceptical about our ability to manage them in the name of social justice, equality, or progress.`,
        questions: [
          {
            type: "mcq",
            heading: "Questions 27–28",
            title: "Choose the correct letter, A, B, C or D.",
            items: [
              {
                n: 27,
                text: "What ought to play a vital role in each field of the economy?",
                options: [
                  { id: "A", text: "A strict rule." },
                  { id: "B", text: "A smart strategy." },
                  { id: "C", text: "A tightly managed authority." },
                  { id: "D", text: "A powerful legislation." },
                ],
              },
              {
                n: 28,
                text: "According to the passage, what happens when governments try to control the economy too much?",
                options: [
                  {
                    id: "A",
                    text: "It creates a fairer and more equal society for all citizens.",
                  },
                  {
                    id: "B",
                    text: "It always leads to military conflicts between nations.",
                  },
                  {
                    id: "C",
                    text: "It fails because markets are too complex to be designed from the top down.",
                  },
                  {
                    id: "D",
                    text: "It encourages more trade between individuals in the marketplace.",
                  },
                ],
              },
            ],
          },
          {
            type: "tfng",
            heading: "Questions 36–40",
            title:
              "Do the following statements agree with the claims of the writer in Reading Passage 3?",
            sub: "In boxes on your answer sheet, write",
            options: ["YES", "NO", "NOT GIVEN"],
            optionLabels: {
              YES: "if the statement agrees with the claims of the writer",
              NO: "if the statement contradicts the claims of the writer",
              "NOT GIVEN":
                "if it is impossible to say what the writer thinks about this",
            },
            items: [
              {
                n: 29,
                text: "SKUs is a more precise measurement to demonstrate the economic level of a community.",
              },
              {
                n: 30,
                text: "No concrete examples are presented when the author makes the statement concerning economic evolution.",
              },
              {
                n: 31,
                text: "Evolution and economics show a defective homolog.",
              },
              {
                n: 32,
                text: "Martial actions might be taken to cross the borders if trades do not work.",
              },
              {
                n: 33,
                text: "Profit is the invisible hand to guide the market.",
              },
            ],
          },
          {
            type: "multiChoiceMCQ",
            heading: "Questions 34–35",
            title: "Write your answers in boxes 34-35 on your answer sheet.",
            sub: "Choose THREE letters A-F.",
            items: [
              {
                n: [34, 35],
                q: "Which two of the following tools are used to pretend to ask for union according to one explanation from the perspective of economics ",
                opts: [
                  "an official announcement",
                  "a diplomatic event",
                  "the exchange of goods",
                  "certainly written correspondence",
                  "some enjoyable treatment in a win-win situation",
                ],
              },
            ],
          },
          {
            type: "summary_complete",
            heading: "Questions 36–40",
            title:
              "Complete the following summary of the paragraphs of Reading Passage",
            sub: "Choose no more than THREE WORDS AND/OR A NUMBER from the passage for each answer.",
            items: [
              {
                text: "In response to the search for reasons for the phenomenon shown by the huge difference in the income between two groups of people both dwelling near the rivers, several researchers made their effort and gave certain explanations. One attributes ",
              },
              { n: 36 },
              {
                text: " to the interesting change claiming that it is not as simple as it seems to be in appearance that the relationship between ",
              },
              { n: 37 },
              { text: " which is a good example of " },
              { n: 38 },
              {
                text: ", which involved in the interaction of separate factors for the processing of information as well as the behavioural adaptation to unstable conditions. As far as the biological transformation is concerned, both ",
              },
              { n: 39 },
              {
                text: " and the blend of genres from the last generation brings about the difference. The economic counterpart shows how generating and choosing the ",
              },
              { n: 40 },
              {
                text: " of innumerable goods moves forward the material-oriented economy.",
              },
            ],
          },
          ,
        ],
      },
    ],
  },
  {
    id: 3,
    type: "reading",
    priority: "demo",
    title: "Demo Reading test-3",
    answers: {
      1: "NOT GIVEN",
      2: "NOT GIVEN",
      3: "TRUE",
      4: "NOT GIVEN",
      5: "FALSE",
      6: "ACQUIRED",
      7: "DIFFERENTIATE",
      8: "GOOD",
      9: "AROMA",
      10: "SEASONINGS",
      11: "FLAVOUR",
      12: "INDELIBLE",
      13: "CHEMICAL AROMAS",
      14: "D",
      15: "G",
      16: "E",
      17: "A",
      18: "G",
      19: "FALSE",
      20: "TRUE",
      21: "TRUE",
      22: "NOT GIVEN",
      23: "the military",
      24: "high density",
      25: "self-sharpening",
      26: "chemical toxicity",
      27: "FALSE",
      28: "TRUE",
      29: "FALSE",
      30: "TRUE",
      31: "NOT GIVEN",
      32: "FALSE",
      33: "seeds",
      34: "shells",
      35: "fish",
      36: "canals",
      37: "maize",
      38: "cotton",
      39: "flotation",
      40: "shellfish",
    },
    questions: [
      {
        id: 1,
        label: "Passage 1",
        title: "The sense of flavour 2",
        subtitle:
          "For thousands of years, the handshake has been used for different purposes. ",
        text: `{A} Scientists now believe that human beings acquired the sense of taste as a way to avoid being poisoned. Edible plants generally taste sweet; deadly ones, bitter. Taste is supposed to help us differentiate food that’s good for us from food that’s not. The taste buds on our tongues can detect the presence of half a dozen or so basic tastes, including sweet, sour, bitter, salty, and umami (a taste discovered by Japanese researchers, a rich and full sense of deliciousness triggered by amino acids in foods such as shellfish, mushrooms, potatoes, and seaweed). Tastebuds offers a limited means of detection, however, compared with the human olfactory system, which can perceive thousands of different chemical aromas. Indeed, ‘flavor’ is primarily the smell of gases being released by the chemicals you’ve just put in your mouth. The aroma of food can be responsible for as much as 90% of its flavor.

{B} The act of drinking, sucking or chewing a substance releases its volatile gases. They flow out of the mouth and up the nostrils, or up the passageway at the back of the mouth, to a thin layer of nerve cells called the olfactory epithelium, located at the base of the nose, right between the eyes. The brain combines the complex smell signals from the epithelium with the simple taste signals from the tongue, assigns a flavor to what’s in your mouth, and decides if it’s something you want to eat.

{C} Babies like sweet tastes and reject bitter ones; we know this because scientists have rubbed various flavors inside the mouths of infants and then recorded their facial reactions. A person’s food preferences, like his or her personality, are formed during the first few years of life, through a process of socialization. Toddlers can learn to enjoy hot and spicy food, bland health food, or fast food, depending upon what the people around them eat. The human sense of smell is still not fully understood. It is greatly affected by psychological factors and expectations. The mind filters out the overwhelming majority of chemical aromas that surround us, focusing intently on some, ignoring others. People can grow accustomed to bad smells or good smells; they stop noticing what once seemed overpowering.

{D} Aroma and memory are somehow inextricably linked. A smell can suddenly evoke a long-forgotten moment. The flavours of childhood foods seem to leave an indelible mark, and adults often return to them, without always knowing why. These ‘comfort foods’ become a source of pleasure and reassurance a fact that fast-food chains work hard to promote Childhood memories of Happy Meals can translate into frequent adult visits to McDonald’s’, like those of the chain’s ‘heavy users’, the customers who eat there four or five times a week.

{E} The human craving for flavour has been a large unacknowledged and unexamined force in history. Royal empires have been built, unexplored lands have been traversed, great religions and philosophies have been forever changed by the spice trade. In 1492, Christopher Columbus set sail in order to try to find new seasonings and thus to make his fortune with this most desired commodity of that time. Today, the influence of flavour in the world marketplace is no less decisive. The rise and fall of corporate empires – soft-drink companies, snack-food companies, and fast-food chains – is frequently determined by how their products taste.

{F} The flavor industry emerged in the mid-1800s, as processed foods began to be manufactured on a large scale. Recognizing the need for flavor additives, the early food processors turned to perfume companies that had years of experience working with essential oils and volatile aromas. The great perfume houses of England, France, and the Netherlands produced many of the first flavor compounds. In the early part of the 20th century, Germany’s powerful chemical industry assumed the lead in flavour production. Legend has it that a German scientist discovered methyl anthranilate, one of the first artificial flavours, by accident while mixing chemicals in his laboratory. Suddenly, the lab was filled with the sweet smell of grapes. Methyl anthranilate later became the chief flavoring compound of manufactured grape juice.

{G} The quality that people seek most of all in a food, its flavour, is usually present in a quantity too infinitesimal to be measured by any traditional culinary terms such as ounces or teaspoons. Today’s sophisticated spectrometers, gas chromatograph, and headspace vapor analyzers provide a detailed map of a food’s flavour components, detecting chemical aromas in amounts as low as one part per billion. The human nose, however, is still more sensitive than any machine yet invented. A nose can detect aromas present in quantities of a few parts per trillion. Complex aromas, such as those of coffee or roasted meat, may be composed of gases from nearly a thousand different chemicals. The chemical that provides the dominant flavour of bell pepper can be tasted in amounts as low as 0.02 parts per billion; one drop is sufficient to add flavour to the amount of water needed to fill five average-sized swimming pools

  `,
        questions: [
          {
            type: "tfng",
            heading: "Questions 1–5",
            title:
              "Do the following statements agree with the information given in Reading Passage 1?",
            sub: "In boxes on your answer sheet, write",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            optionLabels: {
              TRUE: "if the statement agrees with the information",
              FALSE: "if the statement contradicts the information",
              "NOT GIVEN": "if there is no information on this",
            },
            items: [
              {
                n: 1,
                text: "The brain determines which aromas we are aware of.",
              },
              {
                n: 2,
                text: "The sense of taste is as efficient as the sense of smell.",
              },
              {
                n: 3,
                text: "Personal tastes in food are developed in infancy.",
              },
              {
                n: 4,
                text: "Christopher Columbus found many different spices on his travels. ",
              },
              {
                n: 5,
                text: "In the mid-1880s, man-made flavors were originally invented on purpose.",
              },
            ],
          },
          {
            type: "summary_complete",
            heading: "Questions 6–11",
            sub: "Choose ONE WORD from the passage for each answer.",
            title: "Write your answers in boxes 6 – 11 on your answer sheet",
            items: [
              {
                text: " It is thought that the sense of taste was ",
              },
              { n: 6 },
              {
                text: " in order to ",
              },
              { n: 7 },
              {
                text: " the foods which are harmless to us from those that are not ",
              },
              { n: 8 },
              {
                text: ".  The sense of smell, which gives us the flavour we detect in our food, helps us to take pleasure in our food. Indeed this ",
              },
              { n: 9 },
              {
                text: " for flavour was, in the past, the reason why so many explorers ventured to distant lands to bring back new ",
              },
              { n: 10 },
              {
                text: " .which were greatly sought after in Europe. Here they were used in cooking to enhance the usual ",
              },
              { n: 11 },
              {
                text: " and unappetizing dishes eaten by rich and poor alike. ",
              },
            ],
          },
          {
            type: "short",
            heading: "Questions 12–13",
            title: "Answer the questions below.",
            sub: "Choose no more than TWO WORDS AND/OR A NUMBER from the passage for each answer.",
            bulletPoint: true,
            items: [
              {
                n: 12,
                text: "We associate certain smells with the past as they are",
              },
              {
                n: 13,
                text: "Modern technology is able to help determine the minute quantities of",
                afterText: "found in food.",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        label: "Passage 2",
        title: "Chinstrap Penguin Population In The Last 50 Years",
        subtitle: "",
        text: `
A

Could the mystery over how depleted uranium might cause genetic damage be closer to being solved? It may be, if a controversial claim by two researchers is right. They say that minute quantities of the material lodged in the body may kick out energetic electrons that mimic the effect of beta radiation. This, they argue, could explain how residues of depleted uranium scattered across former war zones could be increasing the risk of cancers and other problems among soldiers and local people.

B

Depleted uranium is highly valued by the military, who use it in the tips of armour­piercing weapons. The material’s high density and self-sharpening properties help it to penetrate the armour of enemy tanks and bunkers. Its use in conflicts has risen sharply in recent years. The UN Environment Programme (UNEP) estimates that shells containing 1700 tonnes of the material were fired during the 2003 Iraq war. Some researchers and campaigners are convinced that depleted uranium left in the people exposed to it. Governments and the military disagree, and point out that there is no conclusive epidemiological evidence for this. And while they acknowledge that the material is weakly radioactive, they say this effect is too small to explain the genetic damage at the levels seen in war veterans and civilians.

C

Organisations such as the UK’s Royal Society, the US Department of Veterans Affairs and UNEP have called for more comprehensive epidemiological studies to clarify the link between depleted uranium and any ill effects. Meanwhile, various test­tube and animal studies have suggested that depleted uranium may increase the risk of cancer, according to a review of the scientific literature published in May 2008 by the US National Research Council. The authors of the NRC report argue that more long-term and quantitative research is needed on the effects of uranium’s chemical toxicity. They say the science seems to support the theory that genetic damage might be occurring because uranium’s chemical toxicity and weak radioactivity could somehow reinforce each other, though no one knows what the mechanism for this might be.

D

Now two researchers, Chris Busby and Ewald Schnug, have a new theory that they say explains how depleted uranium could cause genetic damage. Their theory invokes a well-known process called the photoelectric effect. This is the main mechanism by which gamma photons with energies of about 100 kiloelectronvolts (keV) or less are blocked by matter: the photon transfers its energy to an electron in the atom’s electron cloud, which is ejected into the surroundings.

An atom’s ability to stop photons by this mechanism depends on the fourth power of its atomic number - the number of protons in its nucleus - so heavy elements are far better at intercepting gamma radiation and X-rays than light elements. This means that uranium could be especially effective at capturing photons and kicking out damaging photoelectrons: with an atomic number of 92, uranium blocks low-energy gamma photons over 450 times as effectively as the lighter element calcium, for instance.

E

Busby and Schnug say that previous risk models have ignored this well-established physical effect. They claim that depleted uranium could be kicking out photoelectrons in the body’s most vulnerable spots. Various studies have shown that dissolved uranium - ingested in food or water, for example - is liable to attach to DNA strands within cells, because uranium binds strongly to DNA phosphate. “Photoelectrons from uranium are therefore likely to be emitted precisely where they will cause most damage to genetic material,” says Busby.

F

Busby and Schnug base their claim on calculations of the photoelectrons that would be produced by the interation between normal background levels of gamma radiation and uranium in the body. “Our detailed calculations indicate that the phantom photoelectrons are the predominant effect by far for uranium genome toxicity, and that uranium could be 1500 times as powerful as an emitter of photoelectrons than as an alpha emitter.” Their computer modelling results are described in a peer-reviewed paper to be published in this month by the IPNSS in a book called Loads and Fate of Fertiliser Derived Uranium.

G

Hans-Georg Menzel, who chairs the International Commission on Radiological Protection’s committee on radiation doses, acknowledges that the theory should be considered, but he doubts that it will prove significant. He suspects that under normal background radiation the effect is too weak to inflict many of the “double hits” of energy that are known to be most damaging to cells. “It is very unlikely that individual cells would be subject to two or more closely spaced photoelectron impacts under normal background gamma irradiation,” he says. Despite his doubts, Menzel raised the issue last week with his committee in St Petersburg, Russia, and says that several colleagues “intended to collect relevant data and perform calculations to check whether there was any possibility of a real effect in living tissues”. Organisations in the UK, including the Ministry of Defence and the Health Protection Agency, say they have no plans to investigate Busby’s hypothesis.

H

Radiation biophysicist Mark Hill of the University of Oxford would like to see a fuller investigation, though he suggests this might show that the photoelectric effect is not as powerful as Busby claims. “We really need more detailed calculations and dose estimates for realistic situations with and without uranium present,” he says. Hill’s doubts centre on an effect called Compton scattering, which he believes needs to be factored into any calculations. With Compton scattering, uranium is only 4.5 times as effective as calcium at stopping gamma photons, so Hill says that taking it into account would reduce the relative importance of uranium as an emitter of secondary electrons. If he is right, this would dilute the mechanism proposed by Busby and Schnug.

I

The arguments over depleted uranium are likely to continue, whatever the outcome of these experiments. Whether Busby’s theory holds up or not remains to be seen, but investigating it can only help to clear up some of the doubts about this mysterious substance.
`,
        questions: [
          {
            type: "matrix_match",
            heading: "Questions 14–18",
            title: "Reading Passage 2 paragraphs, A–I.",
            sub: "Which paragraph contains the following information?",
            note: "NB You may use any letter more than once.",
            optionsList: {
              heading: "List of Mapmakers",
              optionHide: true,
              options: [
                { id: "A" },
                { id: "B" },
                { id: "C" },
                { id: "D" },
                { id: "E" },
                { id: "F" },
                { id: "G" },
                { id: "H" },
                { id: "I" },
              ],
            },
            items: [
              {
                n: 14,
                text: "a famous process is given relating to the new theory.",
              },
              {
                n: 15,
                text: "a person who acknowledges but suspects the theory.",
              },
              { n: 16, text: "the explanation of damage to DNA" },
              {
                n: 17,
                text: "a debatable and short explanation of the way creating the problems of soldiers.",
              },
              {
                n: 18,
                text: "Busby’s hypothesis is not in the investigation plans of organizations.",
              },
            ],
          },

          {
            type: "tfng",
            heading: "Questions 19–22",
            title:
              "Do the following statements agree with the information in the text?",
            sub: "Choose TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            optionLabels: {
              TRUE: "if the statement agrees with the information",
              FALSE: "if the statement contradicts the information",
              "NOT GIVEN": "if there is no information on this",
            },
            items: [
              {
                n: 19,
                text: "All people believe that depleted uranium is harmful to people’s health.",
              },
              {
                n: 20,
                text: "Heavier elements can perform better at preventing X-rays and gamma radiation.",
              },
              {
                n: 21,
                text: "By particular calculations, it is known that the main effect of uranium genome toxicity is phantom photoelectrons.",
              },
              {
                n: 22,
                text: "Most scientists support Mark Hill’s opinion.",
              },
            ],
          },
          {
            type: "summary_complete",
            heading: "Questions 23–26",
            sub: "Choose ONE WORD from the passage for each answer.",
            title: "Write your answers in boxes 23 – 26 on your answer sheet",
            items: [
              { n: 23 },
              {
                text: " attaches importance to depleted uranium due to its ",
              },
              { n: 24 },
              {
                text: " and  ",
              },
              { n: 25 },
              {
                text: " features, which are helpful in the war. However, it has ill effects in people, and then causes organisations’ appeal to do more relative studies. According to some scientists, we should do research about the impact of uranium’s ",
              },
              { n: 26 },
              {
                text: " which may be enhanced with weak radioactivity. ",
              },
            ],
          },
        ],
      },
      {
        id: 3,
        label: "Passage 3",
        title: "Caral: an ancient South American city",
        subtitle: "",
        text: `Huge earth and rock mounds rise out of the desert of the Supe Valley near the coast of Peru in South America. These immense mounds appear simply to be part of the geographical landscape in this arid region squeezed between the Pacific Ocean and the Andes mountains.But looks deceive. These are actually human-made pyramids strong evidence indicates they are the remains of a city known as Caral that flourished nearly 5,000 years ago. It true, it would be the oldest known urban center in the America and among the most ancient in the world.

Research undertaken by Peruvian archaeologist Ruth Shady suggests that the 150-acre plex of pyramids, plazas and residential buildings was a thriving metropolis when Egypt's great pyramids were still being built. Though discovered in 1905, for years Caral attracted little attention, largely because archaeologists believed the structures were rainy recent. But the monumental scale of the pyramids had long interested Shady, who began excavations at the site in 1996, about 22 kilometers from the coast and 190 kilometers north of Peru's capital city of Lima.

Shady and her crew searched for broken remains of the pots and containers that most such sites contain. Not finding any only made her more excited: it meant Caral could be what archaeologists term pre-ceramic, that is, existing before the advent in the area of pot-firing techniques. Shady's team undertook the task of excavating Piramide Mayor, the largest of the pyramids. After carefully clearing away many hundreds of years' worth of rubble and sand, they identified staircases, walls covered with remnants of colored plaster, and brickwork. In the foundations, they found the remains of grass-like reeds woven into bags. The original workers, she surmised, must have filled these bags with stones from a nearby quarry and laid them atop one another inside retaining walls, gradually giving rise to the pyramid's immense structure. Shady had samples of the reeds subjected to radiocarbon dating and found that the reeds were 4,600 years old. This evidence indicated that Caral was, in fact, more than 1,000 years older than what had previously been thought to be the oldest urban center in the Americas.

What amazed archaeologists was not just the age, but the complexity and scope of Caral. Piramide Mayor alone covers an area nearly the size of four football fields and is 18 meters tall. A nine-meter-wide staircase rises from a circular plaza at the foot of the pyramid, passing over three terraced levels until it reaches the top. Thousands of manual laborers would have been needed to build such a project, not counting the many architects, craftsmen, and managers. Shady's team found the remains of a large amphitheater, containing almost 70 musical instruments made of bird and deer bones Clearly music plaved an important role in Caral's society. Around the perimeter of Caral are a series of smaller mounds and various buildings. These indicate a hierarchy of living arrangements: large, well-kept rooms atop pyramids for the elite, ground-level quarters for shabbier outlying dwellings for workers

But why had Caral been built in the first place? Her excavations convinced Shady that Caral once served as a trade center for the region, which extends from the rainforests of the Amazon to the high forests of the Andes. Shady found evidence of a rich trading environment, including seeds of the cocoa bush and necklaces of shells, neither of which was native to the immediate Caral area. This environment gave rise to people who did not take part in the production of food, allowing them to become priests and planners, builders and designers. Thus occupational specialization, elemental to an urban society, emerged.

But what sustained such a trading center and drew travelers to it? Was it food? Shady and her team found the bones of small edible fish, which must have come from the Pacific coast to the west, in the excavations. But they also found evidence of squash, sweet potatoes and beans having been grown locally. Shady theorized that Caral's early farmers diverted the area's rivers into canals, which still cross the Supe Valley today, to irrigate their fields.But because she found no traces of maize, which can be traded or stored and used in times of crop failure, she concluded that Caral's trade leverage was not based on stockpiling food supplies.

It was evidence of another crop in the excavations that gave Shady the best clue to Caral’s success. In nearly every excavated building, her team discovered evidence of cotton - seeds, fibers and textiles. Her theory fell into place when a large fishing net made of those fibers, unearthed in an unrelated dig on Peru's coast, turned out to be as old as Caral. 'The farmers of Caral grew the cotton that the fishermen needed to make their nets, Shady speculates. And the fishermen gave them shellfish and dried fish in exchange for these nets.' In essence, the people of Caral enabled fishermen to work with larger and more effective nets, which made the resources of the sea more readily available, and the fishermen probably used dried squash grown by the Caral people as flotation devices for their nets.`,
        questions: [
          {
            type: "tfng",
            heading: "Questions 27–32",
            title:
              "Do the following statements agree with the claims of the writer in Reading Passage 3?",
            sub: "In boxes on your answer sheet, write",
            options: ["YES", "NO", "NOT GIVEN"],
            optionLabels: {
              YES: "if the statement agrees with the claims of the writer",
              NO: "if the statement contradicts the claims of the writer",
              "NOT GIVEN":
                "if it is impossible to say what the writer thinks about this",
            },
            items: [
              {
                n: 27,
                text: "Caral was built at the same time as the construction of the Egyptian pyramids.",
              },
              {
                n: 28,
                text: "The absence of pottery at the archaeological dig gave Shady a significant clue to the age of the site.",
              },
              {
                n: 29,
                text: "The stones used to build Piramide Mayor came from a location far away",
              },
              {
                n: 30,
                text: "The huge and complicated structures of Piramide Mayor suggest that its construction required an organised team of builders.",
              },
              {
                n: 31,
                text: "Archaeological evidence shows that the residents of Caral were highly skilled musicians.",
              },
              {
                n: 32,
                text: "The remains of housing areas at Caral suggest that there were no class distinctions in residential areas.",
              },
            ],
          },
          {
            type: "short",
            heading: "Questions 33–40",
            title: "Answer the questions below.",
            sub: "Choose ONE WORDS ONLY from the passage for each answer.",
            bulletPoint: true,
            questionTitle: "Caral as a trading centre",
            themeTitle:
              "Items discovered at Caral but not naturally occurring in the area",
            items: [
              {
                n: 33,
                text: "the ",
                afterText: "of a certain plant",
              },
              {
                n: 34,
                text: "",
                afterText: "used to make jewellery",
              },
              {
                n: 35,
                text: "the remains of certain food such as",
              },
            ],
          },
          {
            type: "short",
            bulletPoint: true,
            themeTitle: "Clues to farming around Caral",
            items: [
              {
                n: 36,
                text: "",
                afterText:
                  "still in existence today indicate water diverted from rivers",
              },
              {
                n: 37,
                text: "no evidence that ",
                afterText: "was grown",
              },
            ],
          },
          {
            type: "short",
            bulletPoint: true,
            themeTitle: "Evidence of relationship with fishing communities",
            items: [
              {
                n: 38,
                text: "the excavation findings and fishing nets found on the coast suggest Caral farmers traded",
              },
              {
                n: 39,
                text: "dried squash may have been used to aid",
              },
              {
                n: 40,
                text: "in exchange for cotton fishing nets, farmers received",
                afterText: "and dried fish",
              },
            ],
          },
          ,
        ],
      },
    ],
  },
  {
    id: 4,
    type: "reading",
    priority: "demo",
    title: "Demo Reading test-4",
    answers: {
      1: "FALSE",
      2: "TRUE",
      3: "FALSE",
      4: "TRUE",
      5: "FALSE",
      6: "NOT GIVEN",
      7: "Roman army",
      8: "gardens",
      9: "floors",
      10: "wall",
      11: "93",
      12: "gold ring",
      13: "modern museum",
      14: "FALSE",
      15: "NOT GIVEN",
      16: "TRUE",
      17: "FALSE",
      18: "FALSE",
      19: "TRUE",
      20: "1906",
      21: "Australia",
      22: "family",
      23: "bankruptancy",
      24: "writers",
      25: "reputation",
      26: "husband",
      27: "D",
      28: "B",
      29: "A",
      30: "C",
      31: "B",
      32: "NO",
      33: "NOT GIVEN",
      34: "YES",
      35: "NOT GIVEN",
      36: "E",
      37: "C",
      38: "D",
      39: "G",
      40: "B",
    },
    questions: [
      {
        id: 1,
        label: "Passage 1",
        title: "Fishbourne Roman Palace",
        subtitle: "",
        text: `Fishbourne Roman Palace is in the village of Fishbourne in West Sussex, England. This large palace was built in the 1st century AD, around thirty years after the Roman conquest of Britain ,on the site of Roman army grain stores which had been established after the invasion, in the reign of the Roman Emperor Claudius in 43 AD. The rectangular palace was built around formal gardens, the northern half of which have been reconstructed. There were extensive alterations in the 2nd and 3rd centuries AD, with many of the original black and white mosaic floors being overlaid with more sophisticated coloured ones , including a perfectly preserved mosaic of a dolphin in the north wing. More alterations were in progress when the palace burnt down in around 270AD,after which it was abandoned.

Local people had long believed that a Roman palace once existed in the area .However, it was not until 1960 that the archaeologist Barry Cunliffe, of Oxford University, first systematically excavated the site, after workmen had accidentally uncovered a wall while they were laying a water main .The Roman villa excavated by Cunliffe's team was so grand that it became known as Fishbourne Roman Palace ,and a museum was erected to preserve some of the remains .This is administered by the Sussex Archaeological Society.

In its day, the completed palace would have comprised four large wings with colonnaded fronts. The north and east wings consisted of suites of private rooms built around courtyards, with a monumental entrance in the middle of the east wing. In the north-east corner there was an assembly hall. The west wing contained state rooms, a large ceremonial reception room, and a gallery. The south wing contained the owner’s private apartments. The palace included as many as 50 mosaic floors, under-floor central heating and a bathhouse. In size, Fishbourne Palace would have been approximately equivalent to some of the great Roman palaces of Italy, and was by far the largest known Roman residence north of the European Alps, at about 500 feet (150m)square. A team of volunteers and professional archaeologists are involved in an ongoing archaeological excavation on the site of nearby, possibly military, buildings.

The first buildings to be erected on the site were constructed in the early part of the conquest in 43 AD. Later, two timber buildings were constructed, one with clay and mortar floors and plaster walls, which appears to have been a house of some comfort. These buildings were demolished in the 60s AD and replaced by a substantial stone house, which included colonnades, and a bath suite. It has been suggested that the palaces itself, incorporating the previous house in its south-east corner, was constructed around 73-75 AD. However, Dr Miles Russell, of Bournemouth University, reinterpreted the ground plan and the collection of objects found and has suggested that, given the extremely close parallels with the imperial palace of Domitian in Rome, its construction may more plausibly date to after 92 AD.

With regard to who lived in Fishbourne Palace, there are a number of theories; for example ,one proposed by Professor Cunliffe is that ,in its early phase, the palace was the residence of Tiberius

Claudius Cogidubnus ,a local chieftain who supported the Romans ,and who may have been installed as king of a number of territories following the first stage of the conquest. Cogidubnus is known from a reference to his loyalty in Agricola, a work by the Roman writer Tacitus, and from an inscription commemorating a temple dedicated to the gods Neptune and Minerva found in the nearby city of Chichester. Another theory is that it was built for Sallustius Lucullus, a Roman governor of Britain of the late 1st century, who may have been the son of the British prince Adminius. Two inscriptions recording the presence of Lucullus have been found in Chichester, and the redating by Miles Russell of the palace was designed for Lucullus, then it may have only been in use for a few years, as the Roman historian Suetonius records that Lucullus was executed by the Emperor Domitian in or shortly after 93 AD.

Additional theories suggest that either Verica, a British king of the Roman Empire in the years preceding the Claudian invasion, was owner of the palace, or Tiberius Claudius Catuarus , following the recent discovery of a gold ring belonging to him. The palace outlasted the original owner, whoever he was, and was extensively re-planned early in the 2nd century AD, and subdivided into a series of lesser apartments. Further redevelopment was begun in the late 3rd century AD, but these alterations were incomplete when the north wing was destroyed in a fire in around 270 AD. The damage was too great repair, and the palace was abandoned and later dismantled.

A modern museum had been built by the Sussex Archaeological Society, incorporating most of the visible remains , including one wing of the palace. The gardens have been re-planted using authentic plants from the Roman period.
  `,
        questions: [
          {
            type: "tfng",
            heading: "Questions 1–6",
            title:
              "Do the following statements agree with the information given in Reading Passage 1?",
            sub: "In boxes on your answer sheet, write",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            optionLabels: {
              TRUE: "if the statement agrees with the information",
              FALSE: "if the statement contradicts the information",
              "NOT GIVEN": "if there is no information on this",
            },
            items: [
              {
                n: 1,
                text: "Fishbourne Palace was the first structure to be built on its site.",
              },
              {
                n: 2,
                text: " Fishbourne Palace was renovated more than once",
              },
              {
                n: 3,
                text: " Fishbourne Palace was large in comparison with Roman palaces in Italy.",
              },
              {
                n: 4,
                text: "Research is continuing in the area clos to Fishbourne Palace. ",
              },
              {
                n: 5,
                text: "Researches agree on the identity of the person for whom Fishbourne Palace was constructed.",
              },
              {
                n: 6,
                text: "Fishbourne Palace was burnt down by local people.",
              },
            ],
          },
          {
            type: "short",
            heading: "Questions 7–13",
            title: "Answer the questions below.",
            sub: "Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.",
            bulletPoint: true,
            questionTitle: "Fishbourne Palace",
            themeTitle: "Costruction",
            items: [
              {
                n: 7,
                text: "The first buildings on the site contained food for the",
              },
              {
                n: 8,
                text: "The palace building surrounded",
              },
              {
                n: 9,
                text: "In the 2nd and 3rd centuries colour was added to the",
                afterText: "of the palace",
              },
            ],
          },
          {
            type: "short",
            bulletPoint: true,
            themeTitle: "Discovery",
            items: [
              {
                n: 10,
                text: "The first part of the palace to the found was part of a",
              },
            ],
          },
          {
            type: "short",
            bulletPoint: true,
            themeTitle: "Possible inhabitants",
            items: [
              {
                n: "example",
                text: "Congidubnus -he is named in several writings",
              },
              {
                n: 11,
                text: "Sallustius Lucullu-he may have lived there until approximately",
                afterText: "AD",
              },
              {
                n: "example",
                text: "Verica -a British king",
              },
              {
                n: 12,
                text: "Catuarus-his",
                afterText: "has been built on the site to help protect it.",
              },
            ],
          },
          {
            type: "short",
            bulletPoint: true,
            themeTitle: "Present Day",
            items: [
              {
                n: 13,
                text: "A",
                afterText: "has been built on the site to help protect it.",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        label: "Passage 2",
        title: "Katherine Mansfield",
        subtitle:
          "Katherine Mansfield was a modernist writer of short fiction who was born and brought up in New Zealand",
        text: `Katherine Mansfield Beauchamp Murry was born in 1888, into a prominent family in Wellington, New Zealand. She became one of New Zealand's best-known writers, using the pen name of Katherine Mansfield. The daughter of a banker, and born into a middle-class family, she was also a first cousin of Countess Elizabeth von Arnim, a distinguished novelist in her time. Mansfield had two older sisters and a younger brother. Her father, Harold Beauchamp, went on to become the chairman of the Bank of New Zealand. In 1893, the Mansfield family moved to Karori, a suburb of Wellington, where Mansfield would spend the happiest years of her childhood; she later used her memories of this time as an inspiration for her Prelude story.

Her first published stories appeared in the High School Reporter and the Wellington Girls7 High School magazine in 1898 and 1899. In 1902, she developed strong feelings for a musician who played the cello, Arnold Trowell, although her feelings were not, for the most past, returned. Mansfield herself was an accomplished cellist, having received lesion from Trowell's father. Mansfied wrote in her journals of feeling isolated to some extent in New Zealand, and, in general terms of her interest in the Maori people ( New Zealand's native people), who were often portrayed in a sympathetic light in her later stories, such as How Pearl Button was Kidnapped

She moved to London in 1903, where she attended Queen's college, along with her two sisters. Manfield recommenced playing the cello, an occupation that she believed, during her time at Queen's, she would take up professionally. She also began contributing to the college newspaper, with such a dedication to it that she eventually became its editor. She was particularly interested in the works of the French writers of this period and on the 19th- century British writer, Oscar Wilde, and she was appreciated amongst fellow students at Queen's for her lively and charismatic approach to life and work. She met follow writer Ida Baker, a South African, at the college, and the pair became lifelong friends. Mansfield did not actively support the suffragette movement in the Uk. Women in New Zeland had gained the right to vote in 1893.

Mansfield first began journeying into the other parts of Europe in the period 1903-1906, mainly to Belgium and Germany. After finishing her schooling in England, she returned to her New Zealand home in 1906, only then beginning to write short stories in a serious way. She had several works published in Australia in a magazine called Native Comparison, which was her first paid writing work, and by this time she had her mind set on becoming a professional writer. It was also the first occasion on which she used the pseudonym "k.Mansfied".

Mansfield rapidly grew discontented with the provincial New Zealand lifestyle, and with her family. Two years later she headed again in London. Her father sent her an annual subsidy of €100 for the rest of her life. In later years, she would express both admiration and disdain for New Zealand in her journals.

In 1911, Mansfield met John Middleton Murry, the Oxford scholar and editor of the literary magazine Rhythm. They were later to marry in 1918. Mansfield became a co-editor of Rhythm, which was subsequently called The Blue Review, in which more of her works were published. She and Murry lived in various houses in England and briefly in Paris. The Blue Review failed to gain enough readers and was no longer published. Their attempt to set up as writers in Paris was cut short by Murry's bankruptcy, which resulted from the failure of this and other journals. Life back in England meant frequently changed addresses and very limited funds.

Between 1915 and 1918, Mansfield moved between England and Bandoi, France. She and Murry developed close contact with other well-known writers of the time such as DH Lawrence, Bertrand Russell and Aldous Huxley. By October 1918 Mansfield had become seriously ill; she had been diagnosed with tuberculosis and was advised to enter a sanatorium. She could no longer spend time with writers in London. In the autumn of 1918 she was so ill that she decided to go to Ospedale in Italy. It was the publication of Bliss and Other Stories in 1920 that was to solidify Mansfield's reputation as a writer.

Mansfied also spent time in Menton, France, as the tenant of her father's cousin at " The Villa Isola Bella". There she wrote she pronounced to be "...the only story that satisfies me to any extent".

Mansfield produced a great deal of work in the final years of her life, and much of her prose and poetry remained unpublished at her death in 1923. After her death, her husband, Murry, took on the task of editing and publishing her works. His efforts resulted in two additional volumes of short stories. The Doves' Nest and Something Childish, published in 1923 and 1924 respectively, the publication of her Poems as well as a collection of critical writings (Novels and Novelist) and a number of editions of Mansfield's previously unpublished letters and journals.`,
        questions: [
          {
            type: "tfng",
            heading: "Questions 14–19",
            title:
              "Do the following statements agree with the information in the text?",
            sub: "Choose TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            optionLabels: {
              TRUE: "if the statement agrees with the information",
              FALSE: "if the statement contradicts the information",
              "NOT GIVEN": "if there is no information on this",
            },
            items: [
              {
                n: 14,
                text: "The name Katherine Mansfield, that appears on the writer's book, was exactly the same as her origin name",
              },
              {
                n: 15,
                text: "Mansfield won a prize for a story she wrote for the High School Reporter.",
              },
              {
                n: 16,
                text: "How Pearl Button Was Kidnapped portrayed Maori people in a favorable way.",
              },
              {
                n: 17,
                text: "when Mansfield was at Queen's college, she planned to be a professional writer.",
              },
              {
                n: 18,
                text: " Mansfield was unpopular with the other students at Queen's college",
              },
              {
                n: 19,
                text: "In London, Mansfield showed little interest in politics.",
              },
            ],
          },
          {
            type: "short",
            heading: "Questions 20–26",
            title: "Answer the questions below.",
            sub: "Choose ONE WORD AND/OR A NUMBER from the passage for each answer",
            bulletPoint: true,
            questionTitle: "Katherine Mansfield's adult years",
            items: [
              {
                n: 20,
                text: "",
              },
              {
                n: "example",
                text: "moved from England back to New Zealand",
              },
              {
                n: 21,
                text: "first paid writing work was in a publication based in",
              },
              {
                n: 22,
                text: "her ",
                afterText:
                  "and the New Zealand way of life made her feel dissatisfied",
              },
              {
                n: "example",
                text: "1908: returned to London",
              },
              {
                n: "example",
                text: "- Met John Middleton Murry in 1911",
              },
              {
                n: 23,
                text: "",
                afterText:
                  "perverted.... Mansfield and Murry from staying together in Paris",
              },
              {
                n: 24,
                text: "spent time with distinguished",
              },
              {
                n: "example",
                text: "from 1916, tuberculosis restricted the time she spent in London",
              },
              {
                n: 25,
                text: "her ",
                afterText:
                  "was consolidated when Bliss and Other Stories was published",
              },
              {
                n: "example",
                text: "wrote several stories at Villa Isola Bella",
              },
              {
                n: 26,
                text: "Mansfield's  ",
                afterText: "published more of her works after her death",
              },
            ],
          },
        ],
      },
      {
        id: 3,
        label: "Passage 3",
        title: "When people are deaf’ to music",
        subtitle: "",
        text: `Music has long been considered a uniquely human concept. In fact, most psychologists agree that music is a universal human instinct. Like any ability, however, there is great variation in people's musical competence. For every brilliant pianist in the world, there are several people we refer to as " tone deaf". It is not simply that people with tone deafness (or' amusia") are unable to sing in tune, they are also unable to discriminate between tones or recognize familiar melodies. Such a" disorder" can occur after some sort of brain damage , but recently research has been undertaken in an attempt to discover the cause of congenital amusia (when people are born with the condition), which is not associated with any brain damage, hearing problems, or lack of exposure to music.

According to the research of Dr. Isabelie Peretz of the University of Montreat, amusia is more complicated than the inability to distinguish pitches. An amusia (a person who has the condition of amusia) can distinguish between two pitches that are far apart, but cannot tell the difference between intervals smaller than a half step on the Western diatonic scale, while most people can easily distinguish differences smaller than that, when listening to melodies which have had a single note altered so that it is out of key with the rest of the melody, do not notice a problem. As would be expected, amusics perform significantly worse at singing and tapping a rhythm along with a melody than do non-amusics.

The most fascinating aspect of amusia is how specific to music it is. Because of music’s close ties

to language, it might be expected that a musical impairment may be caused by a language impairment. Studies suggest, however, that language and music ability are independent of one another. People with brain damage in areas critical to language are often still able to sing, despite being unable to communicate through speech. Moreover, while amusics show deficiencies in their recognition of pitch differences in melodies, they show no tonal languages, such as Chinese, do not report having any difficulty discriminating between words that differ only in their intonation. The linguistic cues inherent in speech make discrimination of meaning much easier for amusics. Amusics are also successful most of the time at detecting the mood of a melody, can identify a speaker based on his or her voice and can discriminate and identify environmental sounds.

Recent work has been focused on locating the part of the brain that is responsible for amusia. The temporal lobes of the brain, the location of the primary auditory cortex, have been considered. It has long been believed that the temporal lobes, especially the right temporal lobe, are most active when activity, so any musical disability should logically stem from here as well. Because it has been shown that there is no hearing deficit in amusia, researchers moved on to the temporal neocortex, which is where more sophisticated processing of musical cues was thought to take place. New studies, however, have suggested that the deficits in amusics are located outside the auditory cortex. Brain scans of amusics do not show any reaction at all to differences smaller than a half step, when changes in tones are large, their brains overreact, showing twice as much activity on the right side of the brain as a normal brain hearing the same thing. These differences do not occur in the auditory cortex, indicating again that the deficits of amusia lie mostly in hearing impairment, but in higher processing of melodies.

So what does this all mean? Looking only at the research of Peretz in the field of neuropsychology of music, it would appear that amusia is some sort of disorder. As a student of neurobiology, however, I am skeptical. Certainly the studies by Peretz that have found significant differences between the brains of so-called amusics and normal brains are legitimate. The more important question now becomes one of normality. Every trait from skin color to intelligence to mood exists on a continuum-there is a great idea of variation from one extreme to the other. Just because we recognize that basic musical ability is something that the vast majority of people have, this doesn’t mean that the lack of it is abnormal

What makes an amusic worse off than a musical prodigy? Musical ability is culturally valued, and may have been a factor in survival at one point in human history, but it does not seem likely that it is being selected for on an evolutionary scale any longer. Darwin believed that music was adaptive as a way of finding a mate, but who needs to be able to sing to find a partner in an age when it is possible to express your emotions through a song on your IPod?

While the idea of amusia is interesting, it seems to be just one end of the continuum of innate musical ability. Comparing this ‘disorder’ to learning disorders like a specific language impairment seems to be going too far. Before, amusia can be declared a disability, further research must be done to determine whether lack of musical ability is actually detrimental in any way. If no disadvantages can be found of having amusia, then it is no more a disability than having poor fashion sense or bad handwriting.`,
        questions: [
          {
            type: "mcq",
            heading: "Questions 27–31",
            title: "Choose the correct letter, A, B, C or D.",
            items: [
              {
                n: 27,
                text: "What does the writer tell US about people with tone deafness (amusia) in the first paragraph?",
                options: [
                  { id: "A", text: "They usually have hearing problems" },
                  {
                    id: "B",
                    text: "Some can play a musical instrument very well",
                  },
                  {
                    id: "C",
                    text: "Some may be able to sing well-known melodies",
                  },
                  {
                    id: "D",
                    text: "They have several inabilities in regard to music",
                  },
                ],
              },
              {
                n: 28,
                text: "What is the writer doing in the second paragraph?",
                options: [
                  {
                    id: "A",
                    text: "outlining some of factors that cause amusia",
                  },
                  {
                    id: "B",
                    text: "summarising some findings about people with amusia",
                  },
                  {
                    id: "C",
                    text: "suggesting that people with amusia are disadvantaged",
                  },
                  {
                    id: "D",
                    text: "comparing the sing ability of amusia with their sense",
                  },
                ],
              },
              {
                n: 29,
                text: "What does the writer say about the relationship between language ability and musical ability?",
                options: [
                  {
                    id: "A",
                    text: "People who are unable to speak can sometimes sing",
                  },
                  {
                    id: "B",
                    text: "People with amusia usually have language problems too",
                  },
                  {
                    id: "C",
                    text: "Speakers of tonal languages like Chinese rarely have amusia",
                  },
                  {
                    id: "D",
                    text: " People with amusia have difficulty recognizing people by their voices",
                  },
                ],
              },
              {
                n: 30,
                text: "In the third paragraph, the writer notes that most amusics are able to",
                options: [
                  { id: "A", text: "learn how to sing in tune" },
                  { id: "B", text: "identify a song by its tune" },
                  { id: "C", text: "distinguish a sad tone from a happy tune" },
                  {
                    id: "D",
                    text: "recognise when a singer is not sing in tune",
                  },
                ],
              },
              {
                n: 31,
                text: "What is the writer doing in the fourth paragraph?",
                options: [
                  {
                    id: "A",
                    text: "claiming that amusics have problems in the auditory cortex",
                  },
                  {
                    id: "B",
                    text: " outlining progress in understanding the brains of amusics",
                  },
                  {
                    id: "C",
                    text: "proving that amuisa is located in the temporal lobes",
                  },
                  {
                    id: "D",
                    text: "explaining why studies of hearing are difficult",
                  },
                ],
              },
            ],
          },
          {
            type: "tfng",
            heading: "Questions 32–35",
            title:
              "Do the following statements agree with the claims of the writer in Reading Passage 3?",
            sub: "In boxes on your answer sheet, write",
            options: ["YES", "NO", "NOT GIVEN"],
            optionLabels: {
              YES: "if the statement agrees with the claims of the writer",
              NO: "if the statement contradicts the claims of the writer",
              "NOT GIVEN":
                "if it is impossible to say what the writer thinks about this",
            },
            items: [
              {
                n: 32,
                text: "Perezt's research suggesting that amusia is a disorder is convincing.",
              },
              {
                n: 33,
                text: "People with musical ability are happier than those without this ability.",
              },
              {
                n: 34,
                text: " It is inappropriate to consider amusia as real disorder.",
              },
              {
                n: 35,
                text: " People with amusia often have bad handwriting.",
              },
            ],
          },
          {
            type: "matchAnswer",
            heading: "Questions 36–40",
            sub: "Match the groups A–H with their concerns about shared space",
            options: {
              A: "an inability to hear when spoken language rises and falls.",
              B: "considered to be desirable.",
              C: "an inability to follow the beat of music.",
              D: "not a problem.",
              E: "not yet well understood.",
              F: "a result of injury to the mother.",
              G: "more marked that with other people.",
              H: "associated with intelligence.",
            },
            items: [
              {
                num: 36,
                q: "The reason why some people are born with amusia is",
              },
              { num: 37, q: "One of the difficulties amusia experience is" },
              {
                num: 38,
                q: "For amusia, discrimination of meaning in speech is",
              },
              { num: 39, q: "Certain reactions in the brain of an amusia are" },
              { num: 40, q: "In most cultures, musical ability is" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    type: "reading",
    priority: "demo",
    title: "Demo Reading test-5",
    answers: {
      1: "FALSE",
      2: "NOT GIVEN",
      3: "NOT GIVEN",
      4: "TRUE",
      5: "TRUE",
      6: "FALSE",
      7: "rule",
      8: "river",
      9: "confidence",
      10: "schools",
      11: "statistics",
      12: "clinics",
      13: "language",
      14: "i",
      15: "ix",
      16: "iv",
      17: "vii",
      18: "v",
      19: "iii",
      20: "FALSE",
      21: "FALSE",
      22: "FALSE",
      23: "TRUE",
      24: ["B", "C", "E"],
      25: ["B", "C", "E"],
      26: ["B", "C", "E"],
      27: "TRUE",
      28: "FALSE",
      29: "TRUE",
      30: "TRUE",
      31: "NOT GIVEN",
      32: "A",
      33: "C",
      34: "D",
      35: "anatomy",
      36: "resistance",
      37: "stress",
      38: "hypertension",
      39: "organs",
      40: "soles",
    },
    questions: [
      {
        id: 1,
        label: "Passage 1",
        title: "Traditional Maori medicines",
        subtitle: "",
        text: `The Maori are the indigenous people of the islands of New Zealand. Their traditional medicine, which is believed to date back as far as the 13th century, was a system of healing that was passed down through the generations orally. It comprised diverse practices and placed an emphasis on the spiritual dimension of health. Its practice included remedies made from herbs, and physical therapies such as massage to relieve discomfort in the muscles and bones.

Maori systems for treating illness were well developed before European arrived in New Zealand in the late 1700s: they had quite detailed knowledge of anatomy and recognition of the healing properties of various plants. When Europeans first visited New Zealand, the average age of death for Maori adults was around 30. However, apart from this, the people were fit and healthy, and troubled by few diseases.

Illness was often seen as spiritually based. Maori saw themselves as guardians of the earth, and the focus of their existence was to remain at one with the natural and supernatural world. Rather than a medical problem, sickness was often viewed as a symptom of disharmony with natures.

In Maori culture, illnesses were divided into diseases of the gods (mate atua) and physical diseases (mate tangata). Diseases sent by the gods were often attributed to attacks by evil spirits, because the person had broken a religious rule. For instance, for Maori, Places where people had died, or places where their ancestors were buried were sacred, so if someone took food from a river where someone had died, or took a stick form a tree that had held their ancestor's bones and placed it on a cooking fire, it was believed that the gods could punish them for their disrespectful acts by making them SICK.

More than 200 plants were used medicinally by Maori. The leaves of the flax plant were used to treat skin infections and food poisoning, and the hard part of the leaf was also used as a splint or brace for broken bones and injured backs. Flax fibers were used along with a sharpened stick to sew up bad cuts. The bark and leaves of the pepper tree were used to heal cuts, wounds and stomach pain. People who had toothache were instructed to chew the leaves of this same tree, and this was found to be of considerable benefit. The pepper tree was also used in vapor baths to treat people with painful joints.

Colonization by European in the 1800s had a significant effect on traditional Maori healing. Europeans brought many new diseases with them which Maori healers had limited ability to combat. Though Western medicine was also relatively ineffectual at the time, this failure still strongly affected Maori confidence in their healers. Some western missionaries attributed the spread of disease to the fact the Maori did not believe in Christianity, and as Maori healers appeared powerless, many Maori accepted this explanation and turned to Christianity. Over time the schools of higher learning which ahd trained healers started to close and the tradition of the Maori healer declined.

From the late 20th century, there was renewed Maori interest in their traditional medicine. This was due to several factors. There was a resurgence of all aspects of Maori culture in New Zealand. Furthermore, people started to be less trusting of Western medicine-statistics from the 1970s came out revealing that Maori health continued to be poorer than that of other New Zealanders. There were also problems with access to health care for Maori. Additionally, there was and still a today a perceived lack of a spiritual dimension in Western health services.

Although Maori today largely accepted Western concepts of health and illness, and use the mainstream health system, there is significant demand for traditional medicine. This is true for unusual illnesses, or those that fail to respond to standard medical treatment, but also for common ailments such as the cold and influenza.

Today's healers differ significantly from those of old times. Training is highly variable, usually informal, and often less tribally bound than the rigorous education of the traditional houses of higher learning. Many modern healers work in urban clinics, some alongside mainstream health professionals. They experiment, incorporating knowledge from Western and other medical systems. As a result, their modern day work has no standard system of diagnosis or widespread agreement about treatments. Despite this, many healers are recognized as having knowledge and ability that has been passed down from their ancestors. The Maori language is also seen as important by many of those receiving treatment. `,
        questions: [
          {
            type: "tfng",
            heading: "Questions 1–6",
            title:
              "Do the following statements agree with the information given in Reading Passage 1?",
            sub: "In boxes on your answer sheet, write",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            optionLabels: {
              TRUE: "if the statement agrees with the information",
              FALSE: "if the statement contradicts the information",
              "NOT GIVEN": "if there is no information on this",
            },
            items: [
              {
                n: 1,
                text: "Early Maori healers learned their skills through studying written texts.",
              },
              {
                n: 2,
                text: "The first Europeans in New Zealand were surprised by how long the Maori lived.",
              },
              {
                n: 3,
                text: "Diseases of the gods were believed to be more serious than physical diseases.",
              },
              {
                n: 4,
                text: "The leaves of the pepper tree were used to treat toothache.",
              },
              {
                n: 5,
                text: "Western religion was one reason why traditional Maori medicine became less popular.",
              },
              {
                n: 6,
                text: "Modern day Maori healers often reach the same conclusion about the type of treatment which is best.",
              },
            ],
          },
          {
            type: "short",
            heading: "Questions 7–13",
            title: "Answer the questions below.",
            sub: "Choose ONE WORD ONLY from the passage for each answer.",
            bulletPoint: true,
            questionTitle: "A short history of Maori healing",
            themeTitle: "Pre-European arrival",
            items: [
              {
                n: 7,
                text: "Maori were using plant based remedies, as well as treatment including massage Diseases sent from the gods were thought to be caused by disobeying a spiritual",
              },
              {
                n: 8,
                text: "Sickness could be attributed to eating food from a sacred",
                afterText: "or burning sacred wood",
              },
            ],
          },
          {
            type: "short",
            bulletPoint: true,
            questionTitle: "After European arrival",
            themeTitle: "1800s",
            items: [
              {
                n: 9,
                text: "The inability of Maori healers to cure new diseases meant the Maori people lost",
                afterText: "in them.",
              },
              {
                n: 10,
                text: "Eventually the",
                afterText: "for Maori healing began shutting down",
              },
            ],
          },
          {
            type: "short",
            bulletPoint: true,
            themeTitle: "1970s",
            items: [
              {
                n: 11,
                text: "Published ",
                afterText: "showed that Maori were not as healthy as Europeans",
              },
            ],
          },
          {
            type: "short",
            bulletPoint: true,
            themeTitle: "2000s",
            items: [
              {
                n: 12,
                text: "Maori healers can be seen working with Western doctors in",
                afterText: "in cities",
              },
              {
                n: 13,
                text: " Many patients appreciate the fact that the Maoris",
                afterText: "in used by healers",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        label: "Passage 2",
        title: "Katherine Mansfield",
        subtitle:
          "Katherine Mansfield was a modernist writer of short fiction who was born and brought up in New Zealand",
        text: `[Paragraph A] E-learning is the unifying term to describe the fields of online learning, web-based training, and technology-delivered instruction, which can be a great benefit to corporate e-learning. IBM, for instance, claims that the institution of its e-training program, Basic Blue, whose purpose is to train new managers, saved the company in the range of $200 million in 1999. Cutting the travel expenses required to bring employees and instructors to a central classroom account for the lion’s share of the savings. With an online course, employees can learn from any Internet-connected PC, anywhere in the world. Ernst and Young reduced training costs by 35 percent while improving consistency and scalability.

[Paragraph B] In addition to generally positive economic benefits, other advantages such as convenience, standardized delivery, self-paced learning, and a variety of available content, have made e-learning a high priority for many corporations. E-learning is widely believed to offer flexible “any time, any place” learning. The claim for “any place” is valid in principle and is a great development. Many people can engage with rich learning materials that simply were not possible in a paper of broadcast distance learning era. For teaching specific information and skills, e-training holds great promise. It can be especially effective at helping employees prepare for IT certification programs. E-learning also seems to effectively address topics such as sexual harassment education’, safety training and management training – all areas where a clear set of objectives can be identified. Ultimately, training experts recommend a “blended” approach that combines both online and in-person training as the instruction requires. E-learning is not an end-all solution. But if it helps decrease costs and windowless classrooms filled with snoring students, it definitely has its advantages.

[Paragraph C] Much of the discussion about implementing e-learning has focused on the technology, but as Driscoll and others have reminded us, e-learning is not just about the technology, but also many human factors. As any capable manager knows, teaching employees new skills is critical to a smoothly run business. Having said that, however, the traditional route of classroom instruction runs the risk of being expensive, slow and, oftentimes, ineffective. Perhaps the classroom’s greatest disadvantage is the fact that it takes employees out of their jobs. Every minute an employee is sitting in a classroom training session is a minute they’re not out on the floor working. It now looks as if there is a way to circumvent these traditional training drawbacks. E-training promises more effective teaching techniques by integrating audio, video, animation, text and interactive materials with the intent of teaching each student at his or her own pace. In addition to higher performance results, there are other immediate benefits to students such as increased time on task, higher levels of motivation, and reduced test anxiety for many learners.

[Paragraph D] On the other hand, nobody said E-training technology would be cheap. E-training service providers, on the average, charge from $10,000 to $60,000 to develop one hour of online instruction. This price varies depending on the complexity of the training topic and the media used. HTML pages are a little cheaper to develop while streaming-video presentations or flash animations cost more. Course content is just the starting place for the cost. A complete e-learning solution also includes the technology platform (the computers, applications and network connections that are used to deliver the courses). This technology platform, known as a learning management system (LMS), can either be installed onsite or outsourced. Add to that cost the necessary investments in network bandwidth to deliver multimedia courses, and you’re left holding one heck of a bill. For the LMS infrastructure and a dozen or so online courses, costs can top $500,000 in the first year. These kinds of costs mean that custom e-training is, for the time being, an option only for large organizations. For those companies that have a large enough staff, the e-training concept pays for itself. Aware of this fact, large companies are investing heavily in online training. Today, over half of the 400-plus courses that Rockwell Collins offers are delivered instantly to its clients in an e-learning format, a change that has reduced its annual training costs by 40%. Many other success stories exist.

[Paragraph E] E-learning isn’t expected to replace the classroom entirely. For one thing, bandwidth limitations are still an issue in presenting multimedia over the Internet. Furthermore, e-training isn’t suited to every mode of instruction or topic. For instance, it’s rather ineffective imparting cultural values or building teams. If your company has a unique corporate culture is would be difficult to convey that to first-time employees through a computer monitor. Group training sessions are more ideal for these purposes. In addition, there is a perceived loss of research time because of the work involved in developing and teaching online classes. Professor Wallin estimated that it required between 500 and 1,000 person-hours, that is, Wallin-hours, to keep the course at the appropriate level of currency and usefulness. (Distance learning instructors often need technical skills, no matter how advanced the courseware system.) That amounts to between a quarter and half of a person-year. Finally, teaching materials require computer literacy and access to equipment. Any e-Learning system involves basic equipment and a minimum level of computer knowledge in order to perform the tasks required by the system. A student that does not possess these skills, or have access to these tools, cannot succeed in an e-Learning program.

[Paragraph F] While few people debate the obvious advantages of e-learning, systematic research is needed to confirm that learners are actually acquiring and using the skills that are being taught online, and that e-learning is the best way to achieve the outcomes in a corporate environment. Nowadays, a go-between style of Blended learning, which refers to a mixing of different learning environments, is gaining popularity. It combines traditional face-to-face classroom methods with more modern computer-mediated activities. According to its proponents, the strategy creates a more integrated approach for both instructors and learners. Formerly, technology-based materials played a supporting role in face-to-face instruction. Through a blended learning approach, technology will be more important.
            `,
        headingsList: [
          {
            id: "i",
            text: "overview of the benefits for application of E-training",
          },
          { id: "ii", text: " IBM’s successful choice of training" },
          { id: "iii", text: "Future directions and a new style of teaching" },
          {
            id: "iv",
            text: "learners’ achievement and advanced teaching materials",
          },
          {
            id: "v",
            text: " limitations when E-training compares with traditional class",
          },
          { id: "vi", text: "multimedia over the Internet can be a solution" },
          { id: "vii", text: "technology can be a huge financial burden" },
          {
            id: "viii",
            text: "the distance learners outperformed the traditional university learners worldwide",
          },
          { id: "ix", text: "other advantages besides economic consideration" },
          {
            id: "x",
            text: "Training offered to help people learn using computers ",
          },
          {
            id: "vii",
            text: "public's increasing ability to influence the law",
          },
          { id: "viii", text: "growth in laws" },
        ],
        paragraphQuestions: {
          A: 14,
          B: 15,
          C: 16,
          D: 17,
          E: 18,
          F: 19,
        },
        questions: [
          {
            type: "headings",
            heading: "Questions 14–19",
            title:
              "Choose the correct heading for each paragraph from the list of headings below. Write the correct number i-viii in boxes 14-19 on your answer sheet.",
            sub: "Reading Passage 2 has six paragraphs A-F.",

            items: [
              { n: 14, label: "Paragraph A" },
              { n: 15, label: "Paragraph B" },
              { n: 16, label: "Paragraph C" },
              { n: 17, label: "Paragraph D" },
              { n: 18, label: "Paragraph E" },
              { n: 19, label: "Paragraph F" },
            ],
          },
          {
            type: "tfng",
            heading: "Questions 20–23",
            title:
              "Do the following statements agree with the information in the text?",
            sub: "Choose TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            optionLabels: {
              TRUE: "if the statement agrees with the information",
              FALSE: "if the statement contradicts the information",
              "NOT GIVEN": "if there is no information on this",
            },
            items: [
              {
                n: 20,
                text: "IBM's Basic Blue program was designed to train experienced senior executives.",
              },
              {
                n: 21,
                text: "E-learning is generally considered less effective than classroom training for teaching specific skills like IT certification.",
              },
              {
                n: 22,
                text: "The cost of developing e-training courses is unaffected by the type of media used.",
              },
              {
                n: 23,
                text: "Blended learning combines both traditional classroom teaching and computer-based methods.",
              },
            ],
          },
          {
            type: "multiChoiceMCQ",
            heading: "Questions 24–26",
            title: "Write your answers in boxes 20-21 on your answer sheet.",
            sub: "Choose THREE letters A-E.",
            items: [
              {
                n: [24, 25, 26],
                q: "Which TWO of the following statements does the writer make about legal skills in today's world?",
                opts: [
                  "Technical facilities are hardly obtained.",
                  "Presenting multimedia over the Internet is restricted due to the bandwidth limit.",
                  "It is ineffective imparting a unique corporate value to fresh employees.",
                  "Employees need to block a long time leaving their position attending training.",
                  "More preparation time is needed to keep the course at a suitable level.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: 3,
        label: "Passage 3",
        title: "Learning to Walk",
        subtitle: "",
        text: `
    
    These days the feet of a typical city dweller rarely encounter terrain any more uneven than a crack in the pavement. While that may not seem like a problem, it turns out that by flattening our urban environment we have put ourselves at risk of a surprising number of chronic illnesses and disabilities. Fortunately, the commercial market has come to the rescue with a choice of products. Research into the idea that flat floors could be detrimental to our health was pioneered back in the late 1960s in Long Beach, California. Podiatrist Charles Brantingham and physiologist Bruce Beekman were concerned with the growing epidemic of high blood pressure, varicose veins and deep-vein thromboses and reckoned they might be linked to the uniformity of the surfaces that we tend to stand and walk on.

The trouble, they believed, was that walking continuously on flat floors, sidewalks and streets concentrates forces on just a few areas of the foot. As a result, these surfaces are likely to be far more conducive to chronic stress syndromes than natural surfaces, where the foot meets the ground in a wide variety of orientations. They understood that the anatomy of the foot parallels that of the human hand - each having 26 bones, 33 joints and more than 100 muscles, tendons and ligaments - and that modern lifestyles waste all this potential flexibility.

Brantingham and Beekman became convinced that the damage could be rectified by making people wobble. To test their ideas, they got 65 factory workers to try standing on a variable terrain floor - spongy mats with varying degrees of resistance across the surface. This modest irregularity allowed the soles of the volunteers' feet to deviate slightly from the horizontal each time they shifted position. As the researchers hoped, this simple intervention made a huge difference, within a few weeks. Even if people were wobbling slightly, it activated a host of muscles in their legs, which in turn helped pump blood back to their hearts. The muscle action prevented the pooling of blood in their feet and legs, reducing the stress on the heart and circulation. Yet decades later, the flooring of the world's largest workplaces remains relentlessly smooth. Earlier this year, however, the idea was revived when other researchers in the US announced findings from a similar experiment with people over 60. John Fisher and colleagues at the Oregon Research Institute in Eugene designed a mat intended to replicate the effect of walking on cobblestones*.

In tests funded by the National Institute of Aging, they got some 50 adults to walk on the toots in their bare feet for less than an hour, three times a week. After 16 weeks, these people showed marked improvements in mobility, and even a significant reduction in blood pressure. People in a control group who walked on ordinary floors also improved but not as dramatically. The mats are now available for purchase and production is being scaled up. Even so, demand could exceed supply if this footstimulating activity really is a 'useful nonpharmacological approach for preventing or controlling hypertension of older adults, as the researchers believe. They are not alone in recognising the benefits of cobblestones. Reflexologists have long advocated walking on textured surfaces to stimulate so-called 'acupoints' on the soles of the feet. They believe that pressure applied to particular spots on the foot connects directly to particular organs of the body and somehow enhances their function. In China, spas, apartment blocks and even factories promote their cobblestone paths as healthful amenities. Fisher admits he got the concept from regular visits to the country. Here, city dwellers take daily walks along cobbled paths for five or ten minutes, perhaps several times a day, to improve their health. The idea is now taking off in Europe too.

People in Germany, Austria and Switzerland can now visit 'barefoot parks' and walk along 'paths of the senses - with mud, logs, stone and moss underfoot. And it is not difficult to construct your own path with simple everyday objects such as stones or bamboo poles. But if none of these solutions appeal, there is another option. A new shoe on the market claims to transform flat, hard, artificial surfaces into something like uneven ground. 'These shoes have an unbelievable effect,' says Benno Nigg, an exercise scientist at Calgary University in Canada.

Known as the Masai Barefoot Technology, the shoes have rounded soles that cause you to rock slightly when you stand still, exercising the small muscles around the ankle that are responsible for stability. Forces in the joint are reduced, putting less strain on the system, Nigg claims.

Some of these options may not appeal to all consumers and there is a far simpler alternative.

If the urban environment is detrimental to our health, then it is obvious where we should turn. A weekend or even a few hours spent in the countryside could help alleviate a sufferer's aches and pains, and would require only the spending of time.

However, for many modern citizens, the countryside is not as accessible as it once was and is in fact a dwindling resource. Our concrete cities are growing at a terrifying rate - perhaps at the same rate as our health problems.

    `,
        questions: [
          {
            type: "tfng",
            heading: "Questions 27–31",
            title:
              "Do the following statements agree with the claims of the writer in Reading Passage 3?",
            sub: "In boxes on your answer sheet, write",
            options: ["YES", "NO", "NOT GIVEN"],
            optionLabels: {
              YES: "if the statement agrees with the claims of the writer",
              NO: "if the statement contradicts the claims of the writer",
              "NOT GIVEN":
                "if it is impossible to say what the writer thinks about this",
            },
            items: [
              {
                n: 27,
                text: "Brantingham and Beekman were the first researchers to investigate the relationship between health problems and flat floor",
              },
              {
                n: 28,
                text: "The subjects in Fisher's control group experienced a decline in their physical condition.",
              },
              {
                n: 29,
                text: "The manufacturers are increasing the number of cobblestone mats they are making.",
              },
              {
                n: 30,
                text: "Fisher based his ideas on what he saw during an overseas trip.",
              },
              {
                n: 31,
                text: "The Masai Barefoot Technology shoes are made to fit people of all ages.",
              },
            ],
          },
          {
            type: "mcq",
            heading: "Questions 32–34",
            title: "Choose the correct letter, A, B, C or D.",
            items: [
              {
                n: 32,
                text: "The writer suggests that Brantingham and Beekman's findings were",
                options: [
                  {
                    id: "A",
                    text: "ignored by big companies.",
                  },
                  {
                    id: "B",
                    text: "doubted by other researchers.",
                  },
                  {
                    id: "C",
                    text: "applicable to a narrow range of people. ",
                  },
                  {
                    id: "D",
                    text: "surprising to them.",
                  },
                ],
              },
              {
                n: 33,
                text: "What claim is made by the designers of the cobblestone mats?",
                options: [
                  {
                    id: "A",
                    text: "They need to be used continuously in order to have a lasting effect.",
                  },
                  {
                    id: "B",
                    text: "They would be as beneficial to younger people as to older people.",
                  },
                  {
                    id: "C",
                    text: "They could be an effective alternative to medical intervention.",
                  },
                  {
                    id: "D",
                    text: "Their effects may vary depending on individual users.",
                  },
                ],
              },
              {
                n: 34,
                text: "Which of the following points does the writer make in the final paragraph?",
                options: [
                  {
                    id: "A",
                    text: "People should question new theories that scientists put forward.",
                  },
                  {
                    id: "B",
                    text: "High prices do not necessarily equate to a quality product.",
                  },
                  {
                    id: "C",
                    text: "People are setting up home in the country for health reasons.",
                  },
                  {
                    id: "D",
                    text: " The natural environment is fast disappearing.",
                  },
                ],
              },
            ],
          },
          {
            type: "summary_complete",
            heading: "Questions 35–40",
            title: "Choose ONE WORD ONLY from the passage for each answer.",
            sub: "Complete the notes below.",
            items: [
              {
                text: "In their research, Brantingham and Beekman looked at the complex physical",
              },
              { n: 35 },
              {
                text: " of the foot and noted that the surfaces of modem environments restrict its movement. They invented a mat which they tried out on factory workers. Whenever the workers walked on it, the different levels of ",
              },
              { n: 36 },
              {
                text: " in the mat would encourage greater muscle action. In turn, this lessened the effect of ",
              },
              { n: 37 },
              {
                text: " on the cardiovascular system. ",
              },
            ],
          },
          {
            type: "summary_complete",
            items: [
              {
                text: " Similar research was undertaken by John Fisher and colleagues in Oregon. As a result of their findings, they decided to market cobblestone mats to the elderly as a means of dealing with ",
              },
              { n: 38 },
              {
                text: " to their work. What's more, a lot of lawyers' time is spent writing ",
              },
              { n: 39 },
              {
                text: " will also improve. Finally, Benno Nigg at Calgary University believes that specially shaped ",
              },
              { n: 40 },
              {
                text: "on shoes should give health benefits.",
              },
            ],
          },
        ],
      },
    ],
  },
];

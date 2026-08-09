export const READING9_ANSWER_KEY = {
  1: "TRUE",
  2: "TRUE",
  3: "NOT GIVEN",
  4: "NOT GIVEN",
  5: "FALSE",
  6: "surface",
  7: "weight loss",
  8: "name",
  9: "container",
  10: "behaviour",
  11: "focus groups",
  12: "simple surveys",
  13: "instincts",

  14: "visual memory",
  15: "direction",
  16: "destination",
  17: "landmarks",
  18: "albatross",
  19: "C",
  20: "B",
  21: "C",
  22: "G",
  23: "C",
  24: "F",
  25: "G",
  26: "D",

  27: "A",
  28: "C",
  29: "B",
  30: "A",
  31: "C",
  32: "F",
  33: "E",
  34: "C",
  35: "D",
  36: "NO",
  37: "NO",
  38: "NO",
  39: "NOT GIVEN",
  40: "YES",
};
export const Reading9Passage = [
  {
    id: 1,
    label: "Passage 1",
    title: "Why good ideas fail",
    subtitle: "",
    text: `As part of a marketing course, two marketing experts comment on a hypothetical case study involving TF, a fiction retail giant specializing in home furnishing. The experts give concrete solutions and advice to assist students.

Hypothetical case study:

TF became a retail success in the 1970s when it succeeded in spotting homeware trends and meeting the needs of its then trendy young customers. However; by 2004, the IF stores were failing and a rethink was clearly necessary. Tibal Fisher, TF's founder and CEO, decided to change its focus under the new brand name of TVs Nextstage. His aim was to recapture the now ageing customers that had given him his early success and target consumers aged 60+ with devices and gadgets specifically designed to assist them with the problems associated with ageing: mobile phones with screens that were easy to read; kitchen gadgets with comfortable grips; electronic devices that were easy to set and adjust. TF’s market research proved to be very positive, showing strong consumer support for the products

In 2007, the stores were remodelled at a cost of US $40 million and the new brand was launched. Each store was made more comfortable and featured a coffee shop to help increase traffic - Tibal had predicted that if they could get customers into the stores then the products would sell themselves. However, by 2009 it was clear that the idea was a failure and the stores consistently remained empty. Customers complained that the new stores felt like a senior center and reminded them that they were growing old.

Feedback from expert

Expert 1: Donna Sturgess, global head of innovation, GlaxoSmithKline

The TReam's customer research efforts are a classic case of missing the subconscious associations at work in consumers' minds. Tlbal and his executives looked only at surface attitudes. Since those attitudes make up a relatively small part of the total consumer response, the executives are clueless about the reason for the poor sales. It's critical for companies to understand that every customer relates to a brand emotionally, and it’s those emotions that trigger - or block - purchases

That's why we’ve focused on using emotional strategies behind branding for a number of years now. A great example Is Alli (pronounced 'ally'), a drug to aid weight loss. The product deals with a highly emotional issue, so in marketing it, we faced the same challenge that the new TFstores are facing: the very thought of buying the product reminds customers that they have problems they feel negatively In the case of TF’s Nextstage, the problems are age and infirmity. In the case of Alli, the problems are excessive weight and all consequences. There's always a risk that consumers' negative feelings will discourage them from starting or staying on a diet. So, after extensive market research, we took a number of steps to inject emotions into the whole process of using the product.

First we came up with a name that sounds like a helpful partner. We also aimed to make the container both beautiful and functional — something that didn’t just hold pills but could later be used to store diet guides and recipes. Traditional market research is unlikely to uncover Ideas like this, so we use a wide variety of techniques. Even simple techniques such as one-on-one interviews, or ethnographical observation that involves going into people's houses to examine their behaviour, can provide valuable data.

Expert 2: Alex Lee, president of 0X0 International, maker of 0X0 Good Grips household products

This retailer can get back on track by remembering a principle that applies to consumers In general and those aged 60+ in particular: they’re attracted by brands they associate with the type of people they’d like to be - not the type they really are. That's why marketing campaigns for surf gear feature surfers, not the city dwellers who will wear the products while doing their shopping

was reminded of this principle few years ago when we wanted to find out how far we could apply our design philosophy of makings things easier to use in order to move from our core business, kitchen tools, into other products. We conducted what are known as focus groups, where participants were asked to look at photos of people and pick those they are perceived to be users and nonusers of our products. Consistently they picked people who looked fit as the sort who would use our products, and people who look old and boring as the sort who wouldn't. Yet the participants, all owners of our products, looked a lot more like the later than the former
Although the needs of elderly users and those with deteriorating vision or dexterity are very much taken into consideration when we develop new designs, we try to offer that appeal to 20- and 30-year-olds. We believe that referring to these products as helping tools would serve only to harm the brand in our customers' eyes. That's why our philosophy of universal design, which involves creating products that are comfortably useable by the largest possible range of people, is never explicitly stated as part of our marketing position.

We’ve found that market research does not need to be very sophisticated. For instance, we have conducted simple surveys in the lobby of our building offering free products in exchange for people's opinions. Some may call this unscientific but we have uncovered great insights this way. Sometimes the most important signals come from an executive's own instincts. In Tibal fisher's case, this could have told him what his surveys and focus groups didn't: 60-plus-year-olds won't support a business that expects them to act their age. `,
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
            text: "The TF Nextstage stores planned to sell products to make life easier for older people.",
          },
          {
            n: 2,
            text: "TF's market research indicated that people liked the products.",
          },
          {
            n: 3,
            text: "It cost more than expected to remodel the TF stores.",
          },
          {
            n: 4,
            text: "The TF Nextstage coffee shops sold their own brand of food and drink.",
          },
          {
            n: 5,
            text: "TF Nextstage customers liked the atmosphere in the new stores.",
          },
        ],
      },
      {
        type: "short",
        heading: "Questions 6–13",
        title: "Complete the notes below.",
        sub: "Choose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 6-13 on your answer sheet.",
        bulletPoint: true,
        questionTitle: "Feedback from experts",
        themeTitle: "Donna Sturgess — Problems with customer research",
        items: [
          {
            n: 6,
            text: "TF team limited their research to attitudes that occur at a",
            afterText: "level in customers' minds",
          },
        ],
      },
      {
        type: "short",
        bulletPoint: true,
        themeTitle: "How my company dealt with a similar problem",
        items: [
          { n: "example", text: "Product: Alli" },
          { n: 7, text: "Use: help people achieve" },
          {
            n: 8,
            text: "Marketing aim: giving the product a",
            afterText: "that seems helpful and supportive",
          },
          { n: 9, text: "Giving the product a reusable" },
        ],
      },
      {
        type: "short",
        bulletPoint: true,
        themeTitle: "Market research",
        items: [
          { n: "example", text: "Does not need to be complex" },
          {
            n: 10,
            text: "Good information can come from interviews or studying the",
            afterText: "of consumers in the home",
          },
        ],
      },
      {
        type: "short",
        bulletPoint: true,
        themeTitle: "Alex Lee — Problem",
        items: [
          {
            n: "example",
            text: "Customers are attracted to the ideal not the reality, e.g. ads for surf gear",
          },
        ],
      },
      {
        type: "short",
        bulletPoint: true,
        themeTitle: "How my company dealt with a similar problem",
        items: [
          {
            n: 11,
            text: "We organised",
            afterText:
              "to find out what images customers associate with our products",
          },
          {
            n: "example",
            text: "we do not call our products helping tools in our marketing campaigns",
          },
        ],
      },
      {
        type: "short",
        bulletPoint: true,
        themeTitle: "Market research",
        items: [
          { n: 12, text: "Can be as basic, e.g. by doing" },
          { n: 13, text: "Company executives should follow their" },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Passage 2",
    title: "Orientation of birds",
    subtitle:
      "Katherine Mansfield was a modernist writer of short fiction who was born and brought up in New Zealand",
    text: `
    A

For many of US, the way birds are able to orientate is both astounding and difficult to appreciate fully. For instance, the annual migration of tire golden plover of the Pacific takes it from Alaska to Hawaii on a flight of well over 3000 kilometres, and if it were to deviate by only one degree, it would miss the island on which it nests.

B

The first systematic studies on orientation in birds were made possible by the ‘homing instinct’ exhibited by so many species. Birds are caught at a time when they show an attachment to their territory, especially during the nesting season. They are taken to some spot, released, and the percentage of returns is recorded. The distance can be varied, and the direction, as well as the method of transporting them, and then the influence of climatic and other factors on their ability to find their way home can be studied. These experiments have shown a wide variation in ability to home, and three types of homing behaviour have been identified.

C

In the first type, birds methodically explore the area in which they are released until they pick up some familiar feature, and then they quickly find their way back to the nest. Such birds possess a highly developed visual memory, as experiments with pigeons have shown. Domestic pigeons have been trained to peck at a certain point on an aerial photograph, with a system of rewards, and four years later the birds were still able to respond to this training when placed on the aerial photograph. Birds’ eyes have a power of resolution two to three times greater than ours, enabling them to pick up very fine details. If a bird uses only this type of homing behaviour, however, it can only succeed if the point of release is not too far away. If the birds are transported 800 kilometres from their nest, it is only by good fortune that they find their way back as a result of long exploratory flights. Usually, the area known to a bird is its feeding territory. Released within this area, the birds soon make their return; release them outside it and far fewer return. However, if a bird is released for a second time in the same place, its visual memory comes into play, and the bird, no longer requiring tedious exploratory flights, will return much more quickly.

D

The second type of homing behaviour is shown by birds that are capable of choosing their flight direction and holding to it for the rest of their journey. How do they decide what direction to take? They appear to choose their normal migration direction even if they are released in a different place from their usual stalling point. If, for example, birds which normally fly to the north-east to reach latitude 45 degrees north are released at that latitude, they will immediately start flying north-east anyway. So if they’re released further to the west, they’ll maintain the correct direction, but fly west of their destination, and so fail to arrive.

E

The third type of homing behaviour shows the highest degree of orientation. Released at one point, the birds immediately take stock of it, compare its position with that of the nest, decide on the direction and fly off. This happens even if the birds are in a country right off their migration routes, where they have never been before. In one example, a laysan albatross returned to its nesting area on Midway Island in the middle of the Pacific, having flown over 5000 kilometres from the west coastal of the USA in just over ten days. This is a perfect example of the third type of homing, for the albatross clearly couldn’t rely on any landmarks over the vast expanse of the Pacific Ocean.

F

The percentage of successful birds varies greatly, being highest in those species with a strong migratory behaviour. Thus the lesser black-backed gull is more migratory than the herring gull and more often reaches ‘home’. Great migrants such as the swift have the highest percentage of returns. In one case, seven out of nine alpine swifts were recaptured at their nests after being displaced some 1400 kilometres; one made the journey in three days.

G

What part does heredity play in all this? Two research studies suggest that instinctive, i.e. genetically inherited, behaviour patterns play a part in navigation. The first was carried out by Ernst Schuz and it is highly significant. Schuz caught first year European storks and released them later, after the departure of the adult storks at a time when they normally make their south-west autumn migration to Africa. The recaptures showed that, in spite of thefact that there were no adults to guide them, the birds unanimously headed south-west. This was a most striking finding, for it showed that the birds had an innate and unlearned attraction for the African wintering area that they have occupied for thousands of years.

H

The case of starlings is a little different. These birds have a great aptitude for homing, but this behaviour differs in the different age groups. Birds that were shifted to the south-east of their normal migration route split into two lots. The adults, in full possession of their gift for orientation, found their wintering area by modifying their direction by 90 degrees, whereas the juveniles sought their winter quarters to the south-east of their real position.

    `,
    questions: [
      {
        type: "summary_complete",
        heading: "Questions 14–18",
        title: "Complete the summary below.",
        sub: "Choose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 14-18 on your answer sheet.\nTypes of homing behaviour",
        items: [
          { text: "First type:\nBirds rely on their sophisticated " },
          { n: 14 },
          {
            text: ". However, they are generally most successful if released within their feeding territory.\nSecond type:\nBirds select their accustomed ",
          },
          { n: 15 },
          {
            text: ", no matter where they are released. As a result, they may miss their ",
          },
          { n: 16 },
          {
            text: ".\nThird type:\nBirds orientate correctly, even when they are released in an unfamiliar place and have no ",
          },
          { n: 17 },
          { text: " to make use of. One bird with this type of skill is the " },
          { n: 18 },
          { text: "." },
        ],
      },
      {
        type: "matrix_match",
        heading: "Questions 19–22",
        title: "Which paragraph contains the following information?",
        sub: "Reading Passage 2 has eight paragraphs, A-H.\nWrite the correct letter, A-H, in boxes 19-22 on your answer sheet.\nNB You may use any letter more than once.",
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
            n: 19,
            text: "the effects of distance on some birds' ability to find their nests",
          },
          {
            n: 20,
            text: "a methodology for testing the general ability of birds to find their nests",
          },
          { n: 21, text: "one aspect of physical ability in humans and birds" },
          {
            n: 22,
            text: "how some birds' migration was delayed for experimental purposes",
          },
        ],
      },
      {
        type: "matchAnswer",
        heading: "Questions 23–26",
        sub: "Look at the following types of birds (Questions 23-26) and the list of points which the author wishes to illustrate below.\nMatch each bird with the point which it illustrates.\nWrite the correct letter, A-G, in boxes 23-26 on your answer sheet.",
        options: {
          A: "an ability to orientate without previous training",
          B: "the speed at which birds can fly",
          C: "the ability to remember things seen previously",
          D: "the effect of age on homing ability",
          E: "the strength required to fly a great distance",
          F: "a high success rate in finding nests",
          G: "the importance of seasonal cues for migrating birds",
        },
        items: [
          { num: 23, q: "domestic pigeon" },
          { num: 24, q: "alpine swift" },
          { num: 25, q: "European stork" },
          { num: 26, q: "starling" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Passage 3",
    title: "A New Voyage Round the World",
    subtitle:
      "A very old travel hook that holds an unusual place in English literature",
    text: `
    
    Part travelogue, part historical record of the Caribbean pirates, part scientific treatise, A New Voyage Round the World was William Dampier’s account of his twelve-year series of journeys around the globe from 1679 to 1691.

The wealth and novelty of Dampier’s descriptions, combined with the highly counts of his comrades’, escapades, proved so popular with a public hungry for tales of discovery and adventure that A New Voyage went into its third reprint within a year of publication. So ground­breaking was Dampier’s account that the writers Swift and Defoe were inspired to create two of the most famous books in the English language, Gulliver’s Travels and Robinson Crusoe.

Dampier’s commentators have portrayed him as an unusual, not to say peculiar, man. Notwithstanding his undoubted qualities as an observer, he has been variously characterised as aloof, arrogant, hot-tempered and a weak leader of men. When he arrived on the western coast of Australia, he promptly elected to leave and head north out of dislike for the cold of more southerly latitudes. This physical sensitivity has often been seized on by his detractors, who point out that, as a result, Dampier missed out on becoming the name forever associated with the European discovery of Australia, that honour instead going to Captain James Cook some 80 years later. Yet it should be remembered that he was able to endure a never-ending plague of discomforts and ailments in the tropics. And once, wrecked off Ascension Island in the South Atlantic Ocean, he managed with his crew to survive for five weeks without help, living entirely on turtles and goats.

What of his early life, then? Dampier was born in 1651 in Somerset, England, the son of a tenant farmer, George, and his wife Ann. His birthplace, Hymerford House, stands to this day. His parents died before he reached seniority and his guardians apprenticed the young William to a ship’s captain, the boy having shown very early inclinations to see the world’. There was nothing in his childhood to set Dampier apart from the numerous other young boys who were sent to sea at this time.

Having made brief passages to France and Newfoundland, he completed a more extended voyage to Java, where he began to learn the art of navigation. Returning briefly to Somerset, a neighbour offered Dampier a position overseeing his plantation in Jamaica, which he took up for a time, but he soon returned to sea on a trading voyage among the Caribbean islands. From the viewpoint of posterity, the most significant aspect of this time was that, as plantation manager, Dampier first started to keep a journal.

Although Dampier wrote several books, A New Voyage Round the World is the most important and it is worth considering just why this text met with such success. Certainly, the book would not have done so well purely on the merits of Dampier’s findings regarding meteorology and natural history, even though they broke new ground at the time. What appealed more to book buyers of this era was his narrative of life among the pirates of the Caribbean islands, whom he joined for several years after leaving Jamaica. These tales of adventure among rogues and villains who had no regard for the law sparked widespread interest among his countrymen back home. More important even than this, however, it is the superb nature of Dampier’s prose, and his ability to communicate so vividly that raised the book above the common lot.

Dampier himself admits in the book’s preface that he received help with the writing of the book, and other evidence exists to suggest that he was assisted by an unknown source. But whatever outside assistance he may have had, the book still has certain problems. In particular, his observations about nature are sometimes roughly dropped into the narrative at very odd junctures and these asides can sometimes interrupt the flow of the story Dampier himself kept his observations about nature entirely separate from the main body of his travels, and we should therefore hold James Knapton responsible, as he was in charge of checking and revising Dampier’s text, and his publishing company brought the finished book to a wider audience.

Dampier’s life has been chronicled in full by numerous biographers, and I refer the reader in particular to Clennell Wilkinson’s excellent (and sadly out-of- print) 1929 biography, as well as the recent portrait by Anton Gill. In short, despite wide acclaim for his writing, Dampier was not blessed in the art of wealth accumulation Travelling with the pirates, while providing subsistence and adventure, never netted him the treasure chest that a more astute financial operative might have acquired. He died in 1715, aged sixty-three, in Colerman Street, London.

We have then a man of myriad and colourful parts, and perhaps not always the easiest of sailors to get along with because of his arrogance and hot temper. But to dwell on these aspects today is to miss the point: it is A New Voyage Round the World that should provide the most illuminating and entertaining of Dampier’s legacies. Above all, the text is studded with some wonderfully colourful expressions, and readers will enjoy some of the finest descriptions of storms in the English language, and the liberal wit throughout.
    
    `,
    questions: [
      {
        type: "mcq",
        heading: "Questions 27–31",
        title: "Choose the correct letter, A, B, C or D.",
        sub: "Write the correct letter in boxes 27-31 on your answer sheet.",
        items: [
          {
            n: 27,
            text: "Which of the following best summarises the writer's point in the first paragraph?",
            options: [
              {
                id: "A",
                text: "Dampier's book does not fall into a single category.",
              },
              {
                id: "B",
                text: "Readers were not interested in books on the subject of travel.",
              },
              {
                id: "C",
                text: "Today's readers do not appreciate the style of Dampier's writing.",
              },
              {
                id: "D",
                text: "Dampier sailed round the world more quickly than anyone before.",
              },
            ],
          },
          {
            n: 28,
            text: "The writer refers to Swift and Defoe in order to",
            options: [
              {
                id: "A",
                text: "provide information regarding Dampier's sources.",
              },
              { id: "B", text: "compare Dampier to two earlier writers." },
              { id: "C", text: "give an example of Dampier's influence." },
              { id: "D", text: "highlight two of Dampier's critics." },
            ],
          },
          {
            n: 29,
            text: "Dampier left the western coast of Australia because",
            options: [
              {
                id: "A",
                text: "he wanted to get to the north before Cook arrived.",
              },
              { id: "B", text: "he found the temperature there unpleasant." },
              { id: "C", text: "he had problems with his crews." },
              { id: "D", text: "he requested medical attention." },
            ],
          },
          {
            n: 30,
            text: "What does the writer note about Dampier in the second paragraph?",
            options: [
              { id: "A", text: "He could cope with physical hardship." },
              {
                id: "B",
                text: "He was a more adventurous explorer than Cook was.",
              },
              {
                id: "C",
                text: "He had a kinder personality than he is given credit for.",
              },
              { id: "D", text: "He was calm in a crisis." },
            ],
          },
          {
            n: 31,
            text: "What information is given about Dampier's early life?",
            options: [
              {
                id: "A",
                text: "He had a difficult relationship with the people looking after him.",
              },
              {
                id: "B",
                text: "He was different from other youths who went to sea.",
              },
              { id: "C", text: "He wanted to travel from a young age." },
              { id: "D", text: "He came from a family of sailors." },
            ],
          },
        ],
      },

      {
        type: "para_match_drag",
        heading: "Questions 32–35",
        title: "Complete the summary using the list of words, A-I, below.",
        sub: "Write the correct letter, A-I, in boxes 32-35 on your answer sheet.",
        optionsList: {
          heading: "The Text of A New Voyage Round the World",
          options: [
            { id: "A", text: "Detailed illustrations" },
            { id: "B", text: "Traveller" },
            { id: "C", text: "Nature" },
            { id: "D", text: "Editor" },
            { id: "E", text: "Writer" },
            { id: "F", text: "Scientific observations" },
            { id: "G", text: "The crew" },
            { id: "H", text: "Artist" },
            { id: "I", text: "Plain language" },
          ],
        },

        items: [
          {
            n: 32,
            text: "The success of the book cannot solely be attributed to the originality of Dampier's ___.",
          },
          {
            n: 33,
            text: "It seems certain that Dampier worked on the book with a mystery ___.",
          },
          {
            n: 34,
            text: "Descriptions of ___ were inserted into the account of Dampier's adventures in a way that distracted the reader.",
          },
          {
            n: 35,
            text: "The responsibility for the final version of the book lies with the ___.",
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
          YES: "if the statement agrees with the information",
          NO: "if the statement contradicts the information",
          "NOT GIVEN": "if there is no information on this",
        },
        items: [
          {
            n: 36,
            text: "Many people wrote biographies of Dampier as a result of personal contact with him.",
          },
          { n: 37, text: "Dampier was skilled at making money." },
          { n: 38, text: "Dampier's patience was represented by the writer." },
          {
            n: 39,
            text: "A New Voyage Round the World is considered as one of the most modern books.",
          },
          {
            n: 40,
            text: "Dampier supervised his neighbour's plantation in Jamaica.",
          },
        ],
      },
    ],
  },
];

export const READING7_ANSWER_KEY = {
  1: "C",
  2: "D",
  3: "B",
  4: "semantic",
  5: "episodic",
  6: "algebra",
  7: "metamemory",
  8: "psychological",
  9: "vocabulary",
  10: "E",
  11: "A",
  12: "C",
  13: "B",
  14: "TRUE",
  15: "FALSE",
  16: "FALSE",
  17: "TRUE",
  18: "NOT GIVEN",
  19: "TRUE",
  20: "NOT GIVEN",
  21: "E",
  22: "D",
  23: "A",
  24: "C",
  25: "C",
  26: "B",
  27: "D",
  28: "B",
  29: "A",
  30: "C",
  31: "D",
  32: "A",
  33: "D",
  34: "A",
  35: "F",
  36: "TRUE",
  37: "FALSE",
  38: "NOT GIVEN",
  39: "TRUE",
  40: "FALSE",
};

export const Reading7Passage = [
  {
    id: 1,
    label: "Passage 1",
    title: "How the mind ages",
    subtitle:
      "The way mental function changes is largely determined by three factors-mental lifestyle, the impact of chronic disease and flexibility of the mind.",
    text: `Experiments have shown that younger monkeys consistently outperform their older colleagues on memory tests. Formerly, psychologists concluded that memory and other mental functions in humans deteriorate over time because of changes in the brain. Thus mental decline after young adulthood appeared inevitable. The truth, however, is not quite so simple.

Stanley Rapoport at the National Institute of Health in the United States measured the flow of blood in the brains of old and young people as they completed different tasks. Since blood flow reflects neural activity. Rapoport could compare which networks of neurons were the same, the neural networks they used were significantly different. The older subjects used different internal strategies to accomplish comparable results at the same time,'Rapoport says. At the Georgia Institute of Technology, psychologist Timothy Salthouse compared a group of fast and accurate typists of college age with another group in their 60s. Both groups typed 60 words a minute. The older typists, it turned out, achieved their speed with cunning little strategies that made them more efficient than their younger counterparts. They made fewer finger shifts, gaining a fraction of a second here and there. They also read ahead in the test. The neural networks involved in typing appear to have been reshaped to compensate for losses in motor skills or other age changes.

In fact, there's evidence that deterioration in mental functions can actually be reversed. Neuropsychologist Marion Diamond at the University of California has shown that mental activity maks neurons sprout new dendrites* which establish connections with other neurons. The dendrites shrink when the mind is idle. For example,'when a rat is kept in isolation, the animal's brain shrinks, but if we put that rat with other rats in a large cage and give them an assortment of toys, we can show, after four days, significant differences in its brain.'says Diamond. After a month in the enriched surroundings, the whole cerebral cortex has expanded, as has its blood supply.'But even in the enriched surroundings, rats get bored unless the toys are varied. Animals are just like we are. They need stimulation,'says Diamond. A busy mental lifestyle keeps the human mind fit, says Warner Schaie of Penn State University. ‘People who regularly participate in challenging tasks retain their intellectual abilities better than mental couch potatoes.'

In his studies, Schaie detected a decline in mental function among individuals who underwent lengthy stays in hospital for chronic illness. He postulated it might be due to the mental passivity encouraged by hospital routine.

One of the most profoundly important mental functions is memory. Memory exists in more than one form, what we call knowledge- facts- is what psychologists such as Harry Bahrick of Ohio Wesleyan University call semantic memory. Events, conversations and occurrences in time and space, on the other hand, make up episodic memory. It's true that episodic memory begins to decline when most people are in their 50s, but it's never perfect at any age.

Probing the longevity of knowledge, Bahrick tested 1,000 high school graduates to see how well they remembered the school subject algebra. Some had completed the course a month before, other 50 years earlier. Surprisingly, he found that a person's grasp of algebra did not depend on how long ago he'd taken the course. The determining factor was the duration of instruction. Those who had spent only a few months learning algebra forgot most of it within two or three years while others who had been instructed for longer remembered better. According to Bahrick,'the long-term residue of knowledge remains stable over the decades, independent of the age of the person and the memory.'

Perhaps even more important than the ability to remember is the ability to manage memory- a mental function known as metamemory.'You could say metamemory is a byproduct of going to school,'says psychologist Robert Kail of Purdue University,'The question-and-answer process,especially exam taking, helps children learn and teaches them how their memory functions.This may be one reason why the better educated a person is, the more likely they are to perform well in many aspects of life and in psychological assessments: A group of adult novice chess players were compared with a group of child experts at the game. But when asked to remember the patterns of chess pieces arranged on a board, the children won.' Because they'd played a lot of chess, their knowledge of chess was better organized than that of the adults, and their existing knowledge of chess served as a framework for new memory,'explains Kail. Cognitive style, another factor in maintaining mental function, is what Schaie calls the ability to adapt and roll with life's punches.'He measured mental flexibility with questions and tests requiring people to carry out in an offbeat way an everyday activity they had done millions of times. One example was asking people to copy a paragraph substituting uppercase letters for lowercase ones. These tests seem silly, but flexible-minded people manage to complete them,'says Schaie. The rigid person responds with tension instead and performs poorly. Those who score highly on tests of cognition at an advanced age are those who tested high in mental flexibility at middle age'.

On a more optimistic note, one mental resource that only improves with time is specialized knowledge. Crystallised intelligence about one's occupation apparently does not decline at all until at least age 75. Vocabulary is another such specialized form of knowledge. Research clearly shows that vocabulary develops with time. Retired teachers and journalists consistently score higher on tests of vocabulary and general information than college students.  `,
    questions: [
      {
        type: "mcq",
        heading: "Questions 1–3",
        title: "Choose the correct letter, A, B, C or D.",
        questionTitle: "",
        items: [
          {
            n: 1,
            text: "What does the writer say about the performance of older typists on the test?",
            options: [
              {
                id: "A",
                text: "They used different motor skills from younger typists.",
              },
              {
                id: "B",
                text: "They had been more efficiently trained than younger typists.",
              },
              {
                id: "C",
                text: "They used more time-saving techniques than younger typists.",
              },
              {
                id: "D",
                text: "They had better concentration skills than younger typists.",
              },
            ],
          },
          {
            n: 2,
            text: "The experiment with the rats showed that",
            options: [
              {
                id: "A",
                text: "brain structure only changed when the rats were given a familiar toy",
              },
              {
                id: "B",
                text: "the rats became anxious after a lengthy period of time alone",
              },
              {
                id: "C",
                text: "the rats lived longer than they were part of a social group",
              },
              {
                id: "D",
                text: "the rats' brains expanded or shrank depending on the level of mental activity",
              },
            ],
          },
          {
            n: 3,
            text: "A comparison between adults and children who played chess showed that",
            options: [
              {
                id: "A",
                text: "the children were as capable as the adults at remembering a series of numbers",
              },
              {
                id: "B",
                text: "the children had better recall of the layout of pieces",
              },
              {
                id: "C",
                text: "the adults stored memories of chess moves in a more logical manner",
              },
              {
                id: "D",
                text: "the adults had clearer memories of chess games they had played",
              },
            ],
          },
        ],
      },
      {
        type: "summary_complete",
        heading: "Questions 4–9",
        sub: "Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.",
        questionTitle: "Types of memory",
        items: [
          {
            text: "Psychologists distinguish between two different types of memory: ",
          },
          { n: 4 },
          { text: " and " },
          { n: 5 },
          {
            text: " memory. A study was conducted into people's knowledge of ",
          },
          { n: 6 },
          {
            text: " to determine recall ability. This aspect of memory was found to be a function not of age but rather of length of tuition. School also helps with a brain function called ",
          },
          { n: 7 },
          {
            text: ". This is why a more highly educated person is generally more successful and does better in ",
          },
          { n: 8 },
          {
            text: " tests. Some of our mental functions remain unaffected by age or even improve. For example, as we get older, our knowledge of ",
          },
          { n: 9 },
          { text: " increases." },
        ],
      },
      {
        type: "matchAnswer",
        heading: "Questions 10–13",
        sub: "Look at the following statements and the list of people below. Match each statement with the correct person, A–E.",
        questionTitle: "List of People",
        options: {
          A: "Stanley Rapoport",
          B: "Marion Diamond",
          C: "Warner Schaie",
          D: "Harry Bahrick",
          E: "Robert Kail",
        },
        items: [
          {
            num: 10,
            q: "The educational system makes students aware of how their memory works.",
          },
          {
            num: 11,
            q: "Although older people may use a different mental approach when completing a task, they can still achieve the same result as younger people.",
          },
          {
            num: 12,
            q: "Being open to new ways of doing things can have a positive impact on your mental condition as we get older.",
          },
          {
            num: 13,
            q: "Both animals and humans need to exist in an environment full of interest.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Passage 2",
    title: "Willpower",
    subtitle: "",
    text: `
    
            A   

Although willpower does not shape our decisions, it determines whether and how long we can follow through on them. It almost single-handedly determines life outcomes. Interestingly, research suggests the general population is indeed aware of how essential willpower is to their wellbeing; survey participants routinely identify a ‘lack of willpower’ as the major impediment to making beneficial life changes. There are, however, misunderstandings surrounding the nature of willpower and how we can acquire more of it. There is a widespread misperception, for example, that increased leisure time would lead to subsequent increases in willpower.

B   

Although the concept of willpower is often explained through single-word terms, such as ‘resolve’ or ‘drive’, it refers in fact to a variety of behaviours and situations. There is a common perception that willpower entails resisting some kind of a ‘treat’, such as a sugary drink or a lazy morning in bed, in favour of decisions that we know are better for us, such as drinking water or going to the gym. Of course this is a familiar phenomenon for all. Yet willpower also involves elements such as overriding negative thought processes, biting your tongue in social situations, or persevering through a difficult activity. At the heart of any exercise of willpower, however, is the notion of ‘delayed gratification’, which involves resisting immediate satisfaction for a course that will yield greater or more permanent satisfaction in the long run.

C   

Scientists are making general investigations into why some individuals are better able than others to delay gratification and thus employ their willpower, but the genetic or environmental origins of this ability remain a mystery for now. Some groups who are particularly vulnerable to reduced willpower capacity, such as those with addictive personalities, may claim a biological origin for their problems. What is clear is that levels of willpower typically remain consistent over time (studies tracking individuals from early childhood to their adult years demonstrate a remarkable consistency in willpower abilities). In the short term, however, our ability to draw on willpower can fluctuate dramatically due to factors such as fatigue, diet and stress. Indeed, research by Matthew Gailliot suggests that willpower, even in the absence of physical activity, both requires and drains blood glucose levels, suggesting that willpower operates more or less like a ‘muscle’, and, like a muscle, requires fuel for optimum functioning.

D   

These observations lead to an important question: if the strength of our willpower at the age of thirty-five is somehow pegged to our ability at the age of four, are all efforts to improve our willpower certain to prove futile? According to newer research, this is not necessarily the case. Gregory M. Walton, for example, found that a single verbal cue – telling research participants how strenuous mental tasks could ‘energise’ them for further challenging activities – made a profound difference in terms of how much willpower participants could draw upon to complete the activity. Just as our willpower is easily drained by negative influences, it appears that willpower can also be boosted by other prompts, such as encouragement or optimistic self-talk.

E   

Strengthening willpower thus relies on a two-pronged approach: reducing negative influences and improving positive ones. One of the most popular and effective methods simply involves avoiding willpower depletion triggers, and is based on the old adage, ‘out of sight, out of mind’. In one study, workers who kept a bowl of enticing candy on their desks were far more likely to indulge than those who placed it in a desk drawer. It also appears that finding sources of motivation from within us may be important. In another study, Mark Muraven found that those who felt compelled by an external authority to exert self-control experienced far greater rates of willpower depletion than those who identified their own reasons for taking a particular course of action. This idea that our mental convictions can influence willpower was borne out by Veronika Job. Her research indicates that those who think that willpower is a finite resource exhaust their supplies of this commodity long before those who do not hold this opinion.

F   

Willpower is clearly fundamental to our ability to follow through on our decisions but, as psychologist Roy Baumeister has discovered, a lack of willpower may not be the sole impediment every time our good intentions fail to manifest themselves. A critical precursor, he suggests, is motivation – if we are only mildly invested in the change we are trying to make, our efforts are bound to fall short. This may be why so many of us abandon our New Year’s Resolutions – if these were actions we really wanted to take, rather than things we felt we ought to be doing, we would probably be doing them already. In addition, Muraven emphasises the value of monitoring progress towards a desired result, such as by using a fitness journal, or keeping a record of savings toward a new purchase. The importance of motivation and monitoring cannot be overstated. Indeed, it appears that, even when our willpower reserves are entirely depleted, motivation alone may be sufficient to keep us on the course we originally chose.
    
            `,
    questions: [
      {
        type: "tfng",
        heading: "Questions 14–20",
        title:
          "Do the following statements agree with the information in the text?",
        sub: "Choose TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        optionLabels: {
          TRUE: "if the statement agrees with the information",
          FALSE: "if the statement contradicts the information",
          "NOT GIVEN": "if there is no information on this",
        },
        questionTitle: "",
        items: [
          {
            n: 14,
            text: "Willpower is the most significant factor in determining success in life.",
          },
          {
            n: 15,
            text: "People with more free time typically have better willpower.",
          },
          {
            n: 16,
            text: "Willpower mostly applies to matters of diet and exercise.",
          },
          {
            n: 17,
            text: "The strongest indicator of willpower is the ability to choose long-term rather than short-term rewards.",
          },
          {
            n: 18,
            text: "Researchers have studied the genetic basis of willpower.",
          },
          {
            n: 19,
            text: "Levels of willpower usually stay the same throughout our lives.",
          },
          {
            n: 20,
            text: "Regular physical exercise improves our willpower ability.",
          },
        ],
      },

      {
        type: "matrix_match",
        heading: "Questions 21–26",
        title: "Look at the following statements and the list of people below.",
        sub: "Match each statement with the correct person, A, B, C, D or E.\nWrite the correct letter, A–E, in boxes on your answer sheet.",
        optionsList: {
          heading: "List of Mapmakers",
          options: [
            { id: "A", text: "Matthew Gailliot" },
            { id: "B", text: "Gregory M. Walton" },
            { id: "C", text: "Mark Muraven" },
            { id: "D", text: "Veronika Job" },
            { id: "E", text: "Roy Baumeister" },
          ],
        },
        items: [
          {
            n: 21,
            text: "identified a key factor that is necessary for willpower to function.",
          },
          {
            n: 22,
            text: "suggested that willpower is affected by our beliefs.",
          },
          {
            n: 23,
            text: "examined how our body responds to the use of willpower.",
          },
          {
            n: 24,
            text: "discovered how important it is to make and track goals.",
          },
          {
            n: 25,
            text: "found that taking actions to please others decreases our willpower.",
          },
          {
            n: 26,
            text: "found that willpower can increase through simple positive thoughts.",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Passage 3",
    title: "Global Warming in New Zealand 2",
    subtitle: "",
    text: `
    
            A

New Zealand is expected to warm by about 3°C over the next century. The northern polar regions will be more than 6°C warmer, while the large continents – also the largest centres of population – will be 4°C or warmer. In contrast, the Southern Ocean, which surrounds New Zealand, may warm by only 2°C. The sea will act as an air conditioner and in this aspect, New Zealand’s location is comparatively fortunate.

B

Any predictions are complicated by the variability of New Zealand’s climate. The annual temperature can fluctuate as much as 1°C above or below the long-term average. The early summer of 2006-7, for instance, was notably cool, thanks in part to the iceberg that drifted up the east coast. A few months later, warm water from the Tasman Sea helped make May 2007 unusually hot. These variables will continue unaffected so that, although the general pattern will be for rising temperatures, the warming trend may not be uniform.

C

The Ocean to the south of New Zealand will have one important effect. As the world warms, the great bank of west winds that circle Antarctica will become stronger. This has already been observed, and its impact on New Zealand is likely to be profound, stronger, more frequent west winds will bring increased, sometimes catastrophic rainfall to the west coast of the country and create drier conditions in some eastern regions that are already drought-prone. At the same time, the general warming will spread south.

D

Furthermore, in the drier regions, the average moisture deficit – that is, the difference between the amount of water in soils available to plants and the amount plants need for optimum growth – will increase. Soils could go into moisture deficit earlier in the growing season and the deficits could last longer into autumn that at present. What we think of today as a medium-severity drought could be an almost annual occurrence by the end of the century. One direct consequence of warmer – and shorter – winters will be a reduction in snow cover. The permanent snow line in the mountains will rise, while snow cover below this will be shorter-lived. The amount of snow that falls may actually increase, however, even in some northern centres, owing to the intensification of precipitation, Ski-field base station may eventually have to be moved upwards to be within reach of the new snow line but there could still be plenty of the white stuff up there.

E

There will also be a marked impact on New Zealand’s glaciers. Over the last 100 years, the glaciers have been reduced by 35%, although since 1978 increase snowfall has offset the effect of warming. The latest studies conducted by the National Institute for Water and Atmospheric. Research (NIWA), however, suggest that by the end of the century, warming over the Southern Alps could be significantly greater than over the rest of the country.

F

Sea levels around New Zealand have risen by 25cm since the middle of the 9th century and by 7 cm since 1990. Predictions for the coming years cover a wide range, however, partly because of unknown rises resulting from the melting of the ice in the Arctic, Greenland and Antarctica. In addition, sea level at any given time is affected by many different factors, one of which is called storm surge. When a Coincides with a high tide along low lying coastal areas, this bulge raises the tide higher than normal, creating. Surge not unlike a slow-motion tsunami. Not only does a rise in sea level increase the potential for his sort damage, but it also has less immediate impacts. The one potentially grave outcome is that groundwater systems may become contaminated with saltwater, spoiling them for the irrigation of farmland, which in turn could diminish crop harvests. Similarly, over time, estuaries may be enlarged by erosion as tidal influences reach further upstream, altering the contours of whole shorelines and initiating further unforeseen consequences.

G

The impacts these changes will have on New Zealand are difficult to generalize. Human systems are better able to adapt to change than natural ecosystems because humans can see a problem coming and plan a response. Farmers and horticulturalists have made considerable advances, replacing crops they grow to better suit the new conditions. However, plant breeders will need to show considerable ingenuity if they can overcome the acute water shortages that are forecast.

H

For natural ecosystems the rate of change is crucial. If it is low, the plants and animals and fish will be able to ‘keep up’; if it is high, only the most adaptable species-those that can survive in the widest range of ecological niches-are likely to survive. Species adapted to only a narrow range of conditions or food sources will find adaptation much more difficult. Take tuatara, for instance. Their sex is determined by the temperature at which the eggs are incubated in warm (currently above 22 °C) condition become predominately male – and now males already outnumber females by nearly two to one in some island refuges. In the mountains, as the permanent snow line moves upwards, the tolerance zones of some alpine plants and animals may simply disappear. It should also be remembered that global warming is just that – a global phenomenon. ‘New Zealand’s own greenhouse emissions are tiny – around 0.5% of the global total. Even if New Zealanders were to achieve the government’s target of carbon neutrality, this would have no discernable impact on global climate change.

I

The changes that global warming is going to bring to New Zealand during the 21st century are going to be significant, but where the country is likely to be most vulnerable is with respect to climate change elsewhere. New Zealand may warm more slowly than most places, but if its major export markets undergo damaging change, the economic impact will be severe.
    
            `,
    questions: [
      {
        type: "mcq",
        heading: "Questions 27–32",
        title: "Choose the correct letter, A, B, C or D.",
        questionTitle: "",
        items: [
          {
            n: 27,
            text: "What is the main idea of the first paragraph?",
            options: [
              {
                id: "A",
                text: "The air condition in New Zealand will maintain a high quality because of the ocean",
              },
              {
                id: "B",
                text: "The Southern Ocean will remain at a constant strength",
              },
              { id: "C", text: "The continents will warm more than the point" },
              {
                id: "D",
                text: "New Zealand will not warm as much as other countries in the next century because it is surrounded by sea",
              },
            ],
          },
          {
            n: 28,
            text: "What does the writer say about New Zealand's variable weather?",
            options: [
              {
                id: "A",
                text: "Temperature changes of 1°C will not seem important in future",
              },
              {
                id: "B",
                text: "Variable weather will continue, unchanged by global warming",
              },
              {
                id: "C",
                text: "There was an unusually small amount of variation in 2006-2007",
              },
              {
                id: "D",
                text: "Summer temperatures will vary but winter ones will be consistent",
              },
            ],
          },
          {
            n: 29,
            text: "What is the predicted impact of conditions in the ocean to the south of New Zealand?",
            options: [
              {
                id: "A",
                text: "New Zealand will be more affected by floods and droughts",
              },
              {
                id: "B",
                text: "Antarctica will not be adversely affected by warming",
              },
              {
                id: "C",
                text: "The band of west winds will move further to the south",
              },
              {
                id: "D",
                text: "The usual west wind will no longer be reliable",
              },
            ],
          },
          {
            n: 30,
            text: "The writer mentions 'moisture deficit' to show",
            options: [
              { id: "A", text: "The droughts will be shorter but more severe" },
              { id: "B", text: "How the growing season will become longer" },
              { id: "C", text: "How growing conditions will deteriorate" },
              {
                id: "D",
                text: "That farmers should alter the make-up of soils",
              },
            ],
          },
          {
            n: 31,
            text: "What are the implications of global warming for New Zealand's future?",
            options: [
              { id: "A", text: "Skiing may move to lower altitude in future" },
              {
                id: "B",
                text: "The ski season will be later in the year than at present",
              },
              {
                id: "C",
                text: "The northern ski field will have to move to the south",
              },
              {
                id: "D",
                text: "Warming may provide more snow for some ski locations",
              },
            ],
          },
          {
            n: 32,
            text: "The writer refers to NIWA's latest studies in the 3rd paragraph to show",
            options: [
              {
                id: "A",
                text: "how a particular place could be affected by warming",
              },
              {
                id: "B",
                text: "that the warming trend has been intensifying since 1978",
              },
              {
                id: "C",
                text: "that freezing levels will rise throughout the century",
              },
              {
                id: "D",
                text: "how the growth of glaciers is likely to cause damage",
              },
            ],
          },
        ],
      },
      {
        type: "matchAnswer",
        heading: "Questions 33–35",
        sub: "Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        questionTitle: "Rising sea levels",
        options: {
          A: "agriculture production",
          B: "tropical waters",
          C: "tidal waves",
          D: "polar regions",
          E: "global warming",
          F: "coastal land",
          G: "high tides",
        },
        items: [
          {
            num: 33,
            q: "The extent of future sea level rises around New Zealand is uncertain and may be determined in the",
          },
          { num: 34, q: "Higher sea levels can lead to reduced" },
          { num: 35, q: "and result in changes to the shape of" },
        ],
      },
      {
        type: "tfng",
        heading: "Questions 36–40",
        title:
          "Do the following statements agree with the information given in Reading Passage?",
        sub: "In boxes on your answer sheet, write",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        questionTitle: "",
        optionLabels: {
          TRUE: "if the statement is true",
          FALSE: "if the statement is false",
          "NOT GIVEN": "if the information is not given in the passage",
        },
        items: [
          {
            n: 36,
            text: "The natural world is less responsive to challenges than humans.",
          },
          {
            n: 37,
            text: "The agricultural sector is being too conservative and resistant to innovation.",
          },
          {
            n: 38,
            text: "The global warming is slow; it will affect different regions in different ways.",
          },
          {
            n: 39,
            text: "The tuatara is vulnerable to changes in climate conditions.",
          },
          {
            n: 40,
            text: "New Zealand must reduce carbon emissions if global warming is to be slowed.",
          },
        ],
      },
    ],
  },
];

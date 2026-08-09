export const READING5_ANSWER_KEY = {
  1: "TRUE",
  2: "NOT GIVEN",
  3: "FALSE",
  4: "NOT GIVEN",
  5: "NOT GIVEN",
  6: "FALSE",
  7: "TRUE",
  8: "symbols",
  9: "titles",
  10: "stenciling",
  11: "books",
  12: "painting",
  13: "400",

  14: "",
  15: "",
  16: "",
  17: "",
  18: "",
  19: "",
  20: "",
  21: "",
  22: "",
  23: "",
  24: "",
  25: "",
  26: "",

  27: "NOT GIVEN",
  28: "NOT GIVEN",
  29: "TRUE",
  30: "FALSE",
  31: "FALSE",
  32: "FALSE",
  33: "NOT GIVEN",
  34: "NO",
  35: "escapers",
  36: "genetics",
  37: "Okinawa",
  38: "exercise",
  39: "wealth",
  40: "Worms",
};

export const Reading5Passage = [
  {
    id: 1,
    label: "Passage 1",
    title: "Australian artist Margaret Preston",
    subtitle: "",
    text: `Margaret Preston's vibrant paintings and prints of Australian flowers, animals and landscapes have delighted the Australian public since the early 1920s.

Margaret Preston was born Margaret Rose McPherson in Port Adelaide, South Australia in 1875, the daughter of David McPherson, a Scottish marine engineer and his wife Prudence Lyle. She and her sister were sent at first to a private school, but when family circumstances changed, her mother took the girls to Sydney where Margaret attended a public high school. She decided early in life to become an artist and took private art lessons. In 1888, she trained for several months with Sydney landscape painter William Lister, and in 1893 enrolled at the National Gallery of Victoria Art School, where she studied for just over four years.

In 1898, after her father died, Margaret returned to Adelaide to study and then teach at the Adelaide School of Design. Her early artwork was influenced by the German aesthetic tradition, in which subjects of the natural world were depicted in a true to life manner.

Margaret's first visit to Europe in 1904, and her studies in Paris, France had little impact on this naturalism that dominated her work from this early period. However some eight years later, after returning to Paris, she began to recognise the decorative possibilities of art.

With the outbreak of the First World War, Margaret traveled to England, where she had exhibitions and continued her studies of art. She was a student of pottery, but at some time developed her interest in various techniques of printmaking and design. In England's West Country, she taught basket weaving at a rehabilitation unit for servicemen. It was on board a boat returning to Australia that she met wealthy businessman William Preston, whom she married in 1919. Together Margaret and William settled in the Sydney harbourside suburb of Mosman. The most characteristic prints from her early years in Sydney are views of boats floating on Sydney Harbour and of houses clustered on foreshore hills. Although Sydney was their home, the couple traveled regularly, both overseas and within Australia.

Her first major showing in Australia was with her friend Thea Proctor, in exhibitions in Melbourne and Sydney in 1925. Many of Preston's prints were hand-coloured in rich scarlet reds, blues and greens, and all of them were set in Chinese red lacquer frames. Harbour views were again prominent, but in comparison with earlier artworks, they were compact and busy. using striking contrasts of black and white combined with elaborate patterns and repetitions. Other prints from this period featured native flora. It was with these still-life subjects that she convinced the public that Australian native flowers were equal in beauty to any exotic species.

From 1932 to 1939, Preston moved away from Sydney and lived with her husband at Berowra, on the upper reaches of the Hawkesbury River. The area was one of rugged natural beauty, and for the first time Preston found herself living in a home surrounded bush. Prior to this, the native flowers that featured in her paintings and prints had been purchased from local florists; they now grew in abundance around her home. Preston's prints became larger, less complex and less reliant on the use of bright colours. Flowers were no longer arranged in vases, and Preston began to concentrate instead on flowers that were growing wild.

While living at Berowra, and undoubtedly prompted by the Aboriginal' rock engravings found near her property, Preston also developed what was to he a lifelong interest in Aboriginal art. On returning to Sydney in 1939, she became a member of the Anthropological Society of New South Wales, and later visited many important Aboriginal sites throughout Australia. Preston believed that Aboriginal art provided the key to establishing a national body of art that reflected the vast and ancient continent of Australia.

During the 1940s, symbols used by Aboriginal people, together with dried, burnt colours found in traditional Aboriginal paintings, became increasingly prominent in her prints. The artist's titles from this period frequently acknowledge her sources, and reveal the extent to which she drew inspiration from traditional Aboriginal art to create her own art.

It was in 1953, at the age of 78, that Preston produced her most significant prints. The exhibition at Macquarie Galleries in Sydney included 29 prints made using the ancient technique known as stenciling. Many of the artworks in the exhibition incorporated her fusion of Aboriginal and Chinese concepts. Preston had admired Chinese art since 1915, when she acquired the first of her many books on the subject, and she had visited China on two occasions. Chinese elements may be found in several of her earlier paintings.

However, in her prints of the 1950s, Preston combined Chinese ideas with her understanding of the Dreamtime' creation stories of Aboriginal Australians. Preston did not let age alter her habit of working hard. As she got older, her love of painting, printmaking and travel continued. By the time of her death in 1963, when she was 88, she had produced over 400 paintings and prints. In a career spanning almost 60 years, she created a body of work that demonstrates her extraordinary originality and the intensity of her commitment to Australian art. `,
    questions: [
      {
        type: "tfng",
        heading: "Questions 1–7",
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
            text: "Artists in the German aesthetic tradition portrayed nature realistically.",
          },
          {
            n: 2,
            text: "Margaret attended a famous art college in Paris.",
          },
          {
            n: 3,
            text: "Margaret met her husband William while teaching a craft at a rehabilitation unit.",
          },
          {
            n: 4,
            text: "Margaret Preston and Thea Proctor explored similar themes in their art.",
          },
          {
            n: 5,
            text: "Margaret's 1925 artworks of Sydney Harbour were simpler than her previous ones.",
          },
          {
            n: 6,
            text: "The colours in Margaret's Berowra prints were very bright.",
          },
          {
            n: 7,
            text: "When living in Berowra, Margaret painted flowers in their natural location.",
          },
        ],
      },
      {
        type: "short",
        heading: "Questions 8–13",
        title: "Answer the questions below.",
        sub: "Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.",
        bulletPoint: true,
        questionTitle: "Margaret Preston's later life",
        themeTitle: "Aboriginal influence",
        items: [
          {
            num: "example",
            text: "interest in Aboriginal art was inspired by seeing rock engravings close to her Berowra home",
          },
          {
            n: 8,
            text: "Incorporated",
            afterText: "and colours from Aboriginal art in her own work",
          },
          {
            n: 9,
            text: "Often referred to Aboriginal sources in the",
            afterText: "she gave her artworks",
          },
        ],
      },
      {
        type: "short",
        bulletPoint: true,
        themeTitle: "1953 exhibition",
        items: [
          {
            n: 10,
            text: "very old method of",
            afterText: "was used for some prints",
          },
          {
            n: 11,
            text: "was inspired by",
            afterText:
              "about Chinese art that she had started collecting in 1915 combination of Chinese and Aboriginal elements",
          },
        ],
      },
      {
        type: "short",
        bulletPoint: true,
        themeTitle: "Old age",
        items: [
          {
            n: 12,
            text: "still interested in",
            afterText: "and art",
          },
          {
            n: 13,
            text: "worked for nearly six decades making more than",
            afterText: "artworks ",
          },
          {
            n: "example",
            text: "dedicated n to Australian art and the originality of her work is seen in Preston's long career",
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
    text: `[Paragraph A] The law influences all of us virtually all the time, it governs almost all aspects of our behavior, and even what happens to us when we are no longer alive. It affects us from the embryo onwards. It governs the air we breathe, the food and drink we consume, our travel, family relationships, and our property. It applies at the bottom of the ocean and in space.

Each time we examine a label on a food product, engage in work as an employee or employer, travel on the roads, go to school to learn or to teach, stay in a hotel, borrow a library book, create or dissolve a commercial company, play sports, or engage the services of someone for anything from plumbing a sink to planning a city, we are in the world of law.


[Paragraph B] Law has also become much more widely recognised as the standard by which behavior needs to be judged. A very telling development in recent history is the way in which the idea of law has permeated all parts of social life. The universal standard of whether something is socially tolerated is progressively becoming whether it is legal, rather than something that has always been considered acceptable. In earlier times, most people were illiterate.

Today, by contrast, a vast number of people can read, and it is becoming easier for people to take an interest in law, and for the general population to help actually shape the law in many countries. However, law is a versatile instrument that can be used equally well for the improvement or the degradation of humanity.

[Paragraph C] This, of course, puts law in a very significant position. In our rapidly developing world, all sorts of skills and knowledge are valuable. Those people, for example, with knowledge of computers, the internet, and communications technology are relied upon by the rest of us.

There is now someone with IT skills or an IT help desk in every UK school, every company, every hospital, every local and central government office. Without their knowledge, many parts of commercial and social life today would seize up in minutes. But legal understanding is just as vital and as universally needed. The American comedian Jerry Seinfeld put it like this, 'We are all throwing the dice, playing the game, moving our pieces around the board, but if there is a problem, the lawyer is the only person who has read the inside of the top of the box.' In other words, the lawyer is the only person who has read and made sense of the rules

[Paragraph D] Gilbert was first interested in chemistry but later changed his focus due to the large portion of mysticism of alchemy involved (such as the transmutation of metal). He gradually developed his interest in physics after the great minds of the ancient, particularly about the knowledge the ancient Greeks had about lodestones, strange minerals with the power to attract iron. In the meantime, Britain became a major seafaring nation in 1588 when the Spanish Armada was defeat­ed, opening the way to British settlement of America. British ships depended on the magnetic compass, yet no one understood why it worked. Did the Pole Star attract it, as Columbus once speculated; or was there a magnetic mountain at the pole, as described in Odyssey, which ships would never approach, because the sail­ors thought its pull would yank out all their iron nails and fittings? For nearly 20 years, William Gilbert conducted ingenious experiments to understand magnet­ism. His works include On the Magnet, Magnetic Bodies, and the Great Magnet of the Earth.

The number of laws has never been greater. In the UK alone, about 35 new Acts of Parliament are produced every year, thereby delivering thousands of new rules. The legislative output of the British Parliament has more than doubled in recent times from 1,100 pages a year in the early 1970s,to over 2,500 pages a year today. Between 1997 and

2006,the legislature passed 365 Acts of Parliament and more than 32,000 legally binding statutory instruments. In a system with so much law, lawyers do a great deal not just to vindicate the rights of citizens and organizations but also to help develop the law through legal arguments, some of which are adapted by judges to become laws. Law courts can and do produce new law and revise old law, but they do so having heard the arguments of lawyers.

[Paragraph E] However, despite their important role in developing the rules, lawyers are not universally admired. Anti-lawyer jokes have a long history going back to the ancient Greeks.

More recently the son of a famous Hollywood actor was asked at his junior school what his father did for a living, to which he replied,'My daddy is a movie actor, and sometimes he plays the good guy, and sometimes he plays the lawyer. For balance, though, it Is worth remembering that there are and have been many heroic and revered lawyers such as the Roman philosopher and politician Cicero and Mahatma Gandi, the Indian campaigner for independence.

[Paragraph F] People sometimes make comments that characterise lawyers as professionals whose concerns put personal reward above truth, or who gain financially from misfortune. There are undoubtedly lawyers that would fit that bill, Just as there are some scientists, Journalists and others In that category, But, In general, it is no more Just to say that lawyers are bad because they make a living from people's problems than it is to make the same accusation In respect of nurses or IT consultants, A great many lawyers are involved in public law work, such as that Involving civil liberties, housing and other Issues. Such work Is not lavishly remunerated and the quality of the service provided by these lawyers relies on considerable professional dedication, Moreover, much legal work has nothing to do with conflict or misfortune, but is primarily concerned with drafting documents, Another source of social disaffection for lawyers, and disaffection for the law, is a limited public understanding of how law works and how It could be changed. Greater clarity about these issues, maybe as a result of better public relations, would reduce many aspects of public dissatisfaction with the law.
`,
    headingsList: [
      { id: "i", text: "Different areas of professional expertise" },
      { id: "ii", text: "Reasons why it is unfair to criticise lawyers" },
      { id: "iii", text: "The disadvantages of the legal system" },
      { id: "iv", text: "The law applies throughout our lives" },
      { id: "v", text: "The law has affected historical events" },
      { id: "vi", text: "A negative regard for lawyers" },
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
        type: "multiChoiceMCQ",
        heading: "Questions 20–21",
        title: "Write your answers in boxes 20-21 on your answer sheet.",
        sub: "Choose THREE letters A-E.",
        items: [
          {
            n: [20, 21],
            q: "Which TWO of the following statements does the writer make about legal skills in today's world?",
            opts: [
              "There should be a person with legal training in every hospital.",
              "Lawyers with experience in commercial law are the most in demand.",
              "Knowledge of the law is as important as having computer skills.",
              "Society could not function effectively without legal experts.",
              "Schools should teach students about the law.",
            ],
          },
        ],
      },
      {
        type: "summary_complete",
        heading: "Questions 27–32",
        title: "Choose ONE WORD ONLY from the passage for each answer.",
        sub: "Complete the notes below.",
        items: [
          {
            text: " Lawyers as professionals People sometimes say that ",
          },
          { n: 22 },
          {
            text: " is of little interest to lawyers, who are more concerned with making money. This may well be the case with some individuals, in the same way that some ",
          },
          { n: 23 },
          {
            text: " or scientific experts may also be driven purely by financial greed. However, criticising lawyers because their work is concerned with people's problems would be similar to attacking IT staff or ",
          },
          { n: 24 },
          {
            text: " for the same reason. In fact, many lawyers focus on questions relating, for example, to housing or civil liberties, which requires them to have ",
          },
          { n: 25 },
          {
            text: " to their work. What's more, a lot of lawyers' time is spent writing ",
          },
          { n: 26 },
          {
            text: "  rather than dealing with people's misfortunes. ",
          },
        ],
      },
    ],
  },

  {
    id: 3,
    label: "Passage 3",
    title: "What is the secret of a long life?",
    subtitle: "",
    text: `This year, the number of retired pensioners in the UK exceeded the number of under 18 years old for the first time in history. That's remarkable in its own right, but the real 'population explosion' has been among the oldest of the old — the centenarians. In fact, this imbalance is the fastest growing demographic in much of the developed world. In the UK, the number of centenarians has increased by 60 per cent since the early 20th century. And their ranks are set swell even further, thanks to the ageing baby-boomer generation: by 2030 there will be about a million worldwide.

These trends raise social, ethical and economic dilemmas. Are medical advances artificially prolonging life, with hide regard for the quality of that life? If growing numbers of elderly people become dependent on state or familial support, society faces skyrocketing costs and commitments. Yet researchers who study the oldest old have made a surprising discovery that presents a less pessimistic view of the future than many anticipate.

It is becoming clear that people who break through the 90-plus barrier represent a physical elite. Far from gaining a longer burden of disability, their extra years tend to be healthy ones. And supercentenarians, people aged 110 or over, are even better examples of ageing well. The average supercentenarian had freely gone about their daily life up until the age of 105 or so, some five to ten years longer even than centenarians.

One of the most comprehensive studies comes from Denmark. In 1998 Kare Christensen, at the University of Southern Denmark, contacted every single one of 3600 people born in 1905 who was still alive. Assessing their health over the subsequent decade, he found that the proportion of people who managed to remain independent throughout was constantly around one-third of the total. Each individual risked becoming more infirm, but the unhealthiest ones passed away at earlier ages, leaving the strongest behind. In 2005, only 166 of the people in Christensen's sample were still alive, but one-third of those were still entirely self-sufficient.

Christensen's optimistic findings are echoed in studies all over the world. In the MC, Carol Brayne at the University of Cambridge studied 958 people aged over 90, and found that only one-quarter of them were living in accommodation specifically catering for the needs of older people. Research in China reveals that centenarians and nonagenarians spend fewer days ill and in bed than younger elderly groups. Of course, people can live independently without being entirely healthy, and it is true that most centenarians suffer from some kind of ailment. These range from osteoarthritis to simple loneliness.

Not all the oldest old survive by delaying illness or disability, though. Many soldier through it. Jessica Even of Ohio State University examined the medical histories of over 400 centenarians. She found that those who achieve extreme longevity tend to fall into three categories. About 40 per cent were 'delayers', who avoided chronic diseases until after the age of 80. Another 40 per cent were 'survivors', who suffered from chronic diseases before the age of 80 but lived longer to tell the tale. The final 20 per cent were 'escapers', who reached their century with no sign of the most common chronic diseases. Intriguingly, one-third of male centenarians were in this category, compared with only 15 per cent of women. In fact, the two sexes fare very differently when it comes to longevity. There are far more female centenarians, but the reasons for this are unclear. Certainly, women tend to lead healthier lifestyles and experience fewer serious accidents. They also go to their doctor more. Men are more prone to risky behaviour and chronic illness, so it must be genetics which allows some men to reach extreme old age. Evidence of this comes from longevity hotspots.

The Japanese island of Okinawa is the front runner. At 58 centenarians per 100,000 people, it has the world's highest proportion in this age group, with Sardinia and Iceland not too far behind. All three are relatively isolated island communities, which leads to less genetic variation amongst inhabitants. In these places, the result has been a predisposition towards a longer life. Of
course, members of such communities usually share a particular environment, too, but this alone cannot explain longevity. Gerontologists have emphasised the importance of regular exercise, so anyone aiming to reach a century should not underestimate this. They have also found that the influence on lifespan of social factors such as wealth fades as we age. By comparing 10,000 pairs of Scandinavian twins, Christensen found that genes are key, but that they only start exerting a strong influence on our lifespan after the age of 60. Before then, those who are both identical and non­identical have largely independent chances of reaching a given age.

Longevity genes have also been found in abundance in other organisms, including over 70 in particular worms. Unfortunately, it's a different story in humans. While many genes have been suggested to affect lifespan, very few have been consistently verified in multiple populations.`,
    questions: [
      {
        type: "tfng",
        heading: "Questions 27–33",
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
            text: "The greatest growth in the centenarian population across the world is in the UK.",
          },
          {
            n: 28,
            text: "Fewer families today are looking after their elderly members.",
          },
          {
            n: 29,
            text: "People who live beyond 90 years old are likely to be in good health.",
          },
          {
            n: 30,
            text: "Centenarians tend to be in better physical health than supercentenarians.",
          },
          {
            n: 31,
            text: "None of the oldest survivors in Christensen's study could take care of themselves.",
          },
          {
            n: 32,
            text: "Research findings from Cambridge and China conflicted with Christensen's findings in Denmark.",
          },
          {
            n: 33,
            text: "Centenarians may suffer from stronger feelings of isolation than people a generation younger.",
          },
          {
            n: 34,
            text: "Scientists have identified the specific genes responsible for human longevity.",
          },
        ],
      },
      {
        type: "short",
        heading: "Questions 8–13",
        title: "Answer the questions below.",
        sub: "Choose ONE WORD from the passage for each answer.",
        //         bulletPoint: true,
        items: [
          {
            n: 35,
            text: "What name has Jessica Evert given to the category of centenarians who become 100 without suffering serious disease?",
          },
          {
            n: 36,
            text: " What factor is most likely to contribute to longevity in men?",
          },
          {
            n: 37,
            text: "Which place has the largest proportion of centenarians in the world?",
          },
          {
            n: 38,
            text: "According to gerontologists, what should people avoid neglecting if they wish to reach old age?",
          },
          {
            n: 39,
            text: "What social influence on longevity decreases as people get older?",
          },
          {
            n: 40,
            text: "In which species, apart from humans, have longevity genes been reliably identified?",
          },
        ],
      },
    ],
  },
];

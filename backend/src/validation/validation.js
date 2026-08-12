const { z } = require("zod");

const shortQuestion = z.object({
  type: z.literal("short"),
  heading: z.string().optional(),
  title: z.string().optional(),
  sub: z.string().optional(),
  bulletPoint: z.boolean().optional(),
  questionTitle: z.string().optional(),
  themeTitle: z.string().optional(),
  items: z.array(
    z.object({
      n: z.union([z.number(), z.literal("example")]),
      text: z.string(),
      afterText: z.string().optional(),
    }),
  ),
});

const tfngQuestion = z.object({
  type: z.literal("tfng"),
  heading: z.string().optional(),
  title: z.string().optional(),
  sub: z.string().optional(),
  options: z.array(z.string()),
  optionLabels: z.record(z.string()).optional(),
  items: z.array(z.object({ n: z.number(), text: z.string() })),
});

const mcqQuestion = z.object({
  type: z.literal("mcq"),
  heading: z.string().optional(),
  title: z.string().optional(),
  sub: z.string().optional(),
  items: z.array(
    z.object({
      n: z.number(),
      text: z.string(),
      options: z.array(z.object({ id: z.string(), text: z.string() })),
    }),
  ),
});

const multiChoiceMCQQuestion = z.object({
  type: z.literal("multiChoiceMCQ"),
  heading: z.string().optional(),
  title: z.string().optional(),
  sub: z.string().optional(),
  items: z.array(
    z.object({
      n: z.array(z.number()),
      q: z.string(),
      opts: z.array(z.string()),
    }),
  ),
});

const headingsQuestion = z.object({
  type: z.literal("headings"),
  heading: z.string().optional(),
  title: z.string().optional(),
  sub: z.string().optional(),
  items: z.array(z.object({ n: z.number(), label: z.string() })),
});

const summaryCompleteQuestion = z.object({
  type: z.literal("summary_complete"),
  heading: z.string().optional(),
  title: z.string().optional(),
  sub: z.string().optional(),
  questionTitle: z.string().optional(),
  themeTitle: z.string().optional(),
  items: z.array(
    z.union([z.object({ text: z.string() }), z.object({ n: z.number() })]),
  ),
});

const matrixMatchQuestion = z.object({
  type: z.literal("matrix_match"),
  heading: z.string().optional(),
  title: z.string().optional(),
  sub: z.string().optional(),
  note: z.string().optional(),
  optionsList: z.object({
    heading: z.string().optional(),
    optionHide: z.boolean().optional(),
    options: z.array(
      z.object({
        id: z.string(),
        text: z.string().optional(), // options like this list of scientists have visible text; plain letter-only lists (e.g. paragraph matching A–H) don't
      }),
    ),
  }),
  items: z.array(z.object({ n: z.number(), text: z.string() })),
});

const paraMatchDragQuestion = z.object({
  type: z.literal("para_match_drag"),
  heading: z.string().optional(),
  title: z.string().optional(),
  sub: z.string().optional(),
  optionsList: z.object({
    heading: z.string().optional(),
    options: z.array(z.object({ id: z.string(), text: z.string() })),
  }),
  items: z.array(z.object({ n: z.number(), text: z.string() })),
});

const matchAnswerQuestion = z.object({
  type: z.literal("matchAnswer"),
  heading: z.string().optional(),
  sub: z.string().optional(),
  options: z.record(z.string()),
  items: z.array(z.object({ num: z.number(), q: z.string() })),
});

const summaryCompleteDragQuestion = z.object({
  type: z.literal("summary_complete_drag"),
  heading: z.string().optional(),
  title: z.string().optional(),
  sub: z.string().optional(),
  questionTitle: z.string().optional(),
  themeTitle: z.string().optional(),
  wordList: z.object({
    heading: z.string().optional(),
    options: z.array(z.object({ id: z.string(), text: z.string() })),
  }),
  items: z.array(
    z.union([z.object({ text: z.string() }), z.object({ n: z.number() })]),
  ),
});

const sentenceEndingQuestion = z.object({
  type: z.literal("sentence_ending"),
  heading: z.string().optional(),
  title: z.string().optional(),
  sub: z.string().optional(),
  endingsList: z.object({
    heading: z.string().optional(),
    options: z.array(z.object({ id: z.string(), text: z.string() })),
  }),
  items: z.array(z.object({ n: z.number(), text: z.string() })),
});

const questionBlockSchema = z.discriminatedUnion("type", [
  shortQuestion,
  tfngQuestion,
  mcqQuestion,
  multiChoiceMCQQuestion,
  headingsQuestion,
  summaryCompleteQuestion,
  matrixMatchQuestion,
  paraMatchDragQuestion,
  matchAnswerQuestion,
  summaryCompleteDragQuestion,
  sentenceEndingQuestion,
]);

const passageSchema = z.object({
  id: z.number(),
  label: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  text: z.string(),
  headingsList: z
    .array(z.object({ id: z.string(), text: z.string() }))
    .nullish(), // accepts undefined AND null
  paragraphQuestions: z.record(z.number()).nullish(),
  questions: z.array(questionBlockSchema),
});

const readingTestPayloadSchema = z.object({
  testNumber: z.number(),
  priority: z.enum(["main", "extra"]).default("main"),
  title: z.string(),
  status: z.enum(["draft", "published"]).default("draft"),
  answers: z.record(z.union([z.string(), z.array(z.string())])),
  questions: z.array(passageSchema),
});

module.exports = { readingTestPayloadSchema };

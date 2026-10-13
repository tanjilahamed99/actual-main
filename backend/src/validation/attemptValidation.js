// src/validation/attemptValidation.js
const { z } = require("zod");

// ── Student → POST /api/writing/:testNumber/submit ──
const submitAttemptSchema = z.object({
  testId: z.string().optional(),
  testNumber: z.number(),
  testTitle: z.string().optional(),
  answers: z
    .array(
      z.object({
        partIndex: z.number(),
        label: z.string(),
        prompt: z.string().optional(),
        minWords: z.number().optional(),
        answer: z.string(),
        wordCount: z.number().optional(),
      }),
    )
    .min(1),
});

// ── Admin → PUT /api/admin/writing/attempts/:id/mark ──
const criterionSchema = z
  .object({
    band: z.number().min(0).max(9).nullable().optional(),
    comment: z.string().optional(),
  })
  .optional();

const markPartSchema = z.object({
  partIndex: z.number(),
  TA: criterionSchema,
  CC: criterionSchema,
  LR: criterionSchema,
  GRA: criterionSchema,
  overallBand: z.number().min(0).max(9).nullable().optional(),
  feedback: z.string().optional(),
});

const markAttemptSchema = z.object({
  marks: z.array(markPartSchema).min(1),
  overallBand: z.number().min(0).max(9).nullable().optional(),
  generalFeedback: z.string().optional(),
});

module.exports = { submitAttemptSchema, markAttemptSchema };
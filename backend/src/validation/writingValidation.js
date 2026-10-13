const { z } = require("zod");

const chartSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("pie"),
    title: z.string(),
    segments: z.array(
      z.object({
        label: z.string(),
        value: z.number(),
        color: z.string().optional(),
        pattern: z
          .enum(["solid", "hatched", "dotted", "cross"])
          .optional()
          .default("solid"),
      }),
    ),
  }),
  z.object({
    kind: z.literal("bar"),
    title: z.string(),
    xLabels: z.array(z.string()),
    yMax: z.number(),
    yStep: z.number(),
    yUnit: z.string().optional(),
    xUnit: z.string().optional(),
    series: z.array(
      z.object({
        label: z.string(),
        pattern: z.string().optional(),
        values: z.array(z.number()),
      }),
    ),
  }),
  z.object({
    kind: z.literal("line"),
    title: z.string(),
    xLabels: z.array(z.string()),
    yMax: z.number(),
    yStep: z.number(),
    yUnit: z.string().optional(),
    xUnit: z.string().optional(),
    series: z.array(
      z.object({
        label: z.string(),
        marker: z.enum(["circle", "triangle", "square", "diamond"]).optional(),
        style: z.enum(["solid", "dashed", "dashdot", "dotted"]).optional(),
        filled: z.boolean().optional(),
        values: z.array(z.number()),
      }),
    ),
  }),
  z.object({
    kind: z.literal("table"),
    title: z.string(),
    columns: z.array(z.string()),
    rows: z.array(z.array(z.union([z.string(), z.number()]))),
  }),
  z.object({
    kind: z.literal("process"),
    title: z.string(),
    rows: z.array(
      z.array(
        z.object({
          n: z.number(),
          icon: z.string(),
          label: z.string(),
          sub: z.string().optional(),
        }),
      ),
    ),
  }),
  z.object({
    kind: z.literal("map"),
    titleBefore: z.string(),
    titleAfter: z.string(),
  }),
  z.object({
    kind: z.literal("change_table"),
    title: z.string(),
    rows: z.array(
      z.object({
        label: z.string(),
        value: z.number(),
        direction: z.enum(["up", "down"]),
      }),
    ),
  }),
]);

const partSchema = z.object({
  label: z.string(),
  subtitle: z.string().optional(),
  subtitleFull: z.string().optional(),
  minWords: z.number().int().positive(),
  hasCharts: z.boolean().optional().default(false),
  prompt: z.string(),
  charts: z.array(chartSchema).optional().default([]),
});

const writingTestPayloadSchema = z.object({
  testNumber: z.number(),
  title: z.string(),
  priority: z.enum(["main", "extra"]).default("main"),
  status: z.enum(["draft", "published"]).default("draft"),
  isDemo: z.boolean().optional().default(false),
  parts: z.array(partSchema).min(1).max(2),
});

module.exports = { writingTestPayloadSchema };
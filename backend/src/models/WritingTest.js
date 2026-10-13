const mongoose = require("mongoose");

/**
 * A writing test has 1 or 2 parts (task 1 + task 2).
 * Each part optionally has a chart. Charts come in different
 * shapes — discriminated by `kind`.
 */

const WritingTestSchema = new mongoose.Schema(
  {
    testNumber: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    priority: { type: String, enum: ["main", "extra"], default: "main" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    isDemo: { type: Boolean, default: false },

    /**
     * parts: [
     *   {
     *     label: "Part 1",
     *     subtitle: "Spend ~20 min. Write at least 150 words.",
     *     subtitleFull: "...",
     *     minWords: 150,
     *     hasCharts: true,
     *     prompt: "...",
     *     charts: [ ...chart objects... ]
     *   }
     * ]
     */
    parts: { type: Array, default: [] },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.WritingTest ||
  mongoose.model("WritingTest", WritingTestSchema);
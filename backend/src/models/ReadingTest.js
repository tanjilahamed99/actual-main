const mongoose = require("mongoose");

const readingTestSchema = new mongoose.Schema(
  {
    testNumber: { type: Number, required: true, unique: true },
    type: { type: String, default: "reading" },
    priority: { type: String, enum: ["main", "extra"], default: "main" },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    answers: { type: mongoose.Schema.Types.Mixed, required: true },
    questions: { type: [mongoose.Schema.Types.Mixed], required: true }, // array of passages
  },
  { timestamps: true },
);

readingTestSchema.index({ testNumber: 1 });
readingTestSchema.index({ status: 1, priority: 1, testNumber: 1 });

module.exports = mongoose.model("ReadingTest", readingTestSchema);

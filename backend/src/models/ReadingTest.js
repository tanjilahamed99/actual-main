const mongoose = require("mongoose");

const readingTestSchema = new mongoose.Schema(
  {
    testNumber: { type: Number, required: true, unique: true },
    type: { type: String, default: "reading" },
    priority: { type: String, enum: ["main", "extra"], default: "main" },
    title: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    answers: { type: mongoose.Schema.Types.Mixed, required: true },
    questions: { type: [mongoose.Schema.Types.Mixed], required: true }, // array of passages
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReadingTest", readingTestSchema);
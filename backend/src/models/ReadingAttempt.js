const mongoose = require("mongoose");

const ReadingAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: String,
    userEmail: String,
    
    testId: { type: String, required: true },
    testNumber: { type: Number, required: true },
    testTitle: String,

    // Current Score
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    band: { type: String, required: true },
    timeSpentSeconds: { type: Number, default: 0 },
    
    // ✅ NEW: Store previous scores here
    previousScores: [
      {
        score: Number,
        band: String,
        date: { type: Date, default: Date.now }
      }
    ],

    answers: { type: Object, default: {} },
    submittedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// ✅ CRITICAL: Ensure one document per user per test
ReadingAttemptSchema.index({ userId: 1, testNumber: 1 }, { unique: true });

module.exports =
  mongoose.models.ReadingAttempt ||
  mongoose.model("ReadingAttempt", ReadingAttemptSchema);
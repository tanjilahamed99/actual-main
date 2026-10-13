// src/models/WritingAttempt.js
const mongoose = require("mongoose");

const WritingAttemptSchema = new mongoose.Schema(
  {
    // ── Who submitted ──
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: { type: String, default: "" },
    userEmail: { type: String, default: "" },

    // ── Which test ──
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WritingTest",
      default: null,
      index: true,
    },
    testNumber: { type: Number, required: true, index: true },
    testTitle: { type: String, default: "" },

    // ── What the student wrote ──
    // answers: [{ partIndex, label, prompt, minWords, answer, wordCount }]
    answers: { type: Array, required: true },

    // ── Status ──
    status: {
      type: String,
      enum: ["submitted", "marked"],
      default: "submitted",
      index: true,
    },
    submittedAt: { type: Date, default: Date.now, index: true },
    markedAt: { type: Date, default: null },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Marker's grading ──
    // marks: [{ partIndex, TA:{band,comment}, CC:{...}, LR:{...}, GRA:{...}, overallBand, feedback }]
    marks: { type: Array, default: [] },

    // ── Overall ──
    overallBand: { type: Number, default: null },
    generalFeedback: { type: String, default: "" },
  },
  { timestamps: true },
);

// Composite index for the admin queue: pending first, newest first
WritingAttemptSchema.index({ status: 1, submittedAt: -1 });
// One lookup key for "this student's attempt on this test"
WritingAttemptSchema.index({ userId: 1, testNumber: 1 });

module.exports =
  mongoose.models.WritingAttempt ||
  mongoose.model("WritingAttempt", WritingAttemptSchema);
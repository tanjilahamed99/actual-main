// src/controllers/public/writingAttemptController.js
const WritingAttempt = require("../../models/WritingAttempt");
const { submitAttemptSchema } = require("../../validation/attemptValidation");

/**
 * POST /api/writing/:testNumber/submit
 * Called by the student's frontend when they click Submit.
 */
exports.submitAttempt = async (req, res) => {
  const parsed = submitAttemptSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid payload",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const attempt = await WritingAttempt.create({
      userId: req.user._id,
      userName: req.user.name ?? "",
      userEmail: req.user.email ?? "",
      testId: req.body.testId ?? null,
      testNumber: parsed.data.testNumber,
      testTitle: parsed.data.testTitle ?? "",
      answers: parsed.data.answers,
      status: "submitted",
      submittedAt: new Date(),
    });

    res.status(201).json({ success: true, attempt });
  } catch (err) {
    console.error("[submitAttempt]", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/writing/my-attempts
 * Returns the current user's attempts so their player can show "marked" state.
 */
exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await WritingAttempt.find({ userId: req.user._id })
      .select(
        "testNumber testTitle status submittedAt markedAt marks overallBand generalFeedback answers",
      )
      .sort({ submittedAt: -1 })
      .lean();

    // Return the *latest* attempt per testNumber so the card
    // always reflects the most recent submission.
    const latestByTest = new Map();
    for (const a of attempts) {
      const key = String(a.testNumber);
      if (!latestByTest.has(key)) latestByTest.set(key, a);
    }

    res.json({
      success: true,
      attempts,
      latestByTest: Object.fromEntries(latestByTest),
    });
  } catch (err) {
    console.error("[getMyAttempts]", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
/**
 * GET /api/writing/my-attempts/:testNumber
 * Convenience: latest attempt for a specific test.
 */
exports.getMyAttemptByTest = async (req, res) => {
  try {
    const attempt = await WritingAttempt.findOne({
      userId: req.user._id,
      testNumber: Number(req.params.testNumber),
    })
      .sort({ submittedAt: -1 })
      .lean();

    res.json({ success: true, attempt: attempt ?? null });
  } catch (err) {
    console.error("[getMyAttemptByTest]", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

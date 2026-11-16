const ReadingAttempt = require("../../models/ReadingAttempt");

exports.saveReadingAttempt = async (req, res) => {
  try {
    const {
      testId,
      testNumber,
      testTitle,
      score,
      totalQuestions,
      band,
      timeSpentSeconds,
      answers,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 1. Find the existing attempt (if any)
    const existingAttempt = await ReadingAttempt.findOne({
      userId: req.user._id,
      testNumber: testNumber,
    });

    let previousScores = [];

    // 2. If they already took this test, save their old score to history
    if (existingAttempt) {
      previousScores = [
        ...existingAttempt.previousScores,
        {
          score: existingAttempt.score,
          band: existingAttempt.band,
          date: existingAttempt.submittedAt,
        }
      ];
    }

    // 3. Update the existing attempt OR create a new one
    const updatedAttempt = await ReadingAttempt.findOneAndUpdate(
      { userId: req.user._id, testNumber: testNumber },
      {
        $set: {
          userId: req.user._id,
          userName: req.user.fullName || req.user.name || "Unknown",
          userEmail: req.user.email,
          testId,
          testNumber,
          testTitle,
          score,             // ✅ Overwrite with new score
          totalQuestions,
          band,              // ✅ Overwrite with new band
          timeSpentSeconds,
          answers,           // ✅ Overwrite with new answers
          previousScores,    // ✅ Save the history
          submittedAt: Date.now(),
        },
      },
      { upsert: true, new: true } // Upsert: Update or Insert
    );

    res.status(201).json({ success: true, attempt: updatedAttempt });
  } catch (err) {
    console.error("[saveReadingAttempt]", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get the logged-in user's own history
exports.getMyReadingAttempts = async (req, res) => {
  try {
    const attempts = await ReadingAttempt.find({ userId: req.user._id })
      .sort({ submittedAt: -1 })
      .lean();
    res.json({ success: true, attempts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
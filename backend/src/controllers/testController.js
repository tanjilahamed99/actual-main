// controllers/testController.js
const TestAttempt = require("../models/TestAttempt");
const User = require("../models/User");
const { getBandForSection, roundIELTSBand } = require("../config/bandscoring");

// ─── Helper: convert Zustand session → TestAttempt fields ─────────────────────
//
// Zustand stores answers as a plain object { question_1: "answer", ... }
// Mongoose SectionSchema stores answers as a Map — conversion happens here.

function zustandSectionToDoc(zustandSection) {
  if (!zustandSection) return undefined;

  return {
    status: zustandSection.status,
    startedAt: zustandSection.startedAt
      ? new Date(zustandSection.startedAt)
      : null,
    submittedAt: zustandSection.submittedAt
      ? new Date(zustandSection.submittedAt)
      : null,
    secondsLeft: zustandSection.secondsLeft ?? 0,
    // answers is a plain object from frontend → convert to Map-compatible object
    answers: zustandSection.answers ?? {},
  };
}

// Convert a Mongoose SectionSchema doc → plain object for Zustand
function docSectionToZustand(docSection) {
  if (!docSection) return undefined;

  // Mongoose Map → plain object
  let answers = {};
  if (docSection.answers instanceof Map) {
    answers = Object.fromEntries(docSection.answers);
  } else if (docSection.answers && typeof docSection.answers === "object") {
    answers = docSection.answers;
  }

  return {
    status: docSection.status,
    startedAt: docSection.startedAt ? docSection.startedAt.getTime() : null,
    submittedAt: docSection.submittedAt
      ? docSection.submittedAt.getTime()
      : null,
    secondsLeft: docSection.secondsLeft ?? 0,
    answers,
    band: docSection.band ?? null,
  };
}

// ─── PUT /api/tests/:testId ───────────────────────────────────────────────────
// Upsert: create or update the TestAttempt for this user + testId.
// Body: the full Zustand session object.

exports.saveTest = async (req, res) => {
  try {
    const userId = req.user._id; // set by auth middleware
    const { testId } = req.params;
    const session = req.body; // Zustand session shape

    if (!session || typeof session !== "object") {
      return res.status(400).json({ message: "Invalid session data." });
    }

    // Build the sections update from Zustand data
    const sectionsUpdate = {};
    const computedBands = {};
    for (const sId of ["listening", "reading", "writing"]) {
      if (session.sections?.[sId]) {
        const sectionDoc = zustandSectionToDoc(session.sections[sId]);

        // Score listening/reading server-side the moment a section is
        // submitted. Never trust a band the client might send.
        if (
          (sId === "listening" || sId === "reading") &&
          (sectionDoc.status === "completed" || sectionDoc.status === "time-up")
        ) {
          sectionDoc.band = getBandForSection(testId, sId, sectionDoc.answers);
          computedBands[sId] = sectionDoc.band;
        }

        sectionsUpdate[`sections.${sId}`] = sectionDoc;
      }
    }

    // Overall Band (Listening + Reading only — Writing is scored
    // separately by a reviewer). Falls back to whatever's already
    // stored for a section that isn't part of *this* update, so a
    // listening-only save doesn't wipe out a reading band saved earlier.
    let overallBandUpdate = {};
    const existing = await TestAttempt.findOne(
      { user: userId, testId: String(testId) },
      { "sections.listening.band": 1, "sections.reading.band": 1 },
    ).lean();

    const l =
      computedBands.listening ?? existing?.sections?.listening?.band ?? null;
    const r =
      computedBands.reading ?? existing?.sections?.reading?.band ?? null;
    if (l != null && r != null) {
      overallBandUpdate = { overallBand: roundIELTSBand((l + r) / 2) };
    }

    const updatePayload = {
      testTitle: session.testTitle ?? "",
      sessionStart: session.sessionStart
        ? new Date(session.sessionStart)
        : undefined,
      activeSectionId: session.activeSectionId ?? "listening",
      isComplete: session.isComplete ?? false,
      ...(session.isComplete ? { completedAt: new Date() } : {}),
      ...sectionsUpdate,
      ...overallBandUpdate,
    };

    const attempt = await TestAttempt.findOneAndUpdate(
      { user: userId, testId: String(testId) },
      { $set: updatePayload },
      {
        new: true, // return updated doc
        upsert: true, // create if not exists
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    // If this is a new doc, push its _id into User.tests (avoid duplicates)
    await User.updateOne(
      { _id: userId, tests: { $ne: attempt._id } },
      { $push: { tests: attempt._id } },
    );

    return res.json({ ok: true, attemptId: attempt._id });
  } catch (err) {
    console.error("[saveTest]", err);
    return res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/tests/:testId ───────────────────────────────────────────────────
// Fetch the existing TestAttempt and return it in Zustand session shape.

exports.getTest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { testId } = req.params;

    const attempt = await TestAttempt.findOne({
      user: userId,
      testId: String(testId),
    }).lean();

    if (!attempt) {
      return res.status(404).json({ message: "No session found." });
    }

    // Convert back to Zustand session shape
    const session = {
      testId: attempt.testId,
      testTitle: attempt.testTitle,
      sessionStart: attempt.sessionStart
        ? new Date(attempt.sessionStart).getTime()
        : Date.now(),
      activeSectionId: attempt.activeSectionId,
      isComplete: attempt.isComplete,
      sections: {
        listening: docSectionToZustand(attempt.sections?.listening),
        reading: docSectionToZustand(attempt.sections?.reading),
        writing: docSectionToZustand(attempt.sections?.writing),
      },
    };

    return res.json(session);
  } catch (err) {
    console.error("[getTest]", err);
    return res.status(500).json({ message: err.message });
  }
};

// ─── DELETE /api/tests/:testId ────────────────────────────────────────────────
// Delete the TestAttempt and remove it from User.tests.

exports.deleteTest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { testId } = req.params;

    // await User.updateOne({ _id: userId }, { $pull: { tests: attempt._id } });

    return res.json({ ok: true });
  } catch (err) {
    console.error("[deleteTest]", err);
    return res.status(500).json({ message: err.message });
  }
};

exports.getAllWritingTest = async (req, res) => {
  try {
    const userId = req.user._id;

    const attempt = await TestAttempt.find({
      user: userId,
    }).lean();

    if (!attempt) {
      return res.status(404).json({ message: "No session found." });
    }

    // Convert back to Zustand session shape
    const session = {
      tests: attempt,
    };

    return res.json(session);
  } catch (err) {
    console.error("[getTest]", err);
    return res.status(500).json({ message: err.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const update = {
      $set: {
        tests: [],
      },
    };

    const deleteUserHistory = await User.findByIdAndUpdate(
      { _id: userId },
      update,
    );

    return res.json({ success: true, message: "Clear history" });
  } catch (err) {
    console.error("[deleteTest]", err);
    return res.status(500).json({ message: err.message });
  }
};

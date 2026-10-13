// src/routes/public/writingRoutes.js
const { Router } = require("express");
const router = Router();

const {
  getAllPublishedWritingTests,
  getPublishedWritingTest,
} = require("../../controllers/public/writingController");

const {
  submitAttempt,
  getMyAttempts,
  getMyAttemptByTest,
} = require("../../controllers/public/writingAttemptController");

// ── Static routes FIRST so they aren't captured by /:testNumber ──
// router.get("/models", listAvailableModels);
router.get("/my-attempts", getMyAttempts);
router.get("/my-attempts/:testNumber", getMyAttemptByTest);

// ── List + single test ──
router.get("/", getAllPublishedWritingTests);
router.get("/:testNumber", getPublishedWritingTest);

// ── Submit + AI score ──
router.post("/:testNumber/submit", submitAttempt);

module.exports = router;

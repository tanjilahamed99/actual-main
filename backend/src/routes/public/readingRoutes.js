const { Router } = require("express");
const router = Router();
const {
  saveReadingAttempt,
  getMyReadingAttempts,
} = require("../../controllers/public/readingAttemptController");

const {
  getPublishedReadingTest,
  getAllPublishedReadingTest,
} = require("../../controllers/public/readingController");

// GET /api/reading                  → list of published reading tests (lightweight)
router.get("/", getAllPublishedReadingTest);

// GET /api/reading/:testNumber      → one published test (no answer key)
router.get("/:id", getPublishedReadingTest);

// Add these BEFORE the /:testNumber route
router.get("/my-attempts", getMyReadingAttempts);
router.post("/submit-attempt", saveReadingAttempt);

module.exports = router;

const { Router } = require("express");
const router = Router();

const {
  getPublishedReadingTest,
  getAllPublishedReadingTest,
} = require("../../controllers/public/readingController");

// GET /api/reading                  → list of published reading tests (lightweight)
router.get("/", getAllPublishedReadingTest);

// GET /api/reading/:testNumber      → one published test (no answer key)
router.get("/:id", getPublishedReadingTest);

module.exports = router;
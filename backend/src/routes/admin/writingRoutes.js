// src/routes/admin/writingRoutes.js
const { Router } = require("express");
const router = Router();

const {
  createWritingTest,
  updateWritingTest,
  deleteWritingTest,
  getAllWritingTests,
  getWritingTestById,
  getWritingStats,
} = require("../../controllers/admin/writingController");

const {
  getAllAttempts,
  getAttemptById,
  markAttempt,
  deleteAttempt,
  getAttemptStats,
} = require("../../controllers/admin/writingAttemptController");

// ── Attempt routes MUST come before /:id, otherwise "attempts" is
//    captured as an id and everything 400s ──
router.get("/attempts/stats", getAttemptStats);
router.get("/attempts", getAllAttempts);
router.get("/attempts/:id", getAttemptById);
router.put("/attempts/:id/mark", markAttempt);
router.delete("/attempts/:id", deleteAttempt);

// ── Test CRUD ──
router.get("/stats", getWritingStats);
router.get("/", getAllWritingTests);
router.post("/", createWritingTest);
router.get("/:id", getWritingTestById);
router.put("/:id", updateWritingTest);
router.delete("/:id", deleteWritingTest);

module.exports = router;
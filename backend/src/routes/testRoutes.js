const mongoose = require("mongoose");
const { Router } = require("express");

const {
  saveTest,
  deleteTest,
  getTest,
  getAllWritingTest,
  clearHistory,
} = require("../controllers/testController");
const { protect } = require("../middleware/UserValidation");

const router = Router();

router.get("/test-sessions/:testId", protect, getTest);

router.put("/test-sessions/:testId", protect, saveTest);

router.delete("/test-sessions/:testId", protect, deleteTest);

router.get("/getMyTest", protect, getAllWritingTest);

router.delete('/clear/history', protect, clearHistory)



module.exports = router;

const express = require("express");
const router = express.Router();
const { adminProtect } = require("../middleware/adminValidate");
const {
  createReadingTest,
  updateReadingTest,
  deleteReadingTest,
  getAllReadingTests,
  getPublishedReadingTest,
  getReadingTestById,
  getAllPublishedReadingTest,
  updateUserStatus,
  deleteUser,
  getAllUsers,
} = require("../controllers/readingController");

router.post("/reading-tests", createReadingTest);
router.put("/reading-tests/:id", adminProtect, updateReadingTest);
router.delete("/reading-tests/:id", adminProtect, deleteReadingTest);
router.get("/reading-tests", adminProtect, getAllReadingTests);
router.get("/reading-tests/:id", adminProtect, getReadingTestById);

router.get("/reading-tests/:testNumber", getPublishedReadingTest);
router.get("/allReadingTest", getAllPublishedReadingTest);
router.get("/reading/:id", getReadingTestById);

// use approved for access all pages
router.put("/users/:id/:status", adminProtect, updateUserStatus);
router.delete("/user/:id", adminProtect, deleteUser);
router.get("/users", adminProtect, getAllUsers);

module.exports = router;

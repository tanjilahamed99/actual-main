const { Router } = require("express");
const router = Router();

const {
  createReadingTest,
  updateReadingTest,
  deleteReadingTest,
  getAllReadingTests,
  getReadingTestById,
  getAllPublishedReadingTest,
  adminDeleteAttempt,
  adminGetAllAttempts,
} = require("../../controllers/admin/readingController");

// Add this to your admin router
router.get("/reading-attempts", adminGetAllAttempts);
router.delete("/reading-attempts/:id", adminDeleteAttempt);

// list + create
router.get("/", getAllPublishedReadingTest); // GET /api/admin/reading
router.post("/", createReadingTest); // POST /api/admin/reading

// single operations by Mongo _id
router.get("/:id", getReadingTestById); // GET /api/admin/reading/:id
router.put("/:id", updateReadingTest); // PUT /api/admin/reading/:id
router.delete("/:id", deleteReadingTest); // DELETE /api/admin/reading/:id

module.exports = router;

const ReadingTest = require("../../models/ReadingTest");

// GET /api/reading — list of published tests (lightweight, for catalog page)
exports.getAllPublishedReadingTest = async (req, res) => {
  try {
    const tests = await ReadingTest.find({ status: "published" })
      .select("testNumber title priority updatedAt questions.label")
      .sort({ testNumber: 1 })
      .lean();

    res.json({ success: true, test: tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/reading/:testNumber — single published test WITHOUT answers
exports.getPublishedReadingTest = async (req, res) => {
  try {
    const test = await ReadingTest.findOne({
      _id: req.params.id,
      status: "published",
    }).lean();
    if (!test) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

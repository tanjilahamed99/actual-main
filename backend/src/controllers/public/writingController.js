const WritingTest = require("../../models/WritingTest");

// GET /api/writing — list of published writing tests (lightweight)
exports.getAllPublishedWritingTests = async (req, res) => {
  try {
    const tests = await WritingTest.find({ status: "published" })
      .select(
        "testNumber title priority updatedAt parts.label parts.minWords parts.prompt",
      )
      .sort({ testNumber: 1 })
      .lean();
    res.json({ success: true, test: tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/writing/:testNumber — single published test
exports.getPublishedWritingTest = async (req, res) => {
  try {
    console.log(req.params);
    const test = await WritingTest.findOne({
      testNumber: req.params.testNumber,
      status: "published",
    }).lean();
    if (!test) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

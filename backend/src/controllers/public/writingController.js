const WritingTest = require("../../models/WritingTest");

// GET /api/writing
// Query params:
//   q            — search in title / prompt
//   kind         — pie | bar | line | table | process | map | change_table
//   priority     — main | extra
//   page         — 1-based (default 1)
//   limit        — per page (default 12, max 50)
exports.getAllPublishedWritingTests = async (req, res) => {
  try {
    const {
      q = "",
      kind = "",
      priority = "",
      page = "1",
      limit = "12",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    // ── build filter ──
    const filter = { status: "published" };

    if (priority === "main" || priority === "extra") {
      filter.priority = priority;
    }

    if (q.trim()) {
      const rx = new RegExp(q.trim(), "i");
      filter.$or = [
        { title: rx },
        { "parts.prompt": rx },
      ];
    }

    if (
      [
        "pie",
        "bar",
        "line",
        "table",
        "process",
        "map",
        "change_table",
      ].includes(kind)
    ) {
      // any part that contains a chart with this kind
      filter["parts.charts.kind"] = kind;
    }

    // ── run count + page in parallel ──
    const [total, tests] = await Promise.all([
      WritingTest.countDocuments(filter),
      WritingTest.find(filter)
        .select(
          "testNumber title priority updatedAt parts.label parts.minWords parts.prompt parts.charts.kind",
        )
        .sort({ testNumber: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    res.json({
      success: true,
      test: tests,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
      filters: { q, kind, priority },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/writing/:testNumber
exports.getPublishedWritingTest = async (req, res) => {
  try {
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
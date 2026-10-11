const ReadingTest = require("../../models/ReadingTest");

/**
 * GET /api/admin/passages
 *   ?q=history            search passage title / label / test title
 *   ?status=published     draft | published
 *   ?priority=main        main | extra
 *   ?testNumber=12        exact test number
 *   ?page=1&limit=20
 *   ?sort=testNumber      testNumber | passageId | updatedAt
 *   ?order=asc            asc | desc
 *
 * Returns flat rows: one per passage.
 */
exports.getAllPassages = async (req, res) => {
  try {
    const {
      q = "",
      status,
      priority,
      testNumber,
      page = 1,
      limit = 20,
      sort = "testNumber",
      order = "asc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * pageSize;
    const dir = order === "desc" ? -1 : 1;

    // ---- base filters on the parent document ----
    const match = {};
    if (status) match.status = status;
    if (priority) match.priority = priority;
    if (testNumber && !Number.isNaN(Number(testNumber))) {
      match.testNumber = Number(testNumber);
    }

    const pipeline = [
      { $match: match },
      // sort passages inside each doc before unwinding, so $unwind keeps order
      {
        $addFields: {
          questions: {
            $sortArray: { input: "$questions", sortBy: { id: 1 } },
          },
        },
      },
      { $unwind: "$questions" },
    ];

    // ---- optional text search on passage OR test fields ----
    if (q.trim()) {
      const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(safe, "i");
      pipeline.push({
        $match: {
          $or: [
            { "questions.title": rx },
            { "questions.label": rx },
            { "questions.subtitle": rx },
            { title: rx }, // test title
          ],
        },
      });
    }

    // ---- final shape of each row ----
    pipeline.push({
      $project: {
        _id: 0,
        testId: "$_id",
        testNumber: 1,
        testTitle: "$title",
        testStatus: "$status",
        testPriority: "$priority",
        updatedAt: 1,
        passageId: "$questions.id",
        passageLabel: "$questions.label",
        passageTitle: "$questions.title",
        passageSubtitle: "$questions.subtitle",
        questionBlockCount: { $size: { $ifNull: ["$questions.questions", []] } },
      },
    });

    // ---- sorting on the flattened rows ----
    const sortField =
      sort === "passageId"
        ? "passageId"
        : sort === "updatedAt"
          ? "updatedAt"
          : sort === "testTitle"
            ? "testTitle"
            : "testNumber";
    pipeline.push({ $sort: { [sortField]: dir, passageId: 1 } });

    // ---- run data + count in parallel ----
    const [rows, countResult] = await Promise.all([
      ReadingTest.aggregate([...pipeline, { $skip: skip }, { $limit: pageSize }]),
      ReadingTest.aggregate([...pipeline, { $count: "total" }]),
    ]);

    const total = countResult[0]?.total ?? 0;

    res.json({
      success: true,
      passages: rows,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: pageNum * pageSize < total,
        hasPrev: pageNum > 1,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
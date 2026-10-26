const ReadingTest = require("../../models/ReadingTest");

/**
 * GET /api/admin/passages
 *   ?q=history            search passage title / label / test title
 *   ?status=published     draft | published
 *   ?priority=main        main | extra
 *   ?testNumber=12        exact test number
 *   ?page=1&limit=20
 *   ?sort=testNumber      testNumber | passageId | updatedAt | testTitle
 *   ?order=asc            asc | desc
 *
 * Returns flat rows: one per passage, grouped by test in `testNumber` order,
 * with passages within a test sorted by their `id` (1, 2, 3).
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
      // ensure passages inside each doc are sorted before unwinding
      {
        $addFields: {
          questions: {
            $sortArray: { input: "$questions", sortBy: { id: 1 } },
          },
        },
      },
      { $unwind: "$questions" },
    ];

    // ---- optional text search ----
    if (q.trim()) {
      const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(safe, "i");
      pipeline.push({
        $match: {
          $or: [
            { "questions.title": rx },
            { "questions.label": rx },
            { "questions.subtitle": rx },
            { title: rx },
          ],
        },
      });
    }

    // ---- flatten to row shape ----
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
        passageText: "$questions.text",
        questionBlockCount: {
          $size: { $ifNull: ["$questions.questions", []] },
        },
      },
    });

    // ---- sort ----
    // ALWAYS sort by testNumber first, then passageId — this is what groups
    // passages by their parent test. If the client asks for a different
    // primary field, we still keep passageId as a secondary tiebreak.
    const primaryField =
      sort === "passageId"
        ? "passageId"
        : sort === "updatedAt"
          ? "updatedAt"
          : sort === "testTitle"
            ? "testTitle"
            : "testNumber";

    const sortObj =
      primaryField === "passageId"
        ? { passageId: dir, testNumber: 1 }            // rare: passages across tests
        : { [primaryField]: dir, passageId: 1 };       // default: test first, then passage

    pipeline.push({ $sort: sortObj });

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

exports.getDuplicatePassages = async (req, res) => {
  try {
    const pipeline = [
      // flatten passages
      { $unwind: "$questions" },
      // skip blank titles
      {
        $match: {
          "questions.title": { $exists: true, $nin: [null, ""] },
        },
      },
      // group by normalized title
      {
        $group: {
          _id: {
            $toLower: {
              $trim: {
                input: "$questions.title",
              },
            },
          },
          count: { $sum: 1 },
          passages: {
            $push: {
              testId: "$_id",
              testNumber: "$testNumber",
              testTitle: "$title",
              testStatus: "$status",
              testPriority: "$priority",
              passageId: "$questions.id",
              passageLabel: "$questions.label",
              passageTitle: "$questions.title",
              passageSubtitle: "$questions.subtitle",
              updatedAt: "$updatedAt",
            },
          },
        },
      },
      // keep only groups with >1 passage
      { $match: { count: { $gt: 1 } } },
      // newest activity first
      { $sort: { count: -1, "_id": 1 } },
    ];

    const groups = await ReadingTest.aggregate(pipeline);

    const totalGroups = groups.length;
    const totalPassages = groups.reduce((sum, g) => sum + g.count, 0);

    res.json({
      success: true,
      groups: groups.map((g) => ({
        normalizedTitle: g._id,
        count: g.count,
        passages: g.passages,
      })),
      totalGroups,
      totalPassages,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
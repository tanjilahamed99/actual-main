const { default: mongoose } = require("mongoose");
const ReadingTest = require("../../models/ReadingTest");
const { readingTestPayloadSchema } = require("../../validation/validation");

// ---------- CREATE ----------
exports.createReadingTest = async (req, res) => {
  const parsed = readingTestPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid payload",
      errors: parsed.error.flatten(),
    });
  }
  try {
    const exists = await ReadingTest.findOne({
      testNumber: parsed.data.testNumber,
    });
    if (exists) {
      return res.status(409).json({ message: "Test number already exists" });
    }
    const test = await ReadingTest.create(parsed.data);
    res.status(201).json({ success: true, test });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create reading test",
      error: err.message,
    });
  }
};

// ---------- UPDATE ----------
exports.updateReadingTest = async (req, res) => {
  const parsed = readingTestPayloadSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid payload", errors: parsed.error.flatten() });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  const test = await ReadingTest.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
  });
  if (!test) return res.status(404).json({ message: "Not found" });
  res.json({ success: true, test });
};

// ---------- LIST (admin, with search + pagination) ----------
exports.getAllPublishedReadingTest = async (req, res) => {
  try {
    const {
      q = "",
      status,
      priority,
      page = 1,
      limit = 10,
      sort = "testNumber",
      order = "asc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * pageSize;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (q.trim()) {
      const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(safe, "i");
      const numeric = Number(q);
      const orClauses = [
        { title: rx },
        { "questions.title": rx },
        { "questions.label": rx },
      ];
      if (!Number.isNaN(numeric)) orClauses.push({ testNumber: numeric });
      filter.$or = orClauses;
    }

    const sortObj = { [sort]: order === "desc" ? -1 : 1 };

    const [tests, total] = await Promise.all([
      ReadingTest.find(filter)
        .select(
          "testNumber title priority status updatedAt createdAt " +
            "questions.label questions.title questions._id",
        )
        .sort(sortObj)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      ReadingTest.countDocuments(filter),
    ]);

    res.json({
      success: true,
      test: tests,
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

// ---------- GET ONE (admin, full doc) ----------
exports.getReadingTestById = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Invalid id" });
  }
  const test = await ReadingTest.findOne({ testNumber: req.params.id });
  if (!test) return res.status(404).json({ message: "Not found" });
  res.json({ success: true, test });
};

// ---------- DELETE ----------
exports.deleteReadingTest = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  const test = await ReadingTest.findByIdAndDelete(req.params.id);
  if (!test) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted", success: true });
};

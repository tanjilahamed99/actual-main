const { default: mongoose } = require("mongoose");
const WritingTest = require("../../models/WritingTest");
const { writingTestPayloadSchema } = require("../../validation/writingValidation");

// ---------- CREATE ----------
exports.createWritingTest = async (req, res) => {
  const parsed = writingTestPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid payload",
      errors: parsed.error.flatten(),
    });
  }
  try {
    const exists = await WritingTest.findOne({
      testNumber: parsed.data.testNumber,
    });
    if (exists) {
      return res.status(409).json({ message: "Test number already exists" });
    }
    const test = await WritingTest.create(parsed.data);
    res.status(201).json({ success: true, test });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create writing test",
      error: err.message,
    });
  }
};

// ---------- UPDATE ----------
exports.updateWritingTest = async (req, res) => {
  const parsed = writingTestPayloadSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid payload",
      errors: parsed.error.flatten(),
    });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  const test = await WritingTest.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
  });
  if (!test) return res.status(404).json({ message: "Not found" });
  res.json({ success: true, test });
};

// ---------- LIST (admin) ----------
exports.getAllWritingTests = async (req, res) => {
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
      const orClauses = [{ title: rx }, { "parts.prompt": rx }];
      if (!Number.isNaN(numeric)) orClauses.push({ testNumber: numeric });
      filter.$or = orClauses;
    }

    const sortObj = { [sort]: order === "desc" ? -1 : 1 };

    const [tests, total] = await Promise.all([
      WritingTest.find(filter)
        .select("testNumber title priority status updatedAt createdAt parts.label parts.minWords")
        .sort(sortObj)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      WritingTest.countDocuments(filter),
    ]);

    res.json({
      success: true,
      test: tests,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- GET ONE (admin) ----------
exports.getWritingTestById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  const test = await WritingTest.findById(req.params.id);
  if (!test) return res.status(404).json({ message: "Not found" });
  res.json({ success: true, test });
};

// ---------- DELETE ----------
exports.deleteWritingTest = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  const test = await WritingTest.findByIdAndDelete(req.params.id);
  if (!test) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted", success: true });
};

// ---------- STATS ----------
exports.getWritingStats = async (req, res) => {
  try {
    const [total, published, draft, main, extra] = await Promise.all([
      WritingTest.countDocuments(),
      WritingTest.countDocuments({ status: "published" }),
      WritingTest.countDocuments({ status: "draft" }),
      WritingTest.countDocuments({ priority: "main" }),
      WritingTest.countDocuments({ priority: "extra" }),
    ]);
    res.json({
      success: true,
      stats: { total, published, draft, main, extra },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
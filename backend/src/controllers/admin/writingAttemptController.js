// src/controllers/admin/writingAttemptController.js
const { default: mongoose } = require("mongoose");
const WritingAttempt = require("../../models/WritingAttempt");
const { markAttemptSchema } = require("../../validation/attemptValidation");

/**
 * GET /api/admin/writing/attempts
 *   ?status=submitted|marked
 *   ?q=email or name or test title
 *   ?page=1&limit=20
 */
exports.getAllAttempts = async (req, res) => {
  try {
    const { status, q = "", page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * pageSize;

    const filter = {};
    if (status) filter.status = status;
    if (q.trim()) {
      const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(safe, "i");
      filter.$or = [{ userEmail: rx }, { userName: rx }, { testTitle: rx }];
    }

    const [attempts, total] = await Promise.all([
      WritingAttempt.find(filter)
        .select(
          "userName userEmail testNumber testTitle status submittedAt markedAt overallBand",
        )
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      WritingAttempt.countDocuments(filter),
    ]);

    res.json({
      success: true,
      attempts,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    console.error("[getAllAttempts]", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/admin/writing/attempts/:id
 */
exports.getAttemptById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  const attempt = await WritingAttempt.findById(req.params.id).lean();
  if (!attempt) return res.status(404).json({ message: "Not found" });
  res.json({ success: true, attempt });
};

/**
 * PUT /api/admin/writing/attempts/:id/mark
 */
exports.markAttempt = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const parsed = markAttemptSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid payload",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const attempt = await WritingAttempt.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          marks: parsed.data.marks,
          overallBand: parsed.data.overallBand ?? null,
          generalFeedback: parsed.data.generalFeedback ?? "",
          status: "marked",
          markedAt: new Date(),
          markedBy: req.user._id,
        },
      },
      { new: true },
    );

    if (!attempt) return res.status(404).json({ message: "Not found" });

    res.json({ success: true, attempt });
  } catch (err) {
    console.error("[markAttempt]", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/admin/writing/attempts/:id
 */
exports.deleteAttempt = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  const attempt = await WritingAttempt.findByIdAndDelete(req.params.id);
  if (!attempt) return res.status(404).json({ message: "Not found" });
  res.json({ success: true, message: "Deleted" });
};

/**
 * GET /api/admin/writing/attempts/stats
 */
exports.getAttemptStats = async (req, res) => {
  try {
    const [total, pending, marked] = await Promise.all([
      WritingAttempt.countDocuments(),
      WritingAttempt.countDocuments({ status: "submitted" }),
      WritingAttempt.countDocuments({ status: "marked" }),
    ]);
    res.json({ success: true, stats: { total, pending, marked } });
  } catch (err) {
    console.error("[getAttemptStats]", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
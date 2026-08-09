// const User = require("../models/User");
// const TestAttempt = require("../models/TestAttempt");

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const stripPassword = (userDoc) => {
//   const obj = userDoc.toObject();
//   delete obj.password;
//   delete obj.resetPasswordOTP;
//   delete obj.resetPasswordExpires;
//   return obj;
// };

// // ══════════════════════════════════════════════════════════════════════════════
// // USER CONTROLLERS
// // ══════════════════════════════════════════════════════════════════════════════

// /**
//  * GET /admin/users
//  * All users with optional search, role filter, pagination
//  */
// exports.getAllUsers = async (req, res) => {
//   try {
//     const { search, role, page = 1, limit = 20 } = req.query;

//     const query = {};

//     if (role && ["admin", "user"].includes(role)) {
//       query.role = role;
//     }

//     if (search) {
//       query.$or = [
//         { fullName: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { phone: { $regex: search, $options: "i" } },
//       ];
//     }

//     const skip = (Number(page) - 1) * Number(limit);

//     const [users, total] = await Promise.all([
//       User.find(query)
//         .select("-password -resetPasswordOTP -resetPasswordExpires")
//         .populate({
//           path: "tests",
//           select: "testTitle isComplete overallBand sessionStart writingStatus",
//           options: { sort: { sessionStart: -1 }, limit: 5 },
//         })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(Number(limit)),
//       User.countDocuments(query),
//     ]);

//     res.json({
//       users,
//       pagination: {
//         total,
//         page: Number(page),
//         limit: Number(limit),
//         pages: Math.ceil(total / Number(limit)),
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * GET /admin/users/:id
//  * Single user with full test history
//  */
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id)
//       .select("-password -resetPasswordOTP -resetPasswordExpires")
//       .populate({
//         path: "tests",
//         select:
//           "-sections.listening.answers -sections.reading.answers -sections.writing.answers",
//         options: { sort: { sessionStart: -1 } },
//       });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * PUT /admin/users/:id
//  * Update user — admin can change role, tagLine, bandScore, fullName, phone
//  */
// exports.updateUser = async (req, res) => {
//   try {
//     const ALLOWED = [
//       "fullName",
//       "phone",
//       "role",
//       "tagLine",
//       "bandScore",
//       "picture",
//     ];
//     const updates = {};
//     for (const key of ALLOWED) {
//       if (req.body[key] !== undefined) updates[key] = req.body[key];
//     }

//     if (updates.role && !["admin", "user"].includes(updates.role)) {
//       return res.status(400).json({ message: "Invalid role value" });
//     }

//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { $set: updates },
//       { new: true, runValidators: true },
//     ).select("-password -resetPasswordOTP -resetPasswordExpires");

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * DELETE /admin/users/:id
//  * Delete user and all their test attempts
//  */
// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Delete all test attempts belonging to this user
//     await TestAttempt.deleteMany({ user: user._id });

//     await user.deleteOne();

//     res.json({ message: "User and all associated test data deleted." });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ══════════════════════════════════════════════════════════════════════════════
// // WRITING CONTROLLERS
// // ══════════════════════════════════════════════════════════════════════════════

// /**
//  * GET /admin/writings
//  * All test attempts that have a writing section submitted
//  * Optional ?status=pending-review|reviewed
//  */
// exports.getAllWritings = async (req, res) => {
//   try {
//     const { status, page = 1, limit = 20 } = req.query;

//     const query = {
//       writingStatus: { $in: ["pending-review", "reviewed"] },
//     };

//     if (status && ["pending-review", "reviewed"].includes(status)) {
//       query.writingStatus = status;
//     }

//     const skip = (Number(page) - 1) * Number(limit);

//     const [attempts, total] = await Promise.all([
//       TestAttempt.find(query)
//         .populate("user", "fullName email phone picture")
//         .populate("writingEvaluation.reviewedBy", "fullName")
//         .select(
//           "user testTitle sessionStart writingStatus writingEvaluation sections.writing overallBand",
//         )
//         .sort({ sessionStart: -1 })
//         .skip(skip)
//         .limit(Number(limit)),
//       TestAttempt.countDocuments(query),
//     ]);

//     res.json({
//       writings: attempts,
//       pagination: {
//         total,
//         page: Number(page),
//         limit: Number(limit),
//         pages: Math.ceil(total / Number(limit)),
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * GET /admin/writings/:id
//  * Full writing submission detail — includes answers (task1, task2)
//  */
// exports.getWritingById = async (req, res) => {
//   try {
//     const attempt = await TestAttempt.findById(req.params.id)
//       .populate("user", "fullName email phone picture bandScore")
//       .populate("writingEvaluation.reviewedBy", "fullName email");

//     if (!attempt)
//       return res.status(404).json({ message: "Test attempt not found" });

//     if (!["pending-review", "reviewed"].includes(attempt.writingStatus)) {
//       return res
//         .status(400)
//         .json({ message: "Writing section has not been submitted yet" });
//     }

//     res.json({ writing: attempt });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * PUT /admin/writings/:id
//  * Admin evaluates a writing submission — assigns criteria scores + feedback
//  * Body: { taskAchievement, coherenceCohesion, lexicalResource, grammaticalRange, feedback }
//  */
// exports.evaluateWriting = async (req, res) => {
//   try {
//     const {
//       taskAchievement,
//       coherenceCohesion,
//       lexicalResource,
//       grammaticalRange,
//       feedback,
//     } = req.body;

//     // Validate all criteria present
//     const criteria = [
//       taskAchievement,
//       coherenceCohesion,
//       lexicalResource,
//       grammaticalRange,
//     ];
//     if (criteria.some((v) => v == null)) {
//       return res
//         .status(400)
//         .json({ message: "All four criteria scores are required." });
//     }

//     const validBands = [
//       0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9,
//     ];
//     if (criteria.some((v) => !validBands.includes(Number(v)))) {
//       return res.status(400).json({
//         message: "Each score must be a valid IELTS band (4–9 in 0.5 steps).",
//       });
//     }

//     if (!feedback || !feedback.trim()) {
//       return res.status(400).json({ message: "Feedback is required." });
//     }

//     // Calculate writing overall band (average, rounded to nearest 0.5)
//     const avg =
//       (Number(taskAchievement) +
//         Number(coherenceCohesion) +
//         Number(lexicalResource) +
//         Number(grammaticalRange)) /
//       4;
//     const writingBand = Math.round(avg * 2) / 2;

//     const attempt = await TestAttempt.findById(req.params.id);
//     if (!attempt)
//       return res.status(404).json({ message: "Test attempt not found" });

//     if (attempt.writingStatus === "reviewed") {
//       return res
//         .status(400)
//         .json({ message: "This writing has already been evaluated." });
//     }

//     // Set writing section band + evaluation
//     attempt.sections.writing.band = writingBand;
//     attempt.writingStatus = "reviewed";
//     attempt.writingEvaluation = {
//       taskAchievement: Number(taskAchievement),
//       coherenceCohesion: Number(coherenceCohesion),
//       lexicalResource: Number(lexicalResource),
//       grammaticalRange: Number(grammaticalRange),
//       overallBand: writingBand,
//       feedback: feedback.trim(),
//       reviewedBy: req.user._id, // set by your auth middleware
//       reviewedAt: new Date(),
//     };

//     // Pre-save hook will auto-calculate overallBand if all 3 sections have bands
//     await attempt.save();

//     res.json({
//       message: "Writing evaluated successfully.",
//       writingBand,
//       overallBand: attempt.overallBand,
//       attempt,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ══════════════════════════════════════════════════════════════════════════════
// // TEST ATTEMPT CONTROLLERS
// // ══════════════════════════════════════════════════════════════════════════════

// /**
//  * GET /admin/test/attempts
//  * All test attempts across all users
//  * Optional ?userId=&isComplete=true|false&page=&limit=
//  */
// exports.getAllAttempts = async (req, res) => {
//   try {
//     const { userId, isComplete, page = 1, limit = 20 } = req.query;

//     const query = {};
//     if (userId) query.user = userId;
//     if (isComplete !== undefined) query.isComplete = isComplete === "true";

//     const skip = (Number(page) - 1) * Number(limit);

//     const [attempts, total] = await Promise.all([
//       TestAttempt.find(query)
//         .populate("user", "fullName email phone")
//         .select(
//           "-sections.listening.answers -sections.reading.answers -sections.writing.answers",
//         )
//         .sort({ sessionStart: -1 })
//         .skip(skip)
//         .limit(Number(limit)),
//       TestAttempt.countDocuments(query),
//     ]);

//     // Summary stats
//     const completed = await TestAttempt.countDocuments({ isComplete: true });
//     const avgBandResult = await TestAttempt.aggregate([
//       { $match: { overallBand: { $ne: null } } },
//       { $group: { _id: null, avg: { $avg: "$overallBand" } } },
//     ]);
//     const avgBand = avgBandResult[0]?.avg ?? null;

//     res.json({
//       attempts,
//       stats: {
//         total: await TestAttempt.countDocuments(),
//         completed,
//         inProgress: (await TestAttempt.countDocuments()) - completed,
//         avgBand: avgBand ? Math.round(avgBand * 10) / 10 : null,
//       },
//       pagination: {
//         total,
//         page: Number(page),
//         limit: Number(limit),
//         pages: Math.ceil(total / Number(limit)),
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * GET /admin/test/attempts/:id
//  * Single attempt with full detail including all answers
//  */
// exports.getAttemptById = async (req, res) => {
//   try {
//     const attempt = await TestAttempt.findById(req.params.id)
//       .populate("user", "fullName email phone bandScore tagLine")
//       .populate("writingEvaluation.reviewedBy", "fullName");

//     if (!attempt)
//       return res.status(404).json({ message: "Test attempt not found" });

//     res.json({ attempt });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

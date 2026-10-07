const ReadingTest = require("../../models/ReadingTest");
const User = require("../../models/User");

exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalTests,
      publishedTests,
      draftTests,
      mainTests,
      extraTests,
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      suspendedUsers,
    ] = await Promise.all([
      ReadingTest.countDocuments(),
      ReadingTest.countDocuments({ status: "published" }),
      ReadingTest.countDocuments({ status: "draft" }),
      ReadingTest.countDocuments({ priority: "main" }),
      ReadingTest.countDocuments({ priority: "extra" }),
      User.countDocuments(),
      User.countDocuments({ status: "pending" }),
      User.countDocuments({ status: "approved" }),
      User.countDocuments({ status: "rejected" }),
      User.countDocuments({ status: "suspended" }),
    ]);

    res.json({
      success: true,
      stats: {
        reading: {
          total: totalTests,
          published: publishedTests,
          draft: draftTests,
          main: mainTests,
          extra: extraTests,
        },
        users: {
          total: totalUsers,
          pending: pendingUsers,
          approved: approvedUsers,
          rejected: rejectedUsers,
          suspended: suspendedUsers,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
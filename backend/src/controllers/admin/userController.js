const User = require("../../models/User");
const sendEmail = require("../../config/sendEmail");
const bcrypt = require("bcryptjs");
const {
  getAccountApprovedTemplate,
  getAccountRejectedTemplate,
  getAccountDeletedTemplate,
} = require("../../utils/emailTemplate");

// ✅ Updated to ONLY show users (role: "user")
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").lean();
    res.json({ success: true, message: "Users Data", users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ NEW: Only show admins (role: "admin")
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .lean();
    res.json({ success: true, message: "Admins Data", admins });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.updateUserStatus = async (req, res) => {
  try {
    const { id, status } = req.params;

    const mainStatus = ["pending", "approved", "rejected"];

    if (!mainStatus.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true },
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (status === "approved") {
      await sendEmail({
        to: user.email,
        subject: "Welcome! Your Account is Approved 🎉",
        html: getAccountApprovedTemplate(user.fullName),
      });
    } else if (status === "rejected") {
      await sendEmail({
        to: user.email,
        subject: "Update on your Account Application",
        html: getAccountRejectedTemplate(user.fullName),
      });
    }

    res.json({ success: true, message: "User updated", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await User.findByIdAndDelete(id);

    // ✅ Send Email on Delete
    await sendEmail({
      to: user.email,
      subject: "Your Account has been Deleted",
      html: getAccountDeletedTemplate(user.fullName),
    });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    let updateData = { fullName: name, email };

    // If admin typed a new password, hash it
    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

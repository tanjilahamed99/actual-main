const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../config/sendEmail");
const { v4: uuidv4 } = require("uuid");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign(id, process.env.AUTH_SECRET, { expiresIn: "7d" });
};

// Register
exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const sessionId = uuidv4();

    const user = new User({
      email,
      password,
      fullName,
      activeSessionId: sessionId,
    });

    await user.save();
    // remove password from output
    const { password: _, ...userWithoutPass } = user.toObject();

    res.status(201).json({
      user: userWithoutPass,
      token: generateToken({
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        sessionId,
      }),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .populate([{ path: "picture", strictPopulate: false }])
      .populate([{ path: "endpoint", strictPopulate: false }]);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // CREATE UNIQUE SESSION ID
    const sessionId = uuidv4();

    // SAVE IT TO DATABASE
    user.activeSessionId = sessionId;

    await user.save();

    // remove password from output
    const { password: _, ...userWithoutPass } = user.toObject();

    res.json({
      user: userWithoutPass,
      token: generateToken({ id: user._id, email: user.email, sessionId }),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Profile (protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfileData = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    if (id !== userId) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const { fullName, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { fullName, phone } },
      { new: true, runValidators: true }, // ✅ returns updated doc, not old one
    ).select("-password"); // ✅ never send password to client

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser, // ✅ this is now the fresh updated data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(email);

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 mins
    await user.save();

    // Send email
    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    );

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Reset password
exports.validateOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: code,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    res.json({ message: "token validated", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: code,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Change password
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    if (id !== userId) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both fields are required" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ verify current password against hashed DB password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // ✅ just assign — the pre-save hook will hash it automatically
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

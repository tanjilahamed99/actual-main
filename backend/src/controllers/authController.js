const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const sendEmail = require("../config/sendEmail");

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

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash it and save to DB (expires in 15 mins)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Send Email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password. This link expires in 15 minutes.</p><a href="${resetUrl}">${resetUrl}</a>`,
    });

    res.json({ success: true, message: "Email sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const UserSchema = new Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, default: "user", enum: ["admin", "user"] },
  tagLine: { type: String, default: "New User" },
  picture: { type: String },
  createdAt: { type: Date, default: Date.now },

  // 🔑 Reset password fields
  resetPasswordOTP: String,
  resetPasswordExpires: Date,

  activeSessionId: {
    type: String,
    default: null,
  },

  status: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "rejected"],
  },
});

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", UserSchema);

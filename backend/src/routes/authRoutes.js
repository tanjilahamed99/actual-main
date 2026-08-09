const mongoose = require("mongoose");
const { Router } = require("express");
const {
  register,
  login,
  getProfile,
  updateProfileData,
  changePassword,
  forgotPassword,
  resetPassword,
  validateOtp,
} = require("../controllers/authController");
const { protect } = require("../middleware/UserValidation");
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile/update/:id", protect, updateProfileData);
router.post("/forgot-password", forgotPassword);
router.post("/validate-otp", validateOtp);
router.post("/reset-password", resetPassword);
router.put("/change-password/:id", protect, changePassword);

module.exports = router;

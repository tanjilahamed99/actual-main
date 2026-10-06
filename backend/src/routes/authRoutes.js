const { Router } = require("express");
const router = Router();

const {
  register,
  login,
  changePassword,
  forgotPassword,
  getProfile,
  resetPassword,
  updateProfileData,
  validateOtp,
} = require("../controllers/authController");
const { authProtect } = require("../middleware/authValidate");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authProtect, getProfile);

module.exports = router;

const { Router } = require("express");
const router = Router();

const {
  register,
  login,
  forgotPassword,
  getProfile,
  resetPassword,
} = require("../controllers/authController");
const { authProtect } = require("../middleware/authValidate");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authProtect, getProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

module.exports = router;

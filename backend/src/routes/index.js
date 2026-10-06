const { Router } = require("express");
const router = Router();

const authRoutes = require("./authRoutes");
const adminRoutes = require("./admin");
const publicRoutes = require("./public");

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/", publicRoutes); // public last (it has catch-all paths like /reading)

module.exports = router;
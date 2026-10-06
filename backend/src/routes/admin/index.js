const { Router } = require("express");
const router = Router();

const { adminProtect } = require("../../middleware/adminValidate");

const readingRoutes = require("./readingRoutes");
// const listeningRoutes = require("./listeningRoutes");
// const writingRoutes = require("./writingRoutes");
const userRoutes = require("./userRoutes");

// Every admin route is protected here once, not in each file
router.use(adminProtect);

router.use("/reading", readingRoutes);
// router.use("/listening", listeningRoutes);
// router.use("/writing", writingRoutes);
router.use("/users", userRoutes);

module.exports = router;
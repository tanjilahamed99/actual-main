const { Router } = require("express");
const router = Router();

const { adminProtect } = require("../../middleware/adminValidate");

const statsRoutes = require("./statsRoutes");
const readingRoutes = require("./readingRoutes");
// const listeningRoutes = require("./listeningRoutes");
// const writingRoutes = require("./writingRoutes");
const userRoutes = require("./userRoutes");

router.use(adminProtect);

router.use("/stats", statsRoutes);
router.use("/reading", readingRoutes);
// router.use("/listening", listeningRoutes);
// router.use("/writing", writingRoutes);
router.use("/users", userRoutes);

module.exports = router;
const { Router } = require("express");
const router = Router();

const readingRoutes = require("./readingRoutes");
// const listeningRoutes = require("./listeningRoutes");
const writingRoutes = require("./writingRoutes");
const { authProtect } = require("../../middleware/authValidate");

router.use("/reading", authProtect, readingRoutes);
router.use("/writing", authProtect, writingRoutes);
// router.use("/listening", listeningRoutes);

module.exports = router;

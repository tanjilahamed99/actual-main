const { Router } = require("express");
const router = Router();

const readingRoutes = require("./readingRoutes");
// const listeningRoutes = require("./listeningRoutes");
// const writingRoutes = require("./writingRoutes");

router.use("/reading", readingRoutes);
// router.use("/listening", listeningRoutes);
// router.use("/writing", writingRoutes);

module.exports = router;
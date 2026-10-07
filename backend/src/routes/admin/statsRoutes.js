const { Router } = require("express");
const router = Router();

const { getAdminStats } = require("../../controllers/admin/statsController");

router.get("/", getAdminStats);

module.exports = router;
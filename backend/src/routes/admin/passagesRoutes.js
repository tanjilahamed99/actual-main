const { Router } = require("express");
const router = Router();

const { getAllPassages } = require("../../controllers/admin/passagesController");

router.get("/", getAllPassages);

module.exports = router;
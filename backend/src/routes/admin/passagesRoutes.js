const { Router } = require("express");
const router = Router();

const { getAllPassages, getDuplicatePassages } = require("../../controllers/admin/passagesController");

router.get("/", getAllPassages);

router.get("/duplicates", getDuplicatePassages);

module.exports = router;
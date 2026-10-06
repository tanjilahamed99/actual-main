const { Router } = require("express");
const router = Router();

const {
  getAllUsers,
  updateUserStatus,
  deleteUser,
} = require("../../controllers/admin/userController");

router.get("/", getAllUsers);                       // GET  /api/admin/users
router.put("/:id/:status", updateUserStatus);       // PUT  /api/admin/users/:id/:status
router.delete("/:id", deleteUser);                  // DEL  /api/admin/users/:id

module.exports = router;
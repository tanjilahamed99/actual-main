const { Router } = require("express");
const router = Router();

const { 
  getAllUsers, 
  updateUserStatus, 
  deleteUser, 
  adminUpdateUser, 
  getAllAdmins
} = require("../../controllers/admin/userController");

router.get("/", getAllUsers);
router.get("/admins", getAllAdmins); // ✅ Add this route!
router.put("/:id/:status", updateUserStatus);
router.put("/:id", adminUpdateUser);
router.delete("/:id", deleteUser);

module.exports = router;
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticateToken, requireRole } = require("../middlewares/auth.middleware");

// Public routes (cần đăng nhập)
router.get("/profile", authenticateToken, userController.handleProfile);
router.put("/profile", authenticateToken, userController.handleProfile);

// Admin routes (cần quyền ADMIN)
router.get("/", authenticateToken, requireRole(["ADMIN"]), userController.getAllUsers);
router.get("/:id", authenticateToken, requireRole(["ADMIN"]), userController.getUserById);
router.post("/", authenticateToken, requireRole(["ADMIN"]), userController.createUser);
router.put("/:id", authenticateToken, requireRole(["ADMIN"]), userController.updateUser);
router.delete("/:id", authenticateToken, requireRole(["ADMIN"]), userController.deleteUser);

module.exports = router;

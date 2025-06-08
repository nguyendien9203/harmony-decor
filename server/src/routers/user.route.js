const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticateToken, requireRole } = require("../middlewares/auth.middleware");
const upload = require('../config/multer')

// Public routes (cần đăng nhập)
router.get("/profile", authenticateToken, userController.handleProfile);
router.put("/profile", authenticateToken, upload.single("avatar"), userController.handleProfile);

// Admin routes (cần quyền ADMIN)
router.get("/", authenticateToken, requireRole(["ADMIN"]), userController.getAllUsers);
router.get("/:id", authenticateToken, requireRole(["ADMIN"]), userController.getUserById);
router.post("/", authenticateToken, requireRole(["ADMIN"]), userController.createUser);
router.put("/:id", authenticateToken, requireRole(["ADMIN"]),upload.single("avatar"), userController.updateUser);
router.put("/status/:id", authenticateToken, requireRole(["ADMIN"]), userController.updateStatus);
router.put("/roles/:id", authenticateToken, requireRole(["ADMIN"]), userController.updateRole);
router.delete("/:id", authenticateToken, requireRole(["ADMIN"]), userController.deleteUser);

module.exports = router;

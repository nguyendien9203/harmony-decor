const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

router.get("/stats", userController.getUserStats);

module.exports = router;

const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discount.controller");
const {
  authenticateToken,
  requireRole,
} = require("../middlewares/auth.middleware");

// Validate discount code (user hoặc admin)
router.post(
  "/validate",
  authenticateToken,
  requireRole(["USER", "ADMIN"]),
  discountController.validateDiscount
);

// Tạo discount (admin)
router.post(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  discountController.createDiscount
);

// Lấy danh sách discount (admin hoặc user, có filter/search)
router.get(
  "/",
  authenticateToken,
  requireRole(["USER", "ADMIN"]),
  discountController.getAllDiscounts
);

// Lấy discount theo id (admin hoặc user)
router.get(
  "/:id",
  authenticateToken,
  requireRole(["USER", "ADMIN"]),
  discountController.getDiscountById
);

// Cập nhật discount (admin)
router.put(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  discountController.updateDiscount
);

module.exports = router;

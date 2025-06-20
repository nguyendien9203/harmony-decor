const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const {
  authenticateToken,
  requireRole,
} = require("../middlewares/auth.middleware");

// Create a new order (user)
router.post(
  "/",
  authenticateToken,
  requireRole(["USER"]),
  orderController.createOrder
);

// Lấy tất cả đơn hàng (admin)
router.get(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  orderController.getAllOrders
);

// Lấy đơn hàng của user
router.get("/user", authenticateToken, orderController.getOrdersByUser);

// Lấy chi tiết đơn hàng
router.get("/:id", authenticateToken, orderController.getOrderById);

// Cập nhật trạng thái đơn hàng (admin)
router.patch(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  orderController.updateOrderStatus
);

// Xóa đơn hàng (admin)
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  orderController.deleteOrder
);

module.exports = router;

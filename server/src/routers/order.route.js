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

// Lấy đơn hàng của user
router.get(
  "/get-orders-by-user",
  authenticateToken,
  requireRole(["USER"]),
  orderController.getOrdersByUser
);

// Lấy tất cả đơn hàng (admin)
router.get(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  orderController.getAllOrders
);

// Lấy chi tiết đơn hàng
router.get("/:id", authenticateToken, orderController.getOrderById);

// Cập nhật trạng thái đơn hàng (admin + user)
router.patch(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN", "USER"]),
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

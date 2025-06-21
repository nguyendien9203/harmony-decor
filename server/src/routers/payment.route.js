const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const {
  authenticateToken,
  requireRole,
} = require("../middlewares/auth.middleware");

// Create payment URL
router.post(
  "/create-payment",
  authenticateToken,
  requireRole(["USER", "ADMIN"]),
  paymentController.createPaymentUrl
);

// Handle payment return
router.get(
  "/vnpay-return",
  authenticateToken,
  requireRole(["USER", "ADMIN"]),
  paymentController.handlePaymentReturn
);

// Handle payment notification
router.get(
  "/vnpay-ipn",
  authenticateToken,
  requireRole(["USER", "ADMIN"]),
  paymentController.handlePaymentNotification
);

module.exports = router;

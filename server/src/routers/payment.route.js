const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const {
  authenticateToken,
  requireRole,
} = require("../middlewares/auth.middleware");
const { syncTransaction } = require("../services/payment.service");

// Generate payment QR code
router.get(
  "/generate-qr-code/:id",
  authenticateToken,
  requireRole(["USER", "ADMIN"]),
  paymentController.generateQRCode
);

// Sync transactions
router.post(
  "/sync-transactions",
  // authenticateToken,
  // requireRole(["USER", "ADMIN"]),
  syncTransaction
);

// Webhook handler for payment notifications
router.post(
  "/webhook-event-handler",
  // authenticateToken,
  // requireRole(["USER", "ADMIN"]),
  paymentController.webhookHandler
);

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

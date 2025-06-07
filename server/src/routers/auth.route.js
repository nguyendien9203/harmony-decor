const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const { body } = require("express-validator");

// Đăng ký
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
    body("phone").notEmpty().withMessage("Phone is required")
  ],
  validateRequest,
  authController.register
);

// Đăng nhập
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  authController.login
);

// Gửi OTP quên mật khẩu
router.post(
  "/forgot-password",
  [
    body("email").isEmail().withMessage("Invalid email")
  ],
  validateRequest,
  authController.sendForgotPasswordOTP
);

// Đặt lại mật khẩu
router.post(
  "/reset-password",
  [
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("confirmPassword").isLength({ min: 6 }).withMessage("Confirm password must be at least 6 characters")
  ],
  validateRequest,
  authController.resetPassword
);

// Xác thực email
router.post(
  "/verify-email",
  [
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 characters")
  ],
  validateRequest,
  authController.verifyEmailWithOTP
); 

// Gửi lại OTP xác thực email
router.post(
  "/resend-verification",
  [
    body("email").isEmail().withMessage("Invalid email")
  ],
  validateRequest,
  authController.sendVerificationOTP
);
// ... existing code ...

// Xác thực OTP quên mật khẩu
router.post(
  "/verify-forgot-password-otp",
  [
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 characters")
  ],
  validateRequest,
  authController.verifyForgotPasswordOTP
);

// Đặt lại mật khẩu
router.post(
  "/reset-password",
  [
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("confirmPassword").isLength({ min: 6 }).withMessage("Confirm password must be at least 6 characters")
  ],
  validateRequest,
  authController.resetPassword
);

// ... existing code ...

module.exports = router;
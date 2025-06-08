const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const { body } = require("express-validator");
// const { authenticate } = require("../middlewares/authenticate");


// Register a new user
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
  ],
  validateRequest,
  authController.register
);

// Login user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  authController.login
);



// Send OTP for email verification
router.post(
  "/send-verification-otp",
  [body("email").isEmail().withMessage("Invalid email")],
  validateRequest,
  authController.sendVerificationEmail
);

// Send OTP for forgot password
router.post(
  "/send-forgot-password-otp",
  [body("email").isEmail().withMessage("Invalid email")],
  validateRequest,
  authController.sendForgotPasswordEmail
);

// Verify email with OTP
router.post(
  "/verify-email",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 characters"),
  ],
  validateRequest,
  authController.verifyEmail
);

// Reset password
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  authController.resetPassword
);

// Change password
router.post(
  "/change-password",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("oldPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  validateRequest,
  authController.changePassword
);

module.exports = router;

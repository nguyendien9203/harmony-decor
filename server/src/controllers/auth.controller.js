const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateTokens, verifyToken, storeTokensInRedis, removeTokensFromRedis, verifyTokenInRedis } = require("../config/jwt");
const { sendEmail } = require("../config/email");
const otpGenerator = require("otp-generator");
const { getRedisClient } = require("../config/redis");

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const isExisting = await User.findOne({ email });
    if (isExisting) {
      return res.status(400).json({ 
        success: false,
        message: "Email already exists" 
      });
    }

    const user = new User({ name, email, password, phone });
    await user.save();

    // Generate verification OTP
    const otpCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    const redisClient = getRedisClient();
    await redisClient.setEx(`otp:${email}`, 300, otpCode);
    console.log(`OTP for ${email}: ${otpCode}`);
    await sendEmail(email, "Verify your email", `Your verification code is: ${otpCode}`);

    res.status(201).json({ 
      success: true,
      message: "Register successfully. Please verify your email.",
      data: { user: { id: user._id, name, email, phone } }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Nếu user chưa verify email thì gửi lại OTP
    if (!user.verified) {
      const otpCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
      const redisClient = getRedisClient();
      await redisClient.setEx(`otp:${email}`, 300, otpCode);
      await sendEmail(email, "Verify your email", `Your verification code is: ${otpCode}`);
      return res.status(403).json({
        success: false,
        message: "Please verify your email. OTP has been sent again."
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ 
        success: false,
        message: "Account is not active" 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const tokens = generateTokens(user._id);
    await storeTokensInRedis(user._id, tokens);

    res.status(200).json({ 
      success: true,
      accessToken: tokens.accessToken
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};


// Làm mới token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: "Refresh token is required" 
      });
    }

    const decoded = verifyToken(refreshToken, true);
    const isValid = await verifyTokenInRedis(decoded.userId, refreshToken, true);
    
    if (!isValid) {
      return res.status(403).json({ 
        success: false,
        message: "Invalid refresh token" 
      });
    }

    const tokens = generateTokens(decoded.userId);
    await storeTokensInRedis(decoded.userId, tokens);

    res.status(200).json({ 
      success: true,
      data: tokens 
    });
  } catch (error) {
    res.status(403).json({ 
      success: false,
      message: "Invalid token", 
      error: error.message 
    });
  }
};

// Đăng xuất
exports.logout = async (req, res) => {
  try {
    await removeTokensFromRedis(req.user._id);
    res.status(200).json({ 
      success: true,
      message: "Logged out successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Current password is incorrect" 
      });
    }

    user.password = newPassword;
    await user.save();

    // Invalidate all existing tokens
    await removeTokensFromRedis(user._id);

    res.status(200).json({ 
      success: true,
      message: "Password changed successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Gửi OTP xác minh email
exports.sendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const otpCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    // Lưu OTP vào Redis với thời gian sống 5 phút
    const redisClient = getRedisClient();
    await redisClient.setEx(`otp:${email}`, 300, otpCode);
    console.log(`OTP for ${email}: ${otpCode}`);
    await sendEmail(email, "Verify your email", `Your verification code is: ${otpCode}`);

    res.status(200).json({ 
      success: true,
      message: "OTP sent successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Xác minh email bằng OTP (chỉ cần nhập OTP)
exports.verifyEmailWithOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const redisClient = getRedisClient();

    // Tìm email từ OTP trong Redis
    const keys = await redisClient.keys('otp:*');
    let email = null;
    for (const key of keys) {
      const savedOtp = await redisClient.get(key);
      if (savedOtp === otp) {
        email = key.split(':')[1];
        break;
      }
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Xóa OTP khỏi Redis sau khi xác thực thành công
    await redisClient.del(`otp:${email}`);
    user.verified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Gửi OTP quên mật khẩu
exports.sendForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const otpCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    const redisClient = getRedisClient();
    // Lưu OTP -> email
    await redisClient.setEx(`forgot_password_otp:${otpCode}`, 300, email);
    console.log(`Forgot Password OTP for ${email}: ${otpCode}`);
    await sendEmail(email, "Reset your password", `Your verification code is: ${otpCode}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Xác thực OTP quên mật khẩu
exports.verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const redisClient = getRedisClient();
    const email = await redisClient.get(`forgot_password_otp:${otp}`);
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }
    req.session.resetEmail = email; // Lưu email vào session
    await redisClient.del(`forgot_password_otp:${otp}`);
    res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now reset your password."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const email = req.session.resetEmail;
    if (!email) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to reset password or session expired"
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    user.password = newPassword;
    await user.save();
    req.session.resetEmail = null; // Xóa session sau khi đổi mật khẩu
    await sendEmail(
      email,
      "Password changed successfully",
      "Your password has been changed successfully. If you didn't make this change, please contact us immediately."
    );
    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

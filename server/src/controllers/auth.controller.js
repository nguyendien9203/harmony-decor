const User = require("../models/user.model");
const { generateToken } = require("../config/jwt");
const { sendOtpEmail, generateOtp } = require("../config/email");
const { getRedisClient } = require("../config/redis");
const logger = require("../utils/logger");
const authService = require("../services/auth.service");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email }).select("+password");
    if (existingUser) {
      if (existingUser.password) {
        return res.status(400).json({
          success: false,
          message: "Email đã tồn tại.",
        });
      } else if (existingUser.oauthId && existingUser.oauthProvider) {
        existingUser.phone = phone;
        existingUser.password = password;
        existingUser.verified = false;
        await existingUser.save();

        const otpCode = await generateOtp(email);
        await sendOtpEmail(email, otpCode);

        res.status(201).json({
          success: true,
          message:
            "Đăng kí thành công. Vui lòng kiểm tra email để xác minh tài khoản.",
        });
      }
    } else {
      const user = new User({ name, email, password, phone, verified: false });
      await user.save();

      const otpCode = await generateOtp(email);
      await sendOtpEmail(email, otpCode);

      res.status(201).json({
        success: true,
        message:
          "Đăng kí thành công. Vui lòng kiểm tra email để xác minh tài khoản.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email không tồn tại",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        status: 403,
        message: "Tài khoản của bạn đã bị khóa",
      });
    }

    if (!user.password && user.oauthId && user.oauthProvider) {
      return res.status(400).json({
        success: false,
        message:
          "Tài khoản này đăng ký bằng Google. Vui lòng đăng nhập bằng Google.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu không đúng",
      });
    }

    // Nếu user chưa verify email thì gửi lại OTP
    if (!user.verified) {
      const otpCode = await generateOtp(email);
      await sendOtpEmail(email, otpCode);
      return res.status(400).json({
        status: 400,
        message:
          "Email chưa được xác minh. Vui lòng kiểm tra email để xác minh tài khoản.",
      });
    }

    const tokens = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      accessToken: tokens,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// OAuth2 Google login
exports.googleOauthHandler = async (req, res) => {
  try {
    const code = req.query.code;

    const { id_token, access_token } = await authService.getGoogleTokens({
      code,
    });
    console.log("Google OAuth tokens:", { id_token, access_token });

    const googleUser = await authService.getGoogleUser({
      id_token,
      access_token,
    });
    console.log("Decoded Google user:", { googleUser });

    const { id, email, name, picture, verified_email } = googleUser;

    if (!verified_email) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản Google chưa được xác minh",
      });
    }

    const existingUser = await User.findOne({ email });

    logger.info("Existing user found:", {
      email: existingUser ? existingUser : "No existing user",
    });

    if (existingUser) {
      if (existingUser.status !== "ACTIVE") {
        return res.status(403).json({
          status: 403,
          message: "Tài khoản của bạn đã bị khóa",
        });
      }

      if (!existingUser.oauthId) {
        existingUser.oauthId = id;
        existingUser.oauthProvider = "GOOGLE";
        await existingUser.save();
      }

      const tokens = generateToken(existingUser);
      return res.redirect(
        `${
          process.env.CORS_ORIGIN
        }/oauth-success?accessToken=${encodeURIComponent(tokens)}`
      );
    } else {
      const newUser = new User({
        name,
        email,
        oauthId: id,
        oauthProvider: "GOOGLE",
        avatar: picture,
        verified: true,
      });

      await newUser.save();

      const tokens = generateToken(newUser);
      return res.redirect(
        `${
          process.env.CORS_ORIGIN
        }/oauth-success?accessToken=${encodeURIComponent(tokens)}`
      );
    }
  } catch (error) {
    logger.error("Google OAuth error:", error);
    res.redirect(
      `${process.env.CORS_ORIGIN}/login?error=${encodeURIComponent(
        error.message
      )}`
    );
  }
};

// Send OTP to email for verification
exports.sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }
    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: "Email đã được xác minh trước đó",
      });
    }
    const otpCode = await generateOtp(email);
    await sendOtpEmail(email, otpCode);
    res.status(200).json({
      success: true,
      message: "OTP đã được gửi đến email để xác minh tài khoản",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send OTP for forgot password
exports.sendForgotPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }
    const otpCode = await generateOtp(email);
    await sendOtpEmail(email, otpCode);

    res.status(200).json({
      success: true,
      message: "OTP đã được gửi đến email để đặt lại mật khẩu",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify email with OTP
exports.verifyEmail = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const redisClient = getRedisClient();

    const savedOtp = await redisClient.get(`otp:${email}`);
    if (!savedOtp || savedOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "OTP không hợp lệ hoặc đã hết hạn",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }

    user.verified = true;
    await user.save();

    // Delete OTP from Redis after successful verification
    await redisClient.del(`otp:${email}`);

    const tokens = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Email đã được xác minh thành công",
      accessToken: tokens,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }

    user.password = newPassword;
    await user.save();

    // Delete OTP from Redis after successful password reset
    const redisClient = getRedisClient();
    await redisClient.del(`otp:${email}`);

    res.status(200).json({
      success: true,
      message: "Mật khẩu đã được đặt lại thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu cũ không đúng",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Mật khẩu đã được thay đổi thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

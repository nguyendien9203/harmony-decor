const nodeMailer = require("nodemailer");
const redis = require("redis");
const otp = require("otp-generator");
require("dotenv").config();

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.APP_NAME,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
};

exports.generateOtp = async (email) => {
  const otpCode = otp.generate(6, { upperCase: false, specialChars: false });
  const client = redis.createClient();

  try {
    await client.connect();
    await client.setEx(`otp:${email}`, 300, otpCode); // Store OTP with a 5-minute expiration
    console.log(`OTP generated and stored for ${email}`);
    return otpCode;
  } catch (error) {
    console.error(`Failed to generate OTP for ${email}:`, error);
  } finally {
    await client.quit();
  }
};

exports.sendOtpEmail = async (to) => {
  const otpCode = await this.generateOtp(to);
  const htmlContent = `
    <p>Xin chào,</p>
    <p>Bạn vừa yêu cầu mã xác thực (OTP) để thực hiện một hành động quan trọng trên hệ thống của chúng tôi.</p>
    <p>Mã OTP của bạn là: <strong style="font-size: 18px; color: #2d3748;">${otpCode}</strong></p>
    <p>Vui lòng sử dụng mã này trong vòng <strong>5 phút</strong> để hoàn tất quá trình xác minh.</p>
    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ.</p>
    <p>Trân trọng,<br/>Đội ngũ Hỗ trợ Khách hàng</p>
 `;

  try {
    await this.sendEmail(
      email,
      "Mã xác thực OTP từ Harmony Decor",
      htmlContent
    );

    // Store OTP in Redis with a 5-minute expiration
    const client = redis.createClient();
    await client.connect();
    await client.setEx(`otp:${to}`, 300, otpCode);
    await client.quit();

    console.log(`OTP sent to ${to} and stored in Redis`);
    return { success: true, message: `OTP đã được gửi tới ${to}` };
  } catch (error) {
    console.error(`Failed to send OTP email to ${to}:`, error);
  }
};

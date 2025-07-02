const nodeMailer = require("nodemailer");
const { getRedisClient } = require("../config/redis");
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
  const otpCode = otp.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const client = getRedisClient();
  console.log(otpCode);

  try {
    await client.setEx(`otp:${email}`, 300, otpCode); // Store OTP with a 5-minute expiration
    console.log(`OTP generated and stored for ${email}`);
    return otpCode;
  } catch (error) {
    console.error(`Failed to generate OTP for ${email}:`, error);
    throw error;
  }
};

exports.sendOtpEmail = async (email, otpCode) => {
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

    return { success: true, message: `OTP đã được gửi tới ${email}` };
  } catch (error) {
    console.error(`Failed to send OTP email to ${email}:`, error);
    throw error;
  }
};

exports.sendOrderSuccessEmail = async (order) => {
  const htmlContent = `
    <p>Xin chào,</p>
    <p>Chúng tôi xin thông báo rằng đơn hàng của bạn đã đặt hàng thành công.</p>
    <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
    <p><strong>Tổng số tiền:</strong> ${order.totalAmount} VNĐ</p>
    <p>Cảm ơn bạn đã mua sắm tại Harmony Decor!</p>
    <p>Trân trọng,<br/>Đội ngũ Hỗ trợ Khách hàng</p>
  `;

  try {
    await this.sendEmail(
      order.userId.email,
      "Xác nhận thanh toán đơn hàng",
      htmlContent
    );

    return { success: true, message: "Email xác nhận thanh toán đã được gửi" };
  } catch (error) {
    console.error("Failed to send order paid email:", error);
    throw error;
  }
};

exports.sendOrderShippedEmail = async (order) => {
  const htmlContent = `
    <p>Xin chào,</p>
    <p>Chúng tôi xin thông báo rằng đơn hàng của bạn đã được vận chuyển.</p>
    <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
    <p><strong>Tổng số tiền:</strong> ${order.totalAmount} VNĐ</p>
    <p>Cảm ơn bạn đã mua sắm tại Harmony Decor!</p>
    <p>Trân trọng,<br/>Đội ngũ Hỗ trợ Khách hàng</p>
  `;

  try {
    await this.sendEmail(
      order.userId.email,
      "Thông báo vận chuyển đơn hàng",
      htmlContent
    );

    return { success: true, message: "Email thông báo vận chuyển đã được gửi" };
  } catch (error) {
    console.error("Failed to send order shipped email:", error);
    throw error;
  }
};

exports.sendOrderDeliveredEmail = async (order) => {
  const htmlContent = `
    <p>Xin chào,</p>
    <p>Chúng tôi xin thông báo rằng đơn hàng của bạn đã được giao thành công.</p>
    <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
    <p><strong>Tổng số tiền:</strong> ${order.totalAmount} VNĐ</p>
    <p>Cảm ơn bạn đã mua sắm tại Harmony Decor!</p>
    <p>Trân trọng,<br/>Đội ngũ Hỗ trợ Khách hàng</p>
  `;

  try {
    await this.sendEmail(
      order.userId.email,
      "Thông báo giao hàng thành công",
      htmlContent
    );

    return { success: true, message: "Email thông báo giao hàng đã được gửi" };
  } catch (error) {
    console.error("Failed to send order delivered email:", error);
    throw error;
  }
};

exports.sendOrderCancelledEmail = async (order) => {
  const htmlContent = `
    <p>Xin chào,</p>
    <p>Chúng tôi xin thông báo rằng đơn hàng của bạn đã bị hủy.</p>
    <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
    <p><strong>Tổng số tiền:</strong> ${order.totalAmount} VNĐ</p>
    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
    <p>Trân trọng,<br/>Đội ngũ Hỗ trợ Khách hàng</p>
  `;

  try {
    await this.sendEmail(
      order.userId.email,
      "Thông báo hủy đơn hàng",
      htmlContent
    );

    return {
      success: true,
      message: "Email thông báo hủy đơn hàng đã được gửi",
    };
  } catch (error) {
    console.error("Failed to send order cancelled email:", error);
    throw error;
  }
};

const crypto = require("crypto");
const queryString = require("qs");
const moment = require("moment");
const vnpay = require("../config/vnpay");
const Order = require("../models/order.model");
const { formatOrder } = require("../utils/format");
const { generatePaymentQRCode } = require("../services/payment.service");
const logger = require("../utils/logger");
const { sendOrderSuccessEmail } = require("../config/email");

// Generate payment QR code (user)
exports.generateQRCode = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("items.productId", "name images price")
      .exec();

    if (!order) {
      return res.status(404).json({
        status: 404,
        message: "Đơn hàng không tồn tại",
      });
    }

    if (order.paymentMethod !== "ONLINE_PAYMENT") {
      return res.status(400).json({
        status: 400,
        message: "Đơn hàng không yêu cầu thanh toán trực tuyến",
      });
    }

    const qrResponse = await generatePaymentQRCode(order);

    if (!qrResponse || qrResponse.code !== "00") {
      return res.status(500).json({
        status: 500,
        message: "Lỗi khi tạo QR code thanh toán",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Tạo QR code thanh toán thành công",
      qrCodeUrl: qrResponse.data.qrDataURL,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

exports.webhookHandler = async (req, res) => {
  try {
    let error = req.body.error;
    if (error != 0) {
      return;
    }
    // 1. Check time response
    const startTime = Date.now();

    console.log("Webhook headers:", req.headers);
    console.log("Webhook body:", req.body);

    // 2. Check signature
    // const signatureHeader = req.headers["x-casso-signature"];
    // if (!signatureHeader) {
    //   logger.error("Missing x-casso-signature header");
    //   return res.status(400).json({
    //     success: false,
    //     message: "Thiếu x-casso-signature trong header",
    //   });
    // }

    // const parts = signatureHeader.split(",");

    // const v1Part = parts.find((part) => part.trim().startsWith("v1="));

    // const signature = v1Part ? v1Part.trim().substring(3) : null; // bỏ "v1="

    // if (!signature) {
    //   logger.error("No secure token v1 found in header");
    //   return res.status(400).json({
    //     success: false,
    //     message: "Thiếu secure token v1 trong header",
    //   });
    // }
    const webhookData = req.body.data;
    if (!webhookData || !webhookData.id || !webhookData.amount) {
      logger.error("Data webhook invalid", req.body);
      return res.status(400).json({
        success: false,
        message: "Dữ liệu webhook không hợp lệ",
      });
    }

    // const secureToken = process.env.CASSO_SECURE_TOKEN;
    // const payload = JSON.stringify(webhookData);
    // const hmac = crypto
    //   .createHmac("sha256", secureToken)
    //   .update(payload)
    //   .digest("hex");

    // console.log("HMAC:", hmac);
    // console.log("Signature:", signature);
    // console.log("Secure Token:", secureToken);

    // if (hmac !== signature) {
    //   logger.error("Invalid signature");
    //   return res
    //     .status(403)
    //     .json({ success: false, message: "Chữ ký không hợp lệ" });
    // }
    // 3. Check duplicate transaction
    const { id, amount, description, transactionDateTime } = webhookData;
    const existingTransaction = await Order.findOne({
      transactionId: id,
    });
    if (existingTransaction) {
      logger.warn(`Trancsaction ${id} was already processed`);
      return res.status(200).json({
        success: true,
        message: "Giao dịch đã được xử lý trước đó",
      });
    }

    // 4. Check order ID in description
    const orderIdMatch = description.match(/Thanh toan don hang (\w+)/);
    const orderId = orderIdMatch ? orderIdMatch[1] : null;
    if (!orderId) {
      logger.error("No order ID found in transaction description", description);
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy mã đơn hàng trong mô tả giao dịch",
      });
    }

    // 5. Check order exists
    const order = await Order.findById(orderId)
      .populate("items.productId", "name images price")
      .populate("userId", "email")
      .exec();
    if (!order) {
      logger.error(`Order ${orderId} does not exist`);
      return res.status(404).json({
        success: false,
        message: `Đơn hàng với ID ${orderId} không tồn tại`,
      });
    }

    // Check amount and payment method
    if (order.paymentMethod !== "ONLINE_PAYMENT") {
      logger.error(`Order ${orderId} does not require online payment`);
      return res.status(400).json({
        success: false,
        message: `Đơn hàng ${orderId} không yêu cầu thanh toán trực tuyến`,
      });
    }
    if (order.totalAmount !== amount) {
      logger.error(
        `The amount does not match for order ${orderId}: expected ${order.totalAmount}, received ${amount}`
      );
      return res.status(400).json({
        success: false,
        message: `Số tiền không khớp cho đơn hàng ${orderId}: kỳ vọng ${order.totalAmount}, nhận ${amount}`,
      });
    }

    // Check status
    if (order.paymentStatus === "PAID" || order.paymentStatus === "CANCELLED") {
      logger.warn(`Order ${orderId} has already been paid or cancelled`);
      return res.status(200).json({
        success: true,
        message: `Đơn hàng ${orderId} đã được thanh toán hoặc hủy bỏ trước đó`,
      });
    }

    // 6. Update order status
    order.paymentStatus = "PAID";
    order.paidAt = new Date(transactionDateTime);
    order.transactionId = id;
    order.orderStatus = "PROCESSING";
    await order.save();

    console.log("Order in paid: ", order);

    // 7. Send email notification
    await sendOrderSuccessEmail(order);

    //8. Response in 5 minutes
    const processingTime = Date.now() - startTime;
    if (processingTime > 4500) {
      logger.warn(
        `Webhook processing time exceeded 4.5 seconds: ${processingTime}ms`
      );
    }

    res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xử lý webhook",
      error: error.message,
    });
  }
};

exports.createPaymentUrl = async (req, res) => {
  try {
    const { amount, orderId, bankCode } = req.body;

    let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    if (ipAddr === "::1" || ipAddr === "::ffff:127.0.0.1") {
      ipAddr = "127.0.0.1";
    }

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let tmnCode = vnpay.vnp_TmnCode;
    let secretKey = vnpay.vnp_HashSecret;
    let vnpUrl = vnpay.vnp_Url;
    let returnUrl = vnpay.vnp_ReturnUrl;

    let locale = "vn";
    let currCode = "VND";

    let vnp_Params = {};
    vnp_Params.vnp_Version = "2.1.0";
    vnp_Params.vnp_Command = "pay";
    vnp_Params.vnp_TmnCode = tmnCode;
    vnp_Params.vnp_Locale = locale;
    vnp_Params.vnp_CurrCode = currCode;
    vnp_Params.vnp_TxnRef = orderId;
    vnp_Params.vnp_OrderInfo = `Thanh toan cho ma GD: ${orderId}`;
    vnp_Params.vnp_OrderType = "other";
    vnp_Params.vnp_Amount = amount * 100;
    vnp_Params.vnp_ReturnUrl = returnUrl;
    vnp_Params.vnp_IpAddr = ipAddr;
    vnp_Params.vnp_CreateDate = createDate;

    if (typeof bankCode === "string" && bankCode.trim() !== "") {
      vnp_Params.vnp_BankCode = bankCode;
    }
    // Sort the parameters
    vnp_Params = sortObject(vnp_Params);

    // Create the query string
    let signData = queryString.stringify(vnp_Params, { encode: false });

    // Create the secure hash
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params.vnp_SecureHash = signed;
    vnpUrl += "?" + queryString.stringify(vnp_Params, { encode: false });

    res.status(200).json({
      status: 200,
      message: "Tạo URL thanh toán thành công",
      vnpUrl,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi tạo URL thanh toán",
      error: error.message,
    });
  }
};

// Handle the payment return from VNPAY
exports.handlePaymentReturn = async (req, res) => {
  try {
    let vnp_Params = { ...req.query };

    // Get the secure hash and remove it from the parameters
    let secureHash = vnp_Params.vnp_SecureHash;

    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const orderId = vnp_Params.vnp_TxnRef;
    const order = await Order.findOne({ orderId }).populate(
      "items.productId",
      "name images price"
    );
    if (order && order.paymentStatus === "PAID") {
      return res.status(200).json({
        success: true,
        code: "00",
        status: 200,
        order: formatOrder(order),
        message: "Thanh toán đã được xác nhận bởi IPN",
      });
    }

    // Sort the parameters
    vnp_Params = sortObject(vnp_Params);

    let tmnCode = vnpay.vnp_TmnCode;
    let secretKey = vnpay.vnp_HashSecret;
    let transactionId = vnp_Params.vnp_TransactionNo;

    // Create the query string
    const signData = queryString.stringify(vnp_Params, { encode: false });

    // Verify the secure hash
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      const responseCode = vnp_Params.vnp_ResponseCode;
      if (responseCode === "00") {
        // Get order details with products

        const order = await Order.findById(orderId)
          .populate("items.productId", "name images price")
          .exec();

        if (!order) {
          return res.status(404).json({
            status: 404,
            message: "Đơn hàng không tồn tại!",
          });
        }

        // Update order status to PAID
        order.paymentStatus = "PAID";
        order.paidAt = new Date();
        order.transactionId = transactionId;
        await order.save();

        // Payment successful
        res.status(200).json({
          code: responseCode,
          status: 200,
          order: formatOrder(order),
          message: "Thanh toán thành công",
        });
      } else {
        if (order) {
          order.paymentStatus = "FAILED";
          order.paidAt = null;
          order.transactionId = null;
          order.orderStatus = "CANCELLED";
          await order.save();
        }

        // Payment failed
        res.status(400).json({
          code: responseCode,
          status: 400,
          message: `Thanh toán thất bại. Mã lỗi: ${responseCode}`,
        });
      }
    } else {
      // Invalid signature
      res.status(400).json({
        status: 400,
        message: "Chữ ký không hợp lệ!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Handle the payment notification from VNPAY
exports.handlePaymentNotification = async (req, res) => {
  try {
    console.log("IPN received:", req.query);
    let vnp_Params = { ...req.query };
    let secureHash = vnp_Params.vnp_SecureHash;

    let orderId = vnp_Params.vnp_TxnRef;
    let rspCode = vnp_Params.vnp_ResponseCode;

    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    // Sort the parameters
    vnp_Params = sortObject(vnp_Params);

    let secretKey = vnpay.vnp_HashSecret;

    // Create the query string
    const signData = queryString.stringify(vnp_Params, { encode: false });

    // Verify the secure hash
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    let paymentStatus = "PENDING";

    let checkOrderId = true;
    let checkAmount = true;

    if (secureHash === signed) {
      // Check if the order ID exists in the database
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus === "PENDING") {
            if (rspCode === "00") {
              // Payment successful
              const order = await Order.findOne({ orderId });
              if (!order) {
                return res
                  .status(404)
                  .json({ RspCode: "01", Message: "Order not found" });
              }
              order.paymentStatus = "PAID";
              order.paidAt = new Date();
              await order.save();
              res.status(200).json({ RspCode: "00", Message: "Success" });
            } else {
              // Payment failed
              const order = await Order.findOne({ orderId });
              if (!order) {
                return res
                  .status(404)
                  .json({ RspCode: "01", Message: "Order not found" });
              }
              order.paymentStatus = "FAILED";
              order.paidAt = null;
              await order.save();
              res.status(200).json({ RspCode: "00", Message: "Success" });
            }
          } else {
            return res.status(400).json({
              RspCode: "02",
              Message: "This order has been updated to the payment status",
            });
          }
        } else {
          return res
            .status(400)
            .json({ RspCode: "04", Message: "Amount invalid" });
        }
      } else {
        return res
          .status(400)
          .json({ RspCode: "01", Message: "Order not found" });
      }
    } else {
      res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (let key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

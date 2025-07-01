const axios = require("axios");

exports.generatePaymentQRCode = async ({ _id, totalAmount }) => {
  try {
    const qrCodeData = {
      accountNo: process.env.VIETQR_ACCOUNT_NO,
      accountName: process.env.VIETQR_ACCOUNT_NAME,
      acqId: process.env.VIET_QR_ACQ_ID,
      amount: totalAmount,
      addInfo: `Thanh toan don hang ${_id}`,
      template: "print",
    };

    // Simulate QR code generation
    const qrResponse = await axios.post(
      process.env.VIET_QR_API_GENERATE,
      qrCodeData,
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-Id": process.env.VIET_QR_CLIENT_ID,
          "x-api-key": process.env.VIET_QR_API_KEY,
        },
      }
    );

    return qrResponse.data;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Lỗi khi tạo QR code thanh toán");
  }
};

exports.syncTransaction = async (req, res) => {
  try {
    const response = await axios.post(
      process.env.CASSO_API_GATEWAY_URL,
      {
        bank_acc_id: process.env.VIETQR_ACCOUNT_NO,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Apikey ${process.env.CASSO_API_KEY}`,
          "Cache-Control": "no-cache",
        },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error syncing transactions:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi đồng bộ giao dịch",
    });
  }
};

const Discount = require("../models/discount.model");

exports.validateDiscount = async (req, res) => {
  try {
    const { code, total } = req.body;

    const discount = await Discount.findOne({
      code: code?.toUpperCase(),
      isActive: true,
    });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Mã giảm giá không hợp lệ.",
      });
    }

    // Check if the discount is within the valid date range
    const currentDate = new Date();
    if (currentDate < discount.startDate || currentDate > discount.endDate) {
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá không còn hiệu lực.",
      });
    }

    // Check if the total meets the minimum order value
    if (total < discount.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu để áp dụng mã giảm giá là ${discount.minOrderValue} VNĐ.`,
      });
    }

    // Check if the usage limit has been reached
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá đã được sử dụng hết.",
      });
    }

    return res.json({
      amount: discount.amount,
      type: discount.type,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new discount
exports.createDiscount = async (req, res) => {
  try {
    const {
      code,
      type,
      amount,
      minOrderValue,
      usageLimit,
      usedCount,
      startDate,
      endDate,
      isActive,
    } = req.body;

    // Check if the discount code already exists
    const existingDiscount = await Discount.findOne({
      code: code.toUpperCase(),
    });

    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá đã tồn tại.",
      });
    }

    // Create a new discount
    const discount = new Discount({
      code: code.toUpperCase(),
      type,
      amount,
      minOrderValue: minOrderValue || 0,
      usageLimit: usageLimit || null,
      usedCount: usedCount || 0,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: isActive !== undefined ? isActive : true,
    });
    await discount.save();

    res.status(201).json({
      success: true,
      message: "Mã giảm giá đã được tạo thành công.",
      discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

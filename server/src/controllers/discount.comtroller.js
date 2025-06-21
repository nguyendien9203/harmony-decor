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

// Lấy tất cả discount
exports.getAllDiscounts = async (req, res) => {
  try {
    const { search, type, isActive, startDate, endDate } = req.query;
    let query = {};

    if (search) {
      query.code = { $regex: search, $options: "i" };
    }
    if (type) {
      query.type = type;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const totalDiscounts = await Discount.countDocuments(query);
    const totalPages = Math.ceil(totalDiscounts / limit);
    const discounts = await Discount.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return res.json({
      success: true,
      discounts,
      pagination: {
        currentPage: page,
        totalPages,
        totalDiscounts,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy discount theo id
exports.getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ success: false, message: "Không tìm thấy mã giảm giá." });
    }
    res.json({ success: true, discount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật discount
exports.updateDiscount = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.code) updateData.code = updateData.code.toUpperCase();
    const discount = await Discount.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!discount) {
      return res.status(404).json({ success: false, message: "Không tìm thấy mã giảm giá." });
    }
    res.json({ success: true, message: "Cập nhật mã giảm giá thành công.", discount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["PERCENT", "FIXED"], // % hoặc giảm số tiền cố định
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    minOrderValue: {
      type: Number,
      default: 0, // giá trị đơn hàng tối thiểu để áp dụng
    },
    usageLimit: {
      type: Number,
      default: 1, // số lần sử dụng tối đa
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", discountSchema);

const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema(
  {
    recipientName: {
      type: String,
      required: [true, "Recipient name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    phone: {
      type: String,
      required: true,
      match: [
        /^(?:\+84|0)(3[2-9]|5[2689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/,
        "Invalid phone number",
      ],
    },
    street: {
      type: String,
      required: [true, "Street address is required"],
    },
    ward: {
      type: Number,
      required: [true, "Ward is required"],
    },
    district: {
      type: Number,
      required: [true, "District is required"],
    },
    province: {
      type: Number,
      required: [true, "City is required"],
    },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    total: {
      type: Number,
      required: true,
      min: [0, "Total must be a positive number"],
    },

    discountCode: {
      type: String,
      maxlength: [20, "Discount code cannot exceed 20 characters"],
      trim: true,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: [0, "Discount amount must be a positive number"],
    },

    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount must be a positive number"],
    },

    paymentMethod: {
      type: String,
      enum: ["CASH_ON_DELIVERY", "ONLINE_PAYMENT"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    orderStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },

    note: {
      type: String,
      maxlength: 500,
    },

    deliveredAt: Date,
    paidAt: Date,
    transactionId: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema(
  {
    recipientName: {
      type: String,
      required: true,
      trim: true,
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
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (this.isModified("items")) {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);

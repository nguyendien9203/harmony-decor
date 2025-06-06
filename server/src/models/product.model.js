const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must have at least 3 characters"],
      maxlength: [100, "Product name must have at most 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String, // HTML in text format (e.g., <p>Product description</p>)
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price must be a positive number"],
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one image is required",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "INACTIVE", "OUT_OF_STOCK"],
        message: "Status must be 'ACTIVE', 'INACTIVE', or 'OUT_OF_STOCK'",
      },
      default: "INACTIVE",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Product stock must be a non-negative number"],
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, "Ratings must be a non-negative number"],
      max: [5, "Ratings must not exceed 5"],
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating must not exceed 5"],
        },
        comment: {
          type: String,
          maxlength: [500, "Comment must have at most 500 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product creator is required"],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product updater is required"],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
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
    password: {
      type: String,
      minLength: [8, "Password must have at least 8 characters"],
      select: false, // Do not return password in queries
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    avatar: {
      type: String,
      default: "https://example.com/default-avatar.png", // Default avatar URL
    },
    oauthId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    oauthProvider: {
      type: String,
      enum: {
        values: ["GOOGLE", "FACEBOOK"],
        message: "OAuth provider must be 'GOOGLE', 'FACEBOOK', or 'GITHUB'",
      },
      default: null,
    },
    phone: {
      type: String,
      match: [
        /^(?:\+84|0)(3[2-9]|5[2689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/,
        "Invalid phone number",
      ],
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "INACTIVE", "BANNED"],
        message: "Status must be 'ACTIVE', 'INACTIVE', or 'BANNED'",
      },
      default: "ACTIVE",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: String,
      enum: {
        values: ["USER", "ADMIN"],
        message: "Role must be 'USER' or 'ADMIN'",
      },
      default: "USER",
    },
  },
  { timestamps: true }
);

// Hashed password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Error comparing password");
  }
};

module.exports = mongoose.model("User", userSchema);

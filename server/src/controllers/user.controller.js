const User = require("../models/user.model");

// Utility: handle validation error
exports.handleValidationError = (res, error, customMessage) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ success: false, message: customMessage || "Validation error", errors });
  }
  res.status(500).json({ success: false, message: customMessage || "Server error", error: error.message });
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update current user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    Object.assign(user, req.body);
    await user.save();

    res.status(200).json({ success: true, message: "Profile updated successfully", data: { user } });
  } catch (error) {
    handleValidationError(res, error, "Server error during profile update");
  }
};

// Admin: Get all users with pagination + filter
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, role, verified, search } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (role) filter.roles = role;
    if (verified !== undefined) filter.verified = verified === 'true';
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(filter).select("-password").skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: +page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Admin: Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Admin: Create new user
exports.createUser = async (req, res) => {
  try {
    const { email, password, name, phone, roles = "USER", status = "ACTIVE" } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "Email already exists" });

    const user = new User({ email, password, name, phone, roles, status });
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ success: true, message: "User created successfully", data: { user: userObj } });
  } catch (error) {
    handleValidationError(res, error, "Server error during user creation");
  }
};

// Admin: Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, status, roles } = req.body;

    if (status && !["ACTIVE", "INACTIVE", "BANNED"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status value" });

    if (roles && !["USER", "ADMIN"].includes(roles))
      return res.status(400).json({ success: false, message: "Invalid role value" });

    if (email) {
      const exists = await User.findOne({ email, _id: { $ne: id } });
      if (exists) return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User updated successfully", data: { user } });
  } catch (error) {
    handleValidationError(res, error, "Server error during user update");
  }
};

// Admin: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Admin: Get user stats
exports.getUserStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, inactiveUsers, bannedUsers, verifiedUsers, adminUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "ACTIVE" }),
      User.countDocuments({ status: "INACTIVE" }),
      User.countDocuments({ status: "BANNED" }),
      User.countDocuments({ verified: true }),
      User.countDocuments({ roles: "ADMIN" }),
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: { totalUsers, activeUsers, inactiveUsers, bannedUsers, verifiedUsers, adminUsers },
        monthlyRegistrations: monthlyStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



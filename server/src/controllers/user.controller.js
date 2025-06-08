const User = require("../models/user.model");
// const handleValidationError = require('../middlewares/validateRequest')
const cloudinary = require("../config/cloudinary");
const fs = require("fs");


exports.handleProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });

    if (req.method === 'PUT') {
      Object.assign(user, req.body);
      let imageUrl = null;
          if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "users",
              resource_type: "image",
              transformation: [
              { width: 300, height: 300, crop: "fill", gravity: "face" },
              { quality: "auto" }
            ]
            });
            imageUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
          }
      user.avatar = imageUrl;
      await user.save({user});
      return res.status(200).json({ 
        success: true, 
        message: "Cập nhật thông tin thành công", 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};

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

    if (req.query.includeStats === 'true') {
      const [activeUsers, inactiveUsers, bannedUsers, verifiedUsers, adminUsers] = await Promise.all([
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

      return res.status(200).json({
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
          stats: {
            overview: { 
              totalUsers: total, 
              activeUsers, 
              inactiveUsers, 
              bannedUsers, 
              verifiedUsers, 
              adminUsers 
            },
            monthlyRegistrations: monthlyStats,
          }
        },
      });
    }

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
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, name, phone, roles = "USER", status = "ACTIVE" } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "Email đã tồn tại" });

    const user = new User({ email, password, name, phone, roles, status });
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ success: true, message: "Tạo người dùng thành công", data: { user: userObj } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// Admin: Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    let imageUrl = null;
          if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "users",
              resource_type: "image",
              transformation: [
              { width: 300, height: 300, crop: "fill", gravity: "face" },
              { quality: "auto" }
            ]
            });
            imageUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
          }
    user.avatar = imageUrl;
    res.status(200).json({ success: true, message: "Cập nhật người dùng thành công"});
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};

exports.updateStatus = async (req,res) =>{
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {status : req.body.status},{new : true, runValidators : true});
    res.status(200).json({ success: true, message: "Cập nhật trạng thái người dùng thành công"});
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
}
exports.updateRole = async (req,res) =>{
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {roles : req.body.roles},{new : true, runValidators : true});
    res.status(200).json({ success: true, message: "Cập nhật vai trò người dùng thành công"});
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
}

// Admin: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });

    res.status(200).json({ success: true, message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};



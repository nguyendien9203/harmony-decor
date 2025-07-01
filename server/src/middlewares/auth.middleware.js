const { verifyToken } = require("../config/jwt");
const User = require("../models/user.model");
require("dotenv").config();

exports.authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header
  if (!token) {
    return res.status(401).json({ message: "Không có quyền truy cập" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};

exports.requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    try {
      const user = await User.findById(req.user.userId);

      if (!user || !user.roles) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền thực hiện thao tác này" });
      }

      if (!allowedRoles.includes(user.roles)) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền thực hiện thao tác này" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
};

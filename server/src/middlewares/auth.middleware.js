const { verifyToken } = require("../config/jwt");
require("dotenv").config();

exports.authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header
  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  try {
    const decoded = verifyToken(token);
    console.log("Decoded Token:", decoded); 
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userRole = req.user.roles; // "ADMIN" dạng string

    // roles = ["ADMIN"] → so sánh được
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions: your role is ${userRole}`,
      });
    }

    next();
  };
};




const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { verifyToken } = require("../config/jwt");
require("dotenv").config();

exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Access token is required" 
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ 
        success: false,
        message: "User account is not active" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Token has expired" 
      });
    }
    return res.status(403).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};

exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }

    if (!roles.includes(req.user.roles)) {
      return res.status(403).json({ 
        success: false,
        message: "Insufficient permissions" 
      });
    }

    next();
  };
};

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { verifyToken } = require("../config/jwt");
require("dotenv").config();

exports.authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header
  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

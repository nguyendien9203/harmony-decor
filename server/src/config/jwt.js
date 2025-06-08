const jwt = require("jsonwebtoken");

exports.generateToken = (userId) => {
  const payload = { userId };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "1h" }; // Token expires in 1 hour
  return jwt.sign(payload, secret, options);
};

exports.verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

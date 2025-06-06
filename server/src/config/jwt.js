const jwt = require("jsonwebtoken");
const redis = require("redis");

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

exports.storeTokenInRedis = async (token, userId) => {
  const client = redis.createClient();
  try {
    await client.connect();
    await client.setEx(`token:${userId}`, 3600, token); // Store token with a 1-hour expiration
    console.log(`Token stored for user ${userId}`);
  } catch (error) {
    console.error("Error storing token in Redis:", error);
  } finally {
    await client.quit();
  }
};

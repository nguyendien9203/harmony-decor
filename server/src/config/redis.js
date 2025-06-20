const redis = require("redis");

let redisClient = null;

const getRedisClient = () => {
  if (!redisClient) {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379", // sửa lại để test local
    });

    redisClient.on("connect", () => {
      console.log("Redis client connected successfully");
    });

    redisClient.on("error", (err) => {
      console.error("⚠ Redis client connection error:", err.message);
      // KHÔNG exit nữa, chỉ log
    });
  }
  return redisClient;
};

const connectRedis = async () => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
      console.log("✅ Redis connected successfully");
    }
  } catch (error) {
    console.error("⚠ Redis connection error:", error.message);
    // KHÔNG exit nữa
  }
};

module.exports = {
  getRedisClient,
  connectRedis,
};

const redis = require("redis");

let redisClient = null;

const getRedisClient = () => {
  if (!redisClient) {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || "redis://redis-service:6379"
    });

    redisClient.on("connect", () => {
      console.log("Redis client connected successfully");
    });

    redisClient.on("error", (err) => {
      console.error("Redis client connection error:", err);
      process.exit(1);
    });
  }
  return redisClient;
};

const connectRedis = async () => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
      console.log("Redis connected successfully");
    }
  } catch (error) {
    console.error("Redis connection error:", error);
    process.exit(1);
  }
};

module.exports = {
  getRedisClient,
  connectRedis,
};

const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "redis-service",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

redisClient.on("connect", () => {
  console.log("Redis client connected successfully");
});

redisClient.on("error", (err) => {
  console.error("Redis client connection error:", err);
  process.exit(1);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Redis connection error:", error);
    process.exit(1);
  }
};

module.exports = {
  redisClient,
  connectRedis,
};

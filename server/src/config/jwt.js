const jwt = require("jsonwebtoken");
const { getRedisClient } = require("./redis");

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const verifyToken = (token, isRefreshToken = false) => {
  const secret = isRefreshToken ? process.env.REFRESH_TOKEN_SECRET : process.env.JWT_SECRET;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw error;
  }
};

const storeTokensInRedis = async (userId, tokens) => {
  const client = getRedisClient();
  try {
    // Store access token with 15 minutes expiration
    await client.setEx(`access_token:${userId}`, 900, tokens.accessToken);
    
    // Store refresh token with 7 days expiration
    await client.setEx(`refresh_token:${userId}`, 604800, tokens.refreshToken);
    
    console.log(`Tokens stored for user ${userId}`);
  } catch (error) {
    console.error("Error storing tokens in Redis:", error);
    throw error;
  }
};

const removeTokensFromRedis = async (userId) => {
  const client = getRedisClient();
  try {
    await client.del(`access_token:${userId}`);
    await client.del(`refresh_token:${userId}`);
    console.log(`Tokens removed for user ${userId}`);
  } catch (error) {
    console.error("Error removing tokens from Redis:", error);
    throw error;
  }
};

const verifyTokenInRedis = async (userId, token, isRefreshToken = false) => {
  const client = getRedisClient();
  try {
    const storedToken = await client.get(`${isRefreshToken ? 'refresh' : 'access'}_token:${userId}`);
    return storedToken === token;
  } catch (error) {
    console.error("Error verifying token in Redis:", error);
    return false;
  }
};

module.exports = {
  generateTokens,
  verifyToken,
  storeTokensInRedis,
  removeTokensFromRedis,
  verifyTokenInRedis
};

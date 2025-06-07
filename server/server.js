const app = require("./src/app");
const { connectRedis } = require("./src/config/redis");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectRedis();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

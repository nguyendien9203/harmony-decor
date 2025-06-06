require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const cookieParser = require("cookie-parser");

const app = express();

// Connect DB + Redis
connectDB();
connectRedis();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15m
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

module.exports = app;

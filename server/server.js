import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: runs on every request
app.use(cors());          // allow the frontend to call this API
app.use(express.json());  // read JSON sent in request bodies

// Health check route
app.get("/api/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: "ok",
    database: dbConnected ? "connected" : "disconnected",
  });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();

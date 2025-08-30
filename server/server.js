import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from "./routes/auth.js";
import docRoutes from "./routes/docs.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);

// Basic health route
app.get("/", (req, res) => res.send("Knowledge Hub API is running"));

// Mongo connection + start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { dbName: "knowledge-hub" })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

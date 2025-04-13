console.log(" SERVER STARTED!!!");
// require("dotenv").config();
import "dotenv/config"; //  Use import instead of require
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cron from "node-cron";
// const connectDB = require("./config/db");  // replacement below
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import alumniRoutes from "./routes/alumniRoutes.js";
import User from "./models/User.js"; // Import your User model
import placementRoutes from "./routes/placementRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
// app.use(cors());
app.use(cors({
  origin: ['http://localhost:3000', 'https://management-system-indol.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add all methods you use
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'] // Add custom headers
}));

// dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Exit process with failure
  }
};
// connectDB();     // two times running one this and another mongoose below



//  Middleware
app.use(express.json());

//  Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/users", userRoutes);
app.use("/api/placements", placementRoutes);

//  Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

//  Test MongoDB Connection
app.get("/api/test", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ message: "MongoDB Connected Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "MongoDB Connection Failed!", error });
  }
});

//  Run this every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  const now = new Date();
  const deleted = await User.deleteMany({ isVerified: false, verificationExpires: { $lt: now } });
  if (deleted.deletedCount > 0) {
    console.log(` Deleted ${deleted.deletedCount} expired unverified users.`);
  }
});

//  Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

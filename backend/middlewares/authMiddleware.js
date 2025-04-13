const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// const JWT_SECRET = process.env.JWT_SECRET;

// Authentication Middleware 
const authMiddleware = async (req, res, next) => {
  console.log(" Authorization Header:", req.headers.authorization); // Debugging

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Extract token
    console.log("Extracted Token:", token); // Debugging

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
    console.log(" Token Decoded:", decoded); // Debugging

    const user = await User.findById(decoded.id).select("-password"); // Fetch user details without password
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // Attach user to request
    next(); // Continue execution
  } catch (error) {
    console.log(" Token Verification Error:", error.message);

    return res.status(401).json({ message: "Invalid token, authorization denied" });
  }
};

// Admin Authorization Middleware 
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendVerificationEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { error } = require("console");
const generateToken = require("../utils/generateToken");

require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// // Register user
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     // Check if email is provided and is a string
//     if (!email || typeof email !== "string") {
//       return res.status(400).json({ msg: "Invalid email format" });
//     }

//     // Only IIT Goa Emails Allowed
//     if (!email.endsWith("@iitgoa.ac.in")) {
//       return res.status(400).json({ msg: "Only IIT Goa emails are allowed" });
//     }
//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ msg: "User already exists" });

//     // Remove this to prevent double hashing
//     // console.log(" Password Before Hashing:", password);
//     const hashedPassword = await bcrypt.hash(password, 10);
//     // console.log(" Password (just)After Hashing:", hashedPassword);

//     const verificationCode = crypto.randomInt(100000, 999999).toString();
//     const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

//     user = new User({ 
//       name, 
//       email, 
//       password: hashedPassword, 
//       role: "student",
//       verificationCode, 
//       verificationExpires
//     });

//     await user.save();
//     try {
//       await sendVerificationEmail(email, verificationCode);  // ✅ Send email before response
//     } catch (emailError) {
//       console.error("Email Sending Error:", emailError);
//       return res.status(500).json({ msg: "User registered but email not sent. Try again later." });
//     }

//     // Generate JWT token
//     const token = generateToken(user._id);
    
//     res.status(201).json({ 
//       token, 
//       user: { id: user._id, name, email },
//       msg: "Verification code sent to email" 
//     });

//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }

//   // } catch (err) {
//   //   console.error("Registration Error:", err);
//   //   res.status(500).json({ msg: "Internal Server Error" });
//   // }
// });

router.post("/send-otp", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Received request to /send-otp for:", email);

  try {
    //  Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        console.log(" Email already verified:", email);
        return res.status(400).json({ message: "Email already in use" });
      } else {
        console.log(" OTP already sent but not verified for:", email);
        return res.status(400).json({ message: "OTP already sent. Please verify your email." });
      }
    }

    //  Generate OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(" Generated OTP for", email, ":", verificationCode);

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user with OTP
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10-minute expiry

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationCode, //  Store OTP
      verificationExpires, // Store expiration time
      isVerified: false
    });

    await newUser.save();
    console.log(" Temporary user saved to database:", email);

    // Send OTP email
    await sendVerificationEmail(email, verificationCode);
    console.log(" OTP email sent successfully to:", email);

    res.json({ message: "OTP sent to email. Please verify to complete registration." });

  } catch (error) {
    console.error(" Error in /send-otp:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});

//  Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("Received OTP verification request for:", email, "OTP entered:", otp);


    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.isVerified) return res.status(400).json({ msg: "Email already verified" });

    //  Check if OTP is correct and not expired
    if (user.verificationCode !== otp || Date.now() > new Date(user.verificationExpires).getTime()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;
    await user.save();
    console.log(" User verified successfully:", email);

     //  Generate JWT after successful verification
     const token = generateToken(user._id);

  res.json({ 
      msg: "Email verified successfully!", 
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });  
  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Login User
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "Invalid email or password" });

//     //  Check if Email is Verified
//     if (!user.isVerified) {
//       console.log("Email not verified");
//       return res.status(403).json({ msg: "Email not verified. Check your inbox." });
//     }
//     // Debug: Log password values before comparison
//     console.log("🔍 Entered Password:", password);
//     console.log("🔍 Hashed Password from DB:", user.password);
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("Entered Password:", password);
//     console.log("Stored Hashed Password:", user.password);
//     console.log("Password Match Result:", isMatch);

//     if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

//     const token = generateToken(user._id);

//     res.status(200).json({ 
//       token, 
//       user: { id: user._id, name: user.name, email: user.email, role: user.role } 
//     });
//   } catch (err) {
//     console.error("Login Error:", err);
//     res.status(500).json({ msg: "Internal Server Error" });
//   }
// });
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });

      if (!user.isVerified) return res.status(400).json({ message: "User not verified" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ token, role: user.role, username: user.username });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;

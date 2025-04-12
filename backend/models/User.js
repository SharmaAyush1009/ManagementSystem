const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  // name: { type: String, required: true },
  username: { type: String, required: true }, //  Keep only username
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" }, //  Role added
  isVerified: { type: Boolean, default: false },  //  Email verification status
  verificationCode: { type: String, required: false },  // Store OTP or Token
  verificationExpires: { type: Date, required: false },  // Expiration time
  pendingUpdate: { type: mongoose.Schema.Types.Mixed, default: null }, //  Add this line
  profile: { type: mongoose.Schema.Types.Mixed, default: null } // Add this line
});

// Hash password before saving
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();  //  Prevent rehashing existing passwords
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

const User = mongoose.model("User", UserSchema);
module.exports = User;

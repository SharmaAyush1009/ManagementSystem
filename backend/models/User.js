const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" }, 
  isVerified: { type: Boolean, default: false },  
  verificationCode: { type: String, required: false }, 
  verificationExpires: { type: Date, required: false },  
  pendingUpdate: { type: mongoose.Schema.Types.Mixed, default: null }, 
  profile: { type: mongoose.Schema.Types.Mixed, default: null } 
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

const mongoose = require("mongoose");

const PendingUpdateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  updatedFields: { type: Object, required: true }, 
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

module.exports = mongoose.model("PendingUpdate", PendingUpdateSchema);

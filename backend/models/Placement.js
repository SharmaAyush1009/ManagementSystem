const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batch: { type: Number, required: true },
  branch: { type: String, required: true }, // This is the department
  company: { type: String, required: true },
  package: { type: Number, required: true }, // Store LPA
  cpi: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Placement", placementSchema);
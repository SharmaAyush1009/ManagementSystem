const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branch: { type: String, required: true },
  batch: { type: Number, required: true },
  package: { type: Number, required: true },
  company: { type: String, required: true },
});

module.exports = mongoose.model("Alumni", alumniSchema);

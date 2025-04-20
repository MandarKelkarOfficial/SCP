const mongoose = require("mongoose");

const visibilityFlagsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  ugSubmitted: { type: Boolean, default: false },
  hscSubmitted: { type: Boolean, default: false },
  sscSubmitted: { type: Boolean, default: false },
});

module.exports = mongoose.model("VisibilityFlags", visibilityFlagsSchema);



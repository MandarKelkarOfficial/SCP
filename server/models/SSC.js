const mongoose = require("mongoose");

const sscSchema = new mongoose.Schema({
  username: { type: String, required: true },
  esn: { type: String, required: true },
  institution: { type: String, required: true },
  board: { type: String, required: true },
  course: { type: String, required: true },
  yearOfPassing: { type: Date, required: true },
  totalMarks: { type: Number },
  obtainedMarks: { type: Number },
  percentage: { type: String },
  state: { type: String },
  district: { type: String },
  subDistrict: { type: String },
  transcriptFile: { type: String },
});

module.exports = mongoose.model("SSC", sscSchema);

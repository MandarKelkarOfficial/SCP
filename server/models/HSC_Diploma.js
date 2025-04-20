const mongoose = require("mongoose");

const hscDiplomaSchema = new mongoose.Schema({
  username: { type: String, required: true },
  hcn: { type: String, required: true },
  collage: { type: String, required: true },
  course_hsc_diploma: { type: String, required: true },
  gap: { type: String, required: true },
  board: { type: String, required: true },
  startDate: { type: Date },
  graduateDate: { type: Date },
  totalMarks: { type: Number },
  obtainedMarks: { type: Number },
  percentage: { type: String },
  state: { type: String },
  district: { type: String },
  subDistrict: { type: String },
  transcriptFile: { type: String },
});

module.exports = mongoose.model("HSC_Diploma", hscDiplomaSchema);

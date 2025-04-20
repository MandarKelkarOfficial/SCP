const mongoose = require("mongoose");

const ugSchema = new mongoose.Schema({
  username: { type: String },
  srn: { type: String },
  prn: { type: String },
  universityurl: { type: String },
  university: { type: String },
  course: { type: String },
  startDate: { type: Date },
  graduateDate: { type: Date },
  cgp: { type: String },
  state: { type: String },
  district: { type: String },
  transcriptFile: { type: String },
});

module.exports = mongoose.model("UG", ugSchema);

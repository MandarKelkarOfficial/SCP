const mongoose = require('mongoose');

const skillCertificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skillName: { type: String, required: true },
  issuingAuthority: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  blockchainHash: { type: String, required: true },
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('SkillCertificate', skillCertificateSchema);
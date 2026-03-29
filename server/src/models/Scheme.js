const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: { type: String, required: true },
  benefits: { type: String, required: true },
  deadline: { type: Date },
  isActive: { type: Boolean, default: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scheme', schemeSchema);

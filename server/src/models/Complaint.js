const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['pest', 'irrigation', 'soil', 'equipment', 'other'], default: 'other' },
  status: { type: String, enum: ['pending', 'in-progress', 'resolved', 'rejected'], default: 'pending' },
  images: [{ type: String }],
  adminResponse: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

complaintSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);

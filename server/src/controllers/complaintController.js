const Complaint = require('../models/Complaint');

exports.create = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const images = req.files ? req.files.map(f => f.filename) : [];
    const complaint = await Complaint.create({ user: req.user._id, title, description, category, images });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create complaint', error: error.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'name email location').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse, updatedAt: Date.now() },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update complaint' });
  }
};

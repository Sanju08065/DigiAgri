const User = require('../models/User');

exports.getAll = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const Complaint = require('../models/Complaint');
    const Scheme = require('../models/Scheme');
    const [totalUsers, totalComplaints, totalSchemes, pendingComplaints] = await Promise.all([
      User.countDocuments(),
      Complaint.countDocuments(),
      Scheme.countDocuments({ isActive: true }),
      Complaint.countDocuments({ status: 'pending' }),
    ]);
    res.json({ totalUsers, totalComplaints, totalSchemes, pendingComplaints });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

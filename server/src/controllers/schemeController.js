const Scheme = require('../models/Scheme');

exports.getAll = async (req, res) => {
  try {
    const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch schemes' });
  }
};

exports.create = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json(scheme);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create scheme', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    res.json(scheme);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update scheme' });
  }
};

exports.apply = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    if (scheme.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already applied' });
    }
    scheme.applicants.push(req.user._id);
    await scheme.save();
    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Scheme.findByIdAndDelete(req.params.id);
    res.json({ message: 'Scheme deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete scheme' });
  }
};

const router = require('express').Router();
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Complaint = require('../models/Complaint');

// One-time seed endpoint — protected by a secret key
// Call: POST /api/seed  with header  x-seed-key: digiagri_seed_2025
router.post('/', async (req, res) => {
  const key = req.headers['x-seed-key'];
  if (key !== 'digiagri_seed_2025') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    await User.deleteMany({});
    await Scheme.deleteMany({});
    await Complaint.deleteMany({});

    const admin = await User.create({
      name: 'Rajesh Sharma', email: 'admin@agri.com', password: 'admin123',
      role: 'admin', phone: '+91 9810012345', location: 'New Delhi',
    });

    const farmers = await Promise.all([
      User.create({ name: 'Ravi Kumar', email: 'farmer@agri.com', password: 'farmer123', role: 'farmer', phone: '+91 9876543210', location: 'Ludhiana, Punjab' }),
      User.create({ name: 'Sunita Devi', email: 'sunita@agri.com', password: 'farmer123', role: 'farmer', phone: '+91 9823456789', location: 'Nashik, Maharashtra' }),
      User.create({ name: 'Mohan Patel', email: 'mohan@agri.com', password: 'farmer123', role: 'farmer', phone: '+91 9745678901', location: 'Anand, Gujarat' }),
    ]);

    await Scheme.insertMany([
      {
        title: 'PM-KISAN Samman Nidhi Yojana',
        description: 'Direct income support of ₹6,000 per year to all eligible landholding farmer families across India.',
        eligibility: 'All Indian farmer families owning cultivable land. Exclusions: Income tax payers, govt employees with pension above ₹10,000.',
        benefits: '₹6,000 per year via DBT in 3 instalments of ₹2,000 every 4 months.',
        deadline: new Date('2026-03-31'), isActive: true,
      },
      {
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'Crop insurance scheme providing financial protection against crop loss due to natural calamities, pests, and diseases.',
        eligibility: 'All farmers growing notified crops. Requires Aadhaar, bank account, and land records.',
        benefits: 'Farmers pay only 2% premium for Kharif, 1.5% for Rabi. Government subsidises the rest.',
        deadline: new Date('2025-07-31'), isActive: true,
      },
      {
        title: 'Kisan Credit Card (KCC) Scheme',
        description: 'Provides timely and affordable institutional credit to farmers for crop cultivation and allied activities.',
        eligibility: 'All farmers including small, marginal, tenant farmers and SHGs/JLGs.',
        benefits: 'Loans up to ₹5 lakh at 7% interest (effective 4% with timely repayment).',
        deadline: new Date('2025-12-31'), isActive: true,
      },
      {
        title: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
        description: 'Aims to achieve Har Khet Ko Pani and More Crop Per Drop through improved irrigation.',
        eligibility: 'All farmers including individual landowners, SHGs, cooperatives, and tenant farmers.',
        benefits: '55% subsidy for small/marginal farmers on drip and sprinkler irrigation systems.',
        deadline: new Date('2026-03-31'), isActive: true,
      },
      {
        title: 'Soil Health Card (SHC) Scheme',
        description: 'Provides farmers with soil nutrient status report and crop-wise fertilizer recommendations.',
        eligibility: 'All farmers with agricultural land. Free soil testing with no income restriction.',
        benefits: 'Free testing for 12 parameters. Reduces input costs by 8-10% through optimised fertilizer use.',
        deadline: new Date('2026-06-30'), isActive: true,
      },
      {
        title: 'National Agriculture Market (eNAM)',
        description: 'Pan-India electronic trading portal networking APMC mandis for unified national market.',
        eligibility: 'All farmers registered with local APMC mandi. Requires Aadhaar and bank account.',
        benefits: 'Access to buyers across India. Online payment within 24 hours. No commission charged.',
        deadline: new Date('2026-12-31'), isActive: true,
      },
      {
        title: 'PM Kisan Maandhan Yojana (PM-KMY)',
        description: 'Voluntary pension scheme for small and marginal farmers aged 18-40 years.',
        eligibility: 'Small and marginal farmers (land up to 2 hectares) aged 18-40. Must not be income tax payer.',
        benefits: 'Monthly pension of ₹3,000 after age 60. Government matches monthly contribution.',
        deadline: new Date('2025-09-30'), isActive: true,
      },
      {
        title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
        description: 'Promotes organic farming through cluster-based approach with PGS-India certification.',
        eligibility: 'All farmers willing to adopt organic farming in clusters of 50 acres.',
        benefits: '₹50,000 per hectare over 3 years. Free PGS-India certification and market linkage.',
        deadline: new Date('2025-12-31'), isActive: true,
      },
    ]);

    await Complaint.insertMany([
      {
        user: farmers[0]._id,
        title: 'Severe aphid infestation on wheat crop',
        description: 'My 3-acre wheat field in Ludhiana has been severely affected by aphid infestation for the past 2 weeks.',
        category: 'pest', status: 'in-progress',
        adminResponse: 'Field officer assigned. Try Thiamethoxam 25% WG at 100g/acre.',
      },
      {
        user: farmers[1]._id,
        title: 'Drip irrigation subsidy not processed',
        description: 'Applied for PMKSY drip irrigation subsidy 3 months ago. Amount not credited yet.',
        category: 'irrigation', status: 'pending', adminResponse: '',
      },
      {
        user: farmers[2]._id,
        title: 'PMFBY claim rejected without reason',
        description: 'Kharif 2024 mustard crop suffered 70% loss due to hailstorm. Claim rejected citing insufficient evidence.',
        category: 'other', status: 'in-progress',
        adminResponse: 'Case escalated to District Agriculture Officer. Attend DGRC meeting on 5th April.',
      },
    ]);

    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: { users: farmers.length + 1, schemes: 8, complaints: 3 },
      credentials: { admin: 'admin@agri.com / admin123', farmer: 'farmer@agri.com / farmer123' },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

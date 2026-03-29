require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Scheme = require('./models/Scheme');
const Complaint = require('./models/Complaint');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-agriculture';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Drop existing data for fresh seed
  await User.deleteMany({});
  await Scheme.deleteMany({});
  await Complaint.deleteMany({});
  console.log('Cleared existing data');

  // ── USERS ──────────────────────────────────────────────────────────────────
  const admin = await User.create({
    name: 'Rajesh Sharma',
    email: 'admin@agri.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 9810012345',
    location: 'New Delhi',
  });

  const farmers = await User.insertMany([
    { name: 'Ravi Kumar', email: 'farmer@agri.com', password: 'farmer123', role: 'farmer', phone: '+91 9876543210', location: 'Ludhiana, Punjab' },
    { name: 'Sunita Devi', email: 'sunita@agri.com', password: 'farmer123', role: 'farmer', phone: '+91 9823456789', location: 'Nashik, Maharashtra' },
    { name: 'Mohan Patel', email: 'mohan@agri.com', password: 'farmer123', role: 'farmer', phone: '+91 9745678901', location: 'Anand, Gujarat' },
    { name: 'Lakshmi Reddy', email: 'lakshmi@agri.com', password: 'farmer123', role: 'farmer', phone: '+91 9654321098', location: 'Guntur, Andhra Pradesh' },
    { name: 'Arjun Singh', email: 'arjun@agri.com', password: 'farmer123', role: 'farmer', phone: '+91 9567890123', location: 'Jaipur, Rajasthan' },
  ]);
  console.log(`Created ${farmers.length + 1} users`);

  // ── GOVERNMENT SCHEMES (Real 2025 data) ────────────────────────────────────
  const schemes = await Scheme.insertMany([
    {
      title: 'PM-KISAN Samman Nidhi Yojana',
      description: 'A Central Government scheme providing direct income support of ₹6,000 per year to all eligible landholding farmer families across India. Launched in February 2019, the scheme has disbursed over ₹3.46 lakh crore to approximately 9.8 crore farmers in 19 instalments as of February 2025. The 20th instalment is expected in mid-2025.',
      eligibility: 'All Indian farmer families owning cultivable land. Exclusions: Income tax payers, constitutional post holders, serving/retired government employees with monthly pension above ₹10,000, professionals like doctors/engineers/lawyers/CAs, and farmers with land above 2 hectares in some states.',
      benefits: '₹6,000 per year transferred directly to Aadhaar-seeded bank account via DBT in 3 equal instalments of ₹2,000 every 4 months (April–July, August–November, December–March).',
      deadline: new Date('2026-03-31'),
      isActive: true,
    },
    {
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'India\'s flagship crop insurance scheme launched in 2016, providing comprehensive financial protection to farmers against crop loss due to natural calamities (drought, flood, hailstorm, cyclone), pests, and diseases. Covers pre-sowing to post-harvest losses. Over 5.5 crore farmer applications are processed annually.',
      eligibility: 'All farmers growing notified crops in notified areas — including loanee farmers (mandatory) and non-loanee farmers (voluntary). Requires valid Aadhaar card, bank account, and land records (Khasra/Khatauni). Tenant and sharecropper farmers are also eligible.',
      benefits: 'Farmers pay only 2% premium for Kharif crops, 1.5% for Rabi crops, and 5% for commercial/horticultural crops. Government subsidises the remaining premium. Full sum insured paid for total crop loss. Post-harvest losses covered for 14 days after harvest.',
      deadline: new Date('2025-07-31'),
      isActive: true,
    },
    {
      title: 'Kisan Credit Card (KCC) Scheme',
      description: 'Introduced in 1998 and revamped in 2019, the KCC scheme provides timely, affordable, and collateral-free institutional credit to farmers for crop cultivation, post-harvest expenses, maintenance of farm assets, and allied activities. In Union Budget 2025-26, the loan limit was enhanced from ₹3 lakh to ₹5 lakh under the Modified Interest Subvention Scheme (MISS).',
      eligibility: 'All farmers including small, marginal, tenant farmers, sharecroppers, oral lessees, and Self Help Groups (SHGs)/Joint Liability Groups (JLGs). Must have a valid bank account and land records. No collateral required up to ₹2 lakh per borrower.',
      benefits: 'Short-term crop loans up to ₹5 lakh at 7% interest per annum (effective rate 4% with timely repayment incentive of 3%). Covers crop cultivation, post-harvest, farm maintenance, and allied activities including dairy, animal husbandry, and fisheries.',
      deadline: new Date('2025-12-31'),
      isActive: true,
    },
    {
      title: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
      description: 'Launched on July 1, 2015, PMKSY aims to achieve "Har Khet Ko Pani" (water to every field) and "More Crop Per Drop" by expanding irrigated area, improving water use efficiency, and introducing sustainable water conservation practices. The scheme integrates AIBP, IWMP, and On-Farm Water Management into a single programme.',
      eligibility: 'All categories of farmers including individual landowners, members of SHGs, trusts, cooperative societies, and farmer producer groups. Tenant farmers cultivating leased land are also eligible. Indian citizenship required. Priority given to small and marginal farmers.',
      benefits: 'Subsidy of 55% for small/marginal farmers and 45% for other farmers on micro-irrigation equipment (drip and sprinkler systems). Assured irrigation through watershed development, groundwater development, and surface water management. Free technical guidance from Krishi Vigyan Kendras.',
      deadline: new Date('2026-03-31'),
      isActive: true,
    },
    {
      title: 'Soil Health Card (SHC) Scheme',
      description: 'Launched in February 2015, the Soil Health Card scheme provides farmers with a printed report of their soil\'s nutrient status along with crop-wise fertilizer recommendations to improve soil health and productivity. Cards are issued every 2 years. Over 23 crore soil health cards have been distributed across India.',
      eligibility: 'All farmers with agricultural land across India. Soil testing is done free of cost by state government laboratories. Farmers need to provide a soil sample from their field (0–20 cm depth). No income or land size restriction.',
      benefits: 'Free soil testing for 12 parameters including N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, and B. Personalised crop-wise fertilizer and micronutrient recommendations. Helps reduce input costs by 8–10% through optimised fertilizer use. Available in local language.',
      deadline: new Date('2026-06-30'),
      isActive: true,
    },
    {
      title: 'National Agriculture Market (eNAM)',
      description: 'eNAM is a pan-India electronic trading portal launched in April 2016 that networks existing APMC mandis to create a unified national market for agricultural commodities. It enables farmers to sell produce online to buyers across India, ensuring better price discovery and reducing intermediaries. Over 1,000 mandis across 18 states are integrated.',
      eligibility: 'All farmers registered with their local APMC mandi. Requires Aadhaar card, bank account, and mandi registration. Farmers can register online at enam.gov.in or through their nearest mandi office. Traders and FPOs can also register.',
      benefits: 'Access to buyers across India for better price realisation. Online payment directly to bank account within 24 hours. Transparent auction process with real-time price information. Reduced transportation and storage costs. Quality testing facilities at mandi. No commission charged to farmers.',
      deadline: new Date('2026-12-31'),
      isActive: true,
    },
    {
      title: 'PM Kisan Maandhan Yojana (PM-KMY)',
      description: 'A voluntary and contributory pension scheme launched in September 2019 for small and marginal farmers aged 18–40 years. The scheme ensures a minimum monthly pension of ₹3,000 after the age of 60. The Government of India contributes an equal matching amount to the farmer\'s contribution into the Pension Fund managed by LIC.',
      eligibility: 'Small and marginal farmers (land holding up to 2 hectares) aged 18–40 years. Must not be covered under any other social security scheme like NPS, ESIC, EPFO. Must not be an income tax payer. Aadhaar card and savings bank account/Jan Dhan account required.',
      benefits: 'Monthly pension of ₹3,000 after age 60. Government matches farmer\'s monthly contribution (₹55–₹200 depending on entry age). Family pension of 50% (₹1,500/month) to spouse on farmer\'s death. If farmer dies before 60, spouse can continue or exit with interest.',
      deadline: new Date('2025-09-30'),
      isActive: true,
    },
    {
      title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
      description: 'Launched in 2015, PKVY promotes organic farming in India through a cluster-based approach. Farmers are encouraged to adopt organic farming practices, reduce chemical inputs, and get their produce certified under PGS-India (Participatory Guarantee System). The scheme supports formation of 50-acre clusters of farmers.',
      eligibility: 'All farmers willing to adopt organic farming. Farmers must form clusters of at least 50 acres. Priority given to farmers in hilly, tribal, and rain-fed areas. Farmers must commit to 3-year organic conversion period. No minimum land holding requirement.',
      benefits: '₹50,000 per hectare over 3 years (₹31,000 for organic inputs, ₹8,800 for value addition and distribution, ₹3,000 for cluster formation, ₹7,200 for certification). Free PGS-India organic certification. Market linkage support and premium price for organic produce.',
      deadline: new Date('2025-12-31'),
      isActive: true,
    },
  ]);
  console.log(`Created ${schemes.length} government schemes`);

  // ── SAMPLE COMPLAINTS ───────────────────────────────────────────────────────
  await Complaint.insertMany([
    {
      user: farmers[0]._id,
      title: 'Severe aphid infestation on wheat crop',
      description: 'My 3-acre wheat field in Ludhiana has been severely affected by aphid infestation for the past 2 weeks. The crop is at the tillering stage and the infestation is spreading rapidly. I have tried spraying Imidacloprid 17.8% SL but the problem persists. Requesting urgent guidance from the agriculture department.',
      category: 'pest',
      status: 'in-progress',
      adminResponse: 'We have assigned a field officer to visit your farm on 2nd April. In the meantime, please try spraying Thiamethoxam 25% WG at 100g/acre mixed with water. Avoid spraying during flowering stage.',
    },
    {
      user: farmers[1]._id,
      title: 'Drip irrigation subsidy application not processed',
      description: 'I applied for drip irrigation subsidy under PMKSY scheme 3 months ago for my 2-acre onion farm in Nashik. My application number is PMKSY-MH-2024-08821. Despite multiple follow-ups at the district agriculture office, the subsidy amount of ₹55,000 has not been credited to my account. Please help resolve this urgently as the irrigation season has started.',
      category: 'irrigation',
      status: 'pending',
      adminResponse: '',
    },
    {
      user: farmers[2]._id,
      title: 'Soil test report shows severe nitrogen deficiency',
      description: 'My Soil Health Card report (Card No: GJ-AN-2024-44521) shows severe nitrogen deficiency (N: 142 kg/ha, very low) and moderate phosphorus deficiency in my 5-acre cotton field in Anand district. The recommended dose is 120 kg N/ha but I am unsure about the split application schedule and which fertilizer combination to use for black soil. Please advise.',
      category: 'soil',
      status: 'resolved',
      adminResponse: 'For black soil cotton: Apply 40 kg N/ha as basal dose using DAP (100 kg/acre) + MOP (25 kg/acre) at sowing. Apply remaining 80 kg N/ha in 2 splits — first at 30 DAS and second at 60 DAS using Urea. Avoid over-irrigation as black soil retains moisture well.',
    },
    {
      user: farmers[3]._id,
      title: 'Tractor rental scheme — equipment not available',
      description: 'I registered under the Custom Hiring Centre scheme in Guntur district to rent a power tiller for my 4-acre paddy field. The CHC centre (ID: AP-GNT-CHC-112) confirmed availability but when I went to collect the equipment on the scheduled date, it was not available. This has delayed my land preparation by 10 days and the transplanting window is closing.',
      category: 'equipment',
      status: 'pending',
      adminResponse: '',
    },
    {
      user: farmers[4]._id,
      title: 'PMFBY claim rejected without proper reason',
      description: 'My PMFBY crop insurance claim for Kharif 2024 mustard crop was rejected (Policy No: PMFBY-RJ-2024-KH-78821). My 6-acre mustard crop in Jaipur district suffered approximately 70% yield loss due to unseasonal hailstorm in October 2024. The insurance company cited "insufficient evidence" but I have submitted all required documents including photographs, village patwari certificate, and bank records. Please help me appeal this decision.',
      category: 'other',
      status: 'in-progress',
      adminResponse: 'We have escalated your case to the District Agriculture Officer and the insurance company nodal officer. Please submit a formal appeal at the District Grievance Redressal Committee (DGRC) meeting scheduled on 5th April 2026. Bring original land records, Khasra, and all insurance documents.',
    },
  ]);
  console.log('Created 5 sample complaints');

  console.log('\n✅ Seed complete!\n');
  console.log('─────────────────────────────────────────');
  console.log('  Login Credentials');
  console.log('─────────────────────────────────────────');
  console.log('  ADMIN:  admin@agri.com   / admin123');
  console.log('  FARMER: farmer@agri.com  / farmer123');
  console.log('  FARMER: sunita@agri.com  / farmer123');
  console.log('  FARMER: mohan@agri.com   / farmer123');
  console.log('─────────────────────────────────────────\n');

  await mongoose.disconnect();
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });

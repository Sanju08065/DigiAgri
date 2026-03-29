/**
 * Crop recommendation engine based on real Indian agricultural data.
 * Sources: ICAR guidelines, state agriculture department recommendations,
 * and APEDA crop production data.
 */

const cropDatabase = [
  {
    crop: 'Rice (Paddy)',
    scientificName: 'Oryza sativa',
    soilTypes: ['alluvial', 'clay', 'loamy'],
    seasons: ['kharif', 'zaid'],
    regions: ['north', 'east', 'south', 'northeast'],
    states: ['West Bengal', 'Uttar Pradesh', 'Punjab', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha', 'Bihar', 'Assam'],
    waterRequirement: 'High (1200–2000 mm)',
    temperature: '20–35°C',
    duration: '90–150 days',
    msp2025: '₹2,300/quintal (Common), ₹2,320/quintal (Grade A)',
    yield: '20–25 quintals/acre',
    description: 'Staple food crop of India. Kharif rice is sown in June–July and harvested in October–November. Requires standing water during vegetative stage.',
    tips: 'Use SRI (System of Rice Intensification) method to reduce water use by 30–50%. Recommended varieties: Pusa Basmati 1121, MTU 7029, Swarna.',
  },
  {
    crop: 'Wheat',
    scientificName: 'Triticum aestivum',
    soilTypes: ['alluvial', 'loamy', 'clay'],
    seasons: ['rabi'],
    regions: ['north', 'central', 'west'],
    states: ['Uttar Pradesh', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan', 'Bihar'],
    waterRequirement: 'Medium (450–650 mm)',
    temperature: '10–25°C',
    duration: '100–150 days',
    msp2025: '₹2,425/quintal',
    yield: '18–22 quintals/acre',
    description: 'Second most important food crop. Sown in October–December and harvested in March–April. Requires cool weather during grain filling.',
    tips: 'Sow at optimal time (1–25 November in North India). Use HD-3086, GW-322, or PBW-343 varieties. Apply 120 kg N/ha in 3 splits.',
  },
  {
    crop: 'Cotton (Kapas)',
    scientificName: 'Gossypium hirsutum',
    soilTypes: ['black', 'alluvial', 'red'],
    seasons: ['kharif'],
    regions: ['west', 'central', 'south'],
    states: ['Gujarat', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Karnataka', 'Rajasthan', 'Madhya Pradesh'],
    waterRequirement: 'Medium (700–1200 mm)',
    temperature: '21–35°C',
    duration: '150–180 days',
    msp2025: '₹7,121/quintal (Medium Staple), ₹7,521/quintal (Long Staple)',
    yield: '8–12 quintals/acre (seed cotton)',
    description: 'Major cash crop known as "White Gold". Black (Regur) soil of Deccan plateau is ideal. Bt Cotton hybrids dominate cultivation.',
    tips: 'Use Bt Cotton hybrids (Bollgard II). Maintain 67×67 cm spacing. Apply 150:75:75 NPK kg/ha. Monitor for pink bollworm and whitefly.',
  },
  {
    crop: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    soilTypes: ['alluvial', 'loamy', 'black'],
    seasons: ['kharif', 'year-round'],
    regions: ['north', 'south', 'west'],
    states: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Bihar', 'Gujarat'],
    waterRequirement: 'Very High (1500–2500 mm)',
    temperature: '20–35°C',
    duration: '10–18 months',
    msp2025: '₹340/quintal (FRP 2024–25)',
    yield: '300–400 quintals/acre',
    description: 'Primary source of sugar and ethanol. UP is the largest producer. Ratoon cropping is common for 2–3 cycles after plant crop.',
    tips: 'Use trench planting method. Recommended varieties: Co-0238 (North), Co-86032 (South). Apply 250:60:60 NPK kg/ha. Intercrop with potato or garlic.',
  },
  {
    crop: 'Maize (Corn)',
    scientificName: 'Zea mays',
    soilTypes: ['alluvial', 'loamy', 'red'],
    seasons: ['kharif', 'rabi', 'zaid'],
    regions: ['north', 'south', 'central', 'east'],
    states: ['Karnataka', 'Andhra Pradesh', 'Telangana', 'Rajasthan', 'Madhya Pradesh', 'Bihar', 'Uttar Pradesh'],
    waterRequirement: 'Medium (500–800 mm)',
    temperature: '18–32°C',
    duration: '80–110 days',
    msp2025: '₹2,225/quintal',
    yield: '20–30 quintals/acre',
    description: 'Versatile crop used for food, feed, and industrial purposes. Kharif maize is the main season. Rabi maize is grown in Bihar and AP.',
    tips: 'Use hybrid varieties (DKC 9144, P3522). Maintain 60×20 cm spacing. Apply 120:60:40 NPK kg/ha. Critical irrigation at knee-high, tasseling, and grain filling stages.',
  },
  {
    crop: 'Soybean',
    scientificName: 'Glycine max',
    soilTypes: ['black', 'alluvial', 'loamy'],
    seasons: ['kharif'],
    regions: ['central', 'west'],
    states: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Telangana'],
    waterRequirement: 'Medium (450–700 mm)',
    temperature: '20–30°C',
    duration: '90–120 days',
    msp2025: '₹4,892/quintal',
    yield: '8–12 quintals/acre',
    description: 'India\'s most important oilseed crop. MP and Maharashtra together account for 85% of production. Also called "Golden Bean" for its nutritional value.',
    tips: 'Treat seeds with Rhizobium + PSB culture before sowing. Use JS-335 or MACS-450 varieties. Sow at 45×5 cm spacing. Avoid waterlogging.',
  },
  {
    crop: 'Groundnut (Peanut)',
    scientificName: 'Arachis hypogaea',
    soilTypes: ['red', 'sandy', 'alluvial'],
    seasons: ['kharif', 'rabi'],
    regions: ['south', 'west', 'central'],
    states: ['Gujarat', 'Rajasthan', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Madhya Pradesh'],
    waterRequirement: 'Low-Medium (500–700 mm)',
    temperature: '25–30°C',
    duration: '90–130 days',
    msp2025: '₹6,783/quintal',
    yield: '8–15 quintals/acre',
    description: 'Major oilseed and food crop. Gujarat is the largest producer. Red and sandy loam soils with good drainage are ideal.',
    tips: 'Use bold-seeded varieties (GG-20, TG-37A). Apply gypsum at 200 kg/acre at pegging stage for calcium. Avoid excess nitrogen. Irrigate at flowering and pegging.',
  },
  {
    crop: 'Mustard (Rapeseed)',
    scientificName: 'Brassica juncea',
    soilTypes: ['alluvial', 'loamy', 'sandy'],
    seasons: ['rabi'],
    regions: ['north', 'central', 'west'],
    states: ['Rajasthan', 'Uttar Pradesh', 'Haryana', 'Madhya Pradesh', 'West Bengal', 'Gujarat'],
    waterRequirement: 'Low (250–400 mm)',
    temperature: '10–25°C',
    duration: '90–120 days',
    msp2025: '₹5,950/quintal',
    yield: '6–10 quintals/acre',
    description: 'Most important Rabi oilseed crop. Rajasthan accounts for 46% of India\'s mustard production. Tolerates mild frost and drought.',
    tips: 'Sow in October–November. Use Pusa Bold, RH-749, or Varuna varieties. Apply 80:40:40 NPK kg/ha. One irrigation at branching stage is critical.',
  },
  {
    crop: 'Chickpea (Gram)',
    scientificName: 'Cicer arietinum',
    soilTypes: ['alluvial', 'black', 'loamy'],
    seasons: ['rabi'],
    regions: ['central', 'north', 'west'],
    states: ['Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Uttar Pradesh', 'Andhra Pradesh', 'Karnataka'],
    waterRequirement: 'Low (300–400 mm)',
    temperature: '15–25°C',
    duration: '90–120 days',
    msp2025: '₹5,440/quintal',
    yield: '6–10 quintals/acre',
    description: 'Most important pulse crop of India. MP is the largest producer. Desi (small, dark) and Kabuli (large, white) are two main types.',
    tips: 'Treat seeds with Rhizobium culture. Use JG-11, Vihar, or KAK-2 varieties. Sow at 30×10 cm spacing. Avoid excess moisture — one pre-sowing irrigation is sufficient.',
  },
  {
    crop: 'Tur/Arhar (Pigeon Pea)',
    scientificName: 'Cajanus cajan',
    soilTypes: ['red', 'alluvial', 'black'],
    seasons: ['kharif'],
    regions: ['central', 'south', 'west'],
    states: ['Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Uttar Pradesh', 'Andhra Pradesh', 'Gujarat'],
    waterRequirement: 'Low-Medium (600–1000 mm)',
    temperature: '20–35°C',
    duration: '120–180 days',
    msp2025: '₹7,550/quintal',
    yield: '5–8 quintals/acre',
    description: 'Second most important pulse crop. Maharashtra is the largest producer. Drought-tolerant and nitrogen-fixing crop ideal for dryland farming.',
    tips: 'Use ICPL-87119 (Asha) or Maruti varieties. Sow at 60×20 cm spacing. Intercrop with sorghum or cotton. Apply 20:50:20 NPK kg/ha as basal dose.',
  },
  {
    crop: 'Potato',
    scientificName: 'Solanum tuberosum',
    soilTypes: ['alluvial', 'loamy', 'sandy'],
    seasons: ['rabi'],
    regions: ['north', 'east', 'central'],
    states: ['Uttar Pradesh', 'West Bengal', 'Bihar', 'Gujarat', 'Madhya Pradesh', 'Punjab'],
    waterRequirement: 'Medium (500–700 mm)',
    temperature: '15–25°C',
    duration: '70–120 days',
    msp2025: 'No MSP (market price ₹800–2000/quintal)',
    yield: '80–120 quintals/acre',
    description: 'Most important vegetable crop. UP produces 35% of India\'s potato. Requires well-drained, loose, fertile soil for good tuber development.',
    tips: 'Use certified seed tubers (Kufri Jyoti, Kufri Pukhraj). Plant at 60×20 cm spacing. Apply 180:80:100 NPK kg/ha. Earth up at 30 DAS. Irrigate every 7–10 days.',
  },
  {
    crop: 'Onion',
    scientificName: 'Allium cepa',
    soilTypes: ['alluvial', 'red', 'loamy'],
    seasons: ['rabi', 'kharif'],
    regions: ['west', 'south', 'central'],
    states: ['Maharashtra', 'Madhya Pradesh', 'Karnataka', 'Gujarat', 'Rajasthan', 'Bihar'],
    waterRequirement: 'Medium (350–550 mm)',
    temperature: '13–24°C',
    duration: '90–120 days',
    msp2025: 'No MSP (market price ₹500–3000/quintal)',
    yield: '80–120 quintals/acre',
    description: 'India is the world\'s second largest onion producer. Nashik (Maharashtra) is the onion capital. Rabi onion (Oct–Nov sowing) has better storage quality.',
    tips: 'Use Agrifound Light Red or N-2-4-1 varieties. Transplant 6-week-old seedlings. Apply 100:50:50 NPK kg/ha. Irrigate every 7–10 days. Stop irrigation 10 days before harvest.',
  },
  {
    crop: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    soilTypes: ['alluvial', 'red', 'loamy'],
    seasons: ['kharif', 'rabi', 'zaid'],
    regions: ['south', 'west', 'north', 'central'],
    states: ['Andhra Pradesh', 'Madhya Pradesh', 'Karnataka', 'Gujarat', 'Odisha', 'West Bengal'],
    waterRequirement: 'Medium (400–600 mm)',
    temperature: '20–27°C',
    duration: '60–90 days',
    msp2025: 'No MSP (market price ₹500–5000/quintal)',
    yield: '120–200 quintals/acre',
    description: 'Most widely grown vegetable. AP and MP are top producers. Highly sensitive to frost and waterlogging. Drip irrigation with fertigation gives best results.',
    tips: 'Use hybrid varieties (Arka Rakshak, Pusa Hybrid-1). Transplant 25-day-old seedlings. Apply 120:60:60 NPK kg/ha. Stake plants at 30 cm height. Monitor for early blight and leaf curl virus.',
  },
  {
    crop: 'Jute',
    scientificName: 'Corchorus olitorius',
    soilTypes: ['alluvial', 'clay'],
    seasons: ['kharif'],
    regions: ['east', 'northeast'],
    states: ['West Bengal', 'Bihar', 'Assam', 'Odisha', 'Meghalaya'],
    waterRequirement: 'High (1000–2000 mm)',
    temperature: '24–37°C',
    duration: '100–120 days',
    msp2025: '₹5,335/quintal',
    yield: '12–18 quintals/acre (dry fibre)',
    description: 'Natural fibre crop called "Golden Fibre". West Bengal produces 75% of India\'s jute. Requires warm, humid climate and alluvial soil with good water retention.',
    tips: 'Sow in March–April. Use JRO-524 or JRO-8432 varieties. Broadcast at 5–7 kg seed/acre. Retting in clean water for 15–20 days. Harvest at 50% flowering stage.',
  },
  {
    crop: 'Bajra (Pearl Millet)',
    scientificName: 'Pennisetum glaucum',
    soilTypes: ['sandy', 'red', 'alluvial'],
    seasons: ['kharif'],
    regions: ['west', 'central', 'south'],
    states: ['Rajasthan', 'Uttar Pradesh', 'Haryana', 'Gujarat', 'Madhya Pradesh', 'Maharashtra'],
    waterRequirement: 'Low (200–400 mm)',
    temperature: '25–35°C',
    duration: '60–90 days',
    msp2025: '₹2,625/quintal',
    yield: '8–15 quintals/acre',
    description: 'Most drought-tolerant cereal crop. Rajasthan accounts for 40% of production. Ideal for arid and semi-arid regions with poor sandy soils.',
    tips: 'Use hybrid varieties (HHB-67, GHB-558). Sow at 45×15 cm spacing. Apply 60:30:30 NPK kg/ha. One irrigation at panicle initiation stage is critical. Harvest when 80% grains are hard.',
  },
  {
    crop: 'Jowar (Sorghum)',
    scientificName: 'Sorghum bicolor',
    soilTypes: ['black', 'alluvial', 'red'],
    seasons: ['kharif', 'rabi'],
    regions: ['central', 'south', 'west'],
    states: ['Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Tamil Nadu'],
    waterRequirement: 'Low-Medium (400–600 mm)',
    temperature: '25–32°C',
    duration: '90–120 days',
    msp2025: '₹3,371/quintal',
    yield: '10–18 quintals/acre',
    description: 'Drought-tolerant dual-purpose crop (grain + fodder). Maharashtra is the largest producer. Rabi jowar (Maldandi) is premium quality for human consumption.',
    tips: 'Use CSH-16 (kharif) or M-35-1 (rabi) varieties. Sow at 45×15 cm spacing. Apply 80:40:40 NPK kg/ha. Harvest at dough stage for fodder, hard dough for grain.',
  },
];

exports.recommend = (req, res) => {
  const { soilType, season, region } = req.body;
  if (!soilType || !season || !region) {
    return res.status(400).json({ message: 'soilType, season, and region are required' });
  }

  const soil = soilType.toLowerCase();
  const szn = season.toLowerCase();
  const reg = region.toLowerCase();

  const recommendations = cropDatabase
    .map(c => {
      let score = 0;
      if (c.soilTypes.includes(soil)) score += 3;
      if (c.seasons.includes(szn)) score += 2;
      if (c.regions.includes(reg)) score += 1;
      return { ...c, score };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  res.json(recommendations);
};

exports.getSoilTypes = (req, res) => {
  res.json([
    { value: 'alluvial', label: 'Alluvial Soil', description: 'Found in Indo-Gangetic plains, highly fertile, best for rice, wheat, sugarcane' },
    { value: 'black', label: 'Black Soil (Regur)', description: 'Deccan plateau, high water retention, ideal for cotton, soybean, jowar' },
    { value: 'red', label: 'Red & Yellow Soil', description: 'Peninsular India, good drainage, suitable for groundnut, bajra, pulses' },
    { value: 'loamy', label: 'Loamy Soil', description: 'Mix of sand, silt, clay — most versatile, good for most crops' },
    { value: 'sandy', label: 'Sandy / Arid Soil', description: 'Rajasthan & Gujarat, low water retention, suitable for bajra, groundnut, millet' },
    { value: 'clay', label: 'Clay Soil', description: 'High water retention, suitable for rice, jute in waterlogged areas' },
  ]);
};

exports.getSeasons = (req, res) => {
  res.json([
    { value: 'kharif', label: 'Kharif (Monsoon)', period: 'June – October', description: 'Sown with onset of SW monsoon. Crops: Rice, Cotton, Maize, Soybean, Bajra' },
    { value: 'rabi', label: 'Rabi (Winter)', period: 'October – March', description: 'Sown after monsoon retreat. Crops: Wheat, Mustard, Chickpea, Potato, Onion' },
    { value: 'zaid', label: 'Zaid (Summer)', period: 'March – June', description: 'Short summer season. Crops: Watermelon, Cucumber, Fodder crops, Moong' },
    { value: 'year-round', label: 'Year-Round', period: 'All seasons', description: 'Crops grown throughout the year with irrigation. Crops: Sugarcane, Banana, Vegetables' },
  ]);
};

exports.getRegions = (req, res) => {
  res.json([
    { value: 'north', label: 'North India', states: 'Punjab, Haryana, UP, Uttarakhand, HP, J&K', description: 'Indo-Gangetic plains, alluvial soil, wheat-rice belt' },
    { value: 'south', label: 'South India', states: 'AP, Telangana, Karnataka, Tamil Nadu, Kerala', description: 'Diverse climate, red & alluvial soil, rice, cotton, spices' },
    { value: 'east', label: 'East India', states: 'West Bengal, Bihar, Odisha, Jharkhand, Assam', description: 'High rainfall, alluvial & clay soil, rice, jute, tea' },
    { value: 'west', label: 'West India', states: 'Gujarat, Rajasthan, Maharashtra (western)', description: 'Arid to semi-arid, black & sandy soil, cotton, groundnut, bajra' },
    { value: 'central', label: 'Central India', states: 'Madhya Pradesh, Chhattisgarh, Maharashtra (Vidarbha)', description: 'Black soil plateau, soybean, cotton, jowar, chickpea' },
    { value: 'northeast', label: 'Northeast India', states: 'Assam, Meghalaya, Manipur, Nagaland, Tripura', description: 'High rainfall, hilly terrain, rice, jute, tea, spices' },
  ]);
};

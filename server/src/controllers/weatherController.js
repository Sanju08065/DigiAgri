const axios = require('axios');

const WMO_CODES = {
  0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
  45: 'Foggy', 48: 'Icy Fog',
  51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
  71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
  80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Severe Thunderstorm',
};

const ADVISORY = {
  0: 'Clear skies — ideal for harvesting and field operations.',
  1: 'Good conditions for spraying pesticides and fertilizers.',
  2: 'Suitable for most farm activities. Monitor soil moisture.',
  3: 'Overcast — good for transplanting seedlings to reduce transplant shock.',
  45: 'Foggy — avoid spraying. Check for fungal disease risk.',
  51: 'Light drizzle — delay spraying operations.',
  61: 'Light rain — good for dry crops. Delay harvesting.',
  63: 'Rain — avoid field operations. Check drainage.',
  65: 'Heavy rain — risk of waterlogging. Ensure proper drainage.',
  80: 'Light showers — monitor for disease. Delay spraying.',
  81: 'Showers — avoid field operations.',
  95: 'Thunderstorm — stay indoors. Secure farm equipment.',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

exports.getWeather = async (req, res) => {
  // Extract just the city name — "Warangal, Telangana" → "Warangal"
  const rawLocation = req.query.location || 'New Delhi';
  const cityName = rawLocation.split(',')[0].trim();

  try {
    // Step 1: Geocode city → lat/lon
    const geoRes = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name: cityName, count: 5, language: 'en', format: 'json' },
      timeout: 8000,
    });

    let lat, lon, displayName, country;

    if (geoRes.data.results && geoRes.data.results.length > 0) {
      // Prefer India results if multiple matches
      const results = geoRes.data.results;
      const indiaResult = results.find(r => r.country_code === 'IN') || results[0];
      lat = indiaResult.latitude;
      lon = indiaResult.longitude;
      displayName = indiaResult.name;
      country = indiaResult.admin1 || indiaResult.country; // state name or country
    } else {
      // Hard fallback to New Delhi
      lat = 28.6139; lon = 77.2090;
      displayName = 'New Delhi'; country = 'Delhi';
    }

    // Step 2: Fetch real weather
    const weatherRes = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
        timezone: 'auto',
        forecast_days: 7,
      },
      timeout: 8000,
    });

    const cur = weatherRes.data.current;
    const daily = weatherRes.data.daily;
    const wmoCode = cur.weather_code;

    const forecast = daily.time.slice(1, 6).map((dateStr, i) => {
      const d = new Date(dateStr);
      return {
        day: DAYS[d.getDay()],
        temp: Math.round((daily.temperature_2m_max[i + 1] + daily.temperature_2m_min[i + 1]) / 2),
        tempMax: Math.round(daily.temperature_2m_max[i + 1]),
        tempMin: Math.round(daily.temperature_2m_min[i + 1]),
        condition: WMO_CODES[daily.weather_code[i + 1]] || 'Clear',
        precipitation: Math.round(daily.precipitation_sum[i + 1] || 0),
      };
    });

    res.json({
      location: `${displayName}, ${country}`,
      temperature: Math.round(cur.temperature_2m),
      feelsLike: Math.round(cur.apparent_temperature),
      humidity: cur.relative_humidity_2m,
      windSpeed: Math.round(cur.wind_speed_10m),
      precipitation: cur.precipitation || 0,
      condition: WMO_CODES[wmoCode] || 'Clear',
      forecast,
      advisory: ADVISORY[wmoCode] || 'Monitor weather conditions before farm operations.',
    });

  } catch (err) {
    console.error('Weather fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch weather', error: err.message });
  }
};
